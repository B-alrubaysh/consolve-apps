import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Admin";
import { Loader2, Save, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BilingualField from "./BilingualField";

// Every bilingual base name (each expands to {name}_en and {name}_ar)
const BILINGUAL = [
  "about_label", "about_h1", "about_p1", "about_p2",
  "about_mission_label", "about_mission_h2", "about_mission_p",
  "about_values_label", "about_values_h2",
  "stat1_number", "stat1_label",
  "stat2_number", "stat2_label",
  "stat3_number", "stat3_label",
  "stat4_number", "stat4_label",
  "value1_title", "value1_desc",
  "value2_title", "value2_desc",
  "value3_title", "value3_desc",
  "value4_title", "value4_desc",
];
const SINGLE = ["about_image_url"];

const EMPTY = (() => {
  const acc = {};
  BILINGUAL.forEach((k) => { acc[`${k}_en`] = ""; acc[`${k}_ar`] = ""; });
  SINGLE.forEach((k) => { acc[k] = ""; });
  return acc;
})();

const IPT = "bg-white/5 border-white/10 text-white";

function Section({ title, children }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-white/50">{title}</p>
      {children}
    </div>
  );
}

export default function AboutPageTab() {
  const [recordId, setRecordId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const list = await base44.entities.PageContent.list("-created_date", 1).catch(() => []);
      if (cancelled) return;
      const rec = (list || [])[0];
      if (rec) {
        setRecordId(rec.id);
        const next = { ...EMPTY };
        Object.keys(EMPTY).forEach((k) => { next[k] = rec[k] || ""; });
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
      await base44.entities.PageContent.update(recordId, payload);
    } else {
      const created = await base44.entities.PageContent.create(payload);
      setRecordId(created.id);
    }
    setSaving(false);
    setSavedAt(new Date());
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const res = await base44.integrations.Core.UploadFile({ file }).catch(() => null);
    if (res?.file_url) update("about_image_url", res.file_url);
    setUploading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <p className="text-sm text-white/40">Loading About page content…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {!recordId && (
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-xs text-primary">
          No page content record exists yet. Save to create one. Empty fields fall back to the built-in translations.
        </div>
      )}

      <Section title="Hero">
        <BilingualField label="Eyebrow" name="about_label" form={form} onChange={update} />
        <BilingualField label="Headline" name="about_h1" form={form} onChange={update} />
        <BilingualField label="Paragraph 1" name="about_p1" form={form} onChange={update} multiline />
        <BilingualField label="Paragraph 2" name="about_p2" form={form} onChange={update} multiline />
      </Section>

      <Section title="Hero Image">
        <div>
          <label className="block text-xs text-white/60 mb-1.5">Image URL</label>
          <Input
            value={form.about_image_url}
            onChange={(e) => update("about_image_url", e.target.value)}
            placeholder="https://…"
            className={IPT}
          />
          <div className="mt-3 flex items-center gap-3">
            <label className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-white cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e.target.files?.[0])}
              />
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              {uploading ? "Uploading…" : "Or upload an image"}
            </label>
            {form.about_image_url && (
              <img
                src={form.about_image_url}
                alt=""
                className="h-12 w-20 object-cover rounded border border-white/10"
              />
            )}
          </div>
        </div>
      </Section>

      <Section title="Mission Section">
        <BilingualField label="Eyebrow" name="about_mission_label" form={form} onChange={update} />
        <BilingualField label="Heading" name="about_mission_h2" form={form} onChange={update} />
        <BilingualField label="Paragraph" name="about_mission_p" form={form} onChange={update} multiline />
      </Section>

      <Section title="Stats">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <BilingualField label={`Stat ${i} — Number`} name={`stat${i}_number`} form={form} onChange={update} />
            <BilingualField label={`Stat ${i} — Label`} name={`stat${i}_label`} form={form} onChange={update} />
          </div>
        ))}
      </Section>

      <Section title="Values Heading">
        <BilingualField label="Eyebrow" name="about_values_label" form={form} onChange={update} />
        <BilingualField label="Heading" name="about_values_h2" form={form} onChange={update} />
      </Section>

      <Section title="Values (4 cards)">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-3 pb-3 border-b border-white/5 last:border-0 last:pb-0">
            <p className="text-[11px] uppercase tracking-widest text-white/40">Value {i}</p>
            <BilingualField label="Title" name={`value${i}_title`} form={form} onChange={update} />
            <BilingualField label="Description" name={`value${i}_desc`} form={form} onChange={update} multiline />
          </div>
        ))}
      </Section>

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