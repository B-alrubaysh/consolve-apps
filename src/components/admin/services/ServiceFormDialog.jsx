import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

const ICON_OPTIONS = ["Target", "Users", "Scale", "Settings", "Megaphone", "DollarSign", "Gavel", "Rocket", "Lightbulb"];

const EMPTY = {
  service_id: "",
  name_en: "",
  name_ar: "",
  tagline_en: "",
  tagline_ar: "",
  goal_en: "",
  goal_ar: "",
  description_en: "",
  description_ar: "",
  sub_services_en: [],
  sub_services_ar: [],
  icon: "Target",
  display_order: 0,
  is_active: true,
};

function toLines(arr) {
  return Array.isArray(arr) ? arr.join("\n") : "";
}

function fromLines(text) {
  return String(text || "")
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export default function ServiceFormDialog({ open, onOpenChange, initialService, defaultDisplayOrder, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [subEnText, setSubEnText] = useState("");
  const [subArText, setSubArText] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (initialService) {
      setForm({ ...EMPTY, ...initialService });
      setSubEnText(toLines(initialService.sub_services_en));
      setSubArText(toLines(initialService.sub_services_ar));
    } else {
      setForm({ ...EMPTY, display_order: defaultDisplayOrder ?? 0 });
      setSubEnText("");
      setSubArText("");
    }
    setError("");
  }, [open, initialService, defaultDisplayOrder]);

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    if (!form.name_en?.trim()) {
      setError("Name (English) is required.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        sub_services_en: fromLines(subEnText),
        sub_services_ar: fromLines(subArText),
        display_order: Number(form.display_order) || 0,
      };
      if (initialService?.id) {
        await base44.entities.Service.update(initialService.id, payload);
      } else {
        if (!payload.display_order) payload.display_order = defaultDisplayOrder ?? 0;
        await base44.entities.Service.create(payload);
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
          <DialogTitle>{initialService ? "Edit Service" : "Add Service"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Service ID</label>
            <Input
              value={form.service_id}
              onChange={(e) => setField("service_id", e.target.value)}
              placeholder="strategy"
            />
            <p className="text-xs text-muted-foreground mt-1">Stable key, e.g. strategy</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Name (English) *</label>
              <Input value={form.name_en} onChange={(e) => setField("name_en", e.target.value)} placeholder="Strategy Consulting" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Name (Arabic)</label>
              <Input value={form.name_ar} onChange={(e) => setField("name_ar", e.target.value)} placeholder="الاستشارات الاستراتيجية" dir="rtl" />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Tagline (English)</label>
              <Input value={form.tagline_en} onChange={(e) => setField("tagline_en", e.target.value)} placeholder="Short line used on the homepage catalogue" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Tagline (Arabic)</label>
              <Input value={form.tagline_ar} onChange={(e) => setField("tagline_ar", e.target.value)} dir="rtl" />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Goal (English)</label>
              <Textarea
                value={form.goal_en}
                onChange={(e) => setField("goal_en", e.target.value)}
                placeholder="Longer sentence used on the services page"
                className="min-h-[70px]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Goal (Arabic)</label>
              <Textarea
                value={form.goal_ar}
                onChange={(e) => setField("goal_ar", e.target.value)}
                dir="rtl"
                className="min-h-[70px]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Description (English)</label>
              <Textarea
                value={form.description_en}
                onChange={(e) => setField("description_en", e.target.value)}
                placeholder="Optional"
                className="min-h-[70px]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Description (Arabic)</label>
              <Textarea
                value={form.description_ar}
                onChange={(e) => setField("description_ar", e.target.value)}
                dir="rtl"
                className="min-h-[70px]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Sub-services (English)</label>
              <Textarea
                value={subEnText}
                onChange={(e) => setSubEnText(e.target.value)}
                placeholder="One item per line"
                className="min-h-[160px] font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Sub-services (Arabic)</label>
              <Textarea
                value={subArText}
                onChange={(e) => setSubArText(e.target.value)}
                dir="rtl"
                placeholder="عنصر واحد في كل سطر"
                className="min-h-[160px] font-mono text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Icon</label>
              <Select value={form.icon || "Target"} onValueChange={(v) => setField("icon", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((name) => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Display Order</label>
              <Input
                type="number"
                value={form.display_order}
                onChange={(e) => setField("display_order", e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch checked={!!form.is_active} onCheckedChange={(v) => setField("is_active", v)} />
              <span className="text-sm">{form.is_active ? "Active" : "Inactive"}</span>
            </div>
          </div>

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