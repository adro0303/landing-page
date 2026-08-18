import { techIcons } from "@/data/techIcons";

export function TechIcon({ item, className }: { item: string; className?: string }) {
  const icon = techIcons[item];

  if (!icon) {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M8 7l-4.5 5L8 17M16 7l4.5 5-4.5 5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
}
