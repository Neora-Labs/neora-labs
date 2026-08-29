import { CriteriaMarquee } from "@/components/sections/CriteriaMarquee";
import type { Messages } from "@/i18n/messages/es";

type PositioningProps = {
  criteria: Messages["criteria"];
  criteriaAria: string;
};

export function Positioning({ criteria, criteriaAria }: PositioningProps) {
  return (
    <section className="bg-bg-inverse">
      <div className="mx-auto w-full max-w-[1440px] py-12 md:py-[65px]">
        <CriteriaMarquee criteria={criteria} ariaLabel={criteriaAria} />
      </div>
    </section>
  );
}
