export type HeroSlideId = "ai" | "automation" | "software" | "web" | "integrations";
export type ServiceId = HeroSlideId;
export type LocationId = "colombia" | "poland" | "spain";
export type TeamMemberId = "julian" | "juanDavid" | "miguel" | "ivan" | "jefferson";
export type ProcessStepId = "understand" | "define" | "build" | "measure";

export const serviceIds = [
  "ai",
  "automation",
  "software",
  "web",
  "integrations",
] as const satisfies readonly ServiceId[];

export const serviceSlugs = {
  ai: "ia",
  automation: "automatizacion",
  software: "software",
  web: "web",
  integrations: "integraciones",
} as const satisfies Record<ServiceId, string>;

export type ServiceSlug = (typeof serviceSlugs)[ServiceId];

export function isServiceSlug(value: string | undefined | null): value is ServiceSlug {
  return (
    value === "ia" ||
    value === "automatizacion" ||
    value === "software" ||
    value === "web" ||
    value === "integraciones"
  );
}

export function serviceIdFromSlug(slug: string): ServiceId | null {
  for (const id of serviceIds) {
    if (serviceSlugs[id] === slug) {
      return id;
    }
  }
  return null;
}

export function servicePath(id: ServiceId): string {
  return `/servicios/${serviceSlugs[id]}`;
}

export function serviceHash(id: ServiceId): string {
  return `#servicio-${serviceSlugs[id]}`;
}

export type ServicePageCopy = {
  metaTitle: string;
  metaDescription: string;
  hero: {
    heading: string;
    body: string;
    primaryCta: string;
  };
  pains: Array<{ title: string; body: string }>;
  capabilities: Array<{ title: string; body: string }>;
  flow: {
    heading: string;
    steps: string[];
  };
  faq: Array<{ q: string; a: string }>;
  close: {
    heading: string;
    body: string;
  };
};

export type ServiceItem = {
  id: ServiceId;
  href: string;
  eyebrow: string;
  bar: string;
  title: string;
  summary: string;
  body: string;
  example: string;
  image: string;
};

export type TeamMember = {
  id: TeamMemberId;
  name: string;
  role: string;
  locationId: LocationId;
  city?: string;
  bio: string;
  photo?: string;
};

export const teamPhotos: Partial<Record<TeamMemberId, string>> = {
  ivan: "/team/ivan-romero.jpeg",
};
