import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { base44 } from "@/api/base44Admin";
import { Loader2, Inbox, Search, Eye, Mail, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const STATUS_OPTIONS = ["New", "Read", "Replied"];

const STATUS_STYLES = {
  New: "bg-blue-500/15 text-blue-400",
  Read: "bg-white/10 text-white/70",
  Replied: "bg-green-500/15 text-green-400",
};

function fmtDate(d) {
  if (!d) return "—";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "—";
  return format(dt, "MMM d, yyyy");
}

function fmtDateTime(d) {
  if (!d) return "—";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "—";
  return format(dt, "PPpp");
}

function MetaRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <span className="text-white/40">{label}</span>
      <span className="text-white text-right break-all">{value || "—"}</span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mt-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-2">{title}</p>
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">{children}</div>
    </div>
  );
}

function LeadRow({ lead, onView, onUpdate, onDelete }) {
  const status = lead.status || "New";

  const handleStatus = async (newStatus) => {
    await base44.entities.LandingPageLead.update(lead.id, { status: newStatus });
    onUpdate?.({ ...lead, status: newStatus });
  };

  return (
    <div
      onClick={() => onView(lead)}
      className="grid grid-cols-12 items-center gap-4 px-4 py-3 border-t border-white/5 hover:bg-white/5 transition-colors text-sm cursor-pointer"
    >
      <div className="col-span-3 min-w-0">
        <p className="text-white font-medium truncate">{lead.name || "—"}</p>
        <p className="text-white/50 text-xs truncate">{lead.email || "—"}</p>
      </div>
      <div className="col-span-2 text-white/60 text-xs hidden md:block truncate">{lead.page_name || "—"}</div>
      <div className="col-span-2 text-white/60 text-xs hidden lg:block truncate">{lead.phone || "—"}</div>
      <div className="col-span-2 text-white/40 text-xs hidden md:block">{fmtDate(lead.created_date)}</div>
      <div className="col-span-4 md:col-span-2" onClick={(e) => e.stopPropagation()}>
        <Select value={status} onValueChange={handleStatus}>
          <SelectTrigger className={`h-8 text-xs border-white/10 ${STATUS_STYLES[status] || STATUS_STYLES.New}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-5 md:col-span-1 flex items-center justify-end gap-1">
        <button
          onClick={(e) => { e.stopPropagation(); onView(lead); }}
          className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 text-xs"
        >
          <Eye className="w-3.5 h-3.5" /> View
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(lead); }}
          className="inline-flex items-center p-1.5 rounded-lg text-white/50 hover:text-red-400 hover:bg-white/10"
          title="Delete lead"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function LeadDetail({ lead, onClose, onUpdate }) {
  // Auto-promote New → Read on first open
  const autoMarkedId = useRef(null);
  useEffect(() => {
    if (!lead) return;
    if (lead.status && lead.status !== "New") return;
    if (autoMarkedId.current === lead.id) return;
    autoMarkedId.current = lead.id;
    base44.entities.LandingPageLead.update(lead.id, { status: "Read" })
      .then(() => onUpdate?.({ ...lead, status: "Read" }))
      .catch(() => { autoMarkedId.current = null; });
  }, [lead, onUpdate]);

  const parsedRaw = useMemo(() => {
    if (!lead || !lead.raw_data) return { ok: true, entries: [] };
    try {
      const obj = JSON.parse(lead.raw_data);
      if (obj && typeof obj === "object" && !Array.isArray(obj)) {
        return { ok: true, entries: Object.entries(obj) };
      }
      return { ok: false, raw: String(lead.raw_data) };
    } catch {
      return { ok: false, raw: String(lead.raw_data) };
    }
  }, [lead]);

  if (!lead) return null;

  const handleStatusChange = async (newStatus) => {
    await base44.entities.LandingPageLead.update(lead.id, { status: newStatus });
    onUpdate?.({ ...lead, status: newStatus });
  };

  const mailto = lead.email
    ? `mailto:${lead.email}?subject=${encodeURIComponent("Re: your submission")}`
    : null;

  return (
    <Sheet open={!!lead} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="bg-secondary text-white border-white/10 sm:max-w-xl w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white text-2xl">{lead.name || "Landing page lead"}</SheetTitle>
          <div className="text-sm text-white/60 flex flex-wrap gap-x-3 gap-y-1 mt-1">
            {lead.email && <span>{lead.email}</span>}
            {lead.phone && <span>· {lead.phone}</span>}
            {lead.company && <span>· {lead.company}</span>}
          </div>
        </SheetHeader>

        <Section title="Lead">
          <MetaRow label="Name" value={lead.name} />
          <MetaRow label="Email" value={lead.email} />
          <MetaRow label="Phone" value={lead.phone} />
          <MetaRow label="Company" value={lead.company} />
          <MetaRow label="Landing page" value={lead.page_name} />
          <MetaRow label="Slug" value={lead.page_slug ? `/p/${lead.page_slug}` : "—"} />
          <MetaRow label="Submitted" value={fmtDateTime(lead.created_date)} />
          <div className="flex justify-between items-center gap-4 pt-2 mt-2 border-t border-white/10">
            <span className="text-white/40 text-sm">Status</span>
            <Select value={lead.status || "New"} onValueChange={handleStatusChange}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white w-44 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {mailto && (
            <div className="pt-3 mt-1">
              <a
                href={mailto}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <Mail className="w-4 h-4" /> Reply by email
              </a>
            </div>
          )}
        </Section>

        <Section title="Message">
          {lead.message ? (
            <p className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed">{lead.message}</p>
          ) : (
            <p className="text-white/40 text-sm">No message</p>
          )}
        </Section>

        <Section title="All submitted fields">
          {parsedRaw.ok ? (
            parsedRaw.entries.length === 0 ? (
              <p className="text-white/40 text-sm">No additional fields</p>
            ) : (
              <div className="divide-y divide-white/5">
                {parsedRaw.entries.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 py-1.5 text-sm">
                    <span className="text-white/40 break-all">{k}</span>
                    <span className="text-white text-right break-all whitespace-pre-wrap">
                      {typeof v === "string" ? (v || "—") : JSON.stringify(v)}
                    </span>
                  </div>
                ))}
              </div>
            )
          ) : (
            <pre className="text-xs text-white/70 whitespace-pre-wrap break-all">{parsedRaw.raw}</pre>
          )}
        </Section>
      </SheetContent>
    </Sheet>
  );
}

export default function LandingLeadsTab() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pageFilter, setPageFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    const list = await base44.entities.LandingPageLead.list("-created_date", 500);
    setLeads(list || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const distinctPages = useMemo(() => {
    const set = new Set();
    for (const l of leads) {
      const name = (l.page_name || "").trim();
      if (name) set.add(name);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [leads]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((a) => {
      if (q) {
        const hay = `${a.name || ""} ${a.email || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (statusFilter !== "all" && (a.status || "New") !== statusFilter) return false;
      if (pageFilter !== "all" && (a.page_name || "") !== pageFilter) return false;
      return true;
    });
  }, [leads, search, statusFilter, pageFilter]);

  const handleUpdate = (updated) => {
    setLeads((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    if (selected?.id === updated.id) setSelected(updated);
  };

  const handleDelete = async (lead) => {
    if (!confirm(`Delete lead from '${lead.name || lead.email || "this submission"}'? This cannot be undone.`)) return;
    await base44.entities.LandingPageLead.delete(lead.id);
    setLeads((prev) => prev.filter((a) => a.id !== lead.id));
    if (selected?.id === lead.id) setSelected(null);
  };

  return (
    <div>
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
        <Select value={pageFilter} onValueChange={setPageFilter}>
          <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white"><SelectValue placeholder="Landing page" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All pages</SelectItem>
            {distinctPages.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Body */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
          <p className="text-sm text-white/40 mt-3">Loading leads…</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="py-20 text-center bg-white/5 border border-white/10 rounded-xl">
          <Inbox className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40 max-w-md mx-auto px-6">
            No leads yet — they'll appear here when someone submits a form on a published landing page.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-white/5 border border-white/10 rounded-xl">
          <Inbox className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">No leads match your filters</p>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 items-center gap-4 px-4 py-3 text-xs uppercase tracking-widest text-white/40 bg-white/5">
            <span className="col-span-3">Name</span>
            <span className="col-span-2 hidden md:block">Landing page</span>
            <span className="col-span-2 hidden lg:block">Phone</span>
            <span className="col-span-2 hidden md:block">Submitted</span>
            <span className="col-span-4 md:col-span-2">Status</span>
            <span className="col-span-5 md:col-span-1 text-right">Actions</span>
          </div>
          {filtered.map((a) => (
            <LeadRow
              key={a.id}
              lead={a}
              onView={setSelected}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <LeadDetail
        lead={selected}
        onClose={() => setSelected(null)}
        onUpdate={handleUpdate}
      />
    </div>
  );
}