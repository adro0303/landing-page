export type StackCategory = {
  id: string;
  label: string;
  labelEs: string;
  prompt: string;
  color: string;
  items: string[];
};

// Short experience tag per tool. "1+ yr" only where that's literally true
// (production use at Authect); everything else gets an honest scope tag
// instead of a made-up duration. Full detail lives in the résumé / GitHub,
// linked from the Uplink section — this is deliberately terse.
export const stackExperience: Record<string, { en: string; es: string }> = {
  Python: { en: "1+ yr", es: "1+ año" },
  JavaScript: { en: "side projects", es: "proyectos personales" },
  Java: { en: "coursework", es: "universidad" },
  "C++": { en: "coursework", es: "universidad" },
  HTML5: { en: "side projects", es: "proyectos personales" },
  CSS3: { en: "side projects", es: "proyectos personales" },
  PyTorch: { en: "FYP", es: "TFG" },
  "scikit-learn": { en: "3 projects", es: "3 proyectos" },
  pandas: { en: "every ML project", es: "todo proyecto de ML" },
  NumPy: { en: "every ML project", es: "todo proyecto de ML" },
  Jupyter: { en: "research", es: "investigación" },
  Streamlit: { en: "1 project", es: "1 proyecto" },
  "CLI design": { en: "3 projects", es: "3 proyectos" },
  "YAML configs": { en: "3 projects", es: "3 proyectos" },
  SMTP: { en: "1 project", es: "1 proyecto" },
  n8n: { en: "1 project", es: "1 proyecto" },
  ComfyUI: { en: "1 project", es: "1 proyecto" },
  "Kokoro TTS": { en: "1 project", es: "1 proyecto" },
  ffmpeg: { en: "1 project", es: "1 proyecto" },
  "GitHub Actions": { en: "1+ yr", es: "1+ año" },
  Docker: { en: "1+ yr", es: "1+ año" },
  pytest: { en: "1 project", es: "1 proyecto" },
  Git: { en: "daily", es: "a diario" },
  "gh CLI": { en: "1 project", es: "1 proyecto" },
  Vercel: { en: "this site", es: "este sitio" },
  "React 19": { en: "this site", es: "este sitio" },
  TypeScript: { en: "1+ yr", es: "1+ año" },
  Vite: { en: "this site", es: "este sitio" },
  "Tailwind CSS": { en: "this site", es: "este sitio" },
  GSAP: { en: "this site", es: "este sitio" },
  "Framer Motion": { en: "this site", es: "este sitio" },
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
