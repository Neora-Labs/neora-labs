import { Hero } from "@/components/sections/Hero";
import { Positioning } from "@/components/sections/Positioning";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { Values } from "@/components/sections/Values";
import { getMessages } from "@/i18n/get-messages";
import { defaultLocale, isLocale } from "@/i18n/config";
import { buildOrgJsonLd } from "@/lib/org-jsonld";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  const resolved = isLocale(locale) ? locale : defaultLocale;
  const messages = getMessages(resolved);

  return (
    <main id="contenido">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildOrgJsonLd(messages.site) }}
      />
      <Hero hero={messages.hero} />
      <Positioning
        criteria={messages.criteria}
        criteriaAria={messages.ui.criteria.aria}
      />
      <Services />
      <Process process={messages.process} />
      <Values international={messages.international} />
    </main>
  );
}
