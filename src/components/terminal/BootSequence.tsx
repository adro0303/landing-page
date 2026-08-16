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

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function BootSequence({ onDone }: { onDone: () => void }) {
  const [shouldBoot] = useState(() => {
    if (typeof window === "undefined") return false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const already = sessionStorage.getItem("adro_os_booted") === "1";
    return !reduced && !already;
  });

  const [lines, setLines] = useState<string[]>([]);
  const [typed, setTyped] = useState("");
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    sessionStorage.setItem("adro_os_booted", "1");
    setLeaving(true);
    setTimeout(onDone, 480);
  };

  useEffect(() => {
    if (!shouldBoot) {
      sessionStorage.setItem("adro_os_booted", "1");
      onDone();
      return;
    }

    let cancelled = false;

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
      if (!cancelled) finish();
    }

    run();

    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      cancelled = true;
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldBoot]);

  if (!shouldBoot) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col justify-between bg-(--color-void) px-6 py-10 font-mono text-[13px] transition-opacity duration-500 sm:px-12 sm:py-16 sm:text-base ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="mx-auto w-full max-w-2xl">
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
      <div className="mx-auto flex w-full max-w-2xl justify-end">
        <span className="animate-blink text-[10px] tracking-[0.2em] text-(--color-fg-faint) sm:text-xs">
          PRESS ANY KEY TO SKIP
        </span>
      </div>
    </div>
  );
}
