import { buildProjectSummary, formatEstimate, getRequirements } from "@/lib/discovery/summary";
import { generateInternalReportPdf } from "@/lib/pdf/internal-report";
import { site } from "@/lib/content";
import type { DiscoverySnapshot, LeadContact } from "@/types/project";

export async function deliverEstimate(
  snapshot: DiscoverySnapshot,
  contact: LeadContact,
): Promise<{ clientEmailSent: boolean; internalReportSent: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !snapshot.estimate) {
    return { clientEmailSent: false, internalReportSent: false };
  }
  const from = process.env.BRIEF_FROM_EMAIL ?? `Neora Labs <${site.email}>`;
  const estimateLabel = formatEstimate(snapshot.estimate.min, snapshot.estimate.max);
  const clientText = [
    `Hola ${contact.name},`,
    "",
    "Gracias por compartir tu proyecto con Neora Labs.",
    "",
    buildProjectSummary(snapshot.spec),
    "",
    `Estimación preliminar: ${estimateLabel}`,
    snapshot.spec.timeline ? `Calendario indicado: ${snapshot.spec.timeline}` : null,
    "",
    "Esta horquilla es orientativa y no constituye un presupuesto cerrado. Nuestro equipo revisará el alcance y se pondrá en contacto contigo para validar requisitos, calendario e inversión.",
    "",
    "Neora Labs",
  ].filter((line): line is string => line !== null).join("\n");

  const clientEmailSent = await sendResend({
    from,
    to: [contact.email],
    subject: `Estimación preliminar de tu proyecto — Neora Labs`,
    text: clientText,
  }, apiKey);

  const internalEmail = process.env.INTERNAL_REPORT_EMAIL ?? site.email;
  const pdf = generateInternalReportPdf(snapshot, contact);
  const internalReportSent = await sendResend({
    from,
    to: [internalEmail],
    reply_to: contact.email,
    subject: `Nueva oportunidad: ${contact.companyName ?? contact.name}`,
    text: [
      `Contacto: ${contact.name} <${contact.email}>`,
      `Categoría: ${snapshot.spec.category ?? "sin clasificar"}`,
      `Estimación: ${estimateLabel}`,
      `Requisitos: ${getRequirements(snapshot.spec).join(", ") || "por concretar"}`,
      "El informe completo se adjunta en PDF.",
    ].join("\n"),
    attachments: [{ filename: `neora-discovery-${snapshot.sessionId}.pdf`, content: pdf.toString("base64") }],
  }, apiKey);

  return { clientEmailSent, internalReportSent };
}

type ResendPayload = {
  from: string;
  to: string[];
  subject: string;
  text: string;
  reply_to?: string;
  attachments?: Array<{ filename: string; content: string }>;
};

async function sendResend(payload: ResendPayload, apiKey: string): Promise<boolean> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`EMAIL_DELIVERY_ERROR: ${response.status} ${(await response.text()).slice(0, 300)}`);
  return true;
}
