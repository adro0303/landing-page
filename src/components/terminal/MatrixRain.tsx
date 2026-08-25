import { useEffect, useRef } from "react";

const CHARS = "アイウエオカキクケコサシスセソ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const FONT_SIZE = 18;

export function MatrixRain({ onDismiss }: { onDismiss: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let raf = 0;
    let drops: number[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const cols = Math.floor(canvas.width / FONT_SIZE);
      drops = new Array(cols).fill(0).map(() => Math.floor((Math.random() * canvas.height) / FONT_SIZE));
    }
    resize();
    window.addEventListener("resize", resize);

    function tick() {
      if (!canvas || !ctx) return;
      // rgb(43,220,110) is --color-blue's literal value (#2bdc6e) — canvas
      // fillStyle needs a concrete color, same reason the terminal's
      // boxShadow keyframes can't use a var() either.
      ctx.fillStyle = "rgba(6, 10, 8, 0.09)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${FONT_SIZE}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillStyle = Math.random() > 0.985 ? "#e8fff2" : "rgba(43,220,110,0.85)";
        ctx.fillText(char, i * FONT_SIZE, drops[i] * FONT_SIZE);
        if (drops[i] * FONT_SIZE > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[200] cursor-pointer bg-(--color-void)"
      onClick={onDismiss}
      role="button"
      aria-label="Exit matrix effect"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
      <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs tracking-wide text-(--color-fg-faint)">
        click · any key · Esc to exit
      </div>
    </div>
  );
}
