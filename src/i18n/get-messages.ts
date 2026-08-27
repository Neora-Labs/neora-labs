import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { en } from "@/i18n/messages/en";
import { es, type Messages } from "@/i18n/messages/es";
import { pl } from "@/i18n/messages/pl";

const catalog: Record<Locale, Messages> = { es, en, pl };

export function getMessages(locale: string): Messages {
  if (isLocale(locale)) {
    return catalog[locale];
  }
  return catalog[defaultLocale];
}

export type { Messages };
