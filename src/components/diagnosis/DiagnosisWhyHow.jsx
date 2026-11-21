import { SlidersHorizontal, Search, PieChart, ClipboardCheck } from "lucide-react";
import AnimatedSection from "../AnimatedSection";

const WHY_ICONS = [SlidersHorizontal, Search, PieChart, ClipboardCheck];

// "Why this diagnosis" cards followed by the "How does it work?" steps.
export default function DiagnosisWhyHow({ c }) {
  return (
    <>
      <AnimatedSection>
        <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">{c.why_title}</h3>
      </AnimatedSection>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {c.why.map((w, i) => {
          const Icon = WHY_ICONS[i];
          return (
            <AnimatedSection key={w.t} delay={i * 100}>
              <div className="h-full rounded-2xl border border-border bg-card p-6 text-center hover:border-primary/30 transition-colors duration-500">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-secondary" />
                </div>
                <p className="font-bold text-foreground mb-2">{w.t}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{w.d}</p>
              </div>
            </AnimatedSection>
          );
        })}
      </div>

      <AnimatedSection>
        <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">{c.how_title}</h3>
      </AnimatedSection>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 max-w-5xl mx-auto">
        {c.how.map((h, i) => (
          <AnimatedSection key={h.t} delay={i * 100}>
            <div className="h-full flex gap-4 rounded-2xl border border-border bg-card p-6">
              <div className="w-9 h-9 rounded-full bg-secondary text-white flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</div>
              <div>
                <p className="font-bold text-foreground mb-2">{h.t}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{h.d}</p>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </>
  );
}