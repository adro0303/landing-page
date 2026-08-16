import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { TerminalWindow } from "@/components/layout/TerminalWindow";

const ports = [
  {
    label: "GITHUB",
    value: `github.com/${profile.handle}`,
    href: profile.links.github,
    color: "var(--color-blue)",
  },
  {
    label: "LINKEDIN",
    value: "in/adrianpliegoperez",
    href: profile.links.linkedin,
    color: "var(--color-cyan)",
  },
  {
    label: "EMAIL",
    value: profile.links.email,
    href: `mailto:${profile.links.email}`,
    color: "var(--color-green)",
  },
];

export function Uplink() {
  return (
    <section id="uplink" className="relative bg-(--color-void) px-6 py-28 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-4xl">
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
          className="mb-12 font-display text-5xl text-(--color-fg) sm:text-6xl"
        >
          connect()
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <TerminalWindow title="uplink --establish">
            <p className="mb-6 font-mono text-sm leading-relaxed text-(--color-fg-dim)">
              <span className="text-(--color-green)">$</span> {profile.status}
              <br />
              <span className="text-(--color-fg-faint)">
                // always up for talking about a weird technical idea.
              </span>
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              {ports.map((port) => (
                <a
                  key={port.label}
                  href={port.href}
                  target={port.label === "EMAIL" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-2 border border-(--color-line) p-4 transition-colors hover:border-(--color-fg-dim)"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full transition-shadow"
                      style={{ background: port.color }}
                    />
                    <span className="font-mono text-[10px] tracking-[0.25em] text-(--color-fg-faint)">
                      {port.label}
                    </span>
                  </div>
                  <span
                    className="truncate font-mono text-sm transition-colors"
                    style={{ color: "var(--color-fg)" }}
                  >
                    {port.value}
                  </span>
                  <span
                    className="font-mono text-[11px] opacity-0 transition-opacity group-hover:opacity-100"
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
