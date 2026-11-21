import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Admin";
import { Loader2, Download, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminUser } from "../../components/admin/ProtectedAdminLayout";
import { requireRole, ROLES } from "../../lib/rbac";
import AccessDenied from "../../components/admin/AccessDenied";
import DiagnosisLeadRow from "../../components/admin/diagnosis/DiagnosisLeadRow";
import { INDUSTRIES_EN, INDUSTRIES_AR } from "../../components/assessment/AssessmentStep1";

const CSV_FIELDS = [
  "id", "created_date", "completed", "last_step_reached", "language", "full_name", "job_title",
  "company_name", "sector", "company_size", "city", "main_activity", "key_challenges", "email", "phone",
  "consent_given", "maturity_level", "risk_level", "suggested_services", "questionnaire_answers", "diagnosis",
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "referrer", "landing_page",
];
const SECTORS = [...new Set([...INDUSTRIES_AR, ...INDUSTRIES_EN])];

const csvEscape = (v) => {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

function downloadCSV(rows) {
  const body = rows.map((r) => CSV_FIELDS.map((f) => csvEscape(r[f])).join(",")).join("\n");
  // BOM so Excel opens Arabic text correctly.
  const blob = new Blob(["\uFEFF" + CSV_FIELDS.join(",") + "\n" + body], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `diagnosis-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function AdminDiagnosisLeadsPage() {
  const me = useAdminUser();
  const allowed = requireRole(me, ROLES.OWNER, ROLES.ADMIN);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sector, setSector] = useState("all");
  const [completed, setCompleted] = useState("all");
  const [campaign, setCampaign] = useState("");

  useEffect(() => {
    if (!allowed) return;
    const query = {};
    if (from || to) {
      query.created_date = {};
      if (from) query.created_date.$gte = new Date(from).toISOString();
      if (to) query.created_date.$lte = new Date(new Date(to).getTime() + 86399999).toISOString();
    }
    if (sector !== "all") query.sector = sector;
    if (completed !== "all") query.completed = completed === "yes";
    if (campaign.trim()) query.utm_campaign = campaign.trim();
    setLoading(true);
    const t = setTimeout(async () => {
      const rows = await base44.entities.DiagnosisLead.filter(query, "-created_date", 500);
      setLeads(rows || []);
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [allowed, from, to, sector, completed, campaign]);

  if (!allowed) return <AccessDenied />;

  const field = "h-11 bg-white/5 border-white/10 text-white";
  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Diagnosis Leads</h1>
          <p className="text-white/40 text-sm mt-1">Every /diagnosis submission, including partial ones</p>
        </div>
        <Button onClick={() => downloadCSV(leads)} disabled={!leads.length} className="gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={field} aria-label="From date" />
        <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={field} aria-label="To date" />
        <Select value={sector} onValueChange={setSector}>
          <SelectTrigger className={field}><SelectValue placeholder="Sector" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sectors</SelectItem>
            {SECTORS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={completed} onValueChange={setCompleted}>
          <SelectTrigger className={field}><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Completed & partial</SelectItem>
            <SelectItem value="yes">Completed only</SelectItem>
            <SelectItem value="no">Partial only</SelectItem>
          </SelectContent>
        </Select>
        <Input value={campaign} onChange={(e) => setCampaign(e.target.value)} placeholder="utm_campaign"
          className={`${field} placeholder:text-white/30`} />
      </div>

      <p className="text-xs text-white/40 mb-3">{loading ? "Loading…" : `${leads.length} result${leads.length === 1 ? "" : "s"}`}</p>
      {loading ? (
        <div className="text-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></div>
      ) : leads.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">No diagnosis submissions match</p>
        </div>
      ) : (
        <div className="space-y-3">{leads.map((l) => <DiagnosisLeadRow key={l.id} lead={l} />)}</div>
      )}
    </div>
  );
}