import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { AiToolsLaunchpad } from "@/components/projects/AiToolsLaunchpad";

export function ToolsLauncher() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 left-5 z-[70] flex h-11 items-center gap-2 rounded-sm border border-(--color-line) bg-(--color-panel)/90 px-3.5 font-mono text-xs text-(--color-cyan) backdrop-blur-sm transition-colors hover:border-(--color-cyan)"
        aria-expanded={open}
      >
        <span aria-hidden="true">⚡</span>
        {t("toolsLauncher.button")}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="tools-launcher-panel"
            initial={{ opacity: 0, scale: 0.6, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 16 }}
            transition={{ type: "spring", stiffness: 460, damping: 18, mass: 0.7 }}
            className="fixed inset-x-4 bottom-20 z-[70] mx-auto max-w-xl sm:bottom-20 sm:left-5 sm:mx-0 sm:w-[380px]"
          >
            <div className="overflow-hidden rounded-sm border border-(--color-cyan)/40 bg-(--color-void)/95 backdrop-blur-md">
              <div className="flex items-center justify-between gap-4 border-b border-(--color-line) bg-(--color-panel-raised) px-4 py-3">
                <div>
                  <p className="font-display text-lg text-(--color-fg)">{t("toolsLauncher.title")}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-(--color-fg-dim)">
                    {t("toolsLauncher.subtitle")}
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="shrink-0 font-mono text-xs text-(--color-fg-faint) hover:text-(--color-red)"
                  aria-label={t("toolsLauncher.close")}
                >
                  ✕
                </button>
              </div>
              <div className="p-3">
                <AiToolsLaunchpad accent="var(--color-cyan)" onLaunch={() => setOpen(false)} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
