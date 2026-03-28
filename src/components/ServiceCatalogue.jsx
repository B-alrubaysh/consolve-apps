import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../lib/useLanguage";

const SERVICES = [
  {
    id: "strategy",
    nameEn: "Strategy Consulting",
    nameAr: "الاستشارات الاستراتيجية",
    goalEn: "Define direction, growth, and competitive positioning",
    goalAr: "تحديد الاتجاه والنمو والمكانة التنافسية",
    subEn: [
      "Corporate Strategy Development",
      "Business Unit Strategy",
      "Market Entry & Expansion Strategy",
      "Strategic Planning & Execution Roadmaps",
      "Competitive Benchmarking & Market Analysis",
      "Vision, Mission & Value Definition",
      "Digital & Innovation Strategy",
      "ESG & Sustainability Strategy",
    ],
    subAr: [
      "تطوير الاستراتيجية المؤسسية",
      "استراتيجية وحدات الأعمال",
      "استراتيجيات دخول الأسواق",
      "التخطيط الاستراتيجي",
      "التحليل السوقي",
      "صياغة الرؤية والرسالة والقيم",
      "التحول الرقمي والابتكار",
      "الاستدامة",
    ],
  },
  {
    id: "management",
    nameEn: "Management Consulting",
    nameAr: "الاستشارات الإدارية",
    goalEn: "Improve organizational effectiveness",
    goalAr: "رفع كفاءة المنظمة",
    subEn: [
      "Organizational Design & Restructuring",
      "Performance Management Systems",
      "Change Management & Transformation",
      "Leadership Advisory & Executive Coaching",
      "Policy & Procedure Development",
      "Decision-Making Frameworks",
    ],
    subAr: [
      "الهيكل التنظيمي وإعادة الهيكلة",
      "إدارة الأداء",
      "إدارة التغيير والتحول",
      "تطوير القيادات والتوجيه التنفيذي",
      "السياسات والإجراءات",
      "أطر اتخاذ القرار",
    ],
  },
  {
    id: "grc",
    nameEn: "GRC (Governance, Risk & Compliance)",
    nameAr: "الحوكمة والمخاطر والامتثال",
    goalEn: "Ensure compliance and risk control",
    goalAr: "ضمان الامتثال وتقليل المخاطر",
    subEn: [
      "Governance Framework Design",
      "Risk Management",
      "Internal Audit & Controls",
      "Compliance Programs",
      "Fraud Risk Management",
      "Business Continuity",
      "ESG Governance",
    ],
    subAr: [
      "أطر الحوكمة",
      "إدارة المخاطر",
      "التدقيق الداخلي والضوابط",
      "برامج الامتثال",
      "مخاطر الاحتيال",
      "استمرارية الأعمال",
      "حوكمة الاستدامة",
    ],
  },
  {
    id: "operations",
    nameEn: "Operations Consulting",
    nameAr: "استشارات العمليات",
    goalEn: "Optimize efficiency and cost",
    goalAr: "تحسين الكفاءة والتكاليف",
    subEn: [
      "Operating Model Design",
      "Process Reengineering",
      "Lean & Six Sigma",
      "Supply Chain Optimization",
      "Procurement Optimization",
      "Cost Reduction Programs",
      "Service Delivery Optimization",
      "Quality Management Systems",
    ],
    subAr: [
      "نموذج التشغيل",
      "إعادة هندسة العمليات",
      "لين وسيجما",
      "سلاسل الإمداد",
      "تحسين المشتريات",
      "برامج خفض التكاليف",
      "تحسين الخدمات",
      "أنظمة الجودة",
    ],
  },
  {
    id: "marketing",
    nameEn: "Marketing Consulting",
    nameAr: "الاستشارات التسويقية",
    goalEn: "Drive brand growth",
    goalAr: "تعزيز نمو العلامة",
    subEn: [
      "Marketing Strategy",
      "Brand Positioning",
      "Digital Marketing",
      "Customer Experience Design",
      "Market Research",
      "Pricing Strategy",
      "Campaign Optimization",
      "CRM Strategy",
    ],
    subAr: [
      "استراتيجية التسويق",
      "تموضع العلامة التجارية",
      "التسويق الرقمي",
      "تصميم تجربة العميل",
      "أبحاث السوق",
      "استراتيجية التسعير",
      "تحسين الحملات",
      "إدارة علاقات العملاء",
    ],
  },
  {
    id: "financial",
    nameEn: "Financial Advisory",
    nameAr: "الاستشارات المالية",
    goalEn: "Strengthen financial decisions",
    goalAr: "دعم القرارات المالية",
    subEn: [
      "FP&A",
      "Budgeting & Forecasting",
      "Cost & Profitability",
      "Financial Modeling",
      "Feasibility Studies",
      "Capital Structuring",
      "M&A Advisory",
      "IPO Readiness",
    ],
    subAr: [
      "التخطيط والتحليل المالي",
      "الميزانيات والتوقعات",
      "التكاليف والربحية",
      "النمذجة المالية",
      "دراسات الجدوى",
      "هيكلة رأس المال",
      "الاندماجات والاستحواذات",
      "الاستعداد للطرح العام",
    ],
  },
  {
    id: "legal",
    nameEn: "Legal Consulting",
    nameAr: "الاستشارات القانونية",
    goalEn: "Ensure legal protection",
    goalAr: "حماية المصالح القانونية",
    subEn: [
      "Corporate Structuring",
      "Contract Drafting",
      "Regulatory Compliance",
      "Governance Legal Frameworks",
      "Labor Law Advisory",
      "Dispute Resolution",
      "Intellectual Property",
      "Commercial Law",
    ],
    subAr: [
      "تأسيس الشركات",
      "صياغة العقود",
      "الامتثال التنظيمي",
      "الأطر القانونية للحوكمة",
      "نظام العمل",
      "حل النزاعات",
      "الملكية الفكرية",
      "القانون التجاري",
    ],
  },
  {
    id: "bizdev",
    nameEn: "Business Development",
    nameAr: "تطوير الأعمال",
    goalEn: "Unlock growth opportunities",
    goalAr: "فتح فرص النمو",
    subEn: [
      "Growth Strategy",
      "Partnerships",
      "Sales Funnel Optimization",
      "Go-To-Market Strategy",
      "New Business Launch",
      "Client Acquisition",
      "Proposal Development",
    ],
    subAr: [
      "استراتيجيات النمو",
      "الشراكات",
      "تحسين مسار المبيعات",
      "دخول السوق",
      "إطلاق مشاريع جديدة",
      "اكتساب العملاء",
      "تطوير العروض",
    ],
  },
  {
    id: "rnd",
    nameEn: "R&D and Innovation",
    nameAr: "البحث والتطوير والابتكار",
    goalEn: "Build future capabilities",
    goalAr: "بناء قدرات مستقبلية",
    subEn: [
      "Innovation Strategy",
      "Product Development",
      "R&D Programs",
      "Technology Scouting",
      "Design Thinking",
      "Prototyping",
      "Digital Transformation",
      "AI & Data Innovation",
    ],
    subAr: [
      "استراتيجيات الابتكار",
      "تطوير المنتجات",
      "برامج البحث والتطوير",
      "استكشاف التقنية",
      "التفكير التصميمي",
      "النماذج الأولية",
      "التحول الرقمي",
      "الذكاء الاصطناعي والبيانات",
    ],
  },
];

export default function ServiceCatalogue() {
  const { lang, dir, isAr } = useLanguage();
  const [activeId, setActiveId] = useState("strategy");

  const active = SERVICES.find((s) => s.id === activeId);
  const subs = isAr ? active.subAr : active.subEn;

  return (
    <section className="py-24 md:py-36 bg-card border-b border-border" dir={dir}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">
            {isAr ? "خدماتنا" : "Services"}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-4 max-w-2xl leading-tight">
            {isAr ? "استكشف مجالاتنا الاستشارية" : "Explore Our Service Capabilities"}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl">
            {isAr
              ? "اختر المجال الاستشاري لعرض الخدمات التفصيلية"
              : "Select a service area to view its detailed capabilities and offerings"}
          </p>
        </div>

        {/* Main split layout */}
        <div className={`flex flex-col ${isAr ? "md:flex-row-reverse" : "md:flex-row"} gap-6 md:gap-10`}>

          {/* Selector — 40% */}
          <div className="md:w-[40%] flex flex-col gap-1">
            {SERVICES.map((s) => {
              const isActive = s.id === activeId;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveId(s.id)}
                  className={`group w-full text-left px-5 py-4 rounded-xl border transition-all duration-150 ${
                    isActive
                      ? "bg-secondary text-secondary-foreground border-secondary"
                      : "bg-transparent text-foreground border-transparent hover:border-border hover:bg-muted/50"
                  }`}
                  dir={dir}
                >
                  <p className={`text-sm font-semibold leading-snug ${isActive ? "text-white" : "text-foreground"}`}>
                    {isAr ? s.nameAr : s.nameEn}
                  </p>
                  <p className={`text-xs mt-0.5 ${isActive ? "text-white/60" : "text-muted-foreground"}`}>
                    {isAr ? s.goalAr : s.goalEn}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Content panel — 60% */}
          <div className="md:w-[60%]">
            <div className="sticky top-28">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="bg-background border border-border rounded-2xl p-8 md:p-10"
                >
                  {/* Service title */}
                  <div className="mb-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                      {isAr ? active.nameAr : active.nameEn}
                    </h3>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="w-6 h-px bg-primary" />
                      <p className="text-sm text-primary font-medium">
                        {isAr ? active.goalAr : active.goalEn}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border mb-7" />

                  {/* Sub-services grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                    {subs.map((sub, i) => (
                      <div key={i} className={`flex items-start gap-2.5 ${isAr ? "flex-row-reverse" : ""}`}>
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        <span className="text-sm text-foreground leading-snug">{sub}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}