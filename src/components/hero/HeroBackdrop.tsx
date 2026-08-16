import { useEffect, useRef } from "react";

/**
 * Ambient CRT backdrop: a faint phosphor starfield and a perspective grid
 * horizon. Deliberately not cursor-reactive — that role belongs entirely to
 * AsciiFigure, so the two layers read as one intentional scene rather than
 * competing effects.
 */
export function HeroBackdrop({
  animate = true,
  active = true,
}: {
  animate?: boolean;
  active?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const stars = Array.from({ length: 70 }, () => ({
      x: Math.random(),
      y: Math.random() * 0.62,
      r: Math.random() * 1.3 + 0.3,
      phase: Math.random() * Math.PI * 2,
    }));

    function resize() {
      const el = canvasRef.current;
      if (!el) return;
      width = el.clientWidth;
      height = el.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = width * dpr;
      el.height = height * dpr;
    }

    function draw(time: number) {
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const horizon = height * 0.66;

      stars.forEach((s) => {
        const twinkle = 0.4 + 0.6 * Math.sin(time * 0.0007 + s.phase);
        ctx.globalAlpha = 0.15 + twinkle * 0.28;
        ctx.fillStyle = "#2bdc6e";
        ctx.beginPath();
        ctx.arc(s.x * width, s.y * height, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      const cx = width / 2;
      ctx.strokeStyle = "rgba(43,220,110,0.16)";
      ctx.lineWidth = 1;
      const spread = width * 1.1;
      for (let i = -7; i <= 7; i++) {
        ctx.beginPath();
        ctx.moveTo(cx + i * (spread / 14), height);
        ctx.lineTo(cx + i * (spread / 90), horizon);
        ctx.stroke();
      }

      const speed = animate ? time * 0.00006 : 0;
      for (let j = 0; j < 9; j++) {
        const p = (j / 9 + speed) % 1;
        const y = horizon + p * p * (height - horizon);
        ctx.strokeStyle = `rgba(43,220,110,${0.22 - p * 0.18})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const glow = ctx.createLinearGradient(0, horizon - height * 0.12, 0, horizon);
      glow.addColorStop(0, "rgba(43,220,110,0)");
      glow.addColorStop(1, "rgba(43,220,110,0.05)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, horizon - height * 0.12, width, height * 0.12);

      if (animate) raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    if (animate && active) {
      raf = requestAnimationFrame(draw);
    } else {
      draw(0);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [animate, active]);

  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />;
}
