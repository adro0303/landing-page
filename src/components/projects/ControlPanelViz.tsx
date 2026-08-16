import { useState } from "react";
import type { ControlPanelProject } from "@/data/projects";

function Toggle({ label, state }: { label: string; state: "on" | "off" | "guarded" }) {
  const [flipped, setFlipped] = useState(false);

  if (state === "guarded") {
    return (
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="group flex flex-col items-center gap-2 focus:outline-none"
        aria-pressed={flipped}
      >
        <div className="relative h-10 w-16">
          <div
            className="absolute inset-x-0 top-0 z-10 h-5 origin-top rounded-t-sm border border-(--color-red)/60 bg-(--color-panel-raised) transition-transform duration-300"
            style={{ transform: flipped ? "rotateX(115deg)" : "rotateX(0deg)" }}
          />
          <div className="absolute inset-x-0 bottom-0 h-6 rounded-sm border border-(--color-red)/50 bg-(--color-red)/10" />
          <div
            className={`absolute inset-x-2 bottom-1 h-3.5 rounded-[2px] transition-colors ${
              flipped ? "bg-(--color-red)" : "bg-(--color-red)/25"
            }`}
            style={{ boxShadow: flipped ? "0 0 10px var(--color-red)" : "none" }}
          />
        </div>
        <span className="font-mono text-[10px] tracking-[0.15em] text-(--color-red)/80">
          {label}
        </span>
      </button>
    );
  }

  const on = state === "on";
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`flex h-6 w-11 items-center rounded-full border p-0.5 transition-colors ${
          on ? "border-(--color-green)/60 bg-(--color-green)/10" : "border-(--color-line) bg-(--color-panel-raised)"
        }`}
      >
        <div
          className={`h-4 w-4 rounded-full transition-transform ${
            on ? "translate-x-5 bg-(--color-green)" : "translate-x-0 bg-(--color-fg-faint)"
          }`}
          style={on ? { boxShadow: "0 0 8px var(--color-green)" } : undefined}
        />
      </div>
      <span className="font-mono text-[10px] tracking-[0.15em] text-(--color-fg-dim)">{label}</span>
    </div>
  );
}

export function ControlPanelViz({ project }: { project: ControlPanelProject }) {
  return (
    <div className="flex items-center justify-around rounded-sm border border-(--color-line) bg-(--color-panel-raised)/60 px-6 py-8">
      {project.switches.map((s) => (
        <Toggle key={s.label} label={s.label} state={s.state} />
      ))}
    </div>
  );
}
