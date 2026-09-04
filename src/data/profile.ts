import { useLanguage, type Lang } from "@/lib/i18n";

export const profile = {
  name: "Adrián",
  handle: "adro0303",
  links: {
    github: "https://github.com/adro0303",
    linkedin: "https://www.linkedin.com/in/adrianpliegoperez/",
    email: "adroplpe@gmail.com",
  },
  photoUrl: "/photo.png" as string | null,
  resumeUrl: "/resume.pdf" as string | null,
  archiveRepos: [
    "ab20app",
    "HospitalManager",
    "Fibonacci",
    "mainjuego.java",
    "HAF",
    "HardAF",
    "Where2",
    "boda",
  ],
} as const;

export type ProfileText = {
  role: string;
  tagline: string;
  headline: string;
  summary: string;
  bio: string;
  education: string;
  motto: string;
  status: string;
  mindset: string[];
  focus: string[];
};

export const profileText: Record<Lang, ProfileText> = {
  en: {
    role: "Software / AI Developer",
    tagline: "Backend systems · ML pipelines · automation",
    headline:
      "Junior Software / AI Developer who'd rather ship a rough prototype than read one more tutorial.",
    summary:
      "AI & Software Engineer with 1+ year of professional experience building production AI features and backend systems — currently leading a 4-person engineering team. Native Spanish, C1 English, open to backend, AI/ML and Python roles, remote or hybrid.",
    bio: "I build backend systems, ML pipelines, and small tools that solve one problem well — then push them until they actually work, not just until the demo does.",
    education: "BSc Artificial Intelligence — Coventry University (Upper Second Class Honours)",
    motto: "ship it, see what breaks, fix it for real",
    status: "Open to junior backend, AI/ML, and Python engineering roles.",
    mindset: [
      "Prototype first, read the docs when it breaks — not before.",
      "One command that runs the whole pipeline beats ten manual steps in a README.",
      "Walk-forward validation isn't optional when the whole point is \"did this actually generalize.\"",
      "If a project has a Limitations section, I wrote it myself before anyone had to ask.",
      "SOLID and OOP aren't classroom theory — HospitalManager's Paciente/Medico/Cita split is why adding a feature didn't mean rewriting three others.",
      "Agile in practice: small commits, working software over documentation, re-plan when the backlog says the priority changed.",
    ],
    focus: [
      "AI / ML pipelines — forecasting, anomaly detection, applied research",
      "Automation & tooling — replacing repetitive manual work with real safety rails",
      "Developer infrastructure — CI/CD and small open-source tools",
      "Applied experiments — built to answer one question honestly, wins or not",
    ],
  },
  es: {
    role: "Desarrollador de Software / IA",
    tagline: "Sistemas backend · pipelines de ML · automatización",
    headline:
      "Desarrollador junior de Software / IA que prefiere lanzar un prototipo tosco antes que leerse un tutorial más.",
    summary:
      "Ingeniero de Software e IA con más de un año de experiencia profesional construyendo funcionalidades de IA en producción y sistemas backend — actualmente lidero un equipo de 4 personas. Español nativo, inglés C1, abierto a puestos de backend, IA/ML y Python, en remoto o híbrido.",
    bio: "Construyo sistemas backend, pipelines de ML y herramientas pequeñas que resuelven un problema bien — y las pulo hasta que funcionan de verdad, no solo hasta que funciona la demo.",
    education: "Grado en Inteligencia Artificial — Coventry University (Upper Second Class Honours)",
    motto: "lánzalo, mira qué se rompe, arréglalo de verdad",
    status: "Buscando puestos junior de backend, IA/ML e ingeniería en Python.",
    mindset: [
      "Prototipo primero, documentación cuando se rompe — no antes.",
      "Un solo comando que corre todo el pipeline vale más que diez pasos manuales en un README.",
      'La validación walk-forward no es opcional cuando el objetivo es saber si esto realmente generaliza.',
      "Si un proyecto tiene una sección de Limitaciones, la escribí yo antes de que nadie preguntara.",
      "SOLID y POO no son teoría de clase — la separación Paciente/Medico/Cita de HospitalManager es la razón por la que añadir una función no implicó reescribir otras tres.",
      "Agile en la práctica: commits pequeños, software funcionando antes que documentación, replanificar cuando el backlog dice que cambió la prioridad.",
    ],
    focus: [
      "Pipelines de IA / ML — predicción, detección de anomalías, investigación aplicada",
      "Automatización y herramientas — sustituir trabajo manual repetitivo por barreras de seguridad reales",
      "Infraestructura para desarrolladores — CI/CD y pequeñas herramientas open-source",
      "Experimentos aplicados — construidos para responder una pregunta con honestidad, con o sin éxito",
    ],
  },
};

export function useProfileText(): ProfileText {
  const { lang } = useLanguage();
  return profileText[lang];
}
