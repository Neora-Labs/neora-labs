import { describe, expect, it } from "vitest";
import { getMessages } from "@/i18n/get-messages";
import { buildBriefReport, type BriefAnswers } from "@/lib/brief";
import {
  countryToMarket,
  resolveRequestMarket,
  type Market,
} from "@/lib/market";
import {
  formatInvestmentBand,
  formatSprintInvestment,
  getPricingProfile,
} from "@/lib/pricing";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";
import { POST as submitBrief } from "@/app/api/brief/route";

const complete: BriefAnswers = {
  problem: "Los pedidos se copian entre tres herramientas y se pierden horas cada día.",
  currentProcess: "El equipo copia pedidos manualmente desde el correo al ERP.",
  businessImpact: "time",
  scale: "medium",
  currentTools: "several",
  desiredOutcome: "reduce_manual",
  urgency: "this_quarter",
};

describe("commercial market resolution", () => {
  it.each([
    ["ES", "europe"],
    ["PL", "europe"],
    ["NO", "europe"],
    ["CO", "latam"],
    ["BR", "latam"],
    ["US", "north_america"],
    ["CA", "north_america"],
    ["JP", "default"],
    [null, "default"],
  ] satisfies Array<[string | null, Market]>)('maps country %s to %s', (country, market) => {
    expect(countryToMarket(country)).toBe(market);
  });

  it("normalizes country codes and only accepts a valid manual override", () => {
    expect(countryToMarket(" co ")).toBe("latam");
    expect(resolveRequestMarket("PL", "latam")).toEqual({
      country: "PL",
      detectedMarket: "europe",
      market: "latam",
      source: "override",
    });
    expect(resolveRequestMarket("PL", "invalid")).toEqual({
      country: "PL",
      detectedMarket: "europe",
      market: "europe",
      source: "detected",
    });
  });

  it("keeps locale and commercial market independent", () => {
    expect(formatSprintInvestment("latam", "pl")).toContain("390");
    expect(formatSprintInvestment("latam", "pl")).toContain("USD");
    expect(formatSprintInvestment("europe", "es")).toContain("750");
  });
});

describe("central pricing", () => {
  it("exposes the provisional profiles from one source", () => {
    expect(getPricingProfile("europe")).toMatchObject({ currency: "EUR", sprintAmount: 750, rateFactor: 1 });
    expect(getPricingProfile("latam")).toMatchObject({ currency: "USD", sprintAmount: 390, rateFactor: 0.52 });
    expect(getPricingProfile("north_america")).toMatchObject({ currency: "USD", sprintAmount: 950, rateFactor: 1.27 });
    expect(getPricingProfile("default")).toEqual(getPricingProfile("europe"));
  });

  it("formats ranges with the selected market currency", () => {
    expect(formatInvestmentBand(29_500, 48_000, "latam", "es")).toContain("USD");
    expect(formatInvestmentBand(56_500, 92_000, "europe", "es")).toContain("€");
  });

  it("uses the same explicit market in brief calculations and traceability", () => {
    const report = buildBriefReport(complete, "automate", getMessages("en"), "en", "latam");
    expect(report.market).toBe("latam");
    expect(report.band).toMatchObject({ min: 29_500, max: 48_000, currency: "USD" });
    expect(report.investmentRange).toContain("USD");
    expect(report.body).toContain("Latin America");
  });
});

describe("market propagation boundaries", () => {
  it("persists detected country and market while preserving a valid override", () => {
    const request = new NextRequest("https://neora.test/es", {
      headers: {
        "x-vercel-ip-country": "PL",
        cookie: "neora-market-override=latam",
      },
    });
    const response = proxy(request);
    expect(response.cookies.get("neora-country")?.value).toBe("PL");
    expect(response.cookies.get("neora-market-detected")?.value).toBe("europe");
    expect(response.cookies.get("neora-market")?.value).toBe("latam");
  });

  it("rejects a submitted brief without a supported market", async () => {
    const response = await submitBrief(new Request("https://neora.test/api/brief", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ locale: "es", market: "unknown" }),
    }));
    expect(response.status).toBe(400);
  });
});
