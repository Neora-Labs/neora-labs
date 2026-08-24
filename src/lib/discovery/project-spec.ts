import type { ProjectSpec } from "@/types/project";

export function createEmptyProjectSpec(): ProjectSpec {
  return {
    category: null,
    businessGoal: null,
    projectDescription: null,
    platforms: [],
    users: { types: [], estimatedCount: null },
    features: {
      authentication: null,
      payments: null,
      adminPanel: null,
      notifications: null,
      ai: null,
      additional: [],
    },
    integrations: [],
    existingSystem: null,
    timeline: null,
    budget: null,
    openQuestions: [],
    discoveryConfidence: 0,
  };
}
