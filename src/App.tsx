import { useState } from "react";
import { BootSequence } from "@/components/terminal/BootSequence";
import { CRTOverlay } from "@/components/layout/CRTOverlay";
import { ScrollRail } from "@/components/layout/ScrollRail";
import { TopBar } from "@/components/layout/TopBar";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { InteractiveTerminal } from "@/components/terminal/InteractiveTerminal";
import { ToolsLauncher } from "@/components/layout/ToolsLauncher";
import { HeroSection } from "@/components/hero/HeroSection";
import { Identity } from "@/components/sections/Identity";
import { Experience } from "@/components/sections/Experience";
import { StackBlueprint } from "@/components/sections/StackBlueprint";
import { Projects } from "@/components/sections/Projects";
import { Uplink } from "@/components/sections/Uplink";
import { LanguageProvider } from "@/lib/i18n";

export default function App() {
  const [booting, setBooting] = useState(true);

  return (
    <LanguageProvider>
      {booting && <BootSequence onDone={() => setBooting(false)} />}
      <CRTOverlay />
      <ScrollRail />
      <TopBar />
      <LanguageToggle className="fixed top-3 right-3 z-[90]" />
      <main className="relative">
        <HeroSection booted={!booting} />
        <Identity />
        <Experience />
        <StackBlueprint />
        <Projects />
        <Uplink />
      </main>
      <InteractiveTerminal />
      <ToolsLauncher />
    </LanguageProvider>
  );
}
