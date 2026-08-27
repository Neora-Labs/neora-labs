const CAL_HOSTS = new Set(["cal.com"]);

export function getCalEmbedUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_CAL_URL?.trim();
  if (!raw) {
    return null;
  }

  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") {
      return null;
    }
    const host = url.hostname.toLowerCase();
    if (!CAL_HOSTS.has(host) && !host.endsWith(".cal.com")) {
      return null;
    }
    if (!url.searchParams.has("embed")) {
      url.searchParams.set("embed", "true");
    }
    return url.toString();
  } catch {
    return null;
  }
}
