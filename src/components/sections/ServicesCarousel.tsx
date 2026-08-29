"use client";

import { useEffect, useId, useState, useSyncExternalStore, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ServiceVisual } from "@/components/services/ServiceVisual";
import { useLocale, useMessages } from "@/components/i18n/MessagesProvider";
import { interpolate } from "@/i18n/interpolate";
import { localePath } from "@/i18n/config";
import { serviceHash } from "@/lib/content";
import { cn } from "@/lib/cn";

const CARD_SHIFT = 252;
const COPY_EASE = [0.22, 1, 0.36, 1] as const;

export function ServicesCarousel() {
  const { services, ui } = useMessages();
  const locale = useLocale();
  const items = services.items;
  const labelId = useId();
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getServerReducedMotion,
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const count = items.length;
  const active = items[activeIndex] ?? items[0];
  const progress = `${String(activeIndex + 1).padStart(2, "0")}`;
  const copyTransition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: COPY_EASE };

  useEffect(() => {
    function syncFromHash() {
      const index = items.findIndex((item) => serviceHash(item.id) === window.location.hash);
      if (index >= 0) {
        setActiveIndex(index);
      }
    }

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [items]);

  function go(delta: number) {
    setActiveIndex((index) => (index + delta + count) % count);
  }

  return (
    <div className="relative min-h-[720px] overflow-hidden">
      {items.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            "absolute inset-0 motion-safe:transition-opacity motion-safe:duration-700",
            index === activeIndex ? "opacity-100" : "opacity-0",
          )}
          aria-hidden={index !== activeIndex}
        >
          <ServiceVisual item={item} className="h-full w-full" sizes="100vw" />
        </div>
      ))}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/25" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/50" />

      {items.map((item) => (
        <span
          key={item.id}
          id={serviceHash(item.id).slice(1)}
          className="absolute top-0 left-0 scroll-mt-14 md:scroll-mt-[88px] xl:scroll-mt-[104px]"
        />
      ))}

      <div className="relative z-10 mx-auto flex min-h-[720px] w-full max-w-[1440px] flex-col justify-between gap-10 px-5 py-16 md:px-10 md:py-20 xl:px-24 xl:py-[88px]">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-12">
          <div>
            <p className="text-xs font-semibold tracking-[0.2px] text-accent">{services.eyebrow}</p>
            <h2 className="mt-4 text-xl leading-7 font-bold tracking-[-0.4px] text-core-white/80 md:text-2xl md:leading-8">
              {services.heading}
            </h2>

            <div className="mt-10" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active.id}
                  initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={copyTransition}
                >
                  <p className="text-[11px] font-semibold tracking-[0.9px] text-accent">{active.eyebrow}</p>
                  <h3 className="mt-4 text-[32px] leading-10 font-bold tracking-[-0.8px] text-core-white md:text-[40px] md:leading-[48px]">
                    {active.title}
                  </h3>
                  <p className="mt-4 max-w-[520px] text-base leading-7 text-core-white/72 md:text-lg">
                    {active.body}
                  </p>
                  <p className="mt-4 max-w-[520px] text-sm leading-6 text-core-white/90">{active.example}</p>
                  <a
                    href={localePath(locale, active.href)}
                    className="mt-8 inline-flex items-center text-sm font-semibold text-accent transition-colors hover:text-core-white"
                  >
                    {services.page.viewService}
                  </a>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div
            role="group"
            aria-roledescription={ui.carouselRole}
            aria-labelledby={labelId}
            tabIndex={0}
            className="outline-none"
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                go(-1);
              }
              if (event.key === "ArrowRight") {
                event.preventDefault();
                go(1);
              }
            }}
          >
            <p id={labelId} className="sr-only">
              {interpolate(ui.services.carouselLabel, { heading: services.heading })}
            </p>
            <div className="relative h-[360px] overflow-hidden sm:h-[400px] xl:h-[460px]">
              {items.map((item, index) => {
                const delta = wrappedDelta(index, activeIndex, count);
                const isActive = delta === 0;
                const hidden = Math.abs(delta) > 1;

                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-current={isActive ? "true" : undefined}
                    aria-label={`${item.eyebrow}: ${item.title}`}
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "absolute top-4 left-0 w-[210px] overflow-hidden rounded-3xl border border-core-white/15 text-left shadow-[0_8px_24px_-6px_rgb(15_25_23_/_0.45)] motion-safe:transition-[transform,opacity] motion-safe:duration-500 sm:w-[230px] xl:top-6 xl:w-[250px]",
                      isActive ? "z-10" : "z-0",
                      hidden && "pointer-events-none",
                    )}
                    style={{
                      transform: `translateX(${delta * CARD_SHIFT}px) scale(${isActive ? 1 : 0.92})`,
                      opacity: hidden ? 0 : isActive ? 1 : 0.55,
                    }}
                  >
                    <ServiceVisual
                      item={item}
                      className="h-[320px] sm:h-[360px] xl:h-[410px]"
                      sizes="(min-width: 1280px) 250px, (min-width: 640px) 230px, 210px"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/70 to-transparent px-5 pt-16 pb-5">
                      <p className="text-[11px] font-semibold tracking-[0.9px] text-accent">
                        {item.eyebrow}
                      </p>
                      <p className="mt-1 text-sm font-bold text-core-white">{item.bar}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex gap-2">
            <CarouselArrow label={ui.services.previous} onClick={() => go(-1)}>
              <Chevron direction="left" />
            </CarouselArrow>
            <CarouselArrow label={ui.services.next} onClick={() => go(1)}>
              <Chevron direction="right" />
            </CarouselArrow>
          </div>

          <div className="relative h-px min-w-[120px] flex-1 bg-core-white/20">
            <span
              className="absolute top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-accent motion-safe:transition-all motion-safe:duration-500"
              style={{
                left: `${(activeIndex / count) * 100}%`,
                width: `${100 / count}%`,
              }}
            />
          </div>

          <p className="font-sans text-3xl leading-none font-normal tracking-[0.08em] text-core-white/85 tabular-nums sm:text-4xl">
            {progress}
          </p>
        </div>
      </div>
    </div>
  );
}

function subscribeReducedMotion(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerReducedMotion() {
  return false;
}

function wrappedDelta(index: number, active: number, count: number): number {
  let delta = index - active;
  if (delta > count / 2) {
    delta -= count;
  }
  if (delta < -count / 2) {
    delta += count;
  }
  return delta;
}

function CarouselArrow({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex size-11 items-center justify-center rounded-full border border-core-white/35 text-core-white transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
    >
      {children}
    </button>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d={direction === "left" ? "M10 3.5 5.5 8 10 12.5" : "M6 3.5 10.5 8 6 12.5"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
