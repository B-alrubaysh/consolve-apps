import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Admin";
import { Loader2, Plus, Layers, Download, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { INDUSTRIES_FALLBACK } from "../../../lib/clientsData";

const EMPTY = {
  name_en: "",
  name_ar: "",
  display_order: 0,
  is_active: true,
};

function IndustryRow({ industry, onEdit, onToggleActive, onDelete }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-t border-white/5">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{industry.name_en || "—"}</p>
        {industry.name_ar && (
          <p className="text-xs text-white/50 truncate" dir="rtl">{industry.name_ar}</p>
        )}
      </div>

      <div className="hidden sm:block w-16 text-xs text-white/50 text-right">
        {industry.display_order ?? 0}
      </div>

      <div className="hidden md:block">
        <span
          className={`px-2 py-1 rounded-full text-xs border ${
            industry.is_active
              ? "bg-green-500/10 text-green-400 border-green-500/30"
              : "bg-white/5 text-white/40 border-white/10"
          }`}
        >
          {industry.is_active ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          className={industry.is_active ? "text-yellow-400 hover:text-yellow-300" : "text-green-400 hover:text-green-300"}
          onClick={() => onToggleActive(industry)}
          title={industry.is_active ? "Deactivate" : "Activate"}
        >
          {industry.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
        <Button size="sm" variant="ghost" className="text-white/60 hover:text-white" onClick={() => onEdit(industry)}>
          <Pencil className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300" onClick={() => onDelete(industry)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function IndustryFormDialog({ open, onOpenChange, initial, defaultDisplayOrder, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setForm({ ...EMPTY, ...initial });
    } else {
      setForm({ ...EMPTY, display_order: defaultDisplayOrder ?? 0 });
    }
    setError("");
  }, [open, initial, defaultDisplayOrder]);

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    if (!form.name_en?.trim()) {
      setError("Name (English) is required.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        name_en: form.name_en.trim(),
        name_ar: form.name_ar?.trim() || "",
        display_order: Number(form.display_order) || 0,
        is_active: !!form.is_active,
      };
      if (initial?.id) {
        await base44.entities.Industry.update(initial.id, payload);
      } else {
        await base44.entities.Industry.create(payload);
      }
      await onSaved?.();
      onOpenChange(false);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Save failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Industry" : "Add Industry"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Name (English) *</label>
              <Input value={form.name_en} onChange={(e) => setField("name_en", e.target.value)} placeholder="Technology" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Name (Arabic)</label>
              <Input value={form.name_ar} onChange={(e) => setField("name_ar", e.target.value)} placeholder="التكنولوجيا" dir="rtl" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Display Order</label>
            <Input
              type="number"
              value={form.display_order}
              onChange={(e) => setField("display_order", e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={() => setField("is_active", !form.is_active)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition-colors ${
              form.is_active
                ? "bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20"
                : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
            }`}
          >
            {form.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {form.is_active ? "Active" : "Inactive"}
          </button>

          {error && (
            <div className="px-3 py-2 rounded bg-destructive/10 border border-destructive/30 text-destructive text-sm">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={submitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving…</> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function IndustriesTab() {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [importing, setImporting] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Industry.list("display_order", 200);
    setIndustries(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onAdd = () => { setEditing(null); setFormOpen(true); };
  const onEdit = (ind) => { setEditing(ind); setFormOpen(true); };

  const onToggleActive = async (ind) => {
    const newVal = !ind.is_active;
    setIndustries((prev) => prev.map((i) => (i.id === ind.id ? { ...i, is_active: newVal } : i)));
    await base44.entities.Industry.update(ind.id, { is_active: newVal });
  };

  const onDelete = async (ind) => {
    if (!confirm(`Delete industry '${ind.name_en}'? This cannot be undone.`)) return;
    await base44.entities.Industry.delete(ind.id);
    setIndustries((prev) => prev.filter((i) => i.id !== ind.id));
  };

  const handleImport = async () => {
    if (!confirm(`Import the ${INDUSTRIES_FALLBACK.length} current industries into the database?`)) return;
    setImporting(true);
    try {
      for (const ind of INDUSTRIES_FALLBACK) {
        await base44.entities.Industry.create({
          name_en: ind.name_en,
          name_ar: ind.name_ar,
          display_order: ind.display_order,
          is_active: ind.is_active,
        });
      }
      await load();
    } finally {
      setImporting(false);
    }
  };

  const maxOrder = industries.reduce((m, i) => Math.max(m, i.display_order || 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-white/40">Industries shown on the public clients page</p>
        <Button onClick={onAdd} className="gap-2"><Plus className="w-4 h-4" /> Add Industry</Button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
          <p className="text-sm text-white/40 mt-3">Loading industries…</p>
        </div>
      ) : industries.length === 0 ? (
        <div className="py-16 px-8 text-center bg-white/5 border border-white/10 rounded-xl">
          <Layers className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white font-semibold mb-2">No industries yet</p>
          <p className="text-white/40 text-sm max-w-md mx-auto mb-6">
            The industries currently shown on the public site are hardcoded. You can import the {INDUSTRIES_FALLBACK.length} existing entries and then edit them here.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Button onClick={handleImport} disabled={importing} className="gap-2">
              {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {importing ? "Importing…" : "Import current industries"}
            </Button>
            <Button variant="outline" onClick={onAdd} className="gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10">
              <Plus className="w-4 h-4" /> Add Industry
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="flex items-center gap-4 px-4 py-3 text-xs uppercase tracking-widest text-white/40 bg-white/5">
            <span className="flex-1">Name</span>
            <span className="hidden sm:block w-16 text-right">Order</span>
            <span className="hidden md:block w-20">Status</span>
            <span className="w-28 text-right">Actions</span>
          </div>
          {industries.map((ind) => (
            <IndustryRow
              key={ind.id}
              industry={ind}
              onEdit={onEdit}
              onToggleActive={onToggleActive}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      <IndustryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
        defaultDisplayOrder={maxOrder + 10}
        onSaved={load}
      />
    </div>
  );
}