import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "en" | "es";

const STORAGE_KEY = "adro_os_lang";

type Leaf = { en: string; es: string };
type Tree = { [key: string]: Leaf | Tree };

const dict = {
  nav: {
    hero: { en: "BOOT", es: "INICIO" },
    identity: { en: "IDENTITY", es: "IDENTIDAD" },
    stack: { en: "STACK", es: "STACK" },
    projects: { en: "PROJECTS", es: "PROYECTOS" },
    uplink: { en: "UPLINK", es: "CONTACTO" },
  },
  topbar: {
    brand: { en: "ADRO_OS", es: "ADRO_OS" },
    menu: { en: "[ ≡ menu ]", es: "[ ≡ menú ]" },
    close: { en: "[ ✕ close ]", es: "[ ✕ cerrar ]" },
  },
  hero: {
    scroll: { en: "SCROLL TO CONTINUE", es: "DESPLÁZATE PARA CONTINUAR" },
    dormant: { en: "STATUS: DORMANT", es: "ESTADO: INACTIVO" },
    scanning: { en: "STATUS: SCANNING", es: "ESTADO: ESCANEANDO" },
    objectClass: {
      en: "OBJECT.CLASS: MARBLE // GALLERIA.ACCADEMIA",
      es: "OBJETO.CLASE: MÁRMOL // GALLERIA.ACCADEMIA",
    },
  },
  identity: {
    eyebrow: { en: "01 // IDENTITY", es: "01 // IDENTIDAD" },
    online: { en: "ONLINE", es: "EN LÍNEA" },
    floppyCaption: {
      en: "backup.img — 1.44MB // still readable",
      es: "backup.img — 1.44MB // todavía se lee",
    },
  },
  stack: {
    eyebrow: { en: "02 // SYSTEM STACK", es: "02 // STACK DEL SISTEMA" },
    description: {
      en: "Modules currently loaded on the system bus — grouped by what they're for, not alphabetized for show.",
      es: "Módulos cargados actualmente en el sistema — agrupados por para qué sirven, no alfabetizados para lucir.",
    },
  },
  projects: {
    eyebrow: { en: "03 // ACTIVE PROCESSES", es: "03 // PROCESOS ACTIVOS" },
    description: {
      en: "Six real repos, activated one at a time.",
      es: "Seis repos reales, activados uno a la vez.",
    },
    scrollHintDesktop: {
      en: "Keep scrolling — this section moves sideways.",
      es: "Sigue haciendo scroll — esta sección se mueve en horizontal.",
    },
    scrollHintMobile: { en: "Swipe to explore.", es: "Desliza para explorar." },
    archiveNote: {
      en: "// earlier coursework & experiments",
      es: "// trabajos de curso y experimentos anteriores",
    },
    viewGithub: { en: "view full GitHub →", es: "ver GitHub completo →" },
    role: { en: "ROLE", es: "ROL" },
    focus: { en: "FOCUS", es: "ENFOQUE" },
    expandNotes: { en: "expand notes", es: "ampliar notas" },
    collapse: { en: "[ − collapse ]", es: "[ − cerrar ]" },
    buildNotes: { en: "build_notes", es: "notas_de_build" },
    viewSource: { en: "view source →", es: "ver código →" },
    problem: { en: "problem — ", es: "problema — " },
    built: { en: "built — ", es: "construido — " },
    why: { en: "why it matters — ", es: "por qué importa — " },
    categories: {
      all: { en: "ALL", es: "TODO" },
      systems: { en: "SYSTEMS", es: "SISTEMAS" },
      security: { en: "SECURITY", es: "SEGURIDAD" },
      "data-ai": { en: "DATA / AI", es: "DATOS / IA" },
      automation: { en: "AUTOMATION", es: "AUTOMATIZACIÓN" },
    },
  },
  uplink: {
    eyebrow: { en: "04 // UPLINK", es: "04 // ENLACE" },
    resumeCaption: {
      en: "One-page CV — role, stack, and shipped work.",
      es: "CV de una página — rol, stack y trabajo entregado.",
    },
    viewCv: { en: "VIEW CV", es: "VER CV" },
    downloadCv: { en: "DOWNLOAD ↓", es: "DESCARGAR ↓" },
    talkNote: {
      en: "// always up for talking about a weird technical idea.",
      es: "// siempre dispuesto a hablar de una idea técnica rara.",
    },
    connect: { en: "connect →", es: "contactar →" },
    footer: {
      en: "ADRO_OS — session end. press ~ for a hidden shell.",
      es: "ADRO_OS — fin de sesión. pulsa ~ para una shell oculta.",
    },
  },
} satisfies Tree;

function resolve(path: string): Leaf | undefined {
  const parts = path.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let node: any = dict;
  for (const part of parts) {
    node = node?.[part];
  }
  return node && typeof node.en === "string" ? (node as Leaf) : undefined;
}

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  t: (path: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readInitialLang(): Lang {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "es" ? "es" : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang: setLangState,
      toggle: () => setLangState((prev) => (prev === "en" ? "es" : "en")),
      t: (path: string) => {
        const leaf = resolve(path);
        if (!leaf) return path;
        return leaf[lang] ?? leaf.en;
      },
    }),
    [lang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
