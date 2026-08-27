import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

export function negotiateLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) {
    return defaultLocale;
  }

  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [rawTag, rawQuality] = part.trim().split(";");
      const tag = rawTag?.trim().toLowerCase() ?? "";
      const quality = rawQuality?.trim().startsWith("q=")
        ? Number(rawQuality.trim().slice(2))
        : 1;
      return { tag, quality: Number.isFinite(quality) ? quality : 0 };
    })
    .filter((item) => item.tag.length > 0)
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of ranked) {
    if (isLocale(tag)) {
      return tag;
    }
    const base = tag.split("-")[0];
    if (isLocale(base)) {
      return base;
    }
  }

  return defaultLocale;
}
