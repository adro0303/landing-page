import type { CSSProperties } from "react";
import type { DeviceProject } from "@/data/projects";
import { FlowTrack } from "./FlowTrack";

function PhoneIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="7" y="2" width="10" height="20" rx="2.2" />
      <line x1="10.3" y1="18.4" x2="13.7" y2="18.4" />
    </svg>
  );
}

function LaptopIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="4" width="16" height="11" rx="1.2" />
      <path d="M2 19h20l-1.6-3.2H3.6L2 19z" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="11" width="14" height="9" rx="1.5" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export function DeviceLinkViz({ project }: { project: DeviceProject }) {
  return (
    <div className="rounded-sm border border-(--color-line) bg-(--color-panel-raised)/60 px-5 py-6">
      <div className="flex items-center">
        <PhoneIcon className="h-8 w-8 shrink-0" style={{ color: project.accent }} />

        <div className="mx-1 flex flex-1 items-center">
          <div className="h-px flex-1 border-t border-dashed border-(--color-line)" />
          <div className="mx-2 flex shrink-0 items-center gap-1.5 rounded-full border border-(--color-line) bg-(--color-panel) px-2.5 py-1">
            <LockIcon className="h-3 w-3 text-(--color-fg-dim)" />
            <span className="font-mono text-[8.5px] whitespace-nowrap tracking-wide text-(--color-fg-dim)">
              {project.link.via}
            </span>
            <span
              className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full"
              style={{ background: project.accent, boxShadow: `0 0 6px ${project.accent}` }}
            />
          </div>
          <div className="h-px flex-1 border-t border-dashed border-(--color-line)" />
        </div>

        <LaptopIcon className="h-8 w-8 shrink-0 text-(--color-fg-dim)" />
      </div>

      <div className="mt-4 border-t border-(--color-line) pt-2">
        <FlowTrack nodes={project.nodes} accent={project.accent} />
      </div>
    </div>
  );
}
