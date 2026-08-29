import { ServiceVisual } from "@/components/services/ServiceVisual";
import { Reveal } from "@/components/ui/Reveal";
import { localePath, type Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/es";

type ServiceHubProps = {
  locale: Locale;
  services: Messages["services"];
};

export function ServiceHub({ locale, services }: ServiceHubProps) {
  return (
    <section className="bg-bg-default">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-16 md:px-10 md:py-20 xl:px-24 xl:py-[96px]">
        <Reveal className="max-w-[640px]">
          <p className="text-xs font-semibold tracking-[0.2px] text-text-brand">{services.eyebrow}</p>
          <h1 className="mt-5 text-[32px] leading-10 font-bold tracking-[-0.8px] text-text-primary md:text-[40px] md:leading-[48px] xl:text-5xl xl:leading-[56px]">
            {services.heading}
          </h1>
          <p className="mt-5 text-lg leading-7 text-text-secondary">{services.intro}</p>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {services.items.map((item) => (
            <Reveal key={item.id}>
              <a
                href={localePath(locale, item.href)}
                className="flex h-full flex-col overflow-hidden rounded-3xl border border-border-default bg-surface transition-colors hover:border-border-strong"
              >
                <ServiceVisual item={item} className="h-44" sizes="(min-width: 1280px) 400px, 50vw" />
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[11px] font-semibold tracking-[0.9px] text-accent">{item.eyebrow}</p>
                  <p className="mt-2 text-lg font-semibold text-text-primary">{item.title}</p>
                  <p className="mt-2 flex-1 text-sm leading-6 text-text-secondary">{item.summary}</p>
                  <p className="mt-4 text-sm font-semibold text-text-brand">{services.page.viewService}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
