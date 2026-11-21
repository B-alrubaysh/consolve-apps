import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function LeadNotes({ value, onSave, lang }) {
  const isAr = lang === "ar";
  const [text, setText] = useState(value || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => { setText(value || ""); setSaved(false); }, [value]);

  const save = async () => {
    setSaving(true);
    await onSave(text);
    setSaving(false);
    setSaved(true);
  };

  return (
    <div className="space-y-2">
      <Textarea
        value={text}
        onChange={(e) => { setText(e.target.value); setSaved(false); }}
        rows={4}
        placeholder={isAr ? "ملاحظات داخلية — لا يراها إلا المشرفون" : "Internal notes — visible to admins only"}
        className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
      />
      <div className="flex items-center gap-3">
        <Button size="sm" onClick={save} disabled={saving || text === (value || "")}>
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {isAr ? "حفظ الملاحظات" : "Save notes"}
        </Button>
        {saved && <span className="text-xs text-emerald-300">{isAr ? "تم الحفظ" : "Saved"}</span>}
      </div>
    </div>
  );
}