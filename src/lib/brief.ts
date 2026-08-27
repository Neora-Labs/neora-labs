import {
  lookupInvestmentBand,
  type InvestmentBand,
  type IntegrationsId,
  type NeedId,
  type ScaleId,
  type StageId,
} from "@/lib/brief-matrix";
import type { Locale } from "@/i18n/config";
import { bcp47 } from "@/i18n/config";
import { interpolate } from "@/i18n/interpolate";
import type { Messages } from "@/i18n/messages/es";

export type { IntegrationsId, NeedId, ScaleId, StageId };

export type BriefAnswers = {
  need: NeedId;
  stage: StageId;
  scale: ScaleId;
  problem: string;
  integrations: IntegrationsId;
  email: string;
};

export type BriefStepId = keyof BriefAnswers;

export type ChoiceOption<T extends string> = {
  id: T;
  label: string;
};

export type BriefChoiceStep<K extends Exclude<BriefStepId, "problem" | "email">> = {
  id: K;
  kind: "choice";
  prompt: string;
  options: ReadonlyArray<ChoiceOption<BriefAnswers[K]>>;
};

export type BriefTextStep = {
  id: "problem" | "email";
  kind: "text";
  prompt: string;
  placeholder: string;
  inputMode: "text" | "email";
};

export type BriefStep = BriefChoiceStep<"need" | "stage" | "scale" | "integrations"> | BriefTextStep;

export type BriefReport = {
  answers: BriefAnswers;
  band: InvestmentBand;
  rangeLabel: string;
  nextStep: string;
  summaryLines: Array<{ label: string; value: string }>;
  body: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PROBLEM_MIN = 10;
const PROBLEM_MAX = 2000;

export type AgentTurn =
  | { kind: "step"; step: BriefStep }
  | { kind: "report"; report: BriefReport };

export function getBriefSteps(messages: Messages): readonly BriefStep[] {
  const { steps } = messages.brief;
  return [
    {
      id: "need",
      kind: "choice",
      prompt: steps.need.prompt,
      options: [
        { id: "ai", label: steps.need.options.ai },
        { id: "automation", label: steps.need.options.automation },
        { id: "software", label: steps.need.options.software },
        { id: "web", label: steps.need.options.web },
        { id: "integrations", label: steps.need.options.integrations },
        { id: "unclear", label: steps.need.options.unclear },
      ],
    },
    {
      id: "stage",
      kind: "choice",
      prompt: steps.stage.prompt,
      options: [
        { id: "idea", label: steps.stage.options.idea },
        { id: "operating", label: steps.stage.options.operating },
        { id: "product", label: steps.stage.options.product },
      ],
    },
    {
      id: "scale",
      kind: "choice",
      prompt: steps.scale.prompt,
      options: [
        { id: "small", label: steps.scale.options.small },
        { id: "medium", label: steps.scale.options.medium },
        { id: "large", label: steps.scale.options.large },
      ],
    },
    {
      id: "problem",
      kind: "text",
      prompt: steps.problem.prompt,
      placeholder: steps.problem.placeholder,
      inputMode: "text",
    },
    {
      id: "integrations",
      kind: "choice",
      prompt: steps.integrations.prompt,
      options: [
        { id: "none", label: steps.integrations.options.none },
        { id: "one", label: steps.integrations.options.one },
        { id: "several", label: steps.integrations.options.several },
      ],
    },
    {
      id: "email",
      kind: "text",
      prompt: steps.email.prompt,
      placeholder: steps.email.placeholder,
      inputMode: "email",
    },
  ];
}

export function nextIncompleteIndex(
  answers: Partial<BriefAnswers>,
  steps: readonly BriefStep[],
): number | null {
  const index = steps.findIndex((step) => {
    const value = answers[step.id];
    return value === undefined || value === "";
  });
  return index === -1 ? null : index;
}

export function completedCount(answers: Partial<BriefAnswers>, steps: readonly BriefStep[]): number {
  return steps.filter((step) => {
    const value = answers[step.id];
    return value !== undefined && value !== "";
  }).length;
}

export function getNextAgentTurn(
  answers: Partial<BriefAnswers>,
  messages: Messages,
  locale: Locale,
): AgentTurn {
  const steps = getBriefSteps(messages);
  const index = nextIncompleteIndex(answers, steps);
  if (index === null) {
    return { kind: "report", report: buildBriefReport(answers as BriefAnswers, messages, locale) };
  }

  const step = steps[index];
  if (!step) {
    return { kind: "report", report: buildBriefReport(answers as BriefAnswers, messages, locale) };
  }

  return { kind: "step", step };
}

export function formatStepAnswer(
  step: BriefStep,
  value: string,
  steps: readonly BriefStep[],
): string {
  if (step.kind === "text") {
    return value;
  }

  switch (step.id) {
    case "need":
      return labelForAnswer("need", value as NeedId, steps);
    case "stage":
      return labelForAnswer("stage", value as StageId, steps);
    case "scale":
      return labelForAnswer("scale", value as ScaleId, steps);
    case "integrations":
      return labelForAnswer("integrations", value as IntegrationsId, steps);
    default: {
      const _exhaustive: never = step;
      return _exhaustive;
    }
  }
}

export function labelForAnswer<K extends Exclude<BriefStepId, "problem" | "email">>(
  stepId: K,
  value: BriefAnswers[K],
  steps: readonly BriefStep[],
): string {
  const step = steps.find((item) => item.id === stepId);
  if (!step || step.kind !== "choice") {
    return String(value);
  }

  const match = step.options.find((option) => option.id === value);
  return match?.label ?? String(value);
}

export function formatEuroBand(min: number, max: number, locale: Locale): string {
  return `${formatThousands(min, locale)}–${formatThousands(max, locale)} k€`;
}

export function buildBriefReport(
  answers: BriefAnswers,
  messages: Messages,
  locale: Locale,
): BriefReport {
  const steps = getBriefSteps(messages);
  const band = lookupInvestmentBand(answers.need, answers.integrations, answers.scale);
  const range = formatEuroBand(band.min, band.max, locale);
  const rangeLabel =
    band.kind === "definition"
      ? interpolate(messages.brief.definitionBand, { range })
      : range;
  const nextStep =
    band.kind === "definition" ? messages.brief.nextStepDefinition : messages.brief.nextStepCall;

  const summaryLines = [
    { label: messages.brief.summary.problem, value: answers.problem.trim() },
    { label: messages.brief.summary.type, value: labelForAnswer("need", answers.need, steps) },
    { label: messages.brief.summary.moment, value: labelForAnswer("stage", answers.stage, steps) },
    {
      label: messages.brief.summary.whoUses,
      value: labelForAnswer("scale", answers.scale, steps),
    },
    {
      label: messages.brief.summary.integrations,
      value: labelForAnswer("integrations", answers.integrations, steps),
    },
  ];

  const body = [
    messages.brief.reportTitle,
    "",
    ...summaryLines.map((line) => `${line.label}: ${line.value}`),
    `${messages.brief.nextStepLabel}: ${nextStep}`,
    interpolate(messages.brief.investmentLine, { range: rangeLabel }),
    "",
    `${messages.brief.visitorContact}: ${answers.email}`,
  ].join("\n");

  return { answers, band, rangeLabel, nextStep, summaryLines, body };
}

export function buildMailtoHref(report: BriefReport, messages: Messages): string {
  const subject = encodeURIComponent(
    interpolate(messages.brief.mailtoSubject, { email: report.answers.email }),
  );
  const body = encodeURIComponent(report.body);
  return `mailto:${messages.site.email}?subject=${subject}&body=${body}`;
}

export function parseBriefAnswers(
  input: unknown,
  messages: Messages,
): { ok: true; answers: BriefAnswers } | { ok: false; error: string } {
  if (!isRecord(input)) {
    return { ok: false, error: messages.brief.invalidPayload };
  }

  const need = parseNeed(input.need);
  const stage = parseStage(input.stage);
  const scale = parseScale(input.scale);
  const integrations = parseIntegrations(input.integrations);
  const problem = typeof input.problem === "string" ? input.problem.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim() : "";

  if (!need || !stage || !scale || !integrations) {
    return { ok: false, error: messages.brief.missingAnswers };
  }

  if (problem.length < PROBLEM_MIN || problem.length > PROBLEM_MAX) {
    return { ok: false, error: messages.brief.problemLength };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { ok: false, error: messages.brief.invalidEmail };
  }

  return {
    ok: true,
    answers: { need, stage, scale, integrations, problem, email },
  };
}

export function validateTextStep(
  stepId: "problem" | "email",
  value: string,
  messages: Messages,
): string | null {
  const trimmed = value.trim();

  if (stepId === "problem") {
    if (trimmed.length < PROBLEM_MIN) {
      return messages.brief.problemTooShort;
    }
    if (trimmed.length > PROBLEM_MAX) {
      return messages.brief.problemTooLong;
    }
    return null;
  }

  if (!EMAIL_PATTERN.test(trimmed)) {
    return messages.brief.emailInvalid;
  }

  return null;
}

function formatThousands(amount: number, locale: Locale): string {
  return (amount / 1000).toLocaleString(bcp47[locale], { maximumFractionDigits: 1 });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseNeed(value: unknown): NeedId | null {
  switch (value) {
    case "ai":
    case "automation":
    case "software":
    case "web":
    case "integrations":
    case "unclear":
      return value;
    default:
      return null;
  }
}

function parseStage(value: unknown): StageId | null {
  switch (value) {
    case "idea":
    case "operating":
    case "product":
      return value;
    default:
      return null;
  }
}

function parseScale(value: unknown): ScaleId | null {
  switch (value) {
    case "small":
    case "medium":
    case "large":
      return value;
    default:
      return null;
  }
}

function parseIntegrations(value: unknown): IntegrationsId | null {
  switch (value) {
    case "none":
    case "one":
    case "several":
      return value;
    default:
      return null;
  }
}
