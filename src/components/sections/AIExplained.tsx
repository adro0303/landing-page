import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { TerminalWindow } from "@/components/layout/TerminalWindow";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

const FLOW = ["user", "understand", "check", "permissions", "answer"] as const;
const UNDER_THE_HOOD = [
  "LLMs",
  "Backend APIs",
  "Structured data",
  "Permissions",
  "Grounding",
  "Prompt design",
  "Validation",
];

export function AIExplained() {
  const { t } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <section id="ai" className="relative bg-(--color-void) px-6 py-24 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="mb-3 font-mono text-xs tracking-[0.35em] text-(--color-blue)"
        >
          {t("ai.eyebrow")}
        </motion.p>
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="mb-4 font-display text-5xl text-(--color-fg) sm:text-6xl"
        >
          {t("ai.title")}
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 max-w-xl font-mono text-sm text-(--color-fg-dim)"
        >
          {t("ai.description")}
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <TerminalWindow title="assistant --trace" accent="var(--color-magenta)">
            <div className="flex flex-col gap-0">
              {FLOW.map((step, i) => (
                <div key={step} className="relative flex items-center gap-3 pb-4 pl-1 last:pb-0">
                  {i < FLOW.length - 1 && (
                    <span className="absolute top-5 left-[11px] h-full w-px bg-(--color-line)" />
                  )}
                  <span
                    className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 font-mono text-[10px] ${
                      i === FLOW.length - 1
                        ? "border-(--color-magenta) bg-(--color-magenta)/20 text-(--color-magenta)"
                        : "border-(--color-line) text-(--color-fg-dim)"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="font-mono text-[13px] text-(--color-fg) sm:text-sm">
                    {t(`ai.flow.${step}`)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-(--color-line) pt-4">
              <button
                type="button"
                onClick={() => setShowDetails((v) => !v)}
                aria-expanded={showDetails}
                className="font-mono text-[11px] tracking-[0.15em] text-(--color-fg-faint) transition-colors hover:text-(--color-fg-dim)"
              >
                {showDetails ? `[ − ${t("ai.hideDetails")} ]` : `[ + ${t("ai.showDetails")} ]`}
              </button>
              <AnimatePresence initial={false}>
                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="mt-3 mb-2 font-mono text-[10px] tracking-[0.25em] text-(--color-fg-faint)">
                      {t("ai.underTheHood")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {UNDER_THE_HOOD.map((item) => (
                        <span
                          key={item}
                          className="rounded-sm border border-(--color-line) px-2.5 py-1 font-mono text-[11px] text-(--color-fg-dim)"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </TerminalWindow>
        </motion.div>
      </div>
    </section>
  );
}
