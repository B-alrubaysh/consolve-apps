import { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { format } from "date-fns";
import { Plus, Search, Pencil, Copy, Eye, EyeOff, Trash2, FileText, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminUser } from "../../components/admin/ProtectedAdminLayout";
import { requireRole, ROLES } from "../../lib/rbac";
import AccessDenied from "../../components/admin/AccessDenied";
import BlogTemplateFormDialog from "../../components/admin/blog/BlogTemplateFormDialog";
import BlogTemplatePreviewDialog from "../../components/admin/blog/BlogTemplatePreviewDialog";
import { DEFAULT_TEMPLATES } from "../../lib/blogTemplateDefaults";

function fmt(d) {
  if (!d) return "—";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "—";
  return format(dt, "MMM d, yyyy");
}

export default function AdminBlogTemplatesPage() {
  const me = useAdminUser();
  const allowed = requireRole(me, ROLES.OWNER, ROLES.ADMIN, ROLES.WRITER);

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [seeding, setSeeding] = useState(false);

  const load = async () => {
    setLoading(true);
    const list = await base44.entities.BlogTemplate.list("-updated_date", 500).catch(() => []);
    setTemplates(list || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!allowed) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowed]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const cat = categoryFilter.trim().toLowerCase();
    return templates.filter((t) => {
      if (q) {
        const hay = `${t.name_en || ""} ${t.name_ar || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (statusFilter === "active" && !t.is_active) return false;
      if (statusFilter === "inactive" && t.is_active) return false;
      if (cat && !(t.category || "").toLowerCase().includes(cat)) return false;
      return true;
    });
  }, [templates, search, statusFilter, categoryFilter]);

  const seedDefaults = async () => {
    setSeeding(true);
    const email = me?.email || "";
    const rows = DEFAULT_TEMPLATES.map((d) => ({ ...d, is_active: true, created_by: email }));
    if (typeof base44.entities.BlogTemplate.bulkCreate === "function") {
      await base44.entities.BlogTemplate.bulkCreate(rows);
    } else {
      for (const r of rows) await base44.entities.BlogTemplate.create(r);
    }
    setSeeding(false);
    await load();
  };

  const handleDuplicate = async (t) => {
    const copy = { ...t };
    delete copy.id;
    delete copy.created_date;
    delete copy.updated_date;
    copy.name_en = `${t.name_en || ""} (copy)`;
    copy.created_by = me?.email || "";
    await base44.entities.BlogTemplate.create(copy);
    await load();
  };

  const handleToggleActive = async (t) => {
    await base44.entities.BlogTemplate.update(t.id, { ...t, is_active: !t.is_active });
    await load();
  };

  const handleDelete = async (t) => {
    if (!confirm(`Delete template "${t.name_en}"? This cannot be undone.`)) return;
    await base44.entities.BlogTemplate.delete(t.id);
    await load();
  };

  if (!allowed) return <AccessDenied />;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <p className="text-sm text-white/40">Loading templates…</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Templates</h1>
          <p className="text-sm text-white/50 mt-1">Reusable article structures</p>
        </div>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> New Template
        </Button>
      </div>

      {templates.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
          <FileText className="w-10 h-10 text-white/30 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-white mb-2">No templates yet</h2>
          <p className="text-sm text-white/50 mb-6 max-w-md mx-auto">
            Seed our 6 default templates to get started, or create one manually.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button onClick={seedDefaults} disabled={seeding} className="gap-2">
              {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Seed default templates
            </Button>
            <Button onClick={() => { setEditing(null); setFormOpen(true); }} variant="outline"
              className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              Or create one manually
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name…"
                className="pl-9 bg-white/5 border-white/10 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              placeholder="Category…"
              className="w-44 bg-white/5 border-white/10 text-white"
            />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-4 py-3 text-[11px] uppercase tracking-widest text-white/40">
              <div className="col-span-4">Name</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2">Created by</div>
              <div className="col-span-1">Updated</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {filtered.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-white/40 border-t border-white/5">
                No templates match your filters.
              </div>
            ) : (
              filtered.map((t) => (
                <div key={t.id} className="grid grid-cols-12 gap-4 items-center px-4 py-3 border-t border-white/5 hover:bg-white/5 transition-colors text-sm">
                  <div className="col-span-4 min-w-0">
                    <p className="text-white font-medium truncate">{t.name_en || "—"}</p>
                    {t.name_ar && <p className="text-white/50 text-xs truncate" dir="rtl">{t.name_ar}</p>}
                  </div>
                  <div className="col-span-2 text-white/60 text-xs truncate">{t.category || "—"}</div>
                  <div className="col-span-1">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-widest ${
                      t.is_active ? "bg-green-500/15 text-green-400" : "bg-white/5 text-white/40"
                    }`}>
                      {t.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="col-span-2 text-white/50 text-xs truncate">{t.created_by || "—"}</div>
                  <div className="col-span-1 text-white/40 text-xs truncate">{fmt(t.updated_date)}</div>
                  <div className="col-span-2 flex items-center justify-end gap-0.5">
                    <button onClick={() => { setEditing(t); setFormOpen(true); }} title="Edit"
                      className="p-1.5 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDuplicate(t)} title="Duplicate"
                      className="p-1.5 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button onClick={() => { setPreviewTemplate(t); setPreviewOpen(true); }} title="Preview"
                      className="p-1.5 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleToggleActive(t)} title={t.is_active ? "Deactivate" : "Activate"}
                      className="p-1.5 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors">
                      {t.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleDelete(t)} title="Delete"
                      className="p-1.5 rounded-lg text-white/60 hover:bg-destructive/20 hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      <BlogTemplateFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initialTemplate={editing}
        currentUserEmail={me?.email}
        onSaved={load}
      />
      <BlogTemplatePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        template={previewTemplate}
      />
    </div>
  );
}