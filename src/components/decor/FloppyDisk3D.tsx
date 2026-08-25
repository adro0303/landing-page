/**
 * Pure CSS 3D floppy disk, spinning on its vertical axis. No canvas/WebGL —
 * a real 6-face box (front/back/top/bottom/left/right) built from
 * `transform-style: preserve-3d`, matching this site's hand-built (not
 * off-the-shelf) approach to visuals elsewhere in the repo.
 *
 * A wireframe box with uniform faces reads as a flat outline no matter how
 * correct the geometry is — the eye parses depth from shading, not from
 * transform math. Each face here gets its own fill brightness as if lit
 * from the upper-left (front/top brightest, back/bottom darkest), plus a
 * soft grounding shadow beneath, which is what actually sells "object"
 * over "outline".
 */
const SIZE = 132; // px, footprint of the disk
const THICK = 30; // px, shell depth
const HALF = SIZE / 2;
const HALF_THICK = THICK / 2;

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
      aria-label={onClick ? label : undefined}
      className={
        onClick
          ? "group mx-auto flex w-full cursor-pointer flex-col items-center justify-center border-0 bg-transparent px-0 py-2 transition-transform duration-300 hover:scale-105 focus-visible:scale-105 focus-visible:outline-none"
          : "group mx-auto flex flex-col items-center justify-center py-2"
      }
      style={{ perspective: "550px" }}
    >
      <div
        className="transition-[filter] duration-300 group-hover:brightness-125"
        style={{ transformStyle: "preserve-3d", transform: "rotateX(30deg) rotateZ(-6deg)" }}
      >
        <div
          className="floppy-spin relative"
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
            <div className="sheen absolute inset-0" style={{ background: "linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.35) 50%, transparent 65%)" }} />
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
        .floppy-spin {
          animation: floppy-spin-y 9s linear infinite;
        }
        @keyframes floppy-spin-y {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
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
