import { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Plus, Briefcase, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminUser } from "../../components/admin/ProtectedAdminLayout";
import { requireRole, ROLES } from "../../lib/rbac";
import AccessDenied from "../../components/admin/AccessDenied";
import JobPostFormDialog from "../../components/admin/careers/JobPostFormDialog";
import JobPostRow from "../../components/admin/careers/JobPostRow";

const STATUS_OPTIONS = ["draft", "open", "closed", "archived"];

export default function AdminCareersPage() {
  const me = useAdminUser();
  const allowed = requireRole(me, ROLES.OWNER, ROLES.ADMIN, ROLES.HR);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [workTypeFilter, setWorkTypeFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.JobPost.list("-created_date", 200);
    setJobs(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (allowed) load();
  }, [allowed]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const dq = departmentFilter.trim().toLowerCase();
    return jobs.filter((j) => {
      if (q) {
        const hay = `${j.title_en || ""} ${j.title_ar || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (statusFilter !== "all" && j.status !== statusFilter) return false;
      if (workTypeFilter !== "all" && j.work_type !== workTypeFilter) return false;
      if (dq) {
        const dh = `${j.department_en || ""} ${j.department_ar || ""}`.toLowerCase();
        if (!dh.includes(dq)) return false;
      }
      return true;
    });
  }, [jobs, search, statusFilter, workTypeFilter, departmentFilter]);

  if (!allowed) return <AccessDenied />;

  const onAdd = () => { setEditing(null); setFormOpen(true); };
  const onEdit = (job) => { setEditing(job); setFormOpen(true); };

  const onToggleStatus = async (job) => {
    const newStatus = job.status === "open" ? "closed" : "open";
    setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, status: newStatus } : j)));
    await base44.entities.JobPost.update(job.id, { status: newStatus });
  };

  const onDelete = async (job) => {
    if (!confirm(`Delete job post "${job.title_en}"? This cannot be undone.`)) return;
    await base44.entities.JobPost.delete(job.id);
    setJobs((prev) => prev.filter((j) => j.id !== job.id));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Careers</h1>
          <p className="text-sm text-white/40 mt-1">Manage job postings</p>
        </div>
        <Button onClick={onAdd} className="gap-2"><Plus className="w-4 h-4" /> Add Job Post</Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title…"
            className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30"
          />
        </div>
        <Input
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          placeholder="Filter by department…"
          className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={workTypeFilter} onValueChange={setWorkTypeFilter}>
          <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white"><SelectValue placeholder="Work type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Work Types</SelectItem>
            <SelectItem value="onsite">Onsite</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Body */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
          <p className="text-sm text-white/40 mt-3">Loading job posts…</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="py-20 text-center bg-white/5 border border-white/10 rounded-xl">
          <Briefcase className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40 mb-6">No job posts yet — add your first one</p>
          <Button onClick={onAdd} className="gap-2"><Plus className="w-4 h-4" /> Add Job Post</Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-white/5 border border-white/10 rounded-xl">
          <Briefcase className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">No job posts match your filters</p>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 items-center gap-4 px-4 py-3 text-xs uppercase tracking-widest text-white/40 bg-white/5">
            <span className="col-span-3">Title</span>
            <span className="col-span-2 hidden md:block">Department</span>
            <span className="col-span-2 hidden lg:block">Location</span>
            <span className="col-span-1 hidden lg:block">Work</span>
            <span className="col-span-1 hidden lg:block">Type</span>
            <span className="col-span-1">Status</span>
            <span className="col-span-1">Apps</span>
            <span className="col-span-1 hidden xl:block">Published</span>
            <span className="col-span-12 md:col-span-2 lg:col-span-1 text-right">Actions</span>
          </div>
          {filtered.map((job) => (
            <JobPostRow
              key={job.id}
              job={job}
              onEdit={onEdit}
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      <JobPostFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initialJob={editing}
        onSaved={load}
      />
    </div>
  );
}