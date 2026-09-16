import { bcp47, type Locale } from "@/i18n/config";
import type { Market } from "@/lib/market";

export type Currency = "EUR" | "USD";
export type PricingNeed = "ai" | "automation" | "software" | "web" | "integrations" | "unclear";
export type PricingStage = "idea" | "operating" | "product";

export type PricingProfile = {
  currency: Currency;
  sprintAmount: number;
  sprintWeeks: number;
  rateFactor: number;
  roundingIncrement: number;
};

const EUROPE_PROFILE: PricingProfile = {
  currency: "EUR",
  sprintAmount: 750,
  sprintWeeks: 1,
  rateFactor: 1,
  roundingIncrement: 500,
};

// These market profiles are intentionally isolated here so commercial review can
// change them without touching UI, routing, or advisory logic.
export const PRICING_BY_MARKET: Readonly<Record<Market, PricingProfile>> = {
  europe: EUROPE_PROFILE,
  latam: { currency: "USD", sprintAmount: 390, sprintWeeks: 1, rateFactor: 0.52, roundingIncrement: 500 },
  north_america: { currency: "USD", sprintAmount: 950, sprintWeeks: 1, rateFactor: 1.27, roundingIncrement: 500 },
  default: EUROPE_PROFILE,
};

export const BASE_WEEKLY_RATE_EUR: Readonly<Record<PricingNeed, number>> = {
  web: 3_500,
  automation: 4_000,
  software: 4_500,
  integrations: 4_500,
  ai: 5_000,
  unclear: 3_500,
};

export const NEED_MARGIN: Readonly<Record<PricingNeed, number>> = {
  web: 0.22,
  automation: 0.28,
  software: 0.32,
  integrations: 0.36,
  ai: 0.38,
  unclear: 0.2,
};

export const STAGE_UNCERTAINTY: Readonly<Record<PricingStage, number>> = {
  operating: 0,
  product: 0.08,
  idea: 0.18,
};

export function getPricingProfile(market: Market): PricingProfile {
  return PRICING_BY_MARKET[market];
}

export function roundMarketAmount(amount: number, market: Market): number {
  const increment = getPricingProfile(market).roundingIncrement;
  return Math.max(increment, Math.round(amount / increment) * increment);
}

export function formatInvestmentBand(min: number, max: number, market: Market, locale: Locale): string {
  const profile = getPricingProfile(market);
  const formattedMin = formatThousands(min, locale);
  const formattedMax = formatThousands(max, locale);
  const currency = profile.currency === "EUR" ? "€" : "USD";
  return `${formattedMin}–${formattedMax} k${profile.currency === "EUR" ? currency : ` ${currency}`}`;
}

export function formatSprintInvestment(market: Market, locale: Locale): string {
  const profile = getPricingProfile(market);
  const amount = profile.sprintAmount.toLocaleString(bcp47[locale], { maximumFractionDigits: 0 });
  return `${amount} ${profile.currency === "EUR" ? "€" : "USD"}`;
}

function formatThousands(amount: number, locale: Locale): string {
  return (amount / 1000).toLocaleString(bcp47[locale], { maximumFractionDigits: 1 });
}
