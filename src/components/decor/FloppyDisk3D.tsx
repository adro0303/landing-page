/**
 * Pure CSS 3D wireframe floppy disk, spinning on its vertical axis.
 * No canvas/WebGL — a real 6-face box (front/back/top/bottom/left/right)
 * built from `transform-style: preserve-3d`, matching this site's
 * hand-built (not off-the-shelf) approach to visuals elsewhere in the repo.
 *
 * A static rotateX tilt sits outside the spin so the top/bottom edges stay
 * partly visible through the loop instead of only ever showing edge-on —
 * that tilt is what reads as "box" instead of "flat card".
 */
const SIZE = 132; // px, footprint of the disk
const THICK = 26; // px, shell depth
const HALF = SIZE / 2;
const HALF_THICK = THICK / 2;

export function FloppyDisk3D({ color = "var(--color-cyan)" }: { color?: string }) {
  const glow = `drop-shadow(0 0 6px color-mix(in srgb, ${color} 55%, transparent))`;
  const shellBg = "color-mix(in srgb, var(--color-void) 85%, transparent)";
  const edgeBg = "color-mix(in srgb, var(--color-void) 60%, transparent)";

  return (
    <div
      className="mx-auto flex items-center justify-center py-2"
      style={{ height: SIZE + 40, perspective: "700px" }}
    >
      <div style={{ transformStyle: "preserve-3d", transform: "rotateX(22deg)" }}>
        <div
          className="floppy-spin relative"
          style={{ width: SIZE, height: SIZE, transformStyle: "preserve-3d", filter: glow }}
        >
          {/* front + back shell */}
          {[0, 180].map((rot) => (
            <div
              key={`face-${rot}`}
              className="absolute inset-0 border-2"
              style={{
                borderColor: color,
                background: shellBg,
                transform: `rotateY(${rot}deg) translateZ(${HALF_THICK}px)`,
                backfaceVisibility: "hidden",
              }}
            >
              {/* metal shutter */}
              <div
                className="absolute top-[8%] right-[14%] left-[14%] h-[46%] border-2"
                style={{ borderColor: color, opacity: 0.9 }}
              >
                <div
                  className="absolute inset-x-[18%] top-1/2 h-px -translate-y-1/2"
                  style={{ background: color, opacity: 0.7 }}
                />
              </div>
              {/* write-protect notch */}
              <div
                className="absolute top-[10%] left-[8%] h-[10%] w-[10%] border-2"
                style={{ borderColor: color, opacity: 0.85 }}
              />
              {/* label */}
              <div
                className="absolute right-[16%] bottom-[14%] left-[16%] flex h-[26%] flex-col items-center justify-center gap-1 border"
                style={{ borderColor: color, opacity: 0.55 }}
              >
                <span className="font-mono text-[7px] tracking-[0.15em] sm:text-[8px]" style={{ color }}>
                  A:\
                </span>
              </div>
            </div>
          ))}

          {/* left + right edges */}
          {[-90, 90].map((rot) => (
            <div
              key={`edge-x-${rot}`}
              className="absolute top-0 border-2"
              style={{
                left: HALF - HALF_THICK,
                width: THICK,
                height: SIZE,
                borderColor: color,
                background: edgeBg,
                opacity: 0.75,
                transform: `rotateY(${rot}deg) translateZ(${HALF}px)`,
              }}
            />
          ))}

          {/* top + bottom edges */}
          {[-90, 90].map((rot) => (
            <div
              key={`edge-y-${rot}`}
              className="absolute left-0 border-2"
              style={{
                top: HALF - HALF_THICK,
                width: SIZE,
                height: THICK,
                borderColor: color,
                background: edgeBg,
                opacity: 0.75,
                transform: `rotateX(${rot}deg) translateZ(${HALF}px)`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        .floppy-spin {
          animation: floppy-spin-y 9s linear infinite;
        }
        @keyframes floppy-spin-y {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
      `}</style>
    </div>
  );
}
