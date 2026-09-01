import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/es";
import {
  buildBriefReport,
  parseBriefAnswers,
  parseScale,
  recommendRouteFromAnswers,
  validateTextStep,
  type BriefAnswers,
  type BriefReport,
  type BriefStepId,
  type RecommendedRoute,
} from "@/lib/brief";

export const MAX_CHAT_TURNS = 20;
export const MAX_MESSAGE_CHARS = 2000;
export const CONFIDENCE_FLOOR = 0.7;
export type BriefChatMessage = { role: "user" | "agent"; text: string };
export type BriefChatResponse = { fallback: boolean; reply: string | null; answers: Partial<BriefAnswers>; clarifyField: BriefStepId | null; report: BriefReport | null };

const routes = ["keep_current", "adopt_tool", "integrate", "automate", "custom_build", "advisory_sprint"] as const;
const fields = ["problem", "currentProcess", "businessImpact", "scale", "currentTools", "desiredOutcome", "urgency"] as const;
const turnSchema = z.object({
  reply: z.string(),
  slots: z.object({
    problem: z.string().nullable().optional(), currentProcess: z.string().nullable().optional(),
    businessImpact: z.enum(["time", "revenue", "risk", "visibility"]).nullable().optional(),
    scale: z.enum(["small", "medium", "large"]).nullable().optional(),
    currentTools: z.enum(["none", "one", "several"]).nullable().optional(),
    desiredOutcome: z.enum(["clarity", "reduce_manual", "connect_tools", "improve_existing", "new_capability"]).nullable().optional(),
    urgency: z.enum(["now", "this_quarter", "flexible"]).nullable().optional(),
  }).partial(),
  confidence: z.record(z.string(), z.number().min(0).max(1)).default({}),
  recommendedRoute: z.enum(routes),
  routeConfidence: z.number().min(0).max(1),
  clarifyField: z.enum(fields).nullable().default(null),
});
export type AdvisoryTurn = z.infer<typeof turnSchema>;
export function parseAdvisoryTurn(input: unknown) { return turnSchema.safeParse(input); }
export function hasOpenAiKey(): boolean { return Boolean(process.env.OPENAI_API_KEY?.trim()); }
export function countUserTurns(messages: readonly BriefChatMessage[]): number { return messages.filter((message) => message.role === "user").length; }
export function parseChatHistory(input: unknown): BriefChatMessage[] | null {
  if (!Array.isArray(input)) return null;
  const result: BriefChatMessage[] = [];
  for (const item of input) {
    if (!isRecord(item) || (item.role !== "user" && item.role !== "agent") || typeof item.text !== "string") return null;
    const text = item.text.trim();
    if (!text || text.length > MAX_MESSAGE_CHARS) return null;
    result.push({ role: item.role, text });
  }
  return result;
}
export function sanitizePartialAnswers(input: unknown, catalog: Messages): Partial<BriefAnswers> {
  if (!isRecord(input)) return {};
  const result: Partial<BriefAnswers> = {};
  if (typeof input.problem === "string" && validateTextStep("problem", input.problem, catalog) === null) result.problem = input.problem.trim();
  if (typeof input.currentProcess === "string" && validateTextStep("currentProcess", input.currentProcess, catalog) === null) result.currentProcess = input.currentProcess.trim();
  if (input.businessImpact === "time" || input.businessImpact === "revenue" || input.businessImpact === "risk" || input.businessImpact === "visibility") result.businessImpact = input.businessImpact;
  const scale = parseScale(input.scale); if (scale) result.scale = scale;
  if (input.currentTools === "none" || input.currentTools === "one" || input.currentTools === "several") result.currentTools = input.currentTools;
  if (input.desiredOutcome === "clarity" || input.desiredOutcome === "reduce_manual" || input.desiredOutcome === "connect_tools" || input.desiredOutcome === "improve_existing" || input.desiredOutcome === "new_capability") result.desiredOutcome = input.desiredOutcome;
  if (input.urgency === "now" || input.urgency === "this_quarter" || input.urgency === "flexible") result.urgency = input.urgency;
  return result;
}
export function nextIncompleteField(answers: Partial<BriefAnswers>): BriefStepId | null { return fields.find((field) => !answers[field]) ?? null; }
export function resolveRecommendedRoute(route: RecommendedRoute, confidence: number): RecommendedRoute { return confidence < CONFIDENCE_FLOOR ? "advisory_sprint" : route; }
export function selectResponseLanguage(history: readonly BriefChatMessage[], selectedLocale?: Locale): Locale {
  const text = history.filter((message) => message.role === "user").map((message) => message.text.toLowerCase()).join(" ");
  const scores = { en: count(text, /\b(the|and|with|our|need|current|tools|process)\b/g), es: count(text, /\b(el|la|los|con|necesitamos|proceso|herramientas)\b/g), pl: count(text, /\b(i|oraz|z|potrzebujemy|proces|narzÄ™dzia)\b/g) };
  const dominant = (Object.entries(scores) as Array<[Locale, number]>).sort((a, b) => b[1] - a[1])[0];
  return dominant && dominant[1] > 0 ? dominant[0] : selectedLocale ?? "es";
}
export function resolveCompletedBrief(
  answers: Partial<BriefAnswers>,
  catalog: Messages,
  locale: Locale,
  recommendation?: { route: RecommendedRoute; confidence: number },
): BriefReport | null {
  const complete = parseBriefAnswers(answers, catalog);
  if (!complete.ok) return null;
  const route = recommendation
    ? resolveRecommendedRoute(recommendation.route, recommendation.confidence)
    : recommendRouteFromAnswers(complete.answers);
  return buildBriefReport(complete.answers, route, catalog, locale);
}

export function buildBriefAgentSystemPrompt(catalog: Messages, language: Locale): string {
  return [
    `You are Neora Labs' technology advisory agent. Reply in ${language}.`,
    "Collect business context in this order: problem, currentProcess, businessImpact, scale, currentTools, desiredOutcome, urgency. Do not ask for email before the report.",
    "Select exactly one recommendedRoute. If route confidence is below 0.7, choose advisory_sprint. Never output prices, investment or timelines: deterministic server logic does that.",
    "Use only the schema IDs. Be concise and ask for the next missing field.",
  ].join("\n");
}
export async function runBriefChatTurn(options: { locale: Locale; history: BriefChatMessage[]; answers: Partial<BriefAnswers>; catalog: Messages }): Promise<BriefChatResponse> {
  const { locale, history, answers, catalog } = options;
  if (!hasOpenAiKey() || countUserTurns(history) > MAX_CHAT_TURNS) {
    return deterministicFallback(answers, catalog, locale);
  }

  try {
    const { object: rawObject } = await generateObject({
      model: openai(process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini"),
      schema: turnSchema,
      schemaName: "AdvisoryBriefTurn",
      system: buildBriefAgentSystemPrompt(catalog, selectResponseLanguage(history, locale)),
      messages: toModelMessages(history, answers),
    });
    const parsedTurn = parseAdvisoryTurn(rawObject);
    if (!parsedTurn.success) return deterministicFallback(answers, catalog, locale);

    const object = parsedTurn.data;
    const merged = mergeChatSlots(answers, object, catalog);
    const completed = resolveCompletedBrief(merged, catalog, locale, {
      route: object.recommendedRoute,
      confidence: object.routeConfidence,
    });
    if (completed) {
      return { fallback: false, reply: object.reply.trim() || null, answers: completed.answers, clarifyField: null, report: completed };
    }
    return { fallback: false, reply: object.reply.trim() || null, answers: merged, clarifyField: resolveClarifyField(merged, object.clarifyField), report: null };
  } catch {
    return deterministicFallback(answers, catalog, locale);
  }
}
function mergeChatSlots(current: Partial<BriefAnswers>, turn: AdvisoryTurn, catalog: Messages): Partial<BriefAnswers> {
  const next = { ...current };
  for (const field of fields) {
    const value = turn.slots[field];
    if (value && (turn.confidence[field] ?? 0) >= CONFIDENCE_FLOOR) {
      const candidate = sanitizePartialAnswers({ [field]: value }, catalog)[field];
      if (candidate) Object.assign(next, { [field]: candidate });
    }
  }
  return next;
}
function resolveClarifyField(answers: Partial<BriefAnswers>, requested: BriefStepId | null): BriefStepId | null { const missing = nextIncompleteField(answers); return requested && !answers[requested] ? requested : missing; }
function deterministicFallback(answers: Partial<BriefAnswers>, catalog: Messages, locale: Locale): BriefChatResponse {
  const report = resolveCompletedBrief(answers, catalog, locale);
  return { fallback: true, reply: null, answers: report?.answers ?? answers, clarifyField: null, report };
}
function toModelMessages(history: BriefChatMessage[], answers: Partial<BriefAnswers>): Array<{ role: "user" | "assistant"; content: string }> { return [{ role: "user", content: `Confirmed slots (JSON): ${JSON.stringify(answers)}` }, ...history.map((message) => ({ role: message.role === "agent" ? "assistant" as const : "user" as const, content: message.text }))]; }
function count(text: string, pattern: RegExp) { return text.match(pattern)?.length ?? 0; }
function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null; }
