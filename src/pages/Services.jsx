import { Link } from "react-router-dom";
import { ArrowRight, Target, Users, Scale, Settings, Megaphone, DollarSign, Gavel, Rocket, Lightbulb } from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";
import { useLanguage } from "../lib/useLanguage";
import t from "../lib/translations";

// Services catalogue — content taken verbatim from the Consolve company
// profile 2026 (كتالوج الخدمات): 9 services, each with its goal and sub-services.
const CATALOGUE = [
  {
    icon: Target,
    nameAr: "الاستشارات الاستراتيجية",
    nameEn: "Strategy Consulting",
    goalAr: "تحديد الاتجاه الاستراتيجي، ودعم النمو، وتعزيز المكانة التنافسية للكيان.",
    goalEn: "Set the strategic direction, support growth, and strengthen the organization's competitive position.",
    subAr: ["تطوير الاستراتيجية المؤسسية", "بناء استراتيجيات وحدات الأعمال", "إعداد استراتيجيات دخول الأسواق والتوسع", "التخطيط الاستراتيجي وبناء خرائط التنفيذ", "التحليل السوقي والمقارنات التنافسية", "صياغة الرؤية والرسالة والقيم", "استراتيجيات التحول الرقمي والابتكار", "استراتيجيات الاستدامة والمسؤولية"],
    subEn: ["Corporate strategy development", "Business unit strategy building", "Market entry and expansion strategies", "Strategic planning and execution roadmaps", "Market analysis and competitive benchmarking", "Vision, mission, and values formulation", "Digital transformation and innovation strategies", "Sustainability and responsibility strategies"],
  },
  {
    icon: Users,
    nameAr: "الاستشارات الإدارية",
    nameEn: "Management Consulting",
    goalAr: "رفع كفاءة المنظمة، وتعزيز مواءمة القيادة، وتحسين فاعلية الإدارة.",
    goalEn: "Raise organizational efficiency, strengthen leadership alignment, and improve management effectiveness.",
    subAr: ["تصميم الهيكل التنظيمي وإعادة الهيكلة", "بناء أنظمة إدارة الأداء ومؤشرات القياس", "إدارة التغيير والتحول", "الاستشارات القيادية وتطوير التنفيذيين", "تطوير السياسات والإجراءات", "بناء أطر ومنهجيات اتخاذ القرار"],
    subEn: ["Organizational structure design and restructuring", "Performance management systems and KPIs", "Change and transformation management", "Leadership advisory and executive development", "Policy and procedure development", "Decision-making frameworks and methodologies"],
  },
  {
    icon: Scale,
    nameAr: "الحوكمة والمخاطر والامتثال",
    nameEn: "Governance, Risk & Compliance",
    goalAr: "تعزيز الحوكمة والرقابة والامتثال، وتقليل المخاطر المؤسسية.",
    goalEn: "Strengthen governance, control, and compliance, and reduce enterprise risks.",
    subAr: ["تصميم أطر الحوكمة", "إدارة المخاطر المؤسسية وسجلات المخاطر", "التدقيق الداخلي وتقييم الضوابط", "تصميم برامج الامتثال", "إدارة مخاطر الاحتيال", "استمرارية الأعمال وإدارة الأزمات", "الاستدامة وإعداد تقاريرها"],
    subEn: ["Governance framework design", "Enterprise risk management and risk registers", "Internal audit and controls assessment", "Compliance program design", "Fraud risk management", "Business continuity and crisis management", "Sustainability and its reporting"],
  },
  {
    icon: Settings,
    nameAr: "استشارات إدارة العمليات",
    nameEn: "Operations Management Consulting",
    goalAr: "تحسين الكفاءة التشغيلية، ورفع الإنتاجية، وتقليل الهدر والتكاليف.",
    goalEn: "Improve operational efficiency, raise productivity, and reduce waste and costs.",
    subAr: ["تصميم نموذج التشغيل", "تحليل العمليات وإعادة هندستها", "تطبيق منهجيات لين وسيجما", "تحسين سلاسل الإمداد", "تحسين المشتريات", "برامج خفض التكاليف", "تحسين تقديم الخدمات", "أنظمة إدارة الجودة"],
    subEn: ["Operating model design", "Process analysis and re-engineering", "Lean and Six Sigma implementation", "Supply chain optimization", "Procurement optimization", "Cost reduction programs", "Service delivery improvement", "Quality management systems"],
  },
  {
    icon: Megaphone,
    nameAr: "الاستشارات التسويقية",
    nameEn: "Marketing Consulting",
    goalAr: "دعم نمو العلامة التجارية، وتعزيز اكتساب العملاء، وتحسين الحضور السوقي.",
    goalEn: "Support brand growth, strengthen customer acquisition, and improve market presence.",
    subAr: ["إعداد استراتيجية وخطة التسويق", "بناء وتموضع العلامة التجارية", "استراتيجيات التسويق الرقمي", "تصميم تجربة العميل", "أبحاث السوق وتحليل العملاء", "استراتيجيات التسعير", "إدارة الحملات وتحسين الأداء", "استراتيجيات إدارة علاقات العملاء وتطبيقها"],
    subEn: ["Marketing strategy and plan development", "Brand building and positioning", "Digital marketing strategies", "Customer experience design", "Market research and customer analysis", "Pricing strategies", "Campaign management and performance optimization", "CRM strategies and implementation"],
  },
  {
    icon: DollarSign,
    nameAr: "الاستشارات المالية",
    nameEn: "Financial Advisory",
    goalAr: "تعزيز الوضع المالي، ودعم اتخاذ القرار، وتحسين الكفاءة المالية.",
    goalEn: "Strengthen the financial position, support decision-making, and improve financial efficiency.",
    subAr: ["التخطيط والتحليل المالي", "إعداد الميزانيات والتوقعات", "تحليل التكاليف والربحية", "النمذجة المالية والتقييم", "دراسات الجدوى", "هيكلة رأس المال وجذب التمويل", "الاستشارات في الاندماجات والاستحواذات", "التأهيل للطرح العام"],
    subEn: ["Financial planning and analysis", "Budgeting and forecasting", "Cost and profitability analysis", "Financial modeling and valuation", "Feasibility studies", "Capital structuring and fundraising", "Mergers and acquisitions advisory", "IPO readiness"],
  },
  {
    icon: Gavel,
    nameAr: "الاستشارات القانونية",
    nameEn: "Legal Consulting",
    goalAr: "حماية مصالح الشركة، وضمان الامتثال القانوني، وتقليل المخاطر النظامية.",
    goalEn: "Protect the company's interests, ensure legal compliance, and reduce regulatory risks.",
    subAr: ["تأسيس وهيكلة الشركات", "صياغة العقود ومراجعتها", "الامتثال للأنظمة والتشريعات", "الأطر القانونية للحوكمة", "استشارات نظام العمل", "دعم حل النزاعات", "حماية الملكية الفكرية", "الاستشارات في الأنظمة التجارية"],
    subEn: ["Company formation and structuring", "Contract drafting and review", "Regulatory and legislative compliance", "Legal governance frameworks", "Labor law advisory", "Dispute resolution support", "Intellectual property protection", "Commercial regulations advisory"],
  },
  {
    icon: Rocket,
    nameAr: "تطوير الأعمال",
    nameEn: "Business Development",
    goalAr: "فتح فرص النمو، وتوسيع الشراكات، وتعزيز التوسع التجاري.",
    goalEn: "Open growth opportunities, expand partnerships, and strengthen commercial expansion.",
    subAr: ["استراتيجيات النمو ونماذج الإيرادات", "بناء الشراكات والتحالفات", "استراتيجيات المبيعات وتحسين القنوات", "استراتيجيات دخول السوق", "دعم إطلاق المشاريع الجديدة", "استراتيجيات اكتساب العملاء", "إعداد العروض التجارية والتقديمية"],
    subEn: ["Growth strategies and revenue models", "Partnership and alliance building", "Sales strategies and channel optimization", "Market entry strategies", "New venture launch support", "Customer acquisition strategies", "Commercial proposals and presentations"],
  },
  {
    icon: Lightbulb,
    nameAr: "البحث والتطوير والابتكار",
    nameEn: "R&D and Innovation",
    goalAr: "تعزيز الابتكار، ودعم تطوير الحلول، ورفع الجاهزية للمستقبل.",
    goalEn: "Foster innovation, support solution development, and raise future readiness.",
    subAr: ["استراتيجيات الابتكار وأطره", "دعم تطوير المنتجات", "تصميم برامج البحث والتطوير", "استكشاف التقنيات وتقييمها", "ورش التفكير التصميمي", "تطوير النماذج الأولية القابلة للإطلاق", "مبادرات التحول الرقمي", "الابتكار في الذكاء الاصطناعي والبيانات"],
    subEn: ["Innovation strategies and frameworks", "Product development support", "R&D program design", "Technology scouting and assessment", "Design thinking workshops", "Launch-ready prototype development", "Digital transformation initiatives", "AI and data innovation"],
  },
];

export default function Services() {
  const { lang, dir, isAr } = useLanguage();
  const tx = t[lang];

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
            {CATALOGUE.map((service, i) => (
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