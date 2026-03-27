import { useLanguage } from "../lib/useLanguage";

export default function LanguageSwitcher({ variant = "light" }) {
  const { lang, setLang } = useLanguage();

  const base =
    variant === "dark"
      ? "border-white/20 text-white/70 hover:border-white/50"
      : "border-border text-muted-foreground hover:border-foreground";

  return (
    <div className={`flex items-center rounded-full border overflow-hidden text-xs font-semibold ${base}`}>
      <button
        onClick={() => setLang("en")}
        className={`px-3 py-1.5 transition-colors ${
          lang === "en"
            ? variant === "dark"
              ? "bg-primary text-white"
              : "bg-primary text-white"
            : "hover:bg-muted"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("ar")}
        className={`px-3 py-1.5 transition-colors ${
          lang === "ar"
            ? variant === "dark"
              ? "bg-primary text-white"
              : "bg-primary text-white"
            : "hover:bg-muted"
        }`}
      >
        عر
      </button>
    </div>
  );
}