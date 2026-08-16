import { useEffect, useState } from "react";

export function useTypewriter(
  text: string,
  { speed = 28, startDelay = 0, active = true }: { speed?: number; startDelay?: number; active?: boolean } = {},
) {
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) return;
    let i = 0;
    setOutput("");
    setDone(false);
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setOutput(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed, startDelay, active]);

  return { output, done };
}
