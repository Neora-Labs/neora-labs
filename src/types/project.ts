export type ProjectCategory = "web_app" | "ai_automation" | "integration";

export type ProjectFeatures = {
  authentication: boolean | null;
  payments: boolean | null;
  adminPanel: boolean | null;
  notifications: boolean | null;
  ai: boolean | null;
  additional: string[];
};

export type ProjectSpec = {
  category: ProjectCategory | null;
  businessGoal: string | null;
  projectDescription: string | null;
  platforms: string[];
  users: {
    types: string[];
    estimatedCount: number | null;
  };
  features: ProjectFeatures;
  integrations: string[];
  existingSystem: string | null;
  timeline: string | null;
  budget: {
    min?: number;
    max?: number;
    currency?: string;
  } | null;
  openQuestions: string[];
  discoveryConfidence: number;
};

export type ProjectEstimate = {
  min: number;
  max: number;
  currency: "EUR";
  confidence: number;
};

export type LeadContact = {
  name: string;
  email: string;
  companyName?: string;
  phone?: string;
};

export type DiscoveryPhase = "discovery" | "confirmation" | "contact" | "complete";

export type DiscoveryMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  createdAt: string;
};

export type QuickReply = {
  label: string;
  value: string;
};

export type DiscoverySnapshot = {
  sessionId: string;
  phase: DiscoveryPhase;
  messages: DiscoveryMessage[];
  spec: ProjectSpec;
  askedQuestionIds: string[];
  questionCount: number;
  currentQuestionId: string | null;
  quickReplies: QuickReply[];
  summary: string | null;
  estimate: ProjectEstimate | null;
  contact: LeadContact | null;
  delivery: {
    clientEmailSent: boolean;
    internalReportSent: boolean;
  } | null;
};
