import { STATUSES } from "./leadsConfig";

export default function LeadStatusPills({ lang, counts, value, onChange }) {
  const isAr = lang === "ar";
  const pills = [
    {
      key: "all", label: isAr ? "الكل" : "All",
      style: { "--dt1-fc": "#9DB0B3", "--dt1-fc-ink": "#F5F5F5", "--dt1-fc-cap": "#E87B59", "--dt1-fc-cap-ink": "#0E0E0E" },
    },
    ...STATUSES.map((s) => ({
      key: s.key, label: isAr ? s.ar : s.en,
      style: { "--dt1-fc": s.color, "--dt1-fc-fill": s.grad, "--dt1-fc-ink": "#0B0B0B" },
    })),
  ];
  return (
    <div className="dt1-chips" role="group" aria-label={isAr ? "تصفية حسب الحالة" : "Filter by status"}>
      {pills.map((p, i) => (
        <button
          key={p.key}
          type="button"
          className="dt1-fcard"
          data-dt1-filter={p.key}
          aria-pressed={value === p.key}
          style={{ "--dt1-i": i, ...p.style }}
          onClick={() => onChange(p.key)}
        >
          <span className="dt1-fcard-dot" aria-hidden="true" />
          <span className="dt1-fcard-name">{p.label}</span>
          <span className="dt1-fcard-n">{counts[p.key] ?? "…"}</span>
        </button>
      ))}
    </div>
  );
}