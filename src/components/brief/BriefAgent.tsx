"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Isotype } from "@/components/brand/Logo";
import { useLocale, useMessages } from "@/components/i18n/MessagesProvider";
import { localePath } from "@/i18n/config";
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
  type NeedId,
} from "@/lib/brief";
import { cn } from "@/lib/cn";

type ChatMessage = {
  id: string;
  role: "agent" | "user";
  text: string;
};

type SendState = "idle" | "sending" | "sent" | "mailto";

const emptyAnswers: Partial<BriefAnswers> = {};
const TURN_DELAY_MS = 400;
const BUBBLE_EASE = [0.22, 1, 0.36, 1] as const;

const composerClassName =
  "w-full rounded-[14px] border border-border-default bg-surface-raised px-3.5 py-3 text-sm text-text-primary placeholder:text-text-secondary focus:border-border-strong";

const primaryButtonClassName =
  "inline-flex h-11 items-center justify-center rounded-[14px] bg-action px-5 text-sm font-semibold text-action-fg transition-colors hover:bg-action-hover disabled:cursor-not-allowed disabled:opacity-60";

const secondaryButtonClassName =
  "inline-flex h-11 items-center justify-center rounded-[14px] border border-border-strong bg-surface px-5 text-sm font-semibold text-text-primary transition-colors hover:bg-bg-brand-soft";

const ghostButtonClassName =
  "inline-flex h-11 items-center justify-center rounded-[14px] px-3 text-sm font-semibold text-text-secondary transition-colors hover:text-text-primary";

type BriefAgentProps = {
  initialNeed?: Exclude<NeedId, "unclear">;
  initialPrompt?: string;
  onClose?: () => void;
};

export function BriefAgent({ initialNeed, initialPrompt, onClose }: BriefAgentProps) {
  const messages = useMessages();
  const locale = useLocale();
  const briefSteps = getBriefSteps(messages);
  const formId = useId();
  const logRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getServerReducedMotion,
  );
  const [answers, setAnswers] = useState<Partial<BriefAnswers>>(() =>
    initialNeed ? { need: initialNeed } : emptyAnswers,
  );
  const pendingPrompt = useRef(initialPrompt?.trim() ?? "");
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sendState, setSendState] = useState<SendState>("idle");
  const [showTurn, setShowTurn] = useState(true);

  const turn = getNextAgentTurn(answers, messages, locale);
  const visibleTurn = showTurn ? turn : null;
  const currentStep = visibleTurn?.kind === "step" ? visibleTurn.step : null;
  const report = visibleTurn?.kind === "report" ? visibleTurn.report : null;
  const isComplete = Boolean(report);

  useEffect(() => {
    const log = logRef.current;
    if (!log) {
      return;
    }
    log.scrollTop = log.scrollHeight;
  }, [answers, currentStep, report, showTurn]);

  useEffect(() => {
    if (showTurn) {
      return;
    }

    const delay = reducedMotion ? 0 : TURN_DELAY_MS;
    const timer = window.setTimeout(() => setShowTurn(true), delay);
    return () => window.clearTimeout(timer);
  }, [showTurn, reducedMotion, answers]);

  function applyAnswer<K extends BriefStepId>(id: K, value: BriefAnswers[K]) {
    setError(null);
    const next = { ...answers, [id]: value };
    setAnswers(next);
    const nextTurn = getNextAgentTurn(next, messages, locale);
    if (nextTurn.kind === "step" && nextTurn.step.id === "problem" && pendingPrompt.current) {
      setDraft(pendingPrompt.current);
    } else {
      setDraft("");
    }
    setShowTurn(false);
  }

  function submitText(step: Extract<BriefStep, { kind: "text" }>) {
    const message = validateTextStep(step.id, draft, messages);
    if (message) {
      setError(message);
      return;
    }
    applyAnswer(step.id, draft.trim());
  }

  function restart() {
    pendingPrompt.current = "";
    setAnswers(emptyAnswers);
    setDraft("");
    setError(null);
    setSendState("idle");
    setShowTurn(true);
  }

  async function sendReport(current: BriefReport) {
    setSendState("sending");

    try {
      const response = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, ...current.answers }),
      });
      const payload = (await response.json()) as { emailed?: boolean };

      if (response.ok && payload.emailed) {
        setSendState("sent");
        return;
      }
    } catch {
      // Fall through to mailto so the visitor still can send the brief.
    }

    window.location.href = buildMailtoHref(current, messages);
    setSendState("mailto");
  }

  const chat = buildMessages(answers, briefSteps);
  const progressLabel = isComplete
    ? messages.brief.reportReady
    : interpolate(messages.brief.progress, {
        completed: completedCount(answers, briefSteps),
        total: briefSteps.length,
      });

  return (
    <div
      className="flex h-full min-h-0 w-full flex-1 flex-col"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${formId}-title`}
    >
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border-default px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Isotype variant="on-light" className="size-8 dark:hidden" />
          <Isotype variant="on-dark" className="hidden size-8 dark:block" />
          <div>
            <p className="text-xs font-semibold tracking-[0.2px] text-accent">{messages.brief.eyebrow}</p>
            <p id={`${formId}-title`} className="text-sm font-semibold text-text-primary">
              {messages.brief.title}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <p className="text-xs font-semibold tracking-[0.2px] text-text-secondary">{progressLabel}</p>
          {onClose ? (
            <button type="button" onClick={onClose} className={ghostButtonClassName}>
              {messages.brief.backToSite}
            </button>
          ) : null}
        </div>
      </header>

      <div
        ref={logRef}
        className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 overflow-y-auto px-4 py-8 sm:px-6"
        aria-live="polite"
        aria-relevant="additions"
      >
        <AnimatePresence initial={!reducedMotion}>
          <AgentBubble key="intro" reducedMotion={reducedMotion}>
            {messages.brief.intro}
          </AgentBubble>
          {chat.map((message) =>
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
          {showTurn ? null : <TypingIndicator key="typing" reducedMotion={reducedMotion} />}
          {report ? (
            <motion.div
              key="report"
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: 4 }}
              transition={bubbleTransition(reducedMotion)}
              className="rounded-2xl border border-border-default bg-surface p-5 sm:p-6"
            >
              <p className="text-xs font-semibold tracking-[0.2px] text-accent">{messages.brief.investmentHeading}</p>
              <p className="mt-2 text-xl font-bold tracking-[-0.4px] text-text-primary sm:text-2xl">
                {report.rangeLabel}
              </p>
              <p className="mt-1 text-sm leading-6 text-text-secondary">
                {messages.brief.investmentDisclaimer}
              </p>
              <dl className="mt-4 flex flex-col gap-3">
                {report.summaryLines.map((line) => (
                  <div key={line.label}>
                    <dt className="text-[11px] font-semibold tracking-[0.9px] text-accent">{line.label}</dt>
                    <dd className="mt-1 text-sm leading-6 text-text-primary">{line.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-sm leading-6 text-text-secondary">{report.nextStep}</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="shrink-0 border-t border-border-default bg-bg-default">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 py-4 sm:px-6">
          {currentStep?.kind === "choice" ? (
            <div className="flex flex-wrap gap-2" role="group" aria-label={currentStep.prompt}>
              {currentStep.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => applyAnswer(currentStep.id, option.id)}
                  className="rounded-full border border-border-strong bg-surface px-3.5 py-2 text-left text-sm font-semibold text-text-primary transition-colors hover:bg-bg-brand-soft"
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : null}

          {currentStep?.kind === "text" ? (
            <form
              className="flex flex-col gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                submitText(currentStep);
              }}
            >
              {currentStep.inputMode === "email" ? (
                <input
                  id={`${formId}-email`}
                  type="email"
                  autoComplete="email"
                  value={draft}
                  onChange={(event) => {
                    setDraft(event.target.value);
                    setError(null);
                  }}
                  placeholder={currentStep.placeholder}
                  className={composerClassName}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `${formId}-error` : undefined}
                />
              ) : (
                <textarea
                  id={`${formId}-problem`}
                  rows={2}
                  value={draft}
                  onChange={(event) => {
                    setDraft(event.target.value);
                    setError(null);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      submitText(currentStep);
                    }
                  }}
                  placeholder={currentStep.placeholder}
                  className={cn(composerClassName, "resize-none")}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `${formId}-error` : undefined}
                />
              )}
              {error ? (
                <p id={`${formId}-error`} className="text-sm text-text-brand">
                  {error}
                </p>
              ) : null}
              <button type="submit" className={cn(primaryButtonClassName, "self-end")}>
                {messages.brief.submit}
              </button>
            </form>
          ) : null}

          {report ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => void sendReport(report)}
                disabled={sendState === "sending" || sendState === "sent"}
                className={cn(primaryButtonClassName, "sm:flex-1")}
              >
                {sendLabel(sendState, messages)}
              </button>
              <a
                href={localePath(locale, "/contacto")}
                onClick={onClose}
                className={cn(secondaryButtonClassName, "sm:flex-1")}
              >
                {messages.brief.talk}
              </a>
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

function buildMessages(
  answers: Partial<BriefAnswers>,
  steps: readonly BriefStep[],
): ChatMessage[] {
  const messages: ChatMessage[] = [];

  for (const step of steps) {
    const value = answers[step.id];
    if (value === undefined || value === "") {
      break;
    }

    const text = formatStepAnswer(step, String(value), steps);

    messages.push({ id: `${step.id}-q`, role: "agent", text: step.prompt });
    messages.push({ id: `${step.id}-a`, role: "user", text });
  }

  return messages;
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

function AgentBubble({
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
      className="max-w-[85%] rounded-2xl rounded-tl-md bg-bg-brand-soft px-4 py-3 text-sm leading-6 text-text-primary"
    >
      {children}
    </motion.p>
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
    <motion.p
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? undefined : { opacity: 0, y: 4 }}
      transition={bubbleTransition(reducedMotion)}
      className="max-w-[85%] rounded-2xl rounded-tl-md bg-bg-brand-soft px-4 py-3 text-sm text-text-secondary"
    >
      {brief.thinking}
    </motion.p>
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
