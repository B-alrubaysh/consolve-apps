import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const IPT = "bg-white/5 border-white/10 text-white";

/**
 * Bilingual EN / AR input pair used inside the About and Contact admin tabs.
 * Mirrors the styling and labelling pattern used by SiteInfoTab.
 */
export default function BilingualField({ label, name, form, onChange, multiline = false, rows = 3 }) {
  const Comp = multiline ? Textarea : Input;
  const enKey = `${name}_en`;
  const arKey = `${name}_ar`;
  const extra = multiline ? { rows } : {};

  return (
    <div>
      <label className="block text-xs text-white/60 mb-1.5">{label}</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Comp
          value={form[enKey] || ""}
          onChange={(e) => onChange(enKey, e.target.value)}
          placeholder="English"
          className={IPT}
          {...extra}
        />
        <Comp
          dir="rtl"
          value={form[arKey] || ""}
          onChange={(e) => onChange(arKey, e.target.value)}
          placeholder="العربية"
          className={IPT}
          {...extra}
        />
      </div>
    </div>
  );
}