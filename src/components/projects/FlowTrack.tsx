export function FlowTrack({ nodes, accent }: { nodes: string[]; accent: string }) {
  return (
    <div className="w-full py-4">
      <div className="relative flex items-center justify-between">
        <div className="absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 bg-(--color-line)" />
        <div
          className="animate-flow absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full"
          style={{ background: accent, boxShadow: `0 0 10px ${accent}` }}
        />
        {nodes.map((node) => (
          <div key={node} className="relative z-10 flex flex-col items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full border-2 bg-(--color-void)"
              style={{ borderColor: accent }}
            />
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-between gap-1">
        {nodes.map((node) => (
          <span
            key={node}
            className="w-[13%] text-center font-mono text-[9px] leading-tight text-(--color-fg-dim) sm:text-[10px]"
          >
            {node}
          </span>
        ))}
      </div>
    </div>
  );
}
