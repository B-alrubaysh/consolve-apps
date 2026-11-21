import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./auditUi";

// 0 → 1 as the element passes from the lower part of the viewport to its middle.
export default function useScrollProgress() {
  const ref = useRef(null);
  const [progress, setProgress] = useState(() => (prefersReducedMotion() ? 1 : 0));
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.8, end = vh * 0.45;
      const p = (start - r.top) / (r.height + start - end);
      setProgress((prev) => Math.max(prev, Math.min(1, Math.max(0, p))));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return [ref, progress];
}