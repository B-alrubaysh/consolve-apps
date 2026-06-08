import { useEffect, useRef, useState } from "react";
import { base44 } from "@/api/base44Admin";
import { Loader2, Save, Linkedin, Twitter, Instagram, Shield, FileText, Upload, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import FooterNavLinksSection from "./FooterNavLinksSection";

const FIELDS = [
  "logo_url",
  "footer_tagline_en", "footer_tagline_ar",
  "footer_nav_header_en", "footer_nav_header_ar",
  "footer_contact_header_en", "footer_contact_header_ar",
  "footer_copyright_en", "footer_copyright_ar",
  "footer_privacy_label_en", "footer_privacy_label_ar",
  "footer_terms_label_en", "footer_terms_label_ar",
  "linkedin_url", "twitter_url", "instagram_url",
  "privacy_url", "terms_url",
];
const EMPTY = FIELDS.reduce((acc, k) => ({ ...acc, [k]: "" }), {});

const ALLOWED_TYPES = ["image/svg+xml", "image/png", "image/webp", "image/jpeg", "image/jpg"];
const MAX_BYTES = 1024 * 1024;

const ipt = "bg-white/5 border-white/10 text-white";

function Section({ title, hint, children }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/50">{title}</p>
        {hint && <p className="text-xs text-white/40 mt-1">{hint}</p>}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function LogoField({ value, onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file) => {
    setError("");
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Use SVG, PNG, WEBP, or JPG.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Max size is 1 MB.");
      return;
    }
    setUploading(true);
    const res = await base44.integrations.Core.UploadFile({ file }).catch(() => null);
    setUploading(false);
    if (res?.file_url) onChange(res.file_url);
    else setError("Upload failed.");
  };

  const checkered = {
    backgroundImage:
      "linear-gradient(45deg, rgba(255,255,255,0.06) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.06) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.06) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.06) 75%)",
    backgroundSize: "16px 16px",
    backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
  };

  return (
    <div className="flex items-start gap-4 flex-wrap">
      <div className="w-40 h-24 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden" style={checkered}>
        {value ? (
          <img src={value} alt="Logo" className="max-w-full max-h-full object-contain" />
        ) : (
          <span className="text-xs text-white/40">No logo</span>
        )}
      </div>
      <div className="space-y-2">
        <input
          ref={inputRef}
          type="file"
          accept=".svg,.png,.webp,.jpg,.jpeg"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <div className="flex items-center gap-2">
          <Button onClick={() => inputRef.current?.click()} disabled={uploading} variant="outline"
            className="bg-white/5 border-white/10 text-white hover:bg-white/10 gap-2">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {value ? "Replace" : "Upload"}
          </Button>
          {value && (
            <Button onClick={() => onChange("")} variant="outline"
              className="bg-white/5 border-white/10 text-white hover:bg-destructive/20 hover:text-destructive gap-2">
              <Trash2 className="w-4 h-4" /> Remove
            </Button>
          )}
        </div>
        <p className="text-xs text-white/40">SVG, PNG, WEBP, JPG. Max 1 MB.</p>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </div>
  );
}

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

  const handleSaveAll = async () => {
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
    <div className="space-y-6 max-w-4xl">
      {!recordId && (
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-xs text-primary">
          No site settings record exists yet. Save to create one.
        </div>
      )}

      <Section title="Branding" hint="Logo shown in the public footer.">
        <LogoField value={form.logo_url} onChange={(v) => update("logo_url", v)} />
      </Section>

      <Section title="Tagline" hint="Short paragraph below the footer logo.">
        <div>
          <label className="block text-xs text-white/60 mb-1.5">Tagline (English)</label>
          <Textarea rows={3} value={form.footer_tagline_en} onChange={(e) => update("footer_tagline_en", e.target.value)} className={ipt} />
        </div>
        <div>
          <label className="block text-xs text-white/60 mb-1.5">Tagline (Arabic)</label>
          <Textarea dir="rtl" rows={3} value={form.footer_tagline_ar} onChange={(e) => update("footer_tagline_ar", e.target.value)} className={ipt} />
        </div>
      </Section>

      <FooterNavLinksSection />

      <Section title="Social Links" hint="Leave blank to hide. Icons appear next to contact info.">
        {[
          { key: "linkedin_url", label: "LinkedIn URL", Icon: Linkedin },
          { key: "twitter_url", label: "Twitter URL", Icon: Twitter },
          { key: "instagram_url", label: "Instagram URL", Icon: Instagram },
        ].map(({ key, label, Icon }) => (
          <div key={key}>
            <label className="block text-xs text-white/60 mb-1.5">{label}</label>
            <div className="relative">
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input value={form[key]} onChange={(e) => update(key, e.target.value)} placeholder="https://…" className={`pl-9 ${ipt}`} />
            </div>
          </div>
        ))}
      </Section>

      <Section title="Labels & Headers" hint="Override section headers and copyright. Use {{year}} for the current year.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Nav Header (EN)</label>
            <Input value={form.footer_nav_header_en} onChange={(e) => update("footer_nav_header_en", e.target.value)} className={ipt} />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Nav Header (AR)</label>
            <Input dir="rtl" value={form.footer_nav_header_ar} onChange={(e) => update("footer_nav_header_ar", e.target.value)} className={ipt} />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Contact Header (EN)</label>
            <Input value={form.footer_contact_header_en} onChange={(e) => update("footer_contact_header_en", e.target.value)} className={ipt} />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Contact Header (AR)</label>
            <Input dir="rtl" value={form.footer_contact_header_ar} onChange={(e) => update("footer_contact_header_ar", e.target.value)} className={ipt} />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Copyright (EN)</label>
            <Input value={form.footer_copyright_en} onChange={(e) => update("footer_copyright_en", e.target.value)} placeholder="© {{year}} Consolve. All rights reserved." className={ipt} />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Copyright (AR)</label>
            <Input dir="rtl" value={form.footer_copyright_ar} onChange={(e) => update("footer_copyright_ar", e.target.value)} className={ipt} />
          </div>
        </div>
      </Section>

      <Section title="Legal" hint="URLs and label overrides for the privacy and terms links.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Privacy URL</label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input value={form.privacy_url} onChange={(e) => update("privacy_url", e.target.value)} className={`pl-9 ${ipt}`} />
            </div>
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Terms URL</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input value={form.terms_url} onChange={(e) => update("terms_url", e.target.value)} className={`pl-9 ${ipt}`} />
            </div>
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Privacy Label (EN)</label>
            <Input value={form.footer_privacy_label_en} onChange={(e) => update("footer_privacy_label_en", e.target.value)} className={ipt} />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Privacy Label (AR)</label>
            <Input dir="rtl" value={form.footer_privacy_label_ar} onChange={(e) => update("footer_privacy_label_ar", e.target.value)} className={ipt} />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Terms Label (EN)</label>
            <Input value={form.footer_terms_label_en} onChange={(e) => update("footer_terms_label_en", e.target.value)} className={ipt} />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Terms Label (AR)</label>
            <Input dir="rtl" value={form.footer_terms_label_ar} onChange={(e) => update("footer_terms_label_ar", e.target.value)} className={ipt} />
          </div>
        </div>
      </Section>

      <div className="flex items-center gap-4 sticky bottom-0 bg-secondary/95 backdrop-blur py-3 -mx-1 px-1 border-t border-white/10">
        <Button onClick={handleSaveAll} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save All
        </Button>
        {savedAt && <span className="text-xs text-green-400">Saved at {savedAt.toLocaleTimeString()}</span>}
      </div>
    </div>
  );
}