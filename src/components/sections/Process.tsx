import { ProcessPath } from "@/components/sections/ProcessPath";
import { Reveal } from "@/components/ui/Reveal";
import { process } from "@/lib/content";

export function Process() {
  return (
    <section
      id="proceso"
      className="scroll-mt-[72px] bg-bg-default md:scroll-mt-[88px] xl:scroll-mt-[104px]"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-5 py-16 md:px-10 md:py-20 xl:flex-row xl:items-start xl:justify-between xl:gap-16 xl:px-24 xl:py-[112px]">
        <Reveal className="max-w-[500px] xl:sticky xl:top-[120px]">
          <p className="text-xs font-semibold tracking-[0.2px] text-text-brand">
            {process.eyebrow}
          </p>
          <h2 className="mt-5 text-[32px] leading-10 font-bold tracking-[-0.8px] text-text-primary md:text-[40px] md:leading-[48px]">
            {process.heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-6 max-w-[470px] text-lg leading-7 text-text-secondary">
            {process.body}
          </p>
        </Reveal>

        <ProcessPath />
      </div>
    </section>
  );
}
