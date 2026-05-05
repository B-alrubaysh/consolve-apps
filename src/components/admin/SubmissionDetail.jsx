import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import moment from "moment";
import { base44 } from "@/api/base44Client";
import { ASSESSMENT_STATUSES } from "../../lib/industries";

function safeParseJSON(value, fallback) {
  if (!value) return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function Section({ title, children }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function PlainText({ value }) {
  if (!value) return <p className="text-sm text-white/30">—</p>;
  return <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{value}</p>;
}

function StringList({ value }) {
  // Accept either an array (from diagnosis JSON) or a comma-separated string.
  let items = [];
  if (Array.isArray(value)) items = value;
  else if (typeof value === "string" && value.trim()) items = value.split(/,\s*/);
  if (!items.length) return <p className="text-sm text-white/30">—</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-primary/20 text-primary font-medium">
          {item}
        </span>
      ))}
    </div>
  );
}

export default function SubmissionDetail({ submission, onUpdateStatus }) {
  const s = submission;
  const diagnosis = safeParseJSON(s.diagnosis, null);
  const answers = safeParseJSON(s.questionnaire_answers, []);

  // Internal notes — autosave on blur.
  const [notes, setNotes] = useState(s.internal_notes || "");
  const [savedNotes, setSavedNotes] = useState(s.internal_notes || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setNotes(s.internal_notes || "");
    setSavedNotes(s.internal_notes || "");
  }, [s.id, s.internal_notes]);

  const saveNotes = async () => {
    if (notes === savedNotes) return;
    setSaving(true);
    await base44.entities.Assessment.update(s.id, { internal_notes: notes });
    setSavedNotes(notes);
    setSaving(false);
  };

  // Use entity values when present, fall back to parsed diagnosis fields.
  const businessSnapshot = s.business_snapshot || diagnosis?.business_snapshot;
  const identifiedProblems = s.identified_problems || diagnosis?.identified_problems;
  const rootCauses = diagnosis?.root_causes;
  const focusAreas = diagnosis?.focus_areas;
  const suggestedServices = s.suggested_services || diagnosis?.suggested_services;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{s.company_name}</h2>
            <p className="text-white/40 text-sm">{s.industry} · {s.company_size} employees</p>
            {s.main_activity && <p className="text-white/40 text-sm mt-1">Activity: {s.main_activity}</p>}
            <p className="text-white/30 text-xs mt-3">
              Submitted {moment(s.created_date).format("MMMM D, YYYY [at] h:mm A")}
              {s.language && <span className="ml-2 text-white/40">· {s.language === "ar" ? "Arabic" : "English"}</span>}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={s.status || "New"} onValueChange={(v) => onUpdateStatus(s.id, v)}>
              <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ASSESSMENT_STATUSES.map((st) => (
                  <SelectItem key={st} value={st}>{st}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Contact */}
      <Section title="Contact Details">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-white/40 text-xs mb-1">Name</p>
            <p className="text-white">{s.contact_name || "—"}</p>
          </div>
          <div>
            <p className="text-white/40 text-xs mb-1">Email</p>
            <p className="text-white">{s.contact_email || "—"}</p>
          </div>
          <div>
            <p className="text-white/40 text-xs mb-1">Phone</p>
            <p className="text-white">{s.contact_phone || "—"}</p>
          </div>
        </div>
      </Section>

      {/* Scores */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Operational", score: s.operational_score },
          { label: "Financial", score: s.financial_score },
          { label: "Marketing", score: s.marketing_score },
        ].map((item) => (
          <div key={item.label} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <p className="text-3xl font-bold text-primary">
              {item.score || 0}<span className="text-lg text-white/30">/100</span>
            </p>
            <p className="text-xs text-white/40 uppercase tracking-widest mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Risk + Maturity */}
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
      <Section title="Business Snapshot"><PlainText value={businessSnapshot} /></Section>
      <Section title="Identified Problems"><PlainText value={identifiedProblems} /></Section>
      <Section title="Root Causes"><StringList value={rootCauses} /></Section>
      <Section title="Focus Areas"><StringList value={focusAreas} /></Section>
      <Section title="Suggested Services"><StringList value={suggestedServices} /></Section>

      {/* Q&A */}
      {Array.isArray(answers) && answers.length > 0 && (
        <Section title="Assessment Q&A">
          <div className="space-y-4">
            {answers.map((qa, i) => (
              <div key={i} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                {qa.category && (
                  <span className="inline-block text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded bg-primary/20 text-primary mb-2">
                    {qa.category}
                  </span>
                )}
                <p className="text-sm text-white/80 mb-1">{qa.question}</p>
                <p className="text-sm text-white/50">{qa.answer}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Internal notes */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-white/40">Internal Notes</h3>
          <span className="text-xs text-white/30">
            {saving ? "Saving…" : notes !== savedNotes ? "Unsaved changes" : savedNotes ? "Saved" : ""}
          </span>
        </div>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={saveNotes}
          placeholder="Admin-only notes about this submission…"
          className="min-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-white/30"
        />
      </div>
    </div>
  );
}