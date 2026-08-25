export type StackCategory = {
  id: string;
  label: string;
  labelEs: string;
  prompt: string;
  color: string;
  items: string[];
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
