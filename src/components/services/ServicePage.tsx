import { AgendaTrigger } from "@/components/agenda/AgendaProvider";
import { ServiceVisual } from "@/components/services/ServiceVisual";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { localePath, type Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/es";
import type { ServiceItem, ServicePageCopy } from "@/lib/content";

type ServicePageProps = {
  locale: Locale;
  item: ServiceItem;
  page: ServicePageCopy;
  related: ServiceItem[];
  process: Messages["process"];
  chrome: Messages["services"]["page"];
  contactSchedule: string;
};

export function ServicePage({
  locale,
  item,
  page,
  related,
  process,
  chrome,
  contactSchedule,
}: ServicePageProps) {
  const briefHref = localePath(locale, "#brief");
  const contactHref = localePath(locale, "/contacto");

  return (
    <>
      <section className="bg-ink">
        <div className="mx-auto grid w-full max-w-[1440px] items-center gap-10 px-5 py-16 md:px-10 md:py-20 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:gap-16 xl:px-24 xl:py-[96px]">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.2px] text-accent">{item.eyebrow}</p>
            <h1 className="mt-5 text-[32px] leading-10 font-extrabold tracking-[-0.8px] text-core-white md:text-[40px] md:leading-[48px] xl:text-5xl xl:leading-[56px]">
              {page.hero.heading}
            </h1>
            <p className="mt-5 max-w-[560px] text-lg leading-7 text-core-white/72">{page.hero.body}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href={briefHref}>{page.hero.primaryCta}</Button>
              <AgendaTrigger variant="secondary">{contactSchedule}</AgendaTrigger>
            </div>
          </Reveal>
          <Reveal className="overflow-hidden rounded-[18px] border border-core-white/15">
            <ServiceVisual item={item} className="h-[280px] sm:h-[360px] xl:h-[420px]" sizes="(min-width: 1280px) 560px, 100vw" />
          </Reveal>
        </div>
      </section>

      <section className="bg-bg-default">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16 md:px-10 md:py-20 xl:px-24 xl:py-[96px]">
          <Reveal className="max-w-[640px]">
            <p className="text-xs font-semibold tracking-[0.2px] text-text-brand">{chrome.painsEyebrow}</p>
            <h2 className="mt-5 text-[32px] leading-10 font-bold tracking-[-0.8px] text-text-primary md:text-[40px] md:leading-[48px]">
              {chrome.painsHeading}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {page.pains.map((pain) => (
              <Reveal key={pain.title}>
                <Card>
                  <h3 className="text-lg font-semibold text-text-primary">{pain.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">{pain.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bg-subtle">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16 md:px-10 md:py-20 xl:px-24 xl:py-[96px]">
          <Reveal className="max-w-[640px]">
            <p className="text-xs font-semibold tracking-[0.2px] text-text-brand">
              {chrome.capabilitiesEyebrow}
            </p>
            <h2 className="mt-5 text-[32px] leading-10 font-bold tracking-[-0.8px] text-text-primary md:text-[40px] md:leading-[48px]">
              {chrome.capabilitiesHeading}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {page.capabilities.map((capability) => (
              <Reveal key={capability.title}>
                <Card className="bg-surface-raised">
                  <h3 className="text-lg font-semibold text-text-primary">{capability.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">{capability.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bg-default">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16 md:px-10 md:py-20 xl:px-24 xl:py-[96px]">
          <Reveal className="max-w-[720px]">
            <p className="text-xs font-semibold tracking-[0.2px] text-text-brand">{chrome.flowEyebrow}</p>
            <h2 className="mt-5 text-[32px] leading-10 font-bold tracking-[-0.8px] text-text-primary md:text-[40px] md:leading-[48px]">
              {page.flow.heading}
            </h2>
          </Reveal>
          <ol className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {page.flow.steps.map((step, index) => (
              <Reveal key={step}>
                <li className="flex h-full flex-col rounded-3xl border border-border-default bg-surface p-5">
                  <p className="text-xs font-semibold tracking-[0.2px] text-text-brand">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-text-secondary">{step}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-bg-brand-soft">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16 md:px-10 md:py-20 xl:px-24 xl:py-[96px]">
          <Reveal className="max-w-[640px]">
            <p className="text-xs font-semibold tracking-[0.2px] text-text-brand">{chrome.processEyebrow}</p>
            <h2 className="mt-5 text-[32px] leading-10 font-bold tracking-[-0.8px] text-text-primary md:text-[40px] md:leading-[48px]">
              {chrome.processHeading}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {process.steps.map((step) => (
              <Reveal key={step.id}>
                <article className="rounded-3xl border border-border-default bg-surface p-5">
                  <p className="text-xs font-semibold tracking-[0.2px] text-text-brand">{step.number}</p>
                  <h3 className="mt-3 text-lg font-semibold text-text-primary">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">{step.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bg-default">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16 md:px-10 md:py-20 xl:px-24 xl:py-[96px]">
          <Reveal className="max-w-[640px]">
            <p className="text-xs font-semibold tracking-[0.2px] text-text-brand">{chrome.faqEyebrow}</p>
            <h2 className="mt-5 text-[32px] leading-10 font-bold tracking-[-0.8px] text-text-primary md:text-[40px] md:leading-[48px]">
              {chrome.faqHeading}
            </h2>
          </Reveal>
          <div className="mt-10 flex max-w-[800px] flex-col gap-8">
            {page.faq.map((entry) => (
              <Reveal key={entry.q}>
                <h3 className="text-lg font-semibold text-text-primary">{entry.q}</h3>
                <p className="mt-2 text-base leading-7 text-text-secondary">{entry.a}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="bg-bg-subtle">
          <div className="mx-auto w-full max-w-[1440px] px-5 py-16 md:px-10 md:py-20 xl:px-24 xl:py-[96px]">
            <Reveal>
              <h2 className="text-[32px] leading-10 font-bold tracking-[-0.8px] text-text-primary md:text-[40px] md:leading-[48px]">
                {chrome.relatedHeading}
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {related.map((other) => (
                <Reveal key={other.id}>
                  <a
                    href={localePath(locale, other.href)}
                    className="block rounded-3xl border border-border-default bg-surface p-5 transition-colors hover:bg-bg-brand-soft"
                  >
                    <p className="text-[11px] font-semibold tracking-[0.9px] text-accent">{other.eyebrow}</p>
                    <p className="mt-2 text-base font-semibold text-text-primary">{other.title}</p>
                    <p className="mt-2 text-sm leading-6 text-text-secondary">{other.summary}</p>
                    <p className="mt-4 text-sm font-semibold text-text-brand">{chrome.viewService}</p>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-bg-default">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-5 py-16 md:px-10 md:py-20 xl:px-24 xl:py-[96px]">
          <Reveal className="max-w-[640px]">
            <h2 className="text-[32px] leading-10 font-bold tracking-[-0.8px] text-text-primary md:text-[40px] md:leading-[48px]">
              {page.close.heading}
            </h2>
            <p className="mt-4 text-lg leading-7 text-text-secondary">{page.close.body}</p>
          </Reveal>
          <Reveal className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href={briefHref}>{page.hero.primaryCta}</Button>
            <AgendaTrigger>{contactSchedule}</AgendaTrigger>
            <Button href={contactHref} variant="secondary">
              {chrome.contactCta}
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
