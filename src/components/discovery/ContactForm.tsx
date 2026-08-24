"use client";

import { useId, useState } from "react";
import type { LeadContact } from "@/types/project";

export function ContactForm({ disabled, onSubmit }: { disabled: boolean; onSubmit: (contact: LeadContact, website: string) => Promise<void> | void }) {
  const id = useId();
  const [contact, setContact] = useState({ name: "", email: "", companyName: "", phone: "" });
  const [website, setWebsite] = useState("");
  return (
    <form className="rounded-2xl border border-border-default bg-surface p-5 sm:p-6" onSubmit={(event) => {
      event.preventDefault();
      void onSubmit({ name: contact.name.trim(), email: contact.email.trim(), ...(contact.companyName.trim() ? { companyName: contact.companyName.trim() } : {}), ...(contact.phone.trim() ? { phone: contact.phone.trim() } : {}) }, website);
    }}>
      <p className="text-xs font-semibold tracking-[0.2px] text-accent">DATOS DE CONTACTO</p>
      <h2 className="mt-2 text-xl font-bold tracking-[-0.4px] text-text-primary">¿Dónde te enviamos la estimación?</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field id={`${id}-name`} label="Nombre *" value={contact.name} autoComplete="name" onChange={(name) => setContact((value) => ({ ...value, name }))} />
        <Field id={`${id}-email`} label="Correo *" value={contact.email} type="email" autoComplete="email" onChange={(email) => setContact((value) => ({ ...value, email }))} />
        <Field id={`${id}-company`} label="Empresa" value={contact.companyName} autoComplete="organization" onChange={(companyName) => setContact((value) => ({ ...value, companyName }))} />
        <Field id={`${id}-phone`} label="Teléfono" value={contact.phone} type="tel" autoComplete="tel" onChange={(phone) => setContact((value) => ({ ...value, phone }))} />
      </div>
      <div className="absolute -left-[10000px]" aria-hidden="true"><label htmlFor={`${id}-website`}>Website</label><input id={`${id}-website`} tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></div>
      <p className="mt-4 text-xs leading-5 text-text-secondary">Usaremos estos datos solo para revisar este proyecto y contactar contigo.</p>
      <button type="submit" disabled={disabled || contact.name.trim().length < 2 || !contact.email.includes("@")} className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-[14px] bg-action px-5 text-sm font-semibold text-action-fg disabled:cursor-not-allowed disabled:opacity-60">Calcular estimación</button>
    </form>
  );
}

function Field({ id, label, value, onChange, type = "text", autoComplete }: { id: string; label: string; value: string; onChange: (value: string) => void; type?: string; autoComplete: string }) {
  return <label htmlFor={id} className="flex flex-col gap-1.5 text-sm font-semibold text-text-primary">{label}<input id={id} type={type} value={value} required={label.endsWith("*")} autoComplete={autoComplete} maxLength={type === "email" ? 254 : 160} onChange={(event) => onChange(event.target.value)} className="h-11 rounded-[14px] border border-border-default bg-surface-raised px-3.5 text-sm font-normal text-text-primary focus:border-border-strong" /></label>;
}
