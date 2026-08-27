import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePage } from "@/components/services/ServicePage";
import { defaultLocale, isLocale, locales, ogLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/get-messages";
import {
  isServiceSlug,
  serviceIdFromSlug,
  serviceSlugs,
} from "@/lib/content";
import { buildServiceJsonLd } from "@/lib/service-jsonld";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    Object.values(serviceSlugs).map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/servicios/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isServiceSlug(slug)) {
    return {};
  }
  const messages = getMessages(locale);
  const id = serviceIdFromSlug(slug);
  if (!id) {
    return {};
  }
  const page = messages.services.servicePages[id];
  const title = `${page.metaTitle} — ${messages.site.name}`;
  const languages = {
    es: `/es/servicios/${slug}`,
    en: `/en/servicios/${slug}`,
    pl: `/pl/servicios/${slug}`,
    "x-default": `/es/servicios/${slug}`,
  } as const;
  return {
    title,
    description: page.metaDescription,
    alternates: {
      canonical: `/${locale}/servicios/${slug}`,
      languages,
    },
    openGraph: {
      title,
      description: page.metaDescription,
      locale: ogLocale[locale],
      type: "website",
      siteName: messages.site.name,
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: PageProps<"/[locale]/servicios/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isServiceSlug(slug)) {
    notFound();
  }
  const resolved = isLocale(locale) ? locale : defaultLocale;
  const id = serviceIdFromSlug(slug);
  if (!id) {
    notFound();
  }
  const messages = getMessages(resolved);
  const item = messages.services.items.find((entry) => entry.id === id);
  if (!item) {
    notFound();
  }
  const page = messages.services.servicePages[id];
  const related = messages.services.items.filter((entry) => entry.id !== id);
  const jsonLd = buildServiceJsonLd({
    locale: resolved,
    item,
    page,
    site: messages.site,
  });

  return (
    <main id="contenido">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <ServicePage
        locale={resolved}
        item={item}
        page={page}
        related={related}
        process={messages.process}
        chrome={messages.services.page}
        contactSchedule={messages.contact.sidebar.schedule}
      />
    </main>
  );
}
