# Neora Labs

Sitio web de Neora Labs: software a medida para startups y pymes de Europa y Estados Unidos. Español, inglés y polaco.

El inbox de `info@neora-labs.com` es el CRM en v1: ahí llegan el brief y el formulario de contacto.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción
- `npm run start` — servir el build
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript sin emitir
- `npm test` — Vitest (matriz, validación, guards)

## Variables de entorno

Definirlas en `.env.local` (local) y en el host (producción). Ninguna clave secreta debe ir en `NEXT_PUBLIC_*`.

| Variable | Dónde | Para qué |
| --- | --- | --- |
| `RESEND_API_KEY` | servidor | Enviar brief y contacto. Sin ella, la UI abre `mailto:`. |
| `BRIEF_FROM_EMAIL` | servidor | Remitente Resend. Por defecto `Neora Labs <info@neora-labs.com>`. |
| `OPENAI_API_KEY` | servidor | Chat del brief. Sin ella, preguntas guiadas. |
| `OPENAI_MODEL` | servidor | Opcional. Por defecto `gpt-4o-mini`. |
| `NEXT_PUBLIC_CAL_URL` | público | URL de reserva Cal.com (`https://cal.com/...`). |

## Stack

Next.js (App Router), TypeScript, Tailwind CSS v4 y Manrope. El sistema visual replica los tokens Light/Dark del Figma de marca.
