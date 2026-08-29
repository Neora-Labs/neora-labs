const LOGO_SRC =
  "https://cdn.jsdelivr.net/gh/Neora-Labs/neora-labs@main/public/brand/logo-on-light.png";
const ISOTYPE_SRC =
  "https://cdn.jsdelivr.net/gh/Neora-Labs/neora-labs@main/public/brand/isotype.png";

const COLOR_INK = "#182623";
const COLOR_MUTED = "#485c58";
const COLOR_BRAND = "#087e6b";
const FONT = "Arial, Helvetica, sans-serif";

export type EmailSignaturePerson = {
  name: string;
  role: string;
  email: string;
};

export const defaultSignaturePerson: EmailSignaturePerson = {
  name: "Nombre Apellido",
  role: "Cargo",
  email: "nombre@neora-labs.com",
};

function link(href: string, label: string): string {
  return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color:${COLOR_BRAND};text-decoration:none;"><span style="color:${COLOR_BRAND};text-decoration:none;">${label}</span></a>`;
}

function brandRule(): string {
  return `<div style="width:36px;height:2px;background-color:${COLOR_BRAND};margin:10px 0;font-size:0;line-height:0;">&nbsp;</div>`;
}

function locationsLine(): string {
  return `<div style="margin:8px 0 0 0;font-family:${FONT};font-size:11px;line-height:16px;letter-spacing:0.4px;color:${COLOR_MUTED};">Colombia · Polonia · España</div>`;
}

export function buildCompanySignatureHtml(): string {
  return `<div style="font-family:${FONT};font-size:13px;line-height:1.45;color:${COLOR_INK};max-width:420px;">
  <div style="margin:0;padding:0;">
    <div style="margin:0 0 12px 0;">
      <a href="https://neoralabs.com" target="_blank" rel="noopener noreferrer" style="text-decoration:none;">
        <img src="${LOGO_SRC}" width="160" height="40" alt="Neora Labs" style="display:block;border:0;outline:none;text-decoration:none;width:160px;height:auto;max-width:160px;">
      </a>
    </div>
    <div style="margin:0;color:${COLOR_MUTED};font-size:13px;line-height:18px;">
      Software a medida para Europa y EE.&nbsp;UU.
    </div>
    ${brandRule()}
    <div style="margin:0 0 2px 0;line-height:20px;">
      ${link("mailto:info@neora-labs.com", "info@neora-labs.com")}
    </div>
    <div style="margin:0;line-height:20px;">
      ${link("https://neoralabs.com", "neoralabs.com")}
    </div>
    ${locationsLine()}
  </div>
</div>`;
}

export function buildPersonalSignatureHtml(
  person: EmailSignaturePerson = defaultSignaturePerson,
): string {
  const emailHref = `mailto:${person.email}`;

  return `<div style="font-family:${FONT};font-size:13px;line-height:1.45;color:${COLOR_INK};max-width:420px;">
  <div style="margin:0;padding:0;overflow:hidden;">
    <div style="float:left;width:48px;margin:2px 14px 0 0;">
      <a href="https://neoralabs.com" target="_blank" rel="noopener noreferrer" style="text-decoration:none;">
        <img src="${ISOTYPE_SRC}" width="48" height="48" alt="Neora Labs" style="display:block;border:0;outline:none;text-decoration:none;width:48px;height:48px;">
      </a>
    </div>
    <div style="overflow:hidden;">
      <div style="margin:0;font-size:16px;line-height:22px;font-weight:bold;color:${COLOR_INK};">
        ${escapeHtml(person.name)}
      </div>
      <div style="margin:2px 0 0 0;color:${COLOR_MUTED};font-size:13px;line-height:18px;">
        ${escapeHtml(person.role)}
      </div>
      <div style="margin:2px 0 0 0;color:${COLOR_BRAND};font-size:13px;line-height:18px;">
        Neora Labs
      </div>
      ${brandRule()}
      <div style="margin:0;line-height:20px;">
        ${link(emailHref, escapeHtml(person.email))}
        <span style="color:${COLOR_MUTED};">&nbsp;·&nbsp;</span>
        ${link("https://neoralabs.com", "neoralabs.com")}
      </div>
      ${locationsLine()}
    </div>
  </div>
</div>`;
}

export function wrapTransactionalEmailHtml(textBody: string): string {
  const paragraphs = escapeHtml(textBody)
    .split("\n")
    .map((line) => (line.length === 0 ? "&nbsp;" : line))
    .join("<br>");

  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Neora Labs</title>
  </head>
  <body style="margin:0;padding:0;background-color:#ffffff;">
    <div style="padding:24px 20px;font-family:${FONT};font-size:14px;line-height:22px;color:${COLOR_INK};">
      ${paragraphs}
    </div>
    <div style="padding:8px 20px 28px 20px;">
      ${buildCompanySignatureHtml()}
    </div>
  </body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
