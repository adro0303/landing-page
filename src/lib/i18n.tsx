import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "en" | "es";

const STORAGE_KEY = "adro_os_lang";

type Leaf = { en: string; es: string };
type Tree = { [key: string]: Leaf | Tree };

const dict = {
  a11y: {
    skipToContent: { en: "Skip to main content", es: "Saltar al contenido principal" },
  },
  nav: {
    hero: { en: "BOOT", es: "INICIO" },
    whatido: { en: "WHAT I DO", es: "A QUÉ ME DEDICO" },
    current: { en: "RIGHT NOW", es: "AHORA MISMO" },
    ai: { en: "AI", es: "IA" },
    identity: { en: "IDENTITY", es: "IDENTIDAD" },
    experience: { en: "EXPERIENCE", es: "EXPERIENCIA" },
    education: { en: "EDUCATION", es: "EDUCACIÓN" },
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
    fullName: { en: "Adrián Pliego Pérez", es: "Adrián Pliego Pérez" },
    pitch: {
      en: "Software Engineer building useful things with AI.",
      es: "Ingeniero de Software que construye cosas útiles con IA.",
    },
    credBsc: { en: "BSc Artificial Intelligence", es: "Grado en Inteligencia Artificial" },
    credIelts: { en: "IELTS C1", es: "IELTS C1" },
    credLocation: { en: "Based in Spain", es: "Con base en España" },
    credOpen: { en: "Open to opportunities", es: "Abierto a nuevas oportunidades" },
    navProjects: { en: "See my work", es: "Ver mi trabajo" },
    navContact: { en: "Contact me", es: "Contáctame" },
    scroll: { en: "SCROLL TO CONTINUE", es: "DESPLÁZATE PARA CONTINUAR" },
    dormant: { en: "STATUS: DORMANT", es: "ESTADO: INACTIVO" },
    scanning: { en: "STATUS: SCANNING", es: "ESTADO: ESCANEANDO" },
    objectClass: {
      en: "OBJECT.CLASS: MARBLE // GALLERIA.ACCADEMIA",
      es: "OBJETO.CLASE: MÁRMOL // GALLERIA.ACCADEMIA",
    },
  },
  whatido: {
    eyebrow: { en: "01 // WHAT I ACTUALLY DO", es: "01 // A QUÉ ME DEDICO" },
    title: { en: "What I actually do", es: "A qué me dedico" },
    description: {
      en: "Three things, in plain terms — no jargon required to follow along.",
      es: "Tres cosas, en lenguaje sencillo — sin necesidad de saber de tecnología.",
    },
    software: {
      label: { en: "SOFTWARE", es: "SOFTWARE" },
      text: {
        en: "I build reliable software that solves real problems — systems companies actually run on, not demos.",
        es: "Construyo software fiable que resuelve problemas reales — sistemas sobre los que las empresas realmente operan, no demos.",
      },
    },
    ai: {
      label: { en: "AI", es: "IA" },
      text: {
        en: "I turn AI models into features people actually use — wired into real data and real permissions, not just a chat window.",
        es: "Convierto modelos de IA en funciones que la gente usa de verdad — conectadas a datos y permisos reales, no solo una ventana de chat.",
      },
    },
    leadership: {
      label: { en: "LEADERSHIP", es: "LIDERAZGO" },
      text: {
        en: "I take ideas from a rough sketch to something running in production — and now help a 4-person team do the same.",
        es: "Llevo ideas desde un boceto hasta algo funcionando en producción — y ahora ayudo a un equipo de 4 personas a hacer lo mismo.",
      },
    },
  },
  current: {
    eyebrow: { en: "02 // RIGHT NOW", es: "02 // AHORA MISMO" },
    title: { en: "What I'm building right now", es: "En qué estoy trabajando ahora" },
    subtitle: {
      en: "AI & Software Engineer, Project Team Lead at Authect — I carry features from idea to production.",
      es: "Ingeniero de IA y Software, Project Team Lead en Authect — llevo funcionalidades desde la idea hasta producción.",
    },
    pipeline: {
      idea: { en: "IDEA", es: "IDEA" },
      design: { en: "DESIGN", es: "DISEÑO" },
      build: { en: "BUILD", es: "CONSTRUIR" },
      ai: { en: "AI", es: "IA" },
      test: { en: "TEST", es: "PRUEBAS" },
      production: { en: "PRODUCTION", es: "PRODUCCIÓN" },
    },
    featuresHint: {
      en: "tap a feature to see what it does",
      es: "toca una función para ver qué hace",
    },
    features: {
      assistant: {
        label: { en: "AI assistant", es: "Asistente de IA" },
        text: {
          en: "Answers plain-English questions about a customer's live business data.",
          es: "Responde en lenguaje natural preguntas sobre los datos de negocio de un cliente, en vivo.",
        },
      },
      crm: {
        label: { en: "Customer management", es: "Gestión de clientes" },
        text: {
          en: "A multi-tenant CRM used by every customer on the platform.",
          es: "Un CRM multi-cliente usado por todos los clientes de la plataforma.",
        },
      },
      permissions: {
        label: { en: "Permissions", es: "Permisos" },
        text: {
          en: "Role-based access, so each customer only ever sees their own data.",
          es: "Acceso basado en roles, para que cada cliente vea solo sus propios datos.",
        },
      },
      data: {
        label: { en: "Data & search", es: "Datos y búsqueda" },
        text: {
          en: "Search and pagination that hold up across every customer's dataset.",
          es: "Búsqueda y paginación que aguantan bien sobre los datos de cada cliente.",
        },
      },
      team: {
        label: { en: "Team & releases", es: "Equipo y despliegues" },
        text: {
          en: "Planning, code review and releases for a 4-person engineering team.",
          es: "Planificación, revisión de código y despliegues para un equipo de 4 personas.",
        },
      },
    },
  },
  ai: {
    eyebrow: { en: "03 // AI, EXPLAINED SIMPLY", es: "03 // LA IA, EXPLICADA SENCILLO" },
    title: { en: "How the AI assistant actually works", es: "Cómo funciona de verdad el asistente de IA" },
    description: {
      en: "No jargon — just what happens between a question and an answer.",
      es: "Sin jerga — solo lo que pasa entre una pregunta y una respuesta.",
    },
    flow: {
      user: { en: "You ask a question", es: "Haces una pregunta" },
      understand: { en: "The AI understands it", es: "La IA la entiende" },
      check: { en: "It checks real business data", es: "Consulta datos reales del negocio" },
      permissions: { en: "It respects permissions", es: "Respeta los permisos" },
      answer: { en: "It returns a useful answer", es: "Devuelve una respuesta útil" },
    },
    underTheHood: { en: "Under the hood", es: "Por dentro" },
    showDetails: { en: "show the technical layer", es: "ver la capa técnica" },
    hideDetails: { en: "hide the technical layer", es: "ocultar la capa técnica" },
  },
  howithink: {
    title: { en: "How I think about a problem", es: "Cómo pienso un problema" },
    flow: {
      problem: { en: "PROBLEM", es: "PROBLEMA" },
      user: { en: "USER", es: "USUARIO" },
      system: { en: "SYSTEM", es: "SISTEMA" },
      solution: { en: "SOLUTION", es: "SOLUCIÓN" },
      impact: { en: "IMPACT", es: "IMPACTO" },
    },
  },
  identity: {
    eyebrow: { en: "04 // IDENTITY", es: "04 // IDENTIDAD" },
    online: { en: "ONLINE", es: "EN LÍNEA" },
    floppyCaption: {
      en: "backup.img — 1.44MB // still readable",
      es: "backup.img — 1.44MB // todavía se lee",
    },
    floppyHint: { en: "click to mount", es: "clic para montar" },
    floppyLabel: {
      en: "Mount floppy disk — opens the hidden shell",
      es: "Montar disquete — abre la shell oculta",
    },
  },
  experience: {
    eyebrow: { en: "05 // EXPERIENCE", es: "05 // EXPERIENCIA" },
    description: {
      en: "Real jobs, real teams — not just side projects.",
      es: "Trabajos reales, equipos reales — no solo proyectos personales.",
    },
    journey: {
      cs: { en: "BSc AI", es: "Grado en IA" },
      software: { en: "Software Dev", es: "Desarrollo" },
      backend: { en: "Backend", es: "Backend" },
      ai: { en: "AI", es: "IA" },
      leadership: { en: "Team Lead", es: "Team Lead" },
    },
  },
  education: {
    eyebrow: { en: "06 // EDUCATION", es: "06 // EDUCACIÓN" },
    description: {
      en: "Degree, dual-award transcript, and the certifications behind them.",
      es: "Título, notas de la doble titulación, y las certificaciones detrás.",
    },
  },
  stack: {
    eyebrow: { en: "07 // SYSTEM STACK", es: "07 // STACK DEL SISTEMA" },
    description: {
      en: "The tools matter less than what they build — this is the toolkit behind everything above.",
      es: "Las herramientas importan menos que lo que se construye con ellas — este es el equipo detrás de todo lo anterior.",
    },
  },
  projects: {
    eyebrow: { en: "08 // ACTIVE PROCESSES", es: "08 // PROCESOS ACTIVOS" },
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
    tryIt: { en: "try it →", es: "probar →" },
    aiToolsNote: {
      en: "runs entirely in your browser — no server, no account, no API calls.",
      es: "corre entero en tu navegador — sin servidor, sin cuenta, sin llamadas a APIs.",
    },
    problem: { en: "problem — ", es: "problema — " },
    built: { en: "built — ", es: "construido — " },
    why: { en: "why it matters — ", es: "por qué importa — " },
    technicalDetails: { en: "technical details", es: "detalles técnicos" },
    categories: {
      all: { en: "ALL", es: "TODO" },
      systems: { en: "SYSTEMS", es: "SISTEMAS" },
      security: { en: "SECURITY", es: "SEGURIDAD" },
      "data-ai": { en: "DATA / AI", es: "DATOS / IA" },
      automation: { en: "AUTOMATION", es: "AUTOMATIZACIÓN" },
    },
  },
  toolsLauncher: {
    button: { en: "Try the AI tools", es: "Probar herramientas IA" },
    title: { en: "Interactive demos", es: "Demos interactivas" },
    subtitle: {
      en: "No install, no account — click one and try it right now.",
      es: "Sin instalar nada, sin cuenta — haz clic y pruébala ahora mismo.",
    },
    close: { en: "close", es: "cerrar" },
  },
  proof: {
    title: { en: "Backed by real work", es: "Respaldado por trabajo real" },
    items: {
      degree: { en: "BSc Artificial Intelligence, Coventry University", es: "Grado en Inteligencia Artificial, Coventry University" },
      ielts: { en: "IELTS Academic — C1", es: "IELTS Academic — C1" },
      production: { en: "AI features shipped to production", es: "Funciones de IA en producción" },
      leadership: { en: "Leading a 4-person engineering team", es: "Liderando un equipo de 4 ingenieros" },
      github: { en: "Open-source projects on GitHub", es: "Proyectos open-source en GitHub" },
    },
  },
  uplink: {
    eyebrow: { en: "09 // UPLINK", es: "09 // ENLACE" },
    headline: { en: "Let's build something useful.", es: "Construyamos algo útil." },
    resumeCaption: {
      en: "One-page CV — role, stack, and shipped work.",
      es: "CV de una página — rol, stack y trabajo entregado.",
    },
    viewCv: { en: "VIEW CV", es: "VER CV" },
    downloadCv: { en: "DOWNLOAD", es: "DESCARGAR" },
    pickLanguage: {
      en: "Download CV — choose a language",
      es: "Descargar CV — elige un idioma",
    },
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
