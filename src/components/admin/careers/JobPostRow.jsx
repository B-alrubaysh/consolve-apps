import { format } from "date-fns";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";

const STATUS_STYLES = {
  draft: "bg-white/10 text-white/60",
  open: "bg-green-500/15 text-green-400",
  closed: "bg-yellow-500/15 text-yellow-400",
  archived: "bg-white/5 text-white/40",
};

function fmt(d) {
  if (!d) return "—";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "—";
  return format(dt, "MMM d, yyyy");
}

function Badge({ children, className = "" }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-widest ${className}`}>
      {children}
    </span>
  );
}

export default function JobPostRow({ job, onEdit, onToggleStatus, onDelete }) {
  const limit = job.application_limit;
  const count = job.application_count || 0;
  const limitDisplay = limit == null ? "∞" : limit;
  const isOpen = job.status === "open";

  return (
    <div className="grid grid-cols-12 items-center gap-4 px-4 py-3 border-t border-white/5 hover:bg-white/5 transition-colors text-sm">
      <div className="col-span-3 min-w-0">
        <p className="text-white font-medium truncate">{job.title_en || "—"}</p>
        {job.title_ar && <p className="text-white/50 text-xs truncate" dir="rtl">{job.title_ar}</p>}
      </div>
      <div className="col-span-2 text-white/60 truncate hidden md:block">{job.department_en || "—"}</div>
      <div className="col-span-2 text-white/60 truncate hidden lg:block">{job.location_en || "—"}</div>
      <div className="col-span-1 hidden lg:block">
        {job.work_type ? <Badge className="bg-white/10 text-white/70">{job.work_type}</Badge> : <span className="text-white/30 text-xs">—</span>}
      </div>
      <div className="col-span-1 hidden lg:block">
        {job.employment_type ? <Badge className="bg-white/10 text-white/70">{job.employment_type}</Badge> : <span className="text-white/30 text-xs">—</span>}
      </div>
      <div className="col-span-1">
        <Badge className={STATUS_STYLES[job.status] || STATUS_STYLES.draft}>{job.status || "draft"}</Badge>
      </div>
      <div className="col-span-1 text-white/60 text-xs">{count} / {limitDisplay}</div>
      <div className="col-span-1 text-white/40 text-xs hidden xl:block">{fmt(job.publish_date)}</div>
      <div className="col-span-12 md:col-span-2 lg:col-span-1 flex items-center justify-end gap-1">
        <button
          onClick={() => onToggleStatus(job)}
          title={isOpen ? "Close applications" : "Open applications"}
          className="p-2 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          {isOpen ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
        <button
          onClick={() => onEdit(job)}
          title="Edit"
          className="p-2 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(job)}
          title="Delete"
          className="p-2 rounded-lg text-white/60 hover:bg-destructive/20 hover:text-destructive transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}