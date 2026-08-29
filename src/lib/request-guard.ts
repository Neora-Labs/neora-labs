import type { Messages } from "@/i18n/messages/es";
import { clientIp, consumeRateLimit } from "@/lib/rate-limit";

export const BODY_LIMIT = {
  contact: 8 * 1024,
  brief: 16 * 1024,
  chat: 32 * 1024,
} as const;

export const RATE = {
  contact: { limit: 5, windowMs: 10 * 60 * 1000 },
  brief: { limit: 5, windowMs: 10 * 60 * 1000 },
  chat: { limit: 20, windowMs: 10 * 60 * 1000 },
} as const;

export type PublicBucket = keyof typeof RATE;

export type GuardFailure =
  | { ok: false; status: 413; code: "payloadTooLarge" }
  | { ok: false; status: 429; code: "rateLimited" }
  | { ok: false; status: 400; code: "invalidJson" };

export type GuardSuccess = { ok: true; payload: unknown };

export async function guardPublicPost(
  request: Request,
  bucket: PublicBucket,
): Promise<GuardSuccess | GuardFailure> {
  const ip = clientIp(request);
  const rate = RATE[bucket];
  if (
    !consumeRateLimit({
      key: `${bucket}:${ip}`,
      limit: rate.limit,
      windowMs: rate.windowMs,
    })
  ) {
    return { ok: false, status: 429, code: "rateLimited" };
  }

  const lengthHeader = request.headers.get("content-length");
  const maxBytes = BODY_LIMIT[bucket];
  if (lengthHeader) {
    const length = Number(lengthHeader);
    if (Number.isFinite(length) && length > maxBytes) {
      return { ok: false, status: 413, code: "payloadTooLarge" };
    }
  }

  const buffer = await request.arrayBuffer();
  if (buffer.byteLength > maxBytes) {
    return { ok: false, status: 413, code: "payloadTooLarge" };
  }

  try {
    const text = new TextDecoder().decode(buffer);
    return { ok: true, payload: JSON.parse(text) as unknown };
  } catch {
    return { ok: false, status: 400, code: "invalidJson" };
  }
}

export function publicGuardResponse(
  failure: GuardFailure,
  messages: Messages,
  invalidJson: string,
): Response {
  switch (failure.code) {
    case "rateLimited":
      return Response.json(
        { error: messages.api.rateLimited },
        { status: 429, headers: { "Retry-After": "600" } },
      );
    case "payloadTooLarge":
      return Response.json({ error: messages.api.payloadTooLarge }, { status: 413 });
    case "invalidJson":
      return Response.json({ error: invalidJson }, { status: 400 });
    default: {
      const exhaustive: never = failure;
      return exhaustive;
    }
  }
}
