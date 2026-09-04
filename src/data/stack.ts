export type StackCategory = {
  id: string;
  label: string;
  labelEs: string;
  prompt: string;
  color: string;
  items: string[];
};

// Proof of experience per tool, sourced from the "Tech stack — with where I
// actually used it" section of github.com/adro0303/adro0303's README.
export const stackProof: Record<string, { en: string; es: string }> = {
  Python: {
    en: "Production at Authect (1+ yr) — also my primary language across every personal ML/automation project",
    es: "Producción en Authect (1+ año) — también mi lenguaje principal en todos mis proyectos de ML/automatización",
  },
  JavaScript: {
    en: "Personal projects — browser extension, portfolio tooling",
    es: "Proyectos personales — extensión de navegador, herramientas del portfolio",
  },
  Java: {
    en: "University coursework — OOP fundamentals (Minesweeper, recursion exercises)",
    es: "Trabajo universitario — fundamentos de POO (Buscaminas, ejercicios de recursión)",
  },
  "C++": {
    en: "University coursework — abCPLUS, a C++20/STL hospital management system",
    es: "Trabajo universitario — abCPLUS, un sistema de gestión hospitalaria en C++20/STL",
  },
  HTML5: {
    en: "Personal static sites and portfolio base styling",
    es: "Sitios estáticos personales y estilos base del portfolio",
  },
  CSS3: {
    en: "Personal static sites and portfolio base styling",
    es: "Sitios estáticos personales y estilos base del portfolio",
  },
  PyTorch: {
    en: "BSc final year project — built an MLP from scratch, benchmarked against 5 classical baselines",
    es: "Proyecto final de grado — MLP construido desde cero, comparado contra 5 baselines clásicos",
  },
  "scikit-learn": {
    en: "3 personal projects — anomaly detection, market forecasting, investor profiling",
    es: "3 proyectos personales — detección de anomalías, predicción de mercado, perfilado de inversores",
  },
  pandas: {
    en: "Data pipeline for every ML project I've built, including a from-scratch neural net trained with NumPy alone",
    es: "Pipeline de datos en cada proyecto de ML que he construido, incluida una red neuronal desde cero entrenada solo con NumPy",
  },
  NumPy: {
    en: "Data pipeline for every ML project I've built, including a from-scratch neural net trained with NumPy alone",
    es: "Pipeline de datos en cada proyecto de ML que he construido, incluida una red neuronal desde cero entrenada solo con NumPy",
  },
  Jupyter: {
    en: "Research and prototyping across all of my ML work",
    es: "Investigación y prototipado en todo mi trabajo de ML",
  },
  Streamlit: {
    en: "auto_applyer's full dashboard and lead/draft database",
    es: "Panel completo de auto_applyer y su base de datos de leads/borradores",
  },
  "CLI design": {
    en: "Automation and config across ipa-builder, overclaude, and pocket-server",
    es: "Automatización y configuración en ipa-builder, overclaude y pocket-server",
  },
  "YAML configs": {
    en: "Automation and config across ipa-builder, overclaude, and pocket-server",
    es: "Automatización y configuración en ipa-builder, overclaude y pocket-server",
  },
  SMTP: {
    en: "auto_applyer — personalised email drafting, rate-limited with manual approval before sending",
    es: "auto_applyer — redacción de emails personalizados, limitados en tasa y con aprobación manual antes de enviarse",
  },
  n8n: {
    en: "Orchestrates youtube-ai-pipeline's fully local flow end-to-end",
    es: "Orquesta de principio a fin el flujo 100% local de youtube-ai-pipeline",
  },
  ComfyUI: {
    en: "youtube-ai-pipeline — Krea2 Turbo + a style-reference LoRA for character-consistent scenes",
    es: "youtube-ai-pipeline — Krea2 Turbo + un LoRA de referencia de estilo para escenas con personajes consistentes",
  },
  "Kokoro TTS": {
    en: "youtube-ai-pipeline — local narration with no cloud inference cost",
    es: "youtube-ai-pipeline — narración local sin coste de inferencia en la nube",
  },
  ffmpeg: {
    en: "youtube-ai-pipeline's assembly service",
    es: "Servicio de ensamblado de youtube-ai-pipeline",
  },
  "GitHub Actions": {
    en: "Production releases at Authect — also what ipa-builder's entire build pipeline runs on",
    es: "Releases de producción en Authect — también sobre lo que corre todo el pipeline de build de ipa-builder",
  },
  Docker: {
    en: "Production at Authect — also containerized in 4+ personal projects",
    es: "Producción en Authect — también contenerizado en 4+ proyectos personales",
  },
  pytest: {
    en: "AI-LogAnomalyDetectionSystem's automated test suite",
    es: "Suite de tests automatizados de AI-LogAnomalyDetectionSystem",
  },
  Git: {
    en: "Daily, across every professional and personal project",
    es: "A diario, en todos mis proyectos profesionales y personales",
  },
  "gh CLI": {
    en: "ipa-builder — scoped fine-grained tokens to securely check out target repos",
    es: "ipa-builder — tokens de acceso limitado para clonar repos objetivo de forma segura",
  },
  Vercel: {
    en: "Hosts this live portfolio",
    es: "Aloja este portfolio en producción",
  },
  "React 19": {
    en: "Rebuilt this portfolio (ADRO_OS) from scratch",
    es: "Reconstruí este portfolio (ADRO_OS) desde cero",
  },
  TypeScript: {
    en: "Production at Authect (backend + frontend, 1+ yr) — also this portfolio site",
    es: "Producción en Authect (backend + frontend, 1+ año) — también este portfolio",
  },
  Vite: {
    en: "This portfolio's build tooling",
    es: "Herramienta de build de este portfolio",
  },
  "Tailwind CSS": {
    en: "This portfolio's styling system",
    es: "Sistema de estilos de este portfolio",
  },
  GSAP: {
    en: "Pinned scroll sequences on this site",
    es: "Secuencias de scroll fijadas en este sitio",
  },
  "Framer Motion": {
    en: "Section reveals and micro-interactions on this site",
    es: "Apariciones de sección y micro-interacciones en este sitio",
  },
};

export const stackCategories: StackCategory[] = [
  {
    id: "languages",
    label: "LANGUAGES",
    labelEs: "LENGUAJES",
    prompt: "ls ~/lang",
    color: "var(--color-blue)",
    items: ["Python", "JavaScript", "Java", "C++", "HTML5", "CSS3"],
  },
  {
    id: "ai-ml",
    label: "AI / MACHINE LEARNING",
    labelEs: "IA / MACHINE LEARNING",
    prompt: "pip freeze | grep ml",
    color: "var(--color-magenta)",
    items: ["PyTorch", "scikit-learn", "pandas", "NumPy", "Jupyter"],
  },
  {
    id: "backend",
    label: "BACKEND & TOOLING",
    labelEs: "BACKEND Y HERRAMIENTAS",
    prompt: "ls ~/tools",
    color: "var(--color-green)",
    items: ["Streamlit", "CLI design", "YAML configs", "SMTP"],
  },
  {
    id: "ai-infra",
    label: "LOCAL AI INFRA",
    labelEs: "INFRAESTRUCTURA DE IA LOCAL",
    prompt: "docker compose ps",
    color: "var(--color-amber)",
    items: ["n8n", "ComfyUI", "Kokoro TTS", "ffmpeg"],
  },
  {
    id: "devops",
    label: "CI/CD & DEVOPS",
    labelEs: "CI/CD Y DEVOPS",
    prompt: "git log --oneline -5",
    color: "var(--color-cyan)",
    items: ["GitHub Actions", "Docker", "pytest", "Git", "gh CLI", "Vercel"],
  },
  {
    id: "frontend",
    label: "THIS SITE",
    labelEs: "ESTE SITIO",
    prompt: "npm ls --depth=0",
    color: "var(--color-red)",
    items: ["React 19", "TypeScript", "Vite", "Tailwind CSS", "GSAP", "Framer Motion"],
  },
];
