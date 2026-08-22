"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BriefAgent } from "@/components/brief/BriefAgent";
import {
  BriefMorphShell,
  type BriefMorphOrigin,
  type BriefMorphPhase,
} from "@/components/brief/BriefMorphShell";
import { HeroCarousel } from "@/components/hero/HeroCarousel";
import { heroSlides } from "@/lib/content";

type BriefPhase = "idle" | BriefMorphPhase;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function snapshotOrigin(card: HTMLDivElement | null): BriefMorphOrigin {
  const rect = card?.getBoundingClientRect();
  if (!rect) {
    return {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

export function HeroStage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState<BriefPhase>("idle");
  const [session, setSession] = useState(0);
  const [initialPrompt, setInitialPrompt] = useState("");
  const [origin, setOrigin] = useState<BriefMorphOrigin | null>(null);
  const slide = heroSlides[activeIndex];
  const cardRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<BriefPhase>("idle");
  const restoreFocusRef = useRef(false);
  const briefOpen = phase !== "idle";

  function openBrief(prompt?: string) {
    if (phaseRef.current !== "idle") {
      return;
    }
    setInitialPrompt(prompt?.trim() ?? "");
    setSession((value) => value + 1);
    setOrigin(snapshotOrigin(cardRef.current));
    const next: BriefPhase = prefersReducedMotion() ? "open" : "entering";
    phaseRef.current = next;
    setPhase(next);
  }

  function closeBrief() {
    const current = phaseRef.current;
    if (current === "idle" || current === "exiting") {
      return;
    }
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    restoreFocusRef.current = true;
    if (prefersReducedMotion()) {
      phaseRef.current = "idle";
      setPhase("idle");
      return;
    }
    phaseRef.current = "exiting";
    setPhase("exiting");
  }

  const handleEntered = useCallback(() => {
    if (phaseRef.current !== "entering") {
      return;
    }
    phaseRef.current = "open";
    setPhase("open");
  }, []);

  const handleExited = useCallback(() => {
    if (phaseRef.current !== "exiting") {
      return;
    }
    phaseRef.current = "idle";
    setPhase("idle");
  }, []);

  useEffect(() => {
    if (phase !== "idle" || !restoreFocusRef.current) {
      return;
    }
    restoreFocusRef.current = false;
    cardRef.current?.querySelector<HTMLElement>("[data-hero-cta]")?.focus();
  }, [phase]);

  useEffect(() => {
    return () => {
      document.documentElement.classList.remove("brief-morph", "brief-active");
    };
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (phase === "idle" || prefersReducedMotion()) {
      html.classList.remove("brief-morph", "brief-active");
      return;
    }

    html.classList.add("brief-morph");
    if (phase === "entering" || phase === "open") {
      html.classList.add("brief-active");
    } else {
      html.classList.remove("brief-active");
    }
  }, [phase]);

  useEffect(() => {
    if (!briefOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [briefOpen]);

  useEffect(() => {
    if (phase !== "open") {
      return;
    }

    const hidden = [
      document.querySelector("body > header"),
      document.getElementById("contenido"),
      document.querySelector("body > footer"),
    ];
    for (const node of hidden) {
      node?.setAttribute("aria-hidden", "true");
      node?.setAttribute("inert", "");
    }

    return () => {
      for (const node of hidden) {
        node?.removeAttribute("aria-hidden");
        node?.removeAttribute("inert");
      }
    };
  }, [phase]);

  useEffect(() => {
    if (!briefOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeBrief();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [briefOpen]);

  return (
    <div
      id="brief"
      className="scroll-mt-[72px] md:scroll-mt-[88px] xl:scroll-mt-[104px]"
    >
      <HeroCarousel
        activeIndex={activeIndex}
        onActiveIndexChange={setActiveIndex}
        onRequestBudget={openBrief}
        cardRef={cardRef}
        locked={briefOpen}
      />
      {phase !== "idle" && origin ? (
        <BriefMorphShell
          origin={origin}
          phase={phase}
          onEntered={handleEntered}
          onExited={handleExited}
        >
          <BriefAgent
            key={session}
            initialNeed={slide.id}
            initialPrompt={initialPrompt}
            onClose={closeBrief}
          />
        </BriefMorphShell>
      ) : null}
    </div>
  );
}
