import { useState } from "react";
import AssessmentStep1 from "./assessment/AssessmentStep1";
import AssessmentStep2 from "./assessment/AssessmentStep2";
import AssessmentStep3 from "./assessment/AssessmentStep3";
import { useLanguage } from "../lib/useLanguage";
import AnimatedSection from "./AnimatedSection";

export default function HomeAssessment() {
  const { lang, dir } = useLanguage();
  const [step, setStep] = useState(1);
  const [clientInfo, setClientInfo] = useState(null);
  const [answers, setAnswers] = useState([]);

  const title = lang === "ar" ? "بدء الاستبيان — مدعوم بالذكاء الاصطناعي ⚡️" : "Start Assessment — AI-Powered ⚡️";
  const subtitle = lang === "ar"
    ? "أجرِ تقييمك المجاني الآن واحصل على تشخيص ذكي لأعمالك في دقائق"
    : "Run your free assessment now and get an AI-powered business diagnosis in minutes";

  const steps = lang === "ar"
    ? ["معلومات الأعمال", "الاستبيان الذكي", "التشخيص"]
    : ["Business Info", "AI Questionnaire", "Diagnosis"];

  return (
    <section className="py-24 md:py-36 bg-background" dir={dir}>
      <div className="max-w-3xl mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-14">
            <span className="inline-block bg-primary/10 text-primary text-xs font-semibold uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-5">
              {lang === "ar" ? "أداة التقييم الذكي" : "Smart AI Tool"}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-4 leading-tight">
              {title}
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">{subtitle}</p>
          </div>

          {/* Step progress */}
          <div className="flex items-center gap-3 mb-10 max-w-lg mx-auto">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 shrink-0 ${
                  step >= s ? "bg-primary text-primary-foreground scale-110" : "bg-muted text-muted-foreground"
                }`}>
                  {s}
                </div>
                <span className={`text-xs font-medium hidden sm:block truncate transition-colors ${step >= s ? "text-foreground" : "text-muted-foreground"}`}>
                  {steps[s - 1]}
                </span>
                {s < 3 && <div className={`flex-1 h-0.5 transition-colors duration-500 ${step > s ? "bg-primary" : "bg-muted"}`} />}
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Steps */}
        <div className="transition-all duration-300">
          {step === 1 && (
            <AssessmentStep1
              lang={lang}
              onNext={(info) => { setClientInfo(info); setStep(2); }}
            />
          )}
          {step === 2 && (
            <AssessmentStep2
              lang={lang}
              clientInfo={clientInfo}
              onNext={(ans) => { setAnswers(ans); setStep(3); }}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <AssessmentStep3
              lang={lang}
              clientInfo={clientInfo}
              answers={answers}
              onBack={() => setStep(2)}
            />
          )}
        </div>
      </div>
    </section>
  );
}