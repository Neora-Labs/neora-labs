"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { ThemedLogo } from "@/components/brand/Logo";
import { cn } from "@/lib/cn";
import { navItems, services } from "@/lib/content";

export function Header() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const panel = panelRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusable = panel
      ? Array.from(
          panel.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled])',
          ),
        )
      : [];

    focusable[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setServicesOpen(false);
        buttonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
      previouslyFocused?.focus();
    };
  }, [open]);

  function closeOnNavigate() {
    setOpen(false);
    setServicesOpen(false);
  }

  const restNav = navItems.filter((item) => item.href !== "#servicios");

  return (
    <header className="sticky top-0 z-50 border-b border-border-default/60 bg-bg-default">
      <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between px-5 md:h-[88px] md:px-10 xl:h-[104px] xl:px-24">
        <a href="#inicio" className="shrink-0" aria-label="Neora Labs, ir al inicio">
          <ThemedLogo priority />
        </a>

        <nav
          className="hidden items-center gap-[34px] lg:flex"
          aria-label="Principal"
        >
          <ServicesMega />
          {restNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-semibold tracking-[0.1px] text-text-primary transition-colors hover:text-text-brand"
            >
              {item.label}
            </a>
          ))}
          <ThemeToggle />
          <Button href="#contacto">Hablemos</Button>
        </nav>

        <button
          ref={buttonRef}
          type="button"
          className="inline-flex size-12 items-center justify-center rounded-[14px] text-text-primary lg:hidden"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => {
            if (open) {
              setOpen(false);
              setServicesOpen(false);
            } else {
              setOpen(true);
            }
          }}
        >
          <span className="sr-only">{open ? "Cerrar menú" : "Abrir menú"}</span>
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <div
        id={panelId}
        ref={panelRef}
        hidden={!open}
        className={cn(
          "border-t border-border-default bg-bg-default px-5 py-6 lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="flex flex-col gap-4" aria-label="Móvil">
          <div>
            <button
              type="button"
              className="flex w-full items-center justify-between py-2 text-left text-base font-semibold text-text-primary"
              aria-expanded={servicesOpen}
              onClick={() => setServicesOpen((value) => !value)}
            >
              Servicios
              <Chevron open={servicesOpen} />
            </button>
            {servicesOpen ? (
              <div className="mt-1 mb-2 flex flex-col gap-1 border-l border-border-default pl-4">
                {services.items.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={closeOnNavigate}
                    className="py-2"
                  >
                    <span className="block text-[11px] font-semibold tracking-[0.9px] text-accent">
                      {item.eyebrow}
                    </span>
                    <span className="text-sm font-semibold text-text-primary">{item.title}</span>
                  </a>
                ))}
              </div>
            ) : null}
          </div>
          {restNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={closeOnNavigate}
              className="py-2 text-base font-semibold text-text-primary"
            >
              {item.label}
            </a>
          ))}
          <div className="flex items-center gap-3 pt-2">
            <ThemeToggle />
            <Button href="#contacto" className="flex-1" onClick={closeOnNavigate}>
              Hablemos
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}

function ServicesMega() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function clearCloseTimer() {
    if (closeTimer.current !== null) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function scheduleClose() {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => {
        clearCloseTimer();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className="inline-flex items-center gap-1.5 text-sm font-semibold tracking-[0.1px] text-text-primary transition-colors hover:text-text-brand"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
      >
        Servicios
        <Chevron open={open} />
      </button>
      {open ? (
        <div className="absolute top-full left-0 pt-3">
          <div className="grid w-[min(92vw,640px)] grid-cols-1 gap-1 rounded-3xl border border-border-default bg-surface p-3 shadow-[0_2px_6px_-2px_rgb(15_25_23_/_0.05),0_8px_24px_-6px_rgb(15_25_23_/_0.1)] sm:grid-cols-2">
            {services.items.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl p-3 transition-colors hover:bg-bg-brand-soft"
              >
                <p className="text-[11px] font-semibold tracking-[0.9px] text-accent">
                  {item.eyebrow}
                </p>
                <p className="mt-2 text-sm font-semibold text-text-primary">{item.title}</p>
                <p className="mt-1 text-xs leading-5 text-text-secondary">{item.summary}</p>
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
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

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
