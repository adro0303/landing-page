import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { useDeviceCapability } from "@/lib/useDeviceCapability";
import { useTypewriter } from "@/lib/useTypewriter";
import { HeroFallback } from "./HeroFallback";
import { AsciiFigure } from "./AsciiFigure";

const HeroScene = lazy(() => import("./HeroScene").then((m) => ({ default: m.HeroScene })));

export function HeroSection({ booted }: { booted: boolean }) {
  const capability = useDeviceCapability();
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

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

  const use3d = capability.ready && capability.tier === "high";

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-(--color-void)"
    >
      <div className="absolute inset-0">
        {capability.ready && use3d && (
          <Suspense fallback={<HeroFallback animate={!capability.reducedMotion} />}>
            <HeroScene active={inView && booted} />
          </Suspense>
        )}
        {capability.ready && !use3d && <HeroFallback animate={!capability.reducedMotion} />}
      </div>

      {capability.ready && (
        <AsciiFigure
          active={inView && booted}
          tier={capability.tier}
          reducedMotion={capability.reducedMotion}
          isTouch={capability.isTouch}
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-(--color-void) via-transparent to-(--color-void)/40" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <p className="mb-3 font-mono text-[11px] tracking-[0.35em] text-(--color-fg-dim) sm:text-xs">
          ADRO_OS // BOOT.INTERFACE
        </p>
        <h1
          data-text="ADRIÁN PLIEGO"
          className="glitch font-display text-glow-blue max-w-[92vw] text-balance text-[2.6rem] leading-[0.95] text-(--color-blue) sm:text-[4.25rem] md:text-[5.75rem] lg:text-[7rem]"
        >
          ADRIÁN PLIEGO
        </h1>
        <p className="mt-2 font-mono text-sm tracking-[0.15em] text-(--color-fg-dim) sm:text-base">
          @{profile.handle}
        </p>
        <p className="mt-6 h-6 font-mono text-base text-(--color-cyan) sm:text-lg">
          {output}
          <span className="animate-blink">▌</span>
        </p>
        <p className="mt-4 max-w-md text-pretty font-mono text-xs text-(--color-fg-dim) sm:text-sm">
          {profile.role} — {profile.status}
        </p>
      </div>

      <a
        href="#identity"
        className="group absolute bottom-8 z-10 flex flex-col items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-(--color-fg-dim) transition-colors hover:text-(--color-blue)"
      >
        <span>SCROLL TO CONTINUE</span>
        <span className="animate-blink text-(--color-blue)">▼</span>
      </a>
    </section>
  );
}
