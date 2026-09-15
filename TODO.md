# Neora Labs — backlog de implementación

Última revisión: 15 de septiembre de 2026. `[x]` = hecho; los puntos marcados como *Parcial* tienen avance, pero siguen abiertos.

## Pendiente detectado (septiembre de 2026)

- [ ] **Brief bloqueado sin OpenAI.** En modo guiado, las preguntas de opción no muestran botones (`showComposer` en `BriefAgent.tsx`): sin `OPENAI_API_KEY`, o si OpenAI falla, nadie puede terminar el brief. Prioridad alta.
- [ ] **Mergear a `main`.** Las vulnerabilidades críticas de Next 16.3.1 siguen en `main` (y en producción, si se despliega desde ahí) hasta el merge. Lanzar antes `pnpm build`: no se ha ejecutado tras subir a Next 16.3.5.
- [ ] **Email inválido sin aviso.** El mensaje de error del formulario de email vive dentro del composer, que está oculto mientras se muestra el informe.
- [ ] **Scroll bloqueado tras "Hablemos".** Al cerrar la agenda se restaura el `overflow: hidden` del brief: `AgendaProvider` y `HeroStage` guardan y restauran el scroll por separado.
- [ ] **Redacción del email del informe.** Etiquetas duplicadas ("Diagnóstico: Diagnóstico sobre…", "Riesgos: Riesgo:…") y mayúsculas a mitad de frase.
- [ ] **Decidir `stage` en la matriz de precios.** `adaptBusinessAnswersToMatrix` lo fija en `"operating"`, así que los multiplicadores de `idea` y `product` nunca se aplican. Cambiarlo mueve los precios.
- [ ] **Cal.com en producción.** Activar "Requires confirmation" en el evento, añadir `NEXT_PUBLIC_CAL_URL` en el hosting y corregir el texto "La reserva llega a nuestro calendario", porque no hay calendario conectado.
- [ ] **Privacidad del brief.** Aviso breve en el chat, `store: false` en la llamada a OpenAI y cookie de idioma solo cuando el usuario elige idioma.
- [ ] **Decidir americanismos del copy en español.** "Agendar", "Agendemos", "costo" y "costos".

## Contenido, i18n y SEO

- [ ] **Localizar metadata SEO.** Traducir title, description, Open Graph, Twitter, canonical y hreflang por idioma. — *Parcial:* title, description, Open Graph, canonical y hreflang ya salen por idioma; falta hreflang en `/privacidad`, y la Twitter card solo está definida en el layout.
- [x] **Reorganizar contenido.** Sacar el contenido comercial de `src/lib/content.ts` a ficheros por idioma, con schemas de validación. — *Hecho:* el copy vive en `src/i18n/messages/{es,en,pl}.ts`; `en` y `pl` se validan contra `es` en compilación con `satisfies` (sin schema en runtime).
- [x] **Clarificar propuesta de valor.** Reescribir el posicionamiento: estudio internacional de software, ejecución cercana, multilingüe y orientada a negocio. — *Hecho:* posicionamiento de asesoría primero, alineado en los tres idiomas.
- [x] **Crear páginas por servicio.** Páginas SEO para IA, automatización, software a medida, integraciones y desarrollo web. — *Hecho:* hub `/servicios` y cinco páginas por idioma, con JSON-LD de servicio y FAQ.
- [ ] **Crear casos de estudio.** 2–3 casos con problema, solución, stack, resultado, país/mercado y tipo de cliente.
- [ ] **Crear sitemap y robots.** `sitemap.ts` y `robots.ts` con idiomas y futuras páginas de servicio.
- [ ] **Añadir structured data.** JSON-LD de organización, servicio profesional y páginas de servicio. — *Parcial:* las páginas de servicio ya tienen `Service` y `FAQPage`; falta el de organización en la home.

## Home, equipo y prueba social

- [x] **Renderizar la sección internacional.** Conectar presencia/equipo en la home o eliminarla si no entra en la propuesta final. — *Hecho:* se muestra en la home, en la sección `#nosotros`.
- [ ] **Sustituir perfiles provisionales.** Nombres, roles, biografías y fotos reales, o retirar la sección temporalmente. — Hay 5 perfiles y solo 1 tiene foto.
- [x] **Validar testimonios.** Casos reales, logos o citas verificables; si son ejemplos, marcarlos como escenarios ilustrativos. — *Resuelto:* no son testimonios de clientes, sino principios propios en primera persona (epígrafe "Criterio"), así que no hay citas que validar.
- [x] **Optimizar imágenes y assets.** Sustituir rutas inexistentes (`/services/*.jpg`, etc.) o añadir assets reales optimizados. — *Hecho:* las imágenes de servicios son `.webp` existentes y se sirven con `next/image`.

## Legal, cookies y analítica

- [ ] **Añadir páginas legales.** Privacidad, cookies, aviso legal y condiciones básicas para captación internacional. — *Parcial:* existe `/privacidad`, pero solo cubre el formulario de contacto. Falta el chat y OpenAI, Resend, Cal.com, base legal, transferencias a EE. UU., conservación y cookies. Faltan también el aviso legal y las condiciones.
- [ ] **Implementar consentimiento de cookies.** Banner y centro de preferencias (analítica/marketing) sin cargar trackers antes del consentimiento. — Hoy no hace falta banner: solo hay cookies técnicas (idioma y tema). Decidir antes la analítica.
- [ ] **Añadir analítica de conversión.** Visitas, clicks en CTA, inicio de brief, finalización, envío correcto y errores.
- [ ] **Configurar observabilidad.** Sentry, Logtail u otra herramienta para errores frontend/backend y fallos del endpoint de brief.

## Brief, seguridad y datos

- [ ] **Endurecer endpoint de brief.** Rate limiting, honeypot o CAPTCHA, validación robusta, límite de payload y errores seguros. — *Parcial:* el servidor ya valida el payload y limita los mensajes a 2000 caracteres y el chat a 20 turnos; faltan rate limiting y honeypot o CAPTCHA.
- [ ] **Mejorar validación del brief.** Schema compartido (p. ej. Zod) en cliente y servidor. — *Parcial:* Zod valida la respuesta del modelo; las respuestas del brief se validan con funciones propias (`parseBriefAnswers`).
- [x] **Evitar exposición de PII en logs.** Política: no registrar emails, problemas de negocio ni datos sensibles del formulario. — *Cumplido:* ni las rutas de API ni `src/lib` registran nada. Mantenerlo al añadir observabilidad.
- [ ] **Añadir cabeceras de seguridad.** CSP, HSTS, X-Frame-Options / `frame-ancestors`, Referrer-Policy y Permissions-Policy. — Ojo con la CSP: tiene que permitir el iframe de Cal.com.
- [ ] **Separar lógica de negocio del UI.** Cálculo del brief, envío, validación y eventos en módulos independientes, testeables. — *Parcial:* cálculo, validación e informe ya están en `src/lib` con tests; el envío y los eventos siguen dentro de `BriefAgent.tsx`.
- [ ] **Preparar integración CRM/email.** Decidir email, CRM, Notion, HubSpot, Airtable u otra, y documentar el flujo. — *Parcial:* el email con Resend ya está integrado y se activa con `RESEND_API_KEY`; falta decidir el CRM.
- [ ] **Definir ownership operativo.** Quién recibe leads, tiempos de respuesta, SLA comercial y qué ocurre si falla Resend.

## Accesibilidad, rendimiento y QA visual

- [ ] **Auditar accesibilidad.** Foco, teclado, carruseles, modal del brief, contraste, labels y `prefers-reduced-motion`. — *Parcial:* revisados el contraste AA del rail de pasos y el indicador de foco del composer.
- [ ] **Medir rendimiento real.** Lighthouse / Playwright y control de Core Web Vitals.
- [ ] **Revisar responsive manualmente.** 360, 390, 768, 1024, 1440 px y pantallas anchas (carruseles y brief). — *Parcial:* brief y agenda revisados en 375, 768, 1024, 1280 y 1440 px; falta el resto de secciones y los carruseles.
- [ ] **Revisar dark/light visualmente.** Contraste, logos, imágenes, hover/focus y secciones forzadas a tema claro. — *Parcial:* revisados el brief y `#nosotros`.

## Tests

- [ ] **Añadir tests unitarios.** Matriz de inversión, validaciones del brief, formateo de respuestas y helpers de i18n. — *Parcial:* 13 tests con Vitest (matriz, rutas de recomendación, formato de la banda y copy por idioma); faltan los helpers de i18n y la validación del contacto.
- [ ] **Añadir tests de componentes.** Header, theme toggle, brief agent, botones, cards y estados principales.
- [ ] **Añadir tests end-to-end.** Playwright: landing, idioma, tema, brief completo y navegación móvil.
- [ ] **Añadir tests de accesibilidad automáticos.** axe en home, modal del brief y navegación móvil.

## Tooling y CI

- [ ] **Configurar Storybook.** UI, secciones, responsive, dark/light e idiomas.
- [ ] **Configurar Prettier.** Script `format` y `format:check`.
- [ ] **Ampliar ESLint.** Imports, literales hardcodeados, boundaries cliente/servidor, a11y y limpieza.
- [ ] **Añadir husky y lint-staged.** Formato, lint y test rápido antes de commits.
- [ ] **Configurar Conventional Commits.** commitlint y tipos de commit documentados. — *Parcial:* los commits ya siguen el formato; faltan commitlint y documentarlo.
- [ ] **Crear plantilla de PR.** Descripción, screenshots, checklist a11y/SEO/i18n/tests y riesgos.
- [ ] **Crear workflow de CI.** Install, lint, typecheck, build, unitarios y e2e básicos en cada PR. — Incluir `pnpm audit`.
- [ ] **Configurar preview deployments.** Previews por PR con enlace automático para revisión visual.

## Documentación y marca

- [ ] **Documentar arquitectura.** `ARCHITECTURE.md`: stack, estructura, decisiones y patrones. — *Parcial:* `AGENTS.md` ya documenta la arquitectura y el mapa de carpetas.
- [ ] **Documentar contribución.** `CONTRIBUTING.md`: instalación, scripts, ramas, commits, PRs y criterios de aceptación.
- [x] **Crear guía para agentes.** Ampliar `AGENTS.md`: edición, comandos, límites, estilo, i18n, testing y seguridad. — *Hecho:* actualizado con pnpm, tests, typecheck, convenciones de i18n y copy, lógica del brief y seguridad.
- [ ] **Definir tono de marca.** Voz, mensajes permitidos/a evitar, idiomas y promesa comercial. — *Parcial:* decidido el castellano peninsular (tú).
- [ ] **Añadir checklist de lanzamiento.** Legal, SEO, analytics, a11y, rendimiento, seguridad y formularios.

## Hecho fuera de esta lista

- Migración de npm a pnpm con las mismas versiones (`60eab67`).
- Vulnerabilidades parcheadas (Next 16.3.5, sharp, js-yaml y Vitest 4) y todas las dependencias fijadas en versión exacta (`cd5d2e4`, `67af8eb`).
- Brief: rail de pasos vertical, composer sin outline y botón de volver visible (`9370d76`).
- Copy del brief alineado en español e inglés, castellano peninsular y claves sin uso eliminadas (`775f0bf`, `63ccc27`, `c80d784`).
- Bugs corregidos: caracteres rotos en la banda de inversión y aviso de hidratación por extensiones (`769df31`, `3225678`).
- Agenda de Cal.com funcionando en local con `NEXT_PUBLIC_CAL_URL`.
