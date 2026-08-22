"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

export type BriefMorphOrigin = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type BriefMorphPhase = "entering" | "open" | "exiting";

type BriefMorphShellProps = {
  origin: BriefMorphOrigin;
  phase: BriefMorphPhase;
  children: ReactNode;
  onEntered: () => void;
  onExited: () => void;
};

export const BRIEF_MORPH_MS = 700;

export function BriefMorphShell({
  origin,
  phase,
  children,
  onEntered,
  onExited,
}: BriefMorphShellProps) {
  const [entered, setEntered] = useState(phase === "open");
  const expanded = phase === "open" || (phase === "entering" && entered);

  useEffect(() => {
    if (phase !== "entering") {
      return;
    }

    let cancelled = false;
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (!cancelled) {
          setEntered(true);
        }
      });
    });
    const timer = window.setTimeout(onEntered, BRIEF_MORPH_MS);
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [phase, onEntered]);

  useEffect(() => {
    if (phase !== "exiting") {
      return;
    }

    const timer = window.setTimeout(onExited, BRIEF_MORPH_MS);
    return () => window.clearTimeout(timer);
  }, [phase, onExited]);

  const style = {
    "--from-top": `${origin.top}px`,
    "--from-left": `${origin.left}px`,
    "--from-width": `${origin.width}px`,
    "--from-height": `${origin.height}px`,
  } as CSSProperties;

  return createPortal(
    <div
      className={cn("brief-morph-shell", expanded && "is-expanded", phase === "exiting" && "is-exiting")}
      style={style}
    >
      <div className={cn("brief-morph-content", expanded && "is-visible")}>
        {children}
      </div>
    </div>,
    document.body,
  );
}
