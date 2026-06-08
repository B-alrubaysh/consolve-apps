import { useState } from "react";
import { format } from "date-fns";
import { base44 } from "@/api/base44Admin";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { Download, ExternalLink } from "lucide-react";

const STATUS_OPTIONS = ["new", "reviewed", "shortlisted", "rejected", "hired"];

function fmt(d) {
  if (!d) return "—";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "—";
  return format(dt, "PPpp");
}

function MetaRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <span className="text-white/40">{label}</span>
      <span className="text-white text-right break-all">{value || "—"}</span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mt-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-2">{title}</p>
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">{children}</div>
    </div>
  );
}

export default function JobApplicationDetail({ application, jobMap, onClose, onUpdate }) {
  const [notes, setNotes] = useState(application?.internal_notes || "");
  const [savingNotes, setSavingNotes] = useState(false);
  const job = application?.job_post_id ? jobMap.get(application.job_post_id) : null;

  if (!application) return null;

  const handleStatusChange = async (newStatus) => {
    await base44.entities.JobApplication.update(application.id, { status: newStatus });
    onUpdate?.({ ...application, status: newStatus });
  };

  const handleNotesBlur = async () => {
    if (notes === (application.internal_notes || "")) return;
    setSavingNotes(true);
    await base44.entities.JobApplication.update(application.id, { internal_notes: notes });
    onUpdate?.({ ...application, internal_notes: notes });
    setSavingNotes(false);
  };

  return (
    <Sheet open={!!application} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="bg-secondary text-white border-white/10 sm:max-w-xl w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white text-2xl">{application.full_name}</SheetTitle>
          <div className="text-sm text-white/60 flex flex-wrap gap-x-3 gap-y-1 mt-1">
            <span>{application.email}</span>
            {application.phone && <span>· {application.phone}</span>}
          </div>
        </SheetHeader>

        <Section title="Application">
          <MetaRow
            label="Job"
            value={
              job ? (
                <Link to="/admin/careers" className="text-primary hover:underline">{job.title_en}</Link>
              ) : application.submission_type === "general_submission" ? (
                "General Submission"
              ) : (
                "—"
              )
            }
          />
          <MetaRow label="Type" value={application.submission_type === "general_submission" ? "General" : "Job Application"} />
          <MetaRow label="Submitted" value={fmt(application.created_date)} />
          <MetaRow label="Source" value={application.source_page} />
          <MetaRow label="Language" value={application.language?.toUpperCase()} />
          <div className="flex justify-between items-center gap-4 pt-2 mt-2 border-t border-white/10">
            <span className="text-white/40 text-sm">Status</span>
            <Select value={application.status || "new"} onValueChange={handleStatusChange}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white w-44 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </Section>

        <Section title="Documents">
          {application.cv_url ? (
            <a
              href={application.cv_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Download className="w-4 h-4" /> Open CV
            </a>
          ) : (
            <p className="text-white/40 text-sm">No CV uploaded</p>
          )}
          {application.linkedin_url && (
            <a href={application.linkedin_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 mt-3 text-sm text-white/70 hover:text-primary"
            >
              <ExternalLink className="w-3.5 h-3.5" /> LinkedIn
            </a>
          )}
          {application.portfolio_url && (
            <a href={application.portfolio_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 mt-2 text-sm text-white/70 hover:text-primary"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Portfolio
            </a>
          )}
        </Section>

        <Section title="Cover Message">
          {application.cover_message ? (
            <p className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed">{application.cover_message}</p>
          ) : (
            <p className="text-white/40 text-sm">No cover message</p>
          )}
        </Section>

        <Section title="Internal Notes">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleNotesBlur}
            placeholder="Notes for the team…"
            className="bg-white/5 border-white/10 text-white min-h-[100px]"
          />
          {savingNotes && <p className="text-xs text-white/40 mt-1">Saving…</p>}
        </Section>
      </SheetContent>
    </Sheet>
  );
}