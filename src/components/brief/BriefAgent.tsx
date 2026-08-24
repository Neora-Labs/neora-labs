"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Isotype } from "@/components/brand/Logo";
import { ChatComposer } from "@/components/discovery/ChatComposer";
import { ChatMessage } from "@/components/discovery/ChatMessage";
import { ContactForm } from "@/components/discovery/ContactForm";
import { EstimateResult } from "@/components/discovery/EstimateResult";
import { ProjectSummary } from "@/components/discovery/ProjectSummary";
import type { DiscoverySnapshot, LeadContact } from "@/types/project";

type InitialNeed = "ai" | "automation" | "software" | "web" | "integrations";
type RequestPayload =
  | { action: "start"; initialCategory?: InitialNeed; initialMessage?: string }
  | { action: "message"; snapshot: DiscoverySnapshot; message: string }
  | { action: "confirm"; snapshot: DiscoverySnapshot }
  | { action: "correct"; snapshot: DiscoverySnapshot; message: string }
  | { action: "contact"; snapshot: DiscoverySnapshot; contact: LeadContact; website: string };

type BriefAgentProps = { initialNeed?: InitialNeed; initialPrompt?: string; onClose?: () => void };

const ghostButtonClassName = "inline-flex h-11 items-center justify-center rounded-[14px] px-3 text-sm font-semibold text-text-secondary transition-colors hover:text-text-primary";

export function BriefAgent({ initialNeed, initialPrompt, onClose }: BriefAgentProps) {
  const titleId = useId();
  const logRef = useRef<HTMLDivElement>(null);
  const [snapshot, setSnapshot] = useState<DiscoverySnapshot | null>(null);
  const [pending, setPending] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const runRequest = useCallback(async (payload: RequestPayload) => {
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/discovery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = (await response.json()) as { snapshot?: DiscoverySnapshot; error?: string };
      if (!response.ok || !data.snapshot) throw new Error(data.error ?? "No pudimos continuar la conversación.");
      setSnapshot(data.snapshot);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No pudimos continuar la conversación.");
    } finally {
      setPending(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void runRequest({ action: "start", initialCategory: initialNeed, initialMessage: initialPrompt?.trim() || undefined });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [initialNeed, initialPrompt, runRequest]);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [snapshot, pending]);

  const phaseLabel = snapshot ? snapshot.phase === "complete" ? "Estimación lista" : snapshot.phase === "confirmation" ? "Revisar alcance" : snapshot.phase === "contact" ? "Último paso" : `${snapshot.questionCount} preguntas` : "Preparando…";

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border-default px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Isotype variant="on-light" className="size-8 dark:hidden" />
          <Isotype variant="on-dark" className="hidden size-8 dark:block" />
          <div><p className="text-xs font-semibold tracking-[0.2px] text-accent">DISCOVERY DE PROYECTO</p><p id={titleId} className="text-sm font-semibold text-text-primary">Agente de alcance</p></div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3"><p className="text-xs font-semibold tracking-[0.2px] text-text-secondary">{phaseLabel}</p>{onClose ? <button type="button" onClick={onClose} className={ghostButtonClassName}>Volver a la web</button> : null}</div>
      </header>

      <div ref={logRef} className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 overflow-y-auto px-4 py-8 sm:px-6" aria-live="polite" aria-relevant="additions">
        {snapshot?.messages.map((item) => <ChatMessage key={item.id} message={item} />)}
        {pending ? <TypingIndicator /> : null}
        {snapshot?.phase === "confirmation" && snapshot.summary ? <ProjectSummary summary={snapshot.summary} disabled={pending} onConfirm={() => void runRequest({ action: "confirm", snapshot })} onCorrect={(message) => runRequest({ action: "correct", snapshot, message })} /> : null}
        {snapshot?.phase === "contact" ? <ContactForm disabled={pending} onSubmit={(contact, website) => runRequest({ action: "contact", snapshot, contact, website })} /> : null}
        {snapshot?.phase === "complete" && snapshot.estimate ? <EstimateResult snapshot={snapshot} onRestart={() => runRequest({ action: "start", initialCategory: initialNeed })} /> : null}
        {error ? <div role="alert" className="rounded-2xl border border-border-default bg-surface px-4 py-3 text-sm text-text-brand">{error} <button type="button" onClick={() => setError(null)} className="ml-2 font-semibold underline">Cerrar</button></div> : null}
      </div>

      {snapshot?.phase === "discovery" ? <ChatComposer disabled={pending} quickReplies={snapshot.quickReplies} onSubmit={(message) => runRequest({ action: "message", snapshot, message })} /> : null}
    </div>
  );
}

function TypingIndicator() {
  return <p className="max-w-[85%] rounded-2xl rounded-tl-md bg-bg-brand-soft px-4 py-3 text-sm text-text-secondary">Pensando…</p>;
}
