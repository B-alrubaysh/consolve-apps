import { useLanguage } from "@/lib/useLanguage";
import { AUDIT_COPY } from "./auditCopy";
import { AREA_ICONS } from "./auditIcons";
import { Section, SectionTitle, Reveal, PING } from "./auditUi";

export default function AuditAreas() {
  const { lang, isAr } = useLanguage();
  const C = AUDIT_COPY[lang];
  return (
    <Section>
      <Reveal><SectionTitle className="text-center mb-12">{C.areas_title}</SectionTitle></Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {C.areas.map((a, i) => {
          const Icon = AREA_ICONS[i];
          return (
            <Reveal key={i} delay={(i % 4) * 90 + Math.floor(i / 4) * 60}>
              <div className="au-lift h-full bg-[#F7F7F5] rounded-2xl border border-transparent p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <Icon className="w-5 h-5 text-[#E87B59]" />
                  </div>
                  <span className={`${PING} text-sm text-[#0D2528]/25`}>{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className={`${PING} text-base text-[#0D2528] mb-2 ${isAr ? "!leading-[1.6]" : ""}`}>{a.t}</h3>
                <p className="text-sm text-[#718487] leading-relaxed">{a.d}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}