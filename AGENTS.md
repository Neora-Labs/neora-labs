# Neora Labs

Marketing site for Neora Labs: custom software for startups and SMEs in Europe and the United States. Copy in Spanish, English, and Polish. Human onboarding lives in `README.md`.

Stack: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Manrope.

Do not add a CMS, extra product surfaces, or analytics unless the user asks. Locales are `es` / `en` / `pl` under `src/app/[locale]/`.

## Architecture

```mermaid
flowchart TB
  layout["src/app/[locale]/layout.tsx — Header Footer theme metadata"]
  page["src/app/[locale]/page.tsx — homepage sections"]
  i18n["src/i18n/messages — marketing and legal copy"]
  tokens["src/app/globals.css — design tokens"]
  hero["HeroStage — carousel plus brief entry"]
  briefUi["BriefAgent — chat plus FSM fallback"]
  briefLib["src/lib/brief.ts plus brief-matrix.ts"]
  chatApi["POST /api/brief/chat"]
  api["POST /api/brief"]
  resend["Resend optional"]
  mailto["mailto fallback"]

  i18n --> page
  i18n --> hero
  tokens --> layout
  layout --> page
  page --> hero
  hero --> briefUi
  briefUi --> chatApi
  chatApi --> briefLib
  briefUi --> briefLib
  briefUi --> api
  api --> briefLib
  api --> resend
  briefUi --> mailto
```

- Shell (Header, Footer, theme boot script, metadata) lives in `src/app/[locale]/layout.tsx`.
- Homepage composition in `src/app/[locale]/page.tsx`: Hero → Positioning → Services → Process → Values.
- Visitor-facing copy lives in `src/i18n/messages/{es,en,pl}.ts` (service long-form in `service-pages-*.ts`). `src/lib/content.ts` holds IDs, slugs, and photo paths — not marketing strings.
- Design tokens live in `src/app/globals.css` (`:root`, `html.dark`, `@theme inline`). Components use semantic Tailwind classes, not hex.
- Capture flow: `HeroStage` opens `BriefMorphShell` → `BriefAgent`. Free-text turns go to `POST /api/brief/chat` (OpenAI classifies slots). The FSM in `getNextAgentTurn` is the fallback if the key is missing or the model fails. The report builder lives in `src/lib/brief.ts`. Cost and weeks are derived in `src/lib/brief-matrix.ts` (effort × weekly rate × need margin × stage uncertainty). Submit goes to `POST /api/brief`.
- Public POSTs (`/api/brief`, `/api/brief/chat`, `/api/contact`) go through `guardPublicPost`: in-memory IP rate limit, body cap, generic 413/429/500. Contact has a honeypot (`website`). Do not log PII.

## Directory map

| Path | Role |
| --- | --- |
| `src/app/` | App Router: `[locale]` layout/page, servicios, contacto, privacidad, aviso-legal, cookies, `sitemap.ts`, `robots.ts`, `api/brief`, `api/brief/chat`, `api/contact` |
| `src/i18n/` | Locales, negotiation, message catalogs |
| `src/lib/content.ts` | Domain IDs (services, team), slugs, photo map |
| `src/lib/brief.ts` | Brief steps, validation, report, mailto |
| `src/lib/brief-agent.ts` | Chat turn schema, slot merge, OpenAI prompt |
| `src/lib/contact.ts` | Contact form parse, honeypot, body, mailto |
| `src/lib/request-guard.ts` | Body cap and rate-limit wiring for public POSTs |
| `src/lib/rate-limit.ts` | In-memory IP window |
| `src/lib/resend.ts` | Shared Resend send helper |
| `src/lib/cal.ts` | Cal.com embed URL guard |
| `src/lib/brief-matrix.ts` | Effort weeks, rates, margins → € + plazo |
| `src/lib/theme.ts` | Light/dark persistence and boot script |
| `src/lib/cn.ts` | Class-name helper |
| `src/components/sections/` | Homepage sections |
| `src/components/hero/` | Carousel and stage that opens the brief |
| `src/components/brief/` | Brief overlay and questionnaire UI |
| `src/components/legal/` | Shared legal article |
| `src/components/international/` | Map and team roster (used by Values) |
| `src/components/layout/` | Header, Footer, ThemeToggle |
| `src/components/brand/` | Logo |
| `src/components/ui/` | Badge, Button, Card, Reveal |
| `src/components/services/` | Service card visuals |
| `public/` | Brand, service, and team assets |

Keep new files in the matching folder. Do not introduce `src/pages/` or a second router.

## Commands

| Command | When |
| --- | --- |
| `npm run dev` | Iterate. Use this in agent sessions. |
| `npm run lint` | ESLint. Run before finishing. |
| `npm run typecheck` | `tsc --noEmit`. CI runs this; do not run `npm run build` in agent sessions. |
| `npm test` | Vitest: brief-matrix, validation, request guards. |
| `npm run build` | Production only. **Do not run in an agent session** — it switches `.next` to production assets and breaks HMR. |

Restart `npm run dev` after adding or updating dependencies so Next.js picks up the lockfile.

## Conventions

**Copy.** Change visitor-facing strings in `src/i18n/messages/`. Change brief prompts, choice labels, and validation messages there too (`brief` key). Do not hardcode marketing copy in components. Do not put marketing copy in `src/lib/content.ts`.

**Tokens.** Use semantic classes from `@theme inline` in `src/app/globals.css`: `bg-bg-default`, `bg-bg-subtle`, `bg-bg-brand-soft`, `text-text-primary`, `text-text-secondary`, `text-text-brand`, `bg-action`, `text-action-fg`, `hover:bg-action-hover`, `bg-surface`, `bg-surface-raised`, `border-border-default`, `border-border-strong`, `text-accent`. Do not scatter hex. `#nosotros` is intentionally forced to the light palette even when the document is dark.

**RSC.** Server Components by default. Add `"use client"` only for interactivity (header, theme, hero/brief, carousels, reveal, map/team).

**TypeScript.** Strict. On `switch` over unions or enums, handle every variant and use a `never` check in `default` so new variants fail at compile time.

**Imports.** Keep imports at the top of the module. No inline imports unless a circular dependency is documented.

**UI primitives.** Reuse `Button`, `Badge`, `Card`, and `Reveal`. Do not add a component library.

**Next.js 16.** Do not add `middleware.ts`. If request interception is needed later, use `src/proxy.ts`. Read bundled docs under `node_modules/next/dist/docs/` before using APIs.

**Git.** Do not commit unless asked. Do not commit `.env*`.

## Brief and API

Same six fields: need, stage, scale, problem, integrations, email. In chat mode the order is not fixed — the model asks for what is missing. `getNextAgentTurn` still uses that sequence as fallback. Price and weeks never come from the model; they always come from `lookupInvestmentBand` (includes `stage`).

- Client: `src/components/brief/BriefAgent.tsx` talks to `POST /api/brief/chat`, then POSTs completed answers to `/api/brief`.
- Chat server: `src/app/api/brief/chat/route.ts` classifies slots with OpenAI, re-validates IDs, and only then builds the report from the matrix.
- Submit server: `src/app/api/brief/route.ts` parses with `parseBriefAnswers`, builds the report, emails Neora, and if that succeeds sends a copy to the visitor.
- If `RESEND_API_KEY` is set and Resend succeeds, the API returns `{ emailed: true }` and the UI shows sent.
- Otherwise the API returns `{ emailed: false }` (or the fetch fails) and the client falls back to `mailto:` via `buildMailtoHref`.
- After the report, “Hablemos” opens the Cal.com overlay (`useAgenda`).

Optional env:

- `OPENAI_API_KEY` — brief chat agent (server only). Without it, the UI falls back to chips.
- `OPENAI_MODEL` — optional, defaults to `gpt-4o-mini`
- `RESEND_API_KEY` — send the brief and contact form to `site.email`
- `BRIEF_FROM_EMAIL` — Resend `from` (defaults to `Neora Labs <info@neora-labs.com>`)
- `NEXT_PUBLIC_CAL_URL` — public Cal.com booking URL (e.g. `https://cal.com/neoralabs/intro`)

Do not retune bands in `src/lib/brief-matrix.ts` without being asked — they are commercial data.

## Contact and calendar

- Client: `ContactForm` POSTs to `/api/contact`. Server parses with `parseContactPayload` then Resend. A filled honeypot field returns `{ emailed: true }` without sending.
- If Resend is missing or fails, `{ emailed: false }` and the client falls back to `mailto:`.
- Header CTA and `#agenda` embed Cal.com when `NEXT_PUBLIC_CAL_URL` is a `https://cal.com/...` URL. Connect Google Calendar in Cal.com, not in Next.js.
- Legal copy: `/[locale]/privacidad`, `/[locale]/aviso-legal`, `/[locale]/cookies`.

Do not put secrets in client code.

## Security

- `.env*` is gitignored. Never commit API keys or credentials.
- Validate brief payloads on the server (`parseBriefAnswers`) and contact payloads (`parseContactPayload`). Do not trust the client body.
- `RESEND_API_KEY` and `OPENAI_API_KEY` stay in Route Handlers. They must not appear in client bundles or `NEXT_PUBLIC_*`.
- Do not log email, business problem text, or raw payloads. If diagnostics are needed: status, locale, error code.
- Rate limits are in-memory per isolate (best-effort on Vercel). Contact honeypot before CAPTCHA.

## UI verification

When a change affects layout, styling, routing, client state, or rendered data, verify in the browser (or the closest substitute if browser tools are unavailable). Confirm behavior, not only a screenshot.

- Exercise the changed flow end to end (including opening the brief from the hero and completing or closing it).
- Check light and dark. Remember `#nosotros` stays light.
- Hunt for regressions in Header, Footer, and other sections that share the copy or components you touched.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
