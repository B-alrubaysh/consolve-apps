import { Link } from "react-router-dom";
import { ArrowRight, Shield, Brain, Lock, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection from "../components/AnimatedSection";
import HomeAssessment from "../components/HomeAssessment";
import { useLanguage } from "../lib/useLanguage";
import t from "../lib/translations";

export default function Home() {
  const { lang, dir } = useLanguage();
  const tx = t[lang];

  const WHY_ITEMS = [
    { icon: Brain, title: tx.why_1_title, desc: tx.why_1_desc },
    { icon: BarChart3, title: tx.why_2_title, desc: tx.why_2_desc },
    { icon: Lock, title: tx.why_3_title, desc: tx.why_3_desc },
    { icon: Shield, title: tx.why_4_title, desc: tx.why_4_desc },
  ];

  const STEPS = [
    { num: tx.how_1_num, title: tx.how_1_title, desc: tx.how_1_desc },
    { num: tx.how_2_num, title: tx.how_2_title, desc: tx.how_2_desc },
    { num: tx.how_3_num, title: tx.how_3_title, desc: tx.how_3_desc },
    { num: tx.how_4_num, title: tx.how_4_title, desc: tx.how_4_desc },
  ];

  return (
    <div dir={dir}>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden -mt-20">
        {/* Animated gradient background image */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.img
            src="https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/ee93949df_Gemini_Generated_Image_ikoo9bikoo9bikoo.png"
            alt="Hero background"
            className="w-full h-full object-cover"
            animate={{
              scale: [1, 1.04, 1.02, 1.05, 1],
              x: [0, 8, -6, 4, 0],
              y: [0, -6, 4, -3, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <div className="absolute inset-0 bg-secondary/30" />
        </motion.div>
        {/* Large logo watermark at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <img
            src="https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/dfa25a98b_Untitleddesign2.png"
            alt="Consolve"
            className="w-full object-contain"
          />
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-white/30" />
        </div>
      </section>

      {/* Embedded Assessment */}
      <HomeAssessment />

      {/* Why Consolve */}
      <section className="py-28 md:py-40">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-4">{tx.why_label}</p>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-4 max-w-2xl">{tx.why_h2}</h2>
            <p className="text-muted-foreground text-lg max-w-xl mb-16">{tx.why_sub}</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_ITEMS.map((item, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}
                  transition={{ duration: 0.3 }}
                  className="group p-8 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors duration-300 cursor-default"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-28 md:py-40 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-4">{tx.how_label}</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-16 max-w-2xl">{tx.how_h2}</h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="relative">
                  <span className="text-6xl font-bold text-white/5 absolute -top-4 -left-2">{step.num}</span>
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
              <Link to="/assessment" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity">
                {tx.how_cta}
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
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-6 max-w-3xl mx-auto">{tx.cta_h2}</h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">{tx.cta_sub}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/assessment" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity">
                {tx.cta_btn1}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 border border-border text-foreground px-8 py-4 rounded-full font-semibold text-sm hover:bg-muted transition-colors">
                {tx.cta_btn2}
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}