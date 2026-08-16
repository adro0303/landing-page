export const sections = [
  { id: "hero", label: "BOOT" },
  { id: "identity", label: "IDENTITY" },
  { id: "stack", label: "STACK" },
  { id: "projects", label: "PROJECTS" },
  { id: "uplink", label: "UPLINK" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
