import { useState } from "react";
import { BootSequence } from "@/components/terminal/BootSequence";
import { CRTOverlay } from "@/components/layout/CRTOverlay";
import { ScrollRail } from "@/components/layout/ScrollRail";
import { InteractiveTerminal } from "@/components/terminal/InteractiveTerminal";
import { HeroSection } from "@/components/hero/HeroSection";
import { Identity } from "@/components/sections/Identity";
import { StackBlueprint } from "@/components/sections/StackBlueprint";
import { Projects } from "@/components/sections/Projects";
import { Uplink } from "@/components/sections/Uplink";

export default function App() {
  const [booting, setBooting] = useState(true);

  return (
    <>
      {booting && <BootSequence onDone={() => setBooting(false)} />}
      <CRTOverlay />
      <ScrollRail />
      <main className="relative">
        <HeroSection booted={!booting} />
        <Identity />
        <StackBlueprint />
        <Projects />
        <Uplink />
      </main>
      <InteractiveTerminal />
    </>
  );
}
