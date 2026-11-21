import { AlertCircle, Info } from "lucide-react";
import { useLanguage } from "@/lib/useLanguage";
import { AUDIT_COPY } from "./auditCopy";
import { Section, SectionTitle, Reveal } from "./auditUi";

export default function AuditChallenges() {
  const { lang } = useLanguage();
  const C = AUDIT_COPY[lang];
  return (
    <Section>
      <div className="max-w-3xl mx-auto">
        <Reveal><SectionTitle className="text-center mb-5">{C.ch_title}</SectionTitle></Reveal>
        <Reveal delay={80}><p className="text-center text-[#3D4D4F] text-base sm:text-lg leading-relaxed mb-10">{C.ch_intro}</p></Reveal>
        <ul className="space-y-3">
          {C.ch_items.map((item, i) => (
            <Reveal as="li" key={i} delay={i * 90} className="flex items-start gap-3 bg-[#F7F7F5] rounded-xl px-4 py-3.5">
              <AlertCircle className="w-5 h-5 text-[#E87B59] shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-[#3D4D4F] leading-relaxed">{item}</span>
            </Reveal>
          ))}
        </ul>
        <Reveal delay={120}>
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[#E87B59]/25 bg-[#E87B59]/[0.07] p-5 sm:p-6">
            <Info className="w-5 h-5 text-[#E87B59] shrink-0 mt-1" />
            <p className="text-[#0D2528] text-sm sm:text-base leading-relaxed font-medium">{C.ch_note}</p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}