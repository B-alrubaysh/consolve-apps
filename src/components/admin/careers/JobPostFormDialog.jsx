import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Admin";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const EMPTY = {
  title_en: "",
  title_ar: "",
  slug: "",
  department_en: "",
  department_ar: "",
  location_en: "",
  location_ar: "",
  work_type: "",
  employment_type: "",
  description_en: "",
  description_ar: "",
  requirements_en: "",
  requirements_ar: "",
  responsibilities_en: "",
  responsibilities_ar: "",
  status: "draft",
  application_limit: "",
  publish_date: "",
  closing_date: "",
};

function slugify(s) {
  return (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function toDateInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function toIsoOrNull(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toISOString();
}

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

export default function JobPostFormDialog({ open, onOpenChange, initialJob, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      if (initialJob) {
        setForm({
          ...EMPTY,
          ...initialJob,
          application_limit: initialJob.application_limit ?? "",
          publish_date: toDateInput(initialJob.publish_date),
          closing_date: toDateInput(initialJob.closing_date),
        });
        setSlugTouched(true); // editing existing — don't auto-overwrite
      } else {
        setForm(EMPTY);
        setSlugTouched(false);
      }
      setError("");
    }
  }, [open, initialJob]);

  const update = (key, value) => {
    setForm((p) => {
      const next = { ...p, [key]: value };
      if (key === "title_en" && !slugTouched) {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const handleSlugChange = (value) => {
    setSlugTouched(true);
    setForm((p) => ({ ...p, slug: value }));
  };

  const buildPayload = (overrides = {}) => {
    const payload = {
      title_en: form.title_en.trim(),
      title_ar: form.title_ar || "",
      slug: form.slug || slugify(form.title_en),
      department_en: form.department_en || "",
      department_ar: form.department_ar || "",
      location_en: form.location_en || "",
      location_ar: form.location_ar || "",
      work_type: form.work_type || null,
      employment_type: form.employment_type || null,
      description_en: form.description_en || "",
      description_ar: form.description_ar || "",
      requirements_en: form.requirements_en || "",
      requirements_ar: form.requirements_ar || "",
      responsibilities_en: form.responsibilities_en || "",
      responsibilities_ar: form.responsibilities_ar || "",
      status: form.status || "draft",
      application_limit: form.application_limit === "" || form.application_limit == null ? null : Number(form.application_limit),
      publish_date: toIsoOrNull(form.publish_date),
      closing_date: toIsoOrNull(form.closing_date),
      ...overrides,
    };
    Object.keys(payload).forEach((k) => {
      if (payload[k] === null || payload[k] === undefined) {
        // keep nulls — they explicitly clear values
      }
    });
    return payload;
  };

  const save = async (mode) => {
    setError("");
    if (!form.title_en.trim()) {
      setError("English title is required");
      return;
    }

    let overrides = {};
    if (mode === "draft") {
      overrides.status = "draft";
    } else if (mode === "publish") {
      overrides.status = "open";
      if (!form.publish_date) {
        overrides.publish_date = new Date().toISOString();
      }
    }

    const payload = buildPayload(overrides);

    setSaving(true);
    if (initialJob?.id) {
      await base44.entities.JobPost.update(initialJob.id, payload);
    } else {
      await base44.entities.JobPost.create(payload);
    }
    setSaving(false);
    onSaved?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-secondary text-white border-white/10 max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">{initialJob?.id ? "Edit Job Post" : "Add Job Post"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Section title="Basic">
            <Field label="Title (English) *">
              <Input value={form.title_en} onChange={(e) => update("title_en", e.target.value)} className="bg-white/5 border-white/10 text-white" />
            </Field>
            <Field label="Title (Arabic)">
              <Input dir="rtl" value={form.title_ar} onChange={(e) => update("title_ar", e.target.value)} className="bg-white/5 border-white/10 text-white" />
            </Field>
            <Field label="Slug" full>
              <Input value={form.slug} onChange={(e) => handleSlugChange(e.target.value)} className="bg-white/5 border-white/10 text-white" />
            </Field>
            <Field label="Department (English)">
              <Input value={form.department_en} onChange={(e) => update("department_en", e.target.value)} className="bg-white/5 border-white/10 text-white" />
            </Field>
            <Field label="Department (Arabic)">
              <Input dir="rtl" value={form.department_ar} onChange={(e) => update("department_ar", e.target.value)} className="bg-white/5 border-white/10 text-white" />
            </Field>
            <Field label="Location (English)">
              <Input value={form.location_en} onChange={(e) => update("location_en", e.target.value)} className="bg-white/5 border-white/10 text-white" />
            </Field>
            <Field label="Location (Arabic)">
              <Input dir="rtl" value={form.location_ar} onChange={(e) => update("location_ar", e.target.value)} className="bg-white/5 border-white/10 text-white" />
            </Field>
          </Section>

          <Section title="Type">
            <Field label="Work Type">
              <Select value={form.work_type || ""} onValueChange={(v) => update("work_type", v)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="onsite">Onsite</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Employment Type">
              <Select value={form.employment_type || ""} onValueChange={(v) => update("employment_type", v)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </Section>

          <Section title="Content">
            <Field label="Description (English)" full>
              <Textarea className="bg-white/5 border-white/10 text-white min-h-[100px]" value={form.description_en} onChange={(e) => update("description_en", e.target.value)} />
            </Field>
            <Field label="Description (Arabic)" full>
              <Textarea dir="rtl" className="bg-white/5 border-white/10 text-white min-h-[100px]" value={form.description_ar} onChange={(e) => update("description_ar", e.target.value)} />
            </Field>
            <Field label="Requirements (English)" full>
              <Textarea className="bg-white/5 border-white/10 text-white min-h-[100px]" value={form.requirements_en} onChange={(e) => update("requirements_en", e.target.value)} />
            </Field>
            <Field label="Requirements (Arabic)" full>
              <Textarea dir="rtl" className="bg-white/5 border-white/10 text-white min-h-[100px]" value={form.requirements_ar} onChange={(e) => update("requirements_ar", e.target.value)} />
            </Field>
            <Field label="Responsibilities (English)" full>
              <Textarea className="bg-white/5 border-white/10 text-white min-h-[100px]" value={form.responsibilities_en} onChange={(e) => update("responsibilities_en", e.target.value)} />
            </Field>
            <Field label="Responsibilities (Arabic)" full>
              <Textarea dir="rtl" className="bg-white/5 border-white/10 text-white min-h-[100px]" value={form.responsibilities_ar} onChange={(e) => update("responsibilities_ar", e.target.value)} />
            </Field>
          </Section>

          <Section title="Publishing">
            <Field label="Status">
              <Select value={form.status} onValueChange={(v) => update("status", v)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Application Limit (blank = unlimited)">
              <Input type="number" min="0" value={form.application_limit} onChange={(e) => update("application_limit", e.target.value)} className="bg-white/5 border-white/10 text-white" />
            </Field>
            <Field label="Publish Date">
              <Input type="date" value={form.publish_date} onChange={(e) => update("publish_date", e.target.value)} className="bg-white/5 border-white/10 text-white" />
            </Field>
            <Field label="Closing Date">
              <Input type="date" value={form.closing_date} onChange={(e) => update("closing_date", e.target.value)} className="bg-white/5 border-white/10 text-white" />
            </Field>
          </Section>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter className="gap-2 mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-white/5 border-white/10 text-white hover:bg-white/10">
            Cancel
          </Button>
          <Button variant="outline" disabled={saving} onClick={() => save("draft")} className="bg-white/5 border-white/10 text-white hover:bg-white/10">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Draft"}
          </Button>
          <Button disabled={saving} onClick={() => save("publish")}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save & Publish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}