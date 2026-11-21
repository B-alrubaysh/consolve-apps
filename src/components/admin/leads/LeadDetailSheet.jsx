import { useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Admin";
import { STATUSES, statusOf, formatDate, notifyLeadsChanged } from "./leadsConfig";
import { parseJSON } from "./leadFieldLabels";
import LeadQuickActions from "./LeadQuickActions";
import LeadNotes from "./LeadNotes";
import LeadFieldList from "./LeadFieldList";
import JsonView from "./JsonView";

function Block({ title, children }) {
  return (
    <section className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-primary">{title}</h3>
      {children}
    </section>
  );
}

export default function LeadDetailSheet({ lang, source, lead, onClose, onPatched }) {
  const isAr = lang === "ar";
  const ent = base44.entities[source.entity];

  const save = async (data) => {
    await ent.update(lead.id, data);
    onPatched(lead.id, data);
    notifyLeadsChanged();
  };

  // Opening a request marks it as read.
  useEffect(() => {
    if (lead && lead.is_read !== true) save({ is_read: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lead?.id]);

  const answers = lead ? parseJSON(lead.questionnaire_answers) : null;
  const report = lead ? parseJSON(lead.diagnosis) : null;
  const raw = lead ? parseJSON(lead.raw_data) : null;
  const f = source.f;

  return (
    <Sheet open={!!lead} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side={isAr ? "left" : "right"} dir={isAr ? "rtl" : "ltr"}
        className="w-full sm:max-w-xl overflow-y-auto bg-secondary text-white border-white/10 font-inter">
        {lead && (
          <div className="space-y-7">
            <SheetHeader className="text-start space-y-1">
              <SheetTitle className="text-white text-xl leading-relaxed">{lead[f.name] || "-"}</SheetTitle>
              <SheetDescription className="text-white/50">
                {lead[f.company] || "-"} · {source.label[lang]} · <bdi>{formatDate(lead.created_date)}</bdi>
              </SheetDescription>
            </SheetHeader>

            <LeadQuickActions phone={lead[f.phone]} email={lead[f.email]} lang={lang} />

            <Block title={isAr ? "الحالة" : "Status"}>
              <Select value={statusOf(lead)} onValueChange={(v) => save({ lead_status: v })}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => <SelectItem key={s.key} value={s.key}>{isAr ? s.ar : s.en}</SelectItem>)}
                </SelectContent>
              </Select>
            </Block>

            <Block title={isAr ? "ملاحظات داخلية" : "Internal notes"}>
              <LeadNotes value={lead.internal_notes} lang={lang} onSave={(t) => save({ internal_notes: t })} />
            </Block>

            <Block title={isAr ? "تفاصيل الطلب" : "Request details"}>
              <LeadFieldList lead={lead} lang={lang} />
            </Block>

            {Array.isArray(answers) && answers.length > 0 && (
              <Block title={isAr ? "إجابات التشخيص" : "Diagnosis answers"}>
                <ol className="space-y-3">
                  {answers.map((a, i) => (
                    <li key={i} className="text-sm">
                      <p className="text-white/50">{i + 1}. {a.question || a.q || ""}</p>
                      <p className="text-white mt-0.5">{typeof a.answer === "object" ? JSON.stringify(a.answer) : String(a.answer ?? a.a ?? "-")}</p>
                    </li>
                  ))}
                </ol>
              </Block>
            )}

            {report && (
              <Block title={isAr ? "التقرير المُولّد" : "Generated report"}>
                <JsonView value={report} />
              </Block>
            )}

            {raw && (
              <Block title={isAr ? "جميع الحقول المرسلة" : "All submitted fields"}>
                <JsonView value={raw} />
              </Block>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}