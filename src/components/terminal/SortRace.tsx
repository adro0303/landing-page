import { useEffect, useRef, useState } from "react";

const N = 32;

type Step = { array: number[]; active: [number, number] | null; comparisons: number; swaps: number };
type AlgoName = "bubble" | "selection" | "merge" | "quick";

function* bubbleSort(arr: number[]): Generator<Step> {
  const a = [...arr];
  let comparisons = 0;
  let swaps = 0;
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      comparisons++;
      yield { array: [...a], active: [j, j + 1], comparisons, swaps };
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swaps++;
        yield { array: [...a], active: [j, j + 1], comparisons, swaps };
      }
    }
  }
  yield { array: [...a], active: null, comparisons, swaps };
}

function* selectionSort(arr: number[]): Generator<Step> {
  const a = [...arr];
  let comparisons = 0;
  let swaps = 0;
  for (let i = 0; i < a.length; i++) {
    let min = i;
    for (let j = i + 1; j < a.length; j++) {
      comparisons++;
      yield { array: [...a], active: [min, j], comparisons, swaps };
      if (a[j] < a[min]) min = j;
    }
    if (min !== i) {
      [a[i], a[min]] = [a[min], a[i]];
      swaps++;
      yield { array: [...a], active: [i, min], comparisons, swaps };
    }
  }
  yield { array: [...a], active: null, comparisons, swaps };
}

function* mergeSort(arr: number[]): Generator<Step> {
  const a = [...arr];
  let comparisons = 0;
  let swaps = 0;
  function* sort(lo: number, hi: number): Generator<Step> {
    if (hi - lo <= 1) return;
    const mid = Math.floor((lo + hi) / 2);
    yield* sort(lo, mid);
    yield* sort(mid, hi);
    const left = a.slice(lo, mid);
    const right = a.slice(mid, hi);
    let i = 0;
    let j = 0;
    let k = lo;
    while (i < left.length && j < right.length) {
      comparisons++;
      yield { array: [...a], active: [lo + i, mid + j], comparisons, swaps };
      a[k] = left[i] <= right[j] ? left[i++] : right[j++];
      k++;
      swaps++;
      yield { array: [...a], active: [k - 1, k - 1], comparisons, swaps };
    }
    while (i < left.length) {
      a[k] = left[i++];
      swaps++;
      yield { array: [...a], active: [k, k], comparisons, swaps };
      k++;
    }
    while (j < right.length) {
      a[k] = right[j++];
      swaps++;
      yield { array: [...a], active: [k, k], comparisons, swaps };
      k++;
    }
  }
  yield* sort(0, a.length);
  yield { array: [...a], active: null, comparisons, swaps };
}

function* quickSort(arr: number[]): Generator<Step> {
  const a = [...arr];
  let comparisons = 0;
  let swaps = 0;
  function* sort(lo: number, hi: number): Generator<Step> {
    if (lo >= hi) return;
    const pivot = a[hi];
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      comparisons++;
      yield { array: [...a], active: [j, hi], comparisons, swaps };
      if (a[j] < pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        swaps++;
        yield { array: [...a], active: [i, j], comparisons, swaps };
      }
    }
    [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
    swaps++;
    yield { array: [...a], active: [i + 1, hi], comparisons, swaps };
    yield* sort(lo, i);
    yield* sort(i + 2, hi);
  }
  yield* sort(0, a.length - 1);
  yield { array: [...a], active: null, comparisons, swaps };
}

const ALGOS: Record<AlgoName, (a: number[]) => Generator<Step>> = {
  bubble: bubbleSort,
  selection: selectionSort,
  merge: mergeSort,
  quick: quickSort,
};

const ALGO_LABELS: Record<AlgoName, string> = {
  bubble: "bubble sort — O(n²)",
  selection: "selection sort — O(n²)",
  merge: "merge sort — O(n log n)",
  quick: "quick sort — O(n log n) avg",
};

function shuffled(n: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i + 1);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function SortRace({ onClose }: { onClose: () => void }) {
  const [algo, setAlgo] = useState<AlgoName>("quick");
  const [values, setValues] = useState<number[]>(() => shuffled(N));
  const [active, setActive] = useState<[number, number] | null>(null);
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const stepsRef = useRef<Step[]>([]);
  const idxRef = useRef(0);
  const audioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.close();
    };
  }, []);

  function beep(value: number) {
    if (!soundOn) return;
    audioRef.current ??= new AudioContext();
    const ctx = audioRef.current;
    if (ctx.state === "suspended") ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 220 + (value / N) * 660;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  }

  useEffect(() => {
    if (!running) return;
    const steps = stepsRef.current;
    const perTick = Math.max(1, Math.ceil(steps.length / 240));
    const id = setInterval(() => {
      idxRef.current = Math.min(idxRef.current + perTick, steps.length);
      const step = steps[idxRef.current - 1];
      if (step) {
        setValues(step.array);
        setActive(step.active);
        setStats({ comparisons: step.comparisons, swaps: step.swaps });
        if (step.active) beep(step.array[step.active[0]]);
      }
      if (idxRef.current >= steps.length) {
        clearInterval(id);
        setRunning(false);
        setDone(true);
        setActive(null);
      }
    }, 16);
    return () => clearInterval(id);
  }, [running, soundOn]);

  function shuffle() {
    setRunning(false);
    setDone(false);
    setActive(null);
    setStats({ comparisons: 0, swaps: 0 });
    setValues(shuffled(N));
  }

  function start() {
    stepsRef.current = Array.from(ALGOS[algo](values));
    idxRef.current = 0;
    setDone(false);
    setRunning(true);
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
          <span className="text-[11px] tracking-wide text-(--color-fg-dim)">sort_race.exe</span>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center text-xs text-(--color-fg-faint) hover:text-(--color-red)"
            aria-label="Close sort race"
          >
            ✕
          </button>
        </div>

        <div className="flex h-40 items-end gap-[2px] border-b border-(--color-line) bg-(--color-void) px-3 py-3">
          {values.map((v, i) => (
            <div
              key={i}
              className={`flex-1 transition-colors ${
                active?.includes(i) ? "bg-(--color-red)" : done ? "bg-(--color-green)" : "bg-(--color-blue)"
              }`}
              style={{ height: `${(v / N) * 100}%` }}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 px-3 py-2 text-[11px]">
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

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-(--color-line) px-3 py-2 text-[11px] text-(--color-fg-faint)">
          <span>
            comparisons {stats.comparisons} · swaps {stats.swaps}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setSoundOn((v) => !v)}
              className={`border px-2 py-1 ${
                soundOn ? "border-(--color-blue) text-(--color-blue)" : "border-(--color-line) text-(--color-fg-faint)"
              }`}
            >
              sound {soundOn ? "on" : "off"}
            </button>
            <button
              onClick={shuffle}
              disabled={running}
              className="border border-(--color-line) px-2 py-1 hover:border-(--color-blue)"
            >
              shuffle
            </button>
            <button
              onClick={start}
              disabled={running}
              className="border border-(--color-blue) px-2 py-1 text-(--color-blue) hover:bg-(--color-blue)/10"
            >
              {done ? "run again" : "run"}
            </button>
          </div>
        </div>
        <div className="px-3 pb-2 text-[10px] text-(--color-fg-faint)">
          {ALGO_LABELS[algo]} · click outside or Esc to close
        </div>
      </div>
    </div>
  );
}
