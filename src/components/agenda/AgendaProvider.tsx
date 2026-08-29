"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useMessages } from "@/components/i18n/MessagesProvider";
import { Button } from "@/components/ui/Button";

const AGENDA_HASH = "#agenda";

type AgendaListener = () => void;

const agendaListeners = new Set<AgendaListener>();

function emitAgendaChange() {
  for (const listener of agendaListeners) {
    listener();
  }
}

function subscribeAgendaHash(onChange: AgendaListener) {
  agendaListeners.add(onChange);
  if (agendaListeners.size === 1) {
    window.addEventListener("hashchange", emitAgendaChange);
    window.addEventListener("popstate", emitAgendaChange);
  }
  return () => {
    agendaListeners.delete(onChange);
    if (agendaListeners.size === 0) {
      window.removeEventListener("hashchange", emitAgendaChange);
      window.removeEventListener("popstate", emitAgendaChange);
    }
  };
}

function getAgendaHashSnapshot() {
  return window.location.hash === AGENDA_HASH;
}

function getAgendaHashServerSnapshot() {
  return false;
}

function currentUrlWithoutHash() {
  return `${window.location.pathname}${window.location.search}`;
}

function openAgendaHash() {
  if (window.location.hash !== AGENDA_HASH) {
    window.history.pushState(null, "", `${currentUrlWithoutHash()}${AGENDA_HASH}`);
  }
  emitAgendaChange();
}

function closeAgendaHash() {
  if (window.location.hash === AGENDA_HASH) {
    window.history.replaceState(null, "", currentUrlWithoutHash());
  }
  emitAgendaChange();
}

function subscribeAlwaysMounted() {
  return () => {};
}

function getClientMounted() {
  return true;
}

function getServerMounted() {
  return false;
}

type AgendaContextValue = {
  open: () => void;
  close: () => void;
  isOpen: boolean;
};

const AgendaContext = createContext<AgendaContextValue | null>(null);

type AgendaProviderProps = {
  calUrl: string | null;
  children: ReactNode;
};

export function AgendaProvider({ calUrl, children }: AgendaProviderProps) {
  const isOpen = useSyncExternalStore(
    subscribeAgendaHash,
    getAgendaHashSnapshot,
    getAgendaHashServerSnapshot,
  );
  const open = useCallback(() => {
    openAgendaHash();
  }, []);
  const close = useCallback(() => {
    closeAgendaHash();
  }, []);

  return (
    <AgendaContext.Provider value={{ open, close, isOpen }}>
      {children}
      <AgendaModal calUrl={calUrl} isOpen={isOpen} onClose={close} />
    </AgendaContext.Provider>
  );
}

export function useAgenda(): AgendaContextValue {
  const value = useContext(AgendaContext);
  if (!value) {
    throw new Error("useAgenda must be used within AgendaProvider");
  }
  return value;
}

type AgendaTriggerProps = {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "link";
  onClick?: () => void;
};

export function AgendaTrigger({
  children,
  className,
  variant = "primary",
  onClick,
}: AgendaTriggerProps) {
  const { open } = useAgenda();

  function handleClick() {
    onClick?.();
    open();
  }

  switch (variant) {
    case "link":
      return (
        <button type="button" onClick={handleClick} className={className}>
          {children}
        </button>
      );
    case "primary":
      return (
        <Button onClick={handleClick} className={className}>
          {children}
        </Button>
      );
    case "secondary":
      return (
        <Button variant="secondary" onClick={handleClick} className={className}>
          {children}
        </Button>
      );
    default: {
      const exhaustive: never = variant;
      return exhaustive;
    }
  }
}

function AgendaModal({
  calUrl,
  isOpen,
  onClose,
}: {
  calUrl: string | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { contact } = useMessages();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const mounted = useSyncExternalStore(subscribeAlwaysMounted, getClientMounted, getServerMounted);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const dialog = dialogRef.current;
      if (!dialog) {
        return;
      }

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>("button:not([disabled]), iframe"),
      );
      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        className="absolute inset-0 bg-ink/50"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[min(52rem,100dvh)] w-full max-w-[720px] flex-col overflow-hidden rounded-t-[18px] border border-border-default bg-surface shadow-[0_2px_6px_-2px_rgb(15_25_23_/_0.05),0_8px_24px_-6px_rgb(15_25_23_/_0.1)] sm:rounded-[18px]"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border-default px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="text-lg font-semibold tracking-[-0.2px] text-text-primary sm:text-xl"
            >
              {contact.agenda.heading}
            </h2>
            <p className="mt-1 text-sm leading-6 text-text-secondary">{contact.agenda.body}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-[14px] px-3 py-2 text-sm font-semibold text-text-secondary transition-colors hover:bg-bg-brand-soft hover:text-text-primary"
          >
            {contact.agenda.close}
          </button>
        </header>
        <div className="min-h-0 flex-1 bg-bg-subtle">
          {calUrl ? (
            <iframe
              title={contact.agenda.embedTitle}
              src={calUrl}
              className="h-[min(40rem,calc(100dvh-11rem))] w-full border-0"
            />
          ) : (
            <p className="px-6 py-16 text-center text-sm leading-6 text-text-secondary">
              {contact.agenda.unavailable}
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
