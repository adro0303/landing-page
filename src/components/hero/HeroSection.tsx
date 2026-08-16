import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { useDeviceCapability } from "@/lib/useDeviceCapability";
import { useTypewriter } from "@/lib/useTypewriter";
import { HeroBackdrop } from "./HeroBackdrop";
import { AsciiFigure } from "./AsciiFigure";

export function HeroSection({ booted }: { booted: boolean }) {
  const capability = useDeviceCapability();
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [scanPct, setScanPct] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.15,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { output } = useTypewriter(profile.tagline, {
    speed: 34,
    startDelay: booted ? 250 : 2600,
    active: booted,
  });

  const active = inView && booted;
  const statusLine = scanPct > 2 ? `STATUS: SCANNING ${String(scanPct).padStart(2, "0")}%` : "STATUS: DORMANT";

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative flex h-[100svh] w-full flex-col overflow-hidden bg-(--color-phosphor-black)"
    >
      <div className="absolute inset-0">
        {capability.ready && (
          <HeroBackdrop animate={!capability.reducedMotion} active={active} />
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-(--color-phosphor-black) via-transparent to-(--color-phosphor-black)" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(color-mix(in srgb, var(--color-phosphor) 60%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--color-phosphor) 60%, transparent) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between px-5 pt-5 sm:px-8 sm:pt-6">
        <span className="font-mono text-[9px] tracking-[0.25em] text-(--color-phosphor-dim) sm:text-[10px]">
          ADRO_OS // TERMINAL.EXE
        </span>
        <span className="flex items-center gap-2 font-mono text-[9px] tracking-[0.25em] text-(--color-phosphor-dim) sm:text-[10px]">
          <span className="animate-blink h-1.5 w-1.5 rounded-full bg-(--color-phosphor)" />
          SYSTEM ACTIVE
        </span>
      </div>

      <div className="relative z-10 flex shrink-0 flex-col items-center px-6 pt-16 text-center sm:pt-20">
        <h1
          data-text="ADRIAN PLIEGO"
          className="glitch font-display text-glow-phosphor max-w-[94vw] text-balance text-[2.75rem] leading-[0.95] text-(--color-phosphor) sm:text-[4.5rem] md:text-[5.75rem] lg:text-[6.75rem]"
        >
          ADRIAN PLIEGO
        </h1>
        <p className="mt-2 font-mono text-xs tracking-[0.3em] text-(--color-phosphor-dim) sm:text-sm">
          [ id: {profile.handle} ]
        </p>
        <p className="mt-5 h-6 font-mono text-sm text-(--color-phosphor-bright) sm:text-base">
          {output}
          <span className="animate-blink">▌</span>
        </p>
        <p className="mt-3 max-w-md text-pretty font-mono text-[11px] text-(--color-phosphor-dim) sm:text-sm">
          {profile.role} — {profile.status}
        </p>
      </div>

      <div className="relative z-10 mt-4 min-h-0 flex-1 px-4 pb-2 sm:mt-6">
        <AsciiFigure
          active={active}
          reducedMotion={capability.reducedMotion}
          isTouch={capability.isTouch}
          tier={capability.tier}
          onScanChange={setScanPct}
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 px-5 pb-4 sm:px-8 sm:pb-6">
        <span className="hidden font-mono text-[9px] tracking-[0.2em] text-(--color-phosphor-dim) sm:inline">
          OBJECT.CLASS: MARBLE // GALLERIA.ACCADEMIA
        </span>
        <a
          href="#identity"
          className="group pointer-events-auto flex flex-col items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-(--color-phosphor-dim) transition-colors hover:text-(--color-phosphor)"
        >
          <span>SCROLL TO CONTINUE</span>
          <span className="animate-blink text-(--color-phosphor)">▼</span>
        </a>
        <span className="hidden font-mono text-[9px] tracking-[0.2em] text-(--color-phosphor-dim) sm:inline">
          {statusLine}
        </span>
      </div>
    </section>
  );
}
