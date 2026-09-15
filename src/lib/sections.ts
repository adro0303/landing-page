export const sections = [
  { id: "hero", label: "BOOT" },
  { id: "whatido", label: "WHAT I DO" },
  { id: "current", label: "RIGHT NOW" },
  { id: "ai", label: "AI" },
  { id: "identity", label: "IDENTITY" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "education", label: "EDUCATION" },
  { id: "stack", label: "STACK" },
  { id: "projects", label: "PROJECTS" },
  { id: "uplink", label: "UPLINK" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
