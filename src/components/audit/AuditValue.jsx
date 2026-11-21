import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/useLanguage";
import { AUDIT_COPY } from "./auditCopy";
import { Section, SectionTitle, Reveal } from "./auditUi";

export default function AuditValue() {
  const { lang } = useLanguage();
  const C = AUDIT_COPY[lang];
  return (
    <Section grey>
      <div className="max-w-3xl mx-auto">
        <Reveal><SectionTitle className="text-center mb-5">{C.value_title}</SectionTitle></Reveal>
        <Reveal delay={80}><p className="text-center text-[#3D4D4F] text-base sm:text-lg leading-relaxed mb-8">{C.value_intro}</p></Reveal>
        <Reveal delay={120}><p className="font-semibold text-[#0D2528] mb-4">{C.value_lead}</p></Reveal>
        <ul className="grid sm:grid-cols-2 gap-3">
          {C.value_items.map((v, i) => (
            <Reveal as="li" key={i} delay={i * 110} className="flex items-start gap-3 bg-white rounded-xl px-4 py-3.5">
              <span className="au-pop shrink-0 mt-0.5" style={{ transitionDelay: `${i * 110 + 200}ms` }}>
                <CheckCircle2 className="w-5 h-5 text-[#E87B59]" />
              </span>
              <span className="text-sm text-[#3D4D4F] leading-relaxed">{v}</span>
            </Reveal>
          ))}
        </ul>
        <Reveal delay={200}><p className="text-xs text-[#718487] mt-6 leading-relaxed text-center">{C.value_note}</p></Reveal>
      </div>
    </Section>
  );
}