import type { ServiceId, ServicePageCopy } from "@/lib/content";

export const servicePagesEs = {
  ai: {
    metaTitle: "IA para empresas",
    metaDescription:
      "Asistentes, búsqueda interna y agentes donde el retorno se puede medir. La IA entra cuando genera un resultado concreto.",
    hero: {
      heading: "Inteligencia donde el retorno es medible.",
      body: "Asistentes, documentos, búsqueda interna y agentes. La IA entra cuando ahorra tiempo, reduce errores o abre una capacidad que hoy no tenéis — no como teatro.",
      primaryCta: "Conoce un presupuesto",
    },
    pains: [
      {
        title: "Las mismas consultas, una y otra vez",
        body: "Soporte, operaciones o el equipo técnico responden lo repetido a mano. Lo importante se mezcla con lo rutinario.",
      },
      {
        title: "El conocimiento se va con las personas",
        body: "Procedimientos, excepciones y criterio viven en cabezas y chats. Cuando alguien se va, la empresa pierde contexto.",
      },
      {
        title: "Buscar información consume la semana",
        body: "Contratos, fichas, políticas y hilos de correo están en cinco sitios. Nadie encuentra la versión vigente a la primera.",
      },
      {
        title: "ChatGPT no conoce vuestros procesos",
        body: "Una herramienta genérica no sabe vuestros plazos, vuestro ERP ni vuestras reglas. Inventa con soltura y no cita fuente.",
      },
    ],
    capabilities: [
      {
        title: "Asistentes sobre vuestro conocimiento",
        body: "Preguntas en lenguaje natural, respuesta con la documentación interna y la fuente a la vista.",
      },
      {
        title: "Chatbots que derivan lo importante",
        body: "Lo repetido se resuelve solo. Lo delicado o incompleto llega a una persona, con contexto.",
      },
      {
        title: "Documentos, transcripción e informes",
        body: "De audio, tickets o carpetas a un texto útil. Sin sustituir el criterio de quien decide.",
      },
      {
        title: "Agentes con una tarea concreta",
        body: "Un flujo acotado: clasificar, extraer, redactar un primer borrador o avisar. Medible desde el día uno.",
      },
    ],
    flow: {
      heading: "Cientos de consultas: la IA responde las sencillas y deriva las importantes.",
      steps: [
        "Definimos qué preguntas merecen automatizarse y dónde está hoy la respuesta.",
        "Indexamos las fuentes reales — documentos, ERP, wiki — con los permisos que ya existen.",
        "El asistente responde lo rutinario y deja rastro de la fuente.",
        "Lo que no encaja se deriva a una persona, con el hilo ya montado.",
        "Miramos el volumen resuelto, el tiempo ahorrado y los fallos. Ajustamos.",
      ],
    },
    faq: [
      {
        q: "¿En qué se diferencia de usar ChatGPT o Copilot?",
        a: "Esas herramientas trabajan con conocimiento genérico. Un asistente a medida responde con vuestra documentación, vuestras reglas y vuestras fuentes. Si no hay base, lo dice; no rellena el hueco con una ocurrencia.",
      },
      {
        q: "¿Hace falta tener los documentos perfectamente ordenados?",
        a: "No. Partimos de lo que hay: PDFs, carpetas, Drive, SharePoint, un ERP. Cuanto más claro esté el origen, más precisa es la respuesta. Ordenar puede ser parte del trabajo, no un requisito previo.",
      },
      {
        q: "¿Dónde viven los datos?",
        a: "En un entorno que acordamos con vosotros. No usamos vuestra información para entrenar modelos generales. Permisos y acceso se diseñan con el mismo criterio que el resto del sistema.",
      },
      {
        q: "¿Cuánto tarda una primera versión útil?",
        a: "Depende del volumen y de las integraciones. Lo habitual es una primera versión usable en pocas semanas, con un objetivo de negocio escrito, no un piloto eterno.",
      },
      {
        q: "¿Puede equivocarse?",
        a: "Sí. Por eso cada respuesta relevante lleva fuente, y lo que no está en la base no se inventa. El diseño asume verificación, no fe ciega en el modelo.",
      },
    ],
    close: {
      heading: "Si hay un caso concreto, lo vemos.",
      body: "Un brief de seis preguntas o una reunión. Sin compromiso; el alcance se confirma en una llamada.",
    },
  },
  automation: {
    metaTitle: "Automatización y digitalización",
    metaDescription:
      "Quitar tareas manuales y conectar lo que hoy vive en personas: CRM, correo, citas, facturas y recordatorios en un flujo que avanza solo.",
    hero: {
      heading: "Menos copiar a mano. Más proceso que avanza solo.",
      body: "Reservas, CRM, correo, presupuestos, recordatorios y facturación. Menos Excel, WhatsApp suelto y copiar entre herramientas.",
      primaryCta: "Conoce un presupuesto",
    },
    pains: [
      {
        title: "El mismo dato se teclea tres veces",
        body: "Web, CRM, hoja y WhatsApp. Cada copia es un retraso y un error que nadie ve hasta que duele.",
      },
      {
        title: "El proceso vive en una persona",
        body: "Si está de vacaciones, las citas, los seguimientos o las facturas se paran. No hay sistema: hay memoria.",
      },
      {
        title: "Las herramientas no se hablan",
        body: "Cada una hace su parte. El puente sois vosotros, a mano, todos los días.",
      },
      {
        title: "Nadie mide cuánto se pierde",
        body: "Horas de copiar, recordar y perseguir. El coste está, pero no aparece en ningún informe.",
      },
    ],
    capabilities: [
      {
        title: "Captación que entra sola al CRM",
        body: "Formulario, web o WhatsApp: el lead llega con contexto, no como un mensaje suelto.",
      },
      {
        title: "Citas, recordatorios y seguimiento",
        body: "La agenda, el aviso y el siguiente paso no dependen de que alguien se acuerde.",
      },
      {
        title: "Presupuestos, facturas y correo operativo",
        body: "De un estado del proceso a un documento o un envío, sin volver a rellenar campos.",
      },
      {
        title: "Reglas claras, no magia",
        body: "Si el caso es predecible, se automatiza. Si pide criterio, llega a una persona.",
      },
    ],
    flow: {
      heading: "Lead en la web → CRM → WhatsApp → cita → recordatorio → seguimiento.",
      steps: [
        "Mapeamos el flujo real: quién hace qué, con qué herramienta, dónde se rompe.",
        "Decidimos qué se queda, qué se conecta y qué se deja de hacer a mano.",
        "Construimos el puente: eventos, campos y excepciones visibles.",
        "Arrancamos con un tramo del proceso, no con toda la empresa a la vez.",
        "Medimos tiempos, errores y volumen. El resto de tramos se añade con evidencia.",
      ],
    },
    faq: [
      {
        q: "¿Hay que tirar las herramientas que ya usamos?",
        a: "Casi nunca. Primero se decide si integrar, complementar o reemplazar. Si el CRM o el calendario funcionan, se quedan. Automatizar no es cambiar de software por deporte.",
      },
      {
        q: "¿Es lo mismo que poner Zapier y ya?",
        a: "A veces basta una conexión ligera. Otras, el flujo pide reglas, datos y excepciones que un pegamento genérico no aguanta. Lo vemos en el alcance, no en una receta previa.",
      },
      {
        q: "¿Qué pasa con las excepciones?",
        a: "Se diseñan. Un proceso sin excepciones es un PowerPoint. Las que importan llegan a una persona, con el contexto necesario para decidir.",
      },
      {
        q: "¿Cuánto tarda verse un resultado?",
        a: "Un tramo acotado — por ejemplo, lead a cita — puede estar en producción en pocas semanas. Encadenar toda la operativa es otra conversación, por fases.",
      },
      {
        q: "¿El equipo tiene que cambiar su forma de trabajar?",
        a: "Lo mínimo. Preferimos desplegar donde ya trabajan (correo, CRM, WhatsApp) antes que inventar una plataforma más que nadie abre.",
      },
    ],
    close: {
      heading: "Si hay un flujo que hoy se copia a mano, lo vemos.",
      body: "Un brief o una reunión. El alcance, los sistemas y el primer tramo se confirman por escrito.",
    },
  },
  software: {
    metaTitle: "Software a medida",
    metaDescription:
      "Aplicaciones web y móviles, plataformas internas y SaaS cuando el problema pide una solución propia — no otra landing ni otra licencia rígida.",
    hero: {
      heading: "Una solución propia cuando el problema lo pide.",
      body: "Aplicaciones web y móviles, portales, sistemas de gestión, APIs y datos. El núcleo técnico: software a medida, no una web de captación.",
      primaryCta: "Conoce un presupuesto",
    },
    pains: [
      {
        title: "Habéis adaptado el negocio a la herramienta",
        body: "La licencia no cubre el proceso. El equipo inventa rodeos en Excel y el estándar de la casa se pierde.",
      },
      {
        title: "Hay una hoja que solo entiende una persona",
        body: "El núcleo operativo cabe en un archivo. Nadie se atreve a tocarlo. Eso no escala y no se audita.",
      },
      {
        title: "Varios sistemas, ningún flujo completo",
        body: "Cada pieza hace algo. El proceso de punta a punta sigue en la cabeza de quien coordina.",
      },
      {
        title: "Un producto propio, no otra web",
        body: "Hace falta una aplicación, un portal o un SaaS. Una landing no resuelve el problema.",
      },
    ],
    capabilities: [
      {
        title: "Aplicaciones web y móviles",
        body: "El flujo principal, de punta a punta, con usuarios reales. No un prototipo que se queda en Figma.",
      },
      {
        title: "Plataformas internas y portales",
        body: "Para el equipo, para clientes o para partners. Permisos, estados y un criterio de hecho.",
      },
      {
        title: "APIs, backend y datos",
        body: "El producto tiene un núcleo estable. Integraciones y pantallas se apoyan en él, no al revés.",
      },
      {
        title: "SaaS y sistemas de gestión",
        body: "Cuando el negocio es el software. Alcance mínimo viable, no un catálogo infinito el día uno.",
      },
    ],
    flow: {
      heading: "El núcleo técnico: software a medida, no una web de captación.",
      steps: [
        "Entendemos el proceso, los usuarios y qué duele de las herramientas actuales.",
        "Acordamos el flujo mínimo que tiene que funcionar de punta a punta.",
        "Diseñamos y construimos a la vista: demos, no un silencioso estamos en ello.",
        "Entra en producción un recorte usable. El resto se prioriza con uso real.",
        "Medimos el resultado que escribimos al inicio. Ajustamos con datos.",
      ],
    },
    faq: [
      {
        q: "¿Cómo saber si hace falta software propio?",
        a: "Tres señales juntas: una hoja crítica que solo entiende alguien, el mismo dato en varios programas, y un proceso forzado por los límites de una licencia. Si reconocéis eso, el desarrollo deja de ser capricho.",
      },
      {
        q: "¿MVP o el producto completo?",
        a: "Casi siempre un recorte que cubre el flujo principal. Una parte del plan original cambia cuando hay usuarios reales. Descubrirlo tarde cuesta un rediseño; descubrirlo pronto, un ajuste de alcance.",
      },
      {
        q: "¿El código y los datos son nuestros?",
        a: "Sí. Documentamos para que otro equipo técnico pueda mantenerlo. Seguir con nosotros en evolución es una decisión, no una atadura.",
      },
      {
        q: "¿Trabajáis por fases?",
        a: "Es el modo por defecto. Cada fase tiene entregable, precio y criterio de aceptación. Podéis parar con algo funcionando, no con un proyecto a medias.",
      },
      {
        q: "¿Cuánto tarda una primera versión en producción?",
        a: "Un flujo principal acotado suele medirse en semanas, no en un año. El plazo concreto sale del alcance escrito, no de una tarifa de catálogo.",
      },
    ],
    close: {
      heading: "Si el problema pide producto, no otra herramienta, lo vemos.",
      body: "Brief o reunión. Alcance, tiempos y una medida de éxito por escrito.",
    },
  },
  web: {
    metaTitle: "Desarrollo web y presencia digital",
    metaDescription:
      "Webs corporativas, landings y ecommerce claros, listos para captar. Una necesidad más directa que un producto a medida.",
    hero: {
      heading: "Presencia digital clara, lista para captar.",
      body: "Webs, landings, catálogos, reservas y mantenimiento. Una pyme casi invisible en internet: web, captación y el canal donde ya os escriben.",
      primaryCta: "Conoce un presupuesto",
    },
    pains: [
      {
        title: "La web no explica qué hacéis",
        body: "Quien llega no sabe si sois para él, qué pediros ni qué pasa después. Se va.",
      },
      {
        title: "Captáis tarde, o no captáis",
        body: "No hay un camino claro a una cita, un WhatsApp o un formulario. El tráfico no se convierte.",
      },
      {
        title: "Está lenta, desactualizada o atada a un constructor",
        body: "Cada cambio es un trámite. El diseño no aguanta el móvil. El SEO técnico básico no está.",
      },
      {
        title: "No hace falta un producto a medida",
        body: "Hace falta una presencia que trabaje: clara, rápida y conectada al canal comercial.",
      },
    ],
    capabilities: [
      {
        title: "Webs corporativas y landings",
        body: "Mensaje, estructura y un destino concreto: brief, agenda o contacto. Sin páginas de relleno.",
      },
      {
        title: "Catálogos, reservas y ecommerce",
        body: "Cuando hay que mostrar, pedir cita o vender. Integrado con lo que ya usáis para cobrar o atender.",
      },
      {
        title: "Rediseño y SEO técnico básico",
        body: "Rendimiento, indexación, analítica y una base que se puede mantener.",
      },
      {
        title: "Mantenimiento",
        body: "La web no se abandona el día de la entrega. Cambios, seguridad y lo que deje de convertir.",
      },
    ],
    flow: {
      heading: "Una pyme casi invisible: web, captación y WhatsApp.",
      steps: [
        "Aclaramos oferta, audiencia y qué acción importa (cita, mensaje, compra).",
        "Estructura, copy y diseño al servicio de esa acción, no de un portfolio.",
        "Construimos rápido, medible y listo para el canal que ya usáis.",
        "Publicamos con analítica y un criterio de conversión a la vista.",
        "Ajustamos títulos, rutas y llamadas según lo que hace la gente, no según el gusto.",
      ],
    },
    faq: [
      {
        q: "¿Web o software a medida?",
        a: "Si el problema es captar, explicar y llevar a una conversación, basta una web bien hecha. Si el problema es un proceso interno o un producto, es otra línea. Lo distinguimos al inicio.",
      },
      {
        q: "¿Hacéis ecommerce?",
        a: "Catálogos, checkout y lo necesario para vender en serio, sin montar un monstruo el día uno. Si el núcleo es el stock, el ERP o reglas raras, entra también integraciones o software.",
      },
      {
        q: "¿Incluye posicionamiento?",
        a: "SEO técnico básico: velocidad, estructura, indexación, analítica. Campañas de ads y contenidos de blog no son el núcleo de este servicio salvo que se acuerden.",
      },
      {
        q: "¿Podemos editar después?",
        a: "Sí, con un criterio claro de qué es contenido y qué es diseño. No os dejamos atados a un constructor que no controláis.",
      },
      {
        q: "¿Idiomas?",
        a: "El sitio ya trabaja en español, inglés y polaco cuando hace falta. El alcance de cada idioma se define en el brief.",
      },
    ],
    close: {
      heading: "Si la web no capta, la cambiamos de trabajo.",
      body: "Un brief o una reunión. Objetivo de captación por escrito, no una home bonita y muda.",
    },
  },
  integrations: {
    metaTitle: "Integraciones y sistemas empresariales",
    metaDescription:
      "Conectar CRM, ERP, pagos y lo que ya usáis. Primero se decide si integrar, complementar o reemplazar — no tirar lo que funciona.",
    hero: {
      heading: "Tus herramientas, conectadas. Sin reemplazar lo que funciona.",
      body: "APIs, CRM, ERP, Stripe, WhatsApp, Google Workspace, Microsoft y sistemas legacy. El software actual sigue; los datos y los flujos dejan de estar aislados.",
      primaryCta: "Conoce un presupuesto",
    },
    pains: [
      {
        title: "Cada sistema es una isla",
        body: "Pedidos, facturas, clientes y stock no se ponen de acuerdo. El puente es una persona con dos pantallas.",
      },
      {
        title: "El dato no es el mismo en ningún sitio",
        body: "El CRM dice una cosa, el ERP otra. Nadie sabe cuál es la vigente hasta que un cliente pregunta.",
      },
      {
        title: "Habéis pagado un recambio que no encaja",
        body: "Sustituir todo es caro y lento. A menudo basta un puente bien hecho.",
      },
      {
        title: "El legacy no se puede tocar, pero hay que usarlo",
        body: "Facturación, almacén o un programa de hace quince años. Hay que hablar con él, no fingir que no existe.",
      },
    ],
    capabilities: [
      {
        title: "APIs y sincronización",
        body: "Eventos, colas y un criterio de qué gana cuando hay conflicto de datos.",
      },
      {
        title: "CRM, ERP y pagos",
        body: "HubSpot, ERPs, Stripe y lo que ya mueve dinero o clientes. Conectar, no duplicar.",
      },
      {
        title: "WhatsApp, correo y Workspace",
        body: "El canal donde está el equipo o el cliente, enganchado al sistema de registro.",
      },
      {
        title: "Legacy con respeto",
        body: "Lectura, escritura acotada o una capa delante. Primero se decide; después se construye.",
      },
    ],
    flow: {
      heading: "El software actual sigue; los datos y los flujos dejan de estar aislados.",
      steps: [
        "Inventariamos sistemas, dueños del dato y el flujo que hoy se hace a mano.",
        "Decidimos integrar, complementar o reemplazar — por escrito, no sobre la marcha.",
        "Diseñamos el contrato: campos, errores, reintentos y quién ve el fallo.",
        "Conectamos un tramo real (por ejemplo, pedido → factura) y lo ponemos a prueba.",
        "Medimos descuadres y tiempo ahorrado. El siguiente puente se justifica con eso.",
      ],
    },
    faq: [
      {
        q: "¿Integrar o reemplazar?",
        a: "Primero se decide. Si lo actual cubre el proceso y duele el puente, se integra. Si la herramienta fuerza el negocio, se valora complementar o sustituir. No tiramos lo que funciona por defecto.",
      },
      {
        q: "¿Con qué sistemas trabajáis?",
        a: "Cualquiera con API o un camino razonable: CRM, ERP, Stripe, WhatsApp, Google, Microsoft, bases de datos. Si no está documentado, se construye el conector. El listado cerrado no existe.",
      },
      {
        q: "¿Qué pasa si un sistema falla a media noche?",
        a: "Reintentos, registro y un aviso a quien opera. Una integración sin observabilidad es otro Excel invisible.",
      },
      {
        q: "¿Cuánto tarda un primer puente útil?",
        a: "Un tramo acotado — un objeto de negocio, dos sistemas — puede estar en semanas. El mapa entero de la empresa es un programa, no un ticket.",
      },
      {
        q: "¿Nos quedamos atados a vosotros?",
        a: "No. Documentamos contratos, errores y operación. Mantenerlo con nosotros es opcional.",
      },
    ],
    close: {
      heading: "Si el puente sois vosotros, lo convertimos en sistema.",
      body: "Brief o reunión. Qué se conecta, qué se queda y cómo se ve un fallo, por escrito.",
    },
  },
} satisfies Record<ServiceId, ServicePageCopy>;
