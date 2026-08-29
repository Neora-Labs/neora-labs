import { wrapTransactionalEmailHtml } from "@/lib/email-signature";

type SendSiteEmailOptions = {
  to: string;
  fromFallbackEmail: string;
  replyTo: string;
  subject: string;
  text: string;
};

export async function sendSiteEmail(options: SendSiteEmailOptions): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return false;
  }

  const from = process.env.BRIEF_FROM_EMAIL ?? `Neora Labs <${options.fromFallbackEmail}>`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [options.to],
        reply_to: options.replyTo,
        subject: options.subject,
        text: options.text,
        html: wrapTransactionalEmailHtml(options.text),
      }),
    });

    return response.ok;
  } catch {
    return false;
  }
}
