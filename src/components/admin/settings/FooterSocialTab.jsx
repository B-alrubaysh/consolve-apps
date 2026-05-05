import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Save, Linkedin, Twitter, Instagram, Shield, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FIELDS = ["linkedin_url", "twitter_url", "instagram_url", "privacy_url", "terms_url"];
const EMPTY = FIELDS.reduce((acc, k) => ({ ...acc, [k]: "" }), {});

const ROWS = [
  { key: "linkedin_url", label: "LinkedIn URL", icon: Linkedin },
  { key: "twitter_url", label: "Twitter URL", icon: Twitter },
  { key: "instagram_url", label: "Instagram URL", icon: Instagram },
  { key: "privacy_url", label: "Privacy Policy URL", icon: Shield },
  { key: "terms_url", label: "Terms URL", icon: FileText },
];

export default function FooterSocialTab() {
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
        <p className="text-sm text-white/40">Loading footer settings…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {!recordId && (
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-xs text-primary">
          No site settings record exists yet. Save to create one.
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Social & Legal Links</p>
        {ROWS.map(({ key, label, icon: Icon }) => (
          <div key={key}>
            <label className="block text-xs text-white/60 mb-1.5">{label}</label>
            <div className="relative">
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                value={form[key]}
                onChange={(e) => update(key, e.target.value)}
                placeholder="https://…"
                className="pl-9 bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
        ))}
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