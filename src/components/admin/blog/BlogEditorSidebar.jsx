import { useRef, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Loader2, Upload } from "lucide-react";

function ImageUploader({ value, onChange, label }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setUploading(false);
    onChange(file_url);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <label className="block text-xs text-white/60 mb-1.5">{label}</label>
      {value ? (
        <div className="relative rounded-lg overflow-hidden bg-white/5 border border-white/10 mb-2">
          <img src={value} alt={label} className="w-full aspect-video object-cover" />
        </div>
      ) : null}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? "Uploading…" : value ? "Replace" : "Upload"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/70 hover:bg-destructive/20 hover:text-destructive transition-colors"
          >
            Remove
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}

const Field = ({ label, children, error }) => (
  <div>
    <label className="block text-xs text-white/60 mb-1.5">{label}</label>
    {children}
    {error && <p className="text-xs text-destructive mt-1">{error}</p>}
  </div>
);

export default function BlogEditorSidebar({ form, setField, users, errors }) {
  const tagsString = Array.isArray(form.tags) ? form.tags.join(", ") : (form.tags || "");

  return (
    <Accordion type="multiple" defaultValue={["status", "media", "cat"]} className="bg-white/5 border border-white/10 rounded-xl px-4">
      <AccordionItem value="status" className="border-white/10">
        <AccordionTrigger className="text-white">Status & Schedule</AccordionTrigger>
        <AccordionContent className="space-y-3">
          <Field label="Status">
            <Select value={form.status || "draft"} onValueChange={(v) => setField("status", v)}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Publish Date">
            <Input
              type="datetime-local"
              value={form.publish_date ? toLocalDt(form.publish_date) : ""}
              onChange={(e) => setField("publish_date", e.target.value ? new Date(e.target.value).toISOString() : "")}
              className="bg-white/5 border-white/10 text-white"
            />
          </Field>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="media" className="border-white/10">
        <AccordionTrigger className="text-white">Hero & Media</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <ImageUploader
            label="Hero Image"
            value={form.hero_image_url}
            onChange={(v) => setField("hero_image_url", v)}
          />
          {errors?.hero_image_url && <p className="text-xs text-destructive">{errors.hero_image_url}</p>}
          <ImageUploader
            label="Open Graph Image"
            value={form.og_image_url}
            onChange={(v) => setField("og_image_url", v)}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="cat" className="border-white/10">
        <AccordionTrigger className="text-white">Categorization</AccordionTrigger>
        <AccordionContent className="space-y-3">
          <Field label="Category">
            <Input
              value={form.category || ""}
              onChange={(e) => setField("category", e.target.value)}
              placeholder="Strategy, Operations…"
              className="bg-white/5 border-white/10 text-white"
            />
          </Field>
          <Field label="Tags (comma-separated)">
            <Input
              value={tagsString}
              onChange={(e) => setField(
                "tags",
                e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
              )}
              placeholder="growth, leadership"
              className="bg-white/5 border-white/10 text-white"
            />
          </Field>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="seo" className="border-white/10">
        <AccordionTrigger className="text-white">SEO</AccordionTrigger>
        <AccordionContent className="space-y-3">
          <Field label="SEO Title (English)">
            <Input value={form.seo_title_en || ""} onChange={(e) => setField("seo_title_en", e.target.value)} className="bg-white/5 border-white/10 text-white" />
          </Field>
          <Field label="SEO Title (Arabic)">
            <Input dir="rtl" value={form.seo_title_ar || ""} onChange={(e) => setField("seo_title_ar", e.target.value)} className="bg-white/5 border-white/10 text-white text-right" />
          </Field>
          <Field label="SEO Description (English)">
            <Textarea rows={2} value={form.seo_description_en || ""} onChange={(e) => setField("seo_description_en", e.target.value)} className="bg-white/5 border-white/10 text-white" />
          </Field>
          <Field label="SEO Description (Arabic)">
            <Textarea dir="rtl" rows={2} value={form.seo_description_ar || ""} onChange={(e) => setField("seo_description_ar", e.target.value)} className="bg-white/5 border-white/10 text-white text-right" />
          </Field>
          <Field label="Canonical URL">
            <Input value={form.canonical_url || ""} onChange={(e) => setField("canonical_url", e.target.value)} placeholder="https://…" className="bg-white/5 border-white/10 text-white" />
          </Field>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="gate" className="border-white/10">
        <AccordionTrigger className="text-white">Email Gate</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/80">Enabled</span>
            <Switch
              checked={!!form.email_gate_enabled}
              onCheckedChange={(v) => setField("email_gate_enabled", v)}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/80">Threshold</span>
              <span className="text-xs text-white/60">{form.email_gate_threshold ?? 35}%</span>
            </div>
            <Slider
              min={10}
              max={80}
              step={1}
              value={[form.email_gate_threshold ?? 35]}
              onValueChange={(v) => setField("email_gate_threshold", v[0])}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/80">Skippable</span>
            <Switch
              checked={form.email_gate_skippable !== false}
              onCheckedChange={(v) => setField("email_gate_skippable", v)}
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="author" className="border-white/10 border-b-0">
        <AccordionTrigger className="text-white">Author</AccordionTrigger>
        <AccordionContent className="space-y-3">
          <Field label="Author">
            <Select value={form.author_id || ""} onValueChange={(v) => setField("author_id", v)}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue placeholder="Select author…" /></SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.full_name || u.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function toLocalDt(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}