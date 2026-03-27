import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Search, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import SubmissionCard from "../components/admin/SubmissionCard";
import SubmissionDetail from "../components/admin/SubmissionDetail";

export default function AdminDashboard() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    setLoading(true);
    const data = await base44.entities.Assessment.list("-created_date", 100);
    setAssessments(data);
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    await base44.entities.Assessment.update(id, { status });
    setAssessments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const filtered = assessments.filter((a) => {
    const matchSearch = !search || a.company_name?.toLowerCase().includes(search.toLowerCase()) || a.contact_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusCounts = {
    all: assessments.length,
    New: assessments.filter((a) => a.status === "New").length,
    "In Progress": assessments.filter((a) => a.status === "In Progress").length,
    Contacted: assessments.filter((a) => a.status === "Contacted").length,
  };

  if (selected) {
    return (
      <div className="min-h-screen bg-secondary pt-24 pb-12">
        <div className="max-w-5xl mx-auto px-6">
          <Button variant="ghost" onClick={() => setSelected(null)} className="text-white/60 mb-6 hover:text-white">
            ← Back to Dashboard
          </Button>
          <SubmissionDetail submission={selected} onUpdateStatus={updateStatus} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Admin Dashboard</h1>
            <p className="text-white/40 text-sm mt-1">Manage assessment submissions</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(statusCounts).map(([key, count]) => (
            <button
              key={key}
              onClick={() => setFilterStatus(key)}
              className={`p-5 rounded-xl border transition-all text-left ${
                filterStatus === key ? "bg-white/10 border-primary" : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <p className="text-2xl font-bold text-white">{count}</p>
              <p className="text-xs text-white/40 uppercase tracking-widest">{key === "all" ? "Total" : key}</p>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by company or contact name..."
              className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/40">No submissions found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((a) => (
              <SubmissionCard key={a.id} submission={a} onClick={() => setSelected(a)} onUpdateStatus={updateStatus} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}