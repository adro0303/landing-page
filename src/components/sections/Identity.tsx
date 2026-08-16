import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { TerminalWindow } from "@/components/layout/TerminalWindow";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0 },
};

export function Identity() {
  return (
    <section id="identity" className="relative bg-(--color-void) px-6 py-28 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="mb-3 font-mono text-xs tracking-[0.35em] text-(--color-blue)"
        >
          01 // IDENTITY
        </motion.p>
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="mb-12 font-display text-5xl text-(--color-fg) sm:text-6xl"
        >
          whoami
        </motion.h2>

        <div className="grid gap-6 lg:grid-cols-5">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <TerminalWindow title="adrian@adro0303: ~">
              <div className="space-y-4 font-mono text-sm leading-relaxed sm:text-[15px]">
                <div>
                  <p className="text-(--color-fg-dim)">
                    <span className="text-(--color-green)">$</span> whoami
                  </p>
                  <p className="mt-1 text-(--color-fg)">{profile.headline}</p>
                </div>
                <div>
                  <p className="text-(--color-fg-dim)">
                    <span className="text-(--color-green)">$</span> cat bio.txt
                  </p>
                  <p className="mt-1 text-(--color-fg)">{profile.bio}</p>
                </div>
                <div>
                  <p className="text-(--color-fg-dim)">
                    <span className="text-(--color-green)">$</span> cat education.log
                  </p>
                  <p className="mt-1 text-(--color-cyan)">{profile.education}</p>
                </div>
                <div>
                  <p className="text-(--color-fg-dim)">
                    <span className="text-(--color-green)">$</span> cat status.flag
                  </p>
                  <p className="mt-1 text-(--color-amber)">{profile.status}</p>
                </div>
                <div>
                  <p className="text-(--color-fg-dim)">
                    <span className="text-(--color-green)">$</span> echo $MOTTO
                  </p>
                  <p className="mt-1 text-(--color-magenta)">"{profile.motto}"</p>
                </div>
              </div>
            </TerminalWindow>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="lg:col-span-2"
          >
            <TerminalWindow title="cat engineering_mindset.log" accent="var(--color-magenta)">
              <ul className="space-y-3 font-mono text-[13px] leading-relaxed text-(--color-fg-dim) sm:text-sm">
                {profile.mindset.map((line, i) => (
                  <motion.li
                    key={line}
                    initial={{ opacity: 0, x: 14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                    className="flex gap-2"
                  >
                    <span className="text-(--color-magenta)">&gt;</span>
                    <span>{line}</span>
                  </motion.li>
                ))}
              </ul>
            </TerminalWindow>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="mt-6"
        >
          <TerminalWindow title="ls ~/focus" accent="var(--color-green)">
            <div className="grid gap-3 sm:grid-cols-2">
              {profile.focus.map((line, i) => {
                const [label, desc] = line.split(" — ");
                return (
                  <motion.div
                    key={line}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
                    className="border-l-2 border-(--color-line) pl-3"
                  >
                    <p className="font-mono text-sm text-(--color-fg)">{label}</p>
                    <p className="font-mono text-xs text-(--color-fg-dim)">{desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </TerminalWindow>
        </motion.div>
      </div>
    </section>
  );
}
