import { describe, expect, it } from "vitest";
import { lookupInvestmentBand } from "@/lib/brief-matrix";

describe("lookupInvestmentBand", () => {
  it("locks the web / none / small / operating band", () => {
    expect(lookupInvestmentBand("web", "none", "small", "operating")).toEqual({
      min: 8500,
      max: 17000,
      weeksMin: 2,
      weeksMax: 4,
      kind: "project",
    });
  });

  it("treats unclear need as a definition session", () => {
    expect(lookupInvestmentBand("unclear", "several", "large", "idea")).toEqual({
      min: 5000,
      max: 9500,
      weeksMin: 1,
      weeksMax: 2,
      kind: "definition",
    });
  });

  it("raises cost when stage uncertainty grows", () => {
    const operating = lookupInvestmentBand("software", "one", "medium", "operating");
    const idea = lookupInvestmentBand("software", "one", "medium", "idea");
    expect(idea.min).toBeGreaterThan(operating.min);
    expect(idea.max).toBeGreaterThan(operating.max);
    expect(idea.weeksMin).toBe(operating.weeksMin);
    expect(idea.weeksMax).toBe(operating.weeksMax);
  });

  it("keeps max at least 500 above min after rounding", () => {
    const band = lookupInvestmentBand("web", "none", "small", "operating");
    expect(band.max).toBeGreaterThanOrEqual(band.min + 500);
  });
});
