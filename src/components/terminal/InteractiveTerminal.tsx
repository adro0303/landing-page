import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile, useProfileText, type ProfileText } from "@/data/profile";
import { localizeProject, projects } from "@/data/projects";
import { useLanguage, type Lang } from "@/lib/i18n";
import { OPEN_TERMINAL_EVENT, type OpenTerminalDetail } from "@/lib/terminalBus";
import { DigitRecognizer } from "./DigitRecognizer";
import { MatrixRain } from "./MatrixRain";
import { Pathfinder } from "./Pathfinder";
import { PlasmaEffect } from "./PlasmaEffect";
import { SortRace } from "./SortRace";

type Line = { text: string; tone?: "dim" | "accent" | "error" | "prompt" };

const WELCOME: Line[] = [
  { text: "adro_os hidden shell — type 'help' to list commands, Tab to autocomplete.", tone: "dim" },
  { text: "psst — try 'sort', 'pathfind', or 'digit' for real interactive tools.", tone: "accent" },
];

// commands offered by Tab-completion (sudo stays a hidden easter egg, not listed)
const COMMANDS = [
  "help",
  "whoami",
  "neofetch",
  "ls",
  "cat",
  "open",
  "github",
  "activity",
  "ask",
  "meta",
  "matrix",
  "sort",
  "pathfind",
  "digit",
  "contact",
  "plasma",
  "clear",
  "exit",
];

type GhRepo = { stargazers_count: number; language: string | null; pushed_at: string };

async function fetchGithubRepo(repoPath: string): Promise<GhRepo> {
  const cacheKey = `gh:${repoPath}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached) as GhRepo;
  const res = await fetch(`https://api.github.com/repos/${repoPath}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as GhRepo;
  sessionStorage.setItem(cacheKey, JSON.stringify(data));
  return data;
}

async function fetchReadmeLines(repoPath: string): Promise<string[]> {
  const cacheKey = `gh-readme:${repoPath}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached) as string[];
  const res = await fetch(`https://api.github.com/repos/${repoPath}/readme`, {
    headers: { Accept: "application/vnd.github.raw" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const raw = await res.text();
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("[![") && !l.startsWith("<img") && !l.startsWith("<p align"))
    .slice(0, 12);
  lines.push("…(truncated — full README on GitHub)");
  sessionStorage.setItem(cacheKey, JSON.stringify(lines));
  return lines;
}

type GhEvent = {
  type: string;
  repo: { name: string };
  created_at: string;
  payload?: { commits?: unknown[]; ref_type?: string; action?: string };
};

async function fetchGithubActivity(): Promise<GhEvent[]> {
  const cacheKey = "gh-activity";
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached) as GhEvent[];
  const res = await fetch(`https://api.github.com/users/${profile.handle}/events/public`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as GhEvent[];
  sessionStorage.setItem(cacheKey, JSON.stringify(data));
  return data;
}

function timeAgo(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function describeEvent(e: GhEvent): string {
  const repo = e.repo.name.replace(`${profile.handle}/`, "");
  switch (e.type) {
    case "PushEvent": {
      const n = e.payload?.commits?.length ?? 0;
      return `pushed ${n} commit${n === 1 ? "" : "s"} to ${repo}`;
    }
    case "CreateEvent":
      return `created ${e.payload?.ref_type ?? "ref"} in ${repo}`;
    case "PullRequestEvent":
      return `${e.payload?.action ?? "updated"} PR in ${repo}`;
    case "IssuesEvent":
      return `${e.payload?.action ?? "updated"} issue in ${repo}`;
    case "WatchEvent":
      return `starred ${repo}`;
    default:
      return `${e.type.replace("Event", "").toLowerCase()} in ${repo}`;
  }
}

function buildNeofetch(text: ProfileText): string[] {
  const techs = Array.from(new Set(projects.flatMap((p) => p.tech)));
  const row = (k: string, v: string) => `${k.padEnd(9)}${v}`;
  const lines = [
    "adro_os",
    "─────────────────────────────",
    row("name", profile.name),
    row("role", text.role),
    row("edu", text.education),
    row("stack", techs.join(", ")),
    row("projects", `${projects.length} shipped — ${profile.links.github}`),
    row("status", text.status),
    "",
    "focus:",
  ];
  text.focus.forEach((f) => lines.push(`  · ${f}`));
  return lines;
}

// local keyword search over profile.ts / projects.ts — not an LLM, no API calls
function answerAsk(query: string, text: ProfileText, lang: Lang): string[] {
  const q = query.toLowerCase();
  if (/(strongest|best) project/.test(q)) {
    const p = localizeProject(projects[0], lang);
    return [`${p.title} — ${p.tagline}`, `why: ${p.why}`];
  }
  if (/stack|tech|language/.test(q)) {
    return [Array.from(new Set(projects.flatMap((p) => p.tech))).join(", ")];
  }
  if (/open to work|hiring|available|job/.test(q)) {
    return [text.status];
  }
  if (/who|about you|yourself/.test(q)) {
    return [text.headline, text.bio];
  }
  if (/contact|email|reach/.test(q)) {
    return [profile.links.email, profile.links.linkedin, profile.links.github];
  }
  return [
    "no local match — this is keyword search over profile.ts / projects.ts, not an LLM.",
    "try: 'ask stack', 'ask best project', 'ask open to work', 'ask about you', 'ask contact'",
  ];
}

export function InteractiveTerminal() {
  const text = useProfileText();
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [value, setValue] = useState("");
  const [showPlasma, setShowPlasma] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [showPathfind, setShowPathfind] = useState(false);
  const [showDigit, setShowDigit] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number | null>(null);
  const [kbInset, setKbInset] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // lift the panel above the on-screen keyboard on mobile (fixed elements
  // don't reposition on their own when the visual viewport shrinks)
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const onResize = () => setKbInset(Math.max(0, window.innerHeight - vv.height - vv.offsetTop));
    vv.addEventListener("resize", onResize);
    vv.addEventListener("scroll", onResize);
    onResize();
    return () => {
      vv.removeEventListener("resize", onResize);
      vv.removeEventListener("scroll", onResize);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (showMatrix) {
        e.preventDefault();
        setShowMatrix(false);
        return;
      }
      if (showSort || showPathfind || showDigit) {
        if (e.key === "Escape") {
          setShowSort(false);
          setShowPathfind(false);
          setShowDigit(false);
        }
        return;
      }
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
  }, [open, showMatrix, showSort, showPathfind, showDigit]);

  useEffect(() => {
    // skip autofocus on touch devices — popping the keyboard the instant the
    // panel opens is jarring; let the user tap the input when ready
    if (!open || window.matchMedia("(pointer: coarse)").matches) return;
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    const onOpenRequest = (e: Event) => {
      const detail = (e as CustomEvent<OpenTerminalDetail>).detail;
      setOpen(true);
      if (detail?.source === "floppy") {
        setLines((prev) => [
          ...prev,
          { text: "floppy mounted as A:\\ — type 'help' to list commands.", tone: "accent" },
        ]);
      }
    };
    window.addEventListener(OPEN_TERMINAL_EVENT, onOpenRequest);
    return () => window.removeEventListener(OPEN_TERMINAL_EVENT, onOpenRequest);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines, showPlasma]);

  function print(text: string, tone?: Line["tone"]) {
    setLines((prev) => [...prev, { text, tone }]);
  }

  async function run(raw: string) {
    const cmd = raw.trim();
    if (!cmd) return;
    print(`guest@adro-os:~$ ${cmd}`, "prompt");
    setHistory((h) => [...h, cmd]);
    setHistoryIdx(null);

    const [head, ...rest] = cmd.toLowerCase().split(/\s+/);
    const arg = rest.join(" ");

    switch (head) {
      case "help":
        print("whoami [--full]        — who I am (--full for the whole profile)", "dim");
        print("neofetch               — same as whoami --full", "dim");
        print("ls [projects]          — list projects", "dim");
        print("open <project>         — jump to a project on the page", "dim");
        print("open <project> --readme — pull the project's real README from GitHub", "dim");
        print("github <project>       — live stars / language / last push from GitHub", "dim");
        print("activity               — my recent public GitHub activity, live", "dim");
        print("ask <question>         — local search over my profile (not AI)", "dim");
        print("cat motto.txt          — print my motto", "dim");
        print("contact                — email / linkedin / github", "dim");
        print("meta                   — how this site was built", "dim");
        print("matrix                 — full-screen visual, worth trying", "accent");
        print("sort                   — interactive sorting-algorithm race, worth trying", "accent");
        print("pathfind               — draw walls, watch A*/Dijkstra solve the maze", "accent");
        print("digit                  — draw a digit, a real neural net predicts it", "accent");
        print("plasma                 — screensaver, ^C to exit", "dim");
        print("clear · exit           — clear screen / close terminal", "dim");
        print("tip: Tab autocompletes, ↑/↓ browse command history", "accent");
        break;
      case "whoami":
        if (arg === "--full") buildNeofetch(text).forEach((l) => print(l, "dim"));
        else print(text.headline);
        break;
      case "neofetch":
        buildNeofetch(text).forEach((l) => print(l, "dim"));
        break;
      case "matrix":
        setShowMatrix(true);
        print("materializing — click / any key / Esc to exit", "dim");
        break;
      case "sort":
        setShowSort(true);
        print("opening sort_race.exe — pick an algorithm and hit run", "dim");
        break;
      case "pathfind":
        setShowPathfind(true);
        print("opening pathfinder.exe — draw walls, run A*/Dijkstra", "dim");
        break;
      case "digit":
        setShowDigit(true);
        print("opening digit_recognizer.exe — draw a digit, a tiny neural net guesses it", "dim");
        break;
      case "activity": {
        print("fetching recent public activity ...", "dim");
        try {
          const events = await fetchGithubActivity();
          if (events.length === 0) {
            print("no recent public activity.", "dim");
          } else {
            events.slice(0, 6).forEach((e) => print(`${timeAgo(e.created_at)}  ${describeEvent(e)}`, "accent"));
          }
        } catch (err) {
          print(`activity: fetch failed (${err instanceof Error ? err.message : "network error"})`, "error");
        }
        break;
      }
      case "ls":
        if (arg === "projects" || arg === "") {
          projects.forEach((p) => print(`  ${p.id}`, "accent"));
        } else {
          print(`ls: cannot access '${arg}': no such directory`, "error");
        }
        break;
      case "cat":
        if (arg.includes("motto")) print(`"${text.motto}"`, "accent");
        else if (arg.includes("bio")) print(text.bio);
        else print(`cat: ${arg || "(missing operand)"}: no such file`, "error");
        break;
      case "open": {
        const idArg = rest.find((r) => !r.startsWith("--")) ?? "";
        const match = projects.find((p) => p.id.includes(idArg));
        if (!match) {
          print(`open: '${idArg}' not found — try 'ls projects'`, "error");
          break;
        }
        if (rest.includes("--readme")) {
          const repoPath = match.href.replace("https://github.com/", "");
          print(`fetching README from github.com/${repoPath} ...`, "dim");
          try {
            (await fetchReadmeLines(repoPath)).forEach((l) => print(l, "dim"));
          } catch (err) {
            print(`open: readme fetch failed (${err instanceof Error ? err.message : "network error"})`, "error");
          }
          break;
        }
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
        const localized = localizeProject(match, lang);
        print(`opening ${localized.id} — ${localized.tagline}`, "accent");
        setOpen(false);
        break;
      }
      case "github": {
        const match = projects.find((p) => p.id.includes(rest[0] ?? ""));
        if (!match) {
          print(`github: '${rest[0] ?? ""}' not found — try 'ls projects'`, "error");
          break;
        }
        const repoPath = match.href.replace("https://github.com/", "");
        print(`fetching github.com/${repoPath} ...`, "dim");
        try {
          const repo = await fetchGithubRepo(repoPath);
          print(
            `★ ${repo.stargazers_count} stars · ${repo.language ?? "n/a"} · last push ${repo.pushed_at.slice(0, 10)}`,
            "accent"
          );
        } catch (err) {
          print(
            `github: fetch failed (${err instanceof Error ? err.message : "network error"}) — unauthenticated GitHub API is capped at ~60 req/hr`,
            "error"
          );
        }
        break;
      }
      case "ask": {
        if (!arg) {
          print("ask: usage — ask <question> (e.g. 'ask stack', 'ask best project', 'ask open to work')", "error");
          break;
        }
        answerAsk(arg, text, lang).forEach((l) => print(l, "accent"));
        break;
      }
      case "meta":
      case "story":
        print("built with Claude Code — an agentic coding CLI — through an iterative session:", "dim");
        print("the i18n toggle, mobile nav, the CSS-3D floppy disk, even this hidden terminal.", "dim");
        print("no template, no site generator — just prompts and real commits.", "dim");
        print(`repo: ${profile.links.github}`, "accent");
        break;
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

      {showMatrix && <MatrixRain onDismiss={() => setShowMatrix(false)} />}
      {showSort && <SortRace onClose={() => setShowSort(false)} />}
      {showPathfind && <Pathfinder onClose={() => setShowPathfind(false)} />}
      {showDigit && <DigitRecognizer onClose={() => setShowDigit(false)} />}

      <AnimatePresence>
        {open && (
          <motion.div
            key="hidden-terminal"
            initial={{ opacity: 0, scale: 0.6, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 16 }}
            transition={{ type: "spring", stiffness: 460, damping: 18, mass: 0.7 }}
            className="fixed inset-x-4 bottom-20 z-[70] mx-auto max-w-xl sm:right-5 sm:left-auto sm:w-[420px]"
            style={kbInset > 0 ? { bottom: kbInset + 16 } : undefined}
          >
            {/* rgb(43,220,110) is --color-blue's literal value (#2bdc6e, which
                renders green in this palette) — framer-motion's boxShadow
                keyframes need a concrete color to interpolate, not a
                var() it can't resolve mid-animation. */}
            <motion.div
              className="relative overflow-hidden rounded-sm border border-(--color-blue)/40 bg-(--color-void)/95 backdrop-blur-md"
              initial={{ boxShadow: "0 0 0px rgba(43,220,110,0)" }}
              animate={{
                boxShadow: [
                  "0 0 0px rgba(43,220,110,0)",
                  "0 0 70px rgba(43,220,110,0.75)",
                  "0 0 40px rgba(43,220,110,0.15)",
                ],
              }}
              transition={{ duration: 1, times: [0, 0.3, 1], ease: "easeOut" }}
            >
              {/* bright flash on open — the cue that something just happened */}
              <motion.div
                className="pointer-events-none absolute inset-0 z-20 bg-(--color-cyan)"
                initial={{ opacity: 0.65 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              />
            <div className="flex items-center justify-between border-b border-(--color-line) bg-(--color-panel-raised) px-3 py-2">
              <span className="font-mono text-[11px] tracking-wide text-(--color-fg-dim)">
                guest@adro-os: ~
              </span>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center font-mono text-xs text-(--color-fg-faint) hover:text-(--color-red)"
                aria-label="Close terminal"
              >
                ✕
              </button>
            </div>
            <div
              className="scrollbar-none h-48 cursor-text overflow-y-auto px-3 py-3 font-mono text-[12px] leading-relaxed sm:h-64"
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
                    } else if (e.key === "Tab") {
                      e.preventDefault();
                      const parts = value.split(" ");
                      if (parts.length === 1) {
                        const matches = COMMANDS.filter((c) => c.startsWith(parts[0].toLowerCase()));
                        if (matches.length === 1) setValue(matches[0]);
                      } else if (parts[0].toLowerCase() === "open" || parts[0].toLowerCase() === "github") {
                        const prefix = parts[parts.length - 1].toLowerCase();
                        const matches = projects.map((p) => p.id).filter((id) => id.startsWith(prefix));
                        if (matches.length === 1) setValue(`${parts[0].toLowerCase()} ${matches[0]}`);
                      }
                    }
                  }}
                  className="flex-1 bg-transparent text-base text-(--color-fg) caret-(--color-blue) outline-none sm:text-[12px]"
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  enterKeyHint="go"
                  spellCheck={false}
                  aria-label="Terminal command input"
                />
              </form>
              <div ref={endRef} />
            </div>
            <div className="border-t border-(--color-line) bg-(--color-panel-raised) px-3 py-1.5 font-mono text-[10px] text-(--color-fg-faint)">
              help · try &apos;sort&apos;, &apos;pathfind&apos;, &apos;digit&apos;, &apos;matrix&apos; · Tab autocomplete · Esc close
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
