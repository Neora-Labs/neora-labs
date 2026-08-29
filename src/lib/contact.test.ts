import { describe, expect, it } from "vitest";
import { es } from "@/i18n/messages/es";
import { isContactHoneypotTripped, parseContactPayload } from "@/lib/contact";

const valid = {
  name: "Ana Ruiz",
  company: "Acme",
  email: "ana@acme.com",
  phone: "+34 600 000 000",
  message: "Queremos automatizar el follow-up.",
  privacy: true,
};

describe("parseContactPayload", () => {
  it("accepts a valid message and lowercases email", () => {
    const parsed = parseContactPayload(valid, es);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.message.email).toBe("ana@acme.com");
    }
  });

  it("requires privacy and a usable name", () => {
    expect(parseContactPayload({ ...valid, privacy: false }, es)).toEqual({
      ok: false,
      error: es.contact.form.privacyRequired,
    });
    expect(parseContactPayload({ ...valid, name: "A" }, es)).toEqual({
      ok: false,
      error: es.contact.form.invalidName,
    });
  });
});

describe("isContactHoneypotTripped", () => {
  it("trips only when website is filled", () => {
    expect(isContactHoneypotTripped({ ...valid, website: "https://spam.test" })).toBe(true);
    expect(isContactHoneypotTripped({ ...valid, website: "  " })).toBe(false);
    expect(isContactHoneypotTripped(valid)).toBe(false);
  });
});
