import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";

const LINES = [
  "ADRO_OS v2.6 — boot sequence initiated",
  "mounting /dev/github as adro0303 ... OK",
  "loading kernel modules: python, pytorch, scikit-learn ... OK",
  `> ${profile.motto}`,
  "establishing uplink ... 200ms",
  "calibrating CRT phosphors ... OK",
  "starting interface_",
];

const FLICKER_MS = 750;
const SWEEP_MS = 650;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type Phase = "log" | "flicker" | "sweep";

export function BootSequence({ onDone }: { onDone: () => void }) {
  const [shouldBoot] = useState(() => {
    if (typeof window === "undefined") return false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const already = sessionStorage.getItem("adro_os_booted") === "1";
    return !reduced && !already;
  });

  const [phase, setPhase] = useState<Phase>("log");
  const [lines, setLines] = useState<string[]>([]);
  const [typed, setTyped] = useState("");
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    sessionStorage.setItem("adro_os_booted", "1");
    onDone();
  };

  useEffect(() => {
    if (!shouldBoot) {
      sessionStorage.setItem("adro_os_booted", "1");
      onDone();
      return;
    }

    let cancelled = false;
    let flickerTimer: ReturnType<typeof setTimeout> | undefined;
    let sweepTimer: ReturnType<typeof setTimeout> | undefined;

    async function run() {
      for (const line of LINES) {
        if (cancelled) return;
        for (let c = 1; c <= line.length; c++) {
          if (cancelled) return;
          setTyped(line.slice(0, c));
          await sleep(line.startsWith(">") ? 30 : 12);
        }
        if (cancelled) return;
        setLines((prev) => [...prev, line]);
        setTyped("");
        await sleep(110);
      }
      await sleep(320);
      if (cancelled) return;
      setLeaving(true);
      await sleep(420);
      if (cancelled) return;
      setPhase("flicker");
      flickerTimer = setTimeout(() => {
        if (cancelled) return;
        setPhase("sweep");
        sweepTimer = setTimeout(finish, SWEEP_MS);
      }, FLICKER_MS);
    }

    run();

    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      cancelled = true;
      clearTimeout(flickerTimer);
      clearTimeout(sweepTimer);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldBoot]);

  if (!shouldBoot) return null;

  if (phase === "flicker") {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-(--color-void)">
        <span
          className="font-display text-glow-phosphor text-balance px-6 text-center text-[2.5rem] tracking-wide text-(--color-phosphor) sm:text-[4rem] md:text-[5rem]"
          style={{ animation: `boot-name-flicker ${FLICKER_MS}ms steps(1) forwards` }}
        >
          ADRIAN PLIEGO
        </span>
      </div>
    );
  }

  if (phase === "sweep") {
    return (
      <>
        <div
          className="fixed inset-0 z-[100] bg-(--color-void)"
          style={{ animation: `boot-sweep-cover ${SWEEP_MS}ms ease-in forwards` }}
        />
        <div
          className="fixed inset-x-0 z-[101] h-[3px]"
          style={{
            background: "var(--color-phosphor-hot)",
            boxShadow:
              "0 0 8px 2px var(--color-phosphor-bright), 0 0 24px 6px color-mix(in srgb, var(--color-phosphor) 60%, transparent)",
            animation: `boot-sweep-beam ${SWEEP_MS}ms ease-in forwards`,
          }}
        />
      </>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-between bg-(--color-void) px-6 py-10 font-mono text-[13px] sm:px-12 sm:py-16 sm:text-base">
      <div
        className={`mx-auto w-full max-w-2xl transition-opacity duration-500 ${
          leaving ? "opacity-0" : "opacity-100"
        }`}
      >
        {lines.map((line, i) => (
          <p
            key={i}
            className={line.startsWith(">") ? "text-(--color-green)" : "text-(--color-fg-dim)"}
          >
            {line}
          </p>
        ))}
        <p className={typed.startsWith(">") ? "text-(--color-green)" : "text-(--color-fg-dim)"}>
          {typed}
          <span className="animate-blink text-(--color-blue)">▌</span>
        </p>
      </div>
      <div
        className={`mx-auto flex w-full max-w-2xl justify-end transition-opacity duration-500 ${
          leaving ? "opacity-0" : "opacity-100"
        }`}
      >
        <span className="animate-blink text-[10px] tracking-[0.2em] text-(--color-fg-faint) sm:text-xs">
          PRESS ANY KEY TO SKIP
        </span>
      </div>
    </div>
  );
}
