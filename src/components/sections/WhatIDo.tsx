import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

function SoftwareViz({ color }: { color: string }) {
  const layers = [0, 1, 2];
  return (
    <svg viewBox="0 0 120 80" className="h-20 w-full" fill="none">
      {layers.map((i) => (
        <rect
          key={i}
          x="14"
          y={14 + i * 20}
          width="92"
          height="12"
          rx="2"
          fill="none"
          stroke={color}
          strokeOpacity={0.35 + i * 0.15}
          strokeWidth={1.4}
        />
      ))}
      <line x1="20" y1="10" x2="20" y2="66" stroke={color} strokeOpacity={0.3} strokeWidth={1} />
      <circle r="2.4" fill={color}>
        <animateMotion dur="3.4s" repeatCount="indefinite" path="M20,10 L20,66" />
      </circle>
    </svg>
  );
}

function AiViz({ color }: { color: string }) {
  const inputs: [number, number][] = [
    [16, 18],
    [16, 40],
    [16, 62],
  ];
  const hub: [number, number] = [60, 40];
  const outputs: [number, number][] = [
    [104, 24],
    [104, 56],
  ];
  return (
    <svg viewBox="0 0 120 80" className="h-20 w-full" fill="none">
      {inputs.map(([x, y], i) => (
        <line key={`i${i}`} x1={x} y1={y} x2={hub[0]} y2={hub[1]} stroke={color} strokeOpacity={0.3} strokeWidth={1} />
      ))}
      {outputs.map(([x, y], i) => (
        <line key={`o${i}`} x1={hub[0]} y1={hub[1]} x2={x} y2={y} stroke={color} strokeOpacity={0.3} strokeWidth={1} />
      ))}
      {inputs.map(([x, y], i) => (
        <circle key={`ic${i}`} cx={x} cy={y} r="4" fill="var(--color-void)" stroke={color} strokeWidth={1.4} />
      ))}
      {outputs.map(([x, y], i) => (
        <circle key={`oc${i}`} cx={x} cy={y} r="4" fill="var(--color-void)" stroke={color} strokeWidth={1.4} />
      ))}
      <circle cx={hub[0]} cy={hub[1]} r="7" fill="var(--color-void)" stroke={color} strokeWidth={1.6} className="animate-pulse" />
      {[0, 1, 2].map((i) => (
        <circle key={i} r="2" fill={color}>
          <animateMotion
            dur="2.2s"
            begin={`${i * 0.5}s`}
            repeatCount="indefinite"
            path={`M${inputs[i][0]},${inputs[i][1]} L${hub[0]},${hub[1]}`}
          />
        </circle>
      ))}
    </svg>
  );
}

function LeadershipViz({ color }: { color: string }) {
  const team: [number, number][] = [
    [60, 16],
    [22, 40],
    [98, 40],
    [60, 64],
  ];
  return (
    <svg viewBox="0 0 120 80" className="h-20 w-full" fill="none">
      {team.slice(1).map(([x, y], i) => (
        <line key={i} x1={team[0][0]} y1={team[0][1]} x2={x} y2={y} stroke={color} strokeOpacity={0.3} strokeWidth={1} />
      ))}
      {team.slice(1).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill="var(--color-void)" stroke={color} strokeOpacity={0.6} strokeWidth={1.4} />
      ))}
      <circle cx={team[0][0]} cy={team[0][1]} r="7" fill={color} className="animate-pulse" opacity={0.85} />
    </svg>
  );
}

export function WhatIDo() {
  const { t } = useLanguage();

  const blocks = [
    { key: "software", color: "var(--color-blue)", Viz: SoftwareViz },
    { key: "ai", color: "var(--color-magenta)", Viz: AiViz },
    { key: "leadership", color: "var(--color-amber)", Viz: LeadershipViz },
  ] as const;

  return (
    <section id="whatido" className="relative bg-(--color-void) px-6 py-24 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="mb-3 font-mono text-xs tracking-[0.35em] text-(--color-blue)"
        >
          {t("whatido.eyebrow")}
        </motion.p>
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="mb-4 font-display text-5xl text-(--color-fg) sm:text-6xl"
        >
          {t("whatido.title")}
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12 max-w-xl font-mono text-sm text-(--color-fg-dim)"
        >
          {t("whatido.description")}
        </motion.p>

        <div className="grid gap-6 sm:grid-cols-3">
          {blocks.map(({ key, color, Viz }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="border border-(--color-line) bg-(--color-panel)/70 p-5 backdrop-blur-sm"
              style={{ boxShadow: `0 0 0 1px color-mix(in srgb, ${color} 12%, transparent)` }}
            >
              <Viz color={color} />
              <p className="mt-4 font-mono text-xs tracking-[0.3em]" style={{ color }}>
                {t(`whatido.${key}.label`)}
              </p>
              <p className="mt-2 font-mono text-[13px] leading-relaxed text-(--color-fg-dim) sm:text-sm">
                {t(`whatido.${key}.text`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
