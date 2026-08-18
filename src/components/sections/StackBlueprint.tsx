import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { stackCategories } from "@/data/stack";
import { TechIcon } from "@/components/sections/TechIcon";

const ICON_SIZES = ["h-8 w-8", "h-12 w-12", "h-9 w-9", "h-7 w-7", "h-10 w-10", "h-8 w-8"];

function ToolConstellation({ items, color }: { items: string[]; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="hidden items-center md:flex"
    >
      <div className="grid w-full grid-cols-3 items-center gap-x-6 gap-y-8 px-8">
        {items.slice(0, 6).map((item, i) => (
          <span
            key={item}
            className={`${ICON_SIZES[i % ICON_SIZES.length]} ${i % 2 === 0 ? "justify-self-start" : "justify-self-end"} text-(--accent)`}
            style={{ "--accent": color, opacity: 0.3 + ((i * 7) % 4) * 0.12 } as CSSProperties}
          >
            <TechIcon item={item} className="h-full w-full" />
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function StackBlueprint() {
  return (
    <section id="stack" className="relative overflow-hidden bg-(--color-void) px-6 py-28 sm:px-10 lg:px-20">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-3 font-mono text-xs tracking-[0.35em] text-(--color-blue)"
        >
          02 // SYSTEM STACK
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="mb-4 font-display text-5xl text-(--color-fg) sm:text-6xl"
        >
          blueprint.sys
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-16 max-w-xl font-mono text-sm text-(--color-fg-dim)"
        >
          Modules currently loaded on the system bus — grouped by what they're for, not
          alphabetized for show.
        </motion.p>

        <div className="relative">
          <div className="absolute top-0 bottom-0 left-1/2 hidden w-px -translate-x-1/2 bg-(--color-line) md:block" />

          <div className="flex flex-col gap-6 md:gap-10">
            {stackCategories.map((cat, i) => {
              const alignRight = i % 2 === 1;
              return (
                <div key={cat.id} className="relative md:grid md:grid-cols-2 md:items-center md:gap-10">
                  <motion.div
                    initial={{ opacity: 0, x: alignRight ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.55 }}
                    className={alignRight ? "md:col-start-2" : "md:col-start-1"}
                  >
                    <div
                      className="border border-(--color-line) bg-(--color-panel)/70 p-5 backdrop-blur-sm"
                      style={{ boxShadow: `0 0 0 1px color-mix(in srgb, ${cat.color} 10%, transparent)` }}
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <span
                          className="h-2 w-2 shrink-0 animate-pulse rounded-full"
                          style={{ background: cat.color }}
                        />
                        <p className="font-mono text-[11px] tracking-[0.25em] text-(--color-fg-dim)">
                          {cat.prompt}
                        </p>
                      </div>
                      <p
                        className="mb-4 font-display text-2xl tracking-wide"
                        style={{ color: cat.color }}
                      >
                        {cat.label}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {cat.items.map((item, itemIndex) => (
                          <motion.span
                            key={item}
                            initial={{ opacity: 0, y: 8, scale: 0.94 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.35, delay: 0.15 + itemIndex * 0.05 }}
                            whileHover={{ y: -2 }}
                            className="group/badge flex items-center gap-2 rounded-sm border border-(--color-line) px-3 py-2 font-mono text-xs text-(--color-fg) transition-colors hover:border-(--accent)"
                            style={{ "--accent": cat.color } as CSSProperties}
                          >
                            <TechIcon
                              item={item}
                              className="h-5 w-5 shrink-0 text-(--color-fg-faint) transition-colors group-hover/badge:text-(--accent)"
                            />
                            {item}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  <div className={alignRight ? "md:col-start-1 md:row-start-1" : "md:col-start-2 md:row-start-1"}>
                    <ToolConstellation items={cat.items} color={cat.color} />
                  </div>

                  <div
                    className="absolute top-1/2 left-1/2 hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border md:block"
                    style={{ borderColor: cat.color, background: "var(--color-void)" }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
