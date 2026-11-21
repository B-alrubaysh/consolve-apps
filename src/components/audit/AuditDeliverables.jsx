import { FileCheck2 } from "lucide-react";
import { useLanguage } from "@/lib/useLanguage";
import { AUDIT_COPY } from "./auditCopy";
import { Section, SectionTitle, Reveal } from "./auditUi";
import ReportCard from "./ReportCard";

export default function AuditDeliverables() {
  const { lang } = useLanguage();
  const C = AUDIT_COPY[lang];
  return (
    <Section>
      <Reveal><SectionTitle className="text-center mb-12">{C.deliv_title}</SectionTitle></Reveal>
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center max-w-5xl mx-auto">
        <div>
          <ul className="space-y-3">
            {C.deliv_items.map((d, i) => (
              <Reveal as="li" key={i} delay={i * 80} className="flex items-start gap-3 border-b border-[#0D2528]/10 pb-3">
                <FileCheck2 className="w-5 h-5 text-[#E87B59] shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-[#3D4D4F] leading-relaxed">{d}</span>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={200}><p className="text-xs text-[#718487] mt-5 leading-relaxed">{C.deliv_note}</p></Reveal>
        </div>
        <Reveal delay={150}><ReportCard /></Reveal>
      </div>
    </Section>
  );
}