import { useEffect, useRef, useState } from "react";
import { digitWeights } from "@/data/digitWeights";

const CANVAS_SIZE = 224;
const MODEL_SIZE = 8;
// rgb(5,15,8)/rgb(43,220,110) are --color-void/--color-blue's literal values
// — canvas needs concrete colors, same reason MatrixRain and the terminal's
// glow animation can't use var() either.
const BG = "#050f08";
const STROKE = "#2bdc6e";

function forward(pixels: number[]): number[] {
  const { W1, b1, W2, b2 } = digitWeights;
  const hidden = b1.map((bias, h) => {
    let sum = bias;
    for (let i = 0; i < pixels.length; i++) sum += pixels[i] * W1[i][h];
    return Math.max(0, sum);
  });
  const logits = b2.map((bias, o) => {
    let sum = bias;
    for (let h = 0; h < hidden.length; h++) sum += hidden[h] * W2[h][o];
    return sum;
  });
  const max = Math.max(...logits);
  const exps = logits.map((v) => Math.exp(v - max));
  const sumExp = exps.reduce((a, b) => a + b, 0);
  return exps.map((v) => v / sumExp);
}

// the training images are tightly cropped and centered on the digit — a
// freehand canvas isn't, so predicting straight off the raw canvas feeds the
// model a framing it's never seen, no matter how well it's trained. Find the
// ink's bounding box first and downsample *that* (with headroom, like the
// dataset's own margin) so the digit lands centered and similarly scaled.
function downsample(canvas: HTMLCanvasElement): number[] {
  const size = canvas.width;
  const ctx = canvas.getContext("2d")!;
  const full = ctx.getImageData(0, 0, size, size).data;

  let minX = size;
  let minY = size;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      if (Math.max(full[i], full[i + 1], full[i + 2]) > 20) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < minX) return new Array(MODEL_SIZE * MODEL_SIZE).fill(0);

  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const cropSize = Math.max(maxX - minX, maxY - minY) * 1.4;

  const small = document.createElement("canvas");
  small.width = MODEL_SIZE;
  small.height = MODEL_SIZE;
  const sctx = small.getContext("2d")!;
  sctx.fillStyle = BG;
  sctx.fillRect(0, 0, MODEL_SIZE, MODEL_SIZE);
  sctx.imageSmoothingQuality = "high";
  sctx.drawImage(canvas, cx - cropSize / 2, cy - cropSize / 2, cropSize, cropSize, 0, 0, MODEL_SIZE, MODEL_SIZE);

  const data = sctx.getImageData(0, 0, MODEL_SIZE, MODEL_SIZE).data;
  // scale so a fully-drawn stroke pixel (green channel of STROKE, 220) reads
  // as ~1.0 — matching the 0..1 range the model was trained on, instead of
  // topping out at 220/255 and shifting every input away from training scale
  const pixels: number[] = [];
  for (let i = 0; i < MODEL_SIZE * MODEL_SIZE; i++) {
    pixels.push(Math.min(1, Math.max(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]) / 220));
  }
  return pixels;
}

export function DigitRecognizer({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [probs, setProbs] = useState<number[] | null>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }, []);

  function posFromEvent(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * CANVAS_SIZE,
      y: ((e.clientY - rect.top) / rect.height) * CANVAS_SIZE,
    };
  }

  function strokeTo(pos: { x: number; y: number }) {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = STROKE;
    // roughly one model-pixel wide (224px canvas / 8px model grid) — thin
    // strokes downsample to near-nothing and the model was never trained on those
    ctx.lineWidth = CANVAS_SIZE / MODEL_SIZE;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    const from = lastPos.current ?? pos;
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
  }

  function clear() {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    }
    setHasDrawing(false);
    setProbs(null);
  }

  function predict() {
    if (!canvasRef.current) return;
    setProbs(forward(downsample(canvasRef.current)));
  }

  const predicted = probs ? probs.indexOf(Math.max(...probs)) : null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-(--color-void)/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-sm border border-(--color-blue)/40 bg-(--color-panel) font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-(--color-line) bg-(--color-panel-raised) px-3 py-2">
          <span className="text-[11px] tracking-wide text-(--color-fg-dim)">digit_recognizer.exe</span>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center text-xs text-(--color-fg-faint) hover:text-(--color-red)"
            aria-label="Close digit recognizer"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col items-center gap-3 px-4 py-4">
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="aspect-square w-56 touch-none border border-(--color-line) select-none"
            onPointerDown={(e) => {
              drawingRef.current = true;
              lastPos.current = null;
              strokeTo(posFromEvent(e));
              setHasDrawing(true);
              setProbs(null);
            }}
            onPointerMove={(e) => drawingRef.current && strokeTo(posFromEvent(e))}
            onPointerUp={() => {
              drawingRef.current = false;
              lastPos.current = null;
            }}
            onPointerLeave={() => {
              drawingRef.current = false;
              lastPos.current = null;
            }}
          />

          <div className="flex gap-2 text-[11px]">
            <button onClick={clear} className="border border-(--color-line) px-3 py-1 hover:border-(--color-blue)">
              clear
            </button>
            <button
              onClick={predict}
              disabled={!hasDrawing}
              className="border border-(--color-blue) px-3 py-1 text-(--color-blue) hover:bg-(--color-blue)/10 disabled:opacity-40"
            >
              predict
            </button>
          </div>

          {probs && (
            <div className="w-full space-y-[3px] text-[10px]">
              {probs.map((p, digit) => (
                <div key={digit} className="flex items-center gap-2">
                  <span className={digit === predicted ? "text-(--color-blue)" : "text-(--color-fg-faint)"}>{digit}</span>
                  <div className="h-2 flex-1 bg-(--color-void)">
                    <div
                      className={digit === predicted ? "h-full bg-(--color-blue)" : "h-full bg-(--color-fg-faint)/50"}
                      style={{ width: `${Math.round(p * 100)}%` }}
                    />
                  </div>
                  <span className="w-9 text-right text-(--color-fg-faint)">{Math.round(p * 100)}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-(--color-line) px-3 py-2 text-[10px] text-(--color-fg-faint)">
          draw a digit 0-9, then predict — {Math.round(digitWeights.meta.accuracy * 100)}% test accuracy, trained
          offline on {digitWeights.meta.trainedOn} · click outside or Esc to close
        </div>
      </div>
    </div>
  );
}
