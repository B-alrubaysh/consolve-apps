export default function LeadFilters({ lang, source, filters, onChange }) {
  const isAr = lang === "ar";
  const set = (k) => (e) => onChange({ ...filters, [k]: e.target.value });
  return (
    <div className="dt1-filters">
      <input
        className="dt1-input dt1-input--search"
        value={filters.search}
        onChange={set("search")}
        placeholder={isAr ? "بحث بالاسم أو الشركة أو الجوال" : "Search name, company or phone"}
      />
      <label className="dt1-field">
        <span>{isAr ? "من" : "From"}</span>
        <input type="date" className="dt1-input" value={filters.from} onChange={set("from")} />
      </label>
      <label className="dt1-field">
        <span>{isAr ? "إلى" : "To"}</span>
        <input type="date" className="dt1-input" value={filters.to} onChange={set("to")} />
      </label>
      {source.utm && (
        <input
          className="dt1-input"
          value={filters.campaign}
          onChange={set("campaign")}
          placeholder={isAr ? "الحملة / المصدر" : "Campaign / source"}
          title="utm_campaign / utm_source"
        />
      )}
    </div>
  );
}