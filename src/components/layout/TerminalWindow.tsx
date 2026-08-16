import type { ReactNode } from "react";

export function TerminalWindow({
  title,
  children,
  className = "",
  accent = "var(--color-blue)",
}: {
  title: string;
  children: ReactNode;
  className?: string;
  accent?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-sm border border-(--color-line) bg-(--color-panel)/80 backdrop-blur-sm ${className}`}
      style={{ boxShadow: `0 0 0 1px color-mix(in srgb, ${accent} 12%, transparent)` }}
    >
      <div className="flex items-center gap-2 border-b border-(--color-line) bg-(--color-panel-raised) px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-(--color-red)/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-(--color-amber)/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-(--color-green)/70" />
        <span className="ml-2 truncate font-mono text-[11px] tracking-wide text-(--color-fg-dim)">
          {title}
        </span>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}
