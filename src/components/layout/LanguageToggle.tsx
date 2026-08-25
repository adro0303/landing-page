import { useLanguage, type Lang } from "@/lib/i18n";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  const btn = (code: Lang, label: string) => (
    <button
      type="button"
      onClick={() => setLang(code)}
      aria-pressed={lang === code}
      className={`px-2 py-1 font-mono text-[10px] tracking-[0.15em] transition-colors ${
        lang === code
          ? "bg-(--color-blue)/15 text-(--color-blue)"
          : "text-(--color-fg-faint) hover:text-(--color-fg-dim)"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div
      className={`flex items-center overflow-hidden rounded-sm border border-(--color-line) bg-(--color-void)/85 backdrop-blur-sm ${className}`}
    >
      {btn("en", "EN")}
      <span className="h-4 w-px bg-(--color-line)" />
      {btn("es", "ES")}
    </div>
  );
}
