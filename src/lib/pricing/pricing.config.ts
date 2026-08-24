import type { ProjectCategory } from "@/types/project";

export const pricingRules = {
  currency: "EUR" as const,
  base: {
    web_app: 6_000,
    ai_automation: 8_000,
    integration: 5_500,
  } satisfies Record<ProjectCategory, number>,
  features: {
    authentication: 1_200,
    payments: 1_800,
    adminPanel: 2_000,
    notifications: 800,
    ai: 3_000,
    additional: 750,
  },
  integration: 1_000,
  multiPlatform: 2_500,
  complexityMultipliers: {
    standard: 1,
    complex: 1.25,
    high: 1.5,
  },
  uncertainty: {
    low: { min: 0.95, max: 1.15 },
    medium: { min: 0.9, max: 1.3 },
    high: { min: 0.8, max: 1.5 },
  },
  minimumEstimate: 4_000,
  rounding: 500,
};
