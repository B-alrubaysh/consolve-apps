import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { Checkbox, SortIcon } from "./LeadsIcons";
import LeadRow from "./LeadRow";
import useRowMarker from "./useRowMarker";

const COLS = [
  ["date", "dt1-th--date", { ar: "التاريخ والوقت", en: "Date / time" }],
  ["name", "dt1-th--name", { ar: "الاسم", en: "Name" }],
  ["company", "dt1-th--company", { ar: "الشركة", en: "Company" }],
  [null, "dt1-th--phone", { ar: "الجوال", en: "Phone" }],
  [null, "dt1-th--email", { ar: "البريد الإلكتروني", en: "Email" }],
  [null, "dt1-th--campaign", { ar: "الحملة", en: "Campaign" }],
  ["status", "dt1-th--status", { ar: "الحالة", en: "Status" }],
];

export default function LeadsTableBlock({ lang, source, rows, loading, emptyTitle, emptyText, picked, onPick, onPickAll, sort, onSort, onOpen }) {
  const wrapRef = useRef(null);
  const markerRef = useRef(null);
  const { onPointerOver, off } = useRowMarker(wrapRef, markerRef);
  const [bands, setBands] = useState([]);
  const isAr = lang === "ar";

  useEffect(() => { off(); }, [rows, off]);

  // One band behind every selected, visible row.
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const wr = wrap.getBoundingClientRect();
    const next = [];
    wrap.querySelectorAll("[data-dt1-row]").forEach((tr) => {
      if (!picked.has(tr.getAttribute("data-id"))) return;
      const rr = tr.getBoundingClientRect();
      next.push({ id: tr.getAttribute("data-id"), top: rr.top - wr.top - wrap.clientTop, h: rr.height });
    });
    setBands(next);
  }, [rows, picked]);

  const onPage = rows.filter((r) => picked.has(r.id)).length;

  return (
    <div className="dt1-tablewrap" ref={wrapRef} onPointerLeave={off}>
      {bands.map((b) => (
        <div key={b.id} className="dt1-selband" aria-hidden="true" style={{ height: b.h, translate: `0 ${b.top}px` }} />
      ))}
      <div className="dt1-marker" ref={markerRef} aria-hidden="true" />
      {loading ? (
        <div className="dt1-skel" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="dt1-skel-row" />)}
        </div>
      ) : rows.length === 0 ? (
        <div className="dt1-empty">
          <span className="dt1-empty-ico">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="1.75" y="2.75" width="12.5" height="10.5" rx="2" stroke="currentColor" strokeWidth="1.3" /><path d="M1.75 6.25h12.5M6 6.25v7" stroke="currentColor" strokeWidth="1.3" /></svg>
          </span>
          <span className="dt1-empty-t">{emptyTitle}</span>
          <p className="dt1-empty-p">{emptyText}</p>
        </div>
      ) : (
        <table className="dt1-table">
          <thead className="dt1-thead">
            <tr>
              <th className="dt1-th dt1-th--pick" scope="col">
                <Checkbox
                  checked={onPage > 0 && onPage === rows.length}
                  indeterminate={onPage > 0 && onPage < rows.length}
                  onChange={(e) => onPickAll(rows.map((r) => r.id), e.target.checked)}
                  label={isAr ? "تحديد الكل في هذه الصفحة" : "Select all on this page"}
                />
              </th>
              {COLS.map(([key, cls, label]) => (
                <th key={cls} className={`dt1-th ${cls}`} scope="col"
                  aria-sort={key && sort.key === key ? (sort.dir === "asc" ? "ascending" : "descending") : undefined}>
                  {key ? (
                    <button type="button" className="dt1-sort" onClick={() => onSort(key)}>{label[lang]} <SortIcon /></button>
                  ) : <span className="dt1-sort" style={{ cursor: "default" }}>{label[lang]}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="dt1-tbody" onPointerOver={onPointerOver}>
            {rows.map((lead, i) => (
              <LeadRow key={lead.id} lead={lead} source={source} lang={lang} index={i}
                picked={picked.has(lead.id)} onPick={onPick} onOpen={onOpen} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}