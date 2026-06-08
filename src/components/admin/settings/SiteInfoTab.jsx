import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Admin";
import { Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const FIELDS = [
  "site_name",
  "contact_email",
  "contact_phone",
  "default_seo_title_en",
  "default_seo_title_ar",
  "default_seo_description_en",
  "default_seo_description_ar",
];

const EMPTY = FIELDS.reduce((acc, k) => ({ ...acc, [k]: "" }), {});

export default function SiteInfoTab() {
  const [recordId, setRecordId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const list = await base44.entities.SiteSettings.list("-created_date", 1).catch(() => []);
      if (cancelled) return;
      const rec = (list || [])[0];
      if (rec) {
        setRecordId(rec.id);
        const next = { ...EMPTY };
        FIELDS.forEach((k) => { next[k] = rec[k] || ""; });
        setForm(next);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    const payload = { ...form };
    if (recordId) {
      await base44.entities.SiteSettings.update(recordId, payload);
    } else {
      const created = await base44.entities.SiteSettings.create(payload);
      setRecordId(created.id);
    }
    setSaving(false);
    setSavedAt(new Date());
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <p className="text-sm text-white/40">Loading site info…</p>
      </div>
    );
  }

  const ipt = "bg-white/5 border-white/10 text-white";

  return (
    <div className="space-y-6 max-w-3xl">
      {!recordId && (
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-xs text-primary">
          No site settings record exists yet. Save to create one.
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Basics</p>
        <div>
          <label className="block text-xs text-white/60 mb-1.5">Site Name</label>
          <Input value={form.site_name} onChange={(e) => update("site_name", e.target.value)} className={ipt} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Contact Email</label>
            <Input value={form.contact_email} onChange={(e) => update("contact_email", e.target.value)} className={ipt} />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Contact Phone</label>
            <Input value={form.contact_phone} onChange={(e) => update("contact_phone", e.target.value)} className={ipt} />
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Default SEO</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-white/60 mb-1.5">SEO Title (English)</label>
            <Input value={form.default_seo_title_en} onChange={(e) => update("default_seo_title_en", e.target.value)} className={ipt} />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1.5">SEO Title (Arabic)</label>
            <Input dir="rtl" value={form.default_seo_title_ar} onChange={(e) => update("default_seo_title_ar", e.target.value)} className={ipt} />
          </div>
        </div>
        <div>
          <label className="block text-xs text-white/60 mb-1.5">SEO Description (English)</label>
          <Textarea rows={3} value={form.default_seo_description_en} onChange={(e) => update("default_seo_description_en", e.target.value)} className={ipt} />
        </div>
        <div>
          <label className="block text-xs text-white/60 mb-1.5">SEO Description (Arabic)</label>
          <Textarea dir="rtl" rows={3} value={form.default_seo_description_ar} onChange={(e) => update("default_seo_description_ar", e.target.value)} className={ipt} />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save
        </Button>
        {savedAt && <span className="text-xs text-green-400">Saved at {savedAt.toLocaleTimeString()}</span>}
      </div>
    </div>
  );
}