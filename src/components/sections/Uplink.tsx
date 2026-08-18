import { motion } from "framer-motion";
import { profile } from "@/data/profile";
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
          04 // UPLINK
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

        {profile.resumeUrl && (
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
                    One-page CV — role, stack, and shipped work.
                  </p>
                </div>
                <div className="flex shrink-0 gap-3">
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-(--color-amber) px-4 py-2 font-mono text-xs tracking-[0.15em] text-(--color-amber) transition-colors hover:bg-(--color-amber)/10"
                  >
                    VIEW CV
                  </a>
                  <a
                    href={profile.resumeUrl}
                    download
                    className="border border-(--color-line) px-4 py-2 font-mono text-xs tracking-[0.15em] text-(--color-fg-dim) transition-colors hover:border-(--color-fg-dim) hover:text-(--color-fg)"
                  >
                    DOWNLOAD ↓
                  </a>
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
              <span className="text-(--color-green)">$</span> {profile.status}
              <br />
              <span className="text-(--color-fg-faint)">
                // always up for talking about a weird technical idea.
              </span>
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
                    connect →
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
          ADRO_OS — session end. press <span className="text-(--color-blue)">~</span> for a hidden shell.
        </motion.p>
      </div>
    </section>
  );
}
