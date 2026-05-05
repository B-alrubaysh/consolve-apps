import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

const EMPTY = {
  name_en: "",
  name_ar: "",
  description: "",
  category: "",
  suggested_title_pattern_en: "",
  suggested_title_pattern_ar: "",
  suggested_excerpt_pattern_en: "",
  suggested_excerpt_pattern_ar: "",
  content_structure_en: "",
  content_structure_ar: "",
  suggested_seo_title_pattern_en: "",
  suggested_seo_title_pattern_ar: "",
  suggested_seo_description_pattern_en: "",
  suggested_seo_description_pattern_ar: "",
  is_active: true,
};

const Section = ({ title, children }) => (
  <div className="border border-white/10 rounded-xl p-4 bg-white/5">
    <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-3">{title}</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
  </div>
);

const Field = ({ label, children, full }) => (
  <div className={full ? "md:col-span-2" : ""}>
    <label className="block text-xs text-white/60 mb-1.5">{label}</label>
    {children}
  </div>
);

export default function BlogTemplateFormDialog({ open, onOpenChange, initialTemplate, currentUserEmail, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      if (initialTemplate) {
        setForm({ ...EMPTY, ...initialTemplate });
      } else {
        setForm(EMPTY);
      }
      setError("");
    }
  }, [open, initialTemplate]);

  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const save = async () => {
    setError("");
    if (!form.name_en.trim()) {
      setError("English name is required");
      return;
    }
    setSaving(true);
    const payload = { ...form };
    if (initialTemplate?.id) {
      await base44.entities.BlogTemplate.update(initialTemplate.id, payload);
    } else {
      payload.created_by = currentUserEmail || "";
      await base44.entities.BlogTemplate.create(payload);
    }
    setSaving(false);
    onSaved?.();
    onOpenChange(false);
  };

  const ipt = "bg-white/5 border-white/10 text-white";
  const ta = "bg-white/5 border-white/10 text-white min-h-[100px]";
  const taLong = "bg-white/5 border-white/10 text-white min-h-[180px] font-mono text-xs";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-secondary text-white border-white/10 max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">{initialTemplate?.id ? "Edit Template" : "New Template"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Section title="Basic">
            <Field label="Name (English) *">
              <Input value={form.name_en} onChange={(e) => update("name_en", e.target.value)} className={ipt} />
            </Field>
            <Field label="Name (Arabic)">
              <Input dir="rtl" value={form.name_ar} onChange={(e) => update("name_ar", e.target.value)} className={ipt} />
            </Field>
            <Field label="Category">
              <Input value={form.category} onChange={(e) => update("category", e.target.value)} className={ipt} />
            </Field>
            <Field label="Active">
              <div className="flex items-center gap-3 h-9">
                <Switch checked={!!form.is_active} onCheckedChange={(v) => update("is_active", v)} />
                <span className="text-xs text-white/60">{form.is_active ? "Active" : "Inactive"}</span>
              </div>
            </Field>
            <Field label="Description" full>
              <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} className={ta} />
            </Field>
          </Section>

          <Section title="Patterns">
            <Field label="Title Pattern (EN)">
              <Input value={form.suggested_title_pattern_en} onChange={(e) => update("suggested_title_pattern_en", e.target.value)} className={ipt} />
            </Field>
            <Field label="Title Pattern (AR)">
              <Input dir="rtl" value={form.suggested_title_pattern_ar} onChange={(e) => update("suggested_title_pattern_ar", e.target.value)} className={ipt} />
            </Field>
            <Field label="Excerpt Pattern (EN)" full>
              <Textarea value={form.suggested_excerpt_pattern_en} onChange={(e) => update("suggested_excerpt_pattern_en", e.target.value)} className={ta} />
            </Field>
            <Field label="Excerpt Pattern (AR)" full>
              <Textarea dir="rtl" value={form.suggested_excerpt_pattern_ar} onChange={(e) => update("suggested_excerpt_pattern_ar", e.target.value)} className={ta} />
            </Field>
            <Field label="SEO Title Pattern (EN)">
              <Input value={form.suggested_seo_title_pattern_en} onChange={(e) => update("suggested_seo_title_pattern_en", e.target.value)} className={ipt} />
            </Field>
            <Field label="SEO Title Pattern (AR)">
              <Input dir="rtl" value={form.suggested_seo_title_pattern_ar} onChange={(e) => update("suggested_seo_title_pattern_ar", e.target.value)} className={ipt} />
            </Field>
            <Field label="SEO Description Pattern (EN)" full>
              <Textarea value={form.suggested_seo_description_pattern_en} onChange={(e) => update("suggested_seo_description_pattern_en", e.target.value)} className={ta} />
            </Field>
            <Field label="SEO Description Pattern (AR)" full>
              <Textarea dir="rtl" value={form.suggested_seo_description_pattern_ar} onChange={(e) => update("suggested_seo_description_pattern_ar", e.target.value)} className={ta} />
            </Field>
          </Section>

          <Section title="Content Structure (HTML)">
            <Field label="Content Structure (EN)" full>
              <Textarea value={form.content_structure_en} onChange={(e) => update("content_structure_en", e.target.value)} className={taLong} placeholder="<h2>Section</h2><p>Body…</p>" />
            </Field>
            <Field label="Content Structure (AR)" full>
              <Textarea dir="rtl" value={form.content_structure_ar} onChange={(e) => update("content_structure_ar", e.target.value)} className={taLong} placeholder="<h2>قسم</h2><p>محتوى…</p>" />
            </Field>
          </Section>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter className="gap-2 mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-white/5 border-white/10 text-white hover:bg-white/10">
            Cancel
          </Button>
          <Button disabled={saving} onClick={save}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (initialTemplate?.id ? "Save" : "Create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}