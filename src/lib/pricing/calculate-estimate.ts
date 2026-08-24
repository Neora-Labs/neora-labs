import { pricingRules } from "@/lib/pricing/pricing.config";
import type { ProjectEstimate, ProjectSpec } from "@/types/project";

export function calculateEstimate(spec: ProjectSpec): ProjectEstimate {
  if (!spec.category) {
    throw new Error("PRICING_CONFIGURATION_ERROR: project category is required");
  }

  let subtotal = pricingRules.base[spec.category];
  const featureKeys = ["authentication", "payments", "adminPanel", "notifications", "ai"] as const;
  for (const key of featureKeys) {
    if (spec.features[key] === true) {
      subtotal += pricingRules.features[key];
    }
  }

  subtotal += spec.features.additional.length * pricingRules.features.additional;
  subtotal += spec.integrations.length * pricingRules.integration;
  if (spec.platforms.length > 1) {
    subtotal += (spec.platforms.length - 1) * pricingRules.multiPlatform;
  }

  const complexity = getComplexityMultiplier(spec);
  const uncertainty = getUncertainty(spec.discoveryConfidence);
  const adjusted = subtotal * complexity;

  return {
    min: round(Math.max(pricingRules.minimumEstimate, adjusted * uncertainty.min)),
    max: round(Math.max(pricingRules.minimumEstimate, adjusted * uncertainty.max)),
    currency: pricingRules.currency,
    confidence: spec.discoveryConfidence,
  };
}

function getComplexityMultiplier(spec: ProjectSpec): number {
  const signals =
    spec.integrations.length +
    spec.features.additional.length +
    spec.platforms.length +
    (spec.features.payments ? 2 : 0) +
    (spec.features.ai ? 2 : 0);
  if (signals >= 9) return pricingRules.complexityMultipliers.high;
  if (signals >= 5) return pricingRules.complexityMultipliers.complex;
  return pricingRules.complexityMultipliers.standard;
}

function getUncertainty(confidence: number) {
  if (confidence >= 0.85) return pricingRules.uncertainty.low;
  if (confidence >= 0.65) return pricingRules.uncertainty.medium;
  return pricingRules.uncertainty.high;
}

function round(value: number): number {
  return Math.ceil(value / pricingRules.rounding) * pricingRules.rounding;
}
