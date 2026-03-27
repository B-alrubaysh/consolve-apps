import { useState } from "react";
import AssessmentStep1 from "../components/assessment/AssessmentStep1";
import AssessmentStep2 from "../components/assessment/AssessmentStep2";
import AssessmentStep3 from "../components/assessment/AssessmentStep3";
import { useLanguage } from "../lib/useLanguage";
import t from "../lib/translations";

export default function Assessment() {
  const [step, setStep] = useState(1);
  const [clientInfo, setClientInfo] = useState(null);
  const [answers, setAnswers] = useState([]);
  const { lang, dir } = useLanguage();
  const tx = t[lang];

  return (
    <div className="min-h-screen pt-24 pb-20" dir={dir}>
      <div className="max-w-3xl mx-auto px-6 mb-12">
        <div className="flex items-center gap-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {s}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${step >= s ? "text-foreground" : "text-muted-foreground"}`}>
                {s === 1 ? tx.assess_step1_label : s === 2 ? tx.assess_step2_label : tx.assess_step3_label}
              </span>
              {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <AssessmentStep1 lang={lang} onNext={(info) => { setClientInfo(info); setStep(2); }} />
      )}
      {step === 2 && (
        <AssessmentStep2 lang={lang} clientInfo={clientInfo} onNext={(ans) => { setAnswers(ans); setStep(3); }} onBack={() => setStep(1)} />
      )}
      {step === 3 && (
        <AssessmentStep3 lang={lang} clientInfo={clientInfo} answers={answers} onBack={() => setStep(2)} />
      )}
    </div>
  );
}