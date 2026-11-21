import { useEffect } from "react";
import AnimatedSection from "../components/AnimatedSection";
import DiagnosisHero from "../components/diagnosis/DiagnosisHero";
import DiagnosisWhyHow from "../components/diagnosis/DiagnosisWhyHow";
import DiagnosisFlow from "../components/diagnosis/DiagnosisFlow";
import { DIAGNOSIS_COPY } from "../components/diagnosis/diagnosisCopy";
import { useLanguage, setGlobalLang } from "../lib/useLanguage";
import { usePageMetadata } from "../lib/usePageMetadata";

const OG_IMAGE = "https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/aedd7f7c9_generated_image.png";

const scrollToForm = () =>
  document.getElementById("diagnosis-form")?.scrollIntoView({ behavior: "smooth", block: "start" });

export default function Diagnosis() {
  const { lang, dir } = useLanguage();
  const c = DIAGNOSIS_COPY[lang] || DIAGNOSIS_COPY.en;

  // Campaign landing page: Arabic unless the visitor already picked a language.
  useEffect(() => {
    if (!localStorage.getItem("consolve_lang")) setGlobalLang("ar");
  }, []);

  // Arriving from a Home CTA (#diagnosis-form) lands directly on the form.
  useEffect(() => {
    if (window.location.hash !== "#diagnosis-form") return;
    const t = setTimeout(scrollToForm, 350);
    return () => clearTimeout(t);
  }, []);

  usePageMetadata({
    title: lang === "ar" ? "تشخيص شركتك | كونسولف" : "Business Diagnosis | Consolve",
    description: c.page_desc,
    image: OG_IMAGE,
    rawTitle: true,
  });

  return (
    <div dir={dir}>
      <section className="pt-16 md:pt-24 pb-4 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <DiagnosisHero c={c} lang={lang} onCta={scrollToForm} as="h1" />
          <DiagnosisWhyHow c={c} />
        </div>
      </section>

      <section id="diagnosis-form" className="pb-24 md:pb-32 bg-background scroll-mt-28">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <DiagnosisFlow c={c} lang={lang} />
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}