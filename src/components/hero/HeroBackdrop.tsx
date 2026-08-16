import { useEffect, useRef } from "react";

/**
 * Ambient CRT backdrop: phosphor starfield, a retro sun behind the horizon,
 * and a single perspective grid whose outer rays rise into wireframe
 * mountains on either side — same mesh, same lines, just lifted where it's
 * not the road — plus a pair of line-drawn palm trees. Deliberately not
 * cursor-reactive — that role belongs entirely to AsciiFigure, so the two
 * layers read as one intentional scene rather than competing effects. Kept
 * clearly secondary in brightness/contrast to the statue, which stays the
 * protagonist.
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
const ROAD_HALF_WIDTH = 3.1; // rays within this index stay flat (the "road")

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

    // per-ray peak depth/height/width, seeded so the range doesn't reshuffle
    // on re-render — amplitude tapers to zero inside the road corridor, so
    // interpolating between neighbouring rays blends smoothly into the flat
    // road with no hard seam
    const rand = mulberry32(4242);
    const peaks = new Map<number, { peakT: number; amp: number; sigma: number }>();
    for (let i = RAY_MIN - 2; i <= RAY_MAX + 2; i++) {
      const outside = Math.max(0, Math.abs(i) - ROAD_HALF_WIDTH);
      peaks.set(i, {
        peakT: 0.3 + rand() * 0.42,
        amp: outside * (0.55 + rand() * 0.4),
        sigma: 0.22 + rand() * 0.14,
      });
    }

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function terrainLift(i: number, t: number, ampScale: number) {
      const i0 = Math.floor(i);
      const i1 = i0 + 1;
      const frac = i - i0;
      const p0 = peaks.get(i0);
      const p1 = peaks.get(i1);
      if (!p0 || !p1) return 0;
      const peakT = lerp(p0.peakT, p1.peakT, frac);
      const amp = lerp(p0.amp, p1.amp, frac);
      const sigma = lerp(p0.sigma, p1.sigma, frac);
      if (amp <= 0.001) return 0;
      const dt = t - peakT;
      const bell = Math.exp(-(dt * dt) / (2 * sigma * sigma));
      return amp * bell * ampScale;
    }

    function resize() {
      const el = canvasRef.current;
      if (!el) return;
      width = el.clientWidth;
      height = el.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = width * dpr;
      el.height = height * dpr;
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

      // perspective floor grid — the outer rays rise into wireframe
      // mountains, the inner ones (the road) stay flat, all one mesh
      const cx = width / 2;
      const spread = width * 1.1;
      const ampScale = height * 0.058;
      const RAY_STEPS = 14;

      ctx.lineWidth = 1;
      for (let i = RAY_MIN; i <= RAY_MAX; i++) {
        const xBase = cx + i * (spread / 14);
        const xTop = cx + i * (spread / 90);
        ctx.beginPath();
        for (let s = 0; s <= RAY_STEPS; s++) {
          const t = s / RAY_STEPS;
          const x = xBase + (xTop - xBase) * t;
          const y = height + (horizon - height) * t - terrainLift(i, t, ampScale);
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const isMountainRay = Math.abs(i) > ROAD_HALF_WIDTH;
        ctx.strokeStyle = isMountainRay ? "rgba(140,255,186,0.4)" : "rgba(43,220,110,0.4)";
        ctx.stroke();
      }

      // rungs are sampled in ray-index space (not inverted from x) so the
      // terrain lift stays numerically stable as the rays converge near
      // the horizon, instead of blowing up under a near-zero x scale
      const speed = animate ? time * 0.00006 : 0;
      const RUNG_STEPS = 64;
      const iSpan = RAY_MAX - RAY_MIN + 2;
      for (let j = 0; j < 9; j++) {
        const p = (j / 9 + speed) % 1;
        const t = 1 - p;
        const baseY = horizon + p * p * (height - horizon);
        const xScale = (spread / 14) + ((spread / 90) - (spread / 14)) * t;
        ctx.beginPath();
        for (let s = 0; s <= RUNG_STEPS; s++) {
          const i = RAY_MIN - 1 + (s / RUNG_STEPS) * iSpan;
          const x = cx + i * xScale;
          const y = baseY - terrainLift(i, t, ampScale);
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
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
