import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, type ProjectCategory } from "@/data/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { useDeviceCapability } from "@/lib/useDeviceCapability";
import { useLanguage } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger);

const CATEGORY_FILTERS: ("all" | ProjectCategory)[] = [
  "all",
  "systems",
  "security",
  "data-ai",
  "automation",
];

export function Projects() {
  const capability = useDeviceCapability();
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [pinEnabled, setPinEnabled] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"all" | ProjectCategory>("all");

  const filteredProjects = useMemo(
    () =>
      activeCategory === "all"
        ? projects
        : projects.filter((p) => p.category === activeCategory),
    [activeCategory],
  );

  useEffect(() => {
    const compute = () =>
      setPinEnabled(
        window.innerWidth >= 1024 && !capability.isTouch && !capability.reducedMotion,
      );
    if (capability.ready) compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [capability.ready, capability.isTouch, capability.reducedMotion]);

  useEffect(() => {
    if (!pinEnabled) return;
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const ctx = gsap.context(() => {
      if (track.scrollWidth - container.clientWidth <= 0) return;
      gsap.to(track, {
        // functions so GSAP re-measures on every ScrollTrigger.refresh() —
        // a static value here goes stale once webfonts finish swapping in
        // and the cards reflow wider, leaving the last card(s) unreachable.
        x: () => -(track.scrollWidth - container.clientWidth),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${track.scrollWidth - container.clientWidth}`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, container);

    document.fonts?.ready?.then(() => ScrollTrigger.refresh());

    return () => ctx.revert();
    // filteredProjects.length changes the track's scrollWidth — the pin's
    // travel distance has to be rebuilt from scratch, not just refreshed.
  }, [pinEnabled, filteredProjects.length]);

  useEffect(() => {
    if (trackRef.current && !pinEnabled) trackRef.current.scrollTo({ left: 0 });
  }, [activeCategory, pinEnabled]);

  return (
    <section id="projects" className="relative bg-(--color-void)">
      <div ref={containerRef} className="relative w-full overflow-hidden py-28">
        <div className="mx-auto mb-10 max-w-6xl px-6 sm:px-10 lg:px-20">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mb-3 font-mono text-xs tracking-[0.35em] text-(--color-blue)"
          >
            {t("projects.eyebrow")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="mb-4 font-display text-5xl text-(--color-fg) sm:text-6xl"
          >
            ps --projects
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 max-w-xl font-mono text-sm text-(--color-fg-dim)"
          >
            {t("projects.description")}{" "}
            <span className="hidden lg:inline">{t("projects.scrollHintDesktop")}</span>
            <span className="lg:hidden">{t("projects.scrollHintMobile")}</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="flex flex-wrap gap-2"
          >
            {CATEGORY_FILTERS.map((cat) => {
              const active = cat === activeCategory;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={active}
                  className={`rounded-sm border px-3 py-1.5 font-mono text-[11px] tracking-[0.15em] transition-colors ${
                    active
                      ? "border-(--color-blue) bg-(--color-blue)/10 text-(--color-blue)"
                      : "border-(--color-line) text-(--color-fg-faint) hover:border-(--color-fg-dim) hover:text-(--color-fg-dim)"
                  }`}
                >
                  [ {t(`projects.categories.${cat}`)} ]
                </button>
              );
            })}
          </motion.div>
        </div>

        <div
          ref={trackRef}
          className={`flex gap-6 px-6 sm:px-10 lg:px-20 ${
            pinEnabled
              ? "w-max"
              : "scrollbar-none snap-x snap-mandatory overflow-x-auto pb-6"
          }`}
        >
          {filteredProjects.map((project) => (
            <div key={project.id} className={pinEnabled ? "" : "snap-center"}>
              <ProjectCard project={project} />
            </div>
          ))}
          <div
            className={`flex w-[86vw] shrink-0 flex-col items-center justify-center gap-4 border border-dashed border-(--color-line) text-center sm:w-[70vw] md:w-[420px] ${
              pinEnabled ? "" : "snap-center"
            }`}
          >
            <p className="font-mono text-xs tracking-[0.2em] text-(--color-fg-faint)">
              ls ~/archive
            </p>
            <p className="max-w-[80%] font-mono text-[11px] leading-relaxed text-(--color-fg-faint)">
              {t("projects.archiveNote")}
            </p>
            <a
              href="https://github.com/adro0303?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-(--color-blue) transition-colors hover:text-(--color-cyan)"
            >
              {t("projects.viewGithub")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
