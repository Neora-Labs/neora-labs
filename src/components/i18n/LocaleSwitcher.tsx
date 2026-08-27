"use client";

import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useMessages } from "@/components/i18n/MessagesProvider";
import {
  COOKIE_MAX_AGE,
  isLocale,
  LOCALE_COOKIE,
  localeCodes,
  localeNames,
  locales,
  type Locale,
} from "@/i18n/config";
import { interpolate } from "@/i18n/interpolate";
import { cn } from "@/lib/cn";

type LocaleSwitcherProps = {
  className?: string;
  menuPlacement?: "bottom" | "top";
};

export function LocaleSwitcher({ className, menuPlacement = "bottom" }: LocaleSwitcherProps) {
  const current = useLocale();
  const { ui } = useMessages();
  const pathname = usePathname();
  const router = useRouter();
  const subpath = pathWithoutLocale(pathname);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    function onPointerDown(event: Event) {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function chooseLocale(event: MouseEvent<HTMLAnchorElement>, locale: Locale) {
    persistLocale(locale);
    setOpen(false);
    const hash = window.location.hash;
    if (hash) {
      event.preventDefault();
      router.push(`/${locale}${subpath}${hash}`);
    }
  }

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <button
        ref={buttonRef}
        type="button"
        className="inline-flex h-12 items-center gap-1.5 rounded-[14px] px-3 text-xs font-semibold tracking-[0.2px] text-text-primary transition-colors duration-200 hover:bg-bg-brand-soft"
        aria-label={interpolate(ui.locale.currentAria, { language: localeNames[current] })}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
      >
        {localeCodes[current]}
        <Chevron open={open} />
      </button>
      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={ui.locale.switcherAria}
          className={cn(
            "absolute right-0 z-50 min-w-[10.5rem] rounded-[14px] border border-border-default bg-surface p-1.5 shadow-[0_2px_6px_-2px_rgb(15_25_23_/_0.05),0_8px_24px_-6px_rgb(15_25_23_/_0.1)]",
            menuPlacement === "top" ? "bottom-full mb-2" : "top-full mt-2",
          )}
        >
          {locales.map((locale) => {
            const active = locale === current;
            return (
              <li key={locale} role="none">
                <a
                  href={`/${locale}${subpath}`}
                  hrefLang={locale}
                  lang={locale}
                  role="option"
                  aria-selected={active}
                  aria-current={active ? "page" : undefined}
                  onClick={(event) => chooseLocale(event, locale)}
                  className={cn(
                    "flex rounded-[10px] px-3 py-2 text-sm font-semibold tracking-[0.1px] transition-colors",
                    active
                      ? "bg-bg-brand-soft text-text-brand"
                      : "text-text-secondary hover:bg-bg-brand-soft hover:text-text-primary",
                  )}
                >
                  {localeNames[locale]}
                </a>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function pathWithoutLocale(pathname: string): string {
  const segments = pathname.split("/");
  if (isLocale(segments[1])) {
    const rest = segments.slice(2).join("/");
    return rest ? `/${rest}` : "";
  }
  return "";
}

function persistLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className={cn("transition-transform", open && "rotate-180")}
    >
      <path
        d="M2.5 4.5 6 8l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
