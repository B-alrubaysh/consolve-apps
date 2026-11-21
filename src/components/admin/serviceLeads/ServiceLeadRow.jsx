import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const SERVICE_LABELS = { management_audit: "Management Audit" };

const DETAIL_FIELDS = [
  ["full_name", "Name"], ["company_name", "Company"], ["email", "Email"], ["phone", "Phone"],
  ["language", "Language"], ["consent_given", "Consent"], ["source_page", "Source page"],
  ["utm_source", "utm_source"], ["utm_medium", "utm_medium"], ["utm_campaign", "utm_campaign"],
  ["utm_content", "utm_content"], ["utm_term", "utm_term"], ["referrer", "Referrer"], ["landing_page", "Landing page"],
];

export default function ServiceLeadRow({ lead }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-white/10 bg-white/5">
      <button onClick={() => setOpen(!open)} className="w-full flex flex-wrap items-center gap-x-6 gap-y-1 px-5 py-4 text-left">
        <span className="font-semibold text-white min-w-[160px]">{lead.company_name || "-"}</span>
        <span className="text-sm text-white/60">{lead.full_name || "-"}</span>
        <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-primary/20 text-primary">
          {SERVICE_LABELS[lead.service] || lead.service}
        </span>
        <span className="text-xs text-white/40">{lead.utm_campaign || "no campaign"}</span>
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
          <div>
            <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Challenge / goal</p>
            <p className="text-sm text-white whitespace-pre-wrap">{lead.message || "-"}</p>
          </div>
        </div>
      )}
    </div>
  );
}