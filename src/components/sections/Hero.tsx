import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { HeroStage } from "@/components/hero/HeroStage";
import { hero } from "@/lib/content";

export function Hero() {
  return (
    <section
      id="inicio"
      className="bg-bg-default scroll-mt-[72px] md:scroll-mt-[88px] xl:scroll-mt-[104px]"
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
      </Reveal>
      <HeroStage />
    </section>
  );
}
