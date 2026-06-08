import { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Admin";
import { Loader2, Search, FileText, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import SubmissionCard from "../../components/admin/SubmissionCard";
import SubmissionDetail from "../../components/admin/SubmissionDetail";
import { useAdminUser } from "../../components/admin/ProtectedAdminLayout";
import { requireRole, ROLES } from "../../lib/rbac";
import AccessDenied from "../../components/admin/AccessDenied";
import { INDUSTRIES_EN, COMPANY_SIZES, ASSESSMENT_STATUSES } from "../../lib/industries";

const ALL_FIELDS = [
  "id", "created_date", "company_name", "industry", "company_size", "main_activity",
  "key_challenges", "language", "contact_name", "contact_email", "contact_phone",
  "status", "risk_level", "maturity_level",
  "operational_score", "financial_score", "marketing_score",
  "suggested_services", "business_snapshot", "identified_problems",
  "questionnaire_answers", "diagnosis", "internal_notes",
];

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const str = typeof value === "string" ? value : String(value);
  if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

function downloadCSV(rows) {
  const header = ALL_FIELDS.join(",");
  const body = rows.map((r) => ALL_FIELDS.map((f) => csvEscape(r[f])).join(",")).join("\n");
  const blob = new Blob([header + "\n" + body], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `assessments-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function AssessmentsList() {
  // Hooks first — before any early return.
  const me = useAdminUser();
  const allowed = requireRole(me, ROLES.OWNER, ROLES.ADMIN);

  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterIndustry, setFilterIndustry] = useState("all");
  const [filterSize, setFilterSize] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selected, setSelected] = useState(null);

  const loadAssessments = async () => {
    setLoading(true);
    const data = await base44.entities.Assessment.list("-created_date", 500);
    setAssessments(data);
    setLoading(false);
  };

  useEffect(() => {
    if (allowed) loadAssessments();
  }, [allowed]);

  const updateStatus = async (id, status) => {
    await base44.entities.Assessment.update(id, { status });
    setAssessments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const startTs = startDate ? new Date(startDate).getTime() : null;
    const endTs = endDate ? new Date(endDate).getTime() + 24 * 60 * 60 * 1000 - 1 : null;

    return assessments.filter((a) => {
      if (q) {
        const hay = [a.company_name, a.contact_name, a.contact_email]
          .filter(Boolean).join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      const effectiveStatus = a.status || "New";
      if (filterStatus !== "all" && effectiveStatus !== filterStatus) return false;
      if (filterIndustry !== "all" && a.industry !== filterIndustry) return false;
      if (filterSize !== "all" && a.company_size !== filterSize) return false;
      if (startTs || endTs) {
        const ts = a.created_date ? new Date(a.created_date).getTime() : 0;
        if (startTs && ts < startTs) return false;
        if (endTs && ts > endTs) return false;
      }
      return true;
    });
  }, [assessments, search, filterStatus, filterIndustry, filterSize, startDate, endDate]);

  const statusCounts = useMemo(() => {
    const counts = { all: assessments.length };
    ASSESSMENT_STATUSES.forEach((s) => {
      counts[s] = assessments.filter((a) => (a.status || "New") === s).length;
    });
    return counts;
  }, [assessments]);

  if (!allowed) return <AccessDenied />;

  if (selected) {
    return (
      <div className="p-8">
        <Button variant="ghost" onClick={() => setSelected(null)} className="text-white/60 mb-6 hover:text-white">
          ← Back to Assessments
        </Button>
        <SubmissionDetail submission={selected} onUpdateStatus={updateStatus} />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Assessments</h1>
          <p className="text-white/40 text-sm mt-1">Manage assessment submissions</p>
        </div>
        <Button onClick={() => downloadCSV(filtered)} disabled={!filtered.length} className="gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      {/* Status pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        {[["all", "Total"], ...ASSESSMENT_STATUSES.map((s) => [s, s])].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilterStatus(key)}
            className={`p-4 rounded-xl border transition-all text-left ${
              filterStatus === key ? "bg-white/10 border-primary" : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            <p className="text-2xl font-bold text-white">{statusCounts[key] || 0}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{label}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company, contact name or email…"
            className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30"
          />
        </div>
        <Select value={filterIndustry} onValueChange={setFilterIndustry}>
          <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white"><SelectValue placeholder="Industry" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            {INDUSTRIES_EN.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterSize} onValueChange={setFilterSize}>
          <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white"><SelectValue placeholder="Size" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sizes</SelectItem>
            {COMPANY_SIZES.map((s) => <SelectItem key={s} value={s}>{s} employees</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="grid grid-cols-2 gap-2 lg:col-span-1">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-11 bg-white/5 border-white/10 text-white"
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="h-11 bg-white/5 border-white/10 text-white"
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
        </div>
      ) : assessments.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">No submissions yet</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">No submissions match your filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <SubmissionCard key={a.id} submission={a} onClick={() => setSelected(a)} onUpdateStatus={updateStatus} />
          ))}
        </div>
      )}
    </div>
  );
}