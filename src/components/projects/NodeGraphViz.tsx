import type { NodeGraphProject } from "@/data/projects";
import { FlowTrack } from "./FlowTrack";

export function NodeGraphViz({ project }: { project: NodeGraphProject }) {
  return (
    <div className="rounded-sm border border-(--color-line) bg-(--color-panel-raised)/60 p-5">
      <FlowTrack nodes={project.nodes} accent={project.accent} />
    </div>
  );
}
