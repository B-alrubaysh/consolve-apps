import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import { Loader2, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import t from "../../lib/translations";

const RISK_LABELS_AR = { Low: "منخفض", Medium: "متوسط", High: "مرتفع" };
const MATURITY_LABELS_AR = { "Early Stage": "مرحلة مبكرة", Growing: "في نمو", Structured: "منظّم", Advanced: "متقدم" };

export default function AssessmentStep3({ clientInfo, answers, onBack, lang }) {
  const tx = t[lang];
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedSnapshot, setEditedSnapshot] = useState("");
  const [editedProblems, setEditedProblems] = useState("");

  useEffect(() => { generateDiagnosis(); }, []);

  const generateDiagnosis = async () => {
    setLoading(true);
    const langInstruction = lang === "ar"
      ? "IMPORTANT: Write ALL text fields (business_snapshot, identified_problems, risk_assessment, root_causes, focus_areas, suggested_services) in Arabic language only."
      : "Write all text fields in English.";

    const prompt = `You are an expert business consultant. Analyze this company and provide a comprehensive diagnosis.

${langInstruction}

Company: ${clientInfo.company_name}
Industry: ${clientInfo.industry}
Size: ${clientInfo.company_size} employees
Activity: ${clientInfo.main_activity || "N/A"}
Challenges: ${clientInfo.key_challenges || "N/A"}

Assessment Q&A:
${answers.map((a, i) => `Q${i + 1} [${a.category}]: ${a.question}\nA: ${a.answer}`).join("\n\n")}

Provide a thorough, specific, and actionable diagnosis.`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          business_snapshot: { type: "string" },
          identified_problems: { type: "string" },
          risk_assessment: { type: "string" },
          risk_level: { type: "string", enum: ["Low", "Medium", "High"] },
          maturity_level: { type: "string", enum: ["Early Stage", "Growing", "Structured", "Advanced"] },
          suggested_services: { type: "array", items: { type: "string" } },
          operational_score: { type: "number" },
          financial_score: { type: "number" },
          marketing_score: { type: "number" },
          root_causes: { type: "array", items: { type: "string" } },
          focus_areas: { type: "array", items: { type: "string" } }
        }
      }
    });

    setDiagnosis(result);
    setEditedSnapshot(result.business_snapshot || "");
    setEditedProblems(result.identified_problems || "");
    setLoading(false);
  };

  const handleSubmit = async () => {
    setSaving(true);
    await base44.entities.Assessment.create({
      ...clientInfo,
      questionnaire_answers: JSON.stringify(answers),
      diagnosis: JSON.stringify(diagnosis),
      business_snapshot: editMode ? editedSnapshot : diagnosis.business_snapshot,
      identified_problems: editMode ? editedProblems : diagnosis.identified_problems,
      risk_level: diagnosis.risk_level,
      maturity_level: diagnosis.maturity_level,
      suggested_services: (diagnosis.suggested_services || []).join(", "),
      operational_score: diagnosis.operational_score,
      financial_score: diagnosis.financial_score,
      marketing_score: diagnosis.marketing_score,
      status: "New",
      language: lang,
    });

    const emailSubject = lang === "ar" ? "تم استلام تقييمك من كونسولف" : "Your Consolve Assessment Has Been Received";
    const emailBody = lang === "ar"
      ? `عزيزي ${clientInfo.contact_name}،\n\nشكراً لإتمامك التقييم الذكي لشركة ${clientInfo.company_name}.\n\nتم استلام طلبك. سيقوم فريقنا بمراجعة نتائج تقييمك والتواصل معك قريباً لمناقشة الخطوات التالية.\n\nمع أطيب التحيات،\nفريق كونسولف`
      : `Dear ${clientInfo.contact_name},\n\nThank you for completing the Consolve Smart Assessment for ${clientInfo.company_name}.\n\nYour request has been received. Our team will review your assessment results and contact you shortly.\n\nBest regards,\nThe Consolve Team`;

    await base44.integrations.Core.SendEmail({ to: clientInfo.contact_email, subject: emailSubject, body: emailBody });
    setSaved(true);
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 text-center py-20">
        <div className="inline-flex items-center gap-3 bg-card border border-border rounded-2xl px-8 py-6">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-foreground font-medium">{tx.assess_analyzing}</span>
        </div>
      </div>
    );
  }

  if (saved) {
    return (
      <div className="max-w-2xl mx-auto px-6 text-center py-20">
        <div className="bg-card border border-primary/30 rounded-2xl p-12">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-foreground mb-4">{tx.assess_success_title}</h2>
          <p className="text-muted-foreground mb-8">{tx.assess_success_p(clientInfo.contact_email)}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/services" className="inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold text-sm">{tx.assess_explore}</Link>
            <Link to="/" className="inline-flex items-center justify-center border border-border text-foreground px-8 py-3 rounded-full font-semibold text-sm">{tx.assess_home}</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!diagnosis) return null;

  const riskColor = diagnosis.risk_level === "High" ? "text-red-500" : diagnosis.risk_level === "Medium" ? "text-yellow-500" : "text-green-500";
  const displayRisk = lang === "ar" ? (RISK_LABELS_AR[diagnosis.risk_level] || diagnosis.risk_level) : diagnosis.risk_level;
  const displayMaturity = lang === "ar" ? (MATURITY_LABELS_AR[diagnosis.maturity_level] || diagnosis.maturity_level) : diagnosis.maturity_level;

  return (
    <div className="max-w-4xl mx-auto px-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-3">{tx.assess_diagnosis_title}</h2>
        <p className="text-muted-foreground">{tx.assess_diagnosis_sub}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: tx.assess_operational, score: diagnosis.operational_score },
          { label: tx.assess_financial, score: diagnosis.financial_score },
          { label: tx.assess_marketing, score: diagnosis.marketing_score },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-6 text-center">
            <p className="text-3xl font-bold text-primary mb-1">{s.score || 0}<span className="text-lg">/100</span></p>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4">
          <AlertTriangle className={`w-8 h-8 ${riskColor}`} />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">{tx.assess_risk}</p>
            <p className={`text-lg font-bold ${riskColor}`}>{displayRisk}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4">
          <TrendingUp className="w-8 h-8 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">{tx.assess_maturity}</p>
            <p className="text-lg font-bold text-foreground">{displayMaturity}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 mb-8">
        <div className="bg-card border border-border rounded-2xl p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">{tx.assess_snapshot}</h3>
            <Button variant="ghost" size="sm" onClick={() => setEditMode(!editMode)} className="text-xs text-primary">
              {editMode ? tx.assess_preview : tx.assess_edit}
            </Button>
          </div>
          {editMode ? (
            <Textarea value={editedSnapshot} onChange={(e) => setEditedSnapshot(e.target.value)} className="min-h-[120px]" />
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{editedSnapshot}</p>
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">{tx.assess_problems}</h3>
          {editMode ? (
            <Textarea value={editedProblems} onChange={(e) => setEditedProblems(e.target.value)} className="min-h-[120px]" />
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{editedProblems}</p>
          )}
          {diagnosis.root_causes && diagnosis.root_causes.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {diagnosis.root_causes.map((rc, i) => (
                <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-destructive/10 text-destructive font-medium">{rc}</span>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">{tx.assess_risk_assess}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{diagnosis.risk_assessment}</p>
        </div>

        {diagnosis.suggested_services && diagnosis.suggested_services.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">{tx.assess_services}</h3>
            <div className="flex flex-wrap gap-3">
              {diagnosis.suggested_services.map((s, i) => (
                <span key={i} className="text-sm px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">{s}</span>
              ))}
            </div>
          </div>
        )}

        {diagnosis.focus_areas && diagnosis.focus_areas.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">{tx.assess_focus}</h3>
            <div className="space-y-2">
              {diagnosis.focus_areas.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">{i + 1}</span>
                  <p className="text-sm text-foreground">{f}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-4 pb-8">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground">{tx.assess_back}</Button>
        <Button onClick={handleSubmit} disabled={saving} className="bg-primary text-primary-foreground rounded-full px-8 h-12 font-semibold">
          {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />{tx.assess_submitting}</> : tx.assess_submit}
        </Button>
      </div>
    </div>
  );
}