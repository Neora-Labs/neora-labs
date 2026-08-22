"use client";

import { useState } from "react";
import Image from "next/image";
import { international, team, type LocationId, type TeamMemberId } from "@/lib/content";
import { cn } from "@/lib/cn";

type TeamMember = (typeof team)[number];

type TeamRosterProps = {
  activeLocation: LocationId | null;
  selectedId: TeamMemberId | null;
  onActivate: (id: LocationId) => void;
  onSelect: (id: TeamMemberId) => void;
  onClose: () => void;
};

export function TeamRoster({
  activeLocation,
  selectedId,
  onActivate,
  onSelect,
  onClose,
}: TeamRosterProps) {
  const [shownId, setShownId] = useState<TeamMemberId | null>(selectedId);
  if (selectedId && selectedId !== shownId) {
    setShownId(selectedId);
  }
  const open = Boolean(selectedId);
  const shown = team.find((member) => member.id === (selectedId ?? shownId));
  const others = shown ? team.filter((member) => member.id !== shown.id) : [];
  const left = others.slice(0, 2);
  const right = others.slice(2);

  return (
    <div className="relative min-h-[420px]">
      <ul
        className={cn("flex w-full flex-col justify-center gap-3", open && "pointer-events-none absolute inset-0")}
        aria-hidden={open || undefined}
        aria-label={open ? undefined : "Equipo"}
      >
        {team.map((member, index) => {
          const dimmed = activeLocation !== null && activeLocation !== member.locationId;
          const region = regionLabel(member.locationId);
          const delay = open ? index * 70 : (team.length - 1 - index) * 70;
          return (
            <li
              key={member.id}
              className={cn(
                "motion-safe:transition-[opacity,transform] motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]",
                open && "translate-x-2 opacity-0",
              )}
              style={{ transitionDelay: `${delay}ms` }}
            >
              <button
                type="button"
                aria-expanded={false}
                tabIndex={open ? -1 : undefined}
                onPointerEnter={() => onActivate(member.locationId)}
                onFocus={() => onActivate(member.locationId)}
                onClick={() => onSelect(member.id)}
                className={cn(
                  "flex w-full items-center gap-4 rounded-[18px] border border-border-default bg-surface p-4 text-left motion-safe:transition-opacity motion-safe:duration-500",
                  !open && dimmed && "opacity-55",
                )}
              >
                <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-bg-brand-soft text-sm font-semibold tracking-[0.1px] text-text-brand">
                  {initials(member.name)}
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-semibold tracking-[0.9px] text-text-brand">
                    {member.city.toUpperCase()} · {region}
                  </span>
                  <span className="mt-1 block text-sm font-semibold text-text-primary">{member.name}</span>
                  <span className="mt-0.5 block text-sm text-text-secondary">{member.role}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div
        className={cn(
          "min-h-[420px] motion-safe:transition-opacity motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "relative opacity-100" : "pointer-events-none absolute inset-0 opacity-0",
        )}
        style={{ transitionDelay: open ? "180ms" : "0ms" }}
        aria-hidden={!open || undefined}
      >
        {shown ? (
          <>
            <div className="flex flex-col gap-4 md:hidden">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {team.map((member) => (
                  <RailButton
                    key={member.id}
                    member={member}
                    compact
                    active={member.id === shown.id}
                    dimmed={activeLocation !== null && activeLocation !== member.locationId}
                    onActivate={onActivate}
                    onSelect={onSelect}
                  />
                ))}
              </div>
              <MemberCard member={shown} onClose={onClose} />
            </div>

            <div className="hidden min-h-[420px] grid-cols-[7.5rem_minmax(0,1fr)_7.5rem] gap-3 md:grid">
              <ul className="flex flex-col justify-center gap-3" aria-label="Equipo">
                {left.map((member, index) => (
                  <li
                    key={member.id}
                    className="motion-safe:transition-[opacity,transform] motion-safe:duration-500"
                    style={{ transitionDelay: open ? `${180 + index * 70}ms` : "0ms" }}
                  >
                    <RailButton
                      member={member}
                      active={false}
                      dimmed={activeLocation !== null && activeLocation !== member.locationId}
                      onActivate={onActivate}
                      onSelect={onSelect}
                    />
                  </li>
                ))}
              </ul>
              <MemberCard member={shown} onClose={onClose} />
              <ul className="flex flex-col justify-center gap-3" aria-label="Equipo">
                {right.map((member, index) => (
                  <li
                    key={member.id}
                    className="motion-safe:transition-[opacity,transform] motion-safe:duration-500"
                    style={{ transitionDelay: open ? `${180 + (index + 2) * 70}ms` : "0ms" }}
                  >
                    <RailButton
                      member={member}
                      active={false}
                      dimmed={activeLocation !== null && activeLocation !== member.locationId}
                      onActivate={onActivate}
                      onSelect={onSelect}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function RailButton({
  member,
  active,
  dimmed,
  compact = false,
  onActivate,
  onSelect,
}: {
  member: TeamMember;
  active: boolean;
  dimmed: boolean;
  compact?: boolean;
  onActivate: (id: LocationId) => void;
  onSelect: (id: TeamMemberId) => void;
}) {
  return (
    <button
      type="button"
      aria-expanded={active}
      onPointerEnter={() => onActivate(member.locationId)}
      onFocus={() => onActivate(member.locationId)}
      onClick={() => onSelect(member.id)}
      className={cn(
        "flex items-center gap-2 rounded-[18px] border border-border-default bg-surface text-left motion-safe:transition-opacity motion-safe:duration-500",
        compact ? "shrink-0 px-3 py-2" : "w-full flex-col px-2 py-3",
        dimmed && "opacity-55",
        active && "border-border-strong",
      )}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-brand-soft text-xs font-semibold tracking-[0.1px] text-text-brand">
        {initials(member.name)}
      </span>
      <span className="min-w-0 text-xs font-semibold text-text-primary">
        {compact ? member.name.split(" ")[0] : member.name}
      </span>
    </button>
  );
}

function MemberCard({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  const region = regionLabel(member.locationId);
  const photo = memberPhoto(member);

  return (
    <article className="flex h-full flex-col rounded-[18px] border border-border-default bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold tracking-[0.9px] text-text-brand">
          {member.city.toUpperCase()} · {region}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="text-sm font-semibold text-text-secondary transition-colors hover:text-text-primary"
        >
          Cerrar
        </button>
      </div>
      <div className="mt-4 flex flex-1 flex-col items-center gap-4 sm:flex-row sm:items-start">
        <MemberPhoto member={member} photo={photo} />
        <div className="min-w-0 flex-1">
          <h4 className="text-lg font-semibold text-text-primary">{member.name}</h4>
          <p className="mt-1 text-sm text-text-secondary">{member.role}</p>
          <p className="mt-3 text-sm leading-6 text-text-secondary">{member.bio}</p>
        </div>
      </div>
    </article>
  );
}

function MemberPhoto({ member, photo }: { member: TeamMember; photo?: string }) {
  if (photo) {
    return (
      <div className="relative aspect-[4/5] w-full max-w-[180px] shrink-0 overflow-hidden rounded-[18px] bg-bg-brand-soft">
        <Image src={photo} alt={member.name} fill className="object-cover" sizes="180px" />
      </div>
    );
  }

  return (
    <div className="flex aspect-[4/5] w-full max-w-[180px] shrink-0 items-center justify-center rounded-[18px] bg-bg-brand-soft text-3xl font-bold tracking-[-0.4px] text-text-brand">
      {initials(member.name)}
    </div>
  );
}

function memberPhoto(member: TeamMember) {
  if ("photo" in member && typeof member.photo === "string") {
    return member.photo;
  }
  return undefined;
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function regionLabel(id: LocationId) {
  return international.nodes.find((item) => item.id === id)?.label ?? id;
}
