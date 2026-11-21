import { useLanguage } from "@/lib/useLanguage";
import { AUDIT_COPY } from "./auditCopy";
import { Section, SectionTitle, Reveal } from "./auditUi";

export default function AuditAbout() {
  const { lang } = useLanguage();
  const C = AUDIT_COPY[lang];
  return (
    <Section grey>
      <div className="max-w-3xl mx-auto text-center">
        <Reveal><SectionTitle className="mb-8">{C.about_title}</SectionTitle></Reveal>
        <div className="space-y-5">
          {C.about_ps.map((p, i) => (
            <Reveal key={i} delay={i * 100}>
              <p className={`leading-relaxed ${i === 0 ? "text-[#0D2528] text-lg sm:text-xl font-semibold" : "text-[#3D4D4F] text-base sm:text-lg"}`}>{p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}