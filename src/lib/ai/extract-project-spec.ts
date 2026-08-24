import { buildExtractionInput, buildExtractionInstructions } from "@/lib/ai/prompts";
import { extractionJsonSchema } from "@/lib/ai/schemas";
import { projectSpecSchema } from "@/lib/discovery/schemas";
import { retrieveKnowledgeContext } from "@/lib/rag/retrieve-context";
import { logEvent } from "@/lib/server/log";
import type { ProjectCategory, ProjectSpec } from "@/types/project";

export type ExtractionResult = { spec: ProjectSpec; acknowledgement: string; source: "openai" | "fallback" };

export async function extractProjectRequirements(
  currentSpec: ProjectSpec,
  latestMessage: string,
  currentQuestionId: string | null,
): Promise<ExtractionResult> {
  if (!process.env.OPENAI_API_KEY) {
    return fallbackExtraction(currentSpec, latestMessage, currentQuestionId);
  }

  try {
    const knowledge = await retrieveKnowledgeContext(latestMessage);
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_DISCOVERY_MODEL ?? "gpt-5-mini",
        store: false,
        instructions: buildExtractionInstructions(knowledge),
        input: buildExtractionInput(currentSpec, latestMessage, currentQuestionId),
        text: {
          format: {
            type: "json_schema",
            name: "project_spec_extraction",
            strict: true,
            schema: extractionJsonSchema,
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI response ${response.status}: ${(await response.text()).slice(0, 300)}`);
    }
    const payload = (await response.json()) as { output?: unknown[]; output_text?: string };
    const outputText = payload.output_text ?? findOutputText(payload.output);
    if (!outputText) throw new Error("AI_RESPONSE_INVALID: no output text");
    const parsed = JSON.parse(outputText) as { spec?: unknown; acknowledgement?: unknown };
    const validatedSpec = projectSpecSchema.safeParse(normalizeBudget(parsed.spec));
    if (!validatedSpec.success || typeof parsed.acknowledgement !== "string") {
      throw new Error("AI_RESPONSE_INVALID: structured response did not match the domain schema");
    }
    logEvent("info", "project_specification_updated", { source: "openai" });
    return {
      spec: validatedSpec.data,
      acknowledgement: parsed.acknowledgement.slice(0, 240),
      source: "openai",
    };
  } catch (error) {
    logEvent("warn", "ai_extraction_failed", { message: errorMessage(error) });
    return fallbackExtraction(currentSpec, latestMessage, currentQuestionId);
  }
}

function fallbackExtraction(
  current: ProjectSpec,
  message: string,
  questionId: string | null,
): ExtractionResult {
  const text = message.trim();
  const lower = text.toLocaleLowerCase("es");
  const spec = structuredClone(current);

  const detectedCategory = detectCategory(lower);
  if (detectedCategory) spec.category = detectedCategory;
  if (!spec.projectDescription || questionId === "project_overview") spec.projectDescription = text;
  if (questionId === "business_goal" || (!spec.businessGoal && /(objetivo|queremos|necesitamos|para |mejorar|reducir|aumentar)/i.test(text))) {
    spec.businessGoal = text;
  }
  if (questionId === "users") {
    spec.users.types = unique([...spec.users.types, text]);
    const count = lower.match(/\b(\d[\d.]*)\b/)?.[1];
    if (count) spec.users.estimatedCount = Number(count.replaceAll(".", ""));
  }
  if (questionId === "platforms") spec.platforms = unique([...spec.platforms, ...detectPlatforms(lower)]);
  if (questionId === "existing_system") spec.existingSystem = text;
  if (questionId === "timeline" || /(mes|semana|fecha|trimestre|flexible)/i.test(text)) spec.timeline = text;
  if (questionId === "integration_systems" || questionId === "integrations") {
    spec.integrations = /\b(no|ningun|ninguna|desde cero)\b/i.test(lower)
      ? ["none"]
      : unique([...spec.integrations, text]);
  }

  spec.features.authentication = inferBoolean(lower, ["cuenta", "registro", "login", "usuario"], spec.features.authentication);
  spec.features.payments = inferBoolean(lower, ["pago", "stripe", "cobro", "suscripci"], spec.features.payments);
  spec.features.adminPanel = inferBoolean(lower, ["admin", "panel", "dashboard", "gestionar"], spec.features.adminPanel);
  spec.features.notifications = inferBoolean(lower, ["notific", "email automático", "sms", "whatsapp"], spec.features.notifications);
  spec.features.ai = inferBoolean(lower, ["inteligencia artificial", " ia ", "chatbot", "modelo", "llm"], spec.features.ai);
  if (["core_features", "automation_process", "constraints"].includes(questionId ?? "")) {
    spec.features.additional = unique([...spec.features.additional, text]);
  }
  spec.platforms = unique([...spec.platforms, ...detectPlatforms(lower)]);

  return {
    spec: projectSpecSchema.parse(spec),
    acknowledgement: "Perfecto, he incorporado ese contexto al alcance.",
    source: "fallback",
  };
}

function detectCategory(text: string): ProjectCategory | null {
  if (/(integrar|integración|conectar|sincronizar|api|erp|crm)/i.test(text)) return "integration";
  if (/(automat|inteligencia artificial|\bia\b|chatbot|agente|llm)/i.test(text)) return "ai_automation";
  if (/(web|app|aplicación|plataforma|portal|marketplace|software|tienda)/i.test(text)) return "web_app";
  return null;
}

function detectPlatforms(text: string): string[] {
  const values: string[] = [];
  if (/web|navegador/.test(text)) values.push("web");
  if (/móvil|mobile|ios|android/.test(text)) values.push("mobile");
  if (/escritorio|desktop/.test(text)) values.push("desktop");
  return values;
}

function inferBoolean(text: string, signals: string[], current: boolean | null): boolean | null {
  const matchedSignal = signals.find((signal) => text.includes(signal));
  if (!matchedSignal) return current;
  const signalIndex = text.indexOf(matchedSignal);
  const nearbyPrefix = text.slice(Math.max(0, signalIndex - 30), signalIndex);
  return /\b(no|sin)\s+(?:necesitamos?|queremos?|haría falta\s+)?$/i.test(nearbyPrefix) ? false : true;
}

function unique(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function findOutputText(output: unknown[] | undefined): string | undefined {
  if (!Array.isArray(output)) return undefined;
  for (const item of output) {
    if (!isRecord(item) || !Array.isArray(item.content)) continue;
    for (const content of item.content) {
      if (isRecord(content) && content.type === "output_text" && typeof content.text === "string") {
        return content.text;
      }
    }
  }
  return undefined;
}

function normalizeBudget(value: unknown): unknown {
  if (!isRecord(value) || !isRecord(value.budget)) return value;
  const budget = value.budget;
  return {
    ...value,
    budget: {
      ...(typeof budget.min === "number" ? { min: budget.min } : {}),
      ...(typeof budget.max === "number" ? { max: budget.max } : {}),
      ...(typeof budget.currency === "string" ? { currency: budget.currency } : {}),
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message.slice(0, 300) : "Unknown AI error";
}
