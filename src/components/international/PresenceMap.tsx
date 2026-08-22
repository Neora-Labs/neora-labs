"use client";

import { useId } from "react";
import { international, type LocationId } from "@/lib/content";
import { cn } from "@/lib/cn";

const VIEW_W = 520;
const VIEW_H = 500;
const CENTER = { x: 260, y: 248 };

const NODE_LAYOUT: Record<LocationId, { x: number; y: number; control: { x: number; y: number } }> = {
  europa: { x: 118, y: 128, control: { x: 150, y: 200 } },
  usa: { x: 402, y: 128, control: { x: 370, y: 200 } },
  colombia: { x: 260, y: 412, control: { x: 200, y: 340 } },
};

type PresenceMapProps = {
  activeLocation: LocationId | null;
  onActivate: (id: LocationId) => void;
};

export function PresenceMap({ activeLocation, onActivate }: PresenceMapProps) {
  return (
    <div
      className="relative mx-auto aspect-[520/500] w-full min-w-0 max-w-[480px] text-text-brand xl:min-w-[280px]"
      role="group"
      aria-label="Neora conecta talento en Colombia con presencia en Europa y Estados Unidos."
    >
      <svg
        className="pointer-events-none absolute inset-0 size-full"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        fill="none"
        aria-hidden="true"
      >
        <circle cx={CENTER.x} cy={CENTER.y} r="68" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1" />
        <circle cx={CENTER.x} cy={CENTER.y} r="118" stroke="currentColor" strokeOpacity="0.14" strokeWidth="1" />
        <circle cx={CENTER.x} cy={CENTER.y} r="168" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" />
        {international.nodes.map((node) => {
          const layout = NODE_LAYOUT[node.id];
          const dimmed = activeLocation !== null && activeLocation !== node.id;
          return (
            <path
              key={node.id}
              d={`M ${CENTER.x} ${CENTER.y} Q ${layout.control.x} ${layout.control.y} ${layout.x} ${layout.y}`}
              stroke="var(--neora-color-teal-400)"
              strokeWidth="1.25"
              strokeLinecap="round"
              className={cn(
                "transition-opacity duration-500",
                dimmed ? "opacity-[0.22]" : "opacity-[0.55]",
              )}
            />
          );
        })}
      </svg>

      <div className="pointer-events-none absolute top-[49.6%] left-1/2 flex size-[108px] -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full bg-bg-brand-soft">
        <LavaCore />
      </div>

      {international.nodes.map((node) => {
        const layout = NODE_LAYOUT[node.id];
        const dimmed = activeLocation !== null && activeLocation !== node.id;
        return (
          <button
            key={node.id}
            type="button"
            onPointerEnter={() => onActivate(node.id)}
            onFocus={() => onActivate(node.id)}
            className={cn(
              "absolute z-10 flex h-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-3xl border border-text-brand bg-bg-brand-soft px-5 motion-safe:transition-opacity motion-safe:duration-500",
              dimmed && "opacity-55",
            )}
            aria-pressed={activeLocation === node.id}
            style={{
              left: `${(layout.x / VIEW_W) * 100}%`,
              top: `${(layout.y / VIEW_H) * 100}%`,
            }}
          >
            <span className="text-xs font-semibold tracking-[0.2px] text-text-brand">{node.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function LavaCore() {
  const filterId = `lava-goo-${useId().replaceAll(":", "")}`;

  return (
    <svg className="size-[88px]" viewBox="0 0 88 88" aria-hidden="true">
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            result="goo"
          />
        </filter>
      </defs>
      <g filter={`url(#${filterId})`}>
        <circle className="lava-core lava-core-a" cx="40" cy="46" r="22" fill="var(--neora-color-ink-950)" />
        <circle className="lava-core lava-core-b" cx="52" cy="40" r="16" fill="var(--neora-color-ink-950)" />
        <circle className="lava-core lava-core-c" cx="44" cy="54" r="14" fill="var(--neora-color-ink-950)" />
        <circle className="lava-core lava-core-neora" cx="50" cy="44" r="8" fill="var(--neora-color-teal-400)" />
      </g>
    </svg>
  );
}
