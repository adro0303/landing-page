import type { CSSProperties } from "react";
import { openTool, type ToolName } from "@/lib/terminalBus";
import { useLanguage } from "@/lib/i18n";

const TOOLS: {
  tool: ToolName;
  label: string;
  accent: string;
  en: string;
  es: string;
}[] = [
  {
    tool: "sort",
    label: "sort_race.exe",
    accent: "var(--color-green)",
    en: "Four sorting algorithms race side by side on the same shuffled list — watch which one wins.",
    es: "Cuatro algoritmos de ordenación compiten a la vez con la misma lista desordenada — mira cuál gana.",
  },
  {
    tool: "pathfind",
    label: "pathfinder.exe",
    accent: "var(--color-blue)",
    en: "Draw walls on a grid, then watch A* and Dijkstra race to find the shortest path around them.",
    es: "Dibuja paredes en una cuadrícula y mira a A* y Dijkstra competir por encontrar el camino más corto.",
  },
  {
    tool: "digit",
    label: "digit_recognizer.exe",
    accent: "var(--color-magenta)",
    en: "Draw a digit by hand — a small neural network, trained from scratch, guesses which one it is live.",
    es: "Dibuja un dígito a mano — una pequeña red neuronal entrenada desde cero adivina cuál es, en vivo.",
  },
];

export function AiToolsLaunchpad({
  accent,
  onLaunch,
}: {
  accent: string;
  onLaunch?: () => void;
}) {
  const { lang, t } = useLanguage();

  return (
    <div className="rounded-sm border border-(--color-line) bg-(--color-panel-raised)/60 p-4">
      <div className="flex flex-col gap-2.5">
        {TOOLS.map((item) => (
          <button
            key={item.tool}
            type="button"
            onClick={() => {
              openTool(item.tool);
              onLaunch?.();
            }}
            className="group flex items-center gap-3 rounded-sm border border-(--color-line) bg-(--color-panel)/70 px-3 py-2.5 text-left transition-colors hover:border-(--accent)"
            style={{ "--accent": item.accent } as CSSProperties}
          >
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border text-[11px]"
              style={{ borderColor: item.accent, color: item.accent }}
            >
              ▶
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-mono text-[12px] text-(--color-fg)">{item.label}</span>
              <span className="mt-0.5 block font-mono text-[11px] leading-snug text-(--color-fg-dim)">
                {lang === "es" ? item.es : item.en}
              </span>
            </span>
            <span
              className="shrink-0 font-mono text-[10px] tracking-wide text-(--color-fg-faint) transition-colors group-hover:text-(--accent)"
              style={{ "--accent": item.accent } as CSSProperties}
            >
              {t("projects.tryIt")}
            </span>
          </button>
        ))}
      </div>
      <p className="mt-1 pt-2.5 font-mono text-[10px] text-(--color-fg-faint)" style={{ color: `color-mix(in srgb, ${accent} 60%, var(--color-fg-faint))` }}>
        {t("projects.aiToolsNote")}
      </p>
    </div>
  );
}
