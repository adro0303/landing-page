import { useEffect, useRef } from "react";

/**
 * Ambient CRT backdrop: phosphor starfield, a retro sun behind the horizon,
 * a static low-poly wireframe mountain range on either side of a perspective
 * floor grid, and a pair of line-drawn palm trees. Only the grid's central
 * "road" corridor animates (flying toward the viewer) — the mountains and
 * everything else stay put, so the terrain reads as solid, fixed ground.
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

const RAY_MIN = -7;
const RAY_MAX = 7;

type PeakDef = {
  xFrac: number;
  widthFrac: number;
  heightFrac: number;
  apexLean: number; // -1..1, how far the apex leans off-center
  facets: number[]; // 0..1 fractions along the base for internal facet lines
};

function buildRange(rand: () => number, side: -1 | 1): PeakDef[] {
  const count = 3;
  const list: PeakDef[] = [];
  for (let k = 0; k < count; k++) {
    list.push({
      xFrac: 0.5 + side * (0.13 + k * 0.12 + rand() * 0.05),
      widthFrac: 0.1 + rand() * 0.07,
      heightFrac: 0.09 + rand() * 0.075 + (k === 1 ? 0.03 : 0),
      apexLean: (rand() - 0.5) * 1.4,
      facets: [0.3 + rand() * 0.15, 0.6 + rand() * 0.15],
    });
  }
  // draw the tallest/nearest peak last so it layers in front
  return list.sort((a, b) => a.heightFrac - b.heightFrac);
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

    const rand = mulberry32(4242);
    const leftRange = buildRange(rand, -1);
    const rightRange = buildRange(rand, 1);

    function resize() {
      const el = canvasRef.current;
      if (!el) return;
      width = el.clientWidth;
      height = el.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = width * dpr;
      el.height = height * dpr;
    }

    // static low-poly wireframe mountain: a filled triangle for mass, a
    // bright ridge outline, and a couple of internal facet lines for the
    // faceted 3D look — completely fixed, no time term anywhere
    function drawPeak(peak: PeakDef, horizon: number) {
      const c = ctx!;
      const baseX = peak.xFrac * width;
      const halfW = (peak.widthFrac * width) / 2;
      const peakH = peak.heightFrac * height;
      const baseLeftX = baseX - halfW;
      const baseRightX = baseX + halfW;
      const apexX = baseX + peak.apexLean * halfW * 0.7;
      const apexY = horizon - peakH;

      c.beginPath();
      c.moveTo(baseLeftX, horizon);
      c.lineTo(apexX, apexY);
      c.lineTo(baseRightX, horizon);
      c.closePath();
      c.fillStyle = "rgba(43,220,110,0.09)";
      c.fill();
      c.strokeStyle = "rgba(150,255,196,0.6)";
      c.lineWidth = 1.2;
      c.stroke();

      c.strokeStyle = "rgba(140,255,186,0.32)";
      c.lineWidth = 1;
      peak.facets.forEach((f) => {
        const fx = baseLeftX + (baseRightX - baseLeftX) * f;
        c.beginPath();
        c.moveTo(apexX, apexY);
        c.lineTo(fx, horizon);
        c.stroke();
      });
    }

    // detailed wireframe palm: leaning trunk with bark rings, pinnate
    // fronds with leaflet ticks, and a small cluster of dates — all strokes,
    // same visual language as the ground grid
    function drawPalm(originX: number, groundY: number, h: number, alpha: number) {
      const c = ctx!;
      c.save();
      c.globalAlpha = alpha;
      c.strokeStyle = "#8dffc4";
      c.lineCap = "round";

      const lean = h * 0.2;
      const trunkTopX = (t: number) => originX + lean * (t * (2 - t));
      const trunkTopY = (t: number) => groundY - h * 0.82 * t;

      c.lineWidth = Math.max(1.1, h * 0.05);
      c.beginPath();
      for (let s = 0; s <= 12; s++) {
        const t = s / 12;
        const x = trunkTopX(t);
        const y = trunkTopY(t);
        if (s === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.stroke();

      // bark ring ticks along the trunk
      c.lineWidth = Math.max(0.8, h * 0.025);
      for (let s = 2; s <= 10; s += 2) {
        const t = s / 12;
        const x = trunkTopX(t);
        const y = trunkTopY(t);
        const dx = trunkTopX(t + 0.03) - trunkTopX(t - 0.03);
        const dy = trunkTopY(t + 0.03) - trunkTopY(t - 0.03);
        const len = Math.hypot(dx, dy) || 1;
        const nx = (-dy / len) * h * 0.05;
        const ny = (dx / len) * h * 0.05;
        c.beginPath();
        c.moveTo(x - nx * 0.3, y - ny * 0.3);
        c.lineTo(x + nx, y + ny);
        c.stroke();
      }

      const topX = trunkTopX(1);
      const topY = trunkTopY(1);

      const fronds: [number, number][] = [
        [-1.35, 0.78],
        [-0.85, 0.98],
        [-0.32, 1.08],
        [0.22, 1.08],
        [0.78, 0.98],
        [1.3, 0.76],
      ];

      fronds.forEach(([angOffset, lenF]) => {
        const angle = -Math.PI / 2 + angOffset;
        const len = h * 0.66 * lenF;
        const midX = topX + Math.cos(angle) * len * 0.55;
        const midY = topY + Math.sin(angle) * len * 0.55 - h * 0.05;
        const endX = topX + Math.cos(angle) * len;
        const endY = topY + Math.sin(angle) * len + h * 0.17;

        // central rib
        c.lineWidth = Math.max(1, h * 0.028);
        c.beginPath();
        c.moveTo(topX, topY);
        c.quadraticCurveTo(midX, midY, endX, endY);
        c.stroke();

        // leaflets along the rib, tapering toward the tip
        c.lineWidth = Math.max(0.7, h * 0.014);
        const leafletCount = 6;
        for (let s = 1; s <= leafletCount; s++) {
          const t = s / (leafletCount + 1);
          const rt = 1 - t;
          const px = topX * rt * rt + midX * 2 * rt * t + endX * t * t;
          const py = topY * rt * rt + midY * 2 * rt * t + endY * t * t;
          const tanX = 2 * rt * (midX - topX) + 2 * t * (endX - midX);
          const tanY = 2 * rt * (midY - topY) + 2 * t * (endY - midY);
          const tLen = Math.hypot(tanX, tanY) || 1;
          const nx = -tanY / tLen;
          const ny = tanX / tLen;
          const leafLen = h * 0.13 * (1 - t * 0.55);
          c.beginPath();
          c.moveTo(px, py);
          c.lineTo(px + nx * leafLen + tanX * 0.12, py + ny * leafLen + tanY * 0.12);
          c.moveTo(px, py);
          c.lineTo(px - nx * leafLen + tanX * 0.12, py - ny * leafLen + tanY * 0.12);
          c.stroke();
        }
      });

      // small date cluster under the crown
      c.lineWidth = Math.max(0.8, h * 0.02);
      for (let d = 0; d < 3; d++) {
        const a = -Math.PI / 2 + (d - 1) * 0.32;
        const dl = h * 0.14;
        const ex = topX + Math.cos(a) * dl;
        const ey = topY + Math.sin(a) * dl + h * 0.05;
        c.beginPath();
        c.moveTo(topX, topY + h * 0.01);
        c.quadraticCurveTo(topX + Math.cos(a) * dl * 0.5, topY + h * 0.05, ex, ey);
        c.stroke();
      }

      c.restore();
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

      // retro sun — a soft glow only, no solid disc, so the statue in front
      // of it never reads as sitting inside a filled background circle.
      // Position is kept (AsciiFigure looks up this same geometry for its
      // hover rim-light), just the rendering is ambient light, not a shape.
      const sunR = Math.min(width, height) * 0.16;
      const sunX = width / 2;
      const sunY = horizon - sunR * 0.2;

      const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR * 1.6);
      sunGlow.addColorStop(0, "rgba(190,255,220,0.14)");
      sunGlow.addColorStop(0.5, "rgba(141,255,196,0.07)");
      sunGlow.addColorStop(1, "rgba(43,220,110,0)");
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunR * 1.6, 0, Math.PI * 2);
      ctx.fill();

      // static wireframe mountain range, both sides — fixed in place
      leftRange.forEach((p) => drawPeak(p, horizon));
      rightRange.forEach((p) => drawPeak(p, horizon));

      // perspective floor grid — straight converging lines, static; only
      // the road corridor's rungs (drawn further below) animate
      const cx = width / 2;
      const spread = width * 1.1;
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(43,220,110,0.35)";
      for (let i = RAY_MIN; i <= RAY_MAX; i++) {
        ctx.beginPath();
        ctx.moveTo(cx + i * (spread / 14), height);
        ctx.lineTo(cx + i * (spread / 90), horizon);
        ctx.stroke();
      }

      // depth rungs — the only part of the scene that animates ("flying"
      // toward the viewer). Full canvas width at every depth, so they
      // always reach both edges instead of over/undershooting the ray fan.
      const speed = animate ? time * 0.00006 : 0;
      for (let j = 0; j < 9; j++) {
        const p = (j / 9 + speed) % 1;
        const baseY = horizon + p * p * (height - horizon);
        ctx.beginPath();
        ctx.moveTo(0, baseY);
        ctx.lineTo(width, baseY);
        ctx.strokeStyle = `rgba(140,255,186,${0.5 - p * 0.38})`;
        ctx.stroke();
      }

      const glow = ctx.createLinearGradient(0, horizon - height * 0.16, 0, horizon);
      glow.addColorStop(0, "rgba(43,220,110,0)");
      glow.addColorStop(1, "rgba(43,220,110,0.18)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, horizon - height * 0.16, width, height * 0.16);

      // line-drawn palm trees — background detail, still legible at a glance
      const palmH = Math.max(56, Math.min(130, width * 0.09));
      drawPalm(width * 0.065, horizon + 4, palmH, 0.45);
      drawPalm(width * 0.945, horizon + 6, palmH * 0.86, 0.38);

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
