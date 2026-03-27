import { Link } from "react-router-dom";
import { ArrowRight, Settings, Users, Scale, Gavel, DollarSign, Megaphone, Rocket } from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";

const SERVICES = [
  {
    icon: Settings,
    title: "Operational Excellence",
    desc: "Optimize processes, reduce inefficiencies, and improve performance across your entire value chain.",
    metrics: ["Process efficiency +40%", "Cost reduction 15-25%", "Cycle time optimization"],
  },
  {
    icon: Users,
    title: "Organizational Structuring",
    desc: "Design scalable roles, responsibilities, and reporting lines that grow with your business.",
    metrics: ["Clear accountability", "Scalable hierarchy", "Role optimization"],
  },
  {
    icon: Scale,
    title: "Governance & Compliance",
    desc: "Build robust governance frameworks that ensure transparency, accountability, and regulatory compliance.",
    metrics: ["Risk mitigation", "Board effectiveness", "Policy frameworks"],
  },
  {
    icon: Gavel,
    title: "Legal Advisory",
    desc: "Ensure compliance with laws and regulations while protecting your business interests.",
    metrics: ["Regulatory compliance", "Contract optimization", "Risk assessment"],
  },
  {
    icon: DollarSign,
    title: "Financial Advisory",
    desc: "Improve financial planning, cost control, and profitability through data-driven strategies.",
    metrics: ["Cash flow optimization", "Budget accuracy +30%", "Profitability analysis"],
  },
  {
    icon: Megaphone,
    title: "Marketing Strategy",
    desc: "Position your brand, grow market reach, and drive measurable return on investment.",
    metrics: ["Brand positioning", "Lead generation +50%", "ROI measurement"],
  },
  {
    icon: Rocket,
    title: "Business Transformation",
    desc: "End-to-end strategy for growth and scale — from vision to execution.",
    metrics: ["Digital transformation", "Growth roadmaps", "Change management"],
  },
];

export default function Services() {
  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-44 md:pb-28">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-4">
              Our Services
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight mb-8 max-w-3xl">
              Comprehensive Solutions for Complex Challenges
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Seven practice areas working in concert to deliver holistic business transformation.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Image */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="rounded-2xl overflow-hidden">
              <img
                src="/__generating__/img_b6d9812d931a.png"
                alt="Precision mechanical watch movement representing operational excellence"
                className="w-full h-48 md:h-72 object-cover"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Services Accordion */}
      <section className="pb-28 md:pb-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-4">
            {SERVICES.map((service, i) => (
              <AnimatedSection key={i} delay={i * 80}>
                <div className="group border border-border rounded-2xl bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-500 overflow-hidden">
                  <div className="p-8 md:p-10">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <service.icon className="w-7 h-7 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">
                          {service.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                          {service.desc}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {service.metrics.map((m, j) => (
                            <span
                              key={j}
                              className="text-xs font-medium px-3 py-1.5 rounded-full bg-muted text-muted-foreground"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 md:py-40 bg-secondary">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6 max-w-3xl mx-auto">
              Not Sure Which Service You Need?
            </h2>
            <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto">
              Our AI assessment tool will analyze your business and recommend the right
              services for your specific situation.
            </p>
            <Link
              to="/assessment"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Take the Assessment
              <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}