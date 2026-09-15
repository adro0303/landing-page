import { useState } from "react";
import { BootSequence } from "@/components/terminal/BootSequence";
import { CRTOverlay } from "@/components/layout/CRTOverlay";
import { ScrollRail } from "@/components/layout/ScrollRail";
import { TopBar } from "@/components/layout/TopBar";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { InteractiveTerminal } from "@/components/terminal/InteractiveTerminal";
import { ToolsLauncher } from "@/components/layout/ToolsLauncher";
import { HeroSection } from "@/components/hero/HeroSection";
import { WhatIDo } from "@/components/sections/WhatIDo";
import { CurrentFocus } from "@/components/sections/CurrentFocus";
import { AIExplained } from "@/components/sections/AIExplained";
import { Identity } from "@/components/sections/Identity";
import { Experience } from "@/components/sections/Experience";
import { Education } from "@/components/sections/Education";
import { StackBlueprint } from "@/components/sections/StackBlueprint";
import { Projects } from "@/components/sections/Projects";
import { Uplink } from "@/components/sections/Uplink";
import { LanguageProvider, useLanguage } from "@/lib/i18n";

function SkipLink() {
  const { t } = useLanguage();
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-sm focus:border focus:border-(--color-blue) focus:bg-(--color-void) focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-(--color-blue)"
    >
      {t("a11y.skipToContent")}
    </a>
  );
}

export default function App() {
  const [booting, setBooting] = useState(true);

  return (
    <LanguageProvider>
      <SkipLink />
      {booting && <BootSequence onDone={() => setBooting(false)} />}
      <CRTOverlay />
      <ScrollRail />
      <TopBar />
      <LanguageToggle className="fixed top-3 right-3 z-[90]" />
      <main id="main-content" className="relative">
        <HeroSection booted={!booting} />
        <WhatIDo />
        <CurrentFocus />
        <AIExplained />
        <Identity />
        <Experience />
        <Education />
        <StackBlueprint />
        <Projects />
        <Uplink />
      </main>
      <InteractiveTerminal />
      <ToolsLauncher />
    </LanguageProvider>
  );
}
