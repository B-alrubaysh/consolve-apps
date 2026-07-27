import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Quote } from "lucide-react";
import { base44 } from "@/api/base44Client";
import AnimatedSection from "../components/AnimatedSection";
import { useLanguage } from "../lib/useLanguage";
import t from "../lib/translations";
import { INDUSTRIES_FALLBACK, TESTIMONIALS_FALLBACK, CASE_STUDIES_FALLBACK } from "../lib/clientsData";

export default function Clients() {
  const { lang, dir } = useLanguage();
  const tx = t[lang];
  const isAr = lang === "ar";

  const [industryRows, setIndustryRows] = useState(INDUSTRIES_FALLBACK);
  const [testimonialRows, setTestimonialRows] = useState(TESTIMONIALS_FALLBACK);
  const [caseRows, setCaseRows] = useState(CASE_STUDIES_FALLBACK);

  useEffect(() => {
    let cancelled = false;
    const onlyActive = (rows) => (rows || []).filter((r) => r.is_active !== false);
    Promise.all([
      base44.entities.Industry.list("display_order", 200).catch(() => []),
      base44.entities.Testimonial.list("display_order", 200).catch(() => []),
      base44.entities.CaseStudy.list("display_order", 200).catch(() => []),
    ]).then(([inds, tes, cs]) => {
      if (cancelled) return;
      const a = onlyActive(inds), b = onlyActive(tes), c = onlyActive(cs);
      if (a.length > 0) setIndustryRows(a);
      if (b.length > 0) setTestimonialRows(b);
      if (c.length > 0) setCaseRows(c);
    });
    return () => { cancelled = true; };
  }, []);

  const pickL = (ar, en) => (isAr ? (ar || en) : (en || ar)) || "";

  const industries = industryRows.map((r) => pickL(r.name_ar, r.name_en));
  const TESTIMONIALS = testimonialRows.map((r) => ({
    quote: pickL(r.quote_ar, r.quote_en),
    author: pickL(r.author_ar, r.author_en),
    company: pickL(r.company_ar, r.company_en),
  }));
  const CASE_STUDIES = caseRows.map((r) => ({
    industry: pickL(r.industry_ar, r.industry_en),
    challenge: pickL(r.challenge_ar, r.challenge_en),
    solution: pickL(r.solution_ar, r.solution_en),
    result: pickL(r.result_ar, r.result_en),
  }));

  return (
    <div dir={dir}>
      <section className="pt-32 pb-20 md:pt-44 md:pb-28">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-4">{tx.clients_label}</p>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight mb-8 max-w-3xl">{tx.clients_h1}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">{tx.clients_sub}</p>
          </AnimatedSection>
        </div>
      </section>

      {industries.length > 0 && (
      <section className="pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-2xl font-semibold text-foreground mb-8">{tx.clients_industries_h}</h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {industries.map((ind, i) => (
              <AnimatedSection key={i} delay={i * 50}>
                <div className="p-5 rounded-xl border border-border bg-card text-center hover:border-primary/30 transition-all duration-300">
                  <p className="text-sm font-medium text-foreground">{ind}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
      )}

      {TESTIMONIALS.length > 0 && (
      <section className="py-20 md:py-28 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-4">{tx.clients_testimonials_label}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-16">{tx.clients_testimonials_h}</h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((te, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="bg-white/5 rounded-2xl p-8 h-full flex flex-col">
                  <Quote className="w-8 h-8 text-primary/40 mb-4" />
                  <p className="text-white/70 text-sm leading-relaxed flex-1 mb-6">"{te.quote}"</p>
                  <div>
                    <p className="text-white font-semibold text-sm">{te.author}</p>
                    <p className="text-white/40 text-xs">{te.company}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
      )}

      {CASE_STUDIES.length > 0 && (
      <section className="py-28 md:py-40">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-4">{tx.clients_cases_label}</p>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-16 max-w-2xl">{tx.clients_cases_h}</h2>
          </AnimatedSection>
          <div className="space-y-8">
            {CASE_STUDIES.map((cs, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="border border-border rounded-2xl bg-card p-8 md:p-10">
                  <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full mb-6">{cs.industry}</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">{tx.cs_challenge}</p>
                      <p className="text-sm text-foreground leading-relaxed">{cs.challenge}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">{tx.cs_solution}</p>
                      <p className="text-sm text-foreground leading-relaxed">{cs.solution}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">{tx.cs_result}</p>
                      <p className="text-sm text-primary font-semibold leading-relaxed">{cs.result}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
      )}

      <section className="pb-28 md:pb-40">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection delay={300}>
            <div className="text-center">
              <Link to="/assessment" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity">
                {tx.clients_cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}