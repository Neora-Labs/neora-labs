# Neora Labs — backlog

Criterio: lo de **despliegue** es lo que un visitante o un lead no debería tropezar. Lo **posterior** mejora conversión, operación y mantenimiento, pero no bloquea publicar.

## Ya resuelto (no reabrir)

- i18n `es` / `en` / `pl` con copy en `src/i18n/messages/`, no en `content.ts`.
- Metadata SEO localizada en home y páginas de servicio (title, description, OG, Twitter, canonical, hreflang).
- Páginas de servicio: IA, automatización, software, web, integraciones.
- Sección internacional y equipo en `#nosotros`.
- Assets de servicio en `public/services/*.webp`.
- Privacidad, aviso legal y cookies en `/[locale]/…`, con hreflang.
- Brief, contacto, Resend + `mailto`, Cal.com.
- Rate limit, tope de body, honeypot en contacto, cabeceras de seguridad.
- Sitemap, robots, JSON-LD de organización, marquee como criterio (no testimonios).

---

## Para el despliegue (prioridad)

Orden sugerido. Marcar al cerrar.

### 1. Formularios y seguridad

Sin esto, el sitio puede recibir spam, fallar en silencio o filtrar datos.

- [x] **Endurecer `/api/brief` y `/api/contact`.** Rate limit por IP, tope de body (p. ej. 8–16 KB), errores genéricos al cliente. Honeypot simple en contacto; CAPTCHA solo si el spam aparece.
- [x] **No loguear PII.** Ni email, ni problema de negocio, ni payload crudo. Si hace falta diagnóstico: status, locale, código de error.
- [x] **Cabeceras de seguridad.** CSP (Cal.com + Resend/imágenes propias), HSTS, `frame-ancestors`, Referrer-Policy, Permissions-Policy. Encajan en `next.config.ts` o el host.
- [ ] **Ownership de leads.** Quién lee `info@neora-labs.com`, SLA real (el copy dice &lt; 24 h), y qué hacer si Resend falla (hoy: `mailto` en el cliente). Verificar dominio y `BRIEF_FROM_EMAIL` en producción.
- [ ] **Variables de entorno en el host.** `RESEND_API_KEY`, `BRIEF_FROM_EMAIL`, `OPENAI_API_KEY` (opcional), `NEXT_PUBLIC_CAL_URL`. Sin secrets en el cliente.

### 2. Legal mínimo para captar en UE / EE. UU.

- [x] **Aviso legal** (`/[locale]/aviso-legal`): titular, contacto, jurisdicción.
- [x] **Cookies** (`/[locale]/cookies`): locale y tema son necesarias; no hay trackers hoy. Enlazar desde el footer junto a privacidad.
- [x] **Condiciones básicas** de uso del sitio y del brief (alcance orientativo, no presupuesto vinculante).
- [x] **Completar hreflang** en privacidad y contacto (home y servicios ya lo tienen).

**Propuesta:** no poner banner de consentimiento hasta que haya analítica. Banner vacío solo añade fricción.

### 3. Honestidad comercial y pulido visual

- [x] **Reetiquetar el marquee.** No son testimonios de clientes. Copy tipo “cómo trabajamos” / “criterio”, no prueba social inventada.
- [x] **Fotos de equipo.** Iniciales o silueta para quien no tenga foto. No retirar la sección: los nombres y roles ya son reales. Jefferson: apellido o solo nombre de pila de forma consciente.
- [x] **JSON-LD de organización en home.** `Organization` / `ProfessionalService`. Las fichas de servicio ya llevan Service + FAQ.
- [x] **Sitemap y robots.** `src/app/sitemap.ts` y `robots.ts` con `es` / `en` / `pl`, home, servicios, contacto, privacidad y las legales nuevas.
- [ ] **Pase visual de lanzamiento.** 390 / 768 / 1440: hero, carrusel, brief, equipo, dark y light. `#nosotros` se queda en claro. Contraste, logos, hover/focus, `prefers-reduced-motion` en brief y carruseles.

### 4. Copy y docs justos para publicar

- [x] **Pasada corta de posicionamiento.** Hero + description: estudio internacional, ejecución cercana, tres idiomas, decisión de negocio primero. No reescribir el sitio.
- [x] **Actualizar `AGENTS.md`.** Quitar “no añadir i18n” (ya está). Anotar i18n, seguridad del brief y “no retocar `brief-matrix.ts` sin pedirlo”.
- [ ] **Checklist de go-live** (abajo). No hace falta un `LAUNCH.md` aparte.

### Checklist go-live

- [ ] Dominio, HTTPS, redirect `www` ↔ apex.
- [ ] Resend envía a Neora y copia al visitante en un brief de prueba.
- [ ] Cal.com abre y se puede reservar.
- [ ] Brief y contacto: éxito, `mailto` si no hay Resend, y error de red.
- [ ] `/es`, `/en`, `/pl` y cambio de idioma.
- [ ] Privacidad + legales en el footer.
- [ ] `sitemap.xml` y `robots.txt` accesibles.

---

## Más adelante

No bloquean el primer deploy. Hacerlos cuando haya tráfico o el siguiente sprint de producto.

### Conversión y prueba social

- [ ] **Casos de estudio reales** (2–3). Problema, solución, stack, resultado, mercado, tipo de cliente. No inventar. Hasta entonces, no hay sección de casos.
- [ ] **Propuesta de valor más nítida** si el primer copy de lanzamiento no convierte: bloque propio, no solo hero.
- [ ] **Analítica de conversión** (Plausible o similar, UE-friendly): visita, CTA, inicio/fin de brief, envío, error. **Requiere banner de cookies.**
- [ ] **Observabilidad.** Sentry (o equivalente) en front y en `/api/brief` / `/api/contact`, sin PII.
- [ ] **CRM.** Seguir con inbox + Resend hasta que duela. Entonces Notion, HubSpot o Airtable; documentar el flujo. No conectar tres herramientas a la vez.

### Robustez del brief

- [ ] Schema Zod compartido cliente/servidor (hoy: `parseBriefAnswers` + Zod solo en el chat).
- [ ] CAPTCHA si el honeypot no basta.
- [x] Tests unitarios de `brief-matrix`, validación y formateo. Eso protege precios y plazos.

### Calidad continua

- [ ] Auditoría a11y (foco, teclado, modal, contraste).
- [ ] Lighthouse / CWV en producción, no solo local.
- [ ] Playwright: home, idioma, tema, brief feliz, móvil.
- [ ] axe en home y brief.
- [ ] Previews por PR (Vercel/host) para revisión visual.

### Tooling (cuando el repo deje de ser de una persona)

- [ ] `format` / `format:check` (Prettier).
- [ ] ESLint: imports, copy hardcodeado, boundaries, a11y.
- [x] CI: install, lint, typecheck, unitarios. e2e cuando existan.
- [ ] Plantilla de PR.
- [x] Husky (lint-staged + tests en pre-push). commitlint, Storybook, tests de componentes: solo si hay más de un contributor habitual.

### Documentación de crecimiento

- [ ] Schemas de validación del catálogo i18n (los tipos de `es.ts` bastan hoy).
- [ ] `ARCHITECTURE.md` si el mapa de `AGENTS.md` se queda corto.
- [ ] `CONTRIBUTING.md` y tono de marca cuando entre otra persona a tocar copy.

---

## Propuestas

1. **Lanzar sin analítica ni banner.** Locale y tema son cookies necesarias. El banner espera a Plausible (o similar).
2. **No fabricar casos ni citas de clientes.** El marquee es criterio interno. Los casos llegan cuando haya un cliente que acepte aparecer.
3. **Equipo visible, fotos honestas.** Iniciales &gt; foto genérica &gt; esconder la sección.
4. **Inbox como CRM en v1.** El coste de HubSpot ahora es proceso, no producto.
5. **No bloquear el deploy por tests, Storybook ni Conventional Commits.** El riesgo real está en spam del brief, legales y que el correo no salga.
6. **No retocar `src/lib/brief-matrix.ts`** en este ciclo: es dato comercial, no pulido.
7. **Honeypot antes que CAPTCHA.** Menos fricción; CAPTCHA si aparecen bots.
8. **Un pase de copy, no una reescritura.** Hero, footer, brief y legales. El resto del i18n ya está.

Cuando un ítem de “más adelante” se vuelva bloqueante (spam, lead perdido, cliente que pide caso), subirlo a la sección de despliegue — no al revés.
