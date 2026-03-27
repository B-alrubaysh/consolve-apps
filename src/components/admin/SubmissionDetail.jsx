import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import moment from "moment";

export default function SubmissionDetail({ submission, onUpdateStatus }) {
  const s = submission;
  let diagnosisData = null;
  try { diagnosisData = s.diagnosis ? JSON.parse(s.diagnosis) : null; } catch { /* */ }

  let answersData = [];
  try { answersData = s.questionnaire_answers ? JSON.parse(s.questionnaire_answers) : []; } catch { /* */ }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{s.company_name}</h2>
            <p className="text-white/40 text-sm">{s.industry} · {s.company_size} employees</p>
            {s.main_activity && <p className="text-white/40 text-sm mt-1">Activity: {s.main_activity}</p>}
            <p className="text-white/30 text-xs mt-3">Submitted {moment(s.created_date).format("MMMM D, YYYY [at] h:mm A")}</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={s.status || "New"} onValueChange={(v) => onUpdateStatus(s.id, v)}>
              <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-4">Contact Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-white/40 text-xs mb-1">Name</p>
            <p className="text-white">{s.contact_name}</p>
          </div>
          <div>
            <p className="text-white/40 text-xs mb-1">Email</p>
            <p className="text-white">{s.contact_email}</p>
          </div>
          <div>
            <p className="text-white/40 text-xs mb-1">Phone</p>
            <p className="text-white">{s.contact_phone || "—"}</p>
          </div>
        </div>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Operational", score: s.operational_score },
          { label: "Financial", score: s.financial_score },
          { label: "Marketing", score: s.marketing_score },
        ].map((item) => (
          <div key={item.label} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <p className="text-3xl font-bold text-primary">{item.score || 0}<span className="text-lg text-white/30">/100</span></p>
            <p className="text-xs text-white/40 uppercase tracking-widest mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Meta */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Risk Level</p>
          <p className={`text-xl font-bold ${s.risk_level === "High" ? "text-red-400" : s.risk_level === "Medium" ? "text-yellow-400" : "text-green-400"}`}>
            {s.risk_level || "—"}
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Maturity</p>
          <p className="text-xl font-bold text-white">{s.maturity_level || "—"}</p>
        </div>
      </div>

      {/* Diagnosis */}
      {s.business_snapshot && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-4">Business Snapshot</h3>
          <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{s.business_snapshot}</p>
        </div>
      )}

      {s.identified_problems && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-4">Identified Problems</h3>
          <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{s.identified_problems}</p>
        </div>
      )}

      {s.suggested_services && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-4">Suggested Services</h3>
          <div className="flex flex-wrap gap-2">
            {s.suggested_services.split(", ").map((svc, i) => (
              <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-primary/20 text-primary font-medium">{svc}</span>
            ))}
          </div>
        </div>
      )}

      {/* Q&A */}
      {answersData.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-4">Assessment Q&A</h3>
          <div className="space-y-4">
            {answersData.map((qa, i) => (
              <div key={i} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                <p className="text-xs text-primary font-medium mb-1">{qa.category}</p>
                <p className="text-sm text-white/80 mb-1">{qa.question}</p>
                <p className="text-sm text-white/50">{qa.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}