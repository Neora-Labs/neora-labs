import type { Messages } from "@/i18n/messages/es";

export type ContactMessage = {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
};

export type ParseContactResult =
  | { ok: true; message: ContactMessage }
  | { ok: false; error: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+\d\s()./-]{6,40}$/;
const NAME_MAX = 80;
const COMPANY_MAX = 80;
const MESSAGE_MAX = 2000;

export function parseContactPayload(payload: unknown, messages: Messages): ParseContactResult {
  if (!isRecord(payload)) {
    return { ok: false, error: messages.contact.form.invalidPayload };
  }

  const name = readTrimmed(payload.name);
  const company = readTrimmed(payload.company);
  const email = readTrimmed(payload.email).toLowerCase();
  const phone = readTrimmed(payload.phone);
  const message = readTrimmed(payload.message);
  const privacy = payload.privacy === true;

  if (name.length < 2 || name.length > NAME_MAX) {
    return { ok: false, error: messages.contact.form.invalidName };
  }
  if (company.length < 1 || company.length > COMPANY_MAX) {
    return { ok: false, error: messages.contact.form.invalidCompany };
  }
  if (!EMAIL_PATTERN.test(email)) {
    return { ok: false, error: messages.contact.form.invalidEmail };
  }
  if (phone.length > 0 && !PHONE_PATTERN.test(phone)) {
    return { ok: false, error: messages.contact.form.invalidPhone };
  }
  if (message.length > MESSAGE_MAX) {
    return { ok: false, error: messages.contact.form.invalidMessage };
  }
  if (!privacy) {
    return { ok: false, error: messages.contact.form.privacyRequired };
  }

  return { ok: true, message: { name, company, email, phone, message } };
}

export function buildContactBody(entry: ContactMessage, messages: Messages): string {
  const lines = [
    messages.contact.heading,
    "",
    `${messages.contact.form.name.label}: ${entry.name}`,
    `${messages.contact.form.company.label}: ${entry.company}`,
    `${messages.contact.form.email.label}: ${entry.email}`,
  ];
  if (entry.phone) {
    lines.push(`${messages.contact.form.phone.label}: ${entry.phone}`);
  }
  if (entry.message) {
    lines.push("", entry.message);
  }
  return lines.join("\n");
}

export function buildContactMailtoHref(entry: ContactMessage, messages: Messages): string {
  const subject = encodeURIComponent(`${messages.contact.heading} — ${entry.email}`);
  const body = encodeURIComponent(buildContactBody(entry, messages));
  return `mailto:${messages.site.email}?subject=${subject}&body=${body}`;
}

export function validateContactField(
  field: keyof ContactMessage | "privacy",
  value: string | boolean,
  messages: Messages,
): string | null {
  switch (field) {
    case "name": {
      const name = typeof value === "string" ? value.trim() : "";
      return name.length < 2 || name.length > NAME_MAX ? messages.contact.form.invalidName : null;
    }
    case "company": {
      const company = typeof value === "string" ? value.trim() : "";
      return company.length < 1 || company.length > COMPANY_MAX
        ? messages.contact.form.invalidCompany
        : null;
    }
    case "email": {
      const email = typeof value === "string" ? value.trim() : "";
      return EMAIL_PATTERN.test(email) ? null : messages.contact.form.invalidEmail;
    }
    case "phone": {
      const phone = typeof value === "string" ? value.trim() : "";
      return phone.length > 0 && !PHONE_PATTERN.test(phone)
        ? messages.contact.form.invalidPhone
        : null;
    }
    case "message": {
      const message = typeof value === "string" ? value.trim() : "";
      return message.length > MESSAGE_MAX ? messages.contact.form.invalidMessage : null;
    }
    case "privacy":
      return value === true ? null : messages.contact.form.privacyRequired;
    default: {
      const exhaustive: never = field;
      return exhaustive;
    }
  }
}

function readTrimmed(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
