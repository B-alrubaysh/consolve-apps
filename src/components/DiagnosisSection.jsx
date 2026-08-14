import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Lock, SlidersHorizontal, Search, PieChart,
  ClipboardCheck, ClipboardList, MonitorCheck, FileText, CheckCircle2,
  TriangleAlert, Target, Users, BarChart3, Settings, ArrowLeft, ArrowRight,
  Check, Pencil, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AnimatedSection from "./AnimatedSection";
import AssessmentStep2 from "./assessment/AssessmentStep2";
import AssessmentStep3 from "./assessment/AssessmentStep3";
import { INDUSTRIES_EN, INDUSTRIES_AR, SIZES } from "./assessment/AssessmentStep1";
import { useLanguage } from "../lib/useLanguage";

// Copy for the redesigned diagnosis section (added after Services per the
// approved design file). Arabic strings are taken verbatim from the design.
const COPY = {
  ar: {
    banner: "ابدأ تشخيص شركتك مجانًا. واكتشف الأسباب الجذرية للتحديات التي تواجهها.",
    h2_plain: "المشكلة التي تراها...",
    h2_accent: "ليست دائمًا المشكلة الحقيقية.",
    intro: "ابدأ بتشخيص شركتك من خلال مجموعة أسئلة تُبنى وفقًا لطبيعة نشاطك والتحديات التي تواجهها. في نهاية التشخيص، ستحصل على تقرير أولي يساعدك على فهم الوضع الحالي، وتحليل الأسباب الجذرية للمشكلة، وتحديد الخدمات الاستشارية المناسبة.",
    cta: "ابدأ التشخيص",
    preview_title: "ماذا ستشاهد بعد الانتهاء؟",
    maturity: "مرحلة النضج", maturity_v: "متوسطة",
    risk: "مستوى المخاطر", risk_v: "مرتفع",
    axes: "تقييم المحاور",
    summary: "ملخص الوضع الحالي",
    problems: "المشكلات والأسباب الجذرية",
    services: "الخدمات الاستشارية المناسبة",
    service_items: ["تحسين المبيعات", "الكفاءة التشغيلية", "التحول الرقمي"],
    focus: "محاور التركيز المقترحة لكل خدمة",
    why_title: "لماذا هذا التشخيص",
    why: [
      { t: "تشخيص مخصص", d: "الأسئلة لا تكون ثابتة، بل تُبنى بناءً على طبيعة شركتك والتحدي الذي تواجهه." },
      { t: "تحليل الأسباب الجذرية", d: "لا يكتفي بعرض الأعراض، بل يساعد في الوصول إلى الأسباب المحتملة وراء المشكلة." },
      { t: "رؤية أشمل", d: "يعرض صورة متكاملة عن وضع الشركة من عدة جوانب إدارية وتشغيلية." },
      { t: "تقرير أولي", d: "احصل على تقرير يساعدك على فهم المشكلة بشكل أعمق قبل البدء بأي مشروع تطوير." },
    ],
    how_title: "كيف يعمل؟",
    how: [
      { t: "أخبرنا عن شركتك", d: "أدخل معلومات شركتك وحدد التحدي الذي ترغب في تحليله." },
      { t: "أجب عن الأسئلة", d: "سيتم إنشاء أسئلة مخصصة بناءً على المعلومات التي أدخلتها، بهدف فهم المشكلة بصورة أدق." },
      { t: "استعرض تقرير التشخيص", d: "احصل على تقرير يتضمن تحليلًا أوليًا للوضع الحالي، والأسباب الجذرية المحتملة، والخدمات الاستشارية المناسبة." },
    ],
    form_title: "ابدأ تشخيص شركتك",
    form_sub: "أدخل معلومات شركتك، وحدد التحدي الذي ترغب في تحليله، ثم ابدأ التشخيص.",
    g_company: "معلومات الشركة",
    f_company: "اسم الشركة", f_company_ph: "اكتب اسم الشركة",
    f_industry: "القطاع", f_industry_ph: "اختر القطاع",
    f_size: "حجم الشركة", f_size_ph: "اختر حجم الشركة",
    f_activity: "النشاط الرئيسي", f_activity_ph: "مثال: تجارة إلكترونية، صناعة، تعليم...",
    f_challenge: "ما أبرز التحدي الذي تواجهه", f_challenge_ph: "مثال: انخفاض المبيعات، ضعف الكفاءة التشغيلية، ارتفاع التكاليف، ضعف رضا العملاء...",
    g_contact: "بيانات التواصل",
    f_name: "الاسم الكامل", f_name_ph: "اكتب اسمك الكامل",
    f_email: "البريد الإلكتروني", f_email_ph: "name@company.com",
    f_phone: "رقم الهاتف", f_phone_ph: "5X XXX XXXX",
    privacy: "جميع المعلومات التي يتم إدخالها تُعامل بسرية تامة، وتستخدم فقط لإعداد تقرير التشخيص.",
    step_word: "الخطوة", of_word: "من", next: "متابعة", edit: "تعديل",
    err_required: "هذا الحقل مطلوب.",
    err_email: "يرجى إدخال بريد إلكتروني صحيح.",
    err_phone: "يرجى إدخال رقم جوال صحيح مكوّن من ٩ أرقام يبدأ بالرقم 5.",
    includes_title: "ماذا يتضمن التقرير؟",
    includes: [
      "تحليل للوضع الحالي.",
      "تحديد الأسباب الجذرية المحتملة.",
      "تقييم عدد من الجوانب المرتبطة بالمشكلة.",
      "مستوى النضج المؤسسي.",
      "مستوى المخاطر.",
      "الخدمات الاستشارية الأكثر ملاءمة.",
      "محاور التركيز المقترحة لكل خدمة.",
    ],
    after_title: "ماذا ستشاهد بعد الانتهاء؟",
    after: [
      "تقييم المحاور المرتبطة بالمشكلة.",
      "مرحلة نضج الشركة.",
      "مستوى المخاطر.",
      "ملخص عن الوضع الحالي.",
      "المشكلات والأسباب الجذرية.",
      "الخدمات الاستشارية المناسبة.",
      "محاور التركيز المقترحة.",
    ],
    features: [
      { t: "تشخيص مخصص", d: "تُبنى الأسئلة وفقًا لطبيعة شركتك والتحديات التي تواجهها." },
      { t: "تحليل عملي", d: "يعتمد التقرير على تحليل الأسباب المحتملة بدلًا من الاكتفاء بعرض الأعراض." },
      { t: "تقرير أولي", d: "يساعدك على فهم المشكلة بصورة أعمق قبل اتخاذ أي قرار." },
      { t: "سرية تامة", d: "جميع المعلومات تُعامل بسرية ولا تُستخدم إلا لإعداد تقرير التشخيص." },
    ],
  },
  en: {
    banner: "Start your free company diagnosis and uncover the root causes of the challenges you face.",
    h2_plain: "The problem you see...",
    h2_accent: "is not always the real problem.",
    intro: "Diagnose your company through a set of questions built around your business nature and the challenges you face. At the end of the diagnosis, you will receive a preliminary report that helps you understand the current situation, analyze the root causes, and identify the right consulting services.",
    cta: "Start Diagnosis",
    preview_title: "What you'll see when you finish",
    maturity: "Maturity Stage", maturity_v: "Medium",
    risk: "Risk Level", risk_v: "High",
    axes: "Axes Evaluation",
    summary: "Current Situation Summary",
    problems: "Problems & Root Causes",
    services: "Recommended Consulting Services",
    service_items: ["Sales Improvement", "Operational Efficiency", "Digital Transformation"],
    focus: "Suggested Focus Areas per Service",
    why_title: "Why This Diagnosis",
    why: [
      { t: "Tailored Diagnosis", d: "Questions are not fixed; they are built around your company's nature and the challenge you face." },
      { t: "Root-Cause Analysis", d: "Goes beyond symptoms to help uncover the likely causes behind the problem." },
      { t: "A Broader View", d: "Presents an integrated picture of your company across managerial and operational aspects." },
      { t: "Preliminary Report", d: "Get a report that helps you understand the problem in depth before starting any development project." },
    ],
    how_title: "How does it work?",
    how: [
      { t: "Tell us about your company", d: "Enter your company information and select the challenge you want to analyze." },
      { t: "Answer the questions", d: "Tailored questions are generated from your inputs to understand the problem more precisely." },
      { t: "Review your diagnosis report", d: "Receive a report with a preliminary analysis of the current situation, likely root causes, and suitable consulting services." },
    ],
    form_title: "Start Your Company Diagnosis",
    form_sub: "Enter your company information, select the challenge to analyze, then start the diagnosis.",
    g_company: "Company Information",
    f_company: "Company Name", f_company_ph: "Enter company name",
    f_industry: "Sector", f_industry_ph: "Select sector",
    f_size: "Company Size", f_size_ph: "Select company size",
    f_activity: "Main Activity", f_activity_ph: "e.g. e-commerce, manufacturing, education...",
    f_challenge: "What is the main challenge you face?", f_challenge_ph: "e.g. declining sales, operational inefficiency, rising costs, low customer satisfaction...",
    g_contact: "Contact Details",
    f_name: "Full Name", f_name_ph: "Enter your full name",
    f_email: "Email", f_email_ph: "name@company.com",
    f_phone: "Phone Number", f_phone_ph: "5X XXX XXXX",
    privacy: "All information you enter is treated with strict confidentiality and used only to prepare your diagnosis report.",
    step_word: "Step", of_word: "of", next: "Continue", edit: "Edit",
    err_required: "This field is required.",
    err_email: "Please enter a valid email address.",
    err_phone: "Please enter a valid 9-digit phone number starting with 5.",
    includes_title: "What does the report include?",
    includes: [
      "Analysis of the current situation.",
      "Identification of likely root causes.",
      "Evaluation of aspects related to the problem.",
      "Organizational maturity level.",
      "Risk level.",
      "The most suitable consulting services.",
      "Suggested focus areas per service.",
    ],
    after_title: "What you'll see when you finish",
    after: [
      "Evaluation of problem-related axes.",
      "Company maturity stage.",
      "Risk level.",
      "Current situation summary.",
      "Problems and root causes.",
      "Suitable consulting services.",
      "Suggested focus areas.",
    ],
    features: [
      { t: "Tailored Diagnosis", d: "Questions are built around your company's nature and challenges." },
      { t: "Practical Analysis", d: "The report analyzes likely causes rather than only listing symptoms." },
      { t: "Preliminary Report", d: "Helps you understand the problem in depth before making any decision." },
      { t: "Full Confidentiality", d: "All information is kept confidential and used only for your diagnosis report." },
    ],
  },
};

const WHY_ICONS = [SlidersHorizontal, Search, PieChart, ClipboardCheck];
const FEATURE_ICONS = [SlidersHorizontal, BarChart3, FileText, Lock];
const FOCUS_ICONS = [Target, Users, BarChart3, Settings];

function Gauge({ label, value, tone }) {
  const stroke = tone === "risk" ? "hsl(0 72% 51%)" : "hsl(var(--primary))";
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-background p-3">
      <p className="text-[11px] font-semibold text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-foreground">{value}</p>
      <svg viewBox="0 0 64 36" className="w-16 h-9">
        <path d="M6 32 A26 26 0 0 1 58 32" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" strokeLinecap="round" />
        <path d="M6 32 A26 26 0 0 1 58 32" fill="none" stroke={stroke} strokeWidth="6" strokeLinecap="round"
          strokeDasharray="82" strokeDashoffset={tone === "risk" ? 20 : 38} />
        {tone === "risk" && <TriangleAlert className="text-destructive" x="26" y="14" width="12" height="12" stroke="hsl(0 72% 51%)" />}
      </svg>
    </div>
  );
}

function SkeletonLines({ count = 3 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-2.5 rounded-full bg-muted" style={{ width: `${100 - i * 12}%` }} />
      ))}
    </div>
  );
}

function ReportPreviewCard({ c }) {
  const barHeights = [14, 22, 10, 26, 18, 30];
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <p className="text-center font-bold text-foreground mb-5">{c.preview_title}</p>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Gauge label={c.maturity} value={c.maturity_v} />
        <Gauge label={c.risk} value={c.risk_v} tone="risk" />
        <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-background p-3">
          <p className="text-[11px] font-semibold text-muted-foreground">{c.axes}</p>
          <div className="flex items-end gap-1 h-12 mt-auto">
            {barHeights.map((h, i) => (
              <div key={i} className={`w-2 rounded-sm ${i % 2 ? "bg-primary" : "bg-secondary/70"}`} style={{ height: h }} />
            ))}
          </div>
        </div>
      </div>
      <div className="mb-6">
        <p className="text-sm font-semibold text-foreground mb-3">{c.summary}</p>
        <SkeletonLines count={3} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">{c.services}</p>
          <ul className="space-y-2">
            {c.service_items.map((s) => (
              <li key={s} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />{s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">{c.problems}</p>
          <SkeletonLines count={3} />
        </div>
      </div>
      <div className="mt-6 pt-5 border-t border-border">
        <p className="text-sm font-semibold text-foreground mb-4 text-center">{c.focus}</p>
        <div className="grid grid-cols-4 gap-3">
          {FOCUS_ICONS.map((Icon, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Icon className="w-5 h-5 text-muted-foreground" />
              <div className="h-2 w-full rounded-full bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const onlyDigits = (v) => (v || "").replace(/\D/g, "");
const PHONE_RE = /^5\d{8}$/;

// Progressive, one-question-at-a-time form. Reveals the next field only after
// the current one validates; completed answers collapse into compact summaries.
// Submits the same shape as before (onNext -> AssessmentStep2/3, +966 prefix).
function DiagnosisForm({ c, lang, onNext }) {
  const isAr = lang === "ar";
  const industries = isAr ? INDUSTRIES_AR : INDUSTRIES_EN;
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const STEPS = [
    { key: "company_name", label: c.f_company, ph: c.f_company_ph, kind: "text" },
    { key: "industry", label: c.f_industry, ph: c.f_industry_ph, kind: "select", options: industries },
    { key: "company_size", label: c.f_size, ph: c.f_size_ph, kind: "select", options: SIZES },
    { key: "main_activity", label: c.f_activity, ph: c.f_activity_ph, kind: "text" },
    { key: "key_challenges", label: c.f_challenge, ph: c.f_challenge_ph, kind: "textarea" },
    { key: "contact_name", label: c.f_name, ph: c.f_name_ph, kind: "text" },
    { key: "contact_email", label: c.f_email, ph: c.f_email_ph, kind: "email" },
    { key: "contact_phone", label: c.f_phone, ph: c.f_phone_ph, kind: "phone" },
  ];
  const TOTAL = STEPS.length;

  const [form, setForm] = useState({
    company_name: "", industry: "", company_size: "", main_activity: "",
    key_challenges: "", contact_name: "", contact_email: "", contact_phone: "",
  });
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");

  const validate = (key, value) => {
    const v = (value ?? "").toString().trim();
    if (!v) return c.err_required;
    if (key === "contact_email" && !EMAIL_RE.test(v)) return c.err_email;
    if (key === "contact_phone" && !PHONE_RE.test(onlyDigits(v))) return c.err_phone;
    return "";
  };
  const firstIncomplete = (f) => {
    for (let i = 0; i < TOTAL; i++) if (validate(STEPS[i].key, f[STEPS[i].key])) return i;
    return TOTAL;
  };
  const completed = STEPS.reduce((n, s) => n + (validate(s.key, form[s.key]) ? 0 : 1), 0);
  const allValid = completed === TOTAL;
  const pct = Math.round((completed / TOTAL) * 100);

  const activeRef = useRef(null);
  const submitRef = useRef(null);
  const firstRun = useRef(true);

  // Focus the active field and gently scroll it into view when the step changes
  // (keeps the mobile keyboard from hiding the input). No scroll on first mount.
  useEffect(() => {
    if (step >= TOTAL) {
      const t = setTimeout(() => submitRef.current?.focus?.({ preventScroll: true }), 90);
      return () => clearTimeout(t);
    }
    const node = activeRef.current;
    if (!node) return;
    const el = node.querySelector("input, textarea, [role='combobox']");
    const t = setTimeout(() => {
      el?.focus?.({ preventScroll: true });
      if (!firstRun.current) node.scrollIntoView({ behavior: "smooth", block: "center" });
      firstRun.current = false;
    }, 70);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const setVal = (key, value) => { setForm((f) => ({ ...f, [key]: value })); if (error) setError(""); };

  const commit = () => {
    const s = STEPS[step];
    const err = validate(s.key, form[s.key]);
    if (err) { setError(err); return; }
    setError("");
    setStep(firstIncomplete(form));
  };

  const chooseSelect = (key, val) => {
    const nf = { ...form, [key]: val };
    setForm(nf);
    setError("");
    setTimeout(() => setStep(firstIncomplete(nf)), 160);
  };

  const editStep = (i) => { setError(""); setStep(i); };

  const onKeyDown = (kind) => (e) => {
    if (e.key === "Enter" && !(kind === "textarea" && e.shiftKey)) {
      e.preventDefault();
      commit();
    }
  };

  const displayValue = (key) => key === "contact_phone" ? `+966 ${form.contact_phone}` : form[key];

  const submit = () => {
    const bad = firstIncomplete(form);
    if (bad !== TOTAL) { setStep(bad); return; }
    onNext({ ...form, contact_phone: `+966 ${form.contact_phone}`.trim(), language: lang });
  };

  const enter = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
      <h3 className="text-2xl font-bold text-foreground mb-1">{c.form_title}</h3>
      <p className="text-sm text-muted-foreground mb-6">{c.form_sub}</p>

      {/* Progress */}
      <div className="mb-7">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">
            {c.step_word} {Math.min(step + 1, TOTAL)} {c.of_word} {TOTAL}
          </span>
          <span className="text-xs font-semibold text-primary">{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${(completed / TOTAL) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false} mode="popLayout">
          {STEPS.map((s, i) => {
            const isActive = i === step && step < TOTAL;
            const valid = !validate(s.key, form[s.key]);

            if (isActive) {
              return (
                <motion.div key={`active-${i}`} layout ref={activeRef} {...enter}
                  className="rounded-xl border border-primary/30 bg-background p-4 md:p-5">
                  <label htmlFor={`fld-${s.key}`} className="block text-base font-semibold text-foreground mb-3">
                    {s.label} <span className="text-primary">*</span>
                  </label>

                  {s.kind === "select" ? (
                    <Select value={form[s.key]} onValueChange={(v) => chooseSelect(s.key, v)}>
                      <SelectTrigger id={`fld-${s.key}`} aria-label={s.label} className="h-12">
                        <SelectValue placeholder={s.ph} />
                      </SelectTrigger>
                      <SelectContent>{s.options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                  ) : s.kind === "textarea" ? (
                    <Textarea id={`fld-${s.key}`} aria-label={s.label} value={form[s.key]}
                      onChange={(e) => setVal(s.key, e.target.value)} onKeyDown={onKeyDown("textarea")}
                      placeholder={s.ph} className="min-h-[96px]" />
                  ) : s.kind === "phone" ? (
                    <div className="flex gap-3" dir="ltr">
                      <div className="h-12 px-4 rounded-md border border-input bg-background flex items-center text-sm text-muted-foreground shrink-0">+966</div>
                      <Input id={`fld-${s.key}`} aria-label={s.label} inputMode="tel" value={form[s.key]}
                        onChange={(e) => setVal(s.key, onlyDigits(e.target.value).slice(0, 9))} onKeyDown={onKeyDown("phone")}
                        placeholder={s.ph} className="h-12 flex-1" />
                    </div>
                  ) : (
                    <Input id={`fld-${s.key}`} aria-label={s.label}
                      type={s.kind === "email" ? "email" : "text"}
                      inputMode={s.kind === "email" ? "email" : undefined}
                      dir={s.kind === "email" ? "ltr" : undefined}
                      value={form[s.key]} onChange={(e) => setVal(s.key, e.target.value)} onKeyDown={onKeyDown("text")}
                      placeholder={s.ph} className="h-12" />
                  )}

                  <AnimatePresence>
                    {error && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-1.5 text-xs text-destructive mt-2" role="alert">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {s.kind !== "select" && (
                    <div className="flex justify-end mt-4">
                      <Button onClick={commit} className="bg-primary text-primary-foreground rounded-full px-6 h-10 text-sm font-semibold">
                        {c.next} <Arrow className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </motion.div>
              );
            }

            if (valid) {
              return (
                <motion.button key={`sum-${i}`} layout type="button" onClick={() => editStep(i)}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  aria-label={`${s.label} — ${c.edit}`}
                  className="w-full flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-2.5 text-start hover:border-primary/40 transition-colors">
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                    className="w-5 h-5 rounded-full bg-emerald-600/10 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-emerald-600" strokeWidth={3} />
                  </motion.span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[11px] text-muted-foreground leading-tight">{s.label}</span>
                    <span className="block text-sm font-medium text-foreground truncate"
                      dir={s.key === "contact_email" || s.key === "contact_phone" ? "ltr" : undefined}>
                      {displayValue(s.key)}
                    </span>
                  </span>
                  <Pencil className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                </motion.button>
              );
            }
            return null;
          })}

          {allValid && (
            <motion.div key="submit" layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="pt-1">
              <Button ref={submitRef} onClick={submit}
                className="w-full bg-primary text-primary-foreground rounded-full h-12 font-semibold text-base">
                {c.cta} <Arrow className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="flex items-start gap-2 text-xs text-muted-foreground mt-6">
        <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        <span>{c.privacy}</span>
      </p>
    </div>
  );
}

export default function DiagnosisSection() {
  const { lang, dir } = useLanguage();
  const c = COPY[lang] || COPY.en;
  const [step, setStep] = useState(1);
  const [clientInfo, setClientInfo] = useState(null);
  const [answers, setAnswers] = useState([]);
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  const scrollToForm = () =>
    document.getElementById("diagnosis-form")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <section id="diagnosis" className="py-24 md:py-32 bg-background border-b border-border" dir={dir}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Top banner */}
        <AnimatedSection>
          <div className="flex items-center justify-center gap-3 rounded-2xl bg-primary/10 border border-primary/20 px-5 py-4 mb-14 max-w-2xl mx-auto">
            <Zap className="w-5 h-5 text-primary shrink-0" />
            <p className="text-sm md:text-base font-semibold text-foreground text-center">{c.banner}</p>
          </div>
        </AnimatedSection>

        {/* Headline + intro | report preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          <AnimatedSection>
            <h2 className={`${lang === "ar" ? "ar-display-heading" : "leading-tight"} text-3xl md:text-5xl font-black text-foreground tracking-tight mb-6 text-center lg:text-start`}>
              {c.h2_plain}<br /><span className="text-primary">{c.h2_accent}</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-[1.9] mb-8 text-center lg:text-start">{c.intro}</p>
            <div className="flex justify-center lg:justify-start">
              <Button onClick={scrollToForm} className="bg-primary text-primary-foreground rounded-xl px-10 h-12 font-semibold text-base">
                {c.cta} <Arrow className="w-4 h-4" />
              </Button>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={150}>
            <ReportPreviewCard c={c} />
          </AnimatedSection>
        </div>

        {/* Why this diagnosis */}
        <AnimatedSection>
          <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">{c.why_title}</h3>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {c.why.map((w, i) => {
            const Icon = WHY_ICONS[i];
            return (
              <AnimatedSection key={w.t} delay={i * 100}>
                <div className="h-full rounded-2xl border border-border bg-card p-6 text-center hover:border-primary/30 transition-colors duration-500">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-secondary" />
                  </div>
                  <p className="font-bold text-foreground mb-2">{w.t}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{w.d}</p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        {/* How it works */}
        <AnimatedSection>
          <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">{c.how_title}</h3>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 max-w-5xl mx-auto">
          {c.how.map((h, i) => (
            <AnimatedSection key={h.t} delay={i * 100}>
              <div className="h-full flex gap-4 rounded-2xl border border-border bg-card p-6">
                <div className="w-9 h-9 rounded-full bg-secondary text-white flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</div>
                <div>
                  <p className="font-bold text-foreground mb-2">{h.t}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{h.d}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Form + sidebar */}
        <div id="diagnosis-form" className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 scroll-mt-28">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="d-step1"
                  initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                  <DiagnosisForm c={c} lang={lang} onNext={(info) => { setClientInfo(info); setStep(2); }} />
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="d-step2"
                  initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                  <AssessmentStep2 lang={lang} clientInfo={clientInfo}
                    onNext={(ans) => { setAnswers(ans); setStep(3); }} onBack={() => setStep(1)} />
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="d-step3"
                  initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                  <AssessmentStep3 lang={lang} clientInfo={clientInfo} answers={answers} onBack={() => setStep(2)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-8">
            <AnimatedSection delay={100}>
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-emerald-600/10 flex items-center justify-center shrink-0">
                    <ClipboardList className="w-5 h-5 text-emerald-700" />
                  </div>
                  <p className="font-bold text-foreground">{c.includes_title}</p>
                </div>
                <ul className="space-y-3">
                  {c.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={200}>
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MonitorCheck className="w-5 h-5 text-primary" />
                  </div>
                  <p className="font-bold text-foreground">{c.after_title}</p>
                </div>
                <ul className="space-y-3">
                  {c.after.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Feature strip */}
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