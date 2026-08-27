"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { MotionConfig } from "motion/react";
import { cn } from "@/lib/cn";
import { useMessages } from "@/components/i18n/MessagesProvider";
import { ProcessStepScene } from "@/components/sections/ProcessStepScene";

const RAIL = 52;
const NODE_R = 7;

export function ProcessPath() {
  const { process, ui } = useMessages();
  const steps = process.steps;
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getServerReducedMotion,
  );
  const columnRef = useRef<HTMLDivElement>(null);
  const basePathRef = useRef<SVGPathElement>(null);
  const drawPathRef = useRef<SVGPathElement>(null);
  const nodeRef = useRef<SVGCircleElement>(null);
  const lobeRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pathD, setPathD] = useState(`M ${RAIL / 2} 0`);
  const [svgHeight, setSvgHeight] = useState(1);
  const reachedIndex = reducedMotion ? steps.length - 1 : activeIndex;

  useEffect(() => {
    const column = columnRef.current;
    if (!column) {
      return;
    }

    function measurePath() {
      const host = columnRef.current;
      if (!host) {
        return;
      }

      const hostRect = host.getBoundingClientRect();
      const height = Math.max(1, host.offsetHeight);
      const centers = lobeRefs.current.map((lobe) => {
        if (!lobe) {
          return { x: RAIL / 2, y: 0 };
        }
        const rect = lobe.getBoundingClientRect();
        return {
          x: RAIL / 2,
          y: rect.top + rect.height / 2 - hostRect.top,
        };
      });
      const next = buildOrganicPath(centers);

      setSvgHeight((current) => (current === height ? current : height));
      setPathD((current) => (next === current ? current : next));
    }

    const frame = requestAnimationFrame(measurePath);
    window.addEventListener("resize", measurePath);
    const observer = new ResizeObserver(measurePath);
    observer.observe(column);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", measurePath);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    function paint(progress: number) {
      const path = basePathRef.current;
      const draw = drawPathRef.current;
      const node = nodeRef.current;
      if (!path || !draw || !node) {
        return;
      }

      const length = path.getTotalLength();
      if (length <= 0) {
        return;
      }

      draw.setAttribute("stroke-dasharray", `${length}`);
      draw.setAttribute("stroke-dashoffset", `${length * (1 - progress)}`);
      const point = path.getPointAtLength(progress * length);
      node.setAttribute("cx", String(point.x));
      node.setAttribute("cy", String(point.y));
    }

    function progressFromScroll(): number {
      if (reducedMotion) {
        return 1;
      }

      const first = lobeRefs.current[0];
      const last = lobeRefs.current[steps.length - 1];
      if (!first || !last) {
        return 0;
      }

      const start = window.innerHeight * 0.45;
      const firstCenter = first.getBoundingClientRect().top + first.offsetHeight / 2;
      const lastCenter = last.getBoundingClientRect().top + last.offsetHeight / 2;
      const span = lastCenter - firstCenter;
      if (span <= 0) {
        return 0;
      }

      return clamp((start - firstCenter) / span, 0, 1);
    }

    function update() {
      const progress = progressFromScroll();
      paint(progress);
      const nextActive = Math.round(progress * (steps.length - 1));
      setActiveIndex((current) => (current === nextActive ? current : nextActive));
    }

    let frame = 0;
    function onScroll() {
      if (frame) {
        return;
      }
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    }

    const start = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(start);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathD, reducedMotion, steps.length]);

  return (
    <MotionConfig reducedMotion={reducedMotion ? "always" : "never"}>
      <div ref={columnRef} className="relative w-full max-w-[760px]">
        <svg
          className="pointer-events-none absolute top-0 left-0 h-full w-[52px] overflow-visible"
          viewBox={`0 0 ${RAIL} ${svgHeight}`}
          fill="none"
          aria-hidden="true"
        >
          <path
            ref={basePathRef}
            d={pathD}
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-border-default"
          />
          <path
            ref={drawPathRef}
            d={pathD}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-accent"
          />
          <circle ref={nodeRef} r={NODE_R} cx={RAIL / 2} cy="0" className="fill-accent" />
        </svg>

        <ol className="flex flex-col" aria-label={ui.process.stepsAria}>
          {steps.map((step, index) => {
            const reached = index <= reachedIndex;
            const isActive = index === reachedIndex;

            return (
              <li key={step.id}>
                <article
                  className={cn(
                    "flex min-h-0 items-center gap-5 py-10 motion-safe:transition-opacity motion-safe:duration-500 md:min-h-[70vh] md:py-8",
                    reached ? "opacity-100" : "opacity-40",
                  )}
                >
                  <div
                    ref={(node) => {
                      lobeRefs.current[index] = node;
                    }}
                    className={cn(
                      "relative z-10 flex size-[52px] shrink-0 items-center justify-center rounded-[14px] text-sm font-semibold tracking-[0.1px] motion-safe:transition-colors motion-safe:duration-500",
                      reached
                        ? "bg-bg-brand-soft text-text-brand"
                        : "bg-surface text-text-secondary",
                      isActive && "ring-2 ring-accent/70",
                    )}
                  >
                    {step.number}
                  </div>
                  <div className="grid min-w-0 flex-1 grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_260px] md:items-center md:gap-8">
                    <div className="min-w-0">
                      <h3 className="text-2xl font-semibold tracking-[-0.4px] text-text-primary sm:text-[32px] sm:leading-10">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-base leading-6 text-text-secondary">
                        {step.description}
                      </p>
                    </div>
                    <ProcessStepScene
                      className="md:col-start-2 md:row-span-2 md:row-start-1"
                      id={step.id}
                      isActive={isActive}
                      reached={reached}
                      reducedMotion={reducedMotion}
                    />
                    <div className="min-w-0">
                      <ul className="flex flex-col gap-1.5">
                        {step.activities.map((activity) => (
                          <li
                            key={activity}
                            className="flex gap-2.5 text-sm leading-6 text-text-secondary"
                          >
                            <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                            {activity}
                          </li>
                        ))}
                      </ul>
                      <p
                        className={cn(
                          "mt-4 overflow-hidden border-l-2 border-accent pl-4 text-sm leading-6 text-text-primary motion-safe:transition-[opacity,max-height] motion-safe:duration-500",
                          reached ? "max-h-24 opacity-100" : "max-h-0 border-transparent opacity-0",
                        )}
                      >
                        {step.evidence}
                      </p>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </MotionConfig>
  );
}

function buildOrganicPath(centers: Array<{ x: number; y: number }>): string {
  if (centers.length === 0) {
    return `M ${RAIL / 2} 0`;
  }

  const [first, ...rest] = centers;
  if (!first) {
    return `M ${RAIL / 2} 0`;
  }

  let d = `M ${first.x} ${first.y}`;
  let previous = first;

  rest.forEach((point, index) => {
    const dy = point.y - previous.y;
    const bulge = (index % 2 === 0 ? 1 : -1) * 18;
    d += ` C ${previous.x + bulge} ${previous.y + dy * 0.35}, ${point.x + bulge} ${point.y - dy * 0.35}, ${point.x} ${point.y}`;
    previous = point;
  });

  return d;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
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
