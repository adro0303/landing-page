export type StackCategory = {
  id: string;
  label: string;
  labelEs: string;
  prompt: string;
  color: string;
  items: string[];
};

// Experience tag per tool, given by the user item by item — real durations,
// not guesses. "1+ yr" is production use at Authect; everything else is the
// duration they gave for that specific tool. Full detail lives in the
// résumé / GitHub, linked from the Uplink section — this stays terse.
export const stackExperience: Record<string, { en: string; es: string }> = {
  Python: { en: "1+ yr", es: "1+ año" },
  JavaScript: { en: "<1 yr", es: "<1 año" },
  Java: { en: "<1 yr", es: "<1 año" },
  "C++": { en: "<1 yr", es: "<1 año" },
  HTML5: { en: "<1 yr", es: "<1 año" },
  CSS3: { en: "<1 yr", es: "<1 año" },
  "Shell / Bash": { en: "1-2 yr", es: "1-2 años" },
  SQL: { en: "6+ mo", es: "6+ meses" },
  PyTorch: { en: "1-2 yr", es: "1-2 años" },
  "scikit-learn": { en: "1-2 yr", es: "1-2 años" },
  pandas: { en: "1-2 yr", es: "1-2 años" },
  NumPy: { en: "1-2 yr", es: "1-2 años" },
  Jupyter: { en: "1-2 yr", es: "1-2 años" },
  Streamlit: { en: "<1 yr", es: "<1 año" },
  "CLI design": { en: "1-2 yr", es: "1-2 años" },
  "YAML configs": { en: "1-2 yr", es: "1-2 años" },
  SMTP: { en: "<1 yr", es: "<1 año" },
  n8n: { en: "<1 yr", es: "<1 año" },
  ComfyUI: { en: "1-2 yr", es: "1-2 años" },
  "Kokoro TTS": { en: "<1 yr", es: "<1 año" },
  ffmpeg: { en: "<1 yr", es: "<1 año" },
  "GitHub Actions": { en: "1+ yr", es: "1+ año" },
  Docker: { en: "1+ yr", es: "1+ año" },
  pytest: { en: "1-2 yr", es: "1-2 años" },
  Git: { en: "2-3 yr", es: "2-3 años" },
  "gh CLI": { en: "1-2 yr", es: "1-2 años" },
  Vercel: { en: "1-2 yr", es: "1-2 años" },
  "React 19": { en: "<1 yr", es: "<1 año" },
  TypeScript: { en: "1+ yr", es: "1+ año" },
  Vite: { en: "<1 yr", es: "<1 año" },
  "Tailwind CSS": { en: "1-2 yr", es: "1-2 años" },
  GSAP: { en: "<1 yr", es: "<1 año" },
  "Framer Motion": { en: "<1 yr", es: "<1 año" },
};

export const stackCategories: StackCategory[] = [
  {
    id: "languages",
    label: "LANGUAGES",
    labelEs: "LENGUAJES",
    prompt: "ls ~/lang",
    color: "var(--color-blue)",
    items: ["Python", "JavaScript", "Java", "C++", "HTML5", "CSS3", "Shell / Bash", "SQL"],
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
