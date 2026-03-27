import AnimatedSection from "../components/AnimatedSection";
import { Eye, Lightbulb, Wrench, TrendingUp } from "lucide-react";
import { useLanguage } from "../lib/useLanguage";
import t from "../lib/translations";

export default function About() {
  const { lang, dir } = useLanguage();
  const tx = t[lang];

  const VALUES = [
    { icon: Eye, title: tx.val_1_title, desc: tx.val_1_desc },
    { icon: Lightbulb, title: tx.val_2_title, desc: tx.val_2_desc },
    { icon: Wrench, title: tx.val_3_title, desc: tx.val_3_desc },
    { icon: TrendingUp, title: tx.val_4_title, desc: tx.val_4_desc },
  ];

  return (
    <div dir={dir}>
      <section className="pt-32 pb-20 md:pt-44 md:pb-28">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-4">{tx.about_label}</p>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight mb-8 max-w-3xl">{tx.about_h1}</h1>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mb-8">{tx.about_p1}</p>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">{tx.about_p2}</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="rounded-2xl overflow-hidden">
              <img
                src="https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/1986b039b_generated_cca2089a.png"
                alt="Minimalist modern library"
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-4">{tx.about_mission_label}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-6">{tx.about_mission_h2}</h2>
              <p className="text-white/60 text-lg leading-relaxed">{tx.about_mission_p}</p>
            </AnimatedSection>
            <AnimatedSection delay={200}>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { n: tx.about_stat1_n, l: tx.about_stat1_l },
                  { n: tx.about_stat2_n, l: tx.about_stat2_l },
                  { n: tx.about_stat3_n, l: tx.about_stat3_l },
                  { n: tx.about_stat4_n, l: tx.about_stat4_l },
                ].map((s, i) => (
                  <div key={i} className="bg-white/5 rounded-2xl p-8 text-center">
                    <p className="text-4xl font-bold text-primary mb-2">{s.n}</p>
                    <p className="text-sm text-white/50">{s.l}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-28 md:py-40">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-4">{tx.about_values_label}</p>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-16 max-w-2xl">{tx.about_values_h2}</h2>
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