export const markets = ["europe", "latam", "north_america", "default"] as const;
export type Market = (typeof markets)[number];
export type MarketSource = "override" | "detected" | "fallback";

export const COUNTRY_COOKIE = "neora-country";
export const DETECTED_MARKET_COOKIE = "neora-market-detected";
export const MARKET_COOKIE = "neora-market";
export const MARKET_OVERRIDE_COOKIE = "neora-market-override";
export const MARKET_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const EUROPE_COUNTRIES = new Set([
  "AL", "AD", "AT", "BY", "BE", "BA", "BG", "HR", "CY", "CZ", "DK", "EE",
  "FI", "FO", "FR", "DE", "GI", "GR", "GG", "HU", "IS", "IE", "IM", "IT", "JE",
  "XK", "LV", "LI", "LT", "LU", "MT", "MD", "MC", "ME", "NL", "MK", "NO", "PL",
  "PT", "RO", "RU", "SM", "RS", "SK", "SI", "ES", "SE", "CH", "TR", "UA", "GB", "VA",
]);

const LATAM_COUNTRIES = new Set([
  "AG", "AR", "AW", "BS", "BB", "BZ", "BO", "BR", "CL", "CO", "CR", "CU", "CW",
  "DM", "DO", "EC", "SV", "GF", "GD", "GP", "GT", "GY", "HT", "HN", "JM", "MQ",
  "MX", "NI", "PA", "PY", "PE", "PR", "BL", "KN", "LC", "MF", "VC", "SR", "TT",
  "UY", "VE",
]);

const NORTH_AMERICA_COUNTRIES = new Set(["US", "CA"]);

export type MarketResolution = {
  country: string | null;
  detectedMarket: Market;
  market: Market;
  source: MarketSource;
};

export function normalizeCountry(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const country = value.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(country) ? country : null;
}

export function isMarket(value: unknown): value is Market {
  return typeof value === "string" && (markets as readonly string[]).includes(value);
}

export function countryToMarket(value: unknown): Market {
  const country = normalizeCountry(value);
  if (!country) return "default";
  if (EUROPE_COUNTRIES.has(country)) return "europe";
  if (LATAM_COUNTRIES.has(country)) return "latam";
  if (NORTH_AMERICA_COUNTRIES.has(country)) return "north_america";
  return "default";
}

export function resolveRequestMarket(countryValue: unknown, overrideValue: unknown): MarketResolution {
  const country = normalizeCountry(countryValue);
  const detectedMarket = countryToMarket(country);
  if (isMarket(overrideValue)) {
    return { country, detectedMarket, market: overrideValue, source: "override" };
  }
  return {
    country,
    detectedMarket,
    market: detectedMarket,
    source: country ? "detected" : "fallback",
  };
}
