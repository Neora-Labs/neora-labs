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
}: PageProps<"/[locale]/cookies">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }
  const messages = getMessages(locale);
  return {
    title: `${messages.cookies.title} — ${messages.site.name}`,
    description: messages.cookies.intro,
    alternates: {
      canonical: `/${locale}/cookies`,
      languages: localeLanguages("/cookies"),
    },
    openGraph: {
      title: `${messages.cookies.title} — ${messages.site.name}`,
      description: messages.cookies.intro,
      locale: ogLocale[locale],
      type: "website",
      siteName: messages.site.name,
    },
  };
}

export default async function CookiesPage({ params }: PageProps<"/[locale]/cookies">) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  const messages = getMessages(locale);
  const { cookies } = messages;

  return (
    <LegalArticle
      title={cookies.title}
      updated={cookies.updated}
      intro={cookies.intro}
      sections={cookies.sections}
      backHref={localePath(locale, "#inicio")}
      backLabel={cookies.back}
    />
  );
}
