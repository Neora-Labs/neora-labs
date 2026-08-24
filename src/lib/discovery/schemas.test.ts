import { describe, expect, it } from "vitest";
import { leadContactSchema, projectSpecSchema } from "@/lib/discovery/schemas";
import { createEmptyProjectSpec } from "@/lib/discovery/project-spec";

describe("discovery schemas", () => {
  it("accepts the canonical empty project state", () => {
    expect(projectSpecSchema.safeParse(createEmptyProjectSpec()).success).toBe(true);
  });

  it("validates contact email addresses", () => {
    expect(leadContactSchema.safeParse({ name: "Ana", email: "ana@example.com" }).success).toBe(true);
    expect(leadContactSchema.safeParse({ name: "Ana", email: "not-an-email" }).success).toBe(false);
  });
});
