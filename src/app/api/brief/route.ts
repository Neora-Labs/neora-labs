import { defaultLocale, isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/get-messages";
import { interpolate } from "@/i18n/interpolate";
import { buildBriefReport, parseBriefAnswers } from "@/lib/brief";
import { sendSiteEmail } from "@/lib/resend";

export async function POST(request: Request) {
  const fallback = getMessages(defaultLocale);
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: fallback.brief.invalidJson }, { status: 400 });
  }

  const requested = isRecord(payload) && typeof payload.locale === "string" ? payload.locale : null;
  const locale = isLocale(requested) ? requested : defaultLocale;
  const messages = getMessages(locale);

  const parsed = parseBriefAnswers(payload, messages);
  if (!parsed.ok) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  const report = buildBriefReport(parsed.answers, messages, locale);
  const emailed = await sendSiteEmail({
    to: messages.site.email,
    fromFallbackEmail: messages.site.email,
    replyTo: parsed.answers.email,
    subject: interpolate(messages.brief.emailSubject, { email: parsed.answers.email }),
    text: report.body,
  });

  return Response.json({ emailed });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
