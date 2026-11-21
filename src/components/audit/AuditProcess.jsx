import { useLanguage } from "@/lib/useLanguage";
import { AUDIT_COPY } from "./auditCopy";
import { Section, SectionTitle, Reveal, PING } from "./auditUi";
import useScrollProgress from "./useScrollProgress";

// 5-step timeline: vertical on mobile/tablet, horizontal on desktop. The line
// draws as the visitor scrolls and each step lights up when reached.
export default function AuditProcess() {
  const { lang, isAr } = useLanguage();
  const C = AUDIT_COPY[lang];
  const [ref, progress] = useScrollProgress();
  const n = C.steps.length;
  const lit = (i) => progress >= i / (n - 1) - 0.02;

  return (
    <Section grey>
      <Reveal><SectionTitle className="text-center mb-12 lg:mb-16">{C.process_title}</SectionTitle></Reveal>
      <div ref={ref} className="relative max-w-2xl lg:max-w-none mx-auto">
        {/* Track + drawn line: vertical (mobile) */}
        <div className="lg:hidden absolute top-5 bottom-5 start-5 w-0.5 bg-[#0D2528]/10" />
        <div className="lg:hidden absolute top-5 bottom-5 start-5 w-0.5 bg-[#E87B59] origin-top transition-transform duration-300"
          style={{ transform: `scaleY(${progress})` }} />
        {/* Track + drawn line: horizontal (desktop) */}
        <div className="hidden lg:block absolute top-5 h-0.5 bg-[#0D2528]/10" style={{ insetInline: "10%" }} />
        <div className={`hidden lg:block absolute top-5 h-0.5 bg-[#E87B59] transition-transform duration-300 ${isAr ? "origin-right" : "origin-left"}`}
          style={{ insetInline: "10%", transform: `scaleX(${progress})` }} />

        <ol className="relative grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-6">
          {C.steps.map((s, i) => (
            <li key={i} className="flex lg:flex-col lg:items-center lg:text-center gap-4">
              <span className={`${PING} relative z-10 w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-sm border-2 transition-all duration-500 ${
                lit(i) ? "bg-[#E87B59] border-[#E87B59] text-white shadow-[0_0_0_6px_rgba(232,123,89,0.15)]" : "bg-white border-[#0D2528]/15 text-[#718487]"
              }`}>{i + 1}</span>
              <div className={`transition-opacity duration-500 ${lit(i) ? "opacity-100" : "opacity-60"}`}>
                <h3 className={`${PING} text-base text-[#0D2528] mb-1.5 ${isAr ? "!leading-[1.6]" : ""}`}>{s.t}</h3>
                <p className="text-sm text-[#718487] leading-relaxed">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}