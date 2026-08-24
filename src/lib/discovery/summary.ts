import { supportedServices } from "@/config/discovery.config";
import type { ProjectSpec } from "@/types/project";

export function buildProjectSummary(spec: ProjectSpec): string {
  const lines = [
    spec.businessGoal ? `Objetivo: ${spec.businessGoal}` : null,
    spec.category ? `Tipo de proyecto: ${supportedServices[spec.category].label}` : null,
    spec.projectDescription ? `Solución: ${spec.projectDescription}` : null,
    spec.users.types.length ? `Usuarios: ${spec.users.types.join(", ")}` : null,
    spec.platforms.length ? `Plataformas: ${spec.platforms.join(", ")}` : null,
    getRequirements(spec).length ? `Requisitos principales: ${getRequirements(spec).join(", ")}` : null,
    spec.integrations.length ? `Integraciones: ${spec.integrations.map((item) => item === "none" ? "ninguna" : item).join(", ")}` : null,
    spec.existingSystem ? `Punto de partida: ${spec.existingSystem}` : null,
    spec.timeline ? `Calendario: ${spec.timeline}` : null,
  ];
  return lines.filter((line): line is string => Boolean(line)).join("\n");
}

export function getRequirements(spec: ProjectSpec): string[] {
  const named = [
    spec.features.authentication ? "cuentas y acceso" : null,
    spec.features.payments ? "pagos" : null,
    spec.features.adminPanel ? "panel de gestión" : null,
    spec.features.notifications ? "notificaciones" : null,
    spec.features.ai ? "funcionalidad de IA" : null,
  ];
  return [...named.filter((item): item is string => Boolean(item)), ...spec.features.additional];
}

export function formatEstimate(min: number, max: number): string {
  const formatter = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
  return `${formatter.format(min)} – ${formatter.format(max)}`;
}
