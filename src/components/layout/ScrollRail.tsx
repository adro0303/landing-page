import { useEffect, useState } from "react";
import { sections, type SectionId } from "@/lib/sections";

export function ScrollRail() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<SectionId>("hero");

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id as SectionId);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Section progress"
      className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-0 lg:flex"
    >
      <div className="pointer-events-auto relative flex flex-col items-end">
        <div
          className="absolute right-[5px] top-0 w-px bg-(--color-line)"
          style={{ height: `${(sections.length - 1) * 44}px` }}
        />
        <div
          className="absolute right-[5px] top-0 w-px bg-(--color-blue) transition-[height] duration-150"
          style={{ height: `${progress * (sections.length - 1) * 44}px` }}
        />
        {sections.map((s) => {
          const isActive = s.id === active;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="group relative flex h-11 items-center gap-3"
              aria-current={isActive}
            >
              <span
                className={`rounded-sm px-2 py-1 font-mono text-[10px] tracking-[0.2em] backdrop-blur-sm transition-all duration-200 ${
                  isActive
                    ? "text-glow-blue border border-(--color-blue)/30 bg-(--color-void)/80 text-(--color-blue) opacity-100"
                    : "border border-transparent bg-(--color-void)/80 text-(--color-fg-faint) opacity-0 group-hover:opacity-100"
                }`}
              >
                {s.label}
              </span>
              <span
                className={`h-[9px] w-[9px] shrink-0 rotate-45 border transition-all duration-200 ${
                  isActive
                    ? "border-(--color-blue) bg-(--color-blue) box-glow-blue"
                    : "border-(--color-fg-faint) bg-transparent group-hover:border-(--color-blue)"
                }`}
              />
            </a>
          );
        })}
      </div>
    </nav>
  );
}
