import type { Project } from "@/data/projects";
import { PipelineViz } from "./PipelineViz";
import { ControlPanelViz } from "./ControlPanelViz";
import { SecurityViz } from "./SecurityViz";
import { QuantViz } from "./QuantViz";
import { NodeGraphViz } from "./NodeGraphViz";

function Visual({ project }: { project: Project }) {
  switch (project.kind) {
    case "pipeline":
      return <PipelineViz project={project} />;
    case "control-panel":
      return <ControlPanelViz project={project} />;
    case "security":
      return <SecurityViz project={project} />;
    case "quant":
      return <QuantViz project={project} />;
    case "node-graph":
      return <NodeGraphViz project={project} />;
  }
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      className="flex h-full w-[86vw] shrink-0 flex-col overflow-hidden rounded-sm border border-(--color-line) bg-(--color-panel)/85 backdrop-blur-sm sm:w-[70vw] md:w-[520px]"
      style={{ boxShadow: `0 0 0 1px color-mix(in srgb, ${project.accent} 14%, transparent)` }}
    >
      <div className="flex items-start justify-between gap-4 border-b border-(--color-line) bg-(--color-panel-raised)/70 px-5 py-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] text-(--color-fg-faint)">
            PROCESS_{String(project.index).padStart(2, "0")}
          </p>
          <h3
            className="font-display text-2xl tracking-wide sm:text-[1.7rem]"
            style={{ color: project.accent }}
          >
            {project.title}
          </h3>
        </div>
        <span
          className="mt-1 h-2.5 w-2.5 shrink-0 animate-pulse rounded-full"
          style={{ background: project.accent, boxShadow: `0 0 8px ${project.accent}` }}
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 px-5 py-5">
        <p className="font-mono text-[13px] leading-relaxed text-(--color-fg) sm:text-sm">
          {project.tagline}
        </p>

        <Visual project={project} />

        <div className="grid grid-cols-3 gap-2">
          {project.stats.map((s) => (
            <div key={s.label} className="border-l-2 border-(--color-line) pl-2">
              <p className="truncate font-mono text-[8.5px] tracking-wide text-(--color-fg-faint)">
                {s.label}
              </p>
              <p className="truncate font-mono text-[11px] text-(--color-fg)">{s.value}</p>
            </div>
          ))}
        </div>

        <details className="group">
          <summary className="cursor-pointer list-none font-mono text-[11px] tracking-wide text-(--color-fg-dim) transition-colors select-none hover:text-(--color-fg)">
            <span className="group-open:hidden">[ + expand build notes ]</span>
            <span className="hidden group-open:inline">[ − collapse ]</span>
          </summary>
          <div className="mt-3 space-y-2 border-t border-(--color-line) pt-3 font-mono text-[12px] leading-relaxed text-(--color-fg-dim)">
            <p>
              <span className="text-(--color-fg-faint)">problem — </span>
              {project.problem}
            </p>
            <p>
              <span className="text-(--color-fg-faint)">built — </span>
              {project.built}
            </p>
            <p className="italic">
              <span className="not-italic text-(--color-fg-faint)">why it matters — </span>
              {project.why}
            </p>
          </div>
        </details>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-sm border border-(--color-line) px-2 py-0.5 font-mono text-[10px] text-(--color-fg-dim)"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-(--color-line) bg-(--color-panel-raised)/70 px-5 py-3">
        <span className="truncate font-mono text-[10px] text-(--color-fg-faint)">
          {project.status}
        </span>
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 font-mono text-[11px] tracking-wide text-(--color-blue) transition-colors hover:text-(--color-cyan)"
        >
          view source →
        </a>
      </div>
    </article>
  );
}
