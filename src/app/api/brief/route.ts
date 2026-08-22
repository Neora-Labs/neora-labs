import { buildBriefReport, parseBriefAnswers } from "@/lib/brief";
import { site } from "@/lib/content";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "JSON inválido." }, { status: 400 });
  }

  const parsed = parseBriefAnswers(payload);
  if (!parsed.ok) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  const report = buildBriefReport(parsed.answers);
  const emailed = await sendWithResend(parsed.answers.email, report.body);

  return Response.json({ emailed });
}

async function sendWithResend(visitorEmail: string, body: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return false;
  }

  const from = process.env.BRIEF_FROM_EMAIL ?? `Neora Labs <${site.email}>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [site.email],
      reply_to: visitorEmail,
      subject: `Brief de proyecto — ${visitorEmail}`,
      text: body,
    }),
  });

  return response.ok;
}
