import { useEffect, useRef } from "react";

/**
 * Ambient CRT backdrop: phosphor starfield, a retro sun behind the horizon,
 * mountain silhouettes, a perspective grid, and a pair of ASCII palm trees.
 * Deliberately not cursor-reactive — that role belongs entirely to
 * AsciiFigure, so the two layers read as one intentional scene rather than
 * competing effects. Kept clearly secondary in brightness/contrast to the
 * statue, which stays the protagonist.
 */

const PALM_ART = [
  "  \\  |  /  ",
  "   \\ | /   ",
  "  -- * --   ",
  "     #      ",
  "     #      ",
  "    ##      ",
  "   # #      ",
];

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

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

    // deterministic jagged mountain silhouette, seeded so it doesn't
    // reshuffle on re-render
    const rand = mulberry32(1337);
    const MOUNTAIN_POINTS = 14;
    const mountain = Array.from({ length: MOUNTAIN_POINTS + 1 }, (_, i) => ({
      x: i / MOUNTAIN_POINTS,
      h: 0.18 + rand() * 0.62,
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

    function drawAsciiCluster(
      originX: number,
      originY: number,
      cell: number,
      alpha: number,
    ) {
      ctx!.font = `${cell * 1.6}px "Fira Code", monospace`;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
      ctx!.fillStyle = `rgba(125,255,176,${alpha})`;
      PALM_ART.forEach((line, row) => {
        for (let col = 0; col < line.length; col++) {
          const ch = line[col];
          if (ch === " ") continue;
          const x = originX + (col - line.length / 2) * cell;
          const y = originY + row * cell;
          ctx!.fillText(ch, x, y);
        }
      });
    }

    function draw(time: number) {
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const horizon = height * 0.66;

      // stars
      stars.forEach((s) => {
        const twinkle = 0.4 + 0.6 * Math.sin(time * 0.0007 + s.phase);
        ctx.globalAlpha = 0.25 + twinkle * 0.4;
        ctx.fillStyle = "#2bdc6e";
        ctx.beginPath();
        ctx.arc(s.x * width, s.y * height, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // retro sun — sits mostly above/behind the horizon, centered so the
      // statue (rendered on top by AsciiFigure) occludes its bright core
      const sunR = Math.min(width, height) * 0.15;
      const sunX = width / 2;
      const sunY = horizon - sunR * 0.2;

      ctx.save();
      const sunGlow = ctx.createRadialGradient(sunX, sunY, sunR * 0.1, sunX, sunY, sunR * 1.5);
      sunGlow.addColorStop(0, "rgba(141,255,196,0.1)");
      sunGlow.addColorStop(1, "rgba(43,220,110,0)");
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunR * 1.5, 0, Math.PI * 2);
      ctx.fill();

      const sunFill = ctx.createLinearGradient(sunX, sunY - sunR, sunX, sunY + sunR);
      sunFill.addColorStop(0, "rgba(180,255,215,0.2)");
      sunFill.addColorStop(1, "rgba(43,220,110,0.05)");
      ctx.fillStyle = sunFill;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
      ctx.fill();

      // vaporwave scanline cut-bands across the lower half of the disc
      ctx.globalCompositeOperation = "destination-out";
      const bandCount = 6;
      for (let i = 0; i < bandCount; i++) {
        const p = i / bandCount;
        if (p < 0.32) continue;
        const bandY = sunY - sunR + p * sunR * 2;
        const bandH = 2 + p * 6;
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillRect(sunX - sunR * 1.05, bandY, sunR * 2.1, bandH);
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.restore();

      // mountain silhouette, low behind the grid, overlapping the sun's base
      ctx.beginPath();
      ctx.moveTo(0, horizon);
      mountain.forEach((pt) => {
        const mx = pt.x * width;
        const my = horizon - pt.h * height * 0.1;
        ctx.lineTo(mx, my);
      });
      ctx.lineTo(width, horizon);
      ctx.closePath();
      ctx.fillStyle = "rgba(10,30,18,0.85)";
      ctx.fill();
      ctx.strokeStyle = "rgba(43,220,110,0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // perspective grid
      const cx = width / 2;
      ctx.strokeStyle = "rgba(43,220,110,0.32)";
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
        ctx.strokeStyle = `rgba(43,220,110,${0.4 - p * 0.32})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const glow = ctx.createLinearGradient(0, horizon - height * 0.14, 0, horizon);
      glow.addColorStop(0, "rgba(43,220,110,0)");
      glow.addColorStop(1, "rgba(43,220,110,0.12)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, horizon - height * 0.14, width, height * 0.14);

      // ASCII palm trees — background detail, deliberately low-contrast
      const cell = Math.max(4, Math.min(9, width * 0.012));
      drawAsciiCluster(width * 0.09, horizon - cell * 5, cell, 0.16);
      drawAsciiCluster(width * 0.91, horizon - cell * 4.2, cell, 0.13);

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
