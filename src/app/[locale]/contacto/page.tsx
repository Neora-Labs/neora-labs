import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { defaultLocale, isLocale, locales, ogLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/get-messages";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contacto">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }
  const messages = getMessages(locale);
  const title = `${messages.contact.heading} — ${messages.site.name}`;
  return {
    title,
    description: messages.contact.body,
    alternates: {
      canonical: `/${locale}/contacto`,
      languages: {
        es: "/es/contacto",
        en: "/en/contacto",
        pl: "/pl/contacto",
        "x-default": "/es/contacto",
      },
    },
    openGraph: {
      title,
      description: messages.contact.body,
      locale: ogLocale[locale],
      type: "website",
      siteName: messages.site.name,
    },
  };
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contacto">) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  const resolved = isLocale(locale) ? locale : defaultLocale;
  const messages = getMessages(resolved);

  return (
    <main id="contenido">
      <ClosingCta contact={messages.contact} email={messages.site.email} />
    </main>
  );
}
