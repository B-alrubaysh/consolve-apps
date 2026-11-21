import { useNavigate, useLocation } from "react-router-dom";
import { Zap, Lock, SlidersHorizontal, BarChart3, FileText } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import DiagnosisHero from "./diagnosis/DiagnosisHero";
import DiagnosisWhyHow from "./diagnosis/DiagnosisWhyHow";
import { DIAGNOSIS_COPY } from "./diagnosis/diagnosisCopy";
import { useLanguage } from "../lib/useLanguage";

const FEATURE_ICONS = [SlidersHorizontal, BarChart3, FileText, Lock];

// Home-page teaser for the diagnosis tool. The form itself lives on /diagnosis;
// the CTA goes there (keeping any UTM params) and lands on the form.
export default function DiagnosisSection() {
  const { lang, dir } = useLanguage();
  const c = DIAGNOSIS_COPY[lang] || DIAGNOSIS_COPY.en;
  const navigate = useNavigate();
  const location = useLocation();

  const goToDiagnosis = () => navigate(`/diagnosis${location.search}#diagnosis-form`);

  return (
    <section id="diagnosis" className="py-24 md:py-32 bg-background border-b border-border" dir={dir}>
      <div className="max-w-7xl mx-auto px-6">

        <AnimatedSection>
          <div className="flex items-center justify-center gap-3 rounded-2xl bg-primary/10 border border-primary/20 px-5 py-4 mb-14 max-w-2xl mx-auto">
            <Zap className="w-5 h-5 text-primary shrink-0" />
            <p className="text-sm md:text-base font-semibold text-foreground text-center">{c.banner}</p>
          </div>
        </AnimatedSection>

        <DiagnosisHero c={c} lang={lang} onCta={goToDiagnosis} />
        <DiagnosisWhyHow c={c} />

        <AnimatedSection>
          <div className="rounded-2xl bg-secondary p-8 md:p-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {c.features.map((f, i) => {
              const Icon = FEATURE_ICONS[i];
              return (
                <div key={f.t} className="text-center">
                  <Icon className="w-6 h-6 text-primary mx-auto mb-3" />
                  <p className="text-white font-bold text-sm mb-1.5">{f.t}</p>
                  <p className="text-white/50 text-xs leading-relaxed">{f.d}</p>
                </div>
              );
            })}
          </div>
        </AnimatedSection>

      </div>
    </section>
  );
}