import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { TerminalWindow } from "@/components/layout/TerminalWindow";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

const PIPELINE = ["idea", "design", "build", "ai", "test", "production"] as const;
const FEATURES = ["assistant", "crm", "permissions", "data", "team"] as const;

export function CurrentFocus() {
  const { t } = useLanguage();
  const [openFeature, setOpenFeature] = useState<(typeof FEATURES)[number] | null>(null);

  return (
    <section id="current" className="relative bg-(--color-void) px-6 py-24 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="mb-3 font-mono text-xs tracking-[0.35em] text-(--color-blue)"
        >
          {t("current.eyebrow")}
        </motion.p>
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="mb-4 font-display text-5xl text-(--color-fg) sm:text-6xl"
        >
          {t("current.title")}
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 max-w-xl font-mono text-sm text-(--color-fg-dim)"
        >
          {t("current.subtitle")}
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-6"
        >
          <TerminalWindow title="authect --pipeline" accent="var(--color-green)">
            <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
              {PIPELINE.map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <span
                    className={`shrink-0 rounded-sm border px-2.5 py-1.5 font-mono text-[10px] tracking-[0.15em] sm:text-[11px] ${
                      step === "ai"
                        ? "border-(--color-magenta) text-(--color-magenta)"
                        : "border-(--color-line) text-(--color-fg-dim)"
                    }`}
                  >
                    {t(`current.pipeline.${step}`)}
                  </span>
                  {i < PIPELINE.length - 1 && (
                    <span className="shrink-0 text-(--color-fg-faint)">→</span>
                  )}
                </div>
              ))}
            </div>
          </TerminalWindow>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="mb-3 font-mono text-[11px] tracking-[0.15em] text-(--color-fg-faint)">
            {t("current.featuresHint")}
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {FEATURES.map((key) => {
              const open = openFeature === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setOpenFeature(open ? null : key)}
                  aria-expanded={open}
                  className={`rounded-sm border p-4 text-left font-mono transition-colors ${
                    open
                      ? "border-(--color-green) bg-(--color-green)/10"
                      : "border-(--color-line) bg-(--color-panel)/70 hover:border-(--color-fg-dim)"
                  }`}
                >
                  <span className="block text-sm text-(--color-fg)">
                    {t(`current.features.${key}.label`)}
                  </span>
                  <span
                    className={`mt-2 block text-[12px] leading-relaxed text-(--color-fg-dim) transition-[grid-template-rows] ${
                      open ? "" : "hidden"
                    }`}
                  >
                    {t(`current.features.${key}.text`)}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
