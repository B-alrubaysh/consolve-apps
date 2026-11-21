import { useLanguage } from "@/lib/useLanguage";
import { AUDIT_COPY, AUDIT_FORM_ID } from "./auditCopy";
import { SectionTitle, Reveal } from "./auditUi";
import AuditForm from "./AuditForm";

export default function AuditFormSection() {
  const { lang } = useLanguage();
  const C = AUDIT_COPY[lang];
  return (
    <section id={AUDIT_FORM_ID} className="relative overflow-hidden py-16 sm:py-24 bg-secondary scroll-mt-20">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 50% 45% at 20% 20%, rgba(232,123,89,0.18) 0%, transparent 65%)",
      }} />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <Reveal><SectionTitle light className="mb-5">{C.form_title}</SectionTitle></Reveal>
          <Reveal delay={80}><p className="text-white/70 text-base sm:text-lg leading-relaxed">{C.form_text}</p></Reveal>
        </div>
        <Reveal delay={160}><AuditForm /></Reveal>
      </div>
    </section>
  );
}