import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const EMPTY = { label_en: "", label_ar: "", url: "", is_external: false, is_active: true };

export default function FooterNavLinkDialog({ open, onOpenChange, initial, onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...EMPTY, ...initial } : EMPTY);
      setError("");
    }
  }, [open, initial]);

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.url.trim()) { setError("URL is required"); return; }
    onSave(form);
  };

  const ipt = "bg-white/5 border-white/10 text-white";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-secondary text-white border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">{initial?.id ? "Edit Footer Link" : "Add Footer Link"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Label (English)</label>
            <Input value={form.label_en} onChange={(e) => update("label_en", e.target.value)} className={ipt} />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Label (Arabic)</label>
            <Input dir="rtl" value={form.label_ar} onChange={(e) => update("label_ar", e.target.value)} className={ipt} />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1.5">URL *</label>
            <Input value={form.url} onChange={(e) => update("url", e.target.value)} placeholder="/about or https://…" className={ipt} />
          </div>
          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 text-xs text-white/70">
              <Switch checked={!!form.is_external} onCheckedChange={(v) => update("is_external", v)} />
              External link
            </label>
            <label className="flex items-center gap-2 text-xs text-white/70">
              <Switch checked={!!form.is_active} onCheckedChange={(v) => update("is_active", v)} />
              Active
            </label>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-white/5 border-white/10 text-white hover:bg-white/10">Cancel</Button>
          <Button onClick={handleSave}>{initial?.id ? "Save" : "Add"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}