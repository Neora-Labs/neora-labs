import type { MetadataRoute } from "next";
import { es } from "@/i18n/messages/es";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${es.site.url}/sitemap.xml`,
  };
}
