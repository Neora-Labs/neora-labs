import { Hero } from "@/components/sections/Hero";
import { Positioning } from "@/components/sections/Positioning";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { Values } from "@/components/sections/Values";
import { getMessages } from "@/i18n/get-messages";
import { defaultLocale, isLocale } from "@/i18n/config";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  const resolved = isLocale(locale) ? locale : defaultLocale;
  const messages = getMessages(resolved);

  return (
    <main id="contenido">
      <Hero hero={messages.hero} />
      <Positioning
        testimonials={messages.testimonials}
        testimonialsAria={messages.ui.testimonials.aria}
      />
      <Services />
      <Process process={messages.process} />
      <Values international={messages.international} />
    </main>
  );
}
