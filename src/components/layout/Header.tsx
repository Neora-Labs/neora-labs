"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { ThemedLogo } from "@/components/brand/Logo";
import { cn } from "@/lib/cn";
import { navItems, services } from "@/lib/content";

export function Header() {
  const [open, setOpen] = useState(false);
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
  }

  const restNav = navItems.filter((item) => item.href !== "#servicios");

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border-default/60 bg-bg-default">
        <div className="mx-auto flex h-14 w-full max-w-[1440px] items-center justify-between px-4 md:h-[88px] md:px-10 xl:h-[104px] xl:px-24">
          <a href="#inicio" className="min-w-0 shrink-0" aria-label="Neora Labs, ir al inicio">
            <ThemedLogo priority className="h-8 w-[128px] md:h-11 md:w-[175px]" />
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
            className="inline-flex size-11 items-center justify-center gap-2 rounded-[14px] text-text-primary transition-colors duration-200 hover:bg-bg-brand-soft min-[360px]:h-12 min-[360px]:w-auto min-[360px]:px-3 lg:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Cerrar menú" : "Abrir menú"}</span>
            <MenuToggle open={open} />
            <span
              aria-hidden="true"
              className="hidden w-[52px] text-[11px] font-semibold tracking-[1.6px] min-[360px]:inline"
            >
              {open ? "CERRAR" : "MENÚ"}
            </span>
          </button>
        </div>
      </header>

      <div
        id={panelId}
        ref={panelRef}
        hidden={!open}
        className={cn(
          "fixed inset-x-0 top-14 bottom-0 z-40 overflow-y-auto border-t border-border-default bg-bg-default px-4 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:top-[88px] md:px-10 lg:hidden",
          open ? "flex flex-col" : "hidden",
        )}
      >
        <nav
          className="mx-auto flex min-h-full w-full max-w-[1440px] flex-col gap-6"
          aria-label="Móvil"
        >
          <div>
            <p className="mb-3 text-[11px] font-semibold tracking-[1.4px] text-text-secondary">
              Servicios
            </p>
            <div className="grid grid-cols-1 gap-2 min-[480px]:grid-cols-2">
              {services.items.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={closeOnNavigate}
                  className="block w-full rounded-2xl border border-border-default bg-surface px-3.5 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-bg-brand-soft"
                >
                  {item.bar}
                </a>
              ))}
            </div>
          </div>
          <div className="flex flex-col divide-y divide-border-default border-y border-border-default">
            {restNav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeOnNavigate}
                className="py-3.5 text-base font-semibold text-text-primary"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="mt-auto flex flex-col gap-3 pt-1 min-[400px]:flex-row min-[400px]:items-center">
            <ThemeToggle className="self-start min-[400px]:self-auto" />
            <Button href="#contacto" className="w-full min-[400px]:flex-1" onClick={closeOnNavigate}>
              Hablemos
            </Button>
          </div>
        </nav>
      </div>
    </>
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

function MenuToggle({ open }: { open: boolean }) {
  return (
    <span className="relative block size-[22px]" aria-hidden="true">
      <span
        className={cn(
          "absolute top-[6px] left-[2px] h-[2px] w-4 rounded-full bg-current transition-[top,left,width,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open && "top-[10px] left-[3px] w-[16px] rotate-45",
        )}
      />
      <span
        className={cn(
          "absolute top-[14px] left-[6px] h-[2px] w-3 rounded-full bg-current transition-[top,left,width,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open && "top-[10px] left-[3px] w-[16px] -rotate-45",
        )}
      />
      <span
        className={cn(
          "absolute top-[4px] right-[1px] size-[5px] rounded-full bg-text-brand transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open && "scale-0 opacity-0",
        )}
      />
    </span>
  );
}
