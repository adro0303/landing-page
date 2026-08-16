# ADRO_OS

Adrián's personal landing page / portfolio, built as an interactive retro-terminal
operating system rather than a conventional Hero → About → Skills → Projects page.

Boot sequence → a phosphor-green CRT hero with a hidden ASCII statue that
reveals itself as the cursor scans over it → `whoami` identity terminal → a
circuit "blueprint" of the real stack → six real GitHub projects, each
rendered with a visual metaphor matched to what it actually does → an
uplink/contact panel → a hidden `~` shell with a few easter eggs.

All project data, bio facts, and stack badges in `src/data/` are sourced from
the real `adro0303` GitHub profile and repo READMEs — nothing fabricated.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4 (CSS-first theme, see `src/index.css`)
- Hero background/statue: hand-rolled canvas2D renderers, no WebGL/3D
  dependency — see `src/components/hero/`
- GSAP + ScrollTrigger — pinned horizontal scroll for the Projects section
- Framer Motion — scroll-reveal animations

## The hero's hidden statue

`src/components/hero/AsciiFigure.tsx` renders a classical bust (Michelangelo's
David, head/shoulders/upper chest) as a field of monospace characters. The
per-cell brightness data comes from `src/data/statueField.ts`, generated once
by `scripts/generate-statue-field.mjs` from a CC-BY 3.0 photograph (Wikimedia
Commons) — luminance + Sobel edge magnitude, vignetted and gamma-curved. Only
that derived digit string is committed; the source photo itself is never
shipped. Re-run the script with `node scripts/generate-statue-field.mjs
<path-to-photo>` to regenerate it from a different source image.

At rest the figure sits just barely visible. Cursor proximity drives a
decaying per-cell "energy" field that brightens density/color toward a hot
white-green core, with a trailing scan-beam, glyph jitter, and a scan-coverage
readout in the hero's HUD. Touch devices get a slow autonomous roam instead of
pointer tracking; `prefers-reduced-motion` gets one static faint render with
no animation loop at all.

## Performance & responsiveness

- `useDeviceCapability` (`src/lib/useDeviceCapability.ts`) detects
  `prefers-reduced-motion`, touch input, and rough device power, and both
  hero canvases (`HeroBackdrop`, `AsciiFigure`) adapt cell density/effects to
  it — no heavy 3D bundle to gate in the first place.
- The hero's canvas render loops pause when scrolled out of view.
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
  data/        # real bio, stack, project data + generated statueField.ts
  lib/         # device capability, typewriter, section list hooks
  components/
    hero/      # HeroBackdrop, AsciiFigure (statue), HeroSection
    terminal/  # BootSequence, hidden InteractiveTerminal, PlasmaEffect
    layout/    # CRTOverlay, ScrollRail, TerminalWindow chrome
    sections/  # Identity, StackBlueprint, Projects, Uplink
    projects/  # per-project-kind visualizations + ProjectCard
scripts/
  generate-statue-field.mjs  # one-off: photo -> src/data/statueField.ts
```
