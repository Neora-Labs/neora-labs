export const locales = ["es", "en", "pl"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

export const LOCALE_COOKIE = "neora-locale";

export const localeNames: Record<Locale, string> = {
  es: "Español",
  en: "English",
  pl: "Polski",
};

export const localeCodes: Record<Locale, string> = {
  es: "ES",
  en: "EN",
  pl: "PL",
};

export const htmlLang: Record<Locale, string> = {
  es: "es",
  en: "en",
  pl: "pl",
};

export const ogLocale: Record<Locale, string> = {
  es: "es_ES",
  en: "en_US",
  pl: "pl_PL",
};

export const bcp47: Record<Locale, string> = {
  es: "es-ES",
  en: "en-US",
  pl: "pl-PL",
};

export const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "es" || value === "en" || value === "pl";
}

export function localePath(locale: Locale, path: string): string {
  if (path.startsWith("#")) {
    return `/${locale}${path}`;
  }
  if (path.startsWith("/")) {
    return `/${locale}${path}`;
  }
  return `/${locale}/${path}`;
}

export function localeLanguages(path = ""): Record<string, string> {
  const suffix = path === "" || path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return {
    es: `/es${suffix}`,
    en: `/en${suffix}`,
    pl: `/pl${suffix}`,
    "x-default": `/es${suffix}`,
  };
}
