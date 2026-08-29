import { TestimonialsMarquee } from "@/components/sections/TestimonialsMarquee";
import type { Messages } from "@/i18n/messages/es";

type PositioningProps = {
  testimonials: Messages["testimonials"];
  testimonialsAria: string;
};

export function Positioning({ testimonials, testimonialsAria }: PositioningProps) {
  return (
    <section className="bg-bg-inverse">
      <div className="mx-auto w-full max-w-[1440px] py-12 md:py-[65px]">
        <TestimonialsMarquee testimonials={testimonials} ariaLabel={testimonialsAria} />
      </div>
    </section>
  );
}
