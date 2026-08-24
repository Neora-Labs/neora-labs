import { extractProjectRequirements } from "@/lib/ai/extract-project-spec";
import {
  persistLead,
  persistMessages,
  persistSnapshot,
} from "@/lib/database/discovery.repository";
import {
  determineNextQuestion,
  isDiscoveryComplete,
  withCalculatedDiscoveryState,
} from "@/lib/discovery/discovery.service";
import { createEmptyProjectSpec } from "@/lib/discovery/project-spec";
import { buildProjectSummary, formatEstimate } from "@/lib/discovery/summary";
import { deliverEstimate } from "@/lib/email/send-estimate";
import { calculateEstimate } from "@/lib/pricing/calculate-estimate";
import { logEvent } from "@/lib/server/log";
import type {
  DiscoveryMessage,
  DiscoverySnapshot,
  LeadContact,
  ProjectCategory,
} from "@/types/project";

type InitialCategory = "ai" | "automation" | "software" | "web" | "integrations";

export async function startConversation(
  initialCategory?: InitialCategory,
  initialMessage?: string,
): Promise<DiscoverySnapshot> {
  const spec = createEmptyProjectSpec();
  spec.category = mapInitialCategory(initialCategory);
  let snapshot: DiscoverySnapshot = {
    sessionId: crypto.randomUUID(),
    phase: "discovery",
    messages: [message("assistant", "Vamos a aterrizar tu proyecto. Te haré una pregunta cada vez y aprovecharé todo lo que ya me cuentes.")],
    spec,
    askedQuestionIds: [],
    questionCount: 0,
    currentQuestionId: null,
    quickReplies: [],
    summary: null,
    estimate: null,
    contact: null,
    delivery: null,
  };
  logEvent("info", "conversation_started", { sessionId: snapshot.sessionId });

  if (initialMessage?.trim()) {
    snapshot = await applyVisitorMessage(snapshot, initialMessage.trim());
  } else {
    snapshot = askNextQuestion(snapshot);
  }
  await saveConversation(snapshot);
  return snapshot;
}

export async function continueConversation(
  snapshot: DiscoverySnapshot,
  visitorMessage: string,
): Promise<DiscoverySnapshot> {
  ensurePhase(snapshot, "discovery");
  const next = await applyVisitorMessage(snapshot, visitorMessage);
  await saveConversation(next);
  return next;
}

export async function correctSummary(
  snapshot: DiscoverySnapshot,
  correction: string,
): Promise<DiscoverySnapshot> {
  ensurePhase(snapshot, "confirmation");
  const withUserMessage = append(snapshot, message("user", correction));
  const extraction = await extractProjectRequirements(withUserMessage.spec, correction, "correction");
  const spec = withCalculatedDiscoveryState(extraction.spec);
  const summary = buildProjectSummary(spec);
  const next: DiscoverySnapshot = {
    ...withUserMessage,
    spec,
    summary,
    messages: [
      ...withUserMessage.messages,
      message("assistant", `${extraction.acknowledgement} He actualizado el resumen; revísalo de nuevo.`),
    ],
  };
  await saveConversation(next);
  return next;
}

export async function confirmSummary(snapshot: DiscoverySnapshot): Promise<DiscoverySnapshot> {
  ensurePhase(snapshot, "confirmation");
  const next: DiscoverySnapshot = {
    ...snapshot,
    phase: "contact",
    quickReplies: [],
    messages: [
      ...snapshot.messages,
      message("user", "El resumen es correcto."),
      message("assistant", "Perfecto. Para preparar y enviarte la estimación, solo necesito tu nombre y correo."),
    ],
  };
  await saveConversation(next);
  return next;
}

export async function completeConversation(
  snapshot: DiscoverySnapshot,
  contact: LeadContact,
): Promise<DiscoverySnapshot> {
  ensurePhase(snapshot, "contact");
  const spec = withCalculatedDiscoveryState(snapshot.spec);
  const estimate = calculateEstimate(spec);
  let next: DiscoverySnapshot = {
    ...snapshot,
    phase: "complete",
    spec,
    estimate,
    contact,
    messages: [
      ...snapshot.messages,
      message("user", `${contact.name} · ${contact.email}`),
      message("assistant", `La estimación preliminar para este alcance es ${formatEstimate(estimate.min, estimate.max)}. Nuestro equipo la revisará contigo antes de convertirla en una propuesta.`),
    ],
  };

  await persistSnapshot(next);
  await persistMessages(next.sessionId, next.messages);
  const leadSaved = await persistLead(next.sessionId, contact);
  logEvent("info", "estimate_generated", { sessionId: next.sessionId, min: estimate.min, max: estimate.max });
  logEvent("info", "lead_created", { sessionId: next.sessionId, persisted: leadSaved });

  try {
    const delivery = await deliverEstimate(next, contact);
    next = { ...next, delivery };
    logEvent("info", "estimate_delivery_completed", {
      sessionId: next.sessionId,
      clientEmailSent: delivery.clientEmailSent,
      internalReportSent: delivery.internalReportSent,
    });
  } catch (error) {
    next = { ...next, delivery: { clientEmailSent: false, internalReportSent: false } };
    logEvent("error", "estimate_delivery_failed", { sessionId: next.sessionId, message: errorMessage(error) });
  }
  await persistSnapshot(next);
  return next;
}

async function applyVisitorMessage(
  snapshot: DiscoverySnapshot,
  visitorMessage: string,
): Promise<DiscoverySnapshot> {
  const withUserMessage = append(snapshot, message("user", visitorMessage));
  const extraction = await extractProjectRequirements(
    withUserMessage.spec,
    visitorMessage,
    withUserMessage.currentQuestionId,
  );
  const spec = withCalculatedDiscoveryState(extraction.spec);
  if (spec.category && spec.category !== snapshot.spec.category) {
    logEvent("info", "project_category_detected", { sessionId: snapshot.sessionId, category: spec.category });
  }
  const updated: DiscoverySnapshot = { ...withUserMessage, spec, currentQuestionId: null, quickReplies: [] };
  if (isDiscoveryComplete(spec, updated.questionCount)) {
    const summary = buildProjectSummary(spec);
    logEvent("info", "discovery_completed", { sessionId: updated.sessionId, confidence: spec.discoveryConfidence });
    return {
      ...updated,
      phase: "confirmation",
      summary,
      messages: [
        ...updated.messages,
        message("assistant", `${extraction.acknowledgement} Este es el alcance que he entendido. Confírmalo o dime qué corregir.`),
      ],
    };
  }
  return askNextQuestion(updated, extraction.acknowledgement);
}

function askNextQuestion(snapshot: DiscoverySnapshot, acknowledgement?: string): DiscoverySnapshot {
  const nextQuestion = determineNextQuestion(snapshot.spec, snapshot.askedQuestionIds);
  if (!nextQuestion) {
    const summary = buildProjectSummary(snapshot.spec);
    return {
      ...snapshot,
      phase: "confirmation",
      summary,
      messages: [...snapshot.messages, message("assistant", "Ya tengo suficiente contexto. Revisa este resumen y dime si es correcto.")],
    };
  }
  return {
    ...snapshot,
    askedQuestionIds: [...snapshot.askedQuestionIds, nextQuestion.id],
    questionCount: snapshot.questionCount + 1,
    currentQuestionId: nextQuestion.id,
    quickReplies: nextQuestion.quickReplies ?? [],
    messages: [
      ...snapshot.messages,
      ...(acknowledgement ? [message("assistant", acknowledgement)] : []),
      message("assistant", nextQuestion.prompt),
    ],
  };
}

async function saveConversation(snapshot: DiscoverySnapshot): Promise<void> {
  await persistSnapshot(snapshot);
  await persistMessages(snapshot.sessionId, snapshot.messages);
}

function append(snapshot: DiscoverySnapshot, nextMessage: DiscoveryMessage): DiscoverySnapshot {
  return { ...snapshot, messages: [...snapshot.messages, nextMessage] };
}

function message(role: DiscoveryMessage["role"], content: string): DiscoveryMessage {
  return { id: crypto.randomUUID(), role, content, createdAt: new Date().toISOString() };
}

function ensurePhase(snapshot: DiscoverySnapshot, phase: DiscoverySnapshot["phase"]): void {
  if (snapshot.phase !== phase) throw new Error(`VALIDATION_ERROR: expected ${phase} phase`);
}

function mapInitialCategory(value?: InitialCategory): ProjectCategory | null {
  if (value === "ai" || value === "automation") return "ai_automation";
  if (value === "software" || value === "web") return "web_app";
  if (value === "integrations") return "integration";
  return null;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message.slice(0, 300) : "Unknown delivery error";
}
