import {
  completeConversation,
  confirmSummary,
  continueConversation,
  correctSummary,
  startConversation,
} from "@/lib/discovery/conversation.service";
import { discoveryRequestSchema } from "@/lib/discovery/schemas";
import { logEvent } from "@/lib/server/log";
import { checkRateLimit } from "@/lib/server/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const rate = checkRateLimit(forwarded ?? "anonymous");
  if (!rate.allowed) {
    return Response.json(
      { code: "RATE_LIMIT_EXCEEDED", error: "Has enviado demasiados mensajes. Espera unos minutos e inténtalo de nuevo." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ code: "VALIDATION_ERROR", error: "La solicitud no contiene JSON válido." }, { status: 400 });
  }
  const parsed = discoveryRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json(
      { code: "VALIDATION_ERROR", error: parsed.error.issues[0]?.message ?? "Revisa los datos enviados." },
      { status: 400 },
    );
  }

  try {
    const command = parsed.data;
    const snapshot =
      command.action === "start"
        ? await startConversation(command.initialCategory, command.initialMessage)
        : command.action === "message"
          ? await continueConversation(command.snapshot, command.message)
          : command.action === "confirm"
            ? await confirmSummary(command.snapshot)
            : command.action === "correct"
              ? await correctSummary(command.snapshot, command.message)
              : await completeConversation(command.snapshot, command.contact);
    return Response.json({ snapshot });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown discovery error";
    logEvent("error", "discovery_request_failed", { message: message.slice(0, 300) });
    const databaseError = message.startsWith("DATABASE_ERROR");
    return Response.json(
      {
        code: databaseError ? "DATABASE_ERROR" : "DISCOVERY_ERROR",
        error: databaseError
          ? "No pudimos guardar la conversación. Inténtalo de nuevo."
          : "No pudimos procesar ese mensaje. Inténtalo de nuevo.",
      },
      { status: 500 },
    );
  }
}
