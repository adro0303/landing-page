import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { TerminalWindow } from "@/components/layout/TerminalWindow";

const initials = profile.name
  .split(/\s+/)
  .map((part) => part[0])
  .join("")
  .toUpperCase();

export function IdCard() {
  return (
    <TerminalWindow title="cat ~/id.badge" accent="var(--color-cyan)">
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-(--color-line) bg-(--color-panel-raised)">
          {profile.photoUrl ? (
            <img
              src={profile.photoUrl}
              alt={profile.name}
              className="h-full w-full object-cover grayscale-[15%] contrast-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-display text-3xl text-(--color-cyan) text-glow-cyan">
              {initials}
            </div>
          )}
          <div
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.5) 3px)",
            }}
          />
          <motion.div
            className="pointer-events-none absolute inset-x-0 h-6 bg-(--color-cyan)/10"
            initial={{ top: "-20%" }}
            animate={{ top: "110%" }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <div className="min-w-0">
          <p className="truncate font-mono text-sm text-(--color-fg)">
            {profile.name}{" "}
            <span className="text-(--color-fg-faint)">// {profile.handle}</span>
          </p>
          <p className="mt-1 font-mono text-xs text-(--color-fg-dim)">{profile.role}</p>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-(--color-green)" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-(--color-green)">
              ONLINE
            </span>
          </div>
        </div>
      </div>
    </TerminalWindow>
  );
}
