import { useEffect, useRef } from "react";

const CHARS = " .:-=+*#%@";
const COLS = 46;
const ROWS = 12;

export function PlasmaEffect() {
  const ref = useRef<HTMLPreElement>(null);

  useEffect(() => {
    let raf = 0;
    let t = 0;
    const tick = () => {
      t += 0.09;
      let out = "";
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const v =
            Math.sin(x * 0.4 + t) +
            Math.sin(y * 0.5 + t * 1.3) +
            Math.sin((x + y) * 0.3 + t * 0.7) +
            Math.sin(Math.sqrt(x * x + y * y) * 0.4 + t);
          const idx = Math.floor(((v + 4) / 8) * (CHARS.length - 1));
          out += CHARS[Math.max(0, Math.min(CHARS.length - 1, idx))];
        }
        out += "\n";
      }
      if (ref.current) ref.current.textContent = out;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <pre
      ref={ref}
      className="text-glow-blue overflow-hidden font-mono text-[6px] leading-[7px] text-(--color-cyan) sm:text-[8px] sm:leading-[9px]"
    />
  );
}
