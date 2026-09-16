"use client";

import { useMessages } from "@/components/i18n/MessagesProvider";
import { useMarket } from "@/components/market/MarketProvider";
import { markets, type Market } from "@/lib/market";
import { cn } from "@/lib/cn";

export function MarketSwitcher({ className }: { className?: string }) {
  const { ui } = useMessages();
  const { initialized, market, setMarketOverride } = useMarket();
  const labels: Record<Market, string> = ui.market;

  if (!initialized) {
    return (
      <label className={cn("inline-flex items-center", className)}>
        <span className="sr-only">{ui.market.switcherAria}</span>
        <select
          value=""
          disabled
          aria-label={ui.market.detecting}
          className="h-10 max-w-32 rounded-xl border border-border-default bg-surface px-2 text-xs font-semibold text-text-secondary"
        >
          <option value="">{ui.market.detecting}</option>
        </select>
      </label>
    );
  }

  return (
    <label className={cn("inline-flex items-center", className)}>
      <span className="sr-only">{ui.market.switcherAria}</span>
      <select
        value={market}
        aria-label={ui.market.currentAria.replace("{market}", labels[market])}
        onChange={(event) => setMarketOverride(event.target.value as Market)}
        className="h-10 max-w-32 rounded-xl border border-border-default bg-surface px-2 text-xs font-semibold text-text-primary outline-none transition-colors hover:bg-bg-brand-soft focus:border-border-strong"
      >
        {markets.map((item) => <option key={item} value={item}>{labels[item]}</option>)}
      </select>
    </label>
  );
}
