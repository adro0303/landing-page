import { useEffect, useRef } from "react";

/**
 * Ambient CRT backdrop: phosphor starfield, a retro sun behind the horizon,
 * a wireframe mountain ridge, a perspective grid, and a pair of line-drawn
 * palm trees — all rendered as strokes in the same vector/grid language.
 * Deliberately not cursor-reactive — that role belongs entirely to
 * AsciiFigure, so the two layers read as one intentional scene rather than
 * competing effects. Kept clearly secondary in brightness/contrast to the
 * statue, which stays the protagonist.
 */

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

    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random(),
      y: Math.random() * 0.62,
      r: Math.random() * 1.4 + 0.4,
      phase: Math.random() * Math.PI * 2,
    }));

    // deterministic jagged mountain ridge line, seeded so it doesn't
    // reshuffle on re-render
    const rand = mulberry32(1337);
    const MOUNTAIN_POINTS = 16;
    const mountain = Array.from({ length: MOUNTAIN_POINTS + 1 }, (_, i) => ({
      x: i / MOUNTAIN_POINTS,
      h: 0.15 + rand() * 0.85,
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

    // simple wireframe palm: a leaning trunk + drooping fronds, drawn with
    // the same stroke language as the ground grid
    function drawPalm(originX: number, groundY: number, h: number, alpha: number) {
      ctx!.save();
      ctx!.globalAlpha = alpha;
      ctx!.strokeStyle = "#8dffc4";
      ctx!.lineCap = "round";
      ctx!.lineWidth = Math.max(1, h * 0.045);

      const lean = h * 0.18;
      const topX = originX + lean;
      const topY = groundY - h;

      ctx!.beginPath();
      ctx!.moveTo(originX, groundY);
      ctx!.quadraticCurveTo(originX + lean * 0.55, groundY - h * 0.6, topX, topY);
      ctx!.stroke();

      const fronds: [number, number][] = [
        [-1.25, 0.82],
        [-0.6, 1.0],
        [0.05, 1.08],
        [0.6, 1.0],
        [1.2, 0.8],
      ];
      fronds.forEach(([angOffset, lenF]) => {
        const angle = -Math.PI / 2 + angOffset;
        const len = h * 0.62 * lenF;
        const midX = topX + Math.cos(angle) * len * 0.55;
        const midY = topY + Math.sin(angle) * len * 0.55 - h * 0.04;
        const endX = topX + Math.cos(angle) * len;
        const endY = topY + Math.sin(angle) * len + h * 0.16;
        ctx!.beginPath();
        ctx!.moveTo(topX, topY);
        ctx!.quadraticCurveTo(midX, midY, endX, endY);
        ctx!.stroke();
      });
      ctx!.restore();
    }

    function draw(time: number) {
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const horizon = height * 0.66;

      // stars
      stars.forEach((s) => {
        const twinkle = 0.4 + 0.6 * Math.sin(time * 0.0007 + s.phase);
        ctx.globalAlpha = 0.35 + twinkle * 0.5;
        ctx.fillStyle = "#8dffc4";
        ctx.beginPath();
        ctx.arc(s.x * width, s.y * height, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // retro sun — sits mostly above/behind the horizon, centered so the
      // statue (rendered on top by AsciiFigure) occludes its bright core
      const sunR = Math.min(width, height) * 0.16;
      const sunX = width / 2;
      const sunY = horizon - sunR * 0.2;

      ctx.save();
      const sunGlow = ctx.createRadialGradient(sunX, sunY, sunR * 0.1, sunX, sunY, sunR * 1.5);
      sunGlow.addColorStop(0, "rgba(141,255,196,0.16)");
      sunGlow.addColorStop(1, "rgba(43,220,110,0)");
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunR * 1.5, 0, Math.PI * 2);
      ctx.fill();

      const sunFill = ctx.createLinearGradient(sunX, sunY - sunR, sunX, sunY + sunR);
      sunFill.addColorStop(0, "rgba(190,255,220,0.3)");
      sunFill.addColorStop(1, "rgba(43,220,110,0.08)");
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

      // mountain ridge — a wireframe line, same visual language as the grid
      ctx.beginPath();
      mountain.forEach((pt, i) => {
        const mx = pt.x * width;
        const my = horizon - pt.h * height * 0.16;
        if (i === 0) ctx.moveTo(mx, my);
        else ctx.lineTo(mx, my);
      });
      ctx.strokeStyle = "rgba(140,255,186,0.5)";
      ctx.lineWidth = 1.25;
      ctx.stroke();
      ctx.lineTo(width, horizon);
      ctx.lineTo(0, horizon);
      ctx.closePath();
      ctx.fillStyle = "rgba(43,220,110,0.05)";
      ctx.fill();

      // perspective grid
      const cx = width / 2;
      ctx.strokeStyle = "rgba(43,220,110,0.4)";
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
        ctx.strokeStyle = `rgba(140,255,186,${0.5 - p * 0.38})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const glow = ctx.createLinearGradient(0, horizon - height * 0.16, 0, horizon);
      glow.addColorStop(0, "rgba(43,220,110,0)");
      glow.addColorStop(1, "rgba(43,220,110,0.18)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, horizon - height * 0.16, width, height * 0.16);

      // line-drawn palm trees — background detail, still legible at a glance
      const palmH = Math.max(48, Math.min(110, width * 0.075));
      drawPalm(width * 0.07, horizon + 2, palmH, 0.4);
      drawPalm(width * 0.94, horizon + 4, palmH * 0.88, 0.34);

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
