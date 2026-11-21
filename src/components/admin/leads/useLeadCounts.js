import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Admin";
import { SOURCES, UNREAD, LEADS_CHANGED } from "./leadsConfig";

/** Unread ("new") request counts per source; refreshes on navigation and on lead changes. */
export default function useLeadCounts(enabled = true) {
  const location = useLocation();
  const [counts, setCounts] = useState({});
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const h = () => setTick((t) => t + 1);
    window.addEventListener(LEADS_CHANGED, h);
    return () => window.removeEventListener(LEADS_CHANGED, h);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    Promise.all(
      SOURCES.map((s) => base44.entities[s.entity].count({ ...s.base, ...UNREAD }).catch(() => 0))
    ).then((vals) => {
      if (cancelled) return;
      const next = {};
      SOURCES.forEach((s, i) => { next[s.key] = vals[i] || 0; });
      next.total = vals.reduce((a, b) => a + (b || 0), 0);
      setCounts(next);
    });
    return () => { cancelled = true; };
  }, [enabled, location.pathname, tick]);

  return counts;
}