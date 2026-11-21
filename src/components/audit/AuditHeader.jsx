import { useLanguage } from "@/lib/useLanguage";

// Same minimal floating header as /ecommerce-landing: logo + language toggle only.
export default function AuditHeader() {
  const { setLang, isAr } = useLanguage();
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <header className="bg-secondary/80 py-3 rounded-[14px] w-full max-w-6xl backdrop-blur-md shadow-md border border-white/10">
        <div className="px-6 flex items-center justify-between">
          <a href="/" className="flex items-center shrink-0" aria-label="Consolve">
            <img
              src="https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/4c25434d1_Consolve_identity_compressed_HQai.png"
              alt="Consolve"
              className="h-8 w-auto"
              style={{ mixBlendMode: "screen" }}
            />
          </a>
          <button onClick={() => setLang(isAr ? "en" : "ar")} className="text-sm font-medium text-white/90 hover:text-primary transition-colors">
            {isAr ? "EN" : "AR"}
          </button>
        </div>
      </header>
    </div>
  );
}