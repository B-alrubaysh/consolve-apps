import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Admin";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function normalizeSlug(v) {
  return (v || "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function NewLandingPageDialog({ open, onOpenChange, existingSlugs, onCreated }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName("");
      setSlug("");
      setSlugTouched(false);
      setError("");
      setSaving(false);
    }
  }, [open]);

  const onNameChange = (v) => {
    setName(v);
    if (!slugTouched) setSlug(normalizeSlug(v));
  };

  const onSlugChange = (v) => {
    setSlugTouched(true);
    setSlug(normalizeSlug(v));
  };

  const handleSave = async () => {
    setError("");
    if (!name.trim()) { setError("Name is required."); return; }
    if (!slug.trim()) { setError("Slug is required."); return; }
    if (existingSlugs.includes(slug)) { setError("That slug is already used."); return; }

    setSaving(true);
    try {
      const created = await base44.entities.LandingPage.create({
        name: name.trim(),
        slug,
        html_content: "",
        css_content: "",
        js_content: "",
        is_published: false,
      });
      onCreated(created);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-secondary border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>New Landing Page</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Name</label>
            <Input
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Summer Campaign"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Slug</label>
            <Input
              value={slug}
              onChange={(e) => onSlugChange(e.target.value)}
              placeholder="summer-campaign"
              className="bg-white/5 border-white/10 text-white"
            />
            <p className="text-xs text-white/40 mt-1.5">Public URL: /p/{slug || "…"}</p>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Creating…" : "Create & Edit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}