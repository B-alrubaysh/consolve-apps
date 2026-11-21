import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import CTAButton from "@/components/CTAButton";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/lib/useLanguage";
import { getAttribution } from "@/lib/attribution";
import { AUDIT_COPY } from "./auditCopy";

const EMPTY = { full_name: "", company_name: "", email: "", phone: "", message: "" };
const input = "w-full text-sm rounded-xl border border-gray-200 px-3.5 py-3 text-[#0D2528] bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E87B59]/30 focus:border-[#E87B59]";

function validate(v, consent, C) {
  const e = {};
  ["full_name", "company_name", "message"].forEach((k) => { if (!v[k].trim()) e[k] = C.err_required; });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = v.email.trim() ? C.err_email : C.err_required;
  if (!/^5\d{8}$/.test(v.phone)) e.phone = v.phone ? C.err_phone : C.err_required;
  if (!consent) e.consent = C.err_consent;
  return e;
}

export default function AuditForm() {
  const { lang } = useLanguage();
  const C = AUDIT_COPY[lang];
  const [v, setV] = useState(EMPTY);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const set = (k) => (e) => setV({ ...v, [k]: k === "phone" ? e.target.value.replace(/\D/g, "").replace(/^0+/, "").slice(0, 9) : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate(v, consent, C);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStatus("sending");
    try {
      await base44.functions.invoke("saveServiceLead", { data: {
        ...getAttribution(), ...v, phone: `+966${v.phone}`, consent_given: true,
        service: "management_audit", language: lang, source_page: "/management-audit",
      } });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="bg-white rounded-2xl p-8 text-center">
        <CheckCircle2 className="w-12 h-12 text-[#E87B59] mx-auto mb-4" />
        <p className="text-[#0D2528] text-base sm:text-lg font-semibold leading-relaxed">{C.f_success}</p>
      </div>
    );
  }

  const field = (k, label, props = {}) => (
    <label className="block">
      <span className="block text-sm font-semibold text-[#0D2528] mb-1.5">{label}</span>
      {props.textarea
        ? <textarea rows={4} value={v[k]} onChange={set(k)} className={`${input} resize-none`} />
        : <input value={v[k]} onChange={set(k)} className={input} {...props} />}
      {errors[k] && <span className="block text-xs text-red-600 mt-1">{errors[k]}</span>}
    </label>
  );

  return (
    <form onSubmit={submit} noValidate className="bg-white rounded-2xl p-5 sm:p-7 space-y-4 text-start">
      <div className="grid sm:grid-cols-2 gap-4">
        {field("full_name", C.f_name, { autoComplete: "name" })}
        {field("company_name", C.f_company, { autoComplete: "organization" })}
        {field("email", C.f_email, { type: "email", autoComplete: "email", dir: "ltr" })}
        <label className="block">
          <span className="block text-sm font-semibold text-[#0D2528] mb-1.5">{C.f_phone}</span>
          <div dir="ltr" className="flex">
            <span className="flex items-center px-3 rounded-s-xl border border-e-0 border-gray-200 bg-[#F7F7F5] text-sm text-[#3D4D4F]">+966</span>
            <input value={v.phone} onChange={set("phone")} inputMode="numeric" autoComplete="tel-national" placeholder="5XXXXXXXX"
              className={`${input} rounded-s-none`} />
          </div>
          {errors.phone && <span className="block text-xs text-red-600 mt-1">{errors.phone}</span>}
        </label>
      </div>
      {field("message", C.f_message, { textarea: true })}
      <div>
        <label className="flex items-start gap-2.5 cursor-pointer">
          <Checkbox checked={consent} onCheckedChange={(c) => setConsent(c === true)} className="mt-0.5" aria-label={C.f_consent} />
          <span className="text-sm text-[#3D4D4F] leading-relaxed">{C.f_consent}</span>
        </label>
        {errors.consent && <span className="block text-xs text-red-600 mt-1">{errors.consent}</span>}
      </div>
      {status === "error" && <p className="text-sm text-red-600">{C.err_submit}</p>}
      <CTAButton type="submit" variant="primary" cta size="block" disabled={status === "sending"} className="whitespace-normal text-center">
        {status === "sending" && <Loader2 className="animate-spin" />}
        {C.f_submit}
      </CTAButton>
      <p className="text-xs text-[#718487] text-center leading-relaxed">{C.f_under}</p>
    </form>
  );
}