import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

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
 * 2) real proportions — a floppy is genuinely thin, so THICK stays a small
 *    fraction of SIZE rather than reading as a cube.
 *
 * Idle, it spins gently on its own. While hovered, rotation instead tracks
 * the pointer's horizontal *velocity* (px/s → deg/s), not its position —
 * drag right and it spins right roughly as fast as you're dragging, hold
 * the pointer still anywhere (including dead center) and it drifts to a
 * stop through friction, same as flicking a real disc. Everything is
 * eased through one rAF-driven angle, so the rate of turn can change but
 * the angle itself never jumps.
 */
const SIZE = 118; // px, footprint of the disk
const THICK = 5; // px, shell depth — a real floppy is genuinely thin
const HALF = SIZE / 2;
const HALF_THICK = THICK / 2;
const IDLE_SPEED = 18; // deg/s ambient spin when nothing is interacting
const MAX_SPEED = 640; // deg/s clamp for pointer-driven spin
const VELOCITY_TO_SPEED = 0.3; // deg/s per px/s of pointer travel
const EASE_RATE = 7; // how quickly angular speed eases toward its target
const IDLE_TIMEOUT_MS = 100; // pointer holds still this long before friction kicks in
const FRICTION_PER_FRAME = 0.85; // target-speed decay while the pointer is idle but still hovering

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
  const speedRef = useRef(IDLE_SPEED);
  const targetSpeedRef = useRef(IDLE_SPEED);
  const hoveringRef = useRef(false);
  const lastXRef = useRef<number | null>(null);
  const lastMoveTimeRef = useRef(0);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);

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
      // pointer stopped moving but is still hovering — bleed speed off
      // toward zero through "friction" instead of holding it forever
      if (hoveringRef.current && now - lastMoveTimeRef.current > IDLE_TIMEOUT_MS) {
        targetSpeedRef.current *= FRICTION_PER_FRAME;
      }
      speedRef.current += (targetSpeedRef.current - speedRef.current) * Math.min(1, dt * EASE_RATE);
      angleRef.current += speedRef.current * dt;
      if (spinRef.current) spinRef.current.style.transform = `rotateY(${angleRef.current}deg)`;
      raf = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(raf);
  }, []);

  const handlePointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    const now = performance.now();
    if (lastXRef.current !== null) {
      const dt = Math.max(0.001, (now - lastMoveTimeRef.current) / 1000);
      const velocity = (e.clientX - lastXRef.current) / dt; // px/s
      targetSpeedRef.current = Math.max(
        -MAX_SPEED,
        Math.min(MAX_SPEED, velocity * VELOCITY_TO_SPEED),
      );
    }
    lastXRef.current = e.clientX;
    lastMoveTimeRef.current = now;
  };
  const handlePointerEnter = () => {
    hoveringRef.current = true;
    lastXRef.current = null;
    setHovering(true);
  };
  const handlePointerLeave = () => {
    hoveringRef.current = false;
    lastXRef.current = null;
    targetSpeedRef.current = IDLE_SPEED;
    setHovering(false);
    setPressed(false);
  };

  // The glow (and its hover/press brightness) lives on the Stage element,
  // never on an element with transform-style: preserve-3d — CSS forces
  // `transform-style` to `flat` on any element a `filter` applies to, which
  // silently collapses 3D children onto one plane. Put filter here instead
  // and the box underneath stays genuinely three-dimensional.
  const brightness = pressed ? 1.55 : hovering ? 1.22 : 1;
  const stageFilter = `drop-shadow(0 0 10px color-mix(in srgb, ${color} 45%, transparent)) brightness(${brightness})`;

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
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      aria-label={onClick ? label : undefined}
      className={
        onClick
          ? "mx-auto flex w-full cursor-pointer flex-col items-center justify-center border-0 bg-transparent px-0 py-2 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-(--color-cyan)"
          : "mx-auto flex flex-col items-center justify-center py-2"
      }
      style={{ perspective: "550px", filter: stageFilter, transition: "filter 300ms ease" }}
    >
      <div style={{ transformStyle: "preserve-3d", transform: "rotateX(34deg) rotateZ(-6deg)" }}>
        <div
          ref={spinRef}
          className="relative"
          style={{ width: SIZE, height: SIZE, transformStyle: "preserve-3d" }}
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

          {/* left edge (mid-lit) — no border at this thickness, just fill:
              a 2px border on a 5px-deep strip would be almost all border */}
          <div
            className="absolute top-0"
            style={{
              left: HALF - HALF_THICK,
              width: THICK,
              height: SIZE,
              background: mix(color, 22),
              transform: `rotateY(-90deg) translateZ(${HALF}px)`,
            }}
          />
          {/* right edge (shadow side) */}
          <div
            className="absolute top-0"
            style={{
              left: HALF - HALF_THICK,
              width: THICK,
              height: SIZE,
              background: mix(color, 6),
              transform: `rotateY(90deg) translateZ(${HALF}px)`,
            }}
          />

          {/* top edge (brightest — catches the light from above) */}
          <div
            className="absolute left-0"
            style={{
              top: HALF - HALF_THICK,
              width: SIZE,
              height: THICK,
              background: mix(color, 38),
              transform: `rotateX(90deg) translateZ(${HALF}px)`,
            }}
          />
          {/* bottom edge (darkest) */}
          <div
            className="absolute left-0"
            style={{
              top: HALF - HALF_THICK,
              width: SIZE,
              height: THICK,
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
