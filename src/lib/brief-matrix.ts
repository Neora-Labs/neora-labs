import type { Market } from "@/lib/market";
import {
  BASE_WEEKLY_RATE_EUR,
  getPricingProfile,
  NEED_MARGIN,
  roundMarketAmount,
  STAGE_UNCERTAINTY,
  type Currency,
} from "@/lib/pricing";

export type NeedId =
  | "ai"
  | "automation"
  | "software"
  | "web"
  | "integrations"
  | "unclear";
export type StageId = "idea" | "operating" | "product";
export type ScaleId = "small" | "medium" | "large";
export type IntegrationsId = "none" | "one" | "several";

export type InvestmentBand = {
  min: number;
  max: number;
  currency: Currency;
  weeksMin: number;
  weeksMax: number;
  kind: "project" | "definition";
};

type ProjectNeed = Exclude<NeedId, "unclear">;

type EffortWeeks = {
  weeksMin: number;
  weeksMax: number;
};

const DEFINITION_WEEKS: EffortWeeks = {
  weeksMin: 1,
  weeksMax: 2,
};

const PROJECT_WEEKS: Record<ProjectNeed, Record<IntegrationsId, Record<ScaleId, EffortWeeks>>> = {
  web: {
    none: {
      small: { weeksMin: 2, weeksMax: 4 },
      medium: { weeksMin: 3, weeksMax: 6 },
      large: { weeksMin: 5, weeksMax: 8 },
    },
    one: {
      small: { weeksMin: 3, weeksMax: 6 },
      medium: { weeksMin: 5, weeksMax: 8 },
      large: { weeksMin: 7, weeksMax: 11 },
    },
    several: {
      small: { weeksMin: 5, weeksMax: 9 },
      medium: { weeksMin: 7, weeksMax: 12 },
      large: { weeksMin: 10, weeksMax: 16 },
    },
  },
  automation: {
    none: {
      small: { weeksMin: 3, weeksMax: 6 },
      medium: { weeksMin: 5, weeksMax: 8 },
      large: { weeksMin: 7, weeksMax: 11 },
    },
    one: {
      small: { weeksMin: 5, weeksMax: 8 },
      medium: { weeksMin: 7, weeksMax: 12 },
      large: { weeksMin: 10, weeksMax: 15 },
    },
    several: {
      small: { weeksMin: 8, weeksMax: 13 },
      medium: { weeksMin: 11, weeksMax: 18 },
      large: { weeksMin: 14, weeksMax: 22 },
    },
  },
  software: {
    none: {
      small: { weeksMin: 4, weeksMax: 8 },
      medium: { weeksMin: 6, weeksMax: 12 },
      large: { weeksMin: 10, weeksMax: 16 },
    },
    one: {
      small: { weeksMin: 6, weeksMax: 12 },
      medium: { weeksMin: 10, weeksMax: 16 },
      large: { weeksMin: 14, weeksMax: 22 },
    },
    several: {
      small: { weeksMin: 12, weeksMax: 20 },
      medium: { weeksMin: 16, weeksMax: 26 },
      large: { weeksMin: 22, weeksMax: 34 },
    },
  },
  ai: {
    none: {
      small: { weeksMin: 4, weeksMax: 8 },
      medium: { weeksMin: 6, weeksMax: 10 },
      large: { weeksMin: 8, weeksMax: 14 },
    },
    one: {
      small: { weeksMin: 6, weeksMax: 11 },
      medium: { weeksMin: 8, weeksMax: 14 },
      large: { weeksMin: 12, weeksMax: 18 },
    },
    several: {
      small: { weeksMin: 10, weeksMax: 16 },
      medium: { weeksMin: 14, weeksMax: 22 },
      large: { weeksMin: 18, weeksMax: 28 },
    },
  },
  integrations: {
    none: {
      small: { weeksMin: 3, weeksMax: 6 },
      medium: { weeksMin: 5, weeksMax: 9 },
      large: { weeksMin: 7, weeksMax: 12 },
    },
    one: {
      small: { weeksMin: 5, weeksMax: 9 },
      medium: { weeksMin: 7, weeksMax: 12 },
      large: { weeksMin: 10, weeksMax: 16 },
    },
    several: {
      small: { weeksMin: 8, weeksMax: 14 },
      medium: { weeksMin: 12, weeksMax: 20 },
      large: { weeksMin: 16, weeksMax: 26 },
    },
  },
};

export function lookupInvestmentBand(
  need: NeedId,
  integrations: IntegrationsId,
  scale: ScaleId,
  stage: StageId,
  market: Market,
): InvestmentBand {
  const effort = need === "unclear" ? DEFINITION_WEEKS : PROJECT_WEEKS[need][integrations][scale];
  const pricing = getPricingProfile(market);
  const multiplier = 1 + NEED_MARGIN[need] + STAGE_UNCERTAINTY[stage];
  const rate = BASE_WEEKLY_RATE_EUR[need] * pricing.rateFactor;
  const min = roundMarketAmount(effort.weeksMin * rate * multiplier, market);
  const max = Math.max(
    min + pricing.roundingIncrement,
    roundMarketAmount(effort.weeksMax * rate * multiplier, market),
  );

  return {
    min,
    max,
    currency: pricing.currency,
    weeksMin: effort.weeksMin,
    weeksMax: effort.weeksMax,
    kind: need === "unclear" ? "definition" : "project",
  };
}
