import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Info } from "lucide-react";
import DiagnosisForm from "./DiagnosisForm";
import AssessmentStep2 from "../assessment/AssessmentStep2";
import AssessmentStep3 from "../assessment/AssessmentStep3";
import useLeadSaver from "./useLeadSaver";

// Intake form -> AI questions -> report. Progress is saved after every step.
// last_step_reached: 1-10 intake fields, 11 = questions answered, 12 = report generated.
const INTAKE_STEPS = 10;

const toLead = (f, lang) => {
  const digits = (f.contact_phone || "").replace(/\D/g, "").replace(/^966/, "");
  return {
    company_name: f.company_name, sector: f.industry, company_size: f.company_size, city: f.city,
    main_activity: f.main_activity, key_challenges: f.key_challenges,
    full_name: f.contact_name, job_title: f.job_title, email: f.contact_email,
    phone: digits ? `+966 ${digits}` : "", language: lang,
  };
};

const anim = {
  initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
};

export default function DiagnosisFlow({ c, lang }) {
  const [step, setStep] = useState(1);
  const [clientInfo, setClientInfo] = useState(null);
  const [answers, setAnswers] = useState([]);
  const save = useLeadSaver();

  const onProgress = (form, stepsDone) => {
    if (!form.company_name?.trim()) return;
    save({ ...toLead(form, lang), last_step_reached: stepsDone });
  };

  const onIntakeDone = (info) => {
    // Step 2/3 also save a classic Assessment from clientInfo — keep it to that schema's fields.
    const { city, job_title, consent_given, ...assessmentInfo } = info;
    setClientInfo(assessmentInfo);
    save({ ...toLead(info, lang), consent_given: true, last_step_reached: INTAKE_STEPS });
    setStep(2);
  };

  const onAnswers = (ans) => {
    setAnswers(ans);
    save({ questionnaire_answers: JSON.stringify(ans), last_step_reached: INTAKE_STEPS + 1 });
    setStep(3);
  };

  const onDiagnosis = (d) => {
    save({
      maturity_level: d.maturity_level || "", risk_level: d.risk_level || "",
      suggested_services: (d.suggested_services || []).join(", "),
      diagnosis: JSON.stringify(d), last_step_reached: INTAKE_STEPS + 2, completed: true,
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="d-step1" {...anim}>
            <DiagnosisForm c={c} lang={lang} onProgress={onProgress} onNext={onIntakeDone} />
          </motion.div>
        )}
        {step === 2 && (
          <motion.div key="d-step2" {...anim}>
            <AssessmentStep2 lang={lang} clientInfo={clientInfo} onNext={onAnswers} onBack={() => setStep(1)} />
          </motion.div>
        )}
        {step === 3 && (
          <motion.div key="d-step3" {...anim}>
            <AssessmentStep3 lang={lang} clientInfo={clientInfo} answers={answers} onDiagnosis={onDiagnosis} onBack={() => setStep(2)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 space-y-2">
        <p className="flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" /><span>{c.cta_note}</span>
        </p>
        <p className="flex items-start gap-2 text-xs text-muted-foreground">
          <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" /><span>{c.privacy}</span>
        </p>
      </div>
    </div>
  );
}