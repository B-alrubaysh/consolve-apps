// Fallback datasets for the public /clients page.
// Strings are copied verbatim from src/pages/Clients.jsx (INDUSTRIES_EN / INDUSTRIES_AR)
// and from src/lib/translations.js (t1..t3 and cs1..cs3, in both en and ar).

export const INDUSTRIES_FALLBACK = [
  { name_en: "Technology",              name_ar: "التكنولوجيا",                        display_order: 10,  is_active: true },
  { name_en: "Healthcare",               name_ar: "الرعاية الصحية",                     display_order: 20,  is_active: true },
  { name_en: "Financial Services",       name_ar: "الخدمات المالية",                    display_order: 30,  is_active: true },
  { name_en: "Manufacturing",            name_ar: "التصنيع",                            display_order: 40,  is_active: true },
  { name_en: "Retail & E-commerce",      name_ar: "التجزئة والتجارة الإلكترونية",       display_order: 50,  is_active: true },
  { name_en: "Energy",                   name_ar: "الطاقة",                             display_order: 60,  is_active: true },
  { name_en: "Real Estate",              name_ar: "العقارات",                           display_order: 70,  is_active: true },
  { name_en: "Education",                name_ar: "التعليم",                            display_order: 80,  is_active: true },
  { name_en: "Logistics",                name_ar: "الخدمات اللوجستية",                  display_order: 90,  is_active: true },
  { name_en: "Professional Services",    name_ar: "الخدمات المهنية",                    display_order: 100, is_active: true },
  { name_en: "Government Sector",        name_ar: "القطاع الحكومي",                            display_order: 110, is_active: true },
  { name_en: "Hospitality",              name_ar: "الضيافة",                            display_order: 120, is_active: true },
];

export const TESTIMONIALS_FALLBACK = [
  {
    quote_en: "Consolve's assessment identified operational bottlenecks we'd been struggling with for years. Their recommendations helped improve our supply chain efficiency by 35%.",
    quote_ar: "كشف تقييم كونسولف عن عوائق تشغيلية كنا نعاني منها لسنوات. أسهمت توصياتهم في تحسين كفاءة سلسلة التوريد لدينا بنسبة ٣٥٪.",
    author_en: "Chief Operations Officer",
    author_ar: "مدير العمليات",
    company_en: "Leading Manufacturing Firm",
    company_ar: "شركة تصنيع رائدة",
    display_order: 10,
    is_active: true,
  },
  {
    quote_en: "The governance framework developed by the team played a central role in our IPO readiness. Clear, thorough, and impactful.",
    quote_ar: "كان إطار الحوكمة الذي طوره الفريق عنصرا محوريا في استعدادنا للطرح العام. واضح وشامل ومؤثر.",
    author_en: "Board Chairman",
    author_ar: "رئيس مجلس الإدارة",
    company_en: "Technology Startup",
    company_ar: "شركة ناشئة في مجال التكنولوجيا",
    display_order: 20,
    is_active: true,
  },
  {
    quote_en: "The AI-supported diagnostic tool helped us develop an initial view of our challenges within a short period.",
    quote_ar: "ساعدتنا أداة التشخيص المدعومة بالذكاء الاصطناعي على تكوين تصور أولي عن التحديات خلال وقت قصير.",
    author_en: "CEO",
    author_ar: "الرئيس التنفيذي",
    company_en: "Regional Healthcare Provider",
    company_ar: "مزوّد رعاية صحية إقليمي",
    display_order: 30,
    is_active: true,
  },
];

export const CASE_STUDIES_FALLBACK = [
  {
    industry_en: "Manufacturing",
    industry_ar: "التصنيع",
    challenge_en: "Fragmented operations across 12 facilities leading to 25% cost overruns.",
    challenge_ar: "عمليات مجزّأة عبر ١٢ منشأة أدت إلى تجاوز التكاليف بنسبة ٢٥٪.",
    solution_en: "End-to-end operational restructuring with standardized processes and KPI frameworks.",
    solution_ar: "إعادة هيكلة تشغيلية شاملة مع عمليات موحدة وأطر مؤشرات الأداء.",
    result_en: "22% cost reduction within 8 months. Cycle time improved by 40%.",
    result_ar: "تخفيض التكاليف بنسبة ٢٢٪ خلال ٨ أشهر. تحسّن وقت الدورة بنسبة ٤٠٪.",
    display_order: 10,
    is_active: true,
  },
  {
    industry_en: "Financial Services",
    industry_ar: "الخدمات المالية",
    challenge_en: "A governance structure that did not fully align with regulatory requirements, increasing organizational risk.",
    challenge_ar: "هيكل حوكمة غير متوافق مع المتطلبات التنظيمية، ما أدى إلى زيادة المخاطر.",
    solution_en: "Complete governance overhaul with board advisory and compliance frameworks.",
    solution_ar: "مراجعة شاملة للحوكمة مع استشارات مجلس الإدارة وأطر الامتثال.",
    result_en: "Improved alignment with the regulatory requirements defined within the project scope. Board effectiveness score increased by 60%.",
    result_ar: "تحسين مستوى الامتثال للمتطلبات التنظيمية المحددة في نطاق المشروع. ارتفع مؤشر فعالية مجلس الإدارة بنسبة ٦٠٪.",
    display_order: 20,
    is_active: true,
  },
  {
    industry_en: "Technology",
    industry_ar: "التكنولوجيا",
    challenge_en: "Rapid growth with no scalable organizational structure.",
    challenge_ar: "نمو سريع دون هيكل تنظيمي قابل للتوسع.",
    solution_en: "Designed scalable org chart, defined roles, and implemented reporting systems.",
    solution_ar: "تصميم هيكل تنظيمي قابل للتوسع وتحديد الأدوار وتطبيق أنظمة التقارير.",
    result_en: "The workforce grew threefold without significant disruption to operations. Employee satisfaction up 45%.",
    result_ar: "نمت القوى العاملة إلى ثلاثة أضعاف دون تعطل ملحوظ في العمليات. رضا الموظفين ارتفع بنسبة ٤٥٪.",
    display_order: 30,
    is_active: true,
  },
];