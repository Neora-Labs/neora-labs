import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { closingCta, site } from "@/lib/content";

export function ClosingCta() {
  return (
    <section
      id="contacto"
      className="scroll-mt-[72px] bg-bg-brand-soft md:scroll-mt-[88px] xl:scroll-mt-[104px]"
    >
      <Reveal className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-6 px-5 py-16 text-center md:px-10 md:py-20 xl:px-24 xl:py-[72px]">
        <p className="text-xs font-semibold tracking-[0.2px] text-text-brand">
          {closingCta.eyebrow}
        </p>
        <h2 className="max-w-[900px] text-[32px] leading-10 font-bold tracking-[-0.8px] text-text-primary md:text-[40px] md:leading-[48px]">
          {closingCta.heading.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <p className="max-w-[720px] text-lg leading-7 text-text-secondary">
          {closingCta.body}
        </p>
        <Button href={`mailto:${site.email}`}>{closingCta.cta.label}</Button>
      </Reveal>
    </section>
  );
}
