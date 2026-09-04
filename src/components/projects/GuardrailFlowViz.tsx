import type { GuardrailProject } from "@/data/projects";

export function GuardrailFlowViz({ project }: { project: GuardrailProject }) {
  const { stages, accent } = project;

  return (
    <div className="rounded-sm border border-(--color-line) bg-(--color-panel-raised)/60 px-4 py-5">
      <svg viewBox="0 0 100 40" className="h-20 w-full" fill="none">
        <path
          d="M64,14 Q50,32 36,14"
          stroke="var(--color-line)"
          strokeWidth={0.8}
          strokeDasharray="2.2 1.8"
          fill="none"
        />
        <line x1="8" y1="14" x2="92" y2="14" stroke="var(--color-line)" strokeWidth={0.8} />

        <rect
          x="60"
          y="10"
          width="8"
          height="8"
          transform="rotate(45 64 14)"
          fill="var(--color-void)"
          stroke={accent}
          strokeWidth={1}
        />
        <circle cx="8" cy="14" r="2.6" fill="var(--color-void)" stroke={accent} strokeWidth={1} />
        <circle cx="36" cy="14" r="2.6" fill="var(--color-void)" stroke={accent} strokeWidth={1} />
        <circle cx="92" cy="14" r="2.6" fill="var(--color-void)" stroke={accent} strokeWidth={1} />

        <circle r="2" fill={accent}>
          <animateMotion dur="4s" repeatCount="indefinite" path="M8,14 L36,14 L64,14 L92,14" />
        </circle>
      </svg>

      <div className="mt-1 flex justify-between gap-1">
        {stages.map((s) => (
          <span
            key={s}
            className="w-1/4 text-center font-mono text-[8.5px] leading-tight text-(--color-fg-dim) sm:text-[9px]"
          >
            {s}
          </span>
        ))}
      </div>

      <p className="mt-3 text-center font-mono text-[9px] text-(--color-fg-faint)">
        ↺ {project.retryLabel}
      </p>
    </div>
  );
}
