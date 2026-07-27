import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Admin";
import { Loader2, Plus, Layers, Download, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { CASE_STUDIES_FALLBACK } from "../../../lib/clientsData";

const EMPTY = {
  industry_en: "",
  industry_ar: "",
  challenge_en: "",
  challenge_ar: "",
  solution_en: "",
  solution_ar: "",
  result_en: "",
  result_ar: "",
  display_order: 0,
  is_active: true,
};

function CaseStudyRow({ item, onEdit, onToggleActive, onDelete }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-t border-white/5">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{item.industry_en || "—"}</p>
        {item.industry_ar && (
          <p className="text-xs text-white/50 truncate" dir="rtl">{item.industry_ar}</p>
        )}
        {item.challenge_en && (
          <p className="text-xs text-white/50 truncate">{item.challenge_en}</p>
        )}
      </div>

      <div className="hidden sm:block w-16 text-xs text-white/50 text-right">
        {item.display_order ?? 0}
      </div>

      <div className="hidden md:block">
        <span
          className={`px-2 py-1 rounded-full text-xs border ${
            item.is_active
              ? "bg-green-500/10 text-green-400 border-green-500/30"
              : "bg-white/5 text-white/40 border-white/10"
          }`}
        >
          {item.is_active ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          className={item.is_active ? "text-yellow-400 hover:text-yellow-300" : "text-green-400 hover:text-green-300"}
          onClick={() => onToggleActive(item)}
          title={item.is_active ? "Deactivate" : "Activate"}
        >
          {item.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
        <Button size="sm" variant="ghost" className="text-white/60 hover:text-white" onClick={() => onEdit(item)}>
          <Pencil className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300" onClick={() => onDelete(item)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function CaseStudyFormDialog({ open, onOpenChange, initial, defaultDisplayOrder, onSaved }) {
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
    if (!form.industry_en?.trim()) {
      setError("Industry (English) is required.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        industry_en: form.industry_en.trim(),
        industry_ar: form.industry_ar?.trim() || "",
        challenge_en: form.challenge_en?.trim() || "",
        challenge_ar: form.challenge_ar?.trim() || "",
        solution_en: form.solution_en?.trim() || "",
        solution_ar: form.solution_ar?.trim() || "",
        result_en: form.result_en?.trim() || "",
        result_ar: form.result_ar?.trim() || "",
        display_order: Number(form.display_order) || 0,
        is_active: !!form.is_active,
      };
      if (initial?.id) {
        await base44.entities.CaseStudy.update(initial.id, payload);
      } else {
        await base44.entities.CaseStudy.create(payload);
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Case Study" : "Add Case Study"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Industry (English) *</label>
              <Input value={form.industry_en} onChange={(e) => setField("industry_en", e.target.value)} placeholder="Manufacturing" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Industry (Arabic)</label>
              <Input value={form.industry_ar} onChange={(e) => setField("industry_ar", e.target.value)} dir="rtl" />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Challenge (English)</label>
              <Textarea value={form.challenge_en} onChange={(e) => setField("challenge_en", e.target.value)} className="min-h-[80px]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Challenge (Arabic)</label>
              <Textarea value={form.challenge_ar} onChange={(e) => setField("challenge_ar", e.target.value)} dir="rtl" className="min-h-[80px]" />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Solution (English)</label>
              <Textarea value={form.solution_en} onChange={(e) => setField("solution_en", e.target.value)} className="min-h-[80px]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Solution (Arabic)</label>
              <Textarea value={form.solution_ar} onChange={(e) => setField("solution_ar", e.target.value)} dir="rtl" className="min-h-[80px]" />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Result (English)</label>
              <Textarea value={form.result_en} onChange={(e) => setField("result_en", e.target.value)} className="min-h-[80px]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Result (Arabic)</label>
              <Textarea value={form.result_ar} onChange={(e) => setField("result_ar", e.target.value)} dir="rtl" className="min-h-[80px]" />
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

export default function CaseStudiesTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [importing, setImporting] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.CaseStudy.list("display_order", 200);
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onAdd = () => { setEditing(null); setFormOpen(true); };
  const onEdit = (item) => { setEditing(item); setFormOpen(true); };

  const onToggleActive = async (item) => {
    const newVal = !item.is_active;
    setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, is_active: newVal } : x)));
    await base44.entities.CaseStudy.update(item.id, { is_active: newVal });
  };

  const onDelete = async (item) => {
    if (!confirm(`Delete case study '${item.industry_en}'? This cannot be undone.`)) return;
    await base44.entities.CaseStudy.delete(item.id);
    setItems((prev) => prev.filter((x) => x.id !== item.id));
  };

  const handleImport = async () => {
    if (!confirm(`Import the ${CASE_STUDIES_FALLBACK.length} current case studies into the database?`)) return;
    setImporting(true);
    try {
      for (const cs of CASE_STUDIES_FALLBACK) {
        await base44.entities.CaseStudy.create({
          industry_en: cs.industry_en,
          industry_ar: cs.industry_ar,
          challenge_en: cs.challenge_en,
          challenge_ar: cs.challenge_ar,
          solution_en: cs.solution_en,
          solution_ar: cs.solution_ar,
          result_en: cs.result_en,
          result_ar: cs.result_ar,
          display_order: cs.display_order,
          is_active: cs.is_active,
        });
      }
      await load();
    } finally {
      setImporting(false);
    }
  };

  const maxOrder = items.reduce((m, x) => Math.max(m, x.display_order || 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-white/40">Case studies shown on the public clients page</p>
        <Button onClick={onAdd} className="gap-2"><Plus className="w-4 h-4" /> Add Case Study</Button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
          <p className="text-sm text-white/40 mt-3">Loading case studies…</p>
        </div>
      ) : items.length === 0 ? (
        <div className="py-16 px-8 text-center bg-white/5 border border-white/10 rounded-xl">
          <Layers className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white font-semibold mb-2">No case studies yet</p>
          <p className="text-white/40 text-sm max-w-md mx-auto mb-6">
            The case studies currently shown on the public site are hardcoded. You can import the {CASE_STUDIES_FALLBACK.length} existing entries and then edit them here.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Button onClick={handleImport} disabled={importing} className="gap-2">
              {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {importing ? "Importing…" : "Import current case studies"}
            </Button>
            <Button variant="outline" onClick={onAdd} className="gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10">
              <Plus className="w-4 h-4" /> Add Case Study
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="flex items-center gap-4 px-4 py-3 text-xs uppercase tracking-widest text-white/40 bg-white/5">
            <span className="flex-1">Industry</span>
            <span className="hidden sm:block w-16 text-right">Order</span>
            <span className="hidden md:block w-20">Status</span>
            <span className="w-28 text-right">Actions</span>
          </div>
          {items.map((cs) => (
            <CaseStudyRow
              key={cs.id}
              item={cs}
              onEdit={onEdit}
              onToggleActive={onToggleActive}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      <CaseStudyFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
        defaultDisplayOrder={maxOrder + 10}
        onSaved={load}
      />
    </div>
  );
}