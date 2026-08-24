"use client";

import { useState } from "react";
import type { QuickReply } from "@/types/project";

export function ChatComposer({ disabled, quickReplies, onSubmit }: { disabled: boolean; quickReplies: QuickReply[]; onSubmit: (message: string) => Promise<void> | void }) {
  const [draft, setDraft] = useState("");
  function submit(value: string) { const message = value.trim(); if (!message || disabled) return; setDraft(""); void onSubmit(message); }
  return <div className="shrink-0 border-t border-border-default bg-bg-default"><div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 py-4 sm:px-6">
    {quickReplies.length ? <div className="flex flex-wrap gap-2" role="group" aria-label="Respuestas rápidas opcionales">{quickReplies.map((reply) => <button key={reply.value} type="button" disabled={disabled} onClick={() => submit(reply.value)} className="rounded-full border border-border-strong bg-surface px-3.5 py-2 text-left text-sm font-semibold text-text-primary transition-colors hover:bg-bg-brand-soft disabled:opacity-60">{reply.label}</button>)}</div> : null}
    <form className="flex items-end gap-2" onSubmit={(event) => { event.preventDefault(); submit(draft); }}><textarea rows={2} value={draft} disabled={disabled} maxLength={4_000} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); submit(draft); } }} placeholder="Escribe con tus propias palabras…" aria-label="Tu respuesta" className="min-h-11 flex-1 resize-none rounded-[14px] border border-border-default bg-surface-raised px-3.5 py-3 text-sm text-text-primary placeholder:text-text-secondary focus:border-border-strong disabled:opacity-60" /><button type="submit" disabled={disabled || !draft.trim()} className="inline-flex h-11 items-center justify-center rounded-[14px] bg-action px-5 text-sm font-semibold text-action-fg transition-colors hover:bg-action-hover disabled:cursor-not-allowed disabled:opacity-60">Enviar</button></form>
  </div></div>;
}
