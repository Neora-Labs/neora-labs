import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { defaultLocale, isLocale, localePath, locales, ogLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/get-messages";
import { interpolate } from "@/i18n/interpolate";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/privacidad">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }
  const messages = getMessages(locale);
  return {
    title: `${messages.privacy.title} — ${messages.site.name}`,
    description: messages.privacy.intro,
    alternates: {
      canonical: `/${locale}/privacidad`,
    },
    openGraph: {
      title: `${messages.privacy.title} — ${messages.site.name}`,
      description: messages.privacy.intro,
      locale: ogLocale[locale],
      type: "website",
      siteName: messages.site.name,
    },
  };
}

export default async function PrivacyPage({ params }: PageProps<"/[locale]/privacidad">) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  const resolved = isLocale(locale) ? locale : defaultLocale;
  const messages = getMessages(resolved);
  const { privacy, site } = messages;

  return (
    <main id="contenido" className="bg-bg-default">
      <article className="mx-auto w-full max-w-[720px] px-5 py-16 md:px-10 md:py-20 xl:py-[96px]">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.2px] text-text-brand">
            {privacy.updated}
          </p>
          <h1 className="mt-5 text-[32px] leading-10 font-bold tracking-[-0.8px] text-text-primary md:text-[40px] md:leading-[48px]">
            {privacy.title}
          </h1>
          <p className="mt-5 text-lg leading-7 text-text-secondary">{privacy.intro}</p>
        </Reveal>
        <div className="mt-10 flex flex-col gap-8">
          {privacy.sections.map((section) => (
            <Reveal key={section.heading}>
              <h2 className="text-lg font-semibold text-text-primary">{section.heading}</h2>
              <p className="mt-2 text-base leading-7 text-text-secondary">
                {interpolate(section.body, { email: site.email })}
              </p>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-12">
          <a
            href={localePath(resolved, "#inicio")}
            className="text-sm font-semibold text-text-brand transition-colors hover:text-text-primary"
          >
            {privacy.back}
          </a>
        </Reveal>
      </article>
    </main>
  );
}
