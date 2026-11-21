import { useEffect, useMemo, useRef, useState } from "react";
import "./leads-table.css";
import LeadStatusPills from "./LeadStatusPills";
import LeadFilters from "./LeadFilters";
import LeadsTableBlock from "./LeadsTableBlock";
import LeadsPager from "./LeadsPager";
import { BeamButton } from "./LeadsIcons";
import useLeadsList from "./useLeadsList";
import { STATUSES, statusOf, downloadCSV } from "./leadsConfig";

const PER_PAGE = 10;
const ORDER = Object.fromEntries(STATUSES.map((s, i) => [s.key, i]));
const EMPTY_FILTERS = { search: "", from: "", to: "", campaign: "" };

export default function LeadsTable({ lang, source, onOpen, patchRef }) {
  const isAr = lang === "ar";
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState({ key: "date", dir: "desc" });
  const [page, setPage] = useState(1);
  const [picked, setPicked] = useState(new Set());
  const [toast, setToast] = useState("");
  const [enter, setEnter] = useState(true);
  const toastTimer = useRef(null);
  const { rows, loading, counts, patchRow, fetchAll } = useLeadsList(source, filters, status);
  patchRef.current = patchRow;

  useEffect(() => { const t = setTimeout(() => setEnter(false), 1100); return () => clearTimeout(t); }, []);
  useEffect(() => { setFilters(EMPTY_FILTERS); setStatus("all"); setPicked(new Set()); }, [source.key]);
  useEffect(() => { setPage(1); }, [filters, status, sort, source.key]);

  const f = source.f;
  const sorted = useMemo(() => {
    const val = (r) => sort.key === "date" ? r.created_date
      : sort.key === "status" ? ORDER[statusOf(r)]
      : String(r[sort.key === "name" ? f.name : f.company] || "").toLowerCase();
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => { const x = val(a), y = val(b); return x < y ? -dir : x > y ? dir : 0; });
  }, [rows, sort, f]);

  const pages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const start = (Math.min(page, pages) - 1) * PER_PAGE;
  const slice = sorted.slice(start, start + PER_PAGE);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  };
  const exportRows = async (scope) => {
    const list = scope === "selected" ? rows.filter((r) => picked.has(r.id)) : await fetchAll();
    if (!list.length) return showToast(isAr ? "لا يوجد ما يمكن تصديره" : "Nothing to export");
    downloadCSV(list, `leads-${source.key}-${new Date().toISOString().slice(0, 10)}.csv`);
    showToast(isAr ? `تم تصدير ${list.length} طلب` : `${list.length} requests exported`);
  };
  const pick = (id, on) => setPicked((s) => { const n = new Set(s); on ? n.add(id) : n.delete(id); return n; });
  const pickAll = (ids, on) => setPicked((s) => { const n = new Set(s); ids.forEach((id) => (on ? n.add(id) : n.delete(id))); return n; });
  const onSort = (key) => setSort((s) => s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: key === "date" ? "desc" : "asc" });
  const filtered = status !== "all" || Object.values(filters).some(Boolean);

  return (
    <section className="dt1-section" data-dt1-marker="" data-dt1-enter={enter ? "" : undefined}>
      <div className="dt1-card" data-dt1-bulk={picked.size ? "on" : "off"}>
        <div className="dt1-shell" data-dt1-toast={toast ? "on" : "off"}>
          <div className="dt1-head">
            <div className="dt1-titles">
              <h3 className="dt1-title">{source.label[lang]}</h3>
              <p className="dt1-meta">{isAr ? `${counts.all ?? "…"} طلب · ${PER_PAGE} لكل صفحة` : `${counts.all ?? "…"} requests · ${PER_PAGE} per page`}</p>
            </div>
            <span className="dt1-export">
              <BeamButton onClick={() => exportRows("all")} disabled={loading}>{isAr ? "تصدير CSV" : "Export CSV"}</BeamButton>
            </span>
          </div>
          <LeadFilters lang={lang} source={source} filters={filters} onChange={setFilters} />
          <div className="dt1-toolwrap">
            <div className="dt1-tools">
              <LeadStatusPills lang={lang} counts={counts} value={status} onChange={setStatus} />
            </div>
            <div className="dt1-bulk" aria-live="polite">
              <span className="dt1-bulk-n">{isAr ? `${picked.size} محدد` : `${picked.size} selected`}</span>
              <span className="dt1-spacer" />
              <button type="button" className="dt1-btn dt1-btn--ghost" onClick={() => setPicked(new Set())}>{isAr ? "إلغاء" : "Clear"}</button>
              <BeamButton className="dt1-btn--primary" onClick={() => exportRows("selected")}>{isAr ? "تصدير المحدد" : "Export selected"}</BeamButton>
            </div>
          </div>
          <LeadsTableBlock
            lang={lang} source={source} rows={slice} loading={loading} picked={picked}
            onPick={pick} onPickAll={pickAll} sort={sort} onSort={onSort} onOpen={onOpen}
            emptyTitle={filtered ? (isAr ? "لا توجد طلبات مطابقة" : "No requests match these filters") : (isAr ? "لا توجد طلبات بعد" : "No requests yet")}
            emptyText={filtered ? (isAr ? "جرّب تغيير الفلاتر أو مسح البحث." : "Try changing the filters or clearing the search.") : (isAr ? "ستظهر الطلبات الجديدة هنا فور وصولها." : "New requests will appear here as soon as they arrive.")}
          />
          {!loading && sorted.length > 0 && (
            <LeadsPager lang={lang} page={Math.min(page, pages)} pages={pages} shown={slice.length} start={start} total={sorted.length} onPage={setPage} />
          )}
          {(loading || sorted.length === 0) && <div style={{ height: 20 }} />}
          <div className="dt1-toast" role="status" aria-live="polite">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m3 8.5 3.2 3.2L13 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span>{toast}</span>
          </div>
        </div>
      </div>
    </section>
  );
}