import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceHub } from "@/components/services/ServiceHub";
import { defaultLocale, isLocale, localeLanguages, locales, ogLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/get-messages";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/servicios">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }
  const messages = getMessages(locale);
  const title = `${messages.services.heading} — ${messages.site.name}`;
  return {
    title,
    description: messages.services.intro,
    alternates: {
      canonical: `/${locale}/servicios`,
      languages: localeLanguages("/servicios"),
    },
    openGraph: {
      title,
      description: messages.services.intro,
      locale: ogLocale[locale],
      type: "website",
      siteName: messages.site.name,
    },
  };
}

export default async function ServicesHubPage({ params }: PageProps<"/[locale]/servicios">) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  const resolved = isLocale(locale) ? locale : defaultLocale;
  const messages = getMessages(resolved);

  return (
    <main id="contenido">
      <ServiceHub locale={resolved} services={messages.services} />
    </main>
  );
}
