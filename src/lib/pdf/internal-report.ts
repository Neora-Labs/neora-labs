import { buildProjectSummary, formatEstimate, getRequirements } from "@/lib/discovery/summary";
import type { DiscoverySnapshot, LeadContact } from "@/types/project";

export function generateInternalReportPdf(snapshot: DiscoverySnapshot, contact: LeadContact): Buffer {
  if (!snapshot.estimate) throw new Error("PDF_GENERATION_ERROR: estimate is missing");
  const spec = snapshot.spec;
  const lines = [
    "NEORA LABS - INFORME INTERNO DE OPORTUNIDAD",
    "",
    `Sesion: ${snapshot.sessionId}`,
    `Fecha: ${new Date().toISOString()}`,
    "",
    "CONTACTO",
    `Nombre: ${contact.name}`,
    `Email: ${contact.email}`,
    `Empresa: ${contact.companyName ?? "No indicada"}`,
    `Telefono: ${contact.phone ?? "No indicado"}`,
    "",
    "PROYECTO",
    ...wrap(buildProjectSummary(spec), 90),
    "",
    `Usuarios estimados: ${spec.users.estimatedCount ?? "No indicado"}`,
    `Requisitos: ${getRequirements(spec).join(", ") || "Por concretar"}`,
    `Presupuesto del cliente: ${formatClientBudget(spec.budget)}`,
    `Estimacion calculada: ${formatEstimate(snapshot.estimate.min, snapshot.estimate.max)}`,
    `Confianza de discovery: ${Math.round(snapshot.estimate.confidence * 100)}%`,
    `Preguntas abiertas: ${spec.openQuestions.join(", ") || "Ninguna esencial"}`,
    "",
    "CONVERSACION",
    ...snapshot.messages.flatMap((message) => wrap(`${message.role === "user" ? "Cliente" : "Agente"}: ${message.content}`, 90)),
    "",
    "Siguiente paso sugerido: revision del alcance y llamada de validacion comercial.",
  ];
  return createSimplePdf(lines);
}

function createSimplePdf(lines: string[]): Buffer {
  const pages = chunk(lines.map(toPdfText), 64);
  const fontObjectId = 3 + pages.length * 2;
  const pageObjectIds = pages.map((_, index) => 3 + index * 2);
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pages.length} >>`,
  ];
  for (let index = 0; index < pages.length; index += 1) {
    const pageObjectId = pageObjectIds[index];
    const contentObjectId = pageObjectId + 1;
    const content = ["BT", "/F1 9 Tf", "50 790 Td", ...pages[index].flatMap((line, lineIndex) => [
      lineIndex === 0 ? `(${line}) Tj` : "0 -11 Td",
      ...(lineIndex === 0 ? [] : [`(${line}) Tj`]),
    ]), "ET"].join("\n");
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontObjectId} 0 R >> >> /Contents ${contentObjectId} 0 R >>`,
      `<< /Length ${Buffer.byteLength(content, "ascii")} >>\nstream\n${content}\nendstream`,
    );
  }
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const chunks = ["%PDF-1.4\n"];
  const offsets = [0];
  for (let index = 0; index < objects.length; index += 1) {
    offsets.push(Buffer.byteLength(chunks.join(""), "ascii"));
    chunks.push(`${index + 1} 0 obj\n${objects[index]}\nendobj\n`);
  }
  const xref = Buffer.byteLength(chunks.join(""), "ascii");
  chunks.push(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`);
  for (const offset of offsets.slice(1)) chunks.push(`${String(offset).padStart(10, "0")} 00000 n \n`);
  chunks.push(`trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
  return Buffer.from(chunks.join(""), "ascii");
}

function chunk<T>(values: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < values.length; index += size) chunks.push(values.slice(index, index + size));
  return chunks.length ? chunks : [[]];
}

function wrap(text: string, width: number): string[] {
  return text.split("\n").flatMap((paragraph) => {
    const words = paragraph.split(/\s+/);
    const lines: string[] = [];
    let line = "";
    for (const word of words) {
      if (`${line} ${word}`.trim().length > width && line) {
        lines.push(line);
        line = word;
      } else line = `${line} ${word}`.trim();
    }
    if (line) lines.push(line);
    return lines.length ? lines : [""];
  });
}

function toPdfText(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7E]/g, "-").replace(/([\\()])/g, "\\$1");
}

function formatClientBudget(budget: DiscoverySnapshot["spec"]["budget"]): string {
  if (!budget) return "No indicado";
  return `${budget.min ?? "?"} - ${budget.max ?? "?"} ${budget.currency ?? "EUR"}`;
}
