import { Link } from "react-router-dom";
import { ArrowRight, Settings, Users, Scale, Gavel, DollarSign, Megaphone, Rocket } from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";
import { useLanguage } from "../lib/useLanguage";
import t from "../lib/translations";

export default function Services() {
  const { lang, dir } = useLanguage();
  const tx = t[lang];

  const SERVICES = [
    { icon: Settings, title: tx.s1_title, desc: tx.s1_desc, metrics: [tx.s1_m1, tx.s1_m2, tx.s1_m3] },
    { icon: Users, title: tx.s2_title, desc: tx.s2_desc, metrics: [tx.s2_m1, tx.s2_m2, tx.s2_m3] },
    { icon: Scale, title: tx.s3_title, desc: tx.s3_desc, metrics: [tx.s3_m1, tx.s3_m2, tx.s3_m3] },
    { icon: Gavel, title: tx.s4_title, desc: tx.s4_desc, metrics: [tx.s4_m1, tx.s4_m2, tx.s4_m3] },
    { icon: DollarSign, title: tx.s5_title, desc: tx.s5_desc, metrics: [tx.s5_m1, tx.s5_m2, tx.s5_m3] },
    { icon: Megaphone, title: tx.s6_title, desc: tx.s6_desc, metrics: [tx.s6_m1, tx.s6_m2, tx.s6_m3] },
    { icon: Rocket, title: tx.s7_title, desc: tx.s7_desc, metrics: [tx.s7_m1, tx.s7_m2, tx.s7_m3] },
  ];

  return (
    <div dir={dir}>
      <section className="pt-32 pb-20 md:pt-44 md:pb-28">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-4">{tx.services_label}</p>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight mb-8 max-w-3xl">{tx.services_h1}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">{tx.services_sub}</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="rounded-2xl overflow-hidden">
              <img
                src="https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/3db6d8dc6_generated_3c67c7a0.png"
                alt="Precision watch movement"
                className="w-full h-48 md:h-72 object-cover"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

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
                        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">{service.title}</h3>
                        <p className="text-muted-foreground leading-relaxed mb-6">{service.desc}</p>
                        <div className="flex flex-wrap gap-3">
                          {service.metrics.map((m, j) => (
                            <span key={j} className="text-xs font-medium px-3 py-1.5 rounded-full bg-muted text-muted-foreground">{m}</span>
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

      <section className="py-28 md:py-40 bg-secondary">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6 max-w-3xl mx-auto">{tx.svc_not_sure_h2}</h2>
            <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto">{tx.svc_not_sure_p}</p>
            <Link to="/assessment" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity">
              {tx.svc_cta}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}