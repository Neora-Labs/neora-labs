import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalArticle } from "@/components/legal/LegalArticle";
import { isLocale, localeLanguages, localePath, locales, ogLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/get-messages";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/aviso-legal">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }
  const messages = getMessages(locale);
  return {
    title: `${messages.legalNotice.title} — ${messages.site.name}`,
    description: messages.legalNotice.intro,
    alternates: {
      canonical: `/${locale}/aviso-legal`,
      languages: localeLanguages("/aviso-legal"),
    },
    openGraph: {
      title: `${messages.legalNotice.title} — ${messages.site.name}`,
      description: messages.legalNotice.intro,
      locale: ogLocale[locale],
      type: "website",
      siteName: messages.site.name,
    },
  };
}

export default async function LegalNoticePage({ params }: PageProps<"/[locale]/aviso-legal">) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  const messages = getMessages(locale);
  const { legalNotice, site } = messages;

  return (
    <LegalArticle
      title={legalNotice.title}
      updated={legalNotice.updated}
      intro={legalNotice.intro}
      sections={legalNotice.sections}
      vars={{ email: site.email }}
      backHref={localePath(locale, "#inicio")}
      backLabel={legalNotice.back}
    />
  );
}
