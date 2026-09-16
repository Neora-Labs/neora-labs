"use client";

import { useLocale } from "@/components/i18n/MessagesProvider";
import { useMarket } from "@/components/market/MarketProvider";
import { interpolate } from "@/i18n/interpolate";
import type { Messages } from "@/i18n/messages/es";
import { formatSprintInvestment, getPricingProfile } from "@/lib/pricing";

export function SprintPrice({ sprint }: { sprint: Messages["brief"]["sprint"] }) {
  const locale = useLocale();
  const { initialized, market } = useMarket();
  if (!initialized) return <>{sprint.pendingPrice}</>;
  const pricing = getPricingProfile(market);
  return (
    <>{interpolate(sprint.priceTemplate, {
      amount: formatSprintInvestment(market, locale),
      weeks: String(pricing.sprintWeeks),
    })}</>
  );
}
