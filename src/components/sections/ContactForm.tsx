"use client";

import { useState, type FormEvent } from "react";
import { useLocale, useMessages } from "@/components/i18n/MessagesProvider";
import { localePath } from "@/i18n/config";
import {
  buildContactMailtoHref,
  validateContactField,
  type ContactMessage,
} from "@/lib/contact";
import { cn } from "@/lib/cn";

type SendState = "idle" | "sending" | "sent" | "mailto";

const fieldClassName =
  "mt-1.5 w-full rounded-[14px] border border-border-default bg-surface-raised px-3.5 py-3 text-sm text-text-primary placeholder:text-text-secondary focus:border-border-strong focus:outline-none";

export function ContactForm() {
  const messages = useMessages();
  const locale = useLocale();
  const copy = messages.contact.form;
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sendState, setSendState] = useState<SendState>("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields: Array<[keyof ContactMessage | "privacy", string | boolean]> = [
      ["name", name],
      ["company", company],
      ["email", email],
      ["phone", phone],
      ["message", message],
      ["privacy", privacy],
    ];
    for (const [field, value] of fields) {
      const messageError = validateContactField(field, value, messages);
      if (messageError) {
        setError(messageError);
        return;
      }
    }

    const entry: ContactMessage = {
      name: name.trim(),
      company: company.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message: message.trim(),
    };

    setError(null);
    setSendState("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, privacy: true, ...entry }),
      });
      const payload = (await response.json()) as { emailed?: boolean; error?: string };

      if (!response.ok) {
        setError(payload.error ?? copy.sendError);
        setSendState("idle");
        return;
      }

      if (payload.emailed) {
        setSendState("sent");
        return;
      }
    } catch {
      // Fall through to mailto.
    }

    window.location.href = buildContactMailtoHref(entry, messages);
    setSendState("mailto");
  }

  const busy = sendState === "sending" || sendState === "sent";

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          id="contact-name"
          label={copy.name.label}
          value={name}
          placeholder={copy.name.placeholder}
          autoComplete="name"
          disabled={busy}
          onChange={setName}
        />
        <Field
          id="contact-company"
          label={copy.company.label}
          value={company}
          placeholder={copy.company.placeholder}
          autoComplete="organization"
          disabled={busy}
          onChange={setCompany}
        />
        <Field
          id="contact-email"
          label={copy.email.label}
          value={email}
          placeholder={copy.email.placeholder}
          type="email"
          autoComplete="email"
          disabled={busy}
          onChange={setEmail}
        />
        <Field
          id="contact-phone"
          label={copy.phone.label}
          value={phone}
          placeholder={copy.phone.placeholder}
          type="tel"
          autoComplete="tel"
          disabled={busy}
          onChange={setPhone}
        />
      </div>
      <label htmlFor="contact-message" className="block text-sm font-semibold text-text-primary">
        {copy.message.label}
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={message}
          placeholder={copy.message.placeholder}
          disabled={busy}
          onChange={(event) => setMessage(event.target.value)}
          className={fieldClassName}
        />
      </label>
      <label className="flex items-start gap-2.5 text-sm leading-6 text-text-secondary">
        <input
          type="checkbox"
          checked={privacy}
          disabled={busy}
          onChange={(event) => setPrivacy(event.target.checked)}
          className="mt-1 size-4 shrink-0 rounded border-border-strong text-action accent-action"
        />
        <span>
          {copy.privacyLead}{" "}
          <a
            href={localePath(locale, "/privacidad")}
            className="font-semibold text-text-brand underline-offset-2 hover:underline"
          >
            {copy.privacyLink}
          </a>
          .
        </span>
      </label>
      {error ? <p className="text-sm text-text-brand">{error}</p> : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={busy}
          className={cn(
            "inline-flex h-12 items-center justify-center rounded-[14px] bg-action px-[22px] text-sm font-semibold text-action-fg transition-colors hover:bg-action-hover disabled:cursor-not-allowed disabled:opacity-60",
          )}
        >
          {submitLabel(sendState, copy)}
        </button>
        <p className="text-sm text-text-secondary">{messages.contact.responseNote}</p>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  placeholder,
  type = "text",
  autoComplete,
  disabled,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label htmlFor={id} className="block text-sm font-semibold text-text-primary">
      {label}
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClassName}
      />
    </label>
  );
}

function submitLabel(
  state: SendState,
  copy: ReturnType<typeof useMessages>["contact"]["form"],
): string {
  switch (state) {
    case "idle":
      return copy.submit;
    case "sending":
      return copy.sending;
    case "sent":
      return copy.sent;
    case "mailto":
      return copy.mailtoAgain;
    default: {
      const exhaustive: never = state;
      return exhaustive;
    }
  }
}
