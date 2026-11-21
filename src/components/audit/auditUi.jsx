import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/useLanguage";

// Shared primitives for the /management-audit page — same look as /ecommerce-landing.
export const PING = "font-['PingAR'] font-bold";
export const GREY = "#F7F7F5";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Becomes true once the element scrolls into view (never resets).
export function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(prefersReducedMotion);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// Fade-up + slight slide, once per element.
export function Reveal({ children, className = "", delay = 0, as: Tag = "div" }) {
  const [ref, inView] = useInView();
  return (
    <Tag ref={ref} className={`au-reveal ${inView ? "au-in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}

export function SectionTitle({ children, className = "", light = false }) {
  const { isAr } = useLanguage();
  return (
    <h2 className={`${PING} text-2xl sm:text-3xl md:text-4xl ${isAr ? "!leading-[1.6]" : "leading-tight"} ${light ? "text-white" : "text-[#102629]"} ${className}`}>
      {children}
    </h2>
  );
}

export function Section({ grey = false, id, children, className = "" }) {
  return (
    <section id={id} className={`py-16 sm:py-20 ${grey ? "" : "bg-white"} ${className}`} style={grey ? { background: GREY } : undefined}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">{children}</div>
    </section>
  );
}

export const auditStyles = `
.au-reveal { opacity: 0; transform: translateY(24px); transition: opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1); }
.au-reveal.au-in { opacity: 1; transform: none; }
.au-pop { transform: scale(0); transition: transform .45s cubic-bezier(.34,1.56,.64,1); }
.au-in .au-pop { transform: scale(1); }
.au-lift { transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease; }
.au-lift:hover { transform: translateY(-4px); box-shadow: 0 18px 40px -24px rgba(13,37,40,.35); border-color: rgba(232,123,89,.35); }
@media (prefers-reduced-motion: reduce) {
  .au-reveal, .au-reveal.au-in { opacity: 1 !important; transform: none !important; transition: none !important; }
  .au-pop { transform: none !important; transition: none !important; }
  .au-lift:hover { transform: none; }
  .au-anim, .au-anim * { animation: none !important; transition: none !important; }
}
`;