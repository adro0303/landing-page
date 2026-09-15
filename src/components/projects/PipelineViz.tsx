import type { PipelineProject } from "@/data/projects";

function BuildSteps({ stages, accent }: { stages: string[]; accent: string }) {
  return (
    <div className="relative flex flex-col gap-1.5 pl-[5px]">
      <div className="absolute top-[5px] bottom-[5px] left-[5px] w-px bg-(--color-line)" />
      {stages.map((s, i) => {
        const last = i === stages.length - 1;
        return (
          <div key={s} className="relative flex items-center gap-3">
            <span
              className={`relative z-10 h-[10px] w-[10px] shrink-0 rounded-full border-2 ${last ? "animate-pulse" : ""}`}
              style={{ borderColor: accent, background: last ? "var(--color-void)" : accent }}
            />
            <span className="font-mono text-[10.5px] text-(--color-fg-dim)">{s}</span>
          </div>
        );
      })}
    </div>
  );
}

export function PipelineViz({ project }: { project: PipelineProject }) {
  return (
    <div className="rounded-sm border border-(--color-line) bg-(--color-panel-raised)/60 p-2.5">
      <BuildSteps stages={project.stages} accent={project.accent} />
      <div className="mt-2.5 h-16 overflow-hidden rounded-sm border border-(--color-line) bg-black/50 p-2.5">
        <div className="animate-marquee-y flex flex-col gap-1">
          {[...project.logLines, ...project.logLines].map((line, i) => (
            <p key={i} className="truncate font-mono text-[10.5px] text-(--color-green)/80">
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
