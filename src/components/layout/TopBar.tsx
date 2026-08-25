import { useEffect, useState } from "react";
import { sections } from "@/lib/sections";
import { useLanguage } from "@/lib/i18n";

export function TopBar() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const heroHeight = document.getElementById("hero")?.offsetHeight ?? window.innerHeight;
      setVisible(window.scrollY > heroHeight * 0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!visible) setMenuOpen(false);
  }, [visible]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[85] flex items-center justify-between border-b border-(--color-line) bg-(--color-void)/90 px-4 py-2.5 pr-20 backdrop-blur-sm transition-transform duration-300 sm:px-6 sm:pr-24 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <a
          href="#hero"
          className="font-mono text-[11px] tracking-[0.3em] text-(--color-fg-dim) transition-colors hover:text-(--color-blue)"
        >
          {t("topbar.brand")}
        </a>

        <nav className="hidden items-center gap-6 lg:flex">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="font-mono text-[10px] tracking-[0.25em] text-(--color-fg-faint) transition-colors hover:text-(--color-blue)"
            >
              [ {t(`nav.${s.id}`)} ]
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="font-mono text-[11px] tracking-wide text-(--color-fg-dim) transition-colors hover:text-(--color-blue) lg:hidden"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? t("topbar.close") : t("topbar.menu")}
        >
          {menuOpen ? t("topbar.close") : t("topbar.menu")}
        </button>
      </header>

      <div
        className={`fixed inset-x-0 top-[41px] z-[90] origin-top border-b border-(--color-line) bg-(--color-void)/95 backdrop-blur-sm transition-all duration-200 lg:hidden ${
          visible && menuOpen
            ? "pointer-events-auto scale-y-100 opacity-100"
            : "pointer-events-none scale-y-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col px-4 py-2">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={() => setMenuOpen(false)}
              className="border-b border-(--color-line)/60 py-3 font-mono text-xs tracking-[0.2em] text-(--color-fg-dim) last:border-b-0 hover:text-(--color-blue)"
            >
              [ {t(`nav.${s.id}`)} ]
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
