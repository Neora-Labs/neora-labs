# Neora Labs — backlog de implementación

## Contenido, i18n y SEO

- [ ] **Localizar metadata SEO.** Traducir title, description, Open Graph, Twitter, canonical y hreflang por idioma.
- [ ] **Reorganizar contenido.** Sacar el contenido comercial de `src/lib/content.ts` a ficheros por idioma, con schemas de validación.
- [ ] **Clarificar propuesta de valor.** Reescribir el posicionamiento: estudio internacional de software, ejecución cercana, multilingüe y orientada a negocio.
- [ ] **Crear páginas por servicio.** Páginas SEO para IA, automatización, software a medida, integraciones y desarrollo web.
- [ ] **Crear casos de estudio.** 2–3 casos con problema, solución, stack, resultado, país/mercado y tipo de cliente.
- [ ] **Crear sitemap y robots.** `sitemap.ts` y `robots.ts` con idiomas y futuras páginas de servicio.
- [ ] **Añadir structured data.** JSON-LD de organización, servicio profesional y páginas de servicio.

## Home, equipo y prueba social

- [ ] **Renderizar la sección internacional.** Conectar presencia/equipo en la home o eliminarla si no entra en la propuesta final.
- [ ] **Sustituir perfiles provisionales.** Nombres, roles, biografías y fotos reales, o retirar la sección temporalmente.
- [ ] **Validar testimonios.** Casos reales, logos o citas verificables; si son ejemplos, marcarlos como escenarios ilustrativos.
- [ ] **Optimizar imágenes y assets.** Sustituir rutas inexistentes (`/services/*.jpg`, etc.) o añadir assets reales optimizados.

## Legal, cookies y analítica

- [ ] **Añadir páginas legales.** Privacidad, cookies, aviso legal y condiciones básicas para captación internacional.
- [ ] **Implementar consentimiento de cookies.** Banner y centro de preferencias (analítica/marketing) sin cargar trackers antes del consentimiento.
- [ ] **Añadir analítica de conversión.** Visitas, clicks en CTA, inicio de brief, finalización, envío correcto y errores.
- [ ] **Configurar observabilidad.** Sentry, Logtail u otra herramienta para errores frontend/backend y fallos del endpoint de brief.

## Brief, seguridad y datos

- [ ] **Endurecer endpoint de brief.** Rate limiting, honeypot o CAPTCHA, validación robusta, límite de payload y errores seguros.
- [ ] **Mejorar validación del brief.** Schema compartido (p. ej. Zod) en cliente y servidor.
- [ ] **Evitar exposición de PII en logs.** Política: no registrar emails, problemas de negocio ni datos sensibles del formulario.
- [ ] **Añadir cabeceras de seguridad.** CSP, HSTS, X-Frame-Options / `frame-ancestors`, Referrer-Policy y Permissions-Policy.
- [ ] **Separar lógica de negocio del UI.** Cálculo del brief, envío, validación y eventos en módulos independientes, testeables.
- [ ] **Preparar integración CRM/email.** Decidir email, CRM, Notion, HubSpot, Airtable u otra, y documentar el flujo.
- [ ] **Definir ownership operativo.** Quién recibe leads, tiempos de respuesta, SLA comercial y qué ocurre si falla Resend.

## Accesibilidad, rendimiento y QA visual

- [ ] **Auditar accesibilidad.** Foco, teclado, carruseles, modal del brief, contraste, labels y `prefers-reduced-motion`.
- [ ] **Medir rendimiento real.** Lighthouse / Playwright y control de Core Web Vitals.
- [ ] **Revisar responsive manualmente.** 360, 390, 768, 1024, 1440 px y pantallas anchas (carruseles y brief).
- [ ] **Revisar dark/light visualmente.** Contraste, logos, imágenes, hover/focus y secciones forzadas a tema claro.

## Tests

- [ ] **Añadir tests unitarios.** Matriz de inversión, validaciones del brief, formateo de respuestas y helpers de i18n.
- [ ] **Añadir tests de componentes.** Header, theme toggle, brief agent, botones, cards y estados principales.
- [ ] **Añadir tests end-to-end.** Playwright: landing, idioma, tema, brief completo y navegación móvil.
- [ ] **Añadir tests de accesibilidad automáticos.** axe en home, modal del brief y navegación móvil.

## Tooling y CI

- [ ] **Configurar Storybook.** UI, secciones, responsive, dark/light e idiomas.
- [ ] **Configurar Prettier.** Script `format` y `format:check`.
- [ ] **Ampliar ESLint.** Imports, literales hardcodeados, boundaries cliente/servidor, a11y y limpieza.
- [ ] **Añadir husky y lint-staged.** Formato, lint y test rápido antes de commits.
- [ ] **Configurar Conventional Commits.** commitlint y tipos de commit documentados.
- [ ] **Crear plantilla de PR.** Descripción, screenshots, checklist a11y/SEO/i18n/tests y riesgos.
- [ ] **Crear workflow de CI.** Install, lint, typecheck, build, unitarios y e2e básicos en cada PR.
- [ ] **Configurar preview deployments.** Previews por PR con enlace automático para revisión visual.

## Documentación y marca

- [ ] **Documentar arquitectura.** `ARCHITECTURE.md`: stack, estructura, decisiones y patrones.
- [ ] **Documentar contribución.** `CONTRIBUTING.md`: instalación, scripts, ramas, commits, PRs y criterios de aceptación.
- [ ] **Crear guía para agentes.** Ampliar `AGENTS.md`: edición, comandos, límites, estilo, i18n, testing y seguridad.
- [ ] **Definir tono de marca.** Voz, mensajes permitidos/a evitar, idiomas y promesa comercial.
- [ ] **Añadir checklist de lanzamiento.** Legal, SEO, analytics, a11y, rendimiento, seguridad y formularios.