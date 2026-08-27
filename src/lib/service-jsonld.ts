import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/es";
import { servicePath, type ServiceItem, type ServicePageCopy } from "@/lib/content";

export function buildServiceJsonLd(options: {
  locale: Locale;
  item: ServiceItem;
  page: ServicePageCopy;
  site: Messages["site"];
}): string {
  const url = `${options.site.url}/${options.locale}${servicePath(options.item.id)}`;
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: options.item.title,
        description: options.page.metaDescription,
        url,
        provider: {
          "@type": "Organization",
          name: options.site.name,
          url: options.site.url,
          email: options.site.email,
        },
        areaServed: ["EU", "US"],
      },
      {
        "@type": "FAQPage",
        mainEntity: options.page.faq.map((entry) => ({
          "@type": "Question",
          name: entry.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: entry.a,
          },
        })),
      },
    ],
  });
}
