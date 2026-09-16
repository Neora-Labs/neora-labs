import { createElement, Fragment } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MessagesProvider } from "@/components/i18n/MessagesProvider";
import { MarketProvider } from "@/components/market/MarketProvider";
import { MarketSwitcher } from "@/components/market/MarketSwitcher";
import { SprintPrice } from "@/components/market/SprintPrice";
import { getMessages } from "@/i18n/get-messages";

describe("static market UI", () => {
  it.each(["es", "en", "pl"] as const)("renders neutral %s copy before cookie initialization", (locale) => {
    const messages = getMessages(locale);
    const content = createElement(
      Fragment,
      null,
      createElement(SprintPrice, { sprint: messages.brief.sprint }),
      createElement(MarketSwitcher),
    );
    const marketTree = createElement(MarketProvider, null, content);
    const html = renderToStaticMarkup(createElement(MessagesProvider, { locale, messages }, marketTree));

    expect(html).toContain(messages.brief.sprint.pendingPrice);
    expect(html).toContain(messages.ui.market.detecting);
    expect(html).not.toMatch(/750|390|950|EUR|USD|€/);
    expect(html).toContain("disabled");
  });
});
