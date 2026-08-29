import { describe, expect, it } from "vitest";
import { es } from "@/i18n/messages/es";
import {
  buildBriefReport,
  formatEuroBand,
  formatWeeksBand,
  parseBriefAnswers,
  parseNeed,
  validateTextStep,
} from "@/lib/brief";

const validAnswers = {
  locale: "es",
  need: "web",
  stage: "operating",
  scale: "small",
  integrations: "none",
  problem: "Necesitamos una web que capte leads y los lleve a WhatsApp.",
  email: "nina.v@example.com",
};

describe("parseBriefAnswers", () => {
  it("accepts a complete valid payload", () => {
    const parsed = parseBriefAnswers(validAnswers, es);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.answers.email).toBe("nina.v@example.com");
      expect(parsed.answers.need).toBe("web");
    }
  });

  it("rejects unknown slot ids", () => {
    const parsed = parseBriefAnswers({ ...validAnswers, need: "landing" }, es);
    expect(parsed).toEqual({ ok: false, error: es.brief.missingAnswers });
  });

  it("rejects a short problem and a bad email", () => {
    expect(parseBriefAnswers({ ...validAnswers, problem: "corto" }, es)).toEqual({
      ok: false,
      error: es.brief.problemLength,
    });
    expect(parseBriefAnswers({ ...validAnswers, email: "no-es-correo" }, es)).toEqual({
      ok: false,
      error: es.brief.invalidEmail,
    });
  });
});

describe("parseNeed and validateTextStep", () => {
  it("accepts only catalog need ids", () => {
    expect(parseNeed("ai")).toBe("ai");
    expect(parseNeed("landing")).toBeNull();
  });

  it("validates problem length and email shape", () => {
    expect(validateTextStep("problem", "corto", es)).toBe(es.brief.problemTooShort);
    expect(validateTextStep("email", "mal", es)).toBe(es.brief.emailInvalid);
    expect(validateTextStep("email", "ok@neora-labs.com", es)).toBeNull();
  });
});

describe("report formatting", () => {
  it("formats euro and week bands from the matrix, not the model", () => {
    expect(formatEuroBand(8500, 17000, "es")).toBe("8,5–17 k€");
    expect(formatWeeksBand(2, 4, es)).toBe("2–4 semanas");
  });

  it("builds a report whose band matches lookupInvestmentBand", () => {
    const parsed = parseBriefAnswers(validAnswers, es);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      return;
    }
    const report = buildBriefReport(parsed.answers, es, "es");
    expect(report.band).toEqual({
      min: 8500,
      max: 17000,
      weeksMin: 2,
      weeksMax: 4,
      kind: "project",
    });
    expect(report.rangeLabel).toBe("8,5–17 k€");
    expect(report.body).toContain("nina.v@example.com");
  });
});
