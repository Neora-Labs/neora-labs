import { z } from "zod";

export const projectCategorySchema = z.enum(["web_app", "ai_automation", "integration"]);

export const projectSpecSchema = z.object({
  category: projectCategorySchema.nullable(),
  businessGoal: compactString(2_000).nullable(),
  projectDescription: compactString(4_000).nullable(),
  platforms: z.array(compactString(120)).max(20),
  users: z.object({
    types: z.array(compactString(120)).max(20),
    estimatedCount: z.number().int().nonnegative().max(1_000_000_000).nullable(),
  }),
  features: z.object({
    authentication: z.boolean().nullable(),
    payments: z.boolean().nullable(),
    adminPanel: z.boolean().nullable(),
    notifications: z.boolean().nullable(),
    ai: z.boolean().nullable(),
    additional: z.array(compactString(160)).max(40),
  }),
  integrations: z.array(compactString(160)).max(30),
  existingSystem: compactString(2_000).nullable(),
  timeline: compactString(500).nullable(),
  budget: z
    .object({
      min: z.number().nonnegative().optional(),
      max: z.number().nonnegative().optional(),
      currency: z.string().trim().min(3).max(8).optional(),
    })
    .nullable(),
  openQuestions: z.array(compactString(500)).max(30),
  discoveryConfidence: z.number().min(0).max(1),
});

export const leadContactSchema = z.object({
  name: z.string().trim().min(2, "Introduce tu nombre.").max(120),
  email: z.string().trim().email("Introduce un correo válido.").max(254),
  companyName: z.string().trim().max(160).optional().transform(emptyToUndefined),
  phone: z.string().trim().max(50).optional().transform(emptyToUndefined),
});

export const discoverySnapshotSchema = z.object({
  sessionId: z.string().uuid(),
  phase: z.enum(["discovery", "confirmation", "contact", "complete"]),
  messages: z
    .array(
      z.object({
        id: z.string().uuid(),
        role: z.enum(["assistant", "user"]),
        content: z.string().min(1).max(4_000),
        createdAt: z.string().datetime(),
      }),
    )
    .max(50),
  spec: projectSpecSchema,
  askedQuestionIds: z.array(z.string().max(80)).max(20),
  questionCount: z.number().int().nonnegative().max(20),
  currentQuestionId: z.string().max(80).nullable(),
  quickReplies: z.array(z.object({ label: z.string().max(80), value: z.string().max(160) })).max(8),
  summary: z.string().max(8_000).nullable(),
  estimate: z
    .object({
      min: z.number().nonnegative(),
      max: z.number().nonnegative(),
      currency: z.literal("EUR"),
      confidence: z.number().min(0).max(1),
    })
    .nullable(),
  contact: leadContactSchema.nullable(),
  delivery: z
    .object({ clientEmailSent: z.boolean(), internalReportSent: z.boolean() })
    .nullable(),
});

export const discoveryRequestSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("start"),
    initialCategory: z.enum(["ai", "automation", "software", "web", "integrations"]).optional(),
    initialMessage: z.string().trim().max(4_000).optional(),
  }),
  z.object({
    action: z.literal("message"),
    snapshot: discoverySnapshotSchema,
    message: z.string().trim().min(1).max(4_000),
  }),
  z.object({ action: z.literal("confirm"), snapshot: discoverySnapshotSchema }),
  z.object({
    action: z.literal("correct"),
    snapshot: discoverySnapshotSchema,
    message: z.string().trim().min(1).max(4_000),
  }),
  z.object({
    action: z.literal("contact"),
    snapshot: discoverySnapshotSchema,
    contact: leadContactSchema,
    website: z.string().max(0).optional(),
  }),
]);

function emptyToUndefined(value: string | undefined): string | undefined {
  return value || undefined;
}

function compactString(maxLength: number) {
  return z
    .string()
    .trim()
    .min(1)
    .max(4_000)
    .transform((value) => truncateAtWord(value, maxLength));
}

function truncateAtWord(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  const cutoff = value.slice(0, maxLength - 1);
  const lastSpace = cutoff.lastIndexOf(" ");
  const end = lastSpace >= Math.floor(maxLength * 0.6) ? lastSpace : cutoff.length;
  return `${cutoff.slice(0, end).trimEnd()}…`;
}
