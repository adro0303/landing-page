# ADRO_OS

Adrián's personal landing page / portfolio, built as an interactive retro-terminal
operating system rather than a conventional Hero → About → Skills → Projects page.

Boot sequence → 3D terminal-core hero (React Three Fiber) → `whoami` identity
terminal → a circuit "blueprint" of the real stack → six real GitHub projects,
each rendered with a visual metaphor matched to what it actually does → an
uplink/contact panel → a hidden `~` shell with a few easter eggs.

All project data, bio facts, and stack badges in `src/data/` are sourced from
the real `adro0303` GitHub profile and repo READMEs — nothing fabricated.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4 (CSS-first theme, see `src/index.css`)
- React Three Fiber / drei / postprocessing — hero scene only, lazy-loaded
- GSAP + ScrollTrigger — pinned horizontal scroll for the Projects section
- Framer Motion — scroll-reveal animations

## Performance & responsiveness

- `useDeviceCapability` (`src/lib/useDeviceCapability.ts`) detects WebGL
  support, `prefers-reduced-motion`, touch input, and rough device power. The
  R3F hero only mounts on capable desktop devices; everything else gets a
  cheap animated canvas2D fallback (`HeroFallback.tsx`) with the same layout.
- The Three.js/R3F/postprocessing bundle is code-split behind `React.lazy` —
  it's never downloaded on mobile or low-power devices.
- The hero's `frameloop` pauses when scrolled out of view.
- The Projects section's GSAP pin-scroll is desktop-only; mobile/touch gets a
  native `scroll-snap` swipe carousel instead of a hijacked scroll.
- `prefers-reduced-motion` disables the boot sequence typing, pin-scroll, and
  canvas animation loops.

## Commands

```bash
npm install
npm run dev       # local dev server
npm run build     # type-check + production build
npm run preview   # preview the production build
npm run lint      # oxlint
```

## Structure

```
src/
  data/        # real bio, stack and project data (single source of truth)
  lib/         # device capability, typewriter, section list hooks
  components/
    hero/      # HeroScene (R3F), HeroFallback (canvas2D), HeroSection
    terminal/  # BootSequence, hidden InteractiveTerminal, PlasmaEffect
    layout/    # CRTOverlay, ScrollRail, TerminalWindow chrome
    sections/  # Identity, StackBlueprint, Projects, Uplink
    projects/  # per-project-kind visualizations + ProjectCard
```
