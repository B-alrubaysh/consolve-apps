// Default seed data for the BlogTemplate entity.
// Used by AdminBlogTemplatesPage's "Seed default templates" action.

export const DEFAULT_TEMPLATES = [
  {
    name_en: "Thought Leadership Article",
    name_ar: "مقال قيادة فكرية",
    description: "Position the firm as an expert voice on a strategic topic.",
    category: "Strategy",
    content_structure_en: "<h2>The shift we're seeing</h2><p>Describe the macro change or trend.</p><h2>Why it matters now</h2><p>Tie the trend to client pain or opportunity.</p><h2>What we believe</h2><p>State your firm's point of view clearly.</p><h2>How leaders should respond</h2><p>3-5 actionable recommendations.</p><h2>Closing thought</h2><p>One memorable takeaway.</p>",
    content_structure_ar: "<h2>التحول الذي نراه</h2><p>صف التغيير أو الاتجاه الكلي.</p><h2>لماذا هو مهم الآن</h2><p>اربط الاتجاه بألم العميل أو الفرصة.</p><h2>ما نؤمن به</h2><p>اذكر وجهة نظر شركتك بوضوح.</p><h2>كيف يجب أن يتجاوب القادة</h2><p>3-5 توصيات قابلة للتنفيذ.</p><h2>خاتمة</h2><p>فكرة لا تُنسى.</p>",
  },
  {
    name_en: "Industry Insight",
    name_ar: "رؤية قطاعية",
    description: "Decode an emerging dynamic in a specific industry.",
    category: "Insight",
    content_structure_en: "<h2>State of the industry</h2><p>Current landscape in 2-3 paragraphs.</p><h2>What's changing</h2><p>The shift, with data if possible.</p><h2>Winners and losers</h2><p>Who benefits, who's exposed.</p><h2>Implications for our clients</h2><p>Apply to typical client profiles.</p>",
    content_structure_ar: "<h2>حالة القطاع</h2><p>المشهد الحالي في فقرتين أو ثلاث.</p><h2>ما الذي يتغير</h2><p>التحول، مع بيانات إن أمكن.</p><h2>الرابحون والخاسرون</h2><p>من يستفيد، من المعرض للخطر.</p><h2>الآثار على عملائنا</h2><p>طبق على ملفات العملاء النموذجية.</p>",
  },
  {
    name_en: "Case Study",
    name_ar: "دراسة حالة",
    description: "Tell a client transformation story with measurable outcomes.",
    category: "Case Study",
    content_structure_en: "<h2>Client context</h2><p>Industry, size, situation (anonymized if needed).</p><h2>The challenge</h2><p>What they faced and why it mattered.</p><h2>Our approach</h2><p>How we engaged and the methodology used.</p><h2>What we delivered</h2><p>Concrete outputs and recommendations.</p><h2>Results</h2><p>Measurable outcomes with numbers.</p><h2>Key takeaway</h2><p>Lesson others can apply.</p>",
    content_structure_ar: "<h2>سياق العميل</h2><p>القطاع، الحجم، الوضع (مع إخفاء الهوية إن لزم).</p><h2>التحدي</h2><p>ما واجهوه ولماذا كان مهماً.</p><h2>منهجنا</h2><p>كيف تعاملنا والمنهجية المستخدمة.</p><h2>ما قدمناه</h2><p>المخرجات الملموسة والتوصيات.</p><h2>النتائج</h2><p>نتائج قابلة للقياس بالأرقام.</p><h2>الخلاصة</h2><p>درس يمكن للآخرين تطبيقه.</p>",
  },
  {
    name_en: "Market Update",
    name_ar: "تحديث السوق",
    description: "Brief commentary on a recent market event or release.",
    category: "Market",
    content_structure_en: "<h2>What happened</h2><p>The event in 1-2 paragraphs.</p><h2>Context</h2><p>Why this matters in the broader picture.</p><h2>What we're watching next</h2><p>Forward indicators.</p>",
    content_structure_ar: "<h2>ماذا حدث</h2><p>الحدث في فقرة أو فقرتين.</p><h2>السياق</h2><p>لماذا هذا مهم في الصورة الأوسع.</p><h2>ما نراقبه تالياً</h2><p>المؤشرات الاستشرافية.</p>",
  },
  {
    name_en: "How-To Guide",
    name_ar: "دليل عملي",
    description: "Step-by-step practical guidance on a specific task.",
    category: "Guide",
    content_structure_en: "<h2>Why this matters</h2><p>Quick context on the problem.</p><h2>Before you start</h2><p>Prerequisites or assumptions.</p><h2>Step 1: ...</h2><p>Description.</p><h2>Step 2: ...</h2><p>Description.</p><h2>Step 3: ...</h2><p>Description.</p><h2>Common pitfalls</h2><p>What to avoid.</p>",
    content_structure_ar: "<h2>لماذا هذا مهم</h2><p>سياق سريع للمشكلة.</p><h2>قبل البدء</h2><p>المتطلبات أو الافتراضات.</p><h2>الخطوة 1: ...</h2><p>الوصف.</p><h2>الخطوة 2: ...</h2><p>الوصف.</p><h2>الخطوة 3: ...</h2><p>الوصف.</p><h2>المزالق الشائعة</h2><p>ما يجب تجنبه.</p>",
  },
  {
    name_en: "Executive Brief",
    name_ar: "موجز تنفيذي",
    description: "Crisp one-pager for time-poor decision makers.",
    category: "Executive",
    content_structure_en: "<h2>Bottom line</h2><p>One-paragraph headline conclusion.</p><h2>Key facts</h2><p>3-5 bullet-style facts.</p><h2>Why it matters</h2><p>Implications for the business.</p><h2>Recommended action</h2><p>Specific next step.</p>",
    content_structure_ar: "<h2>الخلاصة</h2><p>الاستنتاج الرئيسي في فقرة واحدة.</p><h2>الحقائق الرئيسية</h2><p>3-5 حقائق على شكل نقاط.</p><h2>لماذا هذا مهم</h2><p>الآثار على الأعمال.</p><h2>الإجراء الموصى به</h2><p>الخطوة التالية المحددة.</p>",
  },
];