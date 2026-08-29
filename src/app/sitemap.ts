import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { es } from "@/i18n/messages/es";
import { serviceSlugs } from "@/lib/content";

const paths = [
  "",
  "/servicios",
  ...Object.values(serviceSlugs).map((slug) => `/servicios/${slug}`),
  "/contacto",
  "/privacidad",
  "/aviso-legal",
  "/cookies",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = es.site.url;

  return paths.map((path) => ({
    url: `${base}/es${path}`,
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(locales.map((locale) => [locale, `${base}/${locale}${path}`])),
    },
  }));
}
