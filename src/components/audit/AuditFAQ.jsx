import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useLanguage } from "@/lib/useLanguage";
import { AUDIT_COPY } from "./auditCopy";
import { Section, SectionTitle, Reveal } from "./auditUi";

export default function AuditFAQ() {
  const { lang } = useLanguage();
  const C = AUDIT_COPY[lang];
  return (
    <Section grey>
      <Reveal><SectionTitle className="text-center mb-10">{C.faq_title}</SectionTitle></Reveal>
      <Reveal delay={100}>
        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-2">
            {C.faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-white rounded-xl border-none px-4">
                <AccordionTrigger className="text-sm font-semibold text-[#0D2528] text-start hover:no-underline py-4">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-[#718487] leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Reveal>
    </Section>
  );
}