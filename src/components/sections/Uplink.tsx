import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile, useProfileText } from "@/data/profile";
import { useLanguage } from "@/lib/i18n";
import { TerminalWindow } from "@/components/layout/TerminalWindow";

const ports = [
  {
    label: "GITHUB",
    value: `github.com/${profile.handle}`,
    href: profile.links.github,
    color: "var(--color-blue)",
    glow: "text-glow-blue",
    glyph: "</>",
  },
  {
    label: "LINKEDIN",
    value: "in/adrianpliegoperez",
    href: profile.links.linkedin,
    color: "var(--color-cyan)",
    glow: "text-glow-cyan",
    glyph: "in",
  },
  {
    label: "EMAIL",
    value: profile.links.email,
    href: `mailto:${profile.links.email}`,
    color: "var(--color-green)",
    glow: "text-glow-green",
    glyph: "@",
  },
];

export function Uplink() {
  const text = useProfileText();
  const { t, lang } = useLanguage();
  const [cvPickerOpen, setCvPickerOpen] = useState(false);

  useEffect(() => {
    if (!cvPickerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCvPickerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cvPickerOpen]);

  return (
    <section id="uplink" className="relative bg-(--color-void) px-6 py-32 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-3 font-mono text-xs tracking-[0.35em] text-(--color-blue)"
        >
          {t("uplink.eyebrow")}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="mb-14 font-display text-5xl text-(--color-fg) sm:text-6xl lg:text-7xl"
        >
          connect()
        </motion.h2>

        {profile.resumeUrls && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="mb-6"
          >
            <TerminalWindow title="cat ~/resume.pdf" accent="var(--color-amber)">
              <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-mono text-sm text-(--color-fg-dim)">
                    <span className="text-(--color-green)">$</span> file resume.pdf
                  </p>
                  <p className="mt-1 font-mono text-sm text-(--color-fg)">
                    {t("uplink.resumeCaption")}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-3">
                  <a
                    href={profile.resumeUrls[lang]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-(--color-amber) px-4 py-2 font-mono text-xs tracking-[0.15em] text-(--color-amber) transition-colors hover:bg-(--color-amber)/10"
                  >
                    {t("uplink.viewCv")}
                  </a>
                  {lang === "en" ? (
                    <a
                      href={profile.resumeUrls.en}
                      download
                      className="border border-(--color-line) px-4 py-2 font-mono text-xs tracking-[0.15em] text-(--color-fg-dim) transition-colors hover:border-(--color-fg-dim) hover:text-(--color-fg)"
                    >
                      {t("uplink.downloadCv")} ↓
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setCvPickerOpen(true)}
                      aria-haspopup="dialog"
                      className="border border-(--color-line) px-4 py-2 font-mono text-xs tracking-[0.15em] text-(--color-fg-dim) transition-colors hover:border-(--color-fg-dim) hover:text-(--color-fg)"
                    >
                      {t("uplink.downloadCv")} ↓
                    </button>
                  )}
                </div>
              </div>
            </TerminalWindow>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <TerminalWindow title="uplink --establish">
            <p className="mb-10 font-mono text-base leading-relaxed text-(--color-fg-dim)">
              <span className="text-(--color-green)">$</span> {text.status}
              <br />
              <span className="text-(--color-fg-faint)">{t("uplink.talkNote")}</span>
            </p>

            <div className="grid gap-6 sm:grid-cols-3">
              {ports.map((port) => (
                <a
                  key={port.label}
                  href={port.href}
                  target={port.label === "EMAIL" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-5 border border-(--color-line) p-7 transition-colors hover:border-(--color-fg-dim) sm:p-8"
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center border font-mono text-lg font-bold transition-colors sm:h-16 sm:w-16 sm:text-xl ${port.glow}`}
                    style={{ borderColor: port.color, color: port.color }}
                  >
                    {port.glyph}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full transition-shadow"
                      style={{ background: port.color }}
                    />
                    <span className="font-mono text-[11px] tracking-[0.25em] text-(--color-fg-faint)">
                      {port.label}
                    </span>
                  </div>
                  <span
                    className="truncate font-mono text-base transition-colors sm:text-lg"
                    style={{ color: "var(--color-fg)" }}
                  >
                    {port.value}
                  </span>
                  <span
                    className="font-mono text-xs opacity-0 transition-opacity group-hover:opacity-100"
                    style={{ color: port.color }}
                  >
                    {t("uplink.connect")}
                  </span>
                </a>
              ))}
            </div>
          </TerminalWindow>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 text-center font-mono text-[11px] tracking-[0.2em] text-(--color-fg-faint)"
        >
          {t("uplink.footer")
            .split("~")
            .map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && <span className="text-(--color-blue)">~</span>}
              </span>
            ))}
        </motion.p>
      </div>

      <AnimatePresence>
        {cvPickerOpen && profile.resumeUrls && (
          <motion.div
            key="cv-picker-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-(--color-void)/80 backdrop-blur-sm"
            onClick={() => setCvPickerOpen(false)}
          >
            <motion.div
              key="cv-picker-panel"
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 12 }}
              transition={{ type: "spring", stiffness: 460, damping: 22, mass: 0.7 }}
              onClick={(e) => e.stopPropagation()}
              className="w-[90vw] max-w-[700px] overflow-hidden rounded-sm border border-(--color-amber)/40 bg-(--color-void)/95"
            >
              <div className="flex items-center justify-between gap-4 border-b border-(--color-line) bg-(--color-panel-raised) px-8 py-6">
                <p className="font-mono text-lg tracking-[0.15em] text-(--color-fg)">
                  {t("uplink.pickLanguage")}
                </p>
                <button
                  onClick={() => setCvPickerOpen(false)}
                  className="shrink-0 font-mono text-xl text-(--color-fg-faint) hover:text-(--color-red)"
                  aria-label={t("toolsLauncher.close")}
                >
                  ✕
                </button>
              </div>
              <div className="flex flex-col gap-4 p-8">
                <a
                  href={profile.resumeUrls.en}
                  download
                  onClick={() => setCvPickerOpen(false)}
                  className="border border-(--color-line) px-8 py-6 text-center font-mono text-2xl text-(--color-fg-dim) transition-colors hover:border-(--color-amber) hover:bg-(--color-amber) hover:text-(--color-void) focus-visible:border-(--color-amber) focus-visible:bg-(--color-amber) focus-visible:text-(--color-void)"
                >
                  English ↓
                </a>
                <a
                  href={profile.resumeUrls.es}
                  download
                  onClick={() => setCvPickerOpen(false)}
                  className="border border-(--color-line) px-8 py-6 text-center font-mono text-2xl text-(--color-fg-dim) transition-colors hover:border-(--color-amber) hover:bg-(--color-amber) hover:text-(--color-void) focus-visible:border-(--color-amber) focus-visible:bg-(--color-amber) focus-visible:text-(--color-void)"
                >
                  Español ↓
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
