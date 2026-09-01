import { describe, expect, it, vi } from "vitest";
import { generateObject } from "ai";

vi.mock("ai", () => ({ generateObject: vi.fn() }));
import { getBriefSteps, getNextAgentTurn, adaptBusinessAnswersToMatrix, buildBriefReport, recommendRouteFromAnswers, type BriefAnswers } from "@/lib/brief";
import { parseAdvisoryTurn, resolveCompletedBrief, resolveRecommendedRoute, selectResponseLanguage, nextIncompleteField, runBriefChatTurn } from "@/lib/brief-agent";
import { getMessages } from "@/i18n/get-messages";

const es = getMessages("es");
const complete: BriefAnswers = {
  problem: "Los pedidos se copian entre tres herramientas y se pierden horas cada dÃ­a.",
  currentProcess: "El equipo copia pedidos manualmente desde el correo al ERP.",
  businessImpact: "time",
  scale: "medium",
  currentTools: "several",
  desiredOutcome: "reduce_manual",
  urgency: "this_quarter",
};

describe("advisory brief", () => {
  it("asks business inputs in the advisory sequence and never gates the report on email", () => {
    expect(getBriefSteps(es).map((step) => step.id)).toEqual([
      "problem", "currentProcess", "businessImpact", "scale", "currentTools", "desiredOutcome", "urgency",
    ]);
    expect(nextIncompleteField(complete)).toBeNull();
  });

  it("accepts only the supported recommendation routes", () => {
    expect(parseAdvisoryTurn({
      reply: "", slots: {}, confidence: {}, recommendedRoute: "automate", routeConfidence: 0.9,
    }).success).toBe(true);
    expect(parseAdvisoryTurn({
      reply: "", slots: {}, confidence: {}, recommendedRoute: "adopt_tool", routeConfidence: 0.9,
    }).success).toBe(true);
    expect(parseAdvisoryTurn({
      reply: "", slots: {}, confidence: {}, recommendedRoute: "invent_a_tool", routeConfidence: 0.9,
    }).success).toBe(false);
  });

  it("forces an advisory sprint whenever route confidence is low", () => {
    expect(resolveRecommendedRoute("custom_build", 0.69)).toBe("advisory_sprint");
    expect(resolveRecommendedRoute("custom_build", 0.7)).toBe("custom_build");
  });

  it("uses the visitor's dominant language, then the selected locale, then Spanish", () => {
    expect(selectResponseLanguage([{ role: "user", text: "We need help with our current process and tools." }], "pl")).toBe("en");
    expect(selectResponseLanguage([], "pl")).toBe("pl");
    expect(selectResponseLanguage([], undefined)).toBe("es");
  });

  it("keeps deterministic investment bands behind the explicit adapter", () => {
    expect(adaptBusinessAnswersToMatrix(complete, "automate")).toMatchInlineSnapshot(`
      {
        "integrations": "several",
        "need": "automation",
        "scale": "medium",
        "stage": "operating",
      }
    `);
    expect(buildBriefReport(complete, "automate", es, "es").band).toMatchInlineSnapshot(`
      {
        "kind": "project",
        "max": 92000,
        "min": 56500,
        "weeksMax": 18,
        "weeksMin": 11,
      }
    `);
  });

  it("keeps completed non-sprint routes and makes adopt_tool reachable", () => {
    const adoptAnswers = { ...complete, currentTools: "none" as const, desiredOutcome: "improve_existing" as const };
    expect(recommendRouteFromAnswers(adoptAnswers)).toBe("adopt_tool");
    expect(resolveCompletedBrief(adoptAnswers, es, "es")).toMatchObject({ recommendedRoute: "adopt_tool" });
    expect(getNextAgentTurn(adoptAnswers, es, "es")).toMatchObject({ kind: "report", report: { recommendedRoute: "adopt_tool" } });
  });

  it("uses the fixed sprint offer instead of a matrix range", () => {
    const report = buildBriefReport(complete, "advisory_sprint", es, "es");
    expect(report.investmentRange).toMatch(/^Desde 750/)
    expect(report.timelineRange).toBe("1 semana");
    expect(buildBriefReport(complete, "advisory_sprint", getMessages("en"), "en").investmentRange).toMatch(/^From/);
    expect(buildBriefReport(complete, "advisory_sprint", getMessages("pl"), "pl").timelineRange).toBe("1 tydzień");
  });

  it("keeps the Polish brief advisory-first and captures email after the recommendation", () => {
    const pl = getMessages("pl");

    expect(pl.brief).toMatchObject({
      eyebrow: "DORADZTWO TECHNOLOGICZNE",
      title: "Doradca technologiczny",
      emptyHeadline: "Zacznijmy od problemu biznesowego.",
      reportReady: "Rekomendacja gotowa",
      reportTitle: "Rekomendacja technologiczna — Neora Labs",
      newBrief: "Nowa rekomendacja",
    });
    expect(pl.brief.advisory.problem.prompt).toBe("Jaki problem, proces lub decyzja technologiczna Cię blokuje?");
    expect(pl.brief.emailCapture.body).toContain("Opcjonalnie");
  });

  it("uses model route confidence on a completed guided brief", async () => {
    const prior = process.env.OPENAI_API_KEY;
    process.env.OPENAI_API_KEY = "test-key";
    vi.mocked(generateObject).mockResolvedValueOnce({ object: { reply: "I need to confirm the route.", slots: {}, confidence: {}, recommendedRoute: "custom_build", routeConfidence: 0.2, clarifyField: null } } as never);
    await expect(runBriefChatTurn({ locale: "es", history: [], answers: complete, catalog: es })).resolves.toMatchObject({ fallback: false, report: { recommendedRoute: "advisory_sprint" } });
    vi.mocked(generateObject).mockResolvedValueOnce({ object: { reply: "A tool is the right next move.", slots: {}, confidence: {}, recommendedRoute: "adopt_tool", routeConfidence: 0.9, clarifyField: null } } as never);
    await expect(runBriefChatTurn({ locale: "es", history: [], answers: complete, catalog: es })).resolves.toMatchObject({ fallback: false, report: { recommendedRoute: "adopt_tool" } });
    process.env.OPENAI_API_KEY = prior;
  });

  it("falls back without a key or after the maximum number of turns", async () => {
    const prior = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    await expect(runBriefChatTurn({ locale: "es", history: [], answers: {}, catalog: es })).resolves.toMatchObject({ fallback: true });
    process.env.OPENAI_API_KEY = prior;
    await expect(runBriefChatTurn({ locale: "es", history: Array.from({ length: 21 }, () => ({ role: "user" as const, text: "Necesitamos ayuda con el proceso actual." })), answers: {}, catalog: es })).resolves.toMatchObject({ fallback: true });
  });
});

