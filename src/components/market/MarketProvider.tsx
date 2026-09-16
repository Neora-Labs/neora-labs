"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  MARKET_COOKIE,
  MARKET_COOKIE_MAX_AGE,
  MARKET_OVERRIDE_COOKIE,
  isMarket,
  type Market,
} from "@/lib/market";

type MarketContextValue = {
  market: Market;
  initialized: boolean;
  setMarketOverride: (market: Market) => void;
};

const MarketContext = createContext<MarketContextValue | null>(null);

export function MarketProvider({ children }: { children?: ReactNode }) {
  const [market, setMarket] = useState<Market>("default");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const cookieMarket = readCookie(MARKET_COOKIE);
    const timer = window.setTimeout(() => {
      if (isMarket(cookieMarket)) setMarket(cookieMarket);
      setInitialized(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const value = useMemo<MarketContextValue>(() => ({
    market,
    initialized,
    setMarketOverride(nextMarket) {
      const attributes = `path=/; max-age=${MARKET_COOKIE_MAX_AGE}; samesite=lax`;
      document.cookie = `${MARKET_OVERRIDE_COOKIE}=${nextMarket}; ${attributes}`;
      document.cookie = `${MARKET_COOKIE}=${nextMarket}; ${attributes}`;
      setMarket(nextMarket);
      setInitialized(true);
    },
  }), [initialized, market]);

  return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>;
}

export function useMarket(): MarketContextValue {
  const value = useContext(MarketContext);
  if (!value) throw new Error("useMarket must be used within MarketProvider");
  return value;
}

function readCookie(name: string): string | null {
  const prefix = `${name}=`;
  const entry = document.cookie.split("; ").find((value) => value.startsWith(prefix));
  return entry ? decodeURIComponent(entry.slice(prefix.length)) : null;
}
