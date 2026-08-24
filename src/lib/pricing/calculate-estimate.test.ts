import { describe, expect, it } from "vitest";
import { createEmptyProjectSpec } from "@/lib/discovery/project-spec";
import { calculateEstimate } from "@/lib/pricing/calculate-estimate";

describe("calculateEstimate", () => {
  it("calculates a deterministic EUR range from known requirements", () => {
    const spec = createEmptyProjectSpec();
    spec.category = "web_app";
    spec.discoveryConfidence = 0.9;
    spec.platforms = ["web"];
    spec.features.authentication = true;
    spec.features.payments = true;
    spec.integrations = ["Stripe"];

    expect(calculateEstimate(spec)).toEqual({ min: 9_500, max: 11_500, currency: "EUR", confidence: 0.9 });
  });

  it("does not allow estimates without a classified category", () => {
    expect(() => calculateEstimate(createEmptyProjectSpec())).toThrow("PRICING_CONFIGURATION_ERROR");
  });
});
