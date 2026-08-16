import { useEffect, useRef, type RefObject } from "react";
import { STATUE_FIELD } from "@/data/statueField";

const { cols, rows, data, ramp: RAMP } = STATUE_FIELD;

// precomputed once: display value per cell, gamma-curved so only genuine
// sculptural detail (not the faint vignette residue) reads at rest.
const DISPLAY = new Float32Array(cols * rows);
let REVEALABLE_COUNT = 0;
for (let i = 0; i < data.length; i++) {
  const level = (data.charCodeAt(i) - 48) / (RAMP.length - 1);
  const dv = Math.pow(level, 1.7);
  DISPLAY[i] = dv;
  if (dv >= 0.025) REVEALABLE_COUNT++;
}

const DIM = [58, 158, 96] as const;
const BRIGHT = [152, 255, 195] as const;
const HOT = [234, 255, 241] as const;
const SUNLIT = [255, 145, 64] as const;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function mixColor(a: readonly number[], b: readonly number[], t: number) {
  const c = Math.max(0, Math.min(1, t));
  return [lerp(a[0], b[0], c), lerp(a[1], b[1], c), lerp(a[2], b[2], c)];
}

type Point = { x: number; y: number };

export function AsciiFigure({
  active,
  reducedMotion,
  isTouch,
  tier,
  onScanChange,
  sectionRef,
}: {
  active: boolean;
  reducedMotion: boolean;
  isTouch: boolean;
  tier: "high" | "low";
  onScanChange?: (pct: number) => void;
  sectionRef?: RefObject<HTMLElement | null>;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef<Point>({ x: -9999, y: -9999 });
  const hasPointer = useRef(false);
  const onScanChangeRef = useRef(onScanChange);
  onScanChangeRef.current = onScanChange;

  useEffect(() => {
    if (isTouch) return;
    const onMove = (e: PointerEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      pointer.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
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
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const minCell = 2;
    const maxCell = tier === "high" ? 14 : 10;
    const fillFraction = 0.985;

    let cellPx = 6;
    let width = 0;
    let height = 0;
    let offsetX = 0;
    let offsetY = 0;
    let radius = 90;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // the statue's own box (the flex layout slot below the header text) —
    // the canvas itself is drawn taller than this, extending up to the
    // section's top edge, so the pointer glow has room to fade out instead
    // of hitting a hard ceiling when the cursor moves up toward the title
    let boxTop = 0;
    let boxHeight = 0;

    // where the backdrop's retro sun sits, translated into this canvas's
    // local coordinates — so the statue's sunlit silhouette lines up with
    // the sun actually drawn behind it in HeroBackdrop
    let sunLocalX = 0;
    let sunLocalY = 0;
    let sunLocalR = 0;

    const energy = new Float32Array(cols * rows);
    const revealed = new Uint8Array(cols * rows);
    let revealedCount = 0;

    function resize() {
      const w = wrap!.clientWidth;
      const wrapH = wrap!.clientHeight;

      const sectionEl = sectionRef?.current;
      const sectionRect = sectionEl?.getBoundingClientRect();
      const wrapRect = wrap!.getBoundingClientRect();
      const extraTop = sectionRect ? Math.max(0, wrapRect.top - sectionRect.top) : 0;

      width = w;
      height = extraTop + wrapH;
      boxTop = extraTop;
      boxHeight = wrapH;

      cellPx = Math.max(
        minCell,
        Math.min(maxCell, Math.min((w * fillFraction) / cols, (wrapH * fillFraction) / rows)),
      );
      const figW = cols * cellPx;
      const figH = rows * cellPx;
      offsetX = (w - figW) / 2;
      offsetY = extraTop + (wrapH - figH) / 2;
      radius = cellPx * (tier === "high" ? 26 : 18);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const el = canvasRef.current;
      if (!el) return;
      el.width = width * dpr;
      el.height = height * dpr;
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      el.style.top = `${-extraTop}px`;

      const sectionW = sectionRect?.width ?? w;
      const sectionH = sectionRect?.height ?? height;
      const horizonSection = sectionH * 0.66;
      sunLocalR = Math.min(sectionW, sectionH) * 0.16;
      // canvas-local y now matches section-local y directly (canvas top
      // edge is pinned to the section's top edge), so no offset needed
      sunLocalY = horizonSection - sunLocalR * 0.2;
      const offsetLeft = sectionRect ? wrapRect.left - sectionRect.left : 0;
      sunLocalX = sectionW / 2 - offsetLeft;
    }

    let raf = 0;
    let t = 0;
    const decay = 0.97;

    let glitchFrames = 0;
    let glitchRowStart = 0;
    let glitchRowEnd = 0;
    let glitchOffset = 0;

    function frame() {
      if (!ctx) return;
      t += 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      let px = -9999;
      let py = -9999;
      if (isTouch) {
        const phase = t * 0.0055;
        px = width * (0.5 + 0.24 * Math.sin(phase * 1.2));
        py = boxTop + boxHeight * (0.46 + 0.32 * Math.sin(phase * 0.75 + 1.1));
      } else if (hasPointer.current) {
        px = pointer.current.x;
        py = pointer.current.y;
      }

      const pointerInside = px > -100 && px < width + 100 && py > -100 && py < height + 100;

      if (pointerInside) {
        const glow = ctx.createRadialGradient(px, py, 2, px, py, radius * 1.4);
        glow.addColorStop(0, "rgba(234,255,241,0.22)");
        glow.addColorStop(0.4, "rgba(140,255,186,0.09)");
        glow.addColorStop(1, "rgba(43,220,110,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(px, py, radius * 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reducedMotion) {
        if (glitchFrames > 0) {
          glitchFrames--;
        } else if (Math.random() < 0.0035) {
          glitchFrames = 3 + Math.floor(Math.random() * 4);
          const bandRow = Math.floor(Math.random() * rows);
          glitchRowStart = Math.max(0, bandRow - 1);
          glitchRowEnd = Math.min(rows, bandRow + 2);
          glitchOffset = (Math.random() < 0.5 ? -1 : 1) * (2 + Math.random() * 4);
        }
      }

      ctx.font = `${Math.max(6, cellPx + 1.5)}px "Fira Code", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let row = 0; row < rows; row++) {
        const inGlitchBand =
          glitchFrames > 0 && row >= glitchRowStart && row < glitchRowEnd;
        const rowShift = inGlitchBand ? glitchOffset : 0;

        for (let col = 0; col < cols; col++) {
          const idx = row * cols + col;
          const dv = DISPLAY[idx];
          if (dv < 0.025 && energy[idx] < 0.02) continue;

          const x = col * cellPx + cellPx / 2 + rowShift + offsetX;
          const y = row * cellPx + cellPx / 2 + offsetY;

          let e = energy[idx];
          if (pointerInside) {
            const d = Math.hypot(x - px, y - py);
            const sigma = radius * 0.55;
            const influence = Math.exp(-(d * d) / (2 * sigma * sigma));
            e = Math.min(1, e * decay + influence * 0.9);
          } else {
            e *= decay;
          }
          energy[idx] = e;

          if (e > 0.5 && !revealed[idx]) {
            revealed[idx] = 1;
            revealedCount++;
          }

          if (dv < 0.025 && e < 0.02) continue;

          // scan-beam: a thin bright band trailing the pointer's row
          let scanBoost = 0;
          if (pointerInside && Math.abs(y - py) < cellPx * 1.6) {
            const lineFalloff = Math.max(0, 1 - Math.abs(x - px) / (radius * 1.3));
            scanBoost = lineFalloff * 0.35;
          }
          const eFx = Math.min(1, e + scanBoost);

          // statue is fully readable at rest; hovering only brightens/shifts
          // color on top of the already-visible base, it doesn't reveal it
          const boostedDv = Math.min(1, dv + eFx * 0.12);
          const charIdx = Math.min(
            RAMP.length - 1,
            Math.max(0, Math.round(boostedDv * (RAMP.length - 1))),
          );
          let ch = RAMP[charIdx];
          if (ch === " ") continue;
          if (eFx > 0.4 && Math.random() < eFx * 0.1) {
            ch = RAMP[Math.min(RAMP.length - 1, charIdx + 1)];
          }

          const restAlpha = Math.min(1, dv * 1.6 + 0.16);
          const liveAlpha = eFx * 0.3;
          const alpha = Math.min(1, restAlpha + liveAlpha);
          if (alpha < 0.02) continue;

          const restColor = mixColor(DIM, BRIGHT, dv);
          const sunDist = Math.hypot(x - sunLocalX, y - sunLocalY);
          const hotTarget = sunDist < sunLocalR * 1.1 ? SUNLIT : HOT;
          const [r, g, b] = mixColor(restColor, hotTarget, Math.min(1, eFx * 1.4));

          const jitter = eFx > 0.15 ? (Math.random() - 0.5) * eFx * 1.1 : 0;

          ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${alpha.toFixed(3)})`;
          ctx.fillText(ch, x + jitter, y + jitter);
        }
      }

      if (pointerInside && !reducedMotion) {
        const col = Math.floor((px - offsetX) / cellPx);
        const row = Math.floor((py - offsetY) / cellPx);
        ctx.strokeStyle = "rgba(152,255,195,0.55)";
        ctx.lineWidth = 1;
        const s = cellPx * 2.4;
        ctx.strokeRect(px - s, py - s, s * 2, s * 2);
        const cs = 5;
        ctx.beginPath();
        [
          [px - s, py - s, px - s + cs, py - s],
          [px - s, py - s, px - s, py - s + cs],
          [px + s, py - s, px + s - cs, py - s],
          [px + s, py - s, px + s, py - s + cs],
          [px - s, py + s, px - s + cs, py + s],
          [px - s, py + s, px - s, py + s - cs],
          [px + s, py + s, px + s - cs, py + s],
          [px + s, py + s, px + s, py + s - cs],
        ].forEach(([x1, y1, x2, y2]) => {
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
        });
        ctx.strokeStyle = "rgba(234,255,241,0.85)";
        ctx.stroke();

        ctx.font = "9px 'Fira Code', monospace";
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "rgba(152,255,195,0.75)";
        ctx.fillText(
          `X:${String(col).padStart(3, "0")} Y:${String(row).padStart(3, "0")}`,
          px + s + 8,
          py - s,
        );
      }

      if (t % 20 === 0) {
        onScanChangeRef.current?.(
          Math.min(100, Math.round((revealedCount / REVEALABLE_COUNT) * 100)),
        );
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
  }, [tier, reducedMotion, isTouch, active]);

  return (
    <div ref={wrapRef} className="relative h-full w-full">
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-x-0" />
    </div>
  );
}
