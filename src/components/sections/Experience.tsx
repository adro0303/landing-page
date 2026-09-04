import { motion } from "framer-motion";
import { experienceEntries, localizeExperience } from "@/data/experience";
import { TechIcon } from "@/components/sections/TechIcon";
import { TerminalWindow } from "@/components/layout/TerminalWindow";
import { useLanguage } from "@/lib/i18n";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

export function Experience() {
  const { t, lang } = useLanguage();

  return (
    <section id="experience" className="relative bg-(--color-void) px-6 py-28 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="mb-3 font-mono text-xs tracking-[0.35em] text-(--color-blue)"
        >
          {t("experience.eyebrow")}
        </motion.p>
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="mb-4 font-display text-5xl text-(--color-fg) sm:text-6xl"
        >
          experience.log
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-16 max-w-xl font-mono text-sm text-(--color-fg-dim)"
        >
          {t("experience.description")}
        </motion.p>

        <div className="relative pl-6 sm:pl-8">
          <div className="absolute top-2 bottom-2 left-[3px] w-px bg-(--color-line) sm:left-[7px]" />

          <div className="flex flex-col gap-6">
            {experienceEntries.map((raw, i) => {
              const entry = localizeExperience(raw, lang);
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative"
                >
                  <span
                    className="absolute top-6 -left-6 h-2 w-2 -translate-x-1/2 rounded-full sm:-left-8"
                    style={{ background: entry.color }}
                  />
                  <TerminalWindow title={`${entry.company} — ${entry.period}`} accent={entry.color}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <p className="font-display text-xl text-(--color-fg) sm:text-2xl" style={{ color: entry.color }}>
                        {entry.role}
                      </p>
                      <p className="font-mono text-xs text-(--color-fg-dim)">{entry.location}</p>
                    </div>
                    <ul className="mt-3 space-y-2 font-mono text-[13px] leading-relaxed text-(--color-fg-dim) sm:text-sm">
                      {entry.bullets.map((line) => (
                        <li key={line} className="flex gap-2">
                          <span style={{ color: entry.color }}>▸</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                    {entry.tech.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {entry.tech.map((item) => (
                          <span
                            key={item}
                            className="flex items-center gap-1.5 rounded-sm border border-(--color-line) px-2.5 py-1 font-mono text-[11px] text-(--color-fg-dim)"
                          >
                            <TechIcon item={item} className="h-3.5 w-3.5 shrink-0" />
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </TerminalWindow>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
