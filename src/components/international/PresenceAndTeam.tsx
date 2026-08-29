"use client";

import { useEffect, useState, type FocusEvent } from "react";
import { PresenceMap } from "@/components/international/PresenceMap";
import { TeamRoster } from "@/components/international/TeamRoster";
import { useMessages } from "@/components/i18n/MessagesProvider";
import { type LocationId, type TeamMemberId } from "@/lib/content";

export function PresenceAndTeam() {
  const { team } = useMessages();
  const [activeLocation, setActiveLocation] = useState<LocationId | null>(null);
  const [selectedId, setSelectedId] = useState<TeamMemberId | null>(null);

  function selectMember(id: TeamMemberId) {
    const member = team.find((item) => item.id === id);
    setSelectedId(id);
    if (member) {
      setActiveLocation(member.locationId);
    }
  }

  function closeMember() {
    setSelectedId(null);
    setActiveLocation(null);
  }

  function onPointerLeave() {
    if (selectedId) {
      const member = team.find((item) => item.id === selectedId);
      setActiveLocation(member?.locationId ?? null);
      return;
    }
    setActiveLocation(null);
  }

  function clearIfLeaving(event: FocusEvent<HTMLDivElement>) {
    if (event.currentTarget.contains(event.relatedTarget)) {
      return;
    }
    onPointerLeave();
  }

  useEffect(() => {
    if (!selectedId) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedId(null);
        setActiveLocation(null);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selectedId]);

  return (
    <div
      className="flex flex-col items-center gap-10 xl:flex-row xl:items-center xl:gap-16"
      onPointerLeave={onPointerLeave}
      onBlurCapture={clearIfLeaving}
    >
      <PresenceMap activeLocation={activeLocation} onActivate={setActiveLocation} />
      <div className="w-full min-w-0 xl:flex-1">
        <TeamRoster
          activeLocation={activeLocation}
          selectedId={selectedId}
          onActivate={setActiveLocation}
          onSelect={selectMember}
          onClose={closeMember}
        />
      </div>
    </div>
  );
}
