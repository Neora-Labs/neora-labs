import { discoveryConfig } from "@/config/discovery.config";
import { discoveryQuestions, type DiscoveryQuestion } from "@/lib/discovery/questions";
import type { ProjectSpec } from "@/types/project";

export function getMissingRequirements(spec: ProjectSpec): string[] {
  const category = spec.category;
  return discoveryQuestions
    .filter((question) => !question.categories || !category || question.categories.includes(category))
    .filter((question) => !question.isAnswered(spec))
    .map((question) => question.id);
}

export function calculateDiscoveryConfidence(spec: ProjectSpec): number {
  const checks = [
    spec.category !== null,
    Boolean(spec.businessGoal),
    Boolean(spec.projectDescription),
    spec.category === "integration" ? spec.integrations.length > 0 : spec.users.types.length > 0,
    spec.category === "web_app" ? spec.platforms.length > 0 : true,
    spec.category === "ai_automation" ? spec.features.additional.length > 0 : true,
    Boolean(spec.existingSystem),
    Boolean(spec.timeline),
  ];
  const score = checks.filter(Boolean).length / checks.length;
  return Math.round(score * 100) / 100;
}

export function determineNextQuestion(
  spec: ProjectSpec,
  askedQuestionIds: readonly string[],
): DiscoveryQuestion | null {
  const category = spec.category;
  return (
    discoveryQuestions.find(
      (question) =>
        !askedQuestionIds.includes(question.id) &&
        (!question.categories || !category || question.categories.includes(category)) &&
        !question.isAnswered(spec),
    ) ?? null
  );
}

export function isDiscoveryComplete(spec: ProjectSpec, questionCount: number): boolean {
  if (questionCount >= discoveryConfig.maxQuestions) {
    return true;
  }
  return (
    questionCount >= discoveryConfig.minimumQuestions &&
    calculateDiscoveryConfidence(spec) >= discoveryConfig.minimumConfidenceForConfirmation
  );
}

export function withCalculatedDiscoveryState(spec: ProjectSpec): ProjectSpec {
  const confidence = calculateDiscoveryConfidence(spec);
  return {
    ...spec,
    discoveryConfidence: confidence,
    openQuestions: getMissingRequirements(spec),
  };
}
