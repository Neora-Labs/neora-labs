# Neora Labs

Sitio web de Neora Labs: software a medida para startups y pymes de Europa y Estados Unidos.

## Desarrollo local

Este proyecto usa **pnpm** (la versión está fijada en el campo `packageManager` de `package.json`). Si no lo tienes, actívalo con `corepack enable`.

```bash
pnpm install
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Scripts

- `pnpm dev` — servidor de desarrollo
- `pnpm build` — build de producción
- `pnpm start` — servir el build
- `pnpm lint` — ESLint
- `pnpm test` — Vitest

## Stack

Next.js (App Router), TypeScript, Tailwind CSS v4 y Manrope. El sistema visual replica los tokens Light/Dark del Figma de marca.
