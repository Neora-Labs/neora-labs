"use client";

import { useEffect, useId, useState, useSyncExternalStore, type ReactNode, type RefObject } from "react";
import { useMessages } from "@/components/i18n/MessagesProvider";
import { cn } from "@/lib/cn";
import { type HeroSlideId } from "@/lib/content";

export type { HeroSlideId };

type HeroCarouselProps = {
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onRequestBudget: (prompt?: string) => void;
  cardRef?: RefObject<HTMLDivElement | null>;
  locked?: boolean;
};

const AUTOPLAY_MS = 5000;
const CARD_SHIFT = 240;
const TYPE_MS = 32;
const TYPE_START_MS = 160;

export function HeroCarousel({
  activeIndex,
  onActiveIndexChange,
  onRequestBudget,
  cardRef,
  locked = false,
}: HeroCarouselProps) {
  const { hero, heroSlides, ui } = useMessages();
  const labelId = useId();
  const [paused, setPaused] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [composerFocused, setComposerFocused] = useState(false);
  const slide = heroSlides[activeIndex];
  const showTypedExample = !prompt && !composerFocused;
  const count = heroSlides.length;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches || paused || locked) {
      return;
    }

    const timer = setInterval(() => {
      onActiveIndexChange((activeIndex + 1) % count);
    }, AUTOPLAY_MS);

    return () => clearInterval(timer);
  }, [activeIndex, count, onActiveIndexChange, paused, locked]);

  function go(delta: number) {
    onActiveIndexChange((activeIndex + delta + count) % count);
  }

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[1440px] px-5 pb-10 md:px-10 xl:px-24",
        locked && "pointer-events-none",
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setPaused(false);
        }
      }}
    >
      <div
        className="relative z-20 mx-auto max-w-[560px]"
        role="group"
        aria-roledescription={ui.carouselRole}
        aria-labelledby={labelId}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.target instanceof HTMLInputElement) {
            return;
          }
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
        <div
          ref={cardRef}
          aria-hidden={locked ? true : undefined}
          className={cn(
            "rounded-3xl border border-border-default bg-surface-raised p-5 shadow-[0_2px_6px_-2px_rgb(15_25_23_/_0.05),0_8px_24px_-6px_rgb(15_25_23_/_0.1)] sm:p-6",
            locked && "opacity-0",
          )}
        >
          <p id={labelId} className="text-lg font-semibold leading-7 text-text-primary sm:text-xl sm:leading-8">
            {slide.overlay}
          </p>
          <label className="relative mt-5 block">
            <span className="sr-only">{hero.composerPlaceholder}</span>
            <input
              type="text"
              value={prompt}
              placeholder={showTypedExample ? undefined : hero.composerPlaceholder}
              onChange={(event) => setPrompt(event.target.value)}
              onFocus={() => {
                setComposerFocused(true);
                onRequestBudget(prompt);
              }}
              onBlur={() => setComposerFocused(false)}
              onKeyDown={(event) => {
                event.stopPropagation();
                if (event.key === "Enter") {
                  event.preventDefault();
                  onRequestBudget(prompt);
                }
              }}
              className="h-12 w-full rounded-[14px] border border-border-default bg-bg-default px-3.5 text-sm text-text-primary placeholder:text-text-secondary focus:border-border-strong"
            />
            {showTypedExample ? <TypedExample key={slide.examplePrompt} text={slide.examplePrompt} /> : null}
          </label>
          <div className="mt-6 flex items-center justify-between gap-3">
            <div className="flex gap-2">
              <CarouselArrow label={ui.hero.previous} onClick={() => go(-1)}>
                <Chevron direction="left" />
              </CarouselArrow>
              <CarouselArrow label={ui.hero.next} onClick={() => go(1)}>
                <Chevron direction="right" />
              </CarouselArrow>
            </div>
            <button
              type="button"
              data-hero-cta
              onClick={() => onRequestBudget(prompt)}
              className="inline-flex h-11 items-center justify-center rounded-full bg-action px-5 text-sm font-semibold text-action-fg transition-colors hover:bg-action-hover"
            >
              {hero.budgetCta}
            </button>
          </div>
        </div>
      </div>

      <div className="relative mt-[-28px] h-[280px] overflow-hidden sm:h-[340px] md:h-[380px]">
        <div className="absolute inset-0" aria-hidden="true">
          {heroSlides.map((item, index) => {
            const delta = wrappedDelta(index, activeIndex, count);
            const isActive = delta === 0;
            return (
              <div
                key={item.id}
                className={cn(
                  "absolute top-10 left-1/2 w-[200px] motion-safe:transition-[transform,opacity] motion-safe:duration-500 sm:top-8 sm:w-[240px] md:w-[260px]",
                  isActive ? "z-10" : "z-0",
                )}
                style={{
                  transform: `translateX(calc(-50% + ${delta * CARD_SHIFT}px)) scale(${isActive ? 1 : 0.88})`,
                  opacity: Math.abs(delta) > 1 ? 0 : isActive ? 1 : 0.4,
                }}
              >
                <SlideMockup id={item.id} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TypedExample({ text }: { text: string }) {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getServerReducedMotion,
  );
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    let index = 0;
    let intervalId = 0;
    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        index += 1;
        setTyped(text.slice(0, index));
        if (index >= text.length) {
          window.clearInterval(intervalId);
        }
      }, TYPE_MS);
    }, TYPE_START_MS);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [text, reducedMotion]);

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center overflow-hidden px-3.5 text-sm text-text-secondary select-none"
    >
      <span className="whitespace-nowrap">{reducedMotion ? text : typed}</span>
      <span className="ml-px inline-block h-[1em] w-px shrink-0 bg-text-secondary motion-safe:animate-caret-blink" />
    </span>
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

function SlideMockup({ id }: { id: HeroSlideId }) {
  switch (id) {
    case "ai":
      return <AiMockup />;
    case "automation":
      return <AutomationMockup />;
    case "software":
      return <SoftwareMockup />;
    case "web":
      return <WebPresenceMockup />;
    case "integrations":
      return <SystemsMockup />;
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

function SoftwareMockup() {
  const { ui } = useMessages();
  const copy = ui.hero.mockups.software;
  return (
    <MockFrame title={copy.title}>
      <div className="flex gap-1.5">
        <span className="h-1.5 flex-1 rounded-full bg-bg-brand-soft" />
        <span className="h-1.5 w-8 rounded-full bg-border-default" />
        <span className="h-1.5 w-8 rounded-full bg-border-default" />
      </div>
      <div className="mt-3 h-16 rounded-xl bg-bg-brand-soft" />
      <div className="mt-3 grid grid-cols-3 gap-2">
        {copy.tabs.map((label) => (
          <div key={label} className="rounded-lg border border-border-default bg-surface p-2">
            <p className="text-[9px] font-semibold text-text-primary">{label}</p>
            <p className="mt-1 h-1.5 w-full rounded-full bg-border-default" />
          </div>
        ))}
      </div>
    </MockFrame>
  );
}

function WebPresenceMockup() {
  const { ui } = useMessages();
  const copy = ui.hero.mockups.web;
  return (
    <MockFrame title={copy.title}>
      <div className="flex items-center justify-between">
        <span className="h-1.5 w-10 rounded-full bg-border-strong" />
        <span className="rounded-full bg-action px-2 py-0.5 text-[8px] font-semibold text-action-fg">
          {copy.cta}
        </span>
      </div>
      <div className="mt-3 rounded-xl bg-bg-brand-soft px-2.5 py-3">
        <p className="text-[10px] font-semibold text-text-primary">{copy.heading}</p>
        <p className="mt-1 text-[9px] leading-4 text-text-secondary">{copy.body}</p>
      </div>
      <div className="mt-2 h-2 w-2/3 rounded-full bg-border-default" />
    </MockFrame>
  );
}

function AutomationMockup() {
  const { ui } = useMessages();
  const copy = ui.hero.mockups.automation;
  return (
    <MockFrame title={copy.title}>
      <div className="flex flex-col gap-2">
        {copy.rows.map((row) => (
          <div
            key={row.from}
            className="flex items-center justify-between rounded-lg border border-border-default bg-surface px-2.5 py-2"
          >
            <p className="text-[10px] font-semibold text-text-primary">
              {row.from} → {row.to}
            </p>
            <span className="text-[9px] font-semibold text-text-brand">{row.status}</span>
          </div>
        ))}
      </div>
    </MockFrame>
  );
}

function SystemsMockup() {
  const { ui } = useMessages();
  const copy = ui.hero.mockups.systems;
  return (
    <MockFrame title={copy.title}>
      <div className="flex flex-col gap-2">
        {copy.rows.map((row) => (
          <div
            key={row.from}
            className="flex items-center justify-between rounded-lg border border-border-default bg-surface px-2.5 py-2"
          >
            <p className="text-[10px] font-semibold text-text-primary">
              {row.from} → {row.to}
            </p>
            <span className="text-[9px] font-semibold text-text-brand">{row.status}</span>
          </div>
        ))}
      </div>
    </MockFrame>
  );
}

function AiMockup() {
  const { ui } = useMessages();
  const copy = ui.hero.mockups.ai;
  return (
    <MockFrame title={copy.title}>
      <div className="flex flex-col gap-2">
        <div className="max-w-[85%] rounded-xl rounded-tl-md bg-bg-brand-soft px-2.5 py-2 text-[10px] leading-4 text-text-primary">
          {copy.question}
        </div>
        <div className="ml-auto max-w-[85%] rounded-xl rounded-tr-md bg-action px-2.5 py-2 text-[10px] leading-4 text-action-fg">
          {copy.answer}
        </div>
        <div className="rounded-lg border border-border-default bg-surface px-2.5 py-2">
          <p className="text-[9px] font-semibold tracking-[0.2px] text-accent">{copy.alert}</p>
          <p className="mt-1 text-[10px] text-text-primary">{copy.alertBody}</p>
        </div>
      </div>
    </MockFrame>
  );
}

function MockFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border-default bg-surface shadow-[0_1.9px_3.8px_rgb(15_25_23_/_0.06)]">
      <div className="flex items-center gap-1.5 border-b border-border-default px-3 py-2">
        <span className="size-1.5 rounded-full bg-border-strong" />
        <span className="size-1.5 rounded-full bg-border-strong" />
        <span className="size-1.5 rounded-full bg-border-strong" />
        <p className="ml-2 text-[10px] font-semibold text-text-secondary">{title}</p>
      </div>
      <div className="bg-bg-subtle p-3">{children}</div>
    </div>
  );
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
      className="inline-flex size-10 items-center justify-center rounded-full border border-border-strong text-text-primary transition-colors hover:bg-bg-brand-soft"
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
