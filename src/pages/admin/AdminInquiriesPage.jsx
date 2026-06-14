import { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Admin";
import { Loader2, Inbox, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminUser } from "../../components/admin/ProtectedAdminLayout";
import { requireRole, ROLES } from "../../lib/rbac";
import AccessDenied from "../../components/admin/AccessDenied";
import ContactInquiryRow from "../../components/admin/inquiries/ContactInquiryRow";
import ContactInquiryDetail from "../../components/admin/inquiries/ContactInquiryDetail";

const STATUS_OPTIONS = ["New", "Read", "Replied"];

export default function AdminInquiriesPage() {
  const me = useAdminUser();
  const allowed = requireRole(me, ROLES.OWNER, ROLES.ADMIN);

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    const list = await base44.entities.ContactInquiry.list("-created_date", 500);
    setInquiries(list || []);
    setLoading(false);
  };

  useEffect(() => {
    if (allowed) load();
  }, [allowed]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const startTs = startDate ? new Date(startDate).getTime() : null;
    const endTs = endDate ? new Date(endDate).getTime() + 24 * 60 * 60 * 1000 - 1 : null;

    return inquiries.filter((a) => {
      if (q) {
        const hay = `${a.name || ""} ${a.email || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (statusFilter !== "all" && (a.status || "New") !== statusFilter) return false;
      if (startTs || endTs) {
        const ts = a.created_date ? new Date(a.created_date).getTime() : 0;
        if (startTs && ts < startTs) return false;
        if (endTs && ts > endTs) return false;
      }
      return true;
    });
  }, [inquiries, search, statusFilter, startDate, endDate]);

  if (!allowed) return <AccessDenied />;

  const handleUpdate = (updated) => {
    setInquiries((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    if (selected?.id === updated.id) setSelected(updated);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Inquiries</h1>
        <p className="text-sm text-white/40 mt-1">Messages from the public contact form</p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30"
          />
        </div>
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
          <p className="text-sm text-white/40 mt-3">Loading inquiries…</p>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="py-20 text-center bg-white/5 border border-white/10 rounded-xl">
          <Inbox className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">No inquiries yet</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-white/5 border border-white/10 rounded-xl">
          <Inbox className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">No inquiries match your filters</p>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 items-center gap-4 px-4 py-3 text-xs uppercase tracking-widest text-white/40 bg-white/5">
            <span className="col-span-3">Name</span>
            <span className="col-span-2 hidden md:block">Phone</span>
            <span className="col-span-2 hidden lg:block">Company</span>
            <span className="col-span-1 hidden lg:block">Lang</span>
            <span className="col-span-2 hidden md:block">Submitted</span>
            <span className="col-span-3 md:col-span-2">Status</span>
            <span className="col-span-9 md:col-span-1 text-right">Actions</span>
          </div>
          {filtered.map((a) => (
            <ContactInquiryRow
              key={a.id}
              inquiry={a}
              onView={setSelected}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}

      <ContactInquiryDetail
        inquiry={selected}
        onClose={() => setSelected(null)}
        onUpdate={handleUpdate}
      />
    </div>
  );
}