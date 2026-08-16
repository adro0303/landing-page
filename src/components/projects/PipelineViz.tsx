import type { PipelineProject } from "@/data/projects";
import { FlowTrack } from "./FlowTrack";

export function PipelineViz({ project }: { project: PipelineProject }) {
  return (
    <div className="rounded-sm border border-(--color-line) bg-(--color-panel-raised)/60 p-4">
      <FlowTrack nodes={project.stages} accent={project.accent} />
      <div className="mt-2 h-28 overflow-hidden rounded-sm border border-(--color-line) bg-black/50 p-3">
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
