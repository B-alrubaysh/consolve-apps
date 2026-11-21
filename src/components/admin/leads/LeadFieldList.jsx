import { FIELD_LABELS, HIDDEN_FIELDS, fieldLabel, formatValue } from "./leadFieldLabels";
import { formatDate } from "./leadsConfig";

export default function LeadFieldList({ lead, lang }) {
  const known = Object.keys(FIELD_LABELS);
  const keys = [
    ...known.filter((k) => k in lead),
    ...Object.keys(lead).filter((k) => !known.includes(k)),
  ].filter((k) => !HIDDEN_FIELDS.has(k));
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
      {keys.map((k) => {
        const v = k === "created_date" ? formatDate(lead[k]) : formatValue(lead[k], lang);
        const long = String(v).length > 60;
        return (
          <div key={k} className={long ? "sm:col-span-2" : ""}>
            <dt className="text-[11px] uppercase tracking-widest text-white/40">{fieldLabel(k, lang)}</dt>
            <dd className="text-sm text-white/90 whitespace-pre-wrap break-words mt-0.5"><bdi>{v}</bdi></dd>
          </div>
        );
      })}
    </dl>
  );
}