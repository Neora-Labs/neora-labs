import { describe, expect, it } from "vitest";
import { discoverySnapshotSchema, leadContactSchema, projectSpecSchema } from "@/lib/discovery/schemas";
import { createEmptyProjectSpec } from "@/lib/discovery/project-spec";

describe("discovery schemas", () => {
  it("accepts the canonical empty project state", () => {
    expect(projectSpecSchema.safeParse(createEmptyProjectSpec()).success).toBe(true);
  });

  it("validates contact email addresses", () => {
    expect(leadContactSchema.safeParse({ name: "Ana", email: "ana@example.com" }).success).toBe(true);
    expect(leadContactSchema.safeParse({ name: "Ana", email: "not-an-email" }).success).toBe(false);
  });

  it("repairs verbose values from an existing conversation snapshot", () => {
    const spec = createEmptyProjectSpec();
    spec.users.types = [`Equipos comerciales que trabajan con la plataforma todos los días y necesitan gestionar oportunidades. ${"detalle ".repeat(20)}`];
    const parsed = discoverySnapshotSchema.parse({
      sessionId: "20361917-9638-4a2e-a725-4282fd7dfa22",
      phase: "discovery",
      messages: [],
      spec,
      askedQuestionIds: [],
      questionCount: 0,
      currentQuestionId: null,
      quickReplies: [],
      summary: null,
      estimate: null,
      contact: null,
      delivery: null,
    });

    expect(parsed.spec.users.types[0].length).toBeLessThanOrEqual(120);
  });
});
