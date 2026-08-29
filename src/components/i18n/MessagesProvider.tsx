"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/es";

type MessagesContextValue = {
  locale: Locale;
  messages: Messages;
};

const MessagesContext = createContext<MessagesContextValue | null>(null);

export function MessagesProvider({
  locale,
  messages,
  children,
}: MessagesContextValue & { children: ReactNode }) {
  return (
    <MessagesContext.Provider value={{ locale, messages }}>{children}</MessagesContext.Provider>
  );
}

export function useMessages(): Messages {
  return useI18n().messages;
}

export function useLocale(): Locale {
  return useI18n().locale;
}

function useI18n(): MessagesContextValue {
  const value = useContext(MessagesContext);
  if (!value) {
    throw new Error("useMessages must be used within MessagesProvider");
  }
  return value;
}
