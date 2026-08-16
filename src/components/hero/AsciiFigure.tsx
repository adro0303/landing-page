import { useEffect, useMemo, useRef } from "react";

const RAMP = " .:-=+*#%@";

/**
 * Renders a classical bust silhouette (procedural, no external assets) into
 * an offscreen canvas and returns a normalized brightness field: 0 = outside
 * the figure, >0 = inside, brighter toward the "lit" side — used as a fake
 * carved-marble shading pass.
 */
function buildBustMask(w: number, h: number): Float32Array {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const cx = w / 2;

  ctx.fillStyle = "#fff";

  // pedestal
  ctx.beginPath();
  ctx.rect(w * 0.26, h * 0.87, w * 0.48, h * 0.13);
  ctx.fill();

  // draped shoulders / chest
  ctx.beginPath();
  ctx.moveTo(cx, h * 0.47);
  ctx.bezierCurveTo(w * 0.14, h * 0.53, w * 0.08, h * 0.78, w * 0.18, h * 0.89);
  ctx.lineTo(w * 0.82, h * 0.89);
  ctx.bezierCurveTo(w * 0.92, h * 0.78, w * 0.86, h * 0.53, cx, h * 0.47);
  ctx.closePath();
  ctx.fill();

  // draped fold accent (one shoulder) — classical asymmetry
  ctx.beginPath();
  ctx.moveTo(w * 0.58, h * 0.5);
  ctx.bezierCurveTo(w * 0.72, h * 0.58, w * 0.78, h * 0.74, w * 0.74, h * 0.87);
  ctx.lineTo(w * 0.63, h * 0.87);
  ctx.bezierCurveTo(w * 0.68, h * 0.72, w * 0.63, h * 0.58, w * 0.54, h * 0.5);
  ctx.closePath();
  ctx.fill();

  // neck
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.07, h * 0.32);
  ctx.lineTo(cx - w * 0.09, h * 0.49);
  ctx.lineTo(cx + w * 0.09, h * 0.49);
  ctx.lineTo(cx + w * 0.07, h * 0.32);
  ctx.closePath();
  ctx.fill();

  // head
  ctx.beginPath();
  ctx.ellipse(cx, h * 0.19, w * 0.135, h * 0.155, 0, 0, Math.PI * 2);
  ctx.fill();

  // hair mass
  ctx.beginPath();
  ctx.ellipse(cx, h * 0.105, w * 0.105, h * 0.075, 0, 0, Math.PI * 2);
  ctx.fill();
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.ellipse(cx + i * w * 0.045, h * 0.075, w * 0.028, h * 0.032, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // fake carved shading: brightness variation confined to the silhouette
  ctx.globalCompositeOperation = "source-atop";
  const grad = ctx.createRadialGradient(
    cx - w * 0.09,
    h * 0.14,
    2,
    cx,
    h * 0.42,
    w * 0.55,
  );
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.55, "rgba(150,150,150,1)");
  grad.addColorStop(1, "rgba(70,70,70,1)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "source-over";

  const data = ctx.getImageData(0, 0, w, h).data;
  const field = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const a = data[i * 4 + 3] / 255;
    const lum = data[i * 4] / 255;
    field[i] = a > 0.05 ? Math.max(0.14, lum) : 0;
  }
  return field;
}

type Point = { x: number; y: number };

export function AsciiFigure({
  active,
  tier,
  reducedMotion,
  isTouch,
}: {
  active: boolean;
  tier: "high" | "low";
  reducedMotion: boolean;
  isTouch: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskRes = 220;
  const mask = useMemo(() => buildBustMask(maskRes, Math.round(maskRes * 1.25)), []);
  const maskW = maskRes;
  const maskH = Math.round(maskRes * 1.25);

  const pointer = useRef<Point>({ x: -9999, y: -9999 });
  const hasPointer = useRef(false);

  useEffect(() => {
    if (isTouch) return;
    const onMove = (e: PointerEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY };
      hasPointer.current = true;
    };
    const onLeave = () => {
      hasPointer.current = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [isTouch]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cellSize = tier === "high" ? 15 : 20;
    let cols = 0;
    let rows = 0;
    let energy = new Float32Array(0);
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // figure bounding box, normalized to the hero container — the ASCII
    // reveal is only ever computed/drawn inside this region, on purpose:
    // the rest of the background stays untouched by this layer.
    const bbox = { x0: 0.34, x1: 0.66, y0: 0.06, y1: 0.94 };
    let colStart = 0;
    let colEnd = 0;
    let rowStart = 0;
    let rowEnd = 0;

    function resize() {
      const el = canvasRef.current;
      if (!el) return;
      width = el.clientWidth;
      height = el.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = width * dpr;
      el.height = height * dpr;
      cols = Math.max(1, Math.floor(width / cellSize));
      rows = Math.max(1, Math.floor(height / cellSize));
      energy = new Float32Array(cols * rows);
      colStart = Math.max(0, Math.floor(bbox.x0 * cols) - 1);
      colEnd = Math.min(cols, Math.ceil(bbox.x1 * cols) + 1);
      rowStart = Math.max(0, Math.floor(bbox.y0 * rows) - 1);
      rowEnd = Math.min(rows, Math.ceil(bbox.y1 * rows) + 1);
    }

    function sampleMask(u: number, v: number): number {
      if (u < bbox.x0 || u > bbox.x1 || v < bbox.y0 || v > bbox.y1) return 0;
      const mu = (u - bbox.x0) / (bbox.x1 - bbox.x0);
      const mv = (v - bbox.y0) / (bbox.y1 - bbox.y0);
      const mx = Math.min(maskW - 1, Math.max(0, Math.floor(mu * maskW)));
      const my = Math.min(maskH - 1, Math.max(0, Math.floor(mv * maskH)));
      return mask[my * maskW + mx];
    }

    let raf = 0;
    let t = 0;
    const radius = tier === "high" ? 190 : 140;
    const decay = 0.9;

    function frame() {
      if (!ctx) return;
      t += 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const rect = canvasRef.current?.getBoundingClientRect();
      let px = -9999;
      let py = -9999;
      if (isTouch) {
        const phase = t * 0.006;
        px = width * (0.5 + 0.16 * Math.sin(phase * 1.3));
        py = height * (0.5 + 0.22 * Math.sin(phase * 0.8 + 1.4));
      } else if (rect && hasPointer.current) {
        px = pointer.current.x - rect.left;
        py = pointer.current.y - rect.top;
      }

      if (px > -1000) {
        const glow = ctx.createRadialGradient(px, py, 4, px, py, radius * 1.3);
        glow.addColorStop(0, "rgba(111,246,255,0.10)");
        glow.addColorStop(1, "rgba(111,246,255,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(px, py, radius * 1.3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.font = `${cellSize - 2}px "Fira Code", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let row = rowStart; row < rowEnd; row++) {
        for (let col = colStart; col < colEnd; col++) {
          const idx = row * cols + col;
          const x = col * cellSize + cellSize / 2;
          const y = row * cellSize + cellSize / 2;
          const u = x / width;
          const v = y / height;
          const m = sampleMask(u, v);

          // only the figure itself accumulates & shows energy — cursor
          // proximity anywhere else on the canvas has no effect here
          if (m <= 0.001) {
            energy[idx] = 0;
            continue;
          }

          let e = energy[idx];
          if (px > -1000) {
            const d = Math.hypot(x - px, y - py);
            const influence = Math.max(0, 1 - d / radius);
            e = Math.min(1, e * decay + influence * influence * 0.55);
          } else {
            e *= decay;
          }
          energy[idx] = e;

          const boosted = Math.min(1, m + e * 0.8);
          const charIdx = Math.min(
            RAMP.length - 1,
            Math.floor(boosted * (RAMP.length - 1)),
          );
          let ch = RAMP[charIdx];
          if (e > 0.35 && Math.random() < e * 0.12) {
            ch = RAMP[Math.min(RAMP.length - 1, charIdx + 1)];
          }
          if (ch === " ") continue;

          const baseAlpha = m > 0 ? 0.045 + m * 0.05 : 0;
          const alpha = Math.min(0.95, baseAlpha + e * 0.95);
          if (alpha < 0.02) continue;

          const jitter = e > 0.05 ? (Math.random() - 0.5) * e * 3 : 0;

          const blue = [88, 166, 255];
          const cyan = [111, 246, 255];
          const mix = Math.min(1, e * 1.4);
          const r = Math.round(blue[0] + (cyan[0] - blue[0]) * mix);
          const g = Math.round(blue[1] + (cyan[1] - blue[1]) * mix);
          const b = Math.round(blue[2] + (cyan[2] - blue[2]) * mix);

          ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.fillText(ch, x + jitter, y + jitter);
        }
      }

      if (!reducedMotion) raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);

    if (reducedMotion) {
      frame();
    } else if (active) {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [tier, reducedMotion, isTouch, active, mask, maskW, maskH]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
