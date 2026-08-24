import { isSupabaseConfigured, supabaseRequest } from "@/lib/database/supabase";
import { logEvent } from "@/lib/server/log";

type KnowledgeMatch = { title: string; content: string; similarity: number };

export async function retrieveKnowledgeContext(query: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY || !isSupabaseConfigured()) return "";
  try {
    const embeddingResponse = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small",
        input: query,
      }),
    });
    if (!embeddingResponse.ok) throw new Error(`Embedding request failed: ${embeddingResponse.status}`);
    const embeddingPayload = (await embeddingResponse.json()) as {
      data?: Array<{ embedding?: number[] }>;
    };
    const embedding = embeddingPayload.data?.[0]?.embedding;
    if (!embedding) return "";

    const matches = await supabaseRequest<KnowledgeMatch[]>("rpc/match_knowledge_documents", {
      method: "POST",
      body: { query_embedding: embedding, match_threshold: 0.68, match_count: 4 },
    });
    return matches.map((item) => `${item.title}\n${item.content}`).join("\n\n").slice(0, 8_000);
  } catch (error) {
    logEvent("warn", "rag_retrieval_failed", { message: errorMessage(error) });
    return "";
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message.slice(0, 300) : "Unknown RAG error";
}
