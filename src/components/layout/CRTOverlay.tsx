export function CRTOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[80] overflow-hidden" aria-hidden="true">
      {/* scanline sweep */}
      <div
        className="animate-scan absolute inset-x-0 h-[35%] opacity-[0.05]"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, var(--color-cyan) 50%, transparent 100%)",
        }}
      />
      {/* static scanlines */}
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(0,0,0,0.9) 0px, rgba(0,0,0,0.9) 1px, transparent 1px, transparent 3px)",
        }}
      />
      {/* vignette */}
      <div
        className="animate-flicker absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      {/* subtle chromatic edge tint */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          boxShadow: "inset 0 0 140px rgba(5,6,10,0.9)",
        }}
      />
    </div>
  );
}
