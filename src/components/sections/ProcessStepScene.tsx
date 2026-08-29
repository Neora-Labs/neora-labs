"use client";

import { useEffect, type ReactNode } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { cn } from "@/lib/cn";
import type { ProcessStepId } from "@/lib/content";

type SceneState = {
  isActive: boolean;
  reached: boolean;
  reducedMotion: boolean;
};

type ProcessStepSceneProps = SceneState & {
  id: ProcessStepId;
  className?: string;
};

export function ProcessStepScene({
  id,
  isActive,
  reached,
  reducedMotion,
  className,
}: ProcessStepSceneProps) {
  const state = { isActive, reached, reducedMotion };

  switch (id) {
    case "understand":
      return (
        <Stage className={className}>
          <UnderstandScene {...state} />
        </Stage>
      );
    case "define":
      return (
        <Stage className={className}>
          <DefineScene {...state} />
        </Stage>
      );
    case "build":
      return (
        <Stage className={className}>
          <BuildScene {...state} />
        </Stage>
      );
    case "measure":
      return (
        <Stage className={className}>
          <MeasureScene {...state} />
        </Stage>
      );
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

function Stage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative h-[180px] w-full shrink-0 overflow-hidden rounded-[18px] border border-border-default bg-bg-subtle md:h-[240px] md:w-[260px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function UnderstandScene({ isActive, reached, reducedMotion }: SceneState) {
  const shown = reached;
  const transition = sceneTransition(isActive, reducedMotion);

  return (
    <svg viewBox="0 0 240 220" className="h-full w-full" fill="none">
      <motion.g
        initial={false}
        animate={shown ? { opacity: 1, y: 0, rotate: -8 } : { opacity: 0, y: 16, rotate: -8 }}
        transition={{ ...transition, delay: shown && isActive && !reducedMotion ? 0.05 : 0 }}
        style={{ transformOrigin: "98px 98px" }}
      >
        <rect
          x="28"
          y="48"
          width="140"
          height="100"
          rx="14"
          className="fill-surface stroke-border-default"
          strokeWidth="1.5"
        />
        <rect x="44" y="68" width="72" height="6" rx="3" className="fill-border-default" />
        <rect x="44" y="84" width="96" height="6" rx="3" className="fill-border-default" />
        <rect x="44" y="100" width="54" height="6" rx="3" className="fill-border-default" />
      </motion.g>
      <motion.g
        initial={false}
        animate={shown ? { opacity: 1, y: 0, rotate: 4 } : { opacity: 0, y: 18, rotate: 4 }}
        transition={{ ...transition, delay: shown && isActive && !reducedMotion ? 0.16 : 0 }}
        style={{ transformOrigin: "142px 116px" }}
      >
        <rect
          x="72"
          y="62"
          width="140"
          height="110"
          rx="14"
          className="fill-surface stroke-accent/50"
          strokeWidth="1.5"
        />
        <rect x="88" y="84" width="88" height="7" rx="3.5" className="fill-text-secondary/35" />
        <rect x="88" y="102" width="108" height="7" rx="3.5" className="fill-text-secondary/25" />
        <rect x="88" y="120" width="64" height="7" rx="3.5" className="fill-accent" />
        <motion.rect
          x="156"
          y="118"
          width="2"
          height="12"
          rx="1"
          className="fill-text-brand"
          animate={
            isActive && !reducedMotion
              ? { opacity: [1, 0, 1] }
              : { opacity: shown ? 1 : 0 }
          }
          transition={
            isActive && !reducedMotion
              ? { duration: 1.1, repeat: Infinity, ease: "linear" }
              : { duration: 0 }
          }
        />
      </motion.g>
    </svg>
  );
}

function DefineScene({ isActive, reached, reducedMotion }: SceneState) {
  const shown = reached;
  const transition = sceneTransition(isActive, reducedMotion);
  const checks = [0, 1, 2];

  return (
    <svg viewBox="0 0 240 220" className="h-full w-full" fill="none">
      <motion.g
        initial={false}
        animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
        transition={transition}
      >
        <rect
          x="50"
          y="28"
          width="140"
          height="164"
          rx="16"
          className="fill-surface stroke-border-default"
          strokeWidth="1.5"
        />
        <rect x="70" y="46" width="64" height="8" rx="4" className="fill-text-secondary/30" />
        {checks.map((index) => {
          const y = 74 + index * 28;
          return (
            <motion.g
              key={index}
              initial={false}
              animate={shown ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
              transition={{
                ...transition,
                delay: shown && isActive && !reducedMotion ? 0.12 + index * 0.12 : 0,
              }}
            >
              <circle cx="78" cy={y} r="8" className="fill-bg-brand-soft stroke-accent" strokeWidth="1.5" />
              <path
                d={`M73 ${y} l4 4 7-8`}
                className="stroke-text-brand"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="94"
                y={y - 4}
                width={index === 1 ? 72 : 56}
                height="7"
                rx="3.5"
                className="fill-text-secondary/25"
              />
            </motion.g>
          );
        })}
        <motion.rect
          x="70"
          y="168"
          height="6"
          rx="3"
          className="fill-accent"
          initial={false}
          animate={{ width: shown ? 100 : 0 }}
          transition={{
            duration: reducedMotion || !isActive ? 0 : 0.7,
            delay: shown && isActive && !reducedMotion ? 0.45 : 0,
            ease: "easeOut",
          }}
        />
      </motion.g>
    </svg>
  );
}

function BuildScene({ isActive, reached, reducedMotion }: SceneState) {
  const shown = reached;
  const transition = sceneTransition(isActive, reducedMotion);

  return (
    <svg viewBox="0 0 240 220" className="h-full w-full" fill="none">
      <motion.rect
        x="28"
        y="36"
        width="148"
        height="108"
        rx="16"
        className="fill-surface stroke-border-default"
        strokeWidth="1.5"
        initial={false}
        animate={shown ? { opacity: 0.55, x: 0, y: 0 } : { opacity: 0, x: -12, y: 10 }}
        transition={{ ...transition, delay: shown && isActive && !reducedMotion ? 0.04 : 0 }}
      />
      <motion.rect
        x="44"
        y="50"
        width="148"
        height="112"
        rx="16"
        className="fill-surface stroke-border-strong/40"
        strokeWidth="1.5"
        initial={false}
        animate={shown ? { opacity: 0.8, x: 0, y: 0 } : { opacity: 0, x: -8, y: 12 }}
        transition={{ ...transition, delay: shown && isActive && !reducedMotion ? 0.12 : 0 }}
      />
      <motion.g
        initial={false}
        animate={shown ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: -4, y: 16 }}
        transition={{ ...transition, delay: shown && isActive && !reducedMotion ? 0.22 : 0 }}
      >
        <rect
          x="62"
          y="66"
          width="148"
          height="118"
          rx="16"
          className="fill-surface stroke-accent/60"
          strokeWidth="1.5"
        />
        <circle cx="80" cy="86" r="4" className="fill-accent" />
        <circle cx="94" cy="86" r="4" className="fill-border-default" />
        <circle cx="108" cy="86" r="4" className="fill-border-default" />
        <rect x="78" y="108" width="92" height="8" rx="4" className="fill-text-secondary/30" />
        <rect x="78" y="126" width="116" height="8" rx="4" className="fill-text-secondary/20" />
        <rect x="78" y="144" width="68" height="8" rx="4" className="fill-accent/80" />
      </motion.g>
    </svg>
  );
}

function MeasureScene({ isActive, reached, reducedMotion }: SceneState) {
  const shown = reached;
  const transition = sceneTransition(isActive, reducedMotion);
  const spark = "M28 148 C58 148, 72 118, 96 118 S132 92, 156 78 S196 70, 212 48";

  return (
    <>
      <svg viewBox="0 0 240 220" className="h-full w-full" fill="none">
        <line x1="28" y1="172" x2="212" y2="172" className="stroke-border-default" strokeWidth="1.5" />
        <line x1="28" y1="48" x2="28" y2="172" className="stroke-border-default" strokeWidth="1.5" />
        <motion.path
          d={spark}
          className="stroke-accent"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={false}
          animate={{ pathLength: shown ? 1 : 0, opacity: shown ? 1 : 0 }}
          transition={{
            duration: reducedMotion || !isActive ? 0 : 1.05,
            ease: "easeInOut",
          }}
        />
        <motion.circle
          cx="212"
          cy="48"
          r="6"
          className="fill-accent"
          initial={false}
          animate={shown ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
          transition={{
            ...transition,
            delay: shown && isActive && !reducedMotion ? 0.85 : 0,
          }}
        />
      </svg>
      <div className="pointer-events-none absolute top-4 left-5">
        <MetricCount play={shown} reducedMotion={reducedMotion} isActive={isActive} />
      </div>
    </>
  );
}

function MetricCount({
  play,
  reducedMotion,
  isActive,
}: {
  play: boolean;
  reducedMotion: boolean;
  isActive: boolean;
}) {
  const count = useMotionValue(0);
  const label = useTransform(count, (value) => `${Math.round(value)}×`);

  useEffect(() => {
    const next = play ? 3 : 0;
    if (reducedMotion) {
      count.set(next);
      return;
    }

    const controls = animate(count, next, {
      duration: play && isActive ? 1 : 0,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [count, isActive, play, reducedMotion]);

  return (
    <motion.p
      className="m-0 text-2xl font-semibold tracking-[-0.4px] text-text-brand"
      initial={false}
      animate={{ opacity: play ? 1 : 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.3 }}
    >
      {label}
    </motion.p>
  );
}

function sceneTransition(isActive: boolean, reducedMotion: boolean) {
  if (reducedMotion || !isActive) {
    return { duration: 0 };
  }

  return { type: "spring" as const, stiffness: 280, damping: 24 };
}
