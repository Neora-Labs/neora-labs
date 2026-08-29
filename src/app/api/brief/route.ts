import { defaultLocale, isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/get-messages";
import { interpolate } from "@/i18n/interpolate";
import { buildBriefReport, parseBriefAnswers } from "@/lib/brief";
import { guardPublicPost, publicGuardResponse } from "@/lib/request-guard";
import { sendSiteEmail } from "@/lib/resend";

export async function POST(request: Request) {
  const fallback = getMessages(defaultLocale);
  const guarded = await guardPublicPost(request, "brief");
  if (!guarded.ok) {
    return publicGuardResponse(guarded, fallback, fallback.brief.invalidJson);
  }

  const payload = guarded.payload;
  const requested = isRecord(payload) && typeof payload.locale === "string" ? payload.locale : null;
  const locale = isLocale(requested) ? requested : defaultLocale;
  const messages = getMessages(locale);

  const parsed = parseBriefAnswers(payload, messages);
  if (!parsed.ok) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const report = buildBriefReport(parsed.answers, messages, locale);
    const emailed = await sendSiteEmail({
      to: messages.site.email,
      fromFallbackEmail: messages.site.email,
      replyTo: parsed.answers.email,
      subject: interpolate(messages.brief.emailSubject, { email: parsed.answers.email }),
      text: report.body,
    });

    if (emailed) {
      await sendSiteEmail({
        to: parsed.answers.email,
        fromFallbackEmail: messages.site.email,
        replyTo: messages.site.email,
        subject: messages.brief.visitorEmailSubject,
        text: report.visitorBody,
      });
    }

    return Response.json({ emailed });
  } catch {
    return Response.json({ error: messages.api.generic }, { status: 500 });
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
