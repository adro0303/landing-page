import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { useDeviceCapability } from "@/lib/useDeviceCapability";

gsap.registerPlugin(ScrollTrigger);

export function Projects() {
  const capability = useDeviceCapability();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [pinEnabled, setPinEnabled] = useState(false);

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
      const distance = track.scrollWidth - container.clientWidth;
      if (distance <= 0) return;
      gsap.to(track, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${distance}`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, container);

    return () => ctx.revert();
  }, [pinEnabled]);

  return (
    <section id="projects" className="relative bg-(--color-void)">
      <div ref={containerRef} className="relative w-full overflow-hidden py-28">
        <div className="mx-auto mb-12 max-w-6xl px-6 sm:px-10 lg:px-20">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mb-3 font-mono text-xs tracking-[0.35em] text-(--color-blue)"
          >
            03 // ACTIVE PROCESSES
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
            className="max-w-xl font-mono text-sm text-(--color-fg-dim)"
          >
            Six real repos, activated one at a time.{" "}
            <span className="hidden lg:inline">Keep scrolling — this section moves sideways.</span>
            <span className="lg:hidden">Swipe to explore.</span>
          </motion.p>
        </div>

        <div
          ref={trackRef}
          className={`flex gap-6 px-6 sm:px-10 lg:px-20 ${
            pinEnabled
              ? "w-max"
              : "scrollbar-none snap-x snap-mandatory overflow-x-auto pb-6"
          }`}
        >
          {projects.map((project) => (
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
              {`// earlier coursework & experiments`}
            </p>
            <a
              href="https://github.com/adro0303?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-(--color-blue) transition-colors hover:text-(--color-cyan)"
            >
              view full GitHub →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
