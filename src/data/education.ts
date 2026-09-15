export type EducationEntry = {
  id: string;
  institution: string;
  color: string;
  period: string;
  degree: { en: string; es: string };
  detail: { en: string; es: string };
  credential: { label: { en: string; es: string }; url: string };
  image?: string;
};

export const educationEntries: EducationEntry[] = [
  {
    id: "coventry",
    institution: "Coventry University",
    color: "var(--color-blue)",
    period: "2023 — 2026",
    degree: {
      en: "BSc (Hons) Artificial Intelligence — Upper Second Class",
      es: "Grado (Hons) en Inteligencia Artificial — Upper Second Class",
    },
    detail: {
      en: "UK degree, top-up year via the MSMK dual-award pathway.",
      es: "Título del Reino Unido, año de ampliación vía el convenio de doble titulación con MSMK.",
    },
    credential: {
      label: { en: "view full size →", es: "ver a tamaño completo →" },
      url: "/TITLE.jpeg",
    },
    image: "/TITLE.jpeg",
  },
  {
    id: "msmk",
    institution: "MSMK University",
    color: "var(--color-cyan)",
    period: "2023 — 2025",
    degree: {
      en: "Pearson HND in Computing (General) — Merit",
      es: "HND Pearson en Computación (General) — Merit",
    },
    detail: {
      en: "Distinctions in Programming, and in Data Structures & Algorithms.",
      es: "Distinción en Programación, y en Estructuras de Datos y Algoritmos.",
    },
    credential: {
      label: { en: "view transcript →", es: "ver notas →" },
      url: "/MSMK_NOTAS.pdf",
    },
  },
];

export type CertificationEntry = {
  id: string;
  name: string;
  color: string;
  date: string;
  detail: { en: string; es: string };
  credential: { label: { en: string; es: string }; url: string };
};

export const certificationEntries: CertificationEntry[] = [
  {
    id: "ielts",
    name: "IELTS Academic",
    color: "var(--color-amber)",
    date: "Mar 2025",
    detail: {
      en: "Overall band 7.5 (CEFR C1).",
      es: "Puntuación global 7.5 (MCER C1).",
    },
    credential: {
      label: { en: "view certificate →", es: "ver certificado →" },
      url: "/IELTS_TITULO.pdf",
    },
  },
];
