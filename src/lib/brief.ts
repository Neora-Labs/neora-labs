import {
  lookupInvestmentBand,
  type InvestmentBand,
  type IntegrationsId,
  type NeedId,
  type ScaleId,
  type StageId,
} from "@/lib/brief-matrix";
import { site } from "@/lib/content";

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

export const briefIntro =
  "Seis preguntas. Te devolvemos un informe y una banda de inversión — orientativa, se confirma en una llamada.";

export type AgentTurn =
  | { kind: "step"; step: BriefStep }
  | { kind: "report"; report: BriefReport };

export function nextIncompleteIndex(answers: Partial<BriefAnswers>): number | null {
  const index = briefSteps.findIndex((step) => {
    const value = answers[step.id];
    return value === undefined || value === "";
  });
  return index === -1 ? null : index;
}

export function completedCount(answers: Partial<BriefAnswers>): number {
  return briefSteps.filter((step) => {
    const value = answers[step.id];
    return value !== undefined && value !== "";
  }).length;
}

export function getNextAgentTurn(answers: Partial<BriefAnswers>): AgentTurn {
  const index = nextIncompleteIndex(answers);
  if (index === null) {
    return { kind: "report", report: buildBriefReport(answers as BriefAnswers) };
  }

  const step = briefSteps[index];
  if (!step) {
    return { kind: "report", report: buildBriefReport(answers as BriefAnswers) };
  }

  return { kind: "step", step };
}

export const briefSteps: readonly BriefStep[] = [
  {
    id: "need",
    kind: "choice",
    prompt: "¿Qué necesitas construir ahora mismo?",
    options: [
      { id: "ai", label: "Inteligencia Artificial para empresas" },
      { id: "automation", label: "Automatización y digitalización" },
      { id: "software", label: "Desarrollo de software" },
      { id: "web", label: "Web y presencia digital" },
      { id: "integrations", label: "Integraciones y sistemas" },
      { id: "unclear", label: "Aún no está claro" },
    ],
  },
  {
    id: "stage",
    kind: "choice",
    prompt: "¿En qué punto está el negocio?",
    options: [
      { id: "idea", label: "Es una idea" },
      { id: "operating", label: "Ya operamos" },
      { id: "product", label: "Hay un producto en marcha" },
    ],
  },
  {
    id: "scale",
    kind: "choice",
    prompt: "¿Quién lo usará?",
    options: [
      { id: "small", label: "1–10 personas" },
      { id: "medium", label: "10–50 personas" },
      { id: "large", label: "Más de 50 personas" },
    ],
  },
  {
    id: "problem",
    kind: "text",
    prompt: "Describe el problema en una o dos frases.",
    placeholder: "Qué duele hoy, a quién afecta y qué cambiaría si se resolviera.",
    inputMode: "text",
  },
  {
    id: "integrations",
    kind: "choice",
    prompt: "¿Hay sistemas que conectar?",
    options: [
      { id: "none", label: "Ninguno" },
      { id: "one", label: "Uno (CRM, ERP…)" },
      { id: "several", label: "Varios sistemas" },
    ],
  },
  {
    id: "email",
    kind: "text",
    prompt: "¿A qué correo te enviamos el informe?",
    placeholder: "nina.v@example.com",
    inputMode: "email",
  },
];

export function formatStepAnswer(step: BriefStep, value: string): string {
  if (step.kind === "text") {
    return value;
  }

  switch (step.id) {
    case "need":
      return labelForAnswer("need", value as NeedId);
    case "stage":
      return labelForAnswer("stage", value as StageId);
    case "scale":
      return labelForAnswer("scale", value as ScaleId);
    case "integrations":
      return labelForAnswer("integrations", value as IntegrationsId);
    default: {
      const _exhaustive: never = step;
      return _exhaustive;
    }
  }
}

export function labelForAnswer<K extends Exclude<BriefStepId, "problem" | "email">>(
  stepId: K,
  value: BriefAnswers[K],
): string {
  const step = briefSteps.find((item) => item.id === stepId);
  if (!step || step.kind !== "choice") {
    return String(value);
  }

  const match = step.options.find((option) => option.id === value);
  return match?.label ?? String(value);
}

export function formatEuroBand(min: number, max: number): string {
  return `${formatThousands(min)}–${formatThousands(max)} k€`;
}

export function buildBriefReport(answers: BriefAnswers): BriefReport {
  const band = lookupInvestmentBand(answers.need, answers.integrations, answers.scale);
  const rangeLabel =
    band.kind === "definition"
      ? `Sesión de definición · ${formatEuroBand(band.min, band.max)}`
      : formatEuroBand(band.min, band.max);
  const nextStep =
    band.kind === "definition"
      ? "Una sesión de definición para aterrizar el alcance antes de construir."
      : "Una llamada para confirmar alcance, plazos y la banda de inversión.";

  const summaryLines = [
    { label: "Problema", value: answers.problem.trim() },
    { label: "Tipo", value: labelForAnswer("need", answers.need) },
    { label: "Momento", value: labelForAnswer("stage", answers.stage) },
    { label: "Quién lo usa", value: labelForAnswer("scale", answers.scale) },
    { label: "Integraciones", value: labelForAnswer("integrations", answers.integrations) },
  ];

  const body = [
    "Brief de proyecto — Neora Labs",
    "",
    ...summaryLines.map((line) => `${line.label}: ${line.value}`),
    `Siguiente paso: ${nextStep}`,
    `Inversión orientativa: ${rangeLabel} · se confirma en una llamada`,
    "",
    `Contacto del visitante: ${answers.email}`,
  ].join("\n");

  return { answers, band, rangeLabel, nextStep, summaryLines, body };
}

export function buildMailtoHref(report: BriefReport): string {
  const subject = encodeURIComponent(`Brief Neora Labs — ${report.answers.email}`);
  const body = encodeURIComponent(report.body);
  return `mailto:${site.email}?subject=${subject}&body=${body}`;
}

export function parseBriefAnswers(input: unknown): { ok: true; answers: BriefAnswers } | { ok: false; error: string } {
  if (!isRecord(input)) {
    return { ok: false, error: "Payload inválido." };
  }

  const need = parseNeed(input.need);
  const stage = parseStage(input.stage);
  const scale = parseScale(input.scale);
  const integrations = parseIntegrations(input.integrations);
  const problem = typeof input.problem === "string" ? input.problem.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim() : "";

  if (!need || !stage || !scale || !integrations) {
    return { ok: false, error: "Faltan respuestas del brief." };
  }

  if (problem.length < PROBLEM_MIN || problem.length > PROBLEM_MAX) {
    return { ok: false, error: "Describe el problema en 10 a 2000 caracteres." };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { ok: false, error: "El correo no es válido." };
  }

  return {
    ok: true,
    answers: { need, stage, scale, integrations, problem, email },
  };
}

export function validateTextStep(stepId: "problem" | "email", value: string): string | null {
  const trimmed = value.trim();

  if (stepId === "problem") {
    if (trimmed.length < PROBLEM_MIN) {
      return "Un poco más de contexto nos ayuda a acotar el rango.";
    }
    if (trimmed.length > PROBLEM_MAX) {
      return "Resúmelo en dos frases.";
    }
    return null;
  }

  if (!EMAIL_PATTERN.test(trimmed)) {
    return "Introduce un correo válido.";
  }

  return null;
}

function formatThousands(amount: number): string {
  return (amount / 1000).toLocaleString("es-ES", { maximumFractionDigits: 1 });
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
