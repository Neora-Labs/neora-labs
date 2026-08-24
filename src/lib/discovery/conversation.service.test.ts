import { afterEach, describe, expect, it, vi } from "vitest";
import { startConversation } from "@/lib/discovery/conversation.service";

describe("conversation service", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("infers explicit requirements and does not ask for them again", async () => {
    vi.stubEnv("OPENAI_API_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
    const snapshot = await startConversation(
      "web",
      "Necesitamos un marketplace B2B donde empresas creen cuentas, publiquen maquinaria y cobren pagos online.",
    );

    expect(snapshot.spec.category).toBe("web_app");
    expect(snapshot.spec.features.authentication).toBe(true);
    expect(snapshot.spec.features.payments).toBe(true);
    expect(snapshot.currentQuestionId).not.toBe("project_overview");
    expect(snapshot.messages.at(-1)?.content).not.toMatch(/¿necesitan cuentas/i);
  });
});
