import { useEffect, useRef } from "react";

export function HeroFallback({ animate = true }: { animate?: boolean }) {
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

    const stars = Array.from({ length: 90 }, () => ({
      x: Math.random(),
      y: Math.random() * 0.6,
      r: Math.random() * 1.4 + 0.3,
      phase: Math.random() * Math.PI * 2,
    }));

    function resize() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    function draw(time: number) {
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const horizon = height * 0.58;

      const sky = ctx.createLinearGradient(0, 0, 0, horizon);
      sky.addColorStop(0, "#05060a");
      sky.addColorStop(1, "#0a1420");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, horizon);

      ctx.fillStyle = "#05060a";
      ctx.fillRect(0, horizon, width, height - horizon);

      stars.forEach((s) => {
        const twinkle = 0.5 + 0.5 * Math.sin(time * 0.001 + s.phase);
        ctx.globalAlpha = 0.3 + twinkle * 0.5;
        ctx.fillStyle = "#6ff6ff";
        ctx.beginPath();
        ctx.arc(s.x * width, s.y * horizon, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      const cx = width / 2;
      const vanishY = horizon;

      ctx.strokeStyle = "rgba(88,166,255,0.35)";
      ctx.lineWidth = 1;
      const spread = width * 0.9;
      for (let i = -6; i <= 6; i++) {
        ctx.beginPath();
        ctx.moveTo(cx + i * (spread / 12), height);
        ctx.lineTo(cx + i * (spread / 60), vanishY);
        ctx.stroke();
      }

      const speed = animate ? time * 0.00007 : 0;
      for (let j = 0; j < 10; j++) {
        const p = (j / 10 + speed) % 1;
        const y = vanishY + p * p * (height - vanishY);
        ctx.strokeStyle = `rgba(88,166,255,${0.5 - p * 0.4})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const glow = ctx.createRadialGradient(cx, vanishY, 4, cx, vanishY, width * 0.28);
      glow.addColorStop(0, "rgba(111,246,255,0.35)");
      glow.addColorStop(1, "rgba(111,246,255,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, vanishY, width * 0.28, 0, Math.PI * 2);
      ctx.fill();

      if (animate) raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    raf = animate ? requestAnimationFrame(draw) : (draw(0), 0);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [animate]);

  return <canvas ref={canvasRef} className="h-full w-full" />;
}
