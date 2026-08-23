import { Logo } from "@/components/brand/Logo";
import { footer, navItems, site } from "@/lib/content";

export function Footer() {
  return (
    <footer className="bg-ink text-core-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-5 pt-16 pb-10 md:px-10 xl:px-24">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-[520px]">
            <Logo variant="on-dark" />
            <p className="mt-6 text-lg leading-7 text-core-white">
              {footer.tagline[0]}
              <br />
              {footer.tagline[1]}
            </p>
          </div>

          <div className="flex flex-col gap-10 sm:flex-row sm:gap-[88px]">
            <div className="flex min-w-[186px] flex-col gap-3">
              <p className="text-xs font-semibold tracking-[0.2px] text-accent">
                {footer.exploreLabel}
              </p>
              {navItems.slice(0, 3).map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-base leading-6 text-core-white transition-colors hover:text-accent"
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="flex min-w-[186px] flex-col gap-3">
              <p className="text-xs font-semibold tracking-[0.2px] text-accent">
                {footer.contactLabel}
              </p>
              <a
                href="#contacto"
                className="text-base leading-6 text-core-white transition-colors hover:text-accent"
              >
                Hablemos
              </a>
              <a
                href="#contacto"
                className="text-base leading-6 text-core-white transition-colors hover:text-accent"
              >
                LinkedIn
              </a>
              <a
                href={`mailto:${site.email}`}
                className="text-base leading-6 text-core-white transition-colors hover:text-accent"
              >
                {site.email}
              </a>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-core-white/80" />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-5 text-core-white">{footer.copyright}</p>
          <p className="text-xs font-semibold tracking-[0.2px] text-accent sm:text-right">
            {footer.locations}
          </p>
        </div>
      </div>
    </footer>
  );
}
