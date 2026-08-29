import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import { AgendaProvider } from "@/components/agenda/AgendaProvider";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MessagesProvider } from "@/components/i18n/MessagesProvider";
import { getMessages } from "@/i18n/get-messages";
import { htmlLang, isLocale, localeLanguages, locales, ogLocale } from "@/i18n/config";
import { getCalEmbedUrl } from "@/lib/cal";
import { themeBootScript } from "@/lib/theme";
import "../globals.css";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1917" },
  ],
  viewportFit: "cover",
};

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  const messages = getMessages(locale);
  return {
    metadataBase: new URL(messages.site.url),
    title: messages.site.title,
    description: messages.site.description,
    applicationName: messages.site.name,
    alternates: {
      canonical: `/${locale}`,
      languages: localeLanguages(),
    },
    openGraph: {
      title: messages.site.title,
      description: messages.site.description,
      locale: ogLocale[locale],
      type: "website",
      siteName: messages.site.name,
    },
    twitter: {
      card: "summary",
      title: messages.site.title,
      description: messages.site.description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const messages = getMessages(locale);

  return (
    <html
      lang={htmlLang[locale]}
      className={`${manrope.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-full bg-bg-default font-sans text-text-primary">
        <MessagesProvider locale={locale} messages={messages}>
          <AgendaProvider calUrl={getCalEmbedUrl()}>
            <a
              href="#contenido"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-[14px] focus:bg-action focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-action-fg"
            >
              {messages.ui.skipToContent}
            </a>
            <Header />
            {children}
            <Footer footer={messages.footer} navItems={messages.navItems} site={messages.site} locale={locale} />
          </AgendaProvider>
        </MessagesProvider>
      </body>
    </html>
  );
}
