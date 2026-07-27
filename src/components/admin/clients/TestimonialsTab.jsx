import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Admin";
import { Loader2, Plus, Layers, Download, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { TESTIMONIALS_FALLBACK } from "../../../lib/clientsData";

const EMPTY = {
  quote_en: "",
  quote_ar: "",
  author_en: "",
  author_ar: "",
  company_en: "",
  company_ar: "",
  display_order: 0,
  is_active: true,
};

function TestimonialRow({ testimonial, onEdit, onToggleActive, onDelete }) {
  const t = testimonial;
  const meta = [t.author_en, t.company_en].filter(Boolean).join(" — ");
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-t border-white/5">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{t.quote_en || "—"}</p>
        {meta && <p className="text-xs text-white/50 truncate">{meta}</p>}
        {t.quote_ar && (
          <p className="text-xs text-white/50 truncate" dir="rtl">{t.quote_ar}</p>
        )}
      </div>

      <div className="hidden sm:block w-16 text-xs text-white/50 text-right">
        {t.display_order ?? 0}
      </div>

      <div className="hidden md:block">
        <span
          className={`px-2 py-1 rounded-full text-xs border ${
            t.is_active
              ? "bg-green-500/10 text-green-400 border-green-500/30"
              : "bg-white/5 text-white/40 border-white/10"
          }`}
        >
          {t.is_active ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          className={t.is_active ? "text-yellow-400 hover:text-yellow-300" : "text-green-400 hover:text-green-300"}
          onClick={() => onToggleActive(t)}
          title={t.is_active ? "Deactivate" : "Activate"}
        >
          {t.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
        <Button size="sm" variant="ghost" className="text-white/60 hover:text-white" onClick={() => onEdit(t)}>
          <Pencil className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300" onClick={() => onDelete(t)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function TestimonialFormDialog({ open, onOpenChange, initial, defaultDisplayOrder, onSaved }) {
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
    if (!form.quote_en?.trim()) {
      setError("Quote (English) is required.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        quote_en: form.quote_en.trim(),
        quote_ar: form.quote_ar?.trim() || "",
        author_en: form.author_en?.trim() || "",
        author_ar: form.author_ar?.trim() || "",
        company_en: form.company_en?.trim() || "",
        company_ar: form.company_ar?.trim() || "",
        display_order: Number(form.display_order) || 0,
        is_active: !!form.is_active,
      };
      if (initial?.id) {
        await base44.entities.Testimonial.update(initial.id, payload);
      } else {
        await base44.entities.Testimonial.create(payload);
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
          <DialogTitle>{initial ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Quote (English) *</label>
              <Textarea value={form.quote_en} onChange={(e) => setField("quote_en", e.target.value)} className="min-h-[100px]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Quote (Arabic)</label>
              <Textarea value={form.quote_ar} onChange={(e) => setField("quote_ar", e.target.value)} dir="rtl" className="min-h-[100px]" />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Author (English)</label>
              <Input value={form.author_en} onChange={(e) => setField("author_en", e.target.value)} placeholder="Chief Operations Officer" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Author (Arabic)</label>
              <Input value={form.author_ar} onChange={(e) => setField("author_ar", e.target.value)} dir="rtl" />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Company (English)</label>
              <Input value={form.company_en} onChange={(e) => setField("company_en", e.target.value)} placeholder="Leading Manufacturing Firm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Company (Arabic)</label>
              <Input value={form.company_ar} onChange={(e) => setField("company_ar", e.target.value)} dir="rtl" />
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

export default function TestimonialsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [importing, setImporting] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Testimonial.list("display_order", 200);
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onAdd = () => { setEditing(null); setFormOpen(true); };
  const onEdit = (t) => { setEditing(t); setFormOpen(true); };

  const onToggleActive = async (t) => {
    const newVal = !t.is_active;
    setItems((prev) => prev.map((x) => (x.id === t.id ? { ...x, is_active: newVal } : x)));
    await base44.entities.Testimonial.update(t.id, { is_active: newVal });
  };

  const onDelete = async (t) => {
    if (!confirm(`Delete testimonial from '${t.author_en || t.quote_en?.slice(0, 40)}'? This cannot be undone.`)) return;
    await base44.entities.Testimonial.delete(t.id);
    setItems((prev) => prev.filter((x) => x.id !== t.id));
  };

  const handleImport = async () => {
    if (!confirm(`Import the ${TESTIMONIALS_FALLBACK.length} current testimonials into the database?`)) return;
    setImporting(true);
    try {
      for (const t of TESTIMONIALS_FALLBACK) {
        await base44.entities.Testimonial.create({
          quote_en: t.quote_en,
          quote_ar: t.quote_ar,
          author_en: t.author_en,
          author_ar: t.author_ar,
          company_en: t.company_en,
          company_ar: t.company_ar,
          display_order: t.display_order,
          is_active: t.is_active,
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
        <p className="text-sm text-white/40">Testimonials shown on the public clients page</p>
        <Button onClick={onAdd} className="gap-2"><Plus className="w-4 h-4" /> Add Testimonial</Button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
          <p className="text-sm text-white/40 mt-3">Loading testimonials…</p>
        </div>
      ) : items.length === 0 ? (
        <div className="py-16 px-8 text-center bg-white/5 border border-white/10 rounded-xl">
          <Layers className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white font-semibold mb-2">No testimonials yet</p>
          <p className="text-white/40 text-sm max-w-md mx-auto mb-6">
            The testimonials currently shown on the public site are hardcoded. You can import the {TESTIMONIALS_FALLBACK.length} existing entries and then edit them here.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Button onClick={handleImport} disabled={importing} className="gap-2">
              {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {importing ? "Importing…" : "Import current testimonials"}
            </Button>
            <Button variant="outline" onClick={onAdd} className="gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10">
              <Plus className="w-4 h-4" /> Add Testimonial
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="flex items-center gap-4 px-4 py-3 text-xs uppercase tracking-widest text-white/40 bg-white/5">
            <span className="flex-1">Quote</span>
            <span className="hidden sm:block w-16 text-right">Order</span>
            <span className="hidden md:block w-20">Status</span>
            <span className="w-28 text-right">Actions</span>
          </div>
          {items.map((t) => (
            <TestimonialRow
              key={t.id}
              testimonial={t}
              onEdit={onEdit}
              onToggleActive={onToggleActive}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      <TestimonialFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
        defaultDisplayOrder={maxOrder + 10}
        onSaved={load}
      />
    </div>
  );
}