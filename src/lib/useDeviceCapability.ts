import { useEffect, useState } from "react";

export type DeviceCapability = {
  ready: boolean;
  webgl: boolean;
  reducedMotion: boolean;
  isTouch: boolean;
  isNarrow: boolean;
  /** "high" = capable device, safe to run denser canvas/particle effects */
  tier: "high" | "low";
};

function detectWebgl(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

function computeCapability(): DeviceCapability {
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const isTouch =
    typeof window !== "undefined" &&
    window.matchMedia?.("(pointer: coarse)").matches;
  const isNarrow = typeof window !== "undefined" && window.innerWidth < 860;
  const webgl = typeof window !== "undefined" && detectWebgl();

  const cores = (navigator as Navigator & { hardwareConcurrency?: number })
    .hardwareConcurrency;
  const memory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;

  const lowPowerHeuristic =
    (typeof cores === "number" && cores <= 4) ||
    (typeof memory === "number" && memory <= 4);

  const tier: DeviceCapability["tier"] =
    webgl && !reducedMotion && !isNarrow && !(isTouch && lowPowerHeuristic)
      ? "high"
      : "low";

  return { ready: true, webgl, reducedMotion, isTouch, isNarrow, tier };
}

const fallback: DeviceCapability = {
  ready: false,
  webgl: false,
  reducedMotion: false,
  isTouch: false,
  isNarrow: false,
  tier: "low",
};

export function useDeviceCapability(): DeviceCapability {
  const [capability, setCapability] = useState<DeviceCapability>(fallback);

  useEffect(() => {
    setCapability(computeCapability());

    const mq = window.matchMedia("(max-width: 859px)");
    const handleResize = () => setCapability(computeCapability());
    mq.addEventListener("change", handleResize);
    window.addEventListener("resize", handleResize);
    return () => {
      mq.removeEventListener("change", handleResize);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return capability;
}
