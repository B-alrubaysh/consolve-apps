import { format } from "date-fns";
import { base44 } from "@/api/base44Admin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye } from "lucide-react";

const STATUS_OPTIONS = ["New", "Read", "Replied"];

const STATUS_STYLES = {
  New: "bg-blue-500/15 text-blue-400",
  Read: "bg-white/10 text-white/70",
  Replied: "bg-green-500/15 text-green-400",
};

function fmt(d) {
  if (!d) return "—";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "—";
  return format(dt, "MMM d, yyyy");
}

export default function ContactInquiryRow({ inquiry, onView, onUpdate }) {
  const handleStatus = async (newStatus) => {
    await base44.entities.ContactInquiry.update(inquiry.id, { status: newStatus });
    onUpdate?.({ ...inquiry, status: newStatus });
  };

  const status = inquiry.status || "New";

  return (
    <div
      onClick={() => onView(inquiry)}
      className="grid grid-cols-12 items-center gap-4 px-4 py-3 border-t border-white/5 hover:bg-white/5 transition-colors text-sm cursor-pointer"
    >
      <div className="col-span-3 min-w-0">
        <p className="text-white font-medium truncate">{inquiry.name}</p>
        <p className="text-white/50 text-xs truncate">{inquiry.email}</p>
      </div>
      <div className="col-span-2 text-white/60 text-xs hidden md:block truncate">{inquiry.phone || "—"}</div>
      <div className="col-span-2 text-white/60 text-xs hidden lg:block truncate">{inquiry.company || "—"}</div>
      <div className="col-span-1 hidden lg:block">
        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-widest bg-white/10 text-white/60">
          {inquiry.language?.toUpperCase() || "—"}
        </span>
      </div>
      <div className="col-span-2 text-white/40 text-xs hidden md:block">{fmt(inquiry.created_date)}</div>
      <div className="col-span-3 md:col-span-2" onClick={(e) => e.stopPropagation()}>
        <Select value={status} onValueChange={handleStatus}>
          <SelectTrigger className={`h-8 text-xs border-white/10 ${STATUS_STYLES[status] || STATUS_STYLES.New}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-9 md:col-span-1 flex items-center justify-end">
        <button
          onClick={(e) => { e.stopPropagation(); onView(inquiry); }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 text-xs"
        >
          <Eye className="w-3.5 h-3.5" /> View
        </button>
      </div>
    </div>
  );
}