import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Target, Users, Scale, Settings, Megaphone, DollarSign, Gavel, Rocket, Lightbulb } from "lucide-react";
import { base44 } from "@/api/base44Client";
import AnimatedSection from "../components/AnimatedSection";
import { useLanguage } from "../lib/useLanguage";
import t from "../lib/translations";
import { SERVICES_FALLBACK } from "../lib/servicesData";

const ICONS = { Target, Users, Scale, Settings, Megaphone, DollarSign, Gavel, Rocket, Lightbulb };

function normalize(rows) {
  return (rows || []).map((r) => ({
    icon: ICONS[r.icon] || Target,
    nameEn: r.name_en || "",
    nameAr: r.name_ar || "",
    goalEn: r.goal_en || "",
    goalAr: r.goal_ar || "",
    subEn: Array.isArray(r.sub_services_en) ? r.sub_services_en : [],
    subAr: Array.isArray(r.sub_services_ar) ? r.sub_services_ar : [],
  }));
}

export default function Services() {
  const { lang, dir, isAr } = useLanguage();
  const tx = t[lang];

  const [catalogue, setCatalogue] = useState(() => normalize(SERVICES_FALLBACK));

  useEffect(() => {
    let cancelled = false;
    base44.entities.Service.list("display_order", 200)
      .then((rows) => {
        if (cancelled) return;
        const active = (rows || []).filter((r) => r.is_active !== false);
        if (active.length > 0) setCatalogue(normalize(active));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return (
    <div dir={dir}>
      <section className="pt-32 pb-20 md:pt-44 md:pb-28">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-semibold text-sm md:text-base uppercase tracking-[0.2em] mb-4">{tx.services_label}</p>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight mb-8 max-w-3xl">{tx.services_h1}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">{tx.services_sub}</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-4">
            {catalogue.map((service, i) => (
              <AnimatedSection key={i} delay={i * 60}>
                <div className="group border border-border rounded-2xl bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-500 overflow-hidden">
                  <div className="p-8 md:p-10">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <service.icon className="w-7 h-7 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">{isAr ? service.nameAr : service.nameEn}</h3>
                        <p className="text-primary font-medium leading-relaxed mb-6">
                          <span className="font-bold">{isAr ? "الهدف: " : "Goal: "}</span>
                          {isAr ? service.goalAr : service.goalEn}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
                          {(isAr ? service.subAr : service.subEn).map((sub, j) => (
                            <div key={j} className="flex items-start gap-2.5">
                              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                              <span className="text-sm text-foreground leading-snug">{sub}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={100}>
            <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-8 md:p-10">
              <h3 className="text-lg font-bold text-foreground mb-3">{isAr ? "منظومة متكاملة" : "An Integrated System"}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-3xl">
                {isAr
                  ? "تُوظَّف هذه المحاور التسعة معًا أو منفصلة، وتُبنى بما يتناسب مع طبيعة الكيان ومستوى نضجه الإداري، من تشخيص الواقع إلى تمكين الفريق من تشغيل الأنظمة بنفسه."
                  : "These nine pillars can be deployed together or separately, built to match each organization's nature and level of managerial maturity — from diagnosing the current reality to empowering the team to run the systems on its own."}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-28 md:py-40 bg-secondary">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6 max-w-3xl mx-auto">{tx.svc_not_sure_h2}</h2>
            <p className="text-lg text-white/60 mb-5 max-w-xl mx-auto">{tx.svc_not_sure_p}</p>
            <p className="text-xs md:text-sm text-white/35 leading-relaxed mb-10 max-w-lg mx-auto">{tx.svc_not_sure_note}</p>
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