import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Admin";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import BilingualField from "./BilingualField";

const BILINGUAL = [
  "contact_label",
  "contact_h1",
  "contact_sub",
  "contact_office",
  "contact_aside_title",
  "contact_aside_text",
  "contact_aside_link_label",
];

const EMPTY = BILINGUAL.reduce((acc, k) => {
  acc[`${k}_en`] = "";
  acc[`${k}_ar`] = "";
  return acc;
}, {});

function Section({ title, children }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-white/50">{title}</p>
      {children}
    </div>
  );
}

export default function ContactPageTab() {
  const [recordId, setRecordId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <p className="text-sm text-white/40">Loading Contact page content…</p>
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

      <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60">
        The Contact page email and phone come from <span className="text-white/80">Site Info</span>
        {" "}(contact_email and contact_phone). Update them there.
      </div>

      <Section title="Hero">
        <BilingualField label="Eyebrow" name="contact_label" form={form} onChange={update} />
        <BilingualField label="Headline" name="contact_h1" form={form} onChange={update} />
        <BilingualField label="Subhead" name="contact_sub" form={form} onChange={update} multiline />
      </Section>

      <Section title="Office line">
        <BilingualField label="Office (location line)" name="contact_office" form={form} onChange={update} />
      </Section>

      <Section title="Aside card">
        <BilingualField label="Title" name="contact_aside_title" form={form} onChange={update} />
        <BilingualField label="Text" name="contact_aside_text" form={form} onChange={update} multiline />
        <BilingualField label="Link label" name="contact_aside_link_label" form={form} onChange={update} />
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