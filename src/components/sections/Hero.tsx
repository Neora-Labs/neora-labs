import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { HeroStage } from "@/components/hero/HeroStage";
import type { Messages } from "@/i18n/messages/es";

type HeroProps = {
  hero: Messages["hero"];
  sprint: Messages["brief"]["sprint"];
};

export function Hero({ hero, sprint }: HeroProps) {
  return (
    <section
      id="inicio"
      className="bg-bg-default scroll-mt-14 md:scroll-mt-[88px] xl:scroll-mt-[104px]"
    >
      <Reveal className="mx-auto flex w-full max-w-[900px] flex-col items-center px-5 pt-16 pb-10 text-center md:px-10 md:pt-20 xl:pt-[72px]">
        <Badge>{hero.badge}</Badge>
        <h1 className="mt-6 text-[36px] leading-[44px] font-extrabold tracking-[-1.5px] text-text-primary md:text-5xl md:leading-[56px] xl:text-[64px] xl:leading-[72px]">
          {hero.headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="mt-6 max-w-[640px] text-lg leading-7 text-text-secondary">
          {hero.body}
        </p>
        <aside className="mt-8 max-w-[640px] rounded-2xl border border-border-default bg-surface px-5 py-4 text-left">
          <p className="text-xs font-semibold tracking-[0.2px] text-accent">{sprint.badge}</p>
          <p className="mt-2 font-semibold text-text-primary">{sprint.title}</p>
          <p className="mt-1 text-sm leading-6 text-text-secondary">{sprint.body}</p>
          <p className="mt-3 text-sm font-bold text-text-brand">{sprint.price}</p>
        </aside>
      </Reveal>
      <HeroStage />
    </section>
  );
}
