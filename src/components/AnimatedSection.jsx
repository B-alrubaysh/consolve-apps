import { useEffect, useRef, useState } from "react";

export default function AnimatedSection({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-[800ms] ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      } ${className}`}
      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      {children}
    </div>
  );
}