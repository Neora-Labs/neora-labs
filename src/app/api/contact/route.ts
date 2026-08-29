import { defaultLocale, isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/get-messages";
import { buildContactBody, isContactHoneypotTripped, parseContactPayload } from "@/lib/contact";
import { guardPublicPost, publicGuardResponse } from "@/lib/request-guard";
import { sendSiteEmail } from "@/lib/resend";

export async function POST(request: Request) {
  const fallback = getMessages(defaultLocale);
  const guarded = await guardPublicPost(request, "contact");
  if (!guarded.ok) {
    return publicGuardResponse(guarded, fallback, fallback.contact.form.invalidJson);
  }

  const payload = guarded.payload;
  if (isContactHoneypotTripped(payload)) {
    return Response.json({ emailed: true });
  }

  const requested = isRecord(payload) && typeof payload.locale === "string" ? payload.locale : null;
  const locale = isLocale(requested) ? requested : defaultLocale;
  const messages = getMessages(locale);

  const parsed = parseContactPayload(payload, messages);
  if (!parsed.ok) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const body = buildContactBody(parsed.message, messages);
    const emailed = await sendSiteEmail({
      to: messages.site.email,
      fromFallbackEmail: messages.site.email,
      replyTo: parsed.message.email,
      subject: `${messages.contact.heading} — ${parsed.message.email}`,
      text: body,
    });

    return Response.json({ emailed });
  } catch {
    return Response.json({ error: messages.api.generic }, { status: 500 });
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
