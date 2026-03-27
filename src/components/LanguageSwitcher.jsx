import { useLanguage } from "../lib/useLanguage";

export default function LanguageSwitcher({ variant = "light" }) {
  const { lang, setLang } = useLanguage();

  const next = lang === "en" ? "ar" : "en";
  const label = lang === "en" ? "AR" : "EN";

  const base =
    variant === "dark"
      ? "border-white/20 text-white/70 hover:border-white/50 hover:text-white"
      : "border-border text-muted-foreground hover:border-foreground hover:text-foreground";

  return (
    <button
      onClick={() => setLang(next)}
      className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors ${base}`}
    >
      {label}
    </button>
  );
}