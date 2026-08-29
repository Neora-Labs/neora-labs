const MAX_KEYS = 4000;

const buckets = new Map<string, number[]>();

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }

  const real = request.headers.get("x-real-ip")?.trim();
  if (real) {
    return real;
  }

  return "unknown";
}

export function consumeRateLimit(options: {
  key: string;
  limit: number;
  windowMs: number;
}): boolean {
  const now = Date.now();
  const cutoff = now - options.windowMs;
  const recent = (buckets.get(options.key) ?? []).filter((stamp) => stamp > cutoff);

  if (recent.length >= options.limit) {
    buckets.set(options.key, recent);
    return false;
  }

  recent.push(now);
  buckets.set(options.key, recent);
  pruneBuckets();
  return true;
}

export function resetRateLimitForTests() {
  buckets.clear();
}

function pruneBuckets() {
  if (buckets.size <= MAX_KEYS) {
    return;
  }

  const extra = buckets.size - MAX_KEYS;
  let removed = 0;
  for (const key of buckets.keys()) {
    buckets.delete(key);
    removed += 1;
    if (removed >= extra) {
      return;
    }
  }
}
