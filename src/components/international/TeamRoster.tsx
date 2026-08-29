"use client";

import { useState } from "react";
import Image from "next/image";
import { useMessages } from "@/components/i18n/MessagesProvider";
import { cn } from "@/lib/cn";
import { teamPhotos, type LocationId, type TeamMember, type TeamMemberId } from "@/lib/content";

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
  const { international, team, ui } = useMessages();
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
    <>
      <ul className="grid grid-cols-1 gap-4 md:hidden" aria-label={ui.team.aria}>
        {team.map((member) => {
          const dimmed = activeLocation !== null && activeLocation !== member.locationId;
          return (
            <li key={member.id} className="min-w-0">
              <MemberCard
                member={member}
                dimmed={dimmed}
                highlighted={activeLocation === member.locationId}
                onActivate={onActivate}
              />
            </li>
          );
        })}
      </ul>

      <div className="relative hidden md:grid">
        <ul
          className={cn(
            "col-start-1 row-start-1 flex w-full flex-col justify-center gap-3 motion-safe:transition-[opacity,transform] motion-safe:duration-400 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]",
            open ? "pointer-events-none z-0 -translate-y-1 scale-[0.99] opacity-0" : "z-10",
          )}
          aria-hidden={open || undefined}
          aria-label={open ? undefined : ui.team.aria}
        >
          {team.map((member) => {
            const dimmed = activeLocation !== null && activeLocation !== member.locationId;
            const region = regionLabel(member.locationId, international.nodes);
            return (
              <li key={member.id}>
                <button
                  type="button"
                  aria-expanded={open && shown?.id === member.id}
                  tabIndex={open ? -1 : undefined}
                  onPointerEnter={() => onActivate(member.locationId)}
                  onFocus={() => onActivate(member.locationId)}
                  onClick={() => onSelect(member.id)}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-[18px] border border-border-default bg-surface p-4 text-left motion-safe:transition-[border-color,background-color,opacity,transform] motion-safe:duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:bg-bg-subtle",
                    !open && dimmed && "opacity-55",
                  )}
                >
                  <MemberAvatar member={member} sizeClass="size-14" textClass="text-sm" />
                  <span className="min-w-0">
                    <span className="block text-[11px] font-semibold tracking-[0.9px] text-text-brand">
                      {locationLine(member, region)}
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
            "col-start-1 row-start-1 min-h-[420px] motion-safe:transition-[opacity,transform] motion-safe:duration-400 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]",
            open
              ? "z-10 translate-y-0 scale-100 opacity-100"
              : "pointer-events-none z-0 translate-y-2 scale-[0.98] opacity-0 [&_*]:pointer-events-none",
          )}
          aria-hidden={!open || undefined}
        >
          {shown ? (
            <div
              key={shown.id}
              className="grid min-h-[420px] grid-cols-[7.5rem_minmax(0,1fr)_7.5rem] gap-3"
            >
              <ul className="flex flex-col justify-center gap-3" aria-label={ui.team.aria}>
                {left.map((member, index) => (
                  <li
                    key={member.id}
                    className="motion-safe:animate-team-rise"
                    style={{ animationDelay: `${index * 50}ms` }}
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
              <div className="motion-safe:animate-team-rise" style={{ animationDelay: "70ms" }}>
                <MemberCard
                  member={shown}
                  dimmed={false}
                  highlighted
                  compact
                  onActivate={onActivate}
                  onClose={onClose}
                />
              </div>
              <ul className="flex flex-col justify-center gap-3" aria-label={ui.team.aria}>
                {right.map((member, index) => (
                  <li
                    key={member.id}
                    className="motion-safe:animate-team-rise"
                    style={{ animationDelay: `${120 + index * 50}ms` }}
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
          ) : null}
        </div>
      </div>
    </>
  );
}

function RailButton({
  member,
  active,
  dimmed,
  onActivate,
  onSelect,
}: {
  member: TeamMember;
  active: boolean;
  dimmed: boolean;
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
        "flex w-full flex-col items-center gap-2 rounded-[18px] border border-border-default bg-surface px-2 py-3 text-left motion-safe:transition-[border-color,background-color,opacity,transform] motion-safe:duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:bg-bg-subtle",
        dimmed && "opacity-55",
        active && "border-border-strong",
      )}
    >
      <MemberAvatar member={member} sizeClass="size-10" textClass="text-xs" />
      <span className="min-w-0 text-xs font-semibold text-text-primary">{member.name}</span>
    </button>
  );
}

function MemberCard({
  member,
  dimmed,
  highlighted,
  compact = false,
  onActivate,
  onClose,
}: {
  member: TeamMember;
  dimmed: boolean;
  highlighted: boolean;
  compact?: boolean;
  onActivate: (id: LocationId) => void;
  onClose?: () => void;
}) {
  const { international, ui } = useMessages();
  const region = regionLabel(member.locationId, international.nodes);
  const photo = memberPhoto(member);

  return (
    <article
      className={cn(
        "group flex h-full w-full flex-col overflow-hidden rounded-[22px] border border-border-default bg-surface motion-safe:transition-opacity motion-safe:duration-400",
        compact && "mx-auto max-w-[360px]",
        dimmed && "opacity-55",
      )}
      onPointerEnter={() => onActivate(member.locationId)}
      onFocus={() => onActivate(member.locationId)}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-bg-brand-soft">
        {photo ? (
          <Image
            src={photo}
            alt={member.name}
            fill
            className="object-cover object-top motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
            sizes={compact ? "360px" : "(min-width: 768px) 45vw, 100vw"}
          />
        ) : (
          <div className="flex size-full items-center justify-center text-5xl font-bold tracking-[-0.4px] text-text-brand motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-105">
            {initials(member.name)}
          </div>
        )}
        <p className="absolute top-3 left-3 rounded-full bg-surface/90 px-3 py-1 text-[11px] font-semibold tracking-[0.9px] text-text-brand">
          {locationLine(member, region)}
        </p>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 rounded-full bg-surface/90 px-3 py-1 text-sm font-semibold text-text-secondary motion-safe:transition-colors motion-safe:duration-200 hover:bg-surface hover:text-text-primary"
          >
            {ui.team.close}
          </button>
        ) : null}
      </div>
      <div
        className={cn(
          "flex flex-1 flex-col px-5 py-4 motion-safe:transition-colors motion-safe:duration-300",
          highlighted ? "bg-action" : "bg-bg-subtle group-hover:bg-action",
        )}
      >
        <h4
          className={cn(
            "text-lg font-semibold motion-safe:transition-colors",
            highlighted ? "text-action-fg" : "text-text-primary group-hover:text-action-fg",
          )}
        >
          {member.name}
        </h4>
        <p
          className={cn(
            "mt-1 text-sm motion-safe:transition-colors",
            highlighted ? "text-action-fg/80" : "text-text-secondary group-hover:text-action-fg/80",
          )}
        >
          {member.role}
        </p>
        <p
          className={cn(
            "mt-3 text-sm leading-6 motion-safe:transition-colors",
            highlighted ? "text-action-fg/80" : "text-text-secondary group-hover:text-action-fg/80",
          )}
        >
          {member.bio}
        </p>
      </div>
    </article>
  );
}

function MemberAvatar({
  member,
  sizeClass,
  textClass,
}: {
  member: TeamMember;
  sizeClass: string;
  textClass: string;
}) {
  const photo = memberPhoto(member);
  if (photo) {
    return (
      <span className={cn("relative shrink-0 overflow-hidden rounded-full bg-bg-brand-soft", sizeClass)}>
        <Image src={photo} alt="" fill className="object-cover object-top" sizes="56px" />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-bg-brand-soft font-semibold tracking-[0.1px] text-text-brand",
        sizeClass,
        textClass,
      )}
    >
      {initials(member.name)}
    </span>
  );
}

function memberPhoto(member: TeamMember) {
  if (typeof member.photo === "string" && member.photo.length > 0) {
    return member.photo;
  }
  return teamPhotos[member.id];
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

function regionLabel(id: LocationId, nodes: ReadonlyArray<{ id: LocationId; label: string }>) {
  return nodes.find((item) => item.id === id)?.label ?? id;
}

function locationLine(member: TeamMember, region: string) {
  const city = member.city?.trim();
  if (!city) {
    return region;
  }
  const cityLabel = city.toUpperCase();
  if (cityLabel === region) {
    return region;
  }
  return `${cityLabel} · ${region}`;
}
