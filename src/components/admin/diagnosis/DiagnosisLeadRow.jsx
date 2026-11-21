import { useState } from "react";
import { ChevronDown } from "lucide-react";

const STEP_LABELS = { 11: "Questions answered", 12: "Report generated" };
export const stepLabel = (n) => STEP_LABELS[n] || (n ? `Intake step ${n}/10` : "-");

const DETAIL_FIELDS = [
  ["full_name", "Name"], ["job_title", "Job title"], ["email", "Email"], ["phone", "Phone"],
  ["company_name", "Company"], ["sector", "Sector"], ["company_size", "Size"], ["city", "City"],
  ["main_activity", "Main activity"], ["key_challenges", "Key challenge"], ["language", "Language"],
  ["consent_given", "Consent"], ["maturity_level", "Maturity stage"], ["risk_level", "Risk level"],
  ["suggested_services", "Recommended services"], ["utm_source", "utm_source"], ["utm_medium", "utm_medium"],
  ["utm_campaign", "utm_campaign"], ["utm_content", "utm_content"], ["utm_term", "utm_term"],
  ["referrer", "Referrer"], ["landing_page", "Landing page"],
];

function parseAnswers(json) {
  try { return JSON.parse(json || "[]"); } catch { return []; }
}

export default function DiagnosisLeadRow({ lead }) {
  const [open, setOpen] = useState(false);
  const answers = parseAnswers(lead.questionnaire_answers);
  return (
    <div className="rounded-xl border border-white/10 bg-white/5">
      <button onClick={() => setOpen(!open)} className="w-full flex flex-wrap items-center gap-x-6 gap-y-1 px-5 py-4 text-left">
        <span className="font-semibold text-white min-w-[160px]">{lead.company_name || "-"}</span>
        <span className="text-sm text-white/60">{lead.full_name || "-"}</span>
        <span className="text-sm text-white/40">{lead.sector || "-"}</span>
        <span className="text-xs text-white/40">{lead.utm_campaign || "no campaign"}</span>
        <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-full ${lead.completed ? "bg-emerald-500/20 text-emerald-300" : "bg-yellow-500/20 text-yellow-200"}`}>
          {lead.completed ? "Completed" : stepLabel(lead.last_step_reached)}
        </span>
        <span className="ml-auto text-xs text-white/40">{new Date(lead.created_date).toLocaleString()}</span>
        <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="border-t border-white/10 px-5 py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            {DETAIL_FIELDS.map(([k, label]) => (
              <p key={k} className="text-sm"><span className="text-white/40">{label}: </span>
                <span className="text-white/90 break-words">{String(lead[k] ?? "") || "-"}</span></p>
            ))}
          </div>
          {answers.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-widest text-white/40">Diagnosis answers</p>
              {answers.map((a, i) => (
                <p key={i} className="text-sm"><span className="text-white/60">{i + 1}. {a.question}</span><br />
                  <span className="text-white">{a.answer}</span></p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}