import type { CSSProperties } from "react";
import type { DeviceProject } from "@/data/projects";

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

function Heartbeat({ label, accent }: { label: string; accent: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center">
        <span
          className="absolute h-full w-full animate-[ping_2.4s_ease-out_infinite] rounded-full"
          style={{ background: accent, opacity: 0.25 }}
        />
        <span
          className="absolute h-2/3 w-2/3 animate-[ping_2.4s_ease-out_infinite] rounded-full"
          style={{ background: accent, opacity: 0.3, animationDelay: "0.4s" }}
        />
        <span
          className="relative h-2.5 w-2.5 rounded-full"
          style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
        />
      </div>
      <span className="text-center font-mono text-[9px] tracking-[0.1em] text-(--color-fg-dim)">{label}</span>
    </div>
  );
}

function GuardGate({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-9 w-14 shrink-0" style={{ perspective: "160px" }}>
        <div className="animate-flap-guard absolute inset-x-0 top-0 z-10 h-[18px] origin-top rounded-t-sm border border-(--color-red)/60 bg-(--color-panel-raised)" />
        <div className="absolute inset-x-0 bottom-0 h-[22px] rounded-sm border border-(--color-red)/50 bg-(--color-red)/10" />
        <div
          className="absolute inset-x-1.5 bottom-1 h-3 animate-pulse rounded-[2px] bg-(--color-red)/70"
          style={{ boxShadow: "0 0 8px var(--color-red)" }}
        />
      </div>
      <span className="text-center font-mono text-[9px] tracking-[0.1em] text-(--color-red)/80">{label}</span>
    </div>
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

      <div className="mt-5 flex items-start justify-around border-t border-(--color-line) pt-5">
        <Heartbeat label={project.heartbeat} accent={project.accent} />
        {project.guarded.map((label) => (
          <GuardGate key={label} label={label} />
        ))}
      </div>
    </div>
  );
}
