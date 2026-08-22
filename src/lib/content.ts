export const site = {
  name: "Neora Labs",
  title: "Neora Labs — Software a medida para Europa y EE. UU.",
  description:
    "Diseñamos y construimos software confiable para startups y pymes de Europa y Estados Unidos. Estrategia, tecnología y comunicación cercana en un mismo equipo.",
  email: "hello@neoralabs.com",
  url: "https://neoralabs.com",
};

export const navItems = [
  { href: "#servicios", label: "Servicios" },
  { href: "#proceso", label: "Proceso" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#contacto", label: "Contacto" },
] as const;

export const hero = {
  badge: "SOFTWARE A MEDIDA",
  headline: ["Convertimos problemas reales", "en productos digitales", "que avanzan."],
  body: "Diseñamos y construimos software confiable para startups y pymes de Europa y Estados Unidos. Estrategia, tecnología y comunicación cercana en un mismo equipo.",
  budgetCta: "Conoce un presupuesto",
  composerPlaceholder: "Describe el problema o lo que quieres construir…",
};

export const heroSlides = [
  {
    id: "ai",
    overlay: "Inteligencia donde el retorno es medible.",
  },
  {
    id: "automation",
    overlay: "Menos copiar a mano. Más proceso que avanza solo.",
  },
  {
    id: "software",
    overlay: "Una solución propia cuando el problema lo pide.",
  },
  {
    id: "web",
    overlay: "Presencia digital clara, lista para captar.",
  },
  {
    id: "integrations",
    overlay: "Tus herramientas, conectadas. Sin reemplazar lo que funciona.",
  },
] as const;

export const services = {
  eyebrow: "LO QUE CONSTRUIMOS",
  heading: "Tecnología alineada con el negocio.",
  intro:
    "Empezamos por el problema. A veces basta una web; otras, un producto propio, automatizar un flujo o aplicar IA donde el retorno se puede medir.",
  items: [
    {
      id: "ai",
      href: "#servicio-ia",
      eyebrow: "INTELIGENCIA",
      bar: "IA para empresas",
      title: "Inteligencia Artificial para empresas",
      summary: "Ahorro, velocidad o nuevas capacidades, donde se puedan medir.",
      body: "Asistentes, chatbots, documentos, informes, transcripción, búsqueda interna y agentes. La IA entra cuando genera un resultado concreto.",
      example: "Cientos de consultas: la IA responde las sencillas y deriva las importantes.",
      image: "/services/ai.jpg",
    },
    {
      id: "automation",
      href: "#servicio-automatizacion",
      eyebrow: "AUTOMATIZACIÓN",
      bar: "Automatización",
      title: "Automatización y digitalización",
      summary: "Quitar tareas manuales y conectar lo que hoy vive en personas.",
      body: "Reservas, CRM, correo, presupuestos, recordatorios, formularios, facturación y calendarios. Menos Excel, WhatsApp suelto y copiar entre herramientas.",
      example: "Lead en la web → CRM → WhatsApp → cita → recordatorio → seguimiento.",
      image: "/services/automation.jpg",
    },
    {
      id: "software",
      href: "#servicio-software",
      eyebrow: "SOFTWARE",
      bar: "Software a medida",
      title: "Desarrollo de software",
      summary: "Cuando el problema pide una solución propia.",
      body: "Aplicaciones web y móviles, plataformas internas, SaaS, portales de clientes, sistemas de gestión, APIs, backend y bases de datos.",
      example: "El núcleo técnico: software a medida, no una web de captación.",
      image: "/services/software.jpg",
    },
    {
      id: "web",
      href: "#servicio-web",
      eyebrow: "PRESENCIA",
      bar: "Web y presencia",
      title: "Desarrollo web y presencia digital",
      summary: "Una necesidad más directa que un producto a medida.",
      body: "Webs corporativas, landings, ecommerce, catálogos, reservas, rediseño, SEO técnico básico, analítica y mantenimiento.",
      example: "Una pyme casi invisible en internet: web, captación y WhatsApp.",
      image: "/services/web.jpg",
    },
    {
      id: "integrations",
      href: "#servicio-integraciones",
      eyebrow: "INTEGRACIONES",
      bar: "Integraciones",
      title: "Integraciones y sistemas empresariales",
      summary: "Conectar lo que ya usas, no sustituirlo por defecto.",
      body: "APIs, CRM, ERP, Stripe, WhatsApp, Google Workspace, Microsoft, bases de datos y sistemas legacy. Primero se decide si integrar, complementar o reemplazar.",
      example: "El software actual sigue; los datos y los flujos dejan de estar aislados.",
      image: "/services/integrations.jpg",
    },
  ] as const,
};

export const testimonials = {
  eyebrow: "CLIENTES",
  items: [
    {
      id: "clara",
      quote:
        "Pasamos de responder las mismas preguntas a mano a un asistente que resuelve lo rutinario y escala lo importante. El equipo entendió el negocio antes de hablar de modelos.",
      name: "Laura Méndez",
      role: "COO",
      company: "Clara Health",
      place: "Madrid",
      service: "INTELIGENCIA",
    },
    {
      id: "norte",
      quote:
        "El lead llegaba por la web y se perdía en WhatsApp. Ahora el flujo llega al CRM, confirma la cita y hace el seguimiento sin que nadie copie y pegue.",
      name: "Thomas Keller",
      role: "Fundador",
      company: "Norte Studio",
      place: "Berlín",
      service: "AUTOMATIZACIÓN",
    },
    {
      id: "harbor",
      quote:
        "Necesitábamos un producto propio, no otra landing. Entregaron una plataforma usable, con visibilidad semanal y decisiones que se podían seguir.",
      name: "Priya Raman",
      role: "Product Lead",
      company: "Harborline",
      place: "Austin",
      service: "SOFTWARE",
    },
    {
      id: "oliva",
      quote:
        "Éramos casi invisibles online. En pocas semanas teníamos web, captación y un canal claro a WhatsApp. Directo, sin teatro.",
      name: "Javier Soto",
      role: "Director",
      company: "Oliva & Co.",
      place: "Valencia",
      service: "PRESENCIA",
    },
    {
      id: "kepler",
      quote:
        "No queríamos tirar el ERP. Conectaron pedidos, facturas y el equipo comercial. El software de siempre sigue; los datos ya no viven aislados.",
      name: "Camila Restrepo",
      role: "Operations",
      company: "Kepler Foods",
      place: "Miami",
      service: "INTEGRACIONES",
    },
    {
      id: "lumen",
      quote:
        "Trabajar con Neora se siente cercano y exigente a la vez. Hay respuesta, hay criterio y no hay cajas negras. Eso, a esta distancia, no es habitual.",
      name: "Sophie Laurent",
      role: "CEO",
      company: "Lumen Retail",
      place: "Lyon",
      service: "SOFTWARE",
    },
  ],
} as const;

export const process = {
  eyebrow: "CÓMO TRABAJAMOS",
  heading: ["De la idea al impacto,", "sin cajas negras."],
  body: "Un proceso sencillo y visible. Cada decisión se comparte, cada entrega se valida y cada avance responde a un objetivo de negocio.",
  steps: [
    {
      number: "01",
      title: "Entender",
      description: "Escuchamos el problema, los usuarios y el contexto.",
      evidence: "Una nota de contexto que puedes leer y corregir.",
    },
    {
      number: "02",
      title: "Definir",
      description: "Acordamos alcance, entregables, tiempos y una medida de éxito.",
      evidence: "Alcance, tiempos y una medida de éxito por escrito.",
    },
    {
      number: "03",
      title: "Construir",
      description: "Diseñamos, desarrollamos e iteramos con visibilidad continua.",
      evidence: "Demos y avances visibles, no un silencioso estamos en ello.",
    },
    {
      number: "04",
      title: "Medir",
      description: "Lanzamos, aprendemos y mejoramos a partir de resultados.",
      evidence: "Un resultado que miramos juntos después del lanzamiento.",
    },
  ],
};

export const values = {
  eyebrow: "POR QUÉ NEORA",
  heading: ["Un equipo cercano.", "Un estándar exigente."],
  intro:
    "Combinamos talento colombiano, presencia europea y una forma de trabajar pensada para relaciones duraderas.",
  items: [
    {
      number: "01",
      title: "Calidad",
      body: "Software sólido, usable y preparado para evolucionar.",
    },
    {
      number: "02",
      title: "Cumplimiento",
      body: "Compromisos claros, entregas previsibles y comunicación constante.",
    },
    {
      number: "03",
      title: "Transparencia",
      body: "Visibilidad real sobre decisiones, avances y riesgos.",
    },
    {
      number: "04",
      title: "Impacto",
      body: "Tecnología elegida por su valor, no por la tendencia del momento.",
    },
  ],
};

export const international = {
  eyebrow: "PENSADOS PARA TRABAJAR SIN FRONTERAS",
  heading: ["Talento colombiano.", "Presencia europea.", "Estándares internacionales."],
  body: "Colaboramos con startups y pymes de Europa y Estados Unidos, combinando proximidad, eficiencia y calidad técnica.",
  nodes: [
    { id: "colombia", label: "COLOMBIA" },
    { id: "europa", label: "EUROPA" },
    { id: "usa", label: "EE. UU." },
  ],
} as const;

export type LocationId = (typeof international.nodes)[number]["id"];

/** Perfiles provisionales: sustituir por el equipo real y fotos en /public/team. */
export const team = [
  {
    id: "valentina",
    name: "Valentina Ríos",
    role: "Dirección",
    locationId: "colombia",
    city: "Medellín",
    bio: "Define el criterio de cada encargo: qué problema merece software y cuál no. Trabaja cerca del cliente y del equipo para que el alcance se sostenga.",
  },
  {
    id: "andres",
    name: "Andrés Molina",
    role: "Ingeniería",
    locationId: "colombia",
    city: "Bogotá",
    bio: "Construye el núcleo técnico: APIs, datos y producto usable. Prefiere sistemas que se pueden operar y evolucionar, no demos que se quedan en el laboratorio.",
  },
  {
    id: "marta",
    name: "Marta Vidal",
    role: "Producto",
    locationId: "europa",
    city: "Barcelona",
    bio: "Traduce el negocio en decisiones de producto. Cuida el ritmo de las entregas y que cada avance se pueda ver, corregir y medir.",
  },
  {
    id: "jonas",
    name: "Jonas Berger",
    role: "Diseño",
    locationId: "europa",
    city: "Berlín",
    bio: "Da forma a interfaces claras y a una comunicación visual que no compite con el producto. El estándar es que se entienda a la primera.",
  },
  {
    id: "elena",
    name: "Elena Brooks",
    role: "Partnerships",
    locationId: "usa",
    city: "Austin",
    bio: "Abre y cuida relaciones con startups y pymes en Estados Unidos. Asegura que la conversación sea cercana, en horario y en idioma de quien decide.",
  },
] as const satisfies ReadonlyArray<{
  id: string;
  name: string;
  role: string;
  locationId: LocationId;
  city: string;
  bio: string;
  photo?: string;
}>;

export type TeamMemberId = (typeof team)[number]["id"];

export const closingCta = {
  eyebrow: "EL SIGUIENTE PASO",
  heading: ["¿Tienes un problema que merece", "una buena solución?"],
  body: "Conversemos sobre el contexto, el objetivo y la forma más sensata de avanzar.",
  cta: { href: "#contacto", label: "Hablemos de tu proyecto" },
};

export const footer = {
  tagline: ["Tecnología cercana para convertir ideas", "en productos digitales con impacto."],
  exploreLabel: "EXPLORA",
  contactLabel: "CONTACTO",
  copyright: "© 2026 Neora Labs. Todos los derechos reservados.",
  locations: "COLOMBIA · EUROPA · EE. UU.",
};
