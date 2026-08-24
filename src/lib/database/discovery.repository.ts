import { isSupabaseConfigured, supabaseRequest } from "@/lib/database/supabase";
import type { DiscoveryMessage, DiscoverySnapshot, LeadContact } from "@/types/project";

export async function persistSnapshot(snapshot: DiscoverySnapshot): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  await supabaseRequest("conversations?on_conflict=session_id", {
    method: "POST",
    prefer: "resolution=merge-duplicates,return=minimal",
    body: {
      session_id: snapshot.sessionId,
      status: snapshot.phase,
      updated_at: new Date().toISOString(),
    },
  });

  const conversation = await supabaseRequest<Array<{ id: string }>>(
    `conversations?session_id=eq.${encodeURIComponent(snapshot.sessionId)}&select=id&limit=1`,
  );
  const conversationId = conversation[0]?.id;
  if (!conversationId) throw new Error("DATABASE_ERROR: conversation was not created");

  await supabaseRequest("project_specs?on_conflict=conversation_id", {
    method: "POST",
    prefer: "resolution=merge-duplicates,return=minimal",
    body: {
      conversation_id: conversationId,
      category: snapshot.spec.category,
      spec_json: snapshot.spec,
      confidence: snapshot.spec.discoveryConfidence,
      estimated_min: snapshot.estimate?.min ?? null,
      estimated_max: snapshot.estimate?.max ?? null,
      currency: snapshot.estimate?.currency ?? null,
      updated_at: new Date().toISOString(),
    },
  });
  return true;
}

export async function persistMessages(
  sessionId: string,
  messages: DiscoveryMessage[],
): Promise<void> {
  if (!isSupabaseConfigured() || messages.length === 0) return;
  const conversation = await supabaseRequest<Array<{ id: string }>>(
    `conversations?session_id=eq.${encodeURIComponent(sessionId)}&select=id&limit=1`,
  );
  const conversationId = conversation[0]?.id;
  if (!conversationId) return;

  await supabaseRequest("messages?on_conflict=id", {
    method: "POST",
    prefer: "resolution=ignore-duplicates,return=minimal",
    body: messages.map((message) => ({
      id: message.id,
      conversation_id: conversationId,
      role: message.role,
      content: message.content,
      created_at: message.createdAt,
    })),
  });
}

export async function persistLead(
  sessionId: string,
  contact: LeadContact,
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const conversation = await supabaseRequest<Array<{ id: string }>>(
    `conversations?session_id=eq.${encodeURIComponent(sessionId)}&select=id&limit=1`,
  );
  const conversationId = conversation[0]?.id;
  if (!conversationId) throw new Error("DATABASE_ERROR: conversation not found for lead");

  await supabaseRequest("leads?on_conflict=conversation_id", {
    method: "POST",
    prefer: "resolution=merge-duplicates,return=minimal",
    body: {
      conversation_id: conversationId,
      name: contact.name,
      email: contact.email,
      company_name: contact.companyName ?? null,
      phone: contact.phone ?? null,
      status: "new",
    },
  });
  return true;
}
