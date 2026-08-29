import { PresenceAndTeam } from "@/components/international/PresenceAndTeam";
import { Reveal } from "@/components/ui/Reveal";
import type { Messages } from "@/i18n/messages/es";

type ValuesProps = {
  international: Messages["international"];
};

export function Values({ international }: ValuesProps) {
  return (
    <section
      id="nosotros"
      className="scroll-mt-14 bg-bg-default md:scroll-mt-[88px] xl:scroll-mt-[104px]"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-5 py-16 md:px-10 md:py-20 xl:gap-12 xl:px-24 xl:py-[104px]">
        <Reveal className="max-w-[720px]">
          <p className="text-xs font-semibold tracking-[0.2px] text-text-brand">
            {international.eyebrow}
          </p>
          <h2 className="mt-5 text-[32px] leading-10 font-bold tracking-[-0.8px] text-text-primary md:text-[40px] md:leading-[48px]">
            {international.heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-5 max-w-[560px] text-lg leading-7 text-text-secondary">
            {international.body}
          </p>
        </Reveal>
        <PresenceAndTeam />
      </div>
    </section>
  );
}
