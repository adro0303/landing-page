import { useEffect, useRef, useState } from "react";

const FLICKER_MS = 750;
const SWEEP_MS = 650;

type Phase = "flicker" | "sweep";

export function BootSequence({ onDone }: { onDone: () => void }) {
  const [shouldBoot] = useState(() => {
    if (typeof window === "undefined") return false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const already = sessionStorage.getItem("adro_os_booted") === "1";
    return !reduced && !already;
  });

  const [phase, setPhase] = useState<Phase>("flicker");
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

    const toSweep = setTimeout(() => setPhase("sweep"), FLICKER_MS);
    const toDone = setTimeout(finish, FLICKER_MS + SWEEP_MS);

    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      clearTimeout(toSweep);
      clearTimeout(toDone);
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
