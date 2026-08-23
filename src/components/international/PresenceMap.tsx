"use client";

import { international, team, type LocationId } from "@/lib/content";
import { cn } from "@/lib/cn";
import {
  COUNTRY_ANCHORS,
  COUNTRY_PATHS,
  LAND_PATH,
  MAP_VIEW,
} from "@/components/international/worldMapPaths";

const LABEL_CLASS: Record<LocationId, string> = {
  colombia: "-translate-x-1/2 translate-y-2",
  poland: "translate-x-2 -translate-y-[calc(100%+6px)]",
  spain: "-translate-x-[calc(100%+10px)] -translate-y-1/2",
};

type PresenceMapProps = {
  activeLocation: LocationId | null;
  onActivate: (id: LocationId) => void;
};

export function PresenceMap({ activeLocation, onActivate }: PresenceMapProps) {
  return (
    <div className="relative mx-auto w-full min-w-0 max-w-[560px] text-text-brand xl:min-w-[320px]">
      <div
        className="relative aspect-[1000/520] w-full overflow-visible"
        role="group"
        aria-label={international.mapCaption}
      >
        <svg
          className="size-full overflow-visible rounded-[28px] bg-bg-brand-soft"
          viewBox={`0 0 ${MAP_VIEW.w} ${MAP_VIEW.h}`}
          fill="none"
          aria-hidden="true"
        >
          <path d={LAND_PATH} className="fill-text-brand/12" />
          {international.nodes.map((node) => {
            const dimmed = activeLocation !== null && activeLocation !== node.id;
            return (
              <path
                key={node.id}
                d={COUNTRY_PATHS[node.id]}
                className={cn(
                  "cursor-pointer stroke-text-brand motion-safe:transition-opacity motion-safe:duration-500",
                  dimmed ? "fill-text-brand/25 opacity-55" : "fill-text-brand/55",
                )}
                strokeWidth="1.2"
                onPointerEnter={() => onActivate(node.id)}
                onClick={() => onActivate(node.id)}
              />
            );
          })}
        </svg>

        {international.nodes.map((node) => {
          const anchor = COUNTRY_ANCHORS[node.id];
          const dimmed = activeLocation !== null && activeLocation !== node.id;
          const people = team.filter((member) => member.locationId === node.id);
          return (
            <button
              key={node.id}
              type="button"
              onPointerEnter={() => onActivate(node.id)}
              onFocus={() => onActivate(node.id)}
              className={cn(
                "absolute z-10 flex flex-col items-center gap-1.5 motion-safe:transition-opacity motion-safe:duration-500",
                LABEL_CLASS[node.id],
                dimmed && "opacity-55",
              )}
              aria-pressed={activeLocation === node.id}
              aria-label={`${node.label}. ${people.map((member) => `${member.name}, ${member.city}`).join(". ")}`}
              style={{
                left: `${(anchor.x / MAP_VIEW.w) * 100}%`,
                top: `${(anchor.y / MAP_VIEW.h) * 100}%`,
              }}
            >
              <span className="flex items-center">
                {people.map((member, index) => (
                  <span
                    key={member.id}
                    title={`${member.name} · ${member.city}`}
                    className="size-2.5 rounded-full bg-text-brand ring-2 ring-bg-brand-soft"
                    style={{ marginLeft: index === 0 ? 0 : -5 }}
                  />
                ))}
              </span>
              <span className="flex h-8 items-center justify-center rounded-3xl border border-text-brand bg-bg-brand-soft px-3 text-[11px] font-semibold tracking-[0.2px] text-text-brand">
                {node.label}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-center text-sm leading-6 text-text-secondary">
        {international.mapCaption}
      </p>
    </div>
  );
}
