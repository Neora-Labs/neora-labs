import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/es";
import {
  buildBriefReport,
  parseBriefAnswers,
  parseIntegrations,
  parseNeed,
  parseScale,
  parseStage,
  validateTextStep,
  type BriefAnswers,
  type BriefReport,
  type BriefStepId,
} from "@/lib/brief";

export const MAX_CHAT_TURNS = 20;
export const MAX_CHAT_MESSAGES = MAX_CHAT_TURNS * 2 + 2;
export const MAX_MESSAGE_CHARS = 2000;
export const CONFIDENCE_FLOOR = 0.7;

export type BriefChatMessage = {
  role: "user" | "agent";
  text: string;
};

export type BriefChatResponse = {
  fallback: boolean;
  reply: string | null;
  answers: Partial<BriefAnswers>;
  clarifyField: BriefStepId | null;
  report: BriefReport | null;
};

const SLOT_ORDER: readonly BriefStepId[] = [
  "need",
  "stage",
  "scale",
  "problem",
  "integrations",
  "email",
];

const needSchema = z.enum(["ai", "automation", "software", "web", "integrations", "unclear"]);
const stageSchema = z.enum(["idea", "operating", "product"]);
const scaleSchema = z.enum(["small", "medium", "large"]);
const integrationsSchema = z.enum(["none", "one", "several"]);
const stepSchema = z.enum(["need", "stage", "scale", "problem", "integrations", "email"]);

const chatTurnSchema = z.object({
  reply: z.string(),
  slots: z.object({
    need: needSchema.nullable(),
    stage: stageSchema.nullable(),
    scale: scaleSchema.nullable(),
    problem: z.string().nullable(),
    integrations: integrationsSchema.nullable(),
    email: z.string().nullable(),
  }),
  confidence: z.object({
    need: z.number().min(0).max(1),
    stage: z.number().min(0).max(1),
    scale: z.number().min(0).max(1),
    problem: z.number().min(0).max(1),
    integrations: z.number().min(0).max(1),
    email: z.number().min(0).max(1),
  }),
  clarifyField: stepSchema.nullable(),
});

export function hasOpenAiKey(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export function sanitizePartialAnswers(
  input: unknown,
  catalog: Messages,
): Partial<BriefAnswers> {
  if (!isRecord(input)) {
    return {};
  }

  const next: Partial<BriefAnswers> = {};
  const need = parseNeed(input.need);
  if (need) {
    next.need = need;
  }

  const stage = parseStage(input.stage);
  if (stage) {
    next.stage = stage;
  }

  const scale = parseScale(input.scale);
  if (scale) {
    next.scale = scale;
  }

  const integrations = parseIntegrations(input.integrations);
  if (integrations) {
    next.integrations = integrations;
  }

  if (typeof input.problem === "string" && validateTextStep("problem", input.problem, catalog) === null) {
    next.problem = input.problem.trim();
  }

  if (typeof input.email === "string" && validateTextStep("email", input.email, catalog) === null) {
    next.email = input.email.trim();
  }

  return next;
}

export function parseChatHistory(input: unknown): BriefChatMessage[] | null {
  if (!Array.isArray(input) || input.length > MAX_CHAT_MESSAGES) {
    return null;
  }

  const messages: BriefChatMessage[] = [];
  for (const item of input) {
    if (!isRecord(item)) {
      return null;
    }
    if (item.role !== "user" && item.role !== "agent") {
      return null;
    }
    if (typeof item.text !== "string") {
      return null;
    }
    const text = item.text.trim();
    if (text.length === 0 || text.length > MAX_MESSAGE_CHARS) {
      return null;
    }
    messages.push({ role: item.role, text });
  }

  return messages;
}

export function countUserTurns(messages: readonly BriefChatMessage[]): number {
  return messages.filter((message) => message.role === "user").length;
}

export function mergeChatSlots(
  current: Partial<BriefAnswers>,
  extracted: z.infer<typeof chatTurnSchema>["slots"],
  confidence: z.infer<typeof chatTurnSchema>["confidence"],
  catalog: Messages,
): Partial<BriefAnswers> {
  const next = { ...current };

  if (confidence.need >= CONFIDENCE_FLOOR) {
    const need = parseNeed(extracted.need);
    if (need) {
      next.need = need;
    }
  }

  if (confidence.stage >= CONFIDENCE_FLOOR) {
    const stage = parseStage(extracted.stage);
    if (stage) {
      next.stage = stage;
    }
  }

  if (confidence.scale >= CONFIDENCE_FLOOR) {
    const scale = parseScale(extracted.scale);
    if (scale) {
      next.scale = scale;
    }
  }

  if (confidence.integrations >= CONFIDENCE_FLOOR) {
    const integrations = parseIntegrations(extracted.integrations);
    if (integrations) {
      next.integrations = integrations;
    }
  }

  if (confidence.problem >= CONFIDENCE_FLOOR && extracted.problem) {
    if (validateTextStep("problem", extracted.problem, catalog) === null) {
      next.problem = extracted.problem.trim();
    }
  }

  if (confidence.email >= CONFIDENCE_FLOOR && extracted.email) {
    if (validateTextStep("email", extracted.email, catalog) === null) {
      next.email = extracted.email.trim();
    }
  }

  return next;
}

export function nextIncompleteField(answers: Partial<BriefAnswers>): BriefStepId | null {
  const missing = SLOT_ORDER.find((id) => {
    const value = answers[id];
    return value === undefined || value === "";
  });
  return missing ?? null;
}

export function resolveClarifyField(
  answers: Partial<BriefAnswers>,
  requested: BriefStepId | null,
): BriefStepId | null {
  const missing = nextIncompleteField(answers);
  if (missing === null) {
    return null;
  }

  if (requested && (answers[requested] === undefined || answers[requested] === "")) {
    return requested;
  }

  return missing;
}

export function buildBriefAgentSystemPrompt(catalog: Messages, locale: Locale): string {
  const { steps } = catalog.brief;
  return [
    `You are the Neora Labs scoping agent. Reply only in ${locale}.`,
    "Collect these fields by conversing. Never mention euros, prices, weeks, timelines, quotes, budgets, or investment ranges. Never invent IDs outside the enums below.",
    "If a field is already in the confirmed JSON, do not re-ask unless the visitor clearly changes it.",
    "If you are unsure (confidence below 0.7), set clarifyField to that field and ask a short question. The UI will show choice chips for choice fields.",
    "If all six fields are present, acknowledge briefly that you will prepare an indicative report — still no numbers.",
    "Keep replies to 1–3 short sentences. Be direct, not salesy.",
    "",
    "need:",
    formatOptions(steps.need.options),
    "stage:",
    formatOptions(steps.stage.options),
    "scale:",
    formatOptions(steps.scale.options),
    "integrations:",
    formatOptions(steps.integrations.options),
    "problem: 10–2000 characters describing what hurts, who it affects, and what would change.",
    "email: a real email address.",
  ].join("\n");
}

export async function runBriefChatTurn(options: {
  locale: Locale;
  history: BriefChatMessage[];
  answers: Partial<BriefAnswers>;
  catalog: Messages;
}): Promise<BriefChatResponse> {
  const { locale, history, answers, catalog } = options;

  if (!hasOpenAiKey()) {
    return emptyFallback(answers);
  }

  if (countUserTurns(history) > MAX_CHAT_TURNS) {
    return emptyFallback(answers);
  }

  const completeBefore = parseBriefAnswers(answers, catalog);
  if (completeBefore.ok) {
    return {
      fallback: false,
      reply: null,
      answers: completeBefore.answers,
      clarifyField: null,
      report: buildBriefReport(completeBefore.answers, catalog, locale),
    };
  }

  const modelId = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  const { object } = await generateObject({
    model: openai(modelId),
    schema: chatTurnSchema,
    schemaName: "BriefChatTurn",
    schemaDescription: "Next scoping-agent reply and extracted brief slots.",
    system: buildBriefAgentSystemPrompt(catalog, locale),
    messages: toModelMessages(history, answers),
  });

  const merged = mergeChatSlots(answers, object.slots, object.confidence, catalog);
  if (!merged.problem) {
    const firstUser = history.find((item) => item.role === "user");
    if (firstUser && validateTextStep("problem", firstUser.text, catalog) === null) {
      merged.problem = firstUser.text.trim();
    }
  }
  const complete = parseBriefAnswers(merged, catalog);
  if (complete.ok) {
    return {
      fallback: false,
      reply: object.reply.trim() || null,
      answers: complete.answers,
      clarifyField: null,
      report: buildBriefReport(complete.answers, catalog, locale),
    };
  }

  return {
    fallback: false,
    reply: object.reply.trim() || null,
    answers: merged,
    clarifyField: resolveClarifyField(merged, object.clarifyField),
    report: null,
  };
}

function emptyFallback(answers: Partial<BriefAnswers>): BriefChatResponse {
  return {
    fallback: true,
    reply: null,
    answers,
    clarifyField: null,
    report: null,
  };
}

function toModelMessages(
  history: BriefChatMessage[],
  answers: Partial<BriefAnswers>,
): Array<{ role: "user" | "assistant"; content: string }> {
  const messages: Array<{ role: "user" | "assistant"; content: string }> = [
    {
      role: "user",
      content: `Confirmed slots (JSON): ${JSON.stringify(answers)}`,
    },
  ];

  if (history.length === 0) {
    messages.push({
      role: "user",
      content: "Start. Greet briefly and ask for the next missing field.",
    });
    return messages;
  }

  for (const item of history) {
    messages.push({
      role: item.role === "agent" ? "assistant" : "user",
      content: item.text,
    });
  }

  return messages;
}

function formatOptions(options: Record<string, string>): string {
  return Object.entries(options)
    .map(([id, label]) => `- ${id}: ${label}`)
    .join("\n");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
