import type { Messages } from "@/i18n/messages/es";

export function buildOrgJsonLd(site: Messages["site"]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        name: site.name,
        url: site.url,
        email: site.email,
        areaServed: ["EU", "US"],
        location: [
          { "@type": "Place", address: { "@type": "PostalAddress", addressCountry: "CO" } },
          { "@type": "Place", address: { "@type": "PostalAddress", addressCountry: "PL" } },
          { "@type": "Place", address: { "@type": "PostalAddress", addressCountry: "ES" } },
        ],
      },
    ],
  });
}
