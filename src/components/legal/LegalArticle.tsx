import { Reveal } from "@/components/ui/Reveal";
import { interpolate } from "@/i18n/interpolate";

type LegalSection = {
  heading: string;
  body: string;
};

type LegalArticleProps = {
  title: string;
  updated: string;
  intro: string;
  sections: readonly LegalSection[];
  vars?: Record<string, string>;
  backHref: string;
  backLabel: string;
};

export function LegalArticle({
  title,
  updated,
  intro,
  sections,
  vars,
  backHref,
  backLabel,
}: LegalArticleProps) {
  return (
    <main id="contenido" className="bg-bg-default">
      <article className="mx-auto w-full max-w-[720px] px-5 py-16 md:px-10 md:py-20 xl:py-[96px]">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.2px] text-text-brand">{updated}</p>
          <h1 className="mt-5 text-[32px] leading-10 font-bold tracking-[-0.8px] text-text-primary md:text-[40px] md:leading-[48px]">
            {title}
          </h1>
          <p className="mt-5 text-lg leading-7 text-text-secondary">{intro}</p>
        </Reveal>
        <div className="mt-10 flex flex-col gap-8">
          {sections.map((section) => (
            <Reveal key={section.heading}>
              <h2 className="text-lg font-semibold text-text-primary">{section.heading}</h2>
              <p className="mt-2 text-base leading-7 text-text-secondary">
                {vars ? interpolate(section.body, vars) : section.body}
              </p>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-12">
          <a
            href={backHref}
            className="text-sm font-semibold text-text-brand transition-colors hover:text-text-primary"
          >
            {backLabel}
          </a>
        </Reveal>
      </article>
    </main>
  );
}
