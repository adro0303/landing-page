import type { Lang } from "@/lib/i18n";

export type ExperienceEntry = {
  id: string;
  company: string;
  color: string;
  period: string;
  location: { en: string; es: string };
  role: { en: string; es: string };
  bullets: { en: string[]; es: string[] };
  tech: string[];
};

export const experienceEntries: ExperienceEntry[] = [
  {
    id: "authect",
    company: "Authect",
    color: "var(--color-green)",
    period: "May 2025 — Present",
    location: { en: "Remote", es: "Remoto" },
    role: {
      en: "AI & Software Engineer, promoted to Project Team Lead",
      es: "Ingeniero de IA y Software, ascendido a Project Team Lead",
    },
    bullets: {
      en: [
        "Built an AI assistant that answers plain-English questions about a company's live customer data — the core product feature.",
        "Promoted from developer to leading a 4-person team: planning, code review and releases, still hands-on in the code.",
        "Built the backend behind it: multi-tenant SaaS, permissions, search and pagination used by every customer on the platform.",
      ],
      es: [
        "Construí un asistente de IA que responde en lenguaje natural preguntas sobre los datos de clientes de la empresa — la función principal del producto.",
        "Ascendido de desarrollador a liderar un equipo de 4 personas: planificación, revisión de código y despliegues, sin dejar de programar.",
        "Construí el backend detrás: SaaS multi-cliente, permisos, búsqueda y paginación usados por todos los clientes de la plataforma.",
      ],
    },
    tech: ["Python", "TypeScript", "NestJS", "Prisma", "PostgreSQL", "Docker", "GitHub Actions"],
  },
  {
    id: "mais",
    company: "Mais Informática",
    color: "var(--color-cyan)",
    period: "Dec 2022 — Mar 2023",
    location: { en: "Madrid, Spain", es: "Madrid, España" },
    role: {
      en: "Network & Systems Technician Intern",
      es: "Técnico en Prácticas de Redes y Sistemas",
    },
    bullets: {
      en: [
        "PC repair, Windows/Linux installs, network setup and user support; contributed code to an internal tool.",
      ],
      es: [
        "Reparación de equipos, instalación de Windows/Linux, configuración de redes y soporte a usuarios; contribuí código a una herramienta interna.",
      ],
    },
    tech: [],
  },
  {
    id: "generali",
    company: "Generali Seguros",
    color: "var(--color-amber)",
    period: "Jun 2024 — Oct 2024",
    location: { en: "Madrid, Spain", es: "Madrid, España" },
    role: {
      en: "Insurance Sales Representative",
      es: "Representante Comercial de Seguros",
    },
    bullets: {
      en: [
        "Consultative sales: understood client needs and explained complex products in plain language — the same skill I use to talk to non-technical stakeholders about software.",
      ],
      es: [
        "Venta consultiva: entendía las necesidades del cliente y explicaba productos complejos en lenguaje sencillo — la misma habilidad que uso para hablar de software con perfiles no técnicos.",
      ],
    },
    tech: [],
  },
];

export function localizeExperience(entry: ExperienceEntry, lang: Lang) {
  return {
    ...entry,
    location: entry.location[lang],
    role: entry.role[lang],
    bullets: entry.bullets[lang],
  };
}
