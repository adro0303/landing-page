import { useEffect, useRef, useState } from "react";

const COLS = 20;
const ROWS = 11;
const START = 0;
const END = ROWS * COLS - 1;

type PFStep = { visited: number[]; path: number[] | null };

function neighbors(i: number): number[] {
  const r = Math.floor(i / COLS);
  const c = i % COLS;
  const out: number[] = [];
  if (r > 0) out.push(i - COLS);
  if (r < ROWS - 1) out.push(i + COLS);
  if (c > 0) out.push(i - 1);
  if (c < COLS - 1) out.push(i + 1);
  return out;
}

function reconstruct(prev: Map<number, number>, end: number): number[] | null {
  if (!prev.has(end) && end !== START) return null;
  const path = [end];
  let cur = end;
  while (cur !== START) {
    const p = prev.get(cur);
    if (p === undefined) return null;
    cur = p;
    path.push(cur);
  }
  return path.reverse();
}

function* search(walls: Set<number>, heuristic: (i: number) => number): Generator<PFStep> {
  const dist = new Map<number, number>([[START, 0]]);
  const prev = new Map<number, number>();
  const visited = new Set<number>();
  const open = [START];
  while (open.length) {
    open.sort((a, b) => (dist.get(a) ?? Infinity) + heuristic(a) - ((dist.get(b) ?? Infinity) + heuristic(b)));
    const cur = open.shift();
    if (cur === undefined || visited.has(cur)) continue;
    visited.add(cur);
    yield { visited: [...visited], path: null };
    if (cur === END) break;
    for (const n of neighbors(cur)) {
      if (walls.has(n) || visited.has(n)) continue;
      const nd = (dist.get(cur) ?? Infinity) + 1;
      if (nd < (dist.get(n) ?? Infinity)) {
        dist.set(n, nd);
        prev.set(n, cur);
        open.push(n);
      }
    }
  }
  yield { visited: [...visited], path: reconstruct(prev, END) };
}

function manhattan(i: number): number {
  const r = Math.floor(i / COLS);
  const c = i % COLS;
  const er = Math.floor(END / COLS);
  const ec = END % COLS;
  return Math.abs(r - er) + Math.abs(c - ec);
}

const ALGOS = {
  astar: (walls: Set<number>) => search(walls, manhattan),
  dijkstra: (walls: Set<number>) => search(walls, () => 0),
} as const;
type AlgoName = keyof typeof ALGOS;

export function Pathfinder({ onClose }: { onClose: () => void }) {
  const [algo, setAlgo] = useState<AlgoName>("astar");
  const [walls, setWalls] = useState<Set<number>>(() => new Set());
  const [visited, setVisited] = useState<Set<number>>(() => new Set());
  const [path, setPath] = useState<number[] | null>(null);
  const [running, setRunning] = useState(false);
  const [ran, setRan] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const paintModeRef = useRef(true);
  const stepsRef = useRef<PFStep[]>([]);
  const idxRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    const steps = stepsRef.current;
    const perTick = Math.max(1, Math.ceil(steps.length / 180));
    const id = setInterval(() => {
      idxRef.current = Math.min(idxRef.current + perTick, steps.length);
      const step = steps[idxRef.current - 1];
      if (step) {
        setVisited(new Set(step.visited));
        setPath(step.path);
      }
      if (idxRef.current >= steps.length) {
        clearInterval(id);
        setRunning(false);
      }
    }, 16);
    return () => clearInterval(id);
  }, [running]);

  function toggleWallAt(idx: number, add: boolean) {
    if (idx === START || idx === END) return;
    setWalls((prev) => {
      const next = new Set(prev);
      if (add) next.add(idx);
      else next.delete(idx);
      return next;
    });
  }

  function paintAt(clientX: number, clientY: number) {
    const el = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
    const idx = el?.dataset.idx;
    if (idx !== undefined) toggleWallAt(Number(idx), paintModeRef.current);
  }

  function run() {
    stepsRef.current = Array.from(ALGOS[algo](walls));
    idxRef.current = 0;
    setVisited(new Set());
    setPath(null);
    setRan(true);
    setRunning(true);
  }

  function clearWalls() {
    setRunning(false);
    setRan(false);
    setWalls(new Set());
    setVisited(new Set());
    setPath(null);
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-(--color-void)/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-sm border border-(--color-blue)/40 bg-(--color-panel) font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-(--color-line) bg-(--color-panel-raised) px-3 py-2">
          <span className="text-[11px] tracking-wide text-(--color-fg-dim)">pathfinder.exe</span>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center text-xs text-(--color-fg-faint) hover:text-(--color-red)"
            aria-label="Close pathfinder"
          >
            ✕
          </button>
        </div>

        <div
          className="grid touch-none gap-[1px] border-b border-(--color-line) bg-(--color-line) p-[1px] select-none"
          style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
          onPointerDown={(e) => {
            const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
            const idx = el?.dataset.idx ? Number(el.dataset.idx) : null;
            if (idx !== null && idx !== START && idx !== END) paintModeRef.current = !walls.has(idx);
            setDrawing(true);
            paintAt(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => drawing && paintAt(e.clientX, e.clientY)}
          onPointerUp={() => setDrawing(false)}
          onPointerLeave={() => setDrawing(false)}
        >
          {Array.from({ length: ROWS * COLS }, (_, i) => {
            const isPath = path?.includes(i);
            const bg =
              i === START
                ? "bg-(--color-green)"
                : i === END
                  ? "bg-(--color-red)"
                  : walls.has(i)
                    ? "bg-(--color-fg-faint)"
                    : isPath
                      ? "bg-(--color-cyan)"
                      : visited.has(i)
                        ? "bg-(--color-blue)/30"
                        : "bg-(--color-void)";
            return <div key={i} data-idx={i} className={`aspect-square ${bg}`} />;
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-[11px]">
          <div className="flex gap-2">
            {(Object.keys(ALGOS) as AlgoName[]).map((name) => (
              <button
                key={name}
                onClick={() => setAlgo(name)}
                disabled={running}
                className={`border px-2 py-1 ${
                  algo === name ? "border-(--color-blue) text-(--color-blue)" : "border-(--color-line) text-(--color-fg-faint)"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={clearWalls}
              disabled={running}
              className="border border-(--color-line) px-2 py-1 hover:border-(--color-blue)"
            >
              clear walls
            </button>
            <button
              onClick={run}
              disabled={running}
              className="border border-(--color-blue) px-2 py-1 text-(--color-blue) hover:bg-(--color-blue)/10"
            >
              run
            </button>
          </div>
        </div>
        <div className="px-3 pb-2 text-[10px] text-(--color-fg-faint)">
          {ran && !running && path === null ? "no path found — " : ""}draw walls, pick an algorithm, run · click
          outside or Esc to close
        </div>
      </div>
    </div>
  );
}
