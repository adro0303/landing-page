import { useState } from "react";
import { digitWeights } from "@/data/digitWeights";

const SIZE = 8;

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

function emptyGrid(): number[] {
  return new Array(SIZE * SIZE).fill(0);
}

export function DigitRecognizer({ onClose }: { onClose: () => void }) {
  const [pixels, setPixels] = useState<number[]>(emptyGrid);
  const [drawing, setDrawing] = useState(false);
  const [probs, setProbs] = useState<number[] | null>(null);

  function paint(idx: number) {
    setPixels((prev) => {
      const next = [...prev];
      const r = Math.floor(idx / SIZE);
      const c = idx % SIZE;
      const bump = (rr: number, cc: number, amt: number) => {
        if (rr < 0 || rr >= SIZE || cc < 0 || cc >= SIZE) return;
        const i = rr * SIZE + cc;
        next[i] = Math.min(1, next[i] + amt);
      };
      bump(r, c, 1);
      bump(r - 1, c, 0.35);
      bump(r + 1, c, 0.35);
      bump(r, c - 1, 0.35);
      bump(r, c + 1, 0.35);
      return next;
    });
    setProbs(null);
  }

  function paintAt(clientX: number, clientY: number) {
    const el = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
    const idx = el?.dataset.idx;
    if (idx !== undefined) paint(Number(idx));
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
          <div
            className="grid aspect-square w-48 touch-none gap-[2px] border border-(--color-line) bg-(--color-void) p-1 select-none"
            style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}
            onPointerDown={(e) => {
              setDrawing(true);
              paintAt(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => drawing && paintAt(e.clientX, e.clientY)}
            onPointerUp={() => setDrawing(false)}
            onPointerLeave={() => setDrawing(false)}
          >
            {pixels.map((v, i) => (
              <div
                key={i}
                data-idx={i}
                className="aspect-square"
                style={{ backgroundColor: `rgba(43,220,110,${v})` }}
              />
            ))}
          </div>

          <div className="flex gap-2 text-[11px]">
            <button
              onClick={() => {
                setPixels(emptyGrid());
                setProbs(null);
              }}
              className="border border-(--color-line) px-3 py-1 hover:border-(--color-blue)"
            >
              clear
            </button>
            <button
              onClick={() => setProbs(forward(pixels))}
              className="border border-(--color-blue) px-3 py-1 text-(--color-blue) hover:bg-(--color-blue)/10"
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
