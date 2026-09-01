"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAgenda } from "@/components/agenda/AgendaProvider";
import { ThemedIsotype } from "@/components/brand/Logo";
import { useLocale, useMessages } from "@/components/i18n/MessagesProvider";
import { interpolate } from "@/i18n/interpolate";
import {
  buildMailtoHref,
  completedCount,
  formatStepAnswer,
  getBriefSteps,
  getNextAgentTurn,
  validateTextStep,
  type BriefAnswers,
  type BriefReport,
  type BriefStep,
  type BriefStepId,
} from "@/lib/brief";
import type { BriefChatMessage, BriefChatResponse } from "@/lib/brief-agent";
import { cn } from "@/lib/cn";

type ChatMessage = {
  id: string;
  role: "agent" | "user";
  text: string;
};

type SendState = "idle" | "sending" | "sent" | "mailto";
type CaptureMode = "chat" | "fsm";

const emptyAnswers: Partial<BriefAnswers> = {};
const TURN_DELAY_MS = 400;
const BUBBLE_EASE = [0.22, 1, 0.36, 1] as const;

const composerClassName =
  "w-full resize-none bg-transparent px-1 py-1 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none";

const primaryButtonClassName =
  "inline-flex h-11 items-center justify-center rounded-[14px] bg-action px-5 text-sm font-semibold text-action-fg transition-colors hover:bg-action-hover disabled:cursor-not-allowed disabled:opacity-60";

const secondaryButtonClassName =
  "inline-flex h-11 items-center justify-center rounded-[14px] border border-border-strong bg-surface px-5 text-sm font-semibold text-text-primary transition-colors hover:bg-bg-brand-soft";

const ghostButtonClassName =
  "inline-flex h-11 items-center justify-center rounded-[14px] px-3 text-sm font-semibold text-text-secondary transition-colors hover:text-text-primary";

const sendButtonClassName =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-action text-action-fg transition-colors hover:bg-action-hover disabled:cursor-not-allowed disabled:opacity-60";

type BriefAgentProps = { initialPrompt?: string; onClose?: () => void; };

export function BriefAgent({ initialPrompt, onClose }: BriefAgentProps) {
  const messages = useMessages();
  const locale = useLocale();
  const { open: openAgenda } = useAgenda();
  const briefSteps = getBriefSteps(messages);
  const formId = useId();
  const logRef = useRef<HTMLDivElement>(null);
  const answersRef = useRef<Partial<BriefAnswers>>(seedAnswers(initialPrompt));
  const nextId = useRef(0);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getServerReducedMotion,
  );
  const [answers, setAnswers] = useState<Partial<BriefAnswers>>(() =>
    seedAnswers(initialPrompt),
  );
  const [history, setHistory] = useState<ChatMessage[]>(() => seedUserMessage(initialPrompt));
  const historyRef = useRef<ChatMessage[]>(seedUserMessage(initialPrompt));
  const [mode, setMode] = useState<CaptureMode>("chat");
  const [clarifyField, setClarifyField] = useState<BriefStepId | null>(null);
  const [chatReport, setChatReport] = useState<BriefReport | null>(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sendState, setSendState] = useState<SendState>("idle");
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [email, setEmail] = useState("");
  const [showTurn, setShowTurn] = useState(true);
  const [busy, setBusy] = useState(() => Boolean(initialPrompt?.trim()));

  const fsmTurn = getNextAgentTurn(answers, messages, locale);
  const visibleFsmTurn = mode === "fsm" && showTurn ? fsmTurn : null;
  const currentStep = visibleFsmTurn?.kind === "step" ? visibleFsmTurn.step : null;
  const report =
    mode === "chat" ? chatReport : visibleFsmTurn?.kind === "report" ? visibleFsmTurn.report : null;
  const isComplete = Boolean(report);
  const clarifyStep =
    mode === "chat" && clarifyField
      ? (briefSteps.find((step) => step.id === clarifyField) ?? null)
      : null;
  const choiceStep =
    mode === "chat" && clarifyStep?.kind === "choice"
      ? clarifyStep
      : currentStep?.kind === "choice"
        ? currentStep
        : null;
  const textStep =
    mode === "chat"
      ? composerTextStep(clarifyStep, messages.brief.composerPlaceholder)
      : currentStep?.kind === "text"
        ? currentStep
        : null;
  const slotLabels: Record<BriefStepId, string> = {
    problem: messages.brief.advisorySummary.problem,
    currentProcess: messages.brief.advisorySummary.process,
    businessImpact: messages.brief.advisorySummary.impact,
    scale: messages.brief.advisory.scale.prompt,
    currentTools: messages.brief.advisory.currentTools.prompt,
    desiredOutcome: messages.brief.advisory.desiredOutcome.prompt,
    urgency: messages.brief.advisory.urgency.prompt,
  };
  const showEmpty = mode === "chat" && !isComplete && history.length === 0 && !busy;
  const showTyping = busy || (mode === "fsm" && !showTurn);

  useEffect(() => {
    const log = logRef.current;
    if (!log) {
      return;
    }
    log.scrollTop = log.scrollHeight;
  }, [answers, currentStep, report, showTurn, history, busy]);

  useEffect(() => {
    if (mode !== "fsm" || showTurn) {
      return;
    }

    const delay = reducedMotion ? 0 : TURN_DELAY_MS;
    const timer = window.setTimeout(() => setShowTurn(true), delay);
    return () => window.clearTimeout(timer);
  }, [showTurn, reducedMotion, answers, mode]);

  async function requestChatTurn(
    nextHistory: ChatMessage[],
    nextAnswers: Partial<BriefAnswers>,
    signal?: AbortSignal,
  ) {
    try {
      const response = await fetch("/api/brief/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          answers: nextAnswers,
          messages: toApiMessages(nextHistory),
        }),
        signal,
      });
      const payload = (await response.json()) as BriefChatResponse & { error?: string };

      if (signal?.aborted) {
        return;
      }

      if (!response.ok || payload.fallback) {
        enterFsm(nextAnswers, nextHistory, payload.fallback ? messages.brief.chatFallback : null);
        return;
      }

      setAnswers(payload.answers);
      answersRef.current = payload.answers;
      setClarifyField(payload.clarifyField);
      setChatReport(payload.report);
      if (payload.reply) {
        const withReply = [...nextHistory, createMessage("agent", payload.reply)];
        setHistory(withReply);
        historyRef.current = withReply;
      } else {
        setHistory(nextHistory);
        historyRef.current = nextHistory;
      }
      setShowTurn(true);
    } catch (caught) {
      if (signal?.aborted || (caught instanceof DOMException && caught.name === "AbortError")) {
        return;
      }
      enterFsm(nextAnswers, nextHistory, messages.brief.chatFallback);
    } finally {
      if (!signal?.aborted) {
        setBusy(false);
      }
    }
  }

  function enterFsm(
    nextAnswers: Partial<BriefAnswers>,
    nextHistory: ChatMessage[],
    notice: string | null,
  ) {
    const log = notice ? [...nextHistory, createMessage("agent", notice)] : nextHistory;
    setMode("fsm");
    setAnswers(nextAnswers);
    answersRef.current = nextAnswers;
    setHistory(log);
    historyRef.current = log;
    setClarifyField(null);
    setChatReport(null);
    setShowTurn(true);
  }

  function createMessage(role: ChatMessage["role"], text: string): ChatMessage {
    nextId.current += 1;
    return { id: `m-${nextId.current}`, role, text };
  }

  useEffect(() => {
    if (historyRef.current.length === 0) {
      return;
    }

    const abort = new AbortController();
    void requestChatTurn(historyRef.current, answersRef.current, abort.signal);
    return () => abort.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one kickoff per overlay session
  }, []);

  function applyFsmAnswer<K extends BriefStepId>(id: K, value: BriefAnswers[K]) {
    setError(null);
    const next = { ...answers, [id]: value };
    setAnswers(next);
    answersRef.current = next;
    setDraft("");
    setShowTurn(false);
  }

  function applyChatChoice(step: Extract<BriefStep, { kind: "choice" }>, optionId: string) {
    const label = formatStepAnswer(step, optionId);
    const nextAnswers = { ...answersRef.current, [step.id]: optionId } as Partial<BriefAnswers>;
    const nextHistory = [...historyRef.current, createMessage("user", label)];
    setAnswers(nextAnswers);
    answersRef.current = nextAnswers;
    setHistory(nextHistory);
    historyRef.current = nextHistory;
    setDraft("");
    setError(null);
    setBusy(true);
    void requestChatTurn(nextHistory, nextAnswers);
  }

  function submitComposer() {
    if (mode === "fsm") {
      if (!currentStep || currentStep.kind !== "text") {
        return;
      }
      const message = validateTextStep(currentStep.id, draft, messages);
      if (message) {
        setError(message);
        return;
      }
      applyFsmAnswer(currentStep.id, draft.trim());
      return;
    }

    const trimmed = draft.trim();
    if (!trimmed) {
      return;
    }

    if (clarifyStep?.kind === "text") {
      const message = validateTextStep(clarifyStep.id, trimmed, messages);
      if (message) {
        setError(message);
        return;
      }
      const nextAnswers = { ...answersRef.current, [clarifyStep.id]: trimmed };
      const nextHistory = [...historyRef.current, createMessage("user", trimmed)];
      setAnswers(nextAnswers);
      answersRef.current = nextAnswers;
      setHistory(nextHistory);
      historyRef.current = nextHistory;
      setDraft("");
      setError(null);
      setBusy(true);
      void requestChatTurn(nextHistory, nextAnswers);
      return;
    }

    const expectedStep = briefSteps.find((step) => {
      const value = answersRef.current[step.id];
      return value === undefined || value === "";
    });
    let nextAnswers = answersRef.current;
    if (expectedStep?.kind === "text") {
      const message = validateTextStep(expectedStep.id, trimmed, messages);
      if (message) {
        setError(message);
        return;
      }
      nextAnswers = { ...answersRef.current, [expectedStep.id]: trimmed };
      setAnswers(nextAnswers);
      answersRef.current = nextAnswers;
    }
    const nextHistory = [...historyRef.current, createMessage("user", trimmed)];
    setHistory(nextHistory);
    historyRef.current = nextHistory;
    setDraft("");
    setError(null);
    setBusy(true);
    void requestChatTurn(nextHistory, nextAnswers);
  }

  function restart() {
    const reset = emptyAnswers;
    answersRef.current = reset;
    historyRef.current = [];
    setAnswers(reset);
    setHistory([]);
    setDraft("");
    setError(null);
    setSendState("idle");
    setShowEmailCapture(false);
    setEmail("");
    setShowTurn(true);
    setClarifyField(null);
    setChatReport(null);
    setMode("chat");
    setBusy(false);
  }

  async function sendReport(current: BriefReport) {
    const recipient = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
      setError(messages.brief.emailCapture.invalid);
      return;
    }
    setSendState("sending");
    try {
      const response = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, answers: current.answers, recommendedRoute: current.recommendedRoute, email: recipient }),
      });
      const payload = (await response.json()) as { emailed?: boolean };
      if (response.ok && payload.emailed) { setSendState("sent"); return; }
    } catch {
      // The mailto fallback preserves delivery when email service is unavailable.
    }
    window.location.href = buildMailtoHref(current, recipient, messages);
    setSendState("mailto");
  }

  function handleSchedule() {
    openAgenda();
    onClose?.();
  }

  const fsmLog = mode === "fsm" ? buildMessages(answers, briefSteps) : [];
  const visibleLog = mode === "chat" ? history : history.length > 0 ? history : fsmLog;
  const progressLabel = isComplete
    ? messages.brief.reportReady
    : interpolate(messages.brief.progress, {
        completed: completedCount(answers, briefSteps),
        total: briefSteps.length,
      });
  const showComposer = !isComplete && (mode === "chat" || Boolean(textStep));
  const composerLocked = busy || (mode === "fsm" && !showTurn);

  return (
    <div
      className="flex h-full min-h-0 w-full flex-1 flex-col bg-bg-default"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${formId}-title`}
    >
      <header className="flex shrink-0 items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <ThemedIsotype className="size-8" />
          <div>
            <p className="text-xs font-semibold tracking-[0.2px] text-accent">{messages.brief.eyebrow}</p>
            <p id={`${formId}-title`} className="text-sm font-semibold text-text-primary">
              {messages.brief.title}
            </p>
          </div>
        </div>
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          <SlotRail
            steps={briefSteps}
            answers={answers}
            labels={slotLabels}
            ariaLabel={isComplete ? messages.brief.reportReady : messages.brief.slotProgress}
            progressLabel={progressLabel}
          />
          {onClose ? (
            <button type="button" onClick={onClose} className={ghostButtonClassName}>
              {messages.brief.backToSite}
            </button>
          ) : null}
        </div>
      </header>

      <div
        ref={logRef}
        className={cn(
          "mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-y-auto px-4 sm:px-6",
          showEmpty ? "items-center justify-center py-6" : "gap-4 py-6",
        )}
        aria-live="polite"
        aria-relevant="additions"
      >
        {showEmpty ? (
          <EmptyStudio
            headline={messages.brief.emptyHeadline}
            intro={messages.brief.intro}
            reducedMotion={reducedMotion}
          />
        ) : (
          <AnimatePresence initial={!reducedMotion}>
            {visibleLog.map((message) =>
              message.role === "agent" ? (
                <AgentBubble key={message.id} reducedMotion={reducedMotion}>
                  {message.text}
                </AgentBubble>
              ) : (
                <UserBubble key={message.id} reducedMotion={reducedMotion}>
                  {message.text}
                </UserBubble>
              ),
            )}
            {currentStep ? (
              <AgentBubble key={`${currentStep.id}-q`} reducedMotion={reducedMotion}>
                {currentStep.prompt}
              </AgentBubble>
            ) : null}
            {showTyping ? <TypingIndicator key="typing" reducedMotion={reducedMotion} /> : null}
            {report ? (
              <motion.div
                key="report"
                initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: 4 }}
                transition={bubbleTransition(reducedMotion)}
                className="rounded-[28px] border border-border-default bg-surface p-6 sm:p-8"
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.2px] text-accent">
                      {messages.brief.investmentHeading}
                    </p>
                    <p className="mt-2 text-3xl font-bold tracking-[-0.6px] text-text-primary">
                      {report.rangeLabel}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-[0.2px] text-accent">
                      {messages.brief.timeHeading}
                    </p>
                    <p className="mt-2 text-3xl font-bold tracking-[-0.6px] text-text-primary">
                      {report.timeLabel}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-text-secondary">
                  {messages.brief.investmentDisclaimer}
                </p>
                <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                  {report.summaryLines.map((line) => (
                    <div key={line.label}>
                      <dt className="text-[11px] font-semibold tracking-[0.9px] text-accent">{line.label}</dt>
                      <dd className="mt-1 text-sm leading-6 text-text-primary">{line.value}</dd>
                    </div>
                  ))}
                </dl>
                <ReportDetail title={messages.brief.report.diagnosisLabel} body={report.diagnosis} />
                <ReportDetail title={messages.brief.report.rationaleLabel} body={report.rationale} />
                <ReportDetail title={messages.brief.report.outcomeLabel} body={report.expectedOutcome} />
                <ReportDetail title={messages.brief.report.assumptionsLabel} body={report.assumptions.join(" ")} />
                <ReportDetail title={messages.brief.report.risksLabel} body={report.risks.join(" ")} />
                <ReportDetail title={messages.brief.report.nextStepLabel} body={report.nextStep} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        )}
      </div>

      <div className="shrink-0 bg-bg-default px-4 pb-5 pt-1 sm:px-6">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
          {showComposer ? (
            <form
              className="rounded-[22px] border border-border-default bg-surface-raised p-3 shadow-sm"
              onSubmit={(event) => {
                event.preventDefault();
                submitComposer();
              }}
            >
              {choiceStep && !isComplete && !showEmpty ? (
                <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label={choiceStep.prompt}>
                  {choiceStep.options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      disabled={composerLocked}
                      onClick={() => {
                        if (mode === "chat") {
                          applyChatChoice(choiceStep, option.id);
                          return;
                        }
                        applyFsmAnswer(choiceStep.id, option.id);
                      }}
                      className="rounded-full border border-border-strong bg-surface px-3.5 py-2 text-left text-sm font-semibold text-text-primary transition-colors hover:bg-bg-brand-soft disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="flex items-end gap-2">
                <textarea
                  id={`${formId}-composer`}
                  rows={2}
                  value={draft}
                  onChange={(event) => { setDraft(event.target.value); setError(null); }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); submitComposer(); }
                  }}
                  placeholder={textStep?.placeholder ?? messages.brief.composerPlaceholder}
                  className={cn(composerClassName, "min-w-0 flex-1")}
                  disabled={composerLocked}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `${formId}-error` : undefined}
                />
                <button
                  type="submit"
                  disabled={composerLocked}
                  className={sendButtonClassName}
                  aria-label={messages.brief.sendAria}
                >
                  <SendIcon />
                </button>
              </div>
              {error ? (
                <p id={`${formId}-error`} className="px-1 pt-2 text-sm text-text-brand">
                  {error}
                </p>
              ) : null}
            </form>
          ) : null}

          {report ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => setShowEmailCapture(true)}
                disabled={sendState === "sent"}
                className={cn(primaryButtonClassName, "sm:flex-1")}
              >
                {sendLabel(sendState, messages)}
              </button>
              {showEmailCapture ? (
                <form className="rounded-[18px] border border-border-default bg-surface-raised p-3 sm:col-span-2" onSubmit={(event) => { event.preventDefault(); void sendReport(report); }}>
                  <p className="text-sm font-semibold text-text-primary">{messages.brief.emailCapture.heading}</p>
                  <p className="mt-1 text-sm text-text-secondary">{messages.brief.emailCapture.body}</p>
                  <div className="mt-3 flex gap-2"><input type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(null); }} placeholder={messages.brief.emailCapture.placeholder} className="min-w-0 flex-1 rounded-[12px] border border-border-default bg-surface px-3 py-2 text-sm text-text-primary" /><button type="submit" disabled={sendState === "sending" || sendState === "sent"} className={primaryButtonClassName}>{sendLabel(sendState, messages)}</button></div>
                </form>
              ) : null}
              <button type="button" onClick={handleSchedule} className={cn(secondaryButtonClassName, "sm:flex-1")}>
                {messages.brief.talk}
              </button>
              <button type="button" onClick={restart} className={ghostButtonClassName}>
                {messages.brief.newBrief}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function seedAnswers(prompt: string | undefined): Partial<BriefAnswers> {
  const text = prompt?.trim() ?? "";
  return text.length >= 10 && text.length <= 2000 ? { problem: text } : {};
}

function seedUserMessage(prompt: string | undefined): ChatMessage[] {
  const text = prompt?.trim() ?? "";
  if (!text) {
    return [];
  }

  return [{ id: "seed-user", role: "user", text }];
}

function composerTextStep(
  clarifyStep: BriefStep | null,
  fallbackPlaceholder: string,
): BriefStep & { kind: "text" } {
  if (clarifyStep?.kind === "text") {
    return clarifyStep;
  }

  return {
    id: "problem",
    kind: "text",
    prompt: "",
    placeholder: fallbackPlaceholder,
    inputMode: "text",
  };
}

function toApiMessages(history: ChatMessage[]): BriefChatMessage[] {
  return history.map((message) => ({ role: message.role, text: message.text }));
}

function buildMessages(
  answers: Partial<BriefAnswers>,
  steps: readonly BriefStep[],
): ChatMessage[] {
  const log: ChatMessage[] = [];

  for (const step of steps) {
    const value = answers[step.id];
    if (value === undefined || value === "") {
      break;
    }

    const text = formatStepAnswer(step, String(value));

    log.push({ id: `${step.id}-q`, role: "agent", text: step.prompt });
    log.push({ id: `${step.id}-a`, role: "user", text });
  }

  return log;
}

function sendLabel(state: SendState, messages: ReturnType<typeof useMessages>): string {
  switch (state) {
    case "sending":
      return messages.brief.sending;
    case "sent":
      return messages.brief.sent;
    case "mailto":
      return messages.brief.mailtoAgain;
    case "idle":
      return messages.brief.sendToNeora;
    default: {
      const _exhaustive: never = state;
      return _exhaustive;
    }
  }
}

function bubbleTransition(reducedMotion: boolean) {
  if (reducedMotion) {
    return { duration: 0 };
  }

  return { duration: 0.28, ease: BUBBLE_EASE };
}

function SlotRail({
  steps,
  answers,
  labels,
  ariaLabel,
  progressLabel,
}: {
  steps: readonly BriefStep[];
  answers: Partial<BriefAnswers>;
  labels: Record<BriefStepId, string>;
  ariaLabel: string;
  progressLabel: string;
}) {
  return (
    <nav aria-label={ariaLabel} className="min-w-0">
      <p className="sr-only">{progressLabel}</p>
      <ol className="flex items-center gap-1.5 sm:gap-3">
        {steps.map((step) => {
          const filled = Boolean(answers[step.id]);
          return (
            <li key={step.id} className="flex items-center gap-1.5">
              <span
                className={cn(
                  "size-2 rounded-full",
                  filled ? "bg-action" : "bg-border-strong",
                )}
                title={labels[step.id]}
              />
              <span
                className={cn(
                  "hidden text-[11px] font-semibold tracking-[0.2px] md:inline",
                  filled ? "text-accent" : "text-text-secondary",
                )}
              >
                {labels[step.id]}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function EmptyStudio({ headline, intro, reducedMotion }: { headline: string; intro: string; reducedMotion: boolean }) {
  return (
    <motion.div initial={reducedMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={bubbleTransition(reducedMotion)} className="relative flex w-full max-w-lg flex-col items-center px-2 text-center">
      <div aria-hidden className="pointer-events-none absolute top-0 size-40 rounded-full bg-bg-brand-soft blur-3xl" />
      <ThemedIsotype className="relative size-16" alt="" />
      <h2 className="relative mt-6 text-2xl font-bold tracking-[-0.5px] text-text-primary sm:text-3xl">{headline}</h2>
      <p className="relative mt-3 max-w-md text-sm leading-6 text-text-secondary">{intro}</p>
    </motion.div>
  );
}

function ReportDetail({ title, body }: { title: string; body: string }) {
  return <div className="mt-5"><p className="text-[11px] font-semibold tracking-[0.9px] text-accent">{title}</p><p className="mt-1 text-sm leading-6 text-text-secondary">{body}</p></div>;
}

function AgentBubble({
  children,
  reducedMotion,
}: {
  children: string;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? undefined : { opacity: 0, y: 4 }}
      transition={bubbleTransition(reducedMotion)}
      className="flex items-start gap-2.5"
    >
      <ThemedIsotype className="mt-0.5 size-7 shrink-0" alt="" />
      <p className="max-w-[85%] rounded-2xl rounded-tl-md bg-bg-brand-soft px-4 py-3 text-sm leading-6 text-text-primary">
        {children}
      </p>
    </motion.div>
  );
}

function UserBubble({
  children,
  reducedMotion,
}: {
  children: string;
  reducedMotion: boolean;
}) {
  return (
    <motion.p
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? undefined : { opacity: 0, y: 4 }}
      transition={bubbleTransition(reducedMotion)}
      className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md bg-action px-4 py-3 text-sm leading-6 text-action-fg"
    >
      {children}
    </motion.p>
  );
}

function TypingIndicator({ reducedMotion }: { reducedMotion: boolean }) {
  const { brief } = useMessages();
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? undefined : { opacity: 0, y: 4 }}
      transition={bubbleTransition(reducedMotion)}
      className="flex items-start gap-2.5"
      role="status"
      aria-label={brief.thinking}
    >
      <ThemedIsotype className="mt-0.5 size-7 shrink-0" alt="" />
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-md bg-bg-brand-soft px-4 py-3.5">
        <span className="size-1.5 rounded-full bg-text-secondary animate-pulse" />
        <span className="size-1.5 rounded-full bg-text-secondary animate-pulse [animation-delay:150ms]" />
        <span className="size-1.5 rounded-full bg-text-secondary animate-pulse [animation-delay:300ms]" />
      </div>
    </motion.div>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
      <path
        d="M12 19V5M5 12l7-7 7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function subscribeReducedMotion(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerReducedMotion() {
  return false;
}
