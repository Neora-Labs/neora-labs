import { AgendaTrigger } from "@/components/agenda/AgendaProvider";
import { ContactForm } from "@/components/sections/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import type { Messages } from "@/i18n/messages/es";

type ClosingCtaProps = {
  contact: Messages["contact"];
  email: string;
};

export function ClosingCta({ contact, email }: ClosingCtaProps) {
  return (
    <section
      id="contacto"
      className="scroll-mt-14 bg-bg-brand-soft md:scroll-mt-[88px] xl:scroll-mt-[104px]"
    >
      <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-5 py-16 md:px-10 md:py-20 xl:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.7fr)] xl:items-start xl:gap-16 xl:px-24 xl:py-[96px]">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.2px] text-text-brand">
            {contact.eyebrow}
          </p>
          <h1 className="mt-5 text-[32px] leading-10 font-bold tracking-[-0.8px] text-text-primary md:text-[40px] md:leading-[48px]">
            {contact.heading}
          </h1>
          <p className="mt-4 max-w-[560px] text-lg leading-7 text-text-secondary">
            {contact.body}
          </p>
          <div className="mt-8">
            <ContactForm />
          </div>
        </Reveal>
        <Reveal className="flex flex-col gap-8 xl:pt-[72px]">
          <div>
            <p className="text-xs font-semibold tracking-[0.2px] text-text-brand">
              {contact.sidebar.emailLabel}
            </p>
            <a
              href={`mailto:${email}`}
              className="mt-2 block text-base font-semibold text-text-primary transition-colors hover:text-text-brand"
            >
              {email}
            </a>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.2px] text-text-brand">
              {contact.sidebar.presenceLabel}
            </p>
            <p className="mt-2 text-base text-text-primary">{contact.sidebar.presence}</p>
          </div>
          <AgendaTrigger>{contact.sidebar.schedule}</AgendaTrigger>
        </Reveal>
      </div>
    </section>
  );
}
