import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";

/**
 * Pure CSS 3D floppy disk. No canvas/WebGL — a real 6-face box
 * (front/back/top/bottom/left/right) built from `transform-style:
 * preserve-3d`, matching this site's hand-built approach to visuals
 * elsewhere in the repo.
 *
 * Two things make a CSS box actually read as a box instead of a card:
 * 1) per-face shading (a uniform wireframe has no light cue, so the eye
 *    parses it as a flat outline regardless of the transform math) — each
 *    face here has its own fill brightness as if lit from the upper-left.
 * 2) real proportions: THICK is a large fraction of SIZE, not a sliver.
 *
 * Rotation is driven by rAF instead of a CSS @keyframes loop so hover can
 * smoothly ease the angular *speed* toward a target instead of snapping
 * any transform — nothing ever jumps between two states.
 */
const SIZE = 118; // px, footprint of the disk
const THICK = 46; // px, shell depth — a real fraction of SIZE, not a sliver
const HALF = SIZE / 2;
const HALF_THICK = THICK / 2;
const BASE_SPEED = 40; // deg/s at rest
const MAX_BOOST = 75; // deg/s added/subtracted at the pointer extremes
const EASE_RATE = 2.5; // how quickly speed eases toward its target

function mix(color: string, pct: number) {
  return `color-mix(in srgb, ${color} ${pct}%, var(--color-void))`;
}

export function FloppyDisk3D({
  color = "var(--color-cyan)",
  onClick,
  label,
}: {
  color?: string;
  onClick?: () => void;
  label?: string;
}) {
  const spinRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const speedRef = useRef(BASE_SPEED);
  const targetSpeedRef = useRef(BASE_SPEED);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      if (spinRef.current) spinRef.current.style.transform = "rotateY(24deg)";
      return;
    }

    let raf = requestAnimationFrame(tick);
    let last = performance.now();
    function tick(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      speedRef.current += (targetSpeedRef.current - speedRef.current) * Math.min(1, dt * EASE_RATE);
      angleRef.current += speedRef.current * dt;
      if (spinRef.current) spinRef.current.style.transform = `rotateY(${angleRef.current}deg)`;
      raf = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(raf);
  }, []);

  const handlePointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    targetSpeedRef.current = BASE_SPEED + Math.max(-1, Math.min(1, dx)) * MAX_BOOST;
  };
  const handlePointerLeave = () => {
    targetSpeedRef.current = BASE_SPEED;
  };

  const glow = `drop-shadow(0 0 10px color-mix(in srgb, ${color} 45%, transparent))`;

  const shutterAndLabel = (
    <>
      <div
        className="absolute top-[8%] right-[14%] left-[14%] h-[46%] border-2"
        style={{ borderColor: color, opacity: 0.9 }}
      >
        <div
          className="absolute inset-x-[18%] top-1/2 h-px -translate-y-1/2"
          style={{ background: color, opacity: 0.7 }}
        />
      </div>
      <div
        className="absolute top-[10%] left-[8%] h-[10%] w-[10%] border-2"
        style={{ borderColor: color, opacity: 0.85 }}
      />
      <div
        className="absolute right-[16%] bottom-[14%] left-[16%] flex h-[26%] flex-col items-center justify-center gap-1 border"
        style={{ borderColor: color, opacity: 0.6 }}
      >
        <span className="font-mono text-[7px] tracking-[0.15em] sm:text-[8px]" style={{ color }}>
          A:\
        </span>
      </div>
    </>
  );

  const Stage = onClick ? "button" : "div";

  return (
    <Stage
      type={onClick ? "button" : undefined}
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-label={onClick ? label : undefined}
      className={
        onClick
          ? "group mx-auto flex w-full cursor-pointer flex-col items-center justify-center border-0 bg-transparent px-0 py-2 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-(--color-cyan)"
          : "group mx-auto flex flex-col items-center justify-center py-2"
      }
      style={{ perspective: "550px" }}
    >
      <div
        className="transition-[filter] duration-300 group-hover:brightness-125 group-active:brightness-150"
        style={{ transformStyle: "preserve-3d", transform: "rotateX(34deg) rotateZ(-6deg)" }}
      >
        <div
          ref={spinRef}
          className="relative"
          style={{ width: SIZE, height: SIZE, transformStyle: "preserve-3d", filter: glow }}
        >
          {/* front (brightest — facing the implied light) */}
          <div
            className="absolute inset-0 overflow-hidden border-2"
            style={{
              borderColor: color,
              background: `linear-gradient(135deg, ${mix(color, 30)} 0%, ${mix(color, 14)} 60%, ${mix(color, 8)} 100%)`,
              transform: `translateZ(${HALF_THICK}px)`,
              backfaceVisibility: "hidden",
            }}
          >
            {shutterAndLabel}
            <div
              className="sheen absolute inset-0"
              style={{
                background:
                  "linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.35) 50%, transparent 65%)",
              }}
            />
          </div>

          {/* back (darkest) */}
          <div
            className="absolute inset-0 border-2"
            style={{
              borderColor: color,
              background: `linear-gradient(135deg, ${mix(color, 10)} 0%, ${mix(color, 4)} 100%)`,
              opacity: 0.85,
              transform: `rotateY(180deg) translateZ(${HALF_THICK}px)`,
              backfaceVisibility: "hidden",
            }}
          >
            {shutterAndLabel}
          </div>

          {/* left edge (mid-lit) */}
          <div
            className="absolute top-0 border-2"
            style={{
              left: HALF - HALF_THICK,
              width: THICK,
              height: SIZE,
              borderColor: color,
              background: mix(color, 20),
              transform: `rotateY(-90deg) translateZ(${HALF}px)`,
            }}
          />
          {/* right edge (shadow side) */}
          <div
            className="absolute top-0 border-2"
            style={{
              left: HALF - HALF_THICK,
              width: THICK,
              height: SIZE,
              borderColor: color,
              background: mix(color, 6),
              transform: `rotateY(90deg) translateZ(${HALF}px)`,
            }}
          />

          {/* top edge (brightest — catches the light from above) */}
          <div
            className="absolute left-0 border-2"
            style={{
              top: HALF - HALF_THICK,
              width: SIZE,
              height: THICK,
              borderColor: color,
              background: mix(color, 34),
              transform: `rotateX(90deg) translateZ(${HALF}px)`,
            }}
          />
          {/* bottom edge (darkest) */}
          <div
            className="absolute left-0 border-2"
            style={{
              top: HALF - HALF_THICK,
              width: SIZE,
              height: THICK,
              borderColor: color,
              background: mix(color, 3),
              transform: `rotateX(-90deg) translateZ(${HALF}px)`,
            }}
          />
        </div>
      </div>

      {/* grounding shadow — static, outside the 3D transform, sells "object resting in space" */}
      <div
        className="mt-3 h-3 w-24 rounded-[50%] blur-md"
        style={{ background: `color-mix(in srgb, ${color} 25%, transparent)` }}
      />

      <style>{`
        .sheen {
          animation: floppy-sheen 9s linear infinite;
        }
        @keyframes floppy-sheen {
          0%, 40% { transform: translateX(-120%); }
          60%, 100% { transform: translateX(120%); }
        }
      `}</style>
    </Stage>
  );
}
