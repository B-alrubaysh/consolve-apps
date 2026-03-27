import { Link } from "react-router-dom";
import { ArrowRight, Shield, Brain, Lock, BarChart3 } from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";

const WHY_ITEMS = [
  { icon: Brain, title: "Tailored Solutions", desc: "Custom strategies designed for your unique business needs and challenges." },
  { icon: BarChart3, title: "Multi-disciplinary Expertise", desc: "From operations to governance, finance to marketing — all under one roof." },
  { icon: Lock, title: "Confidential & Secure", desc: "Your data and business intelligence stay protected at every step." },
  { icon: Shield, title: "Data-Driven Approach", desc: "AI-powered insights combined with deep industry expertise." },
];

const STEPS = [
  { num: "01", title: "Tell Us About Your Business", desc: "Share your company details, industry, and key challenges." },
  { num: "02", title: "Complete a Smart Assessment", desc: "Our AI-powered questionnaire adapts to your specific context." },
  { num: "03", title: "Get a Clear Diagnosis", desc: "Receive a detailed analysis of root causes and risk factors." },
  { num: "04", title: "Receive Actionable Solutions", desc: "Get matched with the right services and a clear path forward." },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/68693ae94_generated_41e4811d.png"
            alt="Modern boardroom overlooking city at dawn"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/70 to-secondary/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 md:py-0">
          <div className="max-w-2xl">
            <AnimatedSection>
              <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-6">
                Built to Solve
              </p>
            </AnimatedSection>
            <AnimatedSection delay={100}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
                Transform Your Business with Clarity, Strategy, and Precision
              </h1>
            </AnimatedSection>
            <AnimatedSection delay={200}>
              <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-xl">
                From operations to governance, Consolve delivers tailored solutions
                designed for your unique business needs.
              </p>
            </AnimatedSection>
            <AnimatedSection delay={300}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/assessment"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  Start Your Smart Assessment
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 rounded-full font-semibold text-sm hover:bg-white/10 transition-colors"
                >
                  Explore Our Services
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-white/30" />
        </div>
      </section>

      {/* Why Consolve */}
      <section className="py-28 md:py-40">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-4">
              Why Consolve
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-4 max-w-2xl">
              Precision in Every Pivot
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mb-16">
              We combine deep domain expertise with AI-powered analytics to deliver
              results that matter.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_ITEMS.map((item, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="group p-8 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-500">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-28 md:py-40 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-4">
              How It Works
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-16 max-w-2xl">
              From Challenge to Clarity in Four Steps
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="relative">
                  <span className="text-6xl font-bold text-white/5 absolute -top-4 -left-2">
                    {step.num}
                  </span>
                  <div className="relative pt-8">
                    <div className="w-8 h-0.5 bg-primary mb-6" />
                    <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={400}>
            <div className="mt-16 text-center">
              <Link
                to="/assessment"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Begin Your Assessment
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 md:py-40">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-6 max-w-3xl mx-auto">
              Ready to Unlock Your Business Potential?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Take our AI-powered assessment and receive a comprehensive diagnosis
              of your business in minutes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/assessment"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Start Your Smart Assessment
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 border border-border text-foreground px-8 py-4 rounded-full font-semibold text-sm hover:bg-muted transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}