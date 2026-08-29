import { beforeEach, describe, expect, it } from "vitest";
import { es } from "@/i18n/messages/es";
import { consumeRateLimit, resetRateLimitForTests } from "@/lib/rate-limit";
import { BODY_LIMIT, guardPublicPost, publicGuardResponse } from "@/lib/request-guard";

describe("consumeRateLimit", () => {
  beforeEach(() => {
    resetRateLimitForTests();
  });

  it("allows up to the limit and then blocks", () => {
    expect(consumeRateLimit({ key: "t", limit: 2, windowMs: 60_000 })).toBe(true);
    expect(consumeRateLimit({ key: "t", limit: 2, windowMs: 60_000 })).toBe(true);
    expect(consumeRateLimit({ key: "t", limit: 2, windowMs: 60_000 })).toBe(false);
  });
});

describe("guardPublicPost", () => {
  beforeEach(() => {
    resetRateLimitForTests();
  });

  it("parses a small JSON body", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "203.0.113.10" },
      body: JSON.stringify({ ok: true }),
    });
    await expect(guardPublicPost(request, "contact")).resolves.toEqual({
      ok: true,
      payload: { ok: true },
    });
  });

  it("rejects oversized bodies with 413", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "203.0.113.11" },
      body: JSON.stringify({ pad: "x".repeat(BODY_LIMIT.contact) }),
    });
    await expect(guardPublicPost(request, "contact")).resolves.toEqual({
      ok: false,
      status: 413,
      code: "payloadTooLarge",
    });
  });

  it("rejects invalid JSON with 400", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "203.0.113.12" },
      body: "{",
    });
    await expect(guardPublicPost(request, "contact")).resolves.toEqual({
      ok: false,
      status: 400,
      code: "invalidJson",
    });
  });

  it("rate-limits repeated posts from the same IP", async () => {
    const make = () =>
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-forwarded-for": "203.0.113.13" },
        body: "{}",
      });

    for (let i = 0; i < 5; i += 1) {
      const allowed = await guardPublicPost(make(), "contact");
      expect(allowed.ok).toBe(true);
    }

    await expect(guardPublicPost(make(), "contact")).resolves.toEqual({
      ok: false,
      status: 429,
      code: "rateLimited",
    });
  });
});

describe("publicGuardResponse", () => {
  it("returns generic localized errors without payload details", async () => {
    const limited = publicGuardResponse(
      { ok: false, status: 429, code: "rateLimited" },
      es,
      es.contact.form.invalidJson,
    );
    expect(limited.status).toBe(429);
    expect(limited.headers.get("Retry-After")).toBe("600");
    await expect(limited.json()).resolves.toEqual({ error: es.api.rateLimited });
  });
});
