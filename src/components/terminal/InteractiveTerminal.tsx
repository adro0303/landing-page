import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { PlasmaEffect } from "./PlasmaEffect";

type Line = { text: string; tone?: "dim" | "accent" | "error" | "prompt" };

const WELCOME: Line[] = [
  { text: "adro_os hidden shell — type 'help' to list commands.", tone: "dim" },
];

export function InteractiveTerminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [value, setValue] = useState("");
  const [showPlasma, setShowPlasma] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      if (e.key === "`" || e.key === "~") {
        if (!isTyping) {
          e.preventDefault();
          setOpen((v) => !v);
        }
      }
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines, showPlasma]);

  function print(text: string, tone?: Line["tone"]) {
    setLines((prev) => [...prev, { text, tone }]);
  }

  function run(raw: string) {
    const cmd = raw.trim();
    if (!cmd) return;
    print(`guest@adro-os:~$ ${cmd}`, "prompt");
    setHistory((h) => [...h, cmd]);
    setHistoryIdx(null);

    const [head, ...rest] = cmd.toLowerCase().split(/\s+/);
    const arg = rest.join(" ");

    switch (head) {
      case "help":
        print("help · whoami · ls [projects] · cat motto.txt · open <project> · contact · plasma · clear · exit", "dim");
        break;
      case "whoami":
        print(profile.headline);
        break;
      case "ls":
        if (arg === "projects" || arg === "") {
          projects.forEach((p) => print(`  ${p.id}`, "accent"));
        } else {
          print(`ls: cannot access '${arg}': no such directory`, "error");
        }
        break;
      case "cat":
        if (arg.includes("motto")) print(`"${profile.motto}"`, "accent");
        else if (arg.includes("bio")) print(profile.bio);
        else print(`cat: ${arg || "(missing operand)"}: no such file`, "error");
        break;
      case "open": {
        const match = projects.find((p) => p.id.includes(rest[0] ?? ""));
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
        if (match) {
          print(`opening ${match.id} — ${match.tagline}`, "accent");
          setOpen(false);
        } else {
          print(`open: '${rest[0] ?? ""}' not found — try 'ls projects'`, "error");
        }
        break;
      }
      case "contact":
        print(profile.links.email, "accent");
        print(profile.links.linkedin, "accent");
        print(profile.links.github, "accent");
        break;
      case "sudo":
        print("permission denied: this incident will not be reported (probably)", "error");
        break;
      case "plasma":
        setShowPlasma(true);
        print("^C to exit", "dim");
        break;
      case "clear":
        setLines([]);
        break;
      case "exit":
        setOpen(false);
        break;
      default:
        print(`command not found: ${head} — try 'help'`, "error");
    }
  }

  function toneClass(tone?: Line["tone"]) {
    switch (tone) {
      case "dim":
        return "text-(--color-fg-faint)";
      case "accent":
        return "text-(--color-cyan)";
      case "error":
        return "text-(--color-red)";
      case "prompt":
        return "text-(--color-fg)";
      default:
        return "text-(--color-fg-dim)";
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed right-5 bottom-5 z-[70] flex h-11 w-11 items-center justify-center border border-(--color-line) bg-(--color-panel)/90 font-mono text-sm text-(--color-blue) backdrop-blur-sm transition-colors hover:border-(--color-blue)"
        aria-label="Toggle hidden terminal"
      >
        &gt;_
      </button>

      {open && (
        <div className="fixed inset-x-4 bottom-20 z-[70] mx-auto max-w-xl sm:right-5 sm:left-auto sm:w-[420px]">
          <div className="overflow-hidden rounded-sm border border-(--color-blue)/40 bg-(--color-void)/95 shadow-[0_0_40px_rgba(88,166,255,0.15)] backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-(--color-line) bg-(--color-panel-raised) px-3 py-2">
              <span className="font-mono text-[11px] tracking-wide text-(--color-fg-dim)">
                guest@adro-os: ~
              </span>
              <button
                onClick={() => setOpen(false)}
                className="font-mono text-xs text-(--color-fg-faint) hover:text-(--color-red)"
                aria-label="Close terminal"
              >
                ✕
              </button>
            </div>
            <div
              className="scrollbar-none h-64 cursor-text overflow-y-auto px-3 py-3 font-mono text-[12px] leading-relaxed"
              onClick={() => inputRef.current?.focus()}
            >
              {lines.map((line, i) => (
                <p key={i} className={toneClass(line.tone)}>
                  {line.text}
                </p>
              ))}
              {showPlasma && (
                <div className="my-1">
                  <PlasmaEffect />
                </div>
              )}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (showPlasma) {
                    setShowPlasma(false);
                  } else {
                    run(value);
                  }
                  setValue("");
                }}
                className="flex items-center gap-1.5"
              >
                <span className="text-(--color-green)">guest@adro-os:~$</span>
                <input
                  ref={inputRef}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowUp") {
                      e.preventDefault();
                      if (history.length === 0) return;
                      const nextIdx =
                        historyIdx === null ? history.length - 1 : Math.max(0, historyIdx - 1);
                      setHistoryIdx(nextIdx);
                      setValue(history[nextIdx]);
                    } else if (e.key === "ArrowDown") {
                      e.preventDefault();
                      if (historyIdx === null) return;
                      const nextIdx = historyIdx + 1;
                      if (nextIdx >= history.length) {
                        setHistoryIdx(null);
                        setValue("");
                      } else {
                        setHistoryIdx(nextIdx);
                        setValue(history[nextIdx]);
                      }
                    } else if (e.key === "c" && e.ctrlKey && showPlasma) {
                      setShowPlasma(false);
                    }
                  }}
                  className="flex-1 bg-transparent text-(--color-fg) caret-(--color-blue) outline-none"
                  autoComplete="off"
                  spellCheck={false}
                  aria-label="Terminal command input"
                />
              </form>
              <div ref={endRef} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
