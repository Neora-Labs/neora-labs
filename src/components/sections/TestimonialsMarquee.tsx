import { testimonials } from "@/lib/content";

export function TestimonialsMarquee() {
  return (
    <div className="flex flex-col gap-6">
      <p className="px-5 text-xs font-semibold tracking-[0.2px] text-accent md:px-10 xl:px-24">
        {testimonials.eyebrow}
      </p>
      <div className="group overflow-x-auto py-1 [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] [scrollbar-width:none] motion-safe:overflow-hidden">
        <div className="flex w-max motion-safe:animate-marquee motion-safe:group-hover:[animation-play-state:paused] motion-safe:group-focus-within:[animation-play-state:paused]">
          <TestimonialTrack />
          <TestimonialTrack hidden />
        </div>
      </div>
    </div>
  );
}

function TestimonialTrack({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul
      className="flex gap-4 pr-4"
      aria-hidden={hidden || undefined}
      aria-label={hidden ? undefined : "Comentarios de clientes"}
    >
      {testimonials.items.map((item) => (
        <li key={`${hidden ? "clone-" : ""}${item.id}`}>
          <article className="flex h-full w-[min(calc(100vw-2.5rem),340px)] shrink-0 flex-col gap-5 rounded-3xl border border-text-inverse/15 bg-text-inverse/8 p-6 motion-safe:transition-[transform,background-color,border-color] motion-safe:duration-250 motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-text-inverse/30 motion-safe:hover:bg-text-inverse/14 motion-safe:focus-within:-translate-y-0.5 motion-safe:focus-within:border-text-inverse/30 motion-safe:focus-within:bg-text-inverse/14">
            <p className="text-[11px] font-semibold tracking-[0.9px] text-accent">{item.service}</p>
            <p className="text-sm leading-6 text-text-inverse">&ldquo;{item.quote}&rdquo;</p>
            <p className="mt-auto text-sm leading-6">
              <span className="font-semibold text-text-inverse">{item.name}</span>
              <span className="text-text-inverse/70">
                {" "}
                · {item.role}, {item.company}
              </span>
              <span className="mt-0.5 block text-xs tracking-[0.2px] text-text-inverse/55">
                {item.place}
              </span>
            </p>
          </article>
        </li>
      ))}
    </ul>
  );
}
