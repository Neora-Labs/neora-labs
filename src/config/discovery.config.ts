import type { ProjectCategory } from "@/types/project";

export const discoveryConfig = {
  maxQuestions: 12,
  targetQuestions: 8,
  minimumQuestions: 4,
  minimumConfidenceForConfirmation: 0.72,
  defaultCurrency: "EUR" as const,
  maxMessageLength: 4_000,
  rateLimit: {
    requests: 30,
    windowMs: 10 * 60 * 1_000,
  },
};

export const supportedServices: Record<ProjectCategory, { label: string; description: string }> = {
  web_app: {
    label: "Web / App Development",
    description: "Websites, portals, platforms and custom business applications.",
  },
  ai_automation: {
    label: "AI & Automation",
    description: "AI assistants, intelligent workflows and process automation.",
  },
  integration: {
    label: "Integrations",
    description: "Reliable connections between business systems and data sources.",
  },
};
