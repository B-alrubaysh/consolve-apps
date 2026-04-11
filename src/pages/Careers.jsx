import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Briefcase, MapPin, Clock } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "../lib/useLanguage";

const OPENINGS = [
  {
    id: 1,
    titleEn: "Strategy Consultant",
    titleAr: "مستشار استراتيجي",
    departmentEn: "Strategy",
    departmentAr: "الاستراتيجية",
    locationEn: "Riyadh, KSA",
    locationAr: "الرياض، المملكة العربية السعودية",
    typeEn: "Full-time",
    typeAr: "دوام كامل",
    descEn: "Drive strategic engagements for top-tier clients across various industries. You'll lead analysis, develop frameworks, and present insights to C-suite executives.",
    descAr: "قيادة المشاركات الاستراتيجية لكبار العملاء عبر مختلف القطاعات. ستقود التحليل وتطوير الأطر وتقديم الرؤى لكبار المسؤولين التنفيذيين.",
  },
  {
    id: 2,
    titleEn: "Financial Advisory Analyst",
    titleAr: "محلل استشارات مالية",
    departmentEn: "Financial Advisory",
    departmentAr: "الاستشارات المالية",
    locationEn: "Riyadh, KSA",
    locationAr: "الرياض، المملكة العربية السعودية",
    typeEn: "Full-time",
    typeAr: "دوام كامل",
    descEn: "Support financial modeling, feasibility studies, and M&A transactions. Work alongside senior advisors on complex deals across the region.",
    descAr: "دعم النمذجة المالية ودراسات الجدوى وصفقات الاندماج والاستحواذ. العمل جنبًا إلى جنب مع كبار المستشارين في الصفقات المعقدة.",
  },
  {
    id: 3,
    titleEn: "Operations Consultant",
    titleAr: "مستشار عمليات",
    departmentEn: "Operations",
    departmentAr: "العمليات",
    locationEn: "Riyadh, KSA",
    locationAr: "الرياض، المملكة العربية السعودية",
    typeEn: "Full-time",
    typeAr: "دوام كامل",
    descEn: "Help clients optimize their operating models, reengineer processes, and reduce costs through lean methodologies and data-driven insights.",
    descAr: "مساعدة العملاء على تحسين نماذج التشغيل وإعادة هندسة العمليات وتقليل التكاليف من خلال منهجيات لين والرؤى المستندة إلى البيانات.",
  },
  {
    id: 4,
    titleEn: "GRC Specialist",
    titleAr: "متخصص حوكمة ومخاطر وامتثال",
    departmentEn: "GRC",
    departmentAr: "الحوكمة والمخاطر والامتثال",
    locationEn: "Riyadh, KSA",
    locationAr: "الرياض، المملكة العربية السعودية",
    typeEn: "Full-time",
    typeAr: "دوام كامل",
    descEn: "Design governance frameworks, risk management programs, and compliance structures for clients across regulated industries.",
    descAr: "تصميم أطر الحوكمة وبرامج إدارة المخاطر وهياكل الامتثال للعملاء في القطاعات الخاضعة للتنظيم.",
  },
  {
    id: 5,
    titleEn: "Business Development Manager",
    titleAr: "مدير تطوير أعمال",
    departmentEn: "Business Development",
    departmentAr: "تطوير الأعمال",
    locationEn: "Riyadh, KSA",
    locationAr: "الرياض، المملكة العربية السعودية",
    typeEn: "Full-time",
    typeAr: "دوام كامل",
    descEn: "Identify and pursue new business opportunities, manage client relationships, and support proposal development across Consolve's service lines.",
    descAr: "تحديد الفرص التجارية الجديدة ومتابعتها وإدارة علاقات العملاء ودعم تطوير العروض عبر خطوط خدمات كونسولف.",
  },
];

function JobCard({ job, isAr, onApply }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border border-border rounded-2xl bg-card overflow-hidden">
      <button
        className={`w-full px-6 py-5 flex items-center gap-4 text-left ${isAr ? "flex-row-reverse text-right" : ""}`}
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground text-lg leading-snug">
            {isAr ? job.titleAr : job.titleEn}
          </h3>
          <div className={`flex items-center gap-4 mt-1.5 flex-wrap ${isAr ? "flex-row-reverse" : ""}`}>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Briefcase className="w-3.5 h-3.5" />
              {isAr ? job.departmentAr : job.departmentEn}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              {isAr ? job.locationAr : job.locationEn}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {isAr ? job.typeAr : job.typeEn}
            </span>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className={`px-6 pb-6 border-t border-border pt-4 ${isAr ? "text-right" : ""}`}>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                {isAr ? job.descAr : job.descEn}
              </p>
              <button
                onClick={() => onApply(job)}
                className="bg-primary text-primary-foreground text-sm font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
              >
                {isAr ? "تقدم الآن" : "Apply Now"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ApplicationForm({ job, isAr, dir, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", linkedin: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await base44.entities.ContactInquiry.create({
      name: form.name,
      email: form.email,
      phone: form.phone,
      company: isAr ? `تقديم لوظيفة: ${job.titleAr}` : `Job Application: ${job.titleEn}`,
      message: `LinkedIn: ${form.linkedin}\n\n${form.message}`,
      status: "New",
    });
    setLoading(false);
    setSubmitted(true);
    setTimeout(onSuccess, 2000);
  };

  const fields = isAr
    ? [
        { key: "name", label: "الاسم الكامل", placeholder: "أدخل اسمك الكامل", type: "text" },
        { key: "email", label: "البريد الإلكتروني", placeholder: "example@email.com", type: "email" },
        { key: "phone", label: "رقم الهاتف", placeholder: "+966 xx xxx xxxx", type: "tel" },
        { key: "linkedin", label: "رابط LinkedIn", placeholder: "https://linkedin.com/in/...", type: "url" },
      ]
    : [
        { key: "name", label: "Full Name", placeholder: "Enter your full name", type: "text" },
        { key: "email", label: "Email Address", placeholder: "example@email.com", type: "email" },
        { key: "phone", label: "Phone Number", placeholder: "+1 (555) 000-0000", type: "tel" },
        { key: "linkedin", label: "LinkedIn Profile", placeholder: "https://linkedin.com/in/...", type: "url" },
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
        dir={dir}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-7 py-6 border-b border-border">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
            {isAr ? "تقديم للوظيفة" : "Applying for"}
          </p>
          <h3 className="text-xl font-bold text-foreground">{isAr ? job.titleAr : job.titleEn}</h3>
        </div>

        {submitted ? (
          <div className="px-7 py-14 text-center">
            <div className="text-4xl mb-3">✅</div>
            <h4 className="text-lg font-bold text-foreground mb-1">{isAr ? "تم الإرسال بنجاح!" : "Application Submitted!"}</h4>
            <p className="text-sm text-muted-foreground">{isAr ? "سنتواصل معك قريبًا." : "We'll be in touch soon."}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-7 py-6 flex flex-col gap-4">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">{f.label}</label>
                <input
                  type={f.type}
                  required={f.key !== "linkedin"}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  className={`w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 ${isAr ? "text-right" : ""}`}
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                {isAr ? "رسالة التغطية (اختياري)" : "Cover Message (optional)"}
              </label>
              <textarea
                rows={4}
                placeholder={isAr ? "أخبرنا عن نفسك..." : "Tell us about yourself..."}
                value={form.message}
                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                className={`w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none ${isAr ? "text-right" : ""}`}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-1 bg-primary text-primary-foreground text-sm font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading ? (isAr ? "جارٍ الإرسال..." : "Submitting...") : (isAr ? "إرسال الطلب" : "Submit Application")}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

export default function Careers() {
  const { lang, dir, isAr } = useLanguage();
  const [selectedJob, setSelectedJob] = useState(null);

  return (
    <div dir={dir} className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-24 md:py-36 bg-secondary text-secondary-foreground">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">
              {isAr ? "الوظائف" : "Careers"}
            </p>
            <h1 className="text-4xl md:text-6xl font-black text-secondary-foreground leading-tight mb-5">
              {isAr ? "انضم إلى فريقنا" : "Join Our Team"}
            </h1>
            <p className="text-secondary-foreground/60 text-lg max-w-xl leading-relaxed">
              {isAr
                ? "نبحث عن مواهب استثنائية تشاركنا شغفنا بتحويل المنظمات وخلق أثر حقيقي."
                : "We're looking for exceptional talent who share our passion for transforming organizations and creating real impact."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            {isAr ? `الوظائف المتاحة (${OPENINGS.length})` : `Open Positions (${OPENINGS.length})`}
          </h2>
          <div className="flex flex-col gap-4">
            {OPENINGS.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              >
                <JobCard job={job} isAr={isAr} onApply={setSelectedJob} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Modal */}
      <AnimatePresence>
        {selectedJob && (
          <ApplicationForm
            key="form"
            job={selectedJob}
            isAr={isAr}
            dir={dir}
            onClose={() => setSelectedJob(null)}
            onSuccess={() => setSelectedJob(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}