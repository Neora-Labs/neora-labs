import { describe, expect, it } from "vitest";
import {
  calculateDiscoveryConfidence,
  determineNextQuestion,
  getMissingRequirements,
  isDiscoveryComplete,
} from "@/lib/discovery/discovery.service";
import { createEmptyProjectSpec } from "@/lib/discovery/project-spec";

describe("discovery service", () => {
  it("selects only unanswered category-specific questions", () => {
    const spec = createEmptyProjectSpec();
    spec.category = "integration";
    spec.businessGoal = "Eliminar la doble entrada de datos";
    spec.projectDescription = "Sincronizar CRM y ERP";
    expect(determineNextQuestion(spec, ["project_overview"] )?.id).toBe("integration_systems");
    expect(getMissingRequirements(spec)).not.toContain("platforms");
  });

  it("raises confidence as essential facts become known", () => {
    const spec = createEmptyProjectSpec();
    const initial = calculateDiscoveryConfidence(spec);
    spec.category = "web_app";
    spec.businessGoal = "Vender online";
    spec.projectDescription = "Marketplace B2B";
    spec.users.types = ["compradores", "vendedores"];
    spec.platforms = ["web"];
    spec.existingSystem = "Desde cero";
    spec.timeline = "Tres meses";
    expect(calculateDiscoveryConfidence(spec)).toBeGreaterThan(initial);
    expect(isDiscoveryComplete(spec, 5)).toBe(true);
  });
});
