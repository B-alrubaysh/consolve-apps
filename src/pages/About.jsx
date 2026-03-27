import AnimatedSection from "../components/AnimatedSection";
import { Eye, Lightbulb, Wrench, TrendingUp } from "lucide-react";

const VALUES = [
  { icon: Eye, title: "Confidentiality First", desc: "We protect your data and business intelligence with the highest standards of security and discretion." },
  { icon: Lightbulb, title: "Clarity Over Complexity", desc: "We cut through noise to deliver clear, understandable insights that drive informed decisions." },
  { icon: Wrench, title: "Practical Solutions", desc: "Every recommendation is actionable, measurable, and designed for real-world implementation." },
  { icon: TrendingUp, title: "Long-term Impact", desc: "We build sustainable frameworks that continue delivering value long after our engagement ends." },
];

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-44 md:pb-28">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-4">
              About Consolve
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight mb-8 max-w-3xl">
              Every Business Has Untapped Potential
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mb-8">
              At Consolve, our mission is to help organizations identify inefficiencies,
              solve critical challenges, and build scalable structures that drive lasting growth.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Our expertise spans operations, management, governance, legal, finance, and marketing —
              delivering holistic solutions that address every facet of your business.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Image */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="rounded-2xl overflow-hidden">
              <img
                src="https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/1986b039b_generated_cca2089a.png"
                alt="Minimalist modern library space for thought"
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 md:py-28 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-4">
                Our Mission
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-6">
                Transforming Complexity Into Clarity
              </h2>
              <p className="text-white/60 text-lg leading-relaxed">
                We believe that no business problem is too complex when approached with the
                right methodology. Our multi-disciplinary team combines deep industry knowledge
                with advanced AI analytics to uncover hidden patterns, identify root causes,
                and chart clear paths forward.
              </p>
            </AnimatedSection>
            <AnimatedSection delay={200}>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-2xl p-8 text-center">
                  <p className="text-4xl font-bold text-primary mb-2">150+</p>
                  <p className="text-sm text-white/50">Clients Served</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-8 text-center">
                  <p className="text-4xl font-bold text-primary mb-2">6</p>
                  <p className="text-sm text-white/50">Practice Areas</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-8 text-center">
                  <p className="text-4xl font-bold text-primary mb-2">95%</p>
                  <p className="text-sm text-white/50">Client Satisfaction</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-8 text-center">
                  <p className="text-4xl font-bold text-primary mb-2">12+</p>
                  <p className="text-sm text-white/50">Industries</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-28 md:py-40">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-4">
              Core Values
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-16 max-w-2xl">
              Principles That Guide Every Engagement
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {VALUES.map((v, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="flex gap-6 p-8 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-500">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <v.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{v.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}