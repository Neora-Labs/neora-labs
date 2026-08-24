import type { ProjectCategory, ProjectSpec, QuickReply } from "@/types/project";

export type DiscoveryQuestion = {
  id: string;
  categories?: ProjectCategory[];
  prompt: string;
  quickReplies?: QuickReply[];
  isAnswered: (spec: ProjectSpec) => boolean;
};

const allCategories: ProjectCategory[] = ["web_app", "ai_automation", "integration"];

export const discoveryQuestions: readonly DiscoveryQuestion[] = [
  {
    id: "project_overview",
    categories: allCategories,
    prompt: "Cuéntame qué quieres crear o mejorar y qué problema debería resolver.",
    isAnswered: (spec) => Boolean(spec.projectDescription && spec.businessGoal),
  },
  {
    id: "business_goal",
    categories: allCategories,
    prompt: "¿Qué resultado de negocio esperas conseguir con este proyecto?",
    isAnswered: (spec) => Boolean(spec.businessGoal),
  },
  {
    id: "category",
    categories: allCategories,
    prompt: "Por lo que describes, ¿dirías que es principalmente una aplicación, una automatización con IA o una integración entre sistemas?",
    quickReplies: [
      { label: "Web / aplicación", value: "Es principalmente una web o aplicación." },
      { label: "IA y automatización", value: "Es principalmente IA y automatización." },
      { label: "Integración", value: "Es principalmente una integración entre sistemas." },
    ],
    isAnswered: (spec) => spec.category !== null,
  },
  {
    id: "users",
    categories: ["web_app", "ai_automation"],
    prompt: "¿Quiénes lo utilizarán y, aproximadamente, cuántas personas esperas?",
    isAnswered: (spec) => spec.users.types.length > 0,
  },
  {
    id: "platforms",
    categories: ["web_app"],
    prompt: "¿Dónde debe funcionar: web, móvil, escritorio o una combinación?",
    quickReplies: [
      { label: "Solo web", value: "Debe funcionar como aplicación web." },
      { label: "Web responsive", value: "Web responsive para ordenador y móvil." },
      { label: "Web + móvil", value: "Necesitamos web y aplicación móvil." },
    ],
    isAnswered: (spec) => spec.platforms.length > 0,
  },
  {
    id: "core_features",
    categories: ["web_app"],
    prompt: "¿Cuáles son las funciones imprescindibles para la primera versión?",
    isAnswered: (spec) =>
      spec.features.additional.length > 0 ||
      [spec.features.authentication, spec.features.payments, spec.features.adminPanel].some(
        (value) => value !== null,
      ),
  },
  {
    id: "automation_process",
    categories: ["ai_automation"],
    prompt: "Descríbeme el proceso actual: ¿qué entra, qué decisiones se toman y qué resultado debería producirse?",
    isAnswered: (spec) => spec.features.additional.length > 0,
  },
  {
    id: "integration_systems",
    categories: ["integration"],
    prompt: "¿Qué sistemas o fuentes de datos hay que conectar y qué información debe circular entre ellos?",
    isAnswered: (spec) => spec.integrations.length > 0,
  },
  {
    id: "existing_system",
    categories: allCategories,
    prompt: "¿Partimos de algo que ya existe o sería una solución nueva desde cero?",
    quickReplies: [
      { label: "Desde cero", value: "Es una solución nueva desde cero." },
      { label: "Ya existe", value: "Ya existe un sistema que debemos mejorar o ampliar." },
    ],
    isAnswered: (spec) => Boolean(spec.existingSystem),
  },
  {
    id: "integrations",
    categories: ["web_app", "ai_automation"],
    prompt: "¿Debe conectarse con herramientas o sistemas externos? Si sí, ¿cuáles?",
    quickReplies: [{ label: "Ninguna", value: "No necesita integraciones externas." }],
    isAnswered: (spec) => spec.integrations.length > 0 || mentionsNoIntegrations(spec),
  },
  {
    id: "timeline",
    categories: allCategories,
    prompt: "¿Tienes una fecha objetivo o alguna restricción importante de calendario?",
    quickReplies: [
      { label: "1–2 meses", value: "El objetivo es lanzarlo en uno o dos meses." },
      { label: "3–4 meses", value: "El objetivo es lanzarlo en tres o cuatro meses." },
      { label: "Flexible", value: "El calendario es flexible." },
    ],
    isAnswered: (spec) => Boolean(spec.timeline),
  },
  {
    id: "constraints",
    categories: allCategories,
    prompt: "¿Hay alguna condición importante que aún no hayamos cubierto — seguridad, normativa, volumen o tecnología?",
    quickReplies: [{ label: "Nada más", value: "No hay más condiciones importantes por ahora." }],
    isAnswered: () => false,
  },
];

function mentionsNoIntegrations(spec: ProjectSpec): boolean {
  return spec.openQuestions.includes("NO_INTEGRATIONS");
}
