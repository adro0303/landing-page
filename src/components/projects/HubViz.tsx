import type { CSSProperties } from "react";
import type { HubProject } from "@/data/projects";

const HUB = { x: 15, y: 50 };
const LINE_END_X = 74;
const NODE_X = 80;

export function HubViz({ project }: { project: HubProject }) {
  const modules = project.modules;
  const topPad = 26;
  const bottomPad = 14;
  const positions = modules.map((_, i) =>
    modules.length > 1 ? topPad + (i * (100 - topPad - bottomPad)) / (modules.length - 1) : 50,
  );

  return (
    <div className="relative h-44 overflow-hidden rounded-sm border border-(--color-line) bg-(--color-panel-raised)/60 sm:h-48">
      <div className="bg-grid absolute inset-0 opacity-25" />

      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        {positions.map((y) => (
          <line
            key={y}
            x1={HUB.x}
            y1={HUB.y}
            x2={LINE_END_X}
            y2={y}
            stroke="var(--color-line)"
            strokeWidth={0.4}
          />
        ))}
      </svg>

      {positions.map((y, i) => (
        <span
          key={`pulse-${modules[i]}`}
          className="animate-orbit-pulse absolute h-1.5 w-1.5 rounded-full"
          style={
            {
              "--orbit-x1": `${HUB.x}%`,
              "--orbit-y1": `${HUB.y}%`,
              "--orbit-x2": `${LINE_END_X}%`,
              "--orbit-y2": `${y}%`,
              animationDelay: `${i * 0.55}s`,
              background: project.accent,
              boxShadow: `0 0 6px ${project.accent}`,
              transform: "translate(-50%, -50%)",
            } as CSSProperties
          }
        />
      ))}

      <div
        className="absolute flex h-10 w-10 items-center justify-center rounded-full border-2 bg-(--color-void) font-mono text-[11px]"
        style={{
          left: `${HUB.x}%`,
          top: `${HUB.y}%`,
          transform: "translate(-50%, -50%)",
          borderColor: project.accent,
          color: project.accent,
          boxShadow: `0 0 12px color-mix(in srgb, ${project.accent} 55%, transparent)`,
        }}
      >
        {">_"}
      </div>

      {modules.map((mod, i) => (
        <div
          key={mod}
          className="absolute flex items-center gap-1.5"
          style={{ left: `${NODE_X}%`, top: `${positions[i]}%`, transform: "translate(0, -50%)" }}
        >
          <span
            className="h-2 w-2 shrink-0 rounded-full border-2 bg-(--color-void)"
            style={{ borderColor: project.accent }}
          />
          <span className="max-w-[70px] font-mono text-[8.5px] leading-tight text-(--color-fg-dim) sm:max-w-[92px] sm:text-[9px]">
            {mod}
          </span>
        </div>
      ))}

      <div className="absolute top-2 right-2 flex items-center gap-1.5 rounded-sm border border-(--color-line) bg-(--color-panel)/80 px-2 py-1">
        <span className="relative flex h-1.5 w-1.5">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
            style={{ background: project.accent }}
          />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: project.accent }} />
        </span>
        <span className="font-mono text-[8.5px] tracking-[0.15em] text-(--color-fg-faint)">
          0 INBOUND
        </span>
      </div>
    </div>
  );
}
