import { useLanguage } from "@/lib/useLanguage";
import { AUDIT_COPY } from "./auditCopy";
import { Section, SectionTitle, Reveal, PING } from "./auditUi";

export default function AuditAudience() {
  const { lang } = useLanguage();
  const C = AUDIT_COPY[lang];
  return (
    <Section>
      <Reveal><SectionTitle className="text-center mb-4">{C.fit_title}</SectionTitle></Reveal>
      <Reveal delay={80}><p className="text-center text-[#718487] text-sm sm:text-base mb-10">{C.fit_intro}</p></Reveal>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-14 max-w-4xl mx-auto border-t border-[#0D2528]/10">
        {C.fit_items.map((f, i) => (
          <Reveal key={i} delay={i * 60}>
            <div className="flex gap-5 py-5 border-b border-[#0D2528]/10">
              <span className={`${PING} text-2xl text-[#E87B59] leading-none w-9 shrink-0 pt-0.5`} style={{ fontVariantNumeric: "tabular-nums" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-sm sm:text-base text-[#3D4D4F] leading-relaxed">{f}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}