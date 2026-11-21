export default function LeadsPager({ lang, page, pages, shown, start, total, onPage }) {
  const isAr = lang === "ar";
  const first = Math.max(1, Math.min(page - 2, pages - 4));
  const nums = Array.from({ length: Math.min(5, pages) }, (_, i) => first + i);
  const range = total
    ? (isAr ? `عرض ${shown} من ${total}` : `Showing ${shown} of ${total}`)
    : (isAr ? "لا توجد طلبات" : "No requests to show");
  return (
    <div className="dt1-foot">
      <div className="dt1-range">{range}</div>
      <div className="dt1-meter" aria-hidden="true">
        <span className="dt1-meter-fill" style={{ width: total ? `${((start + shown) / total) * 100}%` : "0%" }} />
      </div>
      <div className="dt1-pager">
        <button type="button" className="dt1-page" aria-label={isAr ? "السابق" : "Previous page"} disabled={page <= 1} onClick={() => onPage(page - 1)}>
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10 3.5 5.5 8l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        {nums.map((n) => (
          <button key={n} type="button" className="dt1-page" aria-current={n === page ? "page" : undefined} onClick={() => onPage(n)}>{n}</button>
        ))}
        <button type="button" className="dt1-page" aria-label={isAr ? "التالي" : "Next page"} disabled={page >= pages} onClick={() => onPage(page + 1)}>
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
  );
}