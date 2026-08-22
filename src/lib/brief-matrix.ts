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
  kind: "project" | "definition";
};

type ProjectNeed = Exclude<NeedId, "unclear">;

const PROJECT_RANGES: Record<
  ProjectNeed,
  Record<IntegrationsId, Record<ScaleId, { min: number; max: number }>>
> = {
  web: {
    none: {
      small: { min: 4_000, max: 10_000 },
      medium: { min: 6_000, max: 14_000 },
      large: { min: 8_000, max: 18_000 },
    },
    one: {
      small: { min: 7_000, max: 16_000 },
      medium: { min: 10_000, max: 22_000 },
      large: { min: 14_000, max: 28_000 },
    },
    several: {
      small: { min: 12_000, max: 26_000 },
      medium: { min: 16_000, max: 34_000 },
      large: { min: 22_000, max: 42_000 },
    },
  },
  automation: {
    none: {
      small: { min: 6_000, max: 16_000 },
      medium: { min: 10_000, max: 22_000 },
      large: { min: 14_000, max: 28_000 },
    },
    one: {
      small: { min: 10_000, max: 24_000 },
      medium: { min: 16_000, max: 32_000 },
      large: { min: 22_000, max: 40_000 },
    },
    several: {
      small: { min: 18_000, max: 36_000 },
      medium: { min: 24_000, max: 48_000 },
      large: { min: 32_000, max: 62_000 },
    },
  },
  software: {
    none: {
      small: { min: 10_000, max: 22_000 },
      medium: { min: 16_000, max: 32_000 },
      large: { min: 22_000, max: 42_000 },
    },
    one: {
      small: { min: 16_000, max: 34_000 },
      medium: { min: 22_000, max: 45_000 },
      large: { min: 30_000, max: 58_000 },
    },
    several: {
      small: { min: 28_000, max: 55_000 },
      medium: { min: 36_000, max: 70_000 },
      large: { min: 45_000, max: 90_000 },
    },
  },
  ai: {
    none: {
      small: { min: 10_000, max: 22_000 },
      medium: { min: 14_000, max: 28_000 },
      large: { min: 18_000, max: 36_000 },
    },
    one: {
      small: { min: 14_000, max: 32_000 },
      medium: { min: 20_000, max: 40_000 },
      large: { min: 26_000, max: 50_000 },
    },
    several: {
      small: { min: 22_000, max: 45_000 },
      medium: { min: 30_000, max: 60_000 },
      large: { min: 40_000, max: 80_000 },
    },
  },
  integrations: {
    none: {
      small: { min: 8_000, max: 18_000 },
      medium: { min: 12_000, max: 24_000 },
      large: { min: 16_000, max: 32_000 },
    },
    one: {
      small: { min: 12_000, max: 28_000 },
      medium: { min: 18_000, max: 36_000 },
      large: { min: 24_000, max: 48_000 },
    },
    several: {
      small: { min: 20_000, max: 42_000 },
      medium: { min: 28_000, max: 55_000 },
      large: { min: 36_000, max: 72_000 },
    },
  },
};

const DEFINITION_RANGE: InvestmentBand = {
  min: 2_500,
  max: 6_000,
  kind: "definition",
};

export function lookupInvestmentBand(
  need: NeedId,
  integrations: IntegrationsId,
  scale: ScaleId,
): InvestmentBand {
  if (need === "unclear") {
    return DEFINITION_RANGE;
  }

  const band = PROJECT_RANGES[need][integrations][scale];
  return { ...band, kind: "project" };
}
