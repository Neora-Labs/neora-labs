import { defaultLocale, isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/get-messages";
import { interpolate } from "@/i18n/interpolate";
import { buildBriefReport, parseBriefAnswers, type RecommendedRoute } from "@/lib/brief";
import { sendSiteEmail } from "@/lib/resend";

const routes = new Set<RecommendedRoute>(["keep_current", "adopt_tool", "integrate", "automate", "custom_build", "advisory_sprint"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const fallback = getMessages(defaultLocale);
  let payload: unknown;
  try { payload = await request.json(); } catch { return Response.json({ error: fallback.brief.invalidJson }, { status: 400 }); }
  const requested = isRecord(payload) && typeof payload.locale === "string" ? payload.locale : null;
  const locale = isLocale(requested) ? requested : defaultLocale;
  const messages = getMessages(locale);
  if (!isRecord(payload)) return Response.json({ error: messages.brief.invalidPayload }, { status: 400 });
  const parsed = parseBriefAnswers(payload.answers, messages);
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const recommendedRoute = typeof payload.recommendedRoute === "string" && routes.has(payload.recommendedRoute as RecommendedRoute) ? payload.recommendedRoute as RecommendedRoute : "advisory_sprint";
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });
  if (!emailPattern.test(email)) return Response.json({ error: messages.brief.emailCapture.invalid }, { status: 400 });
  const report = buildBriefReport(parsed.answers, recommendedRoute, messages, locale);
  const emailed = await sendSiteEmail({ to: messages.site.email, fromFallbackEmail: messages.site.email, replyTo: email, subject: interpolate(messages.brief.emailSubject, { email }), text: report.body });
  if (emailed) await sendSiteEmail({ to: email, fromFallbackEmail: messages.site.email, replyTo: messages.site.email, subject: messages.brief.visitorEmailSubject, text: report.visitorBody });
  return Response.json({ emailed });
}
function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null; }
