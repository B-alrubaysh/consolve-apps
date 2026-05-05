import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Upload } from "lucide-react";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/svg+xml", "image/png", "image/jpeg", "image/webp"];
const ACCEPT = ".svg,.png,.jpg,.jpeg,.webp";

const EMPTY = {
  name_en: "",
  name_ar: "",
  logo_url: "",
  logo_alt_en: "",
  logo_alt_ar: "",
  website_url: "",
  display_order: 0,
  is_active: true,
  notes: "",
};

const checkerBg = {
  backgroundImage:
    "linear-gradient(45deg, rgba(255,255,255,0.06) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.06) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.06) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.06) 75%)",
  backgroundSize: "16px 16px",
  backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
};

export default function ClientFormDialog({ open, onOpenChange, initialClient, onSaved, defaultDisplayOrder }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (initialClient) {
      setForm({ ...EMPTY, ...initialClient });
    } else {
      setForm({ ...EMPTY, display_order: defaultDisplayOrder ?? 0 });
    }
    setError("");
  }, [open, initialClient, defaultDisplayOrder]);

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleFile = async (file) => {
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Unsupported file type. Use SVG, PNG, JPG, or WEBP.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("File too large. Max size is 2MB.");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setField("logo_url", file_url);
    } catch (err) {
      setError(err?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleSubmit = async () => {
    if (!form.name_en?.trim()) { setError("Name (English) is required."); return; }
    if (!form.logo_url) { setError("Logo is required."); return; }
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        display_order: Number(form.display_order) || 0,
      };
      if (initialClient?.id) {
        await base44.entities.Client.update(initialClient.id, payload);
      } else {
        if (!payload.display_order) {
          payload.display_order = defaultDisplayOrder ?? 0;
        }
        await base44.entities.Client.create(payload);
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialClient ? "Edit Client" : "Add Client"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Logo upload */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Logo *</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={`relative rounded-lg border-2 border-dashed p-4 transition-colors ${
                dragOver ? "border-primary bg-primary/5" : "border-border bg-muted/30"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-32 h-20 rounded border border-border flex items-center justify-center overflow-hidden bg-white/5"
                  style={form.logo_url ? checkerBg : undefined}
                >
                  {form.logo_url ? (
                    <img src={form.logo_url} alt="Preview" className="max-h-16 max-w-full object-contain" />
                  ) : (
                    <span className="text-xs text-muted-foreground">No logo</span>
                  )}
                </div>
                <div className="flex-1">
                  <label className="inline-flex items-center gap-2 text-xs font-medium px-3 py-2 rounded border border-border bg-background hover:bg-muted cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    {uploading ? "Uploading…" : "Click to upload"}
                    <input
                      type="file"
                      accept={ACCEPT}
                      className="hidden"
                      onChange={(e) => handleFile(e.target.files?.[0])}
                      disabled={uploading}
                    />
                  </label>
                  <p className="text-xs text-muted-foreground mt-2">
                    Or drag & drop. SVG, PNG, JPG, or WEBP. Max 2MB.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Name (English) *</label>
              <Input value={form.name_en} onChange={(e) => setField("name_en", e.target.value)} placeholder="Acme Inc." />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Name (Arabic)</label>
              <Input value={form.name_ar} onChange={(e) => setField("name_ar", e.target.value)} placeholder="شركة أكمي" dir="rtl" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Logo Alt (English)</label>
              <Input value={form.logo_alt_en} onChange={(e) => setField("logo_alt_en", e.target.value)} placeholder="Acme logo" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Logo Alt (Arabic)</label>
              <Input value={form.logo_alt_ar} onChange={(e) => setField("logo_alt_ar", e.target.value)} placeholder="شعار أكمي" dir="rtl" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Website URL</label>
              <Input
                type="url"
                value={form.website_url}
                onChange={(e) => setField("website_url", e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Display Order</label>
              <Input
                type="number"
                value={form.display_order}
                onChange={(e) => setField("display_order", e.target.value)}
              />
            </div>
            <div className="flex items-end gap-3">
              <div className="flex items-center gap-3 pb-2">
                <Switch checked={!!form.is_active} onCheckedChange={(v) => setField("is_active", v)} />
                <span className="text-sm">{form.is_active ? "Active" : "Inactive"}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Internal Notes</label>
            <Textarea
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              placeholder="Admin-only notes…"
              className="min-h-[80px]"
            />
          </div>

          {error && (
            <div className="px-3 py-2 rounded bg-destructive/10 border border-destructive/30 text-destructive text-sm">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={submitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting || uploading}>
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving…</> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}