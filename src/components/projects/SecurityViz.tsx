import { useMemo } from "react";
import type { SecurityProject } from "@/data/projects";

function seededPositions(seed: number, count: number) {
  const points: { x: number; y: number }[] = [];
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = 0; i < count; i++) {
    points.push({ x: 8 + rand() * 84, y: 10 + rand() * 80 });
  }
  return points;
}

export function SecurityViz({ project }: { project: SecurityProject }) {
  const dots = useMemo(() => seededPositions(42, 16), []);
  const anomalyIdx = useMemo(() => new Set([3, 9, 13]), []);

  return (
    <div className="grid gap-4 sm:grid-cols-5">
      <div className="sm:col-span-3">
        <div className="h-40 overflow-hidden rounded-sm border border-(--color-line) bg-black/40 p-3">
          <div className="animate-marquee-y flex flex-col gap-1.5">
            {[...project.logLines, ...project.logLines].map((line, i) => (
              <p
                key={i}
                className={`truncate font-mono text-[10.5px] ${
                  line.flagged ? "text-(--color-red)" : "text-(--color-fg-dim)"
                }`}
              >
                {line.flagged ? "⚠ " : "  "}
                {line.text}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className="sm:col-span-2">
        <div className="relative h-40 overflow-hidden rounded-sm border border-(--color-line) bg-black/40">
          <div className="bg-grid absolute inset-0 opacity-30" />
          {dots.map((d, i) => {
            const anomaly = anomalyIdx.has(i);
            return (
              <span
                key={i}
                className={`absolute rounded-full ${anomaly ? "h-2 w-2 bg-(--color-red)" : "h-1.5 w-1.5 bg-(--color-blue)/70"}`}
                style={{
                  left: `${d.x}%`,
                  top: `${d.y}%`,
                  boxShadow: anomaly ? "0 0 8px var(--color-red)" : undefined,
                }}
              />
            );
          })}
          <span className="absolute bottom-1 left-1.5 font-mono text-[8px] tracking-widest text-(--color-fg-faint)">
            illustrative
          </span>
        </div>
      </div>
    </div>
  );
}
