import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import moment from "moment";

const STATUS_COLORS = {
  New: "bg-blue-500/20 text-blue-400",
  "In Progress": "bg-yellow-500/20 text-yellow-400",
  Contacted: "bg-green-500/20 text-green-400",
};

const RISK_COLORS = {
  High: "text-red-400",
  Medium: "text-yellow-400",
  Low: "text-green-400",
};

export default function SubmissionCard({ submission, onClick, onUpdateStatus }) {
  const s = submission;

  return (
    <div
      onClick={onClick}
      className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-white font-semibold truncate">{s.company_name}</h3>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[s.status] || STATUS_COLORS.New}`}>
              {s.status || "New"}
            </span>
            {s.language === "ar" && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-400">عربي</span>
            )}
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-white/40">
            <span>{s.contact_name}</span>
            <span>{s.industry}</span>
            <span>{s.company_size} employees</span>
            {s.risk_level && <span className={RISK_COLORS[s.risk_level]}>Risk: {s.risk_level}</span>}
            <span>{moment(s.created_date).fromNow()}</span>
          </div>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <Select
            value={s.status || "New"}
            onValueChange={(v) => onUpdateStatus(s.id, v)}
          >
            <SelectTrigger className="w-36 h-9 bg-white/5 border-white/10 text-white text-xs">
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
  );
}