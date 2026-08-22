"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import {
  applyTheme,
  getServerThemeSnapshot,
  getThemeSnapshot,
  subscribeTheme,
  type Theme,
} from "@/lib/theme";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  function toggleTheme() {
    applyTheme(oppositeTheme(theme));
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"
      }
      aria-pressed={theme === "dark"}
      className={cn(
        "inline-flex size-12 items-center justify-center rounded-[14px] text-text-primary transition-colors duration-200 hover:bg-bg-brand-soft",
        className,
      )}
    >
      <span className="sr-only">Cambiar tema</span>
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function oppositeTheme(theme: Theme): Theme {
  switch (theme) {
    case "light":
      return "dark";
    case "dark":
      return "light";
    default: {
      const exhaustive: never = theme;
      return exhaustive;
    }
  }
}

function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M17.5 14.2A7.5 7.5 0 0 1 9.8 6.5 6.2 6.2 0 1 0 17.5 14.2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 3.2v1.6M12 19.2v1.6M4.8 12H3.2M20.8 12h-1.6M6.3 6.3l1.1 1.1M16.6 16.6l1.1 1.1M17.7 6.3l-1.1 1.1M7.4 16.6l-1.1 1.1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
