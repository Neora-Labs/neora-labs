import { defaultLocale, isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/get-messages";
import {
  countUserTurns,
  MAX_CHAT_TURNS,
  parseChatHistory,
  runBriefChatTurn,
  sanitizePartialAnswers,
} from "@/lib/brief-agent";
import { guardPublicPost, publicGuardResponse } from "@/lib/request-guard";

export async function POST(request: Request) {
  const fallback = getMessages(defaultLocale);
  const guarded = await guardPublicPost(request, "chat");
  if (!guarded.ok) {
    return publicGuardResponse(guarded, fallback, fallback.brief.invalidJson);
  }

  const payload = guarded.payload;
  if (!isRecord(payload)) {
    return Response.json({ error: fallback.brief.invalidPayload }, { status: 400 });
  }

  const requested = typeof payload.locale === "string" ? payload.locale : null;
  const locale = isLocale(requested) ? requested : defaultLocale;
  const messages = getMessages(locale);
  const history = parseChatHistory(payload.messages);
  if (history === null) {
    return Response.json({ error: messages.brief.invalidPayload }, { status: 400 });
  }

  if (countUserTurns(history) > MAX_CHAT_TURNS) {
    return Response.json({
      fallback: true,
      reply: null,
      answers: sanitizePartialAnswers(payload.answers, messages),
      clarifyField: null,
      report: null,
    });
  }

  const answers = sanitizePartialAnswers(payload.answers, messages);

  try {
    const turn = await runBriefChatTurn({
      locale,
      history,
      answers,
      catalog: messages,
    });
    return Response.json(turn);
  } catch {
    return Response.json({
      fallback: true,
      reply: null,
      answers,
      clarifyField: null,
      report: null,
    });
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
