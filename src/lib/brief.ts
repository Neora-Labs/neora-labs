import {
  lookupInvestmentBand,
  type IntegrationsId,
  type InvestmentBand,
  type NeedId,
  type ScaleId,
  type StageId,
} from "@/lib/brief-matrix";
import type { Locale } from "@/i18n/config";
import { bcp47 } from "@/i18n/config";
import { interpolate } from "@/i18n/interpolate";
import type { Messages } from "@/i18n/messages/es";

export type { IntegrationsId, NeedId, ScaleId, StageId };

export type BusinessImpactId = "time" | "revenue" | "risk" | "visibility";
export type CurrentToolsId = "none" | "one" | "several";
export type DesiredOutcomeId = "clarity" | "reduce_manual" | "connect_tools" | "improve_existing" | "new_capability";
export type UrgencyId = "now" | "this_quarter" | "flexible";
export type RecommendedRoute =
  | "keep_current"
  | "adopt_tool"
  | "integrate"
  | "automate"
  | "custom_build"
  | "advisory_sprint";

export type BriefAnswers = {
  problem: string;
  currentProcess: string;
  businessImpact: BusinessImpactId;
  scale: ScaleId;
  currentTools: CurrentToolsId;
  desiredOutcome: DesiredOutcomeId;
  urgency: UrgencyId;
};

export type BriefStepId = keyof BriefAnswers;
export type ChoiceOption<T extends string> = { id: T; label: string };
export type BriefChoiceStep<K extends Exclude<BriefStepId, "problem" | "currentProcess">> = {
  id: K;
  kind: "choice";
  prompt: string;
  options: ReadonlyArray<ChoiceOption<BriefAnswers[K]>>;
};
export type BriefTextStep = {
  id: "problem" | "currentProcess";
  kind: "text";
  prompt: string;
  placeholder: string;
  inputMode: "text";
};
export type BriefStep = BriefTextStep | BriefChoiceStep<Exclude<BriefStepId, "problem" | "currentProcess">>;
export type MatrixAnswers = { need: NeedId; integrations: IntegrationsId; scale: ScaleId; stage: StageId };

export type BriefReport = {
  answers: BriefAnswers;
  recommendedRoute: RecommendedRoute;
  diagnosis: string;
  rationale: string;
  expectedOutcome: string;
  timelineRange: string;
  investmentRange: string;
  assumptions: string[];
  risks: string[];
  nextStep: string;
  band: InvestmentBand;
  rangeLabel: string;
  timeLabel: string;
  summaryLines: Array<{ label: string; value: string }>;
  body: string;
  visitorBody: string;
};

const PROBLEM_MIN = 10;
const PROBLEM_MAX = 2000;
const TEXT_FIELDS: readonly ("problem" | "currentProcess")[] = ["problem", "currentProcess"];

export type AgentTurn = { kind: "step"; step: BriefStep } | { kind: "report"; report: BriefReport };

export function getBriefSteps(messages: Messages): readonly BriefStep[] {
  const { advisory: steps } = messages.brief;
  return [
    { id: "problem", kind: "text", prompt: steps.problem.prompt, placeholder: steps.problem.placeholder, inputMode: "text" },
    { id: "currentProcess", kind: "text", prompt: steps.currentProcess.prompt, placeholder: steps.currentProcess.placeholder, inputMode: "text" },
    { id: "businessImpact", kind: "choice", prompt: steps.businessImpact.prompt, options: Object.entries(steps.businessImpact.options).map(([id, label]) => ({ id: id as BusinessImpactId, label })) },
    { id: "scale", kind: "choice", prompt: steps.scale.prompt, options: Object.entries(steps.scale.options).map(([id, label]) => ({ id: id as ScaleId, label })) },
    { id: "currentTools", kind: "choice", prompt: steps.currentTools.prompt, options: Object.entries(steps.currentTools.options).map(([id, label]) => ({ id: id as CurrentToolsId, label })) },
    { id: "desiredOutcome", kind: "choice", prompt: steps.desiredOutcome.prompt, options: Object.entries(steps.desiredOutcome.options).map(([id, label]) => ({ id: id as DesiredOutcomeId, label })) },
    { id: "urgency", kind: "choice", prompt: steps.urgency.prompt, options: Object.entries(steps.urgency.options).map(([id, label]) => ({ id: id as UrgencyId, label })) },
  ];
}

export function nextIncompleteIndex(answers: Partial<BriefAnswers>, steps: readonly BriefStep[]): number | null {
  const index = steps.findIndex((step) => !answers[step.id]);
  return index === -1 ? null : index;
}

export function completedCount(answers: Partial<BriefAnswers>, steps: readonly BriefStep[]): number {
  return steps.filter((step) => Boolean(answers[step.id])).length;
}

export function getNextAgentTurn(answers: Partial<BriefAnswers>, messages: Messages, locale: Locale): AgentTurn {
  const steps = getBriefSteps(messages);
  const index = nextIncompleteIndex(answers, steps);
  return index === null
    ? { kind: "report", report: buildBriefReport(answers as BriefAnswers, recommendRouteFromAnswers(answers as BriefAnswers), messages, locale) }
    : { kind: "step", step: steps[index]! };
}

export function formatStepAnswer(step: BriefStep, value: string): string {
  if (step.kind === "text") return value;
  const match = step.options.find((option) => option.id === value);
  return match?.label ?? value;
}

export function formatEuroBand(min: number, max: number, locale: Locale): string {
  return `${formatThousands(min, locale)}â€“${formatThousands(max, locale)} kâ‚¬`;
}

export function formatWeeksBand(min: number, max: number, messages: Messages): string {
  return interpolate(messages.brief.weeksBand, { min: String(min), max: String(max) });
}

export function recommendRouteFromAnswers(answers: BriefAnswers): RecommendedRoute {
  switch (answers.desiredOutcome) {
    case "clarity": return "advisory_sprint";
    case "reduce_manual": return "automate";
    case "connect_tools": return "integrate";
    case "new_capability": return "custom_build";
    case "improve_existing": return answers.currentTools === "none" ? "adopt_tool" : "keep_current";
    default: { const _exhaustive: never = answers.desiredOutcome; return _exhaustive; }
  }
}

/** Explicitly translates advisory answers into the unchanged commercial matrix IDs. */
export function adaptBusinessAnswersToMatrix(answers: BriefAnswers, route: RecommendedRoute): MatrixAnswers {
  const need: NeedId = route === "integrate" ? "integrations"
    : route === "automate" ? "automation"
    : route === "custom_build" ? "software"
    : route === "adopt_tool" ? "web"
    : "unclear";
  return { need, integrations: answers.currentTools, scale: answers.scale, stage: "operating" };
}

export function buildBriefReport(answers: BriefAnswers, recommendedRoute: RecommendedRoute, messages: Messages, locale: Locale): BriefReport {
  const matrix = adaptBusinessAnswersToMatrix(answers, recommendedRoute);
  const band = lookupInvestmentBand(matrix.need, matrix.integrations, matrix.scale, matrix.stage);
  const isAdvisorySprint = recommendedRoute === "advisory_sprint";
  const rangeLabel = isAdvisorySprint
    ? messages.brief.sprint.investment
    : band.kind === "definition"
      ? interpolate(messages.brief.definitionBand, { range: formatEuroBand(band.min, band.max, locale) })
      : formatEuroBand(band.min, band.max, locale);
  const timeLabel = isAdvisorySprint
    ? messages.brief.sprint.timeline
    : formatWeeksBand(band.weeksMin, band.weeksMax, messages);
  const routeLabel = messages.brief.routes[recommendedRoute];
  const diagnosis = interpolate(messages.brief.report.diagnosis, { problem: answers.problem.trim() });
  const rationale = interpolate(messages.brief.report.rationale, { route: routeLabel, process: answers.currentProcess.trim() });
  const expectedOutcome = messages.brief.outcomes[answers.desiredOutcome];
  const assumptions = [messages.brief.assumptions.tools, messages.brief.assumptions.access];
  const risks = [messages.brief.risks[answers.businessImpact], messages.brief.risks.urgency];
  const nextStep = recommendedRoute === "advisory_sprint" ? messages.brief.sprintNextStep : messages.brief.nextStep;
  const summaryLines = [
    { label: messages.brief.advisorySummary.problem, value: answers.problem.trim() },
    { label: messages.brief.advisorySummary.process, value: answers.currentProcess.trim() },
    { label: messages.brief.advisorySummary.route, value: routeLabel },
    { label: messages.brief.advisorySummary.impact, value: messages.brief.advisory.businessImpact.options[answers.businessImpact] },
  ];
  const body = [messages.brief.reportTitle, "", `${messages.brief.report.route}: ${routeLabel}`, `${messages.brief.report.diagnosisLabel}: ${diagnosis}`, `${messages.brief.report.rationaleLabel}: ${rationale}`, `${messages.brief.report.outcomeLabel}: ${expectedOutcome}`, `${messages.brief.report.timelineLabel}: ${timeLabel}`, `${messages.brief.report.investmentLabel}: ${rangeLabel}`, `${messages.brief.report.assumptionsLabel}: ${assumptions.join(" ")}`, `${messages.brief.report.risksLabel}: ${risks.join(" ")}`, `${messages.brief.report.nextStepLabel}: ${nextStep}`].join("\n");
  return { answers, recommendedRoute, diagnosis, rationale, expectedOutcome, timelineRange: timeLabel, investmentRange: rangeLabel, assumptions, risks, nextStep, band, rangeLabel, timeLabel, summaryLines, body, visitorBody: [messages.brief.visitorEmailIntro, "", body].join("\n") };
}

export function buildMailtoHref(report: BriefReport, email: string, messages: Messages): string {
  const subject = encodeURIComponent(interpolate(messages.brief.mailtoSubject, { email }));
  const body = encodeURIComponent(`${report.body}\n\n${messages.brief.visitorContact}: ${email}`);
  return `mailto:${messages.site.email}?subject=${subject}&body=${body}`;
}

export function parseBriefAnswers(input: unknown, messages: Messages): { ok: true; answers: BriefAnswers } | { ok: false; error: string } {
  if (!isRecord(input)) return { ok: false, error: messages.brief.invalidPayload };
  const problem = parseText(input.problem, messages);
  const currentProcess = parseText(input.currentProcess, messages);
  const businessImpact = parseBusinessImpact(input.businessImpact);
  const scale = parseScale(input.scale);
  const currentTools = parseCurrentTools(input.currentTools);
  const desiredOutcome = parseDesiredOutcome(input.desiredOutcome);
  const urgency = parseUrgency(input.urgency);
  if (!problem || !currentProcess || !businessImpact || !scale || !currentTools || !desiredOutcome || !urgency) return { ok: false, error: messages.brief.missingAnswers };
  return { ok: true, answers: { problem, currentProcess, businessImpact, scale, currentTools, desiredOutcome, urgency } };
}

export function validateTextStep(stepId: "problem" | "currentProcess", value: string, messages: Messages): string | null {
  const trimmed = value.trim();
  if (trimmed.length < PROBLEM_MIN) return messages.brief.textTooShort;
  if (trimmed.length > PROBLEM_MAX) return messages.brief.textTooLong;
  return null;
}

function parseText(value: unknown, messages: Messages): string | null {
  return typeof value === "string" && validateTextStep("problem", value, messages) === null ? value.trim() : null;
}
function parseBusinessImpact(value: unknown): BusinessImpactId | null { return value === "time" || value === "revenue" || value === "risk" || value === "visibility" ? value : null; }
export function parseScale(value: unknown): ScaleId | null { return value === "small" || value === "medium" || value === "large" ? value : null; }
function parseCurrentTools(value: unknown): CurrentToolsId | null { return value === "none" || value === "one" || value === "several" ? value : null; }
function parseDesiredOutcome(value: unknown): DesiredOutcomeId | null { return value === "clarity" || value === "reduce_manual" || value === "connect_tools" || value === "improve_existing" || value === "new_capability" ? value : null; }
function parseUrgency(value: unknown): UrgencyId | null { return value === "now" || value === "this_quarter" || value === "flexible" ? value : null; }
function formatThousands(amount: number, locale: Locale): string { return (amount / 1000).toLocaleString(bcp47[locale], { maximumFractionDigits: 1 }); }
function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null; }
export const businessFields = TEXT_FIELDS;
