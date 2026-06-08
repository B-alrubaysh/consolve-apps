import { format } from "date-fns";
import { base44 } from "@/api/base44Admin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye } from "lucide-react";

const STATUS_OPTIONS = ["new", "reviewed", "shortlisted", "rejected", "hired"];

const STATUS_STYLES = {
  new: "bg-blue-500/15 text-blue-400",
  reviewed: "bg-white/10 text-white/70",
  shortlisted: "bg-yellow-500/15 text-yellow-400",
  rejected: "bg-red-500/15 text-red-400",
  hired: "bg-green-500/15 text-green-400",
};

function fmt(d) {
  if (!d) return "—";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "—";
  return format(dt, "MMM d, yyyy");
}

export default function JobApplicationRow({ application, jobMap, onView, onUpdate }) {
  const job = application.job_post_id ? jobMap.get(application.job_post_id) : null;
  const isGeneral = application.submission_type === "general_submission";

  const handleStatus = async (e, newStatus) => {
    e.stopPropagation();
    await base44.entities.JobApplication.update(application.id, { status: newStatus });
    onUpdate?.({ ...application, status: newStatus });
  };

  return (
    <div
      onClick={() => onView(application)}
      className="grid grid-cols-12 items-center gap-4 px-4 py-3 border-t border-white/5 hover:bg-white/5 transition-colors text-sm cursor-pointer"
    >
      <div className="col-span-3 min-w-0">
        <p className="text-white font-medium truncate">{application.full_name}</p>
        <p className="text-white/50 text-xs truncate">{application.email}</p>
      </div>
      <div className="col-span-2 text-white/60 text-xs hidden md:block truncate">{application.phone || "—"}</div>
      <div className="col-span-2 hidden lg:block min-w-0">
        {isGeneral ? (
          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-widest bg-white/10 text-white/70">
            General
          </span>
        ) : (
          <span className="text-white/70 truncate block">{job?.title_en || "—"}</span>
        )}
      </div>
      <div className="col-span-1 hidden lg:block">
        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-widest bg-white/10 text-white/60">
          {application.language?.toUpperCase() || "—"}
        </span>
      </div>
      <div className="col-span-2 text-white/40 text-xs hidden md:block">{fmt(application.created_date)}</div>
      <div className="col-span-3 md:col-span-2" onClick={(e) => e.stopPropagation()}>
        <Select value={application.status || "new"} onValueChange={(v) => handleStatus({ stopPropagation: () => {} }, v)}>
          <SelectTrigger className={`h-8 text-xs border-white/10 ${STATUS_STYLES[application.status] || STATUS_STYLES.new}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-9 md:col-span-1 flex items-center justify-end">
        <button
          onClick={(e) => { e.stopPropagation(); onView(application); }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 text-xs"
        >
          <Eye className="w-3.5 h-3.5" /> View
        </button>
      </div>
    </div>
  );
}