export const extractionJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["spec", "acknowledgement"],
  properties: {
    acknowledgement: { type: "string", maxLength: 240 },
    spec: {
      type: "object",
      additionalProperties: false,
      required: [
        "category",
        "businessGoal",
        "projectDescription",
        "platforms",
        "users",
        "features",
        "integrations",
        "existingSystem",
        "timeline",
        "budget",
        "openQuestions",
        "discoveryConfidence",
      ],
      properties: {
        category: { anyOf: [{ type: "string", enum: ["web_app", "ai_automation", "integration"] }, { type: "null" }] },
        businessGoal: nullableString(),
        projectDescription: nullableString(),
        platforms: stringArray(),
        users: {
          type: "object",
          additionalProperties: false,
          required: ["types", "estimatedCount"],
          properties: {
            types: stringArray(),
            estimatedCount: { anyOf: [{ type: "integer", minimum: 0 }, { type: "null" }] },
          },
        },
        features: {
          type: "object",
          additionalProperties: false,
          required: ["authentication", "payments", "adminPanel", "notifications", "ai", "additional"],
          properties: {
            authentication: nullableBoolean(),
            payments: nullableBoolean(),
            adminPanel: nullableBoolean(),
            notifications: nullableBoolean(),
            ai: nullableBoolean(),
            additional: stringArray(),
          },
        },
        integrations: stringArray(),
        existingSystem: nullableString(),
        timeline: nullableString(),
        budget: {
          anyOf: [
            {
              type: "object",
              additionalProperties: false,
              required: ["min", "max", "currency"],
              properties: {
                min: { anyOf: [{ type: "number", minimum: 0 }, { type: "null" }] },
                max: { anyOf: [{ type: "number", minimum: 0 }, { type: "null" }] },
                currency: { anyOf: [{ type: "string" }, { type: "null" }] },
              },
            },
            { type: "null" },
          ],
        },
        openQuestions: stringArray(),
        discoveryConfidence: { type: "number", minimum: 0, maximum: 1 },
      },
    },
  },
} as const;

function nullableString() {
  return { anyOf: [{ type: "string" }, { type: "null" }] } as const;
}

function nullableBoolean() {
  return { anyOf: [{ type: "boolean" }, { type: "null" }] } as const;
}

function stringArray() {
  return { type: "array", items: { type: "string" } } as const;
}
