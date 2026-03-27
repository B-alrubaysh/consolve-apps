import { Link } from "react-router-dom";
import { ArrowRight, Quote } from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";

const INDUSTRIES = [
  "Technology", "Healthcare", "Financial Services", "Manufacturing",
  "Retail & E-commerce", "Energy", "Real Estate", "Education",
  "Logistics", "Professional Services", "Government", "Hospitality"
];

const TESTIMONIALS = [
  {
    quote: "Consolve's assessment identified operational bottlenecks we'd been struggling with for years. Their recommendations transformed our supply chain efficiency by 35%.",
    author: "Chief Operations Officer",
    company: "Leading Manufacturing Firm",
  },
  {
    quote: "The governance framework they built for us was instrumental in our successful IPO preparation. Clear, thorough, and impactful.",
    author: "Board Chairman",
    company: "Technology Startup",
  },
  {
    quote: "Their AI-powered diagnostic tool gave us insights that traditional consulting firms took months to deliver. Consolve did it in days.",
    author: "CEO",
    company: "Regional Healthcare Provider",
  },
];

const CASE_STUDIES = [
  {
    industry: "Manufacturing",
    challenge: "Fragmented operations across 12 facilities leading to 25% cost overruns.",
    solution: "End-to-end operational restructuring with standardized processes and KPI frameworks.",
    result: "22% cost reduction within 8 months. Cycle time improved by 40%.",
  },
  {
    industry: "Financial Services",
    challenge: "Non-compliant governance structure posing regulatory risk.",
    solution: "Complete governance overhaul with board advisory and compliance frameworks.",
    result: "100% regulatory compliance achieved. Board effectiveness score increased by 60%.",
  },
  {
    industry: "Technology",
    challenge: "Rapid growth with no scalable organizational structure.",
    solution: "Designed scalable org chart, defined roles, and implemented reporting systems.",
    result: "Headcount grew 3x without operational friction. Employee satisfaction up 45%.",
  },
];

export default function Clients() {
  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-44 md:pb-28">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-4">
              Our Clients
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight mb-8 max-w-3xl">
              Trusted Across Industries
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              We maintain strict client confidentiality. Here's a look at the industries
              we serve and the impact we create.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Industries */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-2xl font-semibold text-foreground mb-8">Industries We Serve</h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {INDUSTRIES.map((ind, i) => (
              <AnimatedSection key={i} delay={i * 50}>
                <div className="p-5 rounded-xl border border-border bg-card text-center hover:border-primary/30 transition-all duration-300">
                  <p className="text-sm font-medium text-foreground">{ind}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-4">
              Client Testimonials
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-16">
              What Our Clients Say
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="bg-white/5 rounded-2xl p-8 h-full flex flex-col">
                  <Quote className="w-8 h-8 text-primary/40 mb-4" />
                  <p className="text-white/70 text-sm leading-relaxed flex-1 mb-6">"{t.quote}"</p>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.author}</p>
                    <p className="text-white/40 text-xs">{t.company}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-28 md:py-40">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-4">
              Case Studies
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-16 max-w-2xl">
              Measurable Results, Real Impact
            </h2>
          </AnimatedSection>

          <div className="space-y-8">
            {CASE_STUDIES.map((cs, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="border border-border rounded-2xl bg-card p-8 md:p-10">
                  <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full mb-6">
                    {cs.industry}
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                        Challenge
                      </p>
                      <p className="text-sm text-foreground leading-relaxed">{cs.challenge}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                        Solution
                      </p>
                      <p className="text-sm text-foreground leading-relaxed">{cs.solution}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                        Result
                      </p>
                      <p className="text-sm text-primary font-semibold leading-relaxed">{cs.result}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={300}>
            <div className="mt-16 text-center">
              <Link
                to="/assessment"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                See What We Can Do for You
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}