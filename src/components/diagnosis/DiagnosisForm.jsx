import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Pencil, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { INDUSTRIES_EN, INDUSTRIES_AR, SIZES } from "../assessment/AssessmentStep1";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const onlyDigits = (v) => (v || "").replace(/\D/g, "");
const PHONE_RE = /^5\d{8}$/;

// Progressive, one-question-at-a-time form. Reveals the next field only after
// the current one validates; completed answers collapse into compact summaries.
// onProgress(form, stepsDone) fires each time a step is completed.
// onNext(info) fires after all steps + consent (phone gets the +966 prefix).
export default function DiagnosisForm({ c, lang, onNext, onProgress }) {
  const isAr = lang === "ar";
  const industries = isAr ? INDUSTRIES_AR : INDUSTRIES_EN;
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const STEPS = [
    { key: "company_name", label: c.f_company, ph: c.f_company_ph, kind: "text" },
    { key: "industry", label: c.f_industry, ph: c.f_industry_ph, kind: "select", options: industries },
    { key: "company_size", label: c.f_size, ph: c.f_size_ph, kind: "select", options: SIZES },
    { key: "city", label: c.f_city, ph: c.f_city_ph, kind: "text" },
    { key: "main_activity", label: c.f_activity, ph: c.f_activity_ph, kind: "text" },
    { key: "key_challenges", label: c.f_challenge, ph: c.f_challenge_ph, kind: "textarea" },
    { key: "contact_name", label: c.f_name, ph: c.f_name_ph, kind: "text" },
    { key: "job_title", label: c.f_job, ph: c.f_job_ph, kind: "text" },
    { key: "contact_email", label: c.f_email, ph: c.f_email_ph, kind: "email" },
    { key: "contact_phone", label: c.f_phone, ph: c.f_phone_ph, kind: "phone" },
  ];
  const TOTAL = STEPS.length;

  const [form, setForm] = useState(() => Object.fromEntries(STEPS.map((s) => [s.key, ""])));
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);

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

  const advance = (nf) => {
    const next = firstIncomplete(nf);
    onProgress?.(nf, next);
    return next;
  };

  const commit = () => {
    const s = STEPS[step];
    const err = validate(s.key, form[s.key]);
    if (err) { setError(err); return; }
    setError("");
    setStep(advance(form));
  };

  const chooseSelect = (key, val) => {
    const nf = { ...form, [key]: val };
    setForm(nf);
    setError("");
    setTimeout(() => setStep(advance(nf)), 160);
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
    if (!consent) return;
    onNext({ ...form, contact_phone: `+966 ${form.contact_phone}`.trim(), language: lang, consent_given: true });
  };

  const enter = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-foreground mb-1">{c.form_title}</h2>
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
              exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="pt-1 space-y-4">
              <label htmlFor="diag-consent" className="flex items-start gap-3 rounded-xl border border-border bg-background p-4 cursor-pointer">
                <Checkbox id="diag-consent" checked={consent} onCheckedChange={(v) => setConsent(v === true)} className="mt-0.5" />
                <span className="text-sm text-foreground leading-relaxed">{c.consent} <span className="text-primary">*</span></span>
              </label>
              <Button ref={submitRef} onClick={submit} disabled={!consent}
                className="w-full bg-primary text-primary-foreground rounded-full h-12 font-semibold text-base">
                {c.cta} <Arrow className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}