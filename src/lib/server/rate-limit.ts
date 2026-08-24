import { discoveryConfig } from "@/config/discovery.config";

type Entry = { count: number; expiresAt: number };

const buckets = new Map<string, Entry>();

export function checkRateLimit(key: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.expiresAt <= now) {
    buckets.set(key, { count: 1, expiresAt: now + discoveryConfig.rateLimit.windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }
  if (current.count >= discoveryConfig.rateLimit.requests) {
    return { allowed: false, retryAfterSeconds: Math.ceil((current.expiresAt - now) / 1_000) };
  }
  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}
