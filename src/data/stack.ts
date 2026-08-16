export type StackCategory = {
  id: string;
  label: string;
  prompt: string;
  color: string;
  items: string[];
};

export const stackCategories: StackCategory[] = [
  {
    id: "languages",
    label: "LANGUAGES",
    prompt: "ls ~/lang",
    color: "var(--color-blue)",
    items: ["Python", "JavaScript", "Java", "C++", "HTML5", "CSS3"],
  },
  {
    id: "ai-ml",
    label: "AI / MACHINE LEARNING",
    prompt: "pip freeze | grep ml",
    color: "var(--color-magenta)",
    items: ["PyTorch", "scikit-learn", "pandas", "NumPy", "Jupyter"],
  },
  {
    id: "backend",
    label: "BACKEND & TOOLING",
    prompt: "ls ~/tools",
    color: "var(--color-green)",
    items: ["Streamlit", "CLI design", "YAML configs", "SMTP"],
  },
  {
    id: "ai-infra",
    label: "LOCAL AI INFRA",
    prompt: "docker compose ps",
    color: "var(--color-amber)",
    items: ["n8n", "ComfyUI", "Kokoro TTS", "ffmpeg"],
  },
  {
    id: "devops",
    label: "CI/CD & DEVOPS",
    prompt: "git log --oneline -5",
    color: "var(--color-cyan)",
    items: ["GitHub Actions", "Docker", "pytest", "Git", "gh CLI"],
  },
];
