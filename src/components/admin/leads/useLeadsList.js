import { useEffect, useState, useCallback } from "react";
import { base44 } from "@/api/base44Admin";
import { buildQuery, STATUSES, LEADS_CHANGED } from "./leadsConfig";

const LIMIT = 500;

/** Server-filtered lead list for one source, plus per-status counts. */
export default function useLeadsList(source, filters, status) {
  const [rows, setRows] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({});
  const [tick, setTick] = useState(0);
  const ent = base44.entities[source.entity];

  useEffect(() => {
    const h = () => setTick((t) => t + 1);
    window.addEventListener(LEADS_CHANGED, h);
    return () => window.removeEventListener(LEADS_CHANGED, h);
  }, []);

  // List
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const t = setTimeout(async () => {
      const q = buildQuery(source, filters, status === "all" ? null : status);
      const page = await ent.filter(q, { sort: "-created_date", limit: LIMIT });
      if (cancelled) return;
      setRows(page.items || []);
      setCursor(page.has_more ? page.next_cursor : null);
      setLoading(false);
    }, 300);
    return () => { cancelled = true; clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source.key, filters.from, filters.to, filters.campaign, filters.search, status]);

  // Per-status counts (ignore the status pill itself)
  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      const keys = ["all", ...STATUSES.map((s) => s.key)];
      const vals = await Promise.all(keys.map((k) => ent.count(buildQuery(source, filters, k === "all" ? null : k))));
      if (cancelled) return;
      setCounts(Object.fromEntries(keys.map((k, i) => [k, vals[i]])));
    }, 300);
    return () => { cancelled = true; clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source.key, filters.from, filters.to, filters.campaign, filters.search, tick]);

  const patchRow = useCallback((id, data) => {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...data } : r)));
  }, []);

  // Every matching record, following cursors past the first page.
  const fetchAll = useCallback(async () => {
    let all = [...rows], c = cursor;
    const q = buildQuery(source, filters, status === "all" ? null : status);
    while (c) {
      const page = await ent.filter(q, { sort: "-created_date", limit: LIMIT, cursor: c });
      all = all.concat(page.items || []);
      c = page.has_more ? page.next_cursor : null;
    }
    return all;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, cursor, source.key, filters, status]);

  return { rows, loading, counts, patchRow, fetchAll };
}