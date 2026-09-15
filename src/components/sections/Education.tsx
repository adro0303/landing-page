import { motion } from "framer-motion";
import { educationEntries, certificationEntries } from "@/data/education";
import { TerminalWindow } from "@/components/layout/TerminalWindow";
import { useLanguage } from "@/lib/i18n";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

export function Education() {
  const { t, lang } = useLanguage();

  return (
    <section id="education" className="relative bg-(--color-void) px-6 py-28 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="mb-3 font-mono text-xs tracking-[0.35em] text-(--color-blue)"
        >
          {t("education.eyebrow")}
        </motion.p>
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="mb-4 font-display text-5xl text-(--color-fg) sm:text-6xl"
        >
          education.log
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-16 max-w-xl font-mono text-sm text-(--color-fg-dim)"
        >
          {t("education.description")}
        </motion.p>

        <div className="grid gap-6 sm:grid-cols-2">
          {educationEntries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <TerminalWindow title={`${entry.institution} — ${entry.period}`} accent={entry.color}>
                {entry.image && (
                  <a
                    href={entry.credential.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative mb-4 block overflow-hidden rounded-sm border border-(--color-line)"
                  >
                    <img
                      src={entry.image}
                      alt={entry.degree[lang]}
                      className="w-full transition-opacity hover:opacity-80"
                    />
                    <span
                      className="animate-scan pointer-events-none absolute inset-x-0 h-[35%]"
                      style={{
                        background: `linear-gradient(to bottom, transparent 0%, color-mix(in srgb, ${entry.color} 15%, transparent) 25%, color-mix(in srgb, ${entry.color} 70%, transparent) 50%, color-mix(in srgb, ${entry.color} 15%, transparent) 75%, transparent 100%)`,
                      }}
                    />
                  </a>
                )}
                <p className="font-display text-lg text-(--color-fg) sm:text-xl" style={{ color: entry.color }}>
                  {entry.degree[lang]}
                </p>
                <p className="mt-3 font-mono text-[13px] leading-relaxed text-(--color-fg-dim) sm:text-sm">
                  {entry.detail[lang]}
                </p>
                <a
                  href={entry.credential.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block font-mono text-xs tracking-[0.1em] transition-opacity hover:opacity-70"
                  style={{ color: entry.color }}
                >
                  {entry.credential.label[lang]}
                </a>
              </TerminalWindow>
            </motion.div>
          ))}
        </div>

        {certificationEntries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-6"
          >
            <TerminalWindow title="cat certifications.txt">
              <div className="flex flex-col gap-4">
                {certificationEntries.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2"
                  >
                    <div>
                      <p className="font-mono text-sm text-(--color-fg)" style={{ color: cert.color }}>
                        {cert.name}{" "}
                        <span className="text-(--color-fg-faint)">— {cert.date}</span>
                      </p>
                      <p className="font-mono text-[13px] text-(--color-fg-dim)">{cert.detail[lang]}</p>
                    </div>
                    <a
                      href={cert.credential.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 font-mono text-xs tracking-[0.1em] transition-opacity hover:opacity-70"
                      style={{ color: cert.color }}
                    >
                      {cert.credential.label[lang]}
                    </a>
                  </div>
                ))}
              </div>
            </TerminalWindow>
          </motion.div>
        )}
      </div>
    </section>
  );
}
