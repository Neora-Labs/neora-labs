type LogLevel = "info" | "warn" | "error";

export function logEvent(
  level: LogLevel,
  event: string,
  details: Record<string, string | number | boolean | null> = {},
) {
  const entry = JSON.stringify({ level, event, timestamp: new Date().toISOString(), ...details });
  if (level === "error") console.error(entry);
  else if (level === "warn") console.warn(entry);
  else console.info(entry);
}
