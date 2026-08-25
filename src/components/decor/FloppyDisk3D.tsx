/**
 * Pure CSS 3D wireframe floppy disk, spinning on its vertical axis.
 * No canvas/WebGL — built from a handful of absolutely-positioned faces
 * inside a `transform-style: preserve-3d` stage, matching this site's
 * hand-built (not off-the-shelf) approach to visuals elsewhere in the repo.
 */
export function FloppyDisk3D({ color = "var(--color-cyan)" }: { color?: string }) {
  const glow = `drop-shadow(0 0 6px color-mix(in srgb, ${color} 55%, transparent))`;

  return (
    <div
      className="mx-auto flex h-40 w-40 items-center justify-center sm:h-48 sm:w-48"
      style={{ perspective: "900px" }}
    >
      <div
        className="floppy-spin relative h-28 w-28 sm:h-32 sm:w-32"
        style={{ transformStyle: "preserve-3d", filter: glow }}
      >
        {/* front + back shell */}
        {[0, 180].map((rot) => (
          <div
            key={rot}
            className="absolute inset-0 border-2"
            style={{
              borderColor: color,
              background: "color-mix(in srgb, var(--color-void) 88%, transparent)",
              transform: `rotateY(${rot}deg) translateZ(6px)`,
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
              <span
                className="font-mono text-[7px] tracking-[0.15em] sm:text-[8px]"
                style={{ color }}
              >
                A:\
              </span>
            </div>
          </div>
        ))}

        {/* four thin edge faces, giving the shell a sense of thickness */}
        {[
          { rot: 90, axis: "Y" },
          { rot: -90, axis: "Y" },
        ].map(({ rot, axis }) => (
          <div
            key={`${axis}-${rot}`}
            className="absolute top-0 bottom-0"
            style={{
              left: "calc(50% - 6px)",
              width: "12px",
              background: "color-mix(in srgb, var(--color-void) 70%, transparent)",
              border: `2px solid ${color}`,
              transform: `rotateY(${rot}deg) translateZ(calc(3.5rem))`,
              opacity: 0.8,
            }}
          />
        ))}
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
