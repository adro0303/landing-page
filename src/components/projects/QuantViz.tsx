import { useState } from "react";
import { motion } from "framer-motion";
import type { QuantProject } from "@/data/projects";

export function QuantViz({ project }: { project: QuantProject }) {
  const [tabIdx, setTabIdx] = useState(0);
  const tab = project.tabs[tabIdx];
  const max = Math.max(...tab.bars.map((b) => b.value));

  return (
    <div className="rounded-sm border border-(--color-line) bg-(--color-panel-raised)/60 p-4">
      <div className="mb-4 flex gap-2">
        {project.tabs.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setTabIdx(i)}
            className={`rounded-sm border px-3 py-1.5 font-mono text-[11px] tracking-wide transition-colors ${
              i === tabIdx
                ? "border-(--color-cyan) text-(--color-cyan)"
                : "border-(--color-line) text-(--color-fg-dim) hover:border-(--color-fg-dim)"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2">
        {tab.metrics.map((m) => (
          <div key={m.label} className="border-l-2 border-(--color-cyan)/40 pl-2">
            <p className="font-mono text-[9px] tracking-wide text-(--color-fg-faint)">{m.label}</p>
            <p className="font-mono text-xs text-(--color-fg) sm:text-sm">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {tab.bars.map((b) => (
          <div key={b.label} className="flex items-center gap-2">
            <span className="w-24 shrink-0 truncate font-mono text-[10px] text-(--color-fg-dim)">
              {b.label}
            </span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-sm bg-black/40">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${(b.value / max) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="h-full rounded-sm"
                style={{
                  background: b.highlight ? "var(--color-cyan)" : "var(--color-fg-faint)",
                  boxShadow: b.highlight ? "0 0 8px var(--color-cyan)" : undefined,
                }}
              />
            </div>
            <span className="w-12 shrink-0 text-right font-mono text-[10px] text-(--color-fg-dim)">
              {b.value.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-3 font-mono text-[10.5px] text-(--color-fg-faint) italic">{tab.note}</p>
    </div>
  );
}
