import { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Admin";
import { Loader2, Inbox, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminUser } from "../../components/admin/ProtectedAdminLayout";
import { requireRole, ROLES } from "../../lib/rbac";
import AccessDenied from "../../components/admin/AccessDenied";
import JobApplicationRow from "../../components/admin/submissions/JobApplicationRow";
import JobApplicationDetail from "../../components/admin/submissions/JobApplicationDetail";

const STATUS_OPTIONS = ["new", "reviewed", "shortlisted", "rejected", "hired"];

export default function AdminSubmissionsPage() {
  const me = useAdminUser();
  const allowed = requireRole(me, ROLES.OWNER, ROLES.ADMIN, ROLES.HR);

  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    const [apps, posts] = await Promise.all([
      base44.entities.JobApplication.list("-created_date", 500),
      base44.entities.JobPost.list("-created_date", 200),
    ]);
    setApplications(apps || []);
    setJobs(posts || []);
    setLoading(false);
  };

  useEffect(() => {
    if (allowed) load();
  }, [allowed]);

  const jobMap = useMemo(() => {
    const m = new Map();
    jobs.forEach((j) => m.set(j.id, j));
    return m;
  }, [jobs]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const startTs = startDate ? new Date(startDate).getTime() : null;
    const endTs = endDate ? new Date(endDate).getTime() + 24 * 60 * 60 * 1000 - 1 : null;

    return applications.filter((a) => {
      if (q) {
        const hay = `${a.full_name || ""} ${a.email || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (typeFilter !== "all" && a.submission_type !== typeFilter) return false;
      if (jobFilter !== "all" && a.job_post_id !== jobFilter) return false;
      if (statusFilter !== "all" && (a.status || "new") !== statusFilter) return false;
      if (startTs || endTs) {
        const ts = a.created_date ? new Date(a.created_date).getTime() : 0;
        if (startTs && ts < startTs) return false;
        if (endTs && ts > endTs) return false;
      }
      return true;
    });
  }, [applications, search, typeFilter, jobFilter, statusFilter, startDate, endDate]);

  if (!allowed) return <AccessDenied />;

  const handleUpdate = (updated) => {
    setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    if (selected?.id === updated.id) setSelected(updated);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Submissions</h1>
        <p className="text-sm text-white/40 mt-1">Review job applications and general submissions</p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 mb-4">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="job_application">Job Application</SelectItem>
            <SelectItem value="general_submission">General Submission</SelectItem>
          </SelectContent>
        </Select>
        <Select value={jobFilter} onValueChange={setJobFilter}>
          <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white"><SelectValue placeholder="Job" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Jobs</SelectItem>
            {jobs.map((j) => <SelectItem key={j.id} value={j.id}>{j.title_en}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="grid grid-cols-2 gap-2">
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-11 bg-white/5 border-white/10 text-white" />
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-11 bg-white/5 border-white/10 text-white" />
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
          <p className="text-sm text-white/40 mt-3">Loading submissions…</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="py-20 text-center bg-white/5 border border-white/10 rounded-xl">
          <Inbox className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">No submissions yet</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-white/5 border border-white/10 rounded-xl">
          <Inbox className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">No submissions match your filters</p>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 items-center gap-4 px-4 py-3 text-xs uppercase tracking-widest text-white/40 bg-white/5">
            <span className="col-span-3">Applicant</span>
            <span className="col-span-2 hidden md:block">Phone</span>
            <span className="col-span-2 hidden lg:block">Job</span>
            <span className="col-span-1 hidden lg:block">Lang</span>
            <span className="col-span-2 hidden md:block">Submitted</span>
            <span className="col-span-3 md:col-span-2">Status</span>
            <span className="col-span-9 md:col-span-1 text-right">Actions</span>
          </div>
          {filtered.map((a) => (
            <JobApplicationRow
              key={a.id}
              application={a}
              jobMap={jobMap}
              onView={setSelected}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}

      <JobApplicationDetail
        application={selected}
        jobMap={jobMap}
        onClose={() => setSelected(null)}
        onUpdate={handleUpdate}
      />
    </div>
  );
}