import { describe, expect, it } from "vitest";
import { MAX_CHAT_MESSAGES, MAX_MESSAGE_CHARS, parseChatHistory } from "@/lib/brief-agent";

describe("parseChatHistory", () => {
  it("accepts well-formed turns", () => {
    expect(
      parseChatHistory([
        { role: "user", text: "Quiero una web" },
        { role: "agent", text: "¿En qué punto está el negocio?" },
      ]),
    ).toEqual([
      { role: "user", text: "Quiero una web" },
      { role: "agent", text: "¿En qué punto está el negocio?" },
    ]);
  });

  it("rejects oversized messages and oversized histories", () => {
    expect(parseChatHistory([{ role: "user", text: "x".repeat(MAX_MESSAGE_CHARS + 1) }])).toBeNull();
    const tooMany = Array.from({ length: MAX_CHAT_MESSAGES + 1 }, () => ({
      role: "user" as const,
      text: "ok",
    }));
    expect(parseChatHistory(tooMany)).toBeNull();
  });
});
