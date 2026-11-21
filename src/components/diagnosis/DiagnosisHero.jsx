import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "../AnimatedSection";
import ReportPreviewCard from "./ReportPreviewCard";

// Headline + intro + CTA, with the visual report preview beside it.
// `as` lets the /diagnosis page render the headline as its h1.
export default function DiagnosisHero({ c, lang, onCta, as: Heading = "h2" }) {
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
      <AnimatedSection>
        <Heading className={`${lang === "ar" ? "ar-display-heading !leading-[1.6] pt-1" : "leading-tight"} text-3xl md:text-5xl font-black text-foreground tracking-tight mb-6 text-center lg:text-start`}>
          {c.h2_plain}<br /><span className="text-primary">{c.h2_accent}</span>
        </Heading>
        <p className="text-muted-foreground text-base md:text-lg leading-[1.9] mb-8 text-center lg:text-start">{c.intro}</p>
        <div className="flex justify-center lg:justify-start">
          <Button onClick={onCta} className="bg-primary text-primary-foreground rounded-xl px-10 h-12 font-semibold text-base">
            {c.cta} <Arrow className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-4 max-w-md mx-auto lg:mx-0 text-center lg:text-start">
          {c.cta_note}
        </p>
      </AnimatedSection>
      <AnimatedSection delay={150}>
        <ReportPreviewCard c={c} />
      </AnimatedSection>
    </div>
  );
}