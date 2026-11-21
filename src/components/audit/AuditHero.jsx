import CTAButton from "@/components/CTAButton";
import { useLanguage } from "@/lib/useLanguage";
import { AUDIT_COPY, AUDIT_FORM_ID } from "./auditCopy";
import { PING, GREY, Reveal } from "./auditUi";
import SystemNetwork from "./SystemNetwork";

export const scrollToAuditForm = () =>
  document.getElementById(AUDIT_FORM_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });

export default function AuditHero() {
  const { lang, isAr } = useLanguage();
  const C = AUDIT_COPY[lang];
  return (
    <section className="relative overflow-hidden flex items-center -mt-20 pt-20" style={{ background: GREY, minHeight: "calc(100svh + 5rem)" }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(13,37,40,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(13,37,40,0.05) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 55% 45% at 30% 36%, rgba(232,123,89,0.16) 0%, transparent 64%), radial-gradient(ellipse 52% 44% at 74% 66%, rgba(13,37,40,0.10) 0%, transparent 64%)",
      }} />
      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 py-16 w-full">
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="mb-8 sm:mb-10"><SystemNetwork /></div>
          <Reveal>
            <h1 className={`${PING} text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] ${isAr ? "!leading-[1.6]" : "leading-[1.25]"} text-[#102629] mb-5`}>
              {C.hero_h1}
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-[#3D4D4F] text-base sm:text-lg leading-relaxed mb-9 max-w-xl mx-auto">{C.hero_p}</p>
          </Reveal>
          <Reveal delay={240}>
            <div className="flex items-center justify-center">
              <CTAButton variant="primary" cta size="block" className="sm:w-auto" onClick={scrollToAuditForm}>{C.hero_cta}</CTAButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}