"use client";

import { useMessages } from "@/components/i18n/MessagesProvider";
import { cn } from "@/lib/cn";
import { type LocationId, type TeamMember } from "@/lib/content";
import {
  COUNTRY_ANCHORS,
  COUNTRY_PATHS,
  LAND_PATH,
  MAP_VIEW,
} from "@/components/international/worldMapPaths";

const LABEL_CLASS: Record<LocationId, string> = {
  colombia: "left-1/2 top-full mt-1.5 -translate-x-1/2",
  poland: "left-1/2 bottom-full mb-1.5 -translate-x-1/2",
  spain: "right-full mr-2 top-1/2 -translate-y-1/2",
};

type PresenceMapProps = {
  activeLocation: LocationId | null;
  onActivate: (id: LocationId) => void;
};

export function PresenceMap({ activeLocation, onActivate }: PresenceMapProps) {
  const { international, team } = useMessages();
  return (
    <div className="relative mx-auto w-full min-w-0 max-w-[560px] text-text-brand xl:min-w-[320px]">
      <div
        className="relative w-full overflow-visible"
        style={{ aspectRatio: `${MAP_VIEW.w} / ${MAP_VIEW.h}` }}
        role="group"
        aria-label={international.mapCaption}
      >
        <svg
          className="size-full overflow-visible rounded-[28px] bg-bg-brand-soft"
          viewBox={`0 0 ${MAP_VIEW.w} ${MAP_VIEW.h}`}
          preserveAspectRatio="xMidYMid meet"
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
                  "cursor-pointer stroke-text-brand motion-safe:transition-[opacity,fill] motion-safe:duration-400",
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
                "group absolute z-10 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center motion-safe:transition-opacity motion-safe:duration-400",
                dimmed && "opacity-55",
              )}
              aria-pressed={activeLocation === node.id}
              aria-label={`${node.label}. ${people.map((member) => memberLabel(member)).join(". ")}`}
              style={{
                left: `${(anchor.x / MAP_VIEW.w) * 100}%`,
                top: `${(anchor.y / MAP_VIEW.h) * 100}%`,
              }}
            >
              <span className="flex items-center motion-safe:transition-transform motion-safe:duration-300 group-hover:scale-[1.12] group-focus-visible:scale-[1.12]">
                {people.map((member, index) => (
                  <span
                    key={member.id}
                    title={memberLabel(member)}
                    className="size-2.5 rounded-full bg-text-brand ring-2 ring-bg-brand-soft"
                    style={{ marginLeft: index === 0 ? 0 : -5 }}
                  />
                ))}
              </span>
              <span
                className={cn(
                  "absolute flex h-8 items-center justify-center whitespace-nowrap rounded-3xl border border-text-brand bg-bg-brand-soft px-3 text-[11px] font-semibold tracking-[0.2px] text-text-brand",
                  LABEL_CLASS[node.id],
                )}
              >
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

function memberLabel(member: Pick<TeamMember, "name" | "city">) {
  const city = member.city?.trim();
  return city ? `${member.name}, ${city}` : member.name;
}
