import { useRef, useCallback } from "react";

/** The single travelling hover band that slides from row to row (design component behaviour). */
export default function useRowMarker(wrapRef, markerRef) {
  const y0 = useRef(0);
  const stretch = useRef(null);

  const markerTo = useCallback((row) => {
    const wrap = wrapRef.current, m = markerRef.current;
    if (!wrap || !m) return;
    const wr = wrap.getBoundingClientRect();
    const rr = row.getBoundingClientRect();
    const y = rr.top - wr.top - wrap.clientTop;
    const wasOn = m.getAttribute("data-on") === "1";
    const dist = wasOn ? Math.abs(y - y0.current) : 0;
    const dur = Math.round(Math.min(520, Math.max(190, 150 + dist * 0.45)));
    m.style.setProperty("--dt1-marker-dur", dur + "ms");
    if (!wasOn) m.style.transition = "none";
    m.style.height = rr.height + "px";
    m.style.translate = `0 ${y}px`;
    if (dist > 4) {
      m.style.transformOrigin = y > y0.current ? "center top" : "center bottom";
      m.style.scale = `1 ${(1 + Math.min(0.07, dist / 2200)).toFixed(3)}`;
      clearTimeout(stretch.current);
      stretch.current = setTimeout(() => { m.style.scale = "1 1"; }, Math.round(dur * 0.45));
    }
    if (!wasOn) {
      void m.offsetWidth;
      m.style.transition = "";
      m.style.scale = "1 1";
    }
    y0.current = y;
    m.setAttribute("data-on", "1");
  }, [wrapRef, markerRef]);

  const off = useCallback(() => {
    const m = markerRef.current;
    if (!m) return;
    clearTimeout(stretch.current);
    m.style.scale = "1 1";
    m.setAttribute("data-on", "0");
  }, [markerRef]);

  const onPointerOver = useCallback((e) => {
    const row = e.target.closest?.("[data-dt1-row]");
    if (row) markerTo(row);
  }, [markerTo]);

  return { onPointerOver, off };
}