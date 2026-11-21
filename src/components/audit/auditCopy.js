// All copy for the /management-audit landing page. Arabic is the source text
// supplied by Consolve (used verbatim); English is its professional translation.

export const AUDIT_FORM_ID = "audit-form";

const ar = {
  hero_h1: "هل تدعم منظومة الإدارة نمو شركتكم؟",
  hero_p: "تقييم استشاري يساعدكم على فهم مدى فعالية منظومة الإدارة الحالية، وتحديد الفجوات التي تؤثر على الأداء والكفاءة وسرعة اتخاذ القرار، ثم ترتيبها في أولويات وخارطة تحسين قابلة للتنفيذ.",
  hero_cta: "اطلبوا تقييم منظومة الإدارة",

  ch_title: "هل تواجه شركتكم هذه التحديات؟",
  ch_intro: "مع نمو الأعمال وتوسعها، قد تظهر تحديات لا ترتبط بفرص السوق وحدها، بل بطريقة إدارة الشركة لأعمالها ومواردها وقراراتها، مثل:",
  ch_items: [
    "تأخر القرارات أو تركزها لدى أشخاص محددين.",
    "عدم وضوح الصلاحيات والمسؤوليات بين الإدارات أو الشركات التابعة.",
    "وجود مؤشرات وتقارير كثيرة دون رؤية إدارية موحدة.",
    "ضعف الربط بين الأداء والنتائج التجارية والمالية.",
    "تداخل الأدوار أو اختلاف طريقة تنفيذ العمليات دون مبرر واضح.",
    "اعتماد العمليات والقرارات المهمة على خبرة أفراد بعينهم.",
    "صعوبة تحديد الأولويات الإدارية التي تستحق المعالجة أولًا.",
  ],
  ch_note: "قد تكون هذه التحديات مظاهر لمشكلة أعمق داخل منظومة الإدارة. لذلك يبدأ التحسين بفهم الوضع الحالي وأسباب الفجوات قبل اقتراح الحلول.",

  about_title: "ما خدمة Management Audit؟",
  about_ps: [
    "Management Audit هي خدمة استشارية لتقييم فعالية منظومة الإدارة في الشركة، ومدى قدرتها على دعم استراتيجيتها وأدائها ونموها.",
    "تعتمد كونسولف على مراجعة المستندات والبيانات، وإجراء المقابلات الإدارية، وتحليل العمليات والقرارات والأدلة المتاحة. ويساعد ذلك على تحديد مستوى النضج الإداري، وفهم الأسباب الجذرية للفجوات، وربطها بأثرها على الأعمال.",
    "لا يقتصر التقييم على وجود السياسات أو الوثائق، بل ينظر إلى كيفية تطبيق الممارسات الإدارية ونتائجها ومدى استمراريتها.",
  ],

  areas_title: "ما الجوانب التي يشملها التقييم؟",
  areas: [
    { t: "الإدارة الاستراتيجية", d: "مدى ارتباط التوجهات والأولويات الاستراتيجية بالقرارات والممارسات الإدارية." },
    { t: "الحوكمة والصلاحيات", d: "وضوح حقوق اتخاذ القرار، وحدود الصلاحيات، ومسارات التصعيد والاعتماد." },
    { t: "الهيكل والمساءلة", d: "وضوح الأدوار والمسؤوليات والعلاقة بين الإدارات والوحدات المختلفة." },
    { t: "نموذج التشغيل والعمليات", d: "مدى ملاءمة نموذج التشغيل، ووضوح ملكية العمليات، وكفاءة التنسيق بين الجهات." },
    { t: "إدارة الأداء", d: "ارتباط مؤشرات الأداء بالأهداف والنتائج، واستخدامها في المتابعة واتخاذ الإجراءات التصحيحية." },
    { t: "المعلومات والتقارير الإدارية", d: "مدى توفر معلومات مترابطة وموثوقة تساعد الإدارة على متابعة الأداء واتخاذ القرار." },
    { t: "الأنظمة والضوابط الإدارية", d: "مدى ملاءمة الأنظمة والضوابط والممارسات الإدارية لطبيعة الشركة وحجمها." },
    { t: "القدرات الإدارية والتمكين", d: "مدى توفر القدرات والأدوار والآليات التي تمكّن المديرين من إدارة مسؤولياتهم بفاعلية." },
  ],

  process_title: "كيف تنفذ كونسولف التقييم؟",
  steps: [
    { t: "فهم الشركة ونموذج أعمالها", d: "التعرف على طبيعة الشركة ومرحلتها وتوجهاتها الإدارية والتشغيلية." },
    { t: "مراجعة البيانات والأدلة", d: "مراجعة المستندات والتقارير والسياسات والإجراءات والبيانات ذات العلاقة، وإجراء مقابلات مع أصحاب العلاقة." },
    { t: "تحليل الممارسات والقرارات", d: "دراسة كيفية عمل المنظومة الإدارية فعليًا، وتحليل العمليات والقرارات ومواطن التعثر أو التداخل." },
    { t: "تقييم النضج والفجوات", d: "تقييم الممارسات الإدارية، وتحديد الفجوات وأسبابها الجذرية وربطها بأثرها على الأداء والأعمال." },
    { t: "ترتيب الأولويات وتصميم خارطة التحسين", d: "تحويل نتائج التقييم إلى مبادرات عملية مرتبة بحسب الأولوية والأثر، لتسهيل تنفيذها ومتابعة تقدمها." },
  ],

  deliv_title: "ما الذي تحصل عليه الشركة؟",
  deliv_items: [
    "صورة واضحة عن مستوى فعالية منظومة الإدارة الحالية.",
    "تقييم لمستوى النضج عبر المحاور الإدارية.",
    "تحديد الفجوات والأدلة المرتبطة بها وأسبابها الجذرية.",
    "فهم أثر الفجوات على الأداء والقرارات والكفاءة.",
    "ترتيب الفجوات والمبادرات بحسب الأولوية.",
    "توصيات وخارطة تحسين تتضمن مبادرات قابلة للمتابعة والقياس.",
  ],
  deliv_note: "تُحدد تفاصيل المخرجات بما يتناسب مع نطاق التقييم وطبيعة الشركة والمعلومات المتاحة.",
  report_label: "مثال توضيحي",
  report_title: "تقرير تقييم منظومة الإدارة",
  report_radar: "مستوى النضج عبر المحاور",
  report_priorities: "أولويات التحسين",
  report_priority_items: ["الأولوية الأولى", "الأولوية الثانية", "الأولوية الثالثة"],

  value_title: "ما القيمة العملية للتقييم؟",
  value_intro: "يساعد Management Audit الإدارة على توجيه جهود التحسين إلى القضايا الأكثر تأثيرًا، وبناء قراراتها على فهم أوضح للوضع الحالي.",
  value_lead: "وقد يدعم ذلك:",
  value_items: [
    "وضوح الصلاحيات والمسؤوليات.",
    "تحسين تدفق المعلومات وجودة التقارير الإدارية.",
    "رفع ارتباط مؤشرات الأداء بالنتائج والإجراءات.",
    "تقليل التداخل والاعتماد على التنسيق غير المنظم.",
    "توجيه الموارد والوقت إلى الأولويات الأعلى قيمة.",
    "إعداد منظومة إدارية أكثر قدرة على مواكبة نمو الشركة.",
  ],
  value_note: "يتحدد الأثر المتوقع بحسب نتائج التقييم، وأولويات الشركة، ومدى تنفيذ مبادرات التحسين.",

  fit_title: "لمن تناسب الخدمة؟",
  fit_intro: "تناسب الخدمة الشركات التي ترغب في:",
  fit_items: [
    "فهم أسباب التحديات الإدارية والتشغيلية المتكررة.",
    "تقييم مدى جاهزية منظومة الإدارة لمرحلة جديدة من النمو.",
    "مراجعة وضوح الأدوار والصلاحيات بين الإدارات أو الشركات التابعة.",
    "تحسين جودة المتابعة والتقارير الإدارية.",
    "تحديد أولويات تطوير الإدارة بناءً على الأدلة.",
    "بناء خارطة تحسين تستند إلى واقع الشركة واحتياجاتها.",
  ],

  faq_title: "أسئلة شائعة",
  faqs: [
    { q: "هل Management Audit تدقيق مالي أو قانوني؟", a: "لا. هي خدمة تقييم استشاري لفعالية منظومة الإدارة، ولا تمثل تدقيقًا ماليًا أو قانونيًا أو نظاميًا، ولا تحل محل وظيفة المراجعة الداخلية." },
    { q: "هل يقتصر التقييم على مراجعة السياسات والوثائق؟", a: "لا. تشمل المنهجية مراجعة الوثائق والبيانات، إلى جانب المقابلات وتحليل العمليات والقرارات والتطبيق الفعلي للممارسات الإدارية." },
    { q: "هل تقدم كونسولف حلولًا موحدة لجميع الشركات؟", a: "تُبنى نتائج التقييم والتوصيات على طبيعة الشركة ونموذج أعمالها ومرحلتها والفجوات التي تظهر أثناء الدراسة." },
    { q: "كم تستغرق الخدمة؟", a: "تتحدد المدة بعد فهم نطاق الشركة، وعدد الوحدات أو الإدارات المشمولة، وتوفر البيانات والأشخاص المعنيين." },
  ],

  form_title: "ابدأوا بفهم منظومة الإدارة قبل تحديد ما يحتاج إلى تغيير",
  form_text: "تساعدكم كونسولف على تقييم الوضع الحالي، وفهم أسباب الفجوات، وتحديد الأولويات التي تستحق المعالجة، ثم تحويل النتائج إلى خارطة تحسين عملية تناسب شركتكم.",
  f_name: "الاسم",
  f_company: "اسم الشركة",
  f_email: "البريد الإلكتروني",
  f_phone: "رقم التواصل",
  f_message: "نبذة عن التحدي أو الهدف من التقييم",
  f_consent: "أوافق على تواصل كونسولف معي بخصوص طلبي وفق سياسة الخصوصية",
  f_submit: "ناقشوا احتياجات شركتكم مع كونسولف",
  f_under: "شاركونا نبذة عن شركتكم والتحديات الإدارية التي ترغبون في فهمها.",
  f_success: "شكرًا لكم، استلمنا طلبكم وسيتواصل معكم فريق كونسولف قريبًا.",
  err_required: "هذا الحقل مطلوب",
  err_email: "يرجى إدخال بريد إلكتروني صحيح",
  err_phone: "يرجى إدخال رقم جوال سعودي صحيح (9 أرقام تبدأ بـ 5)",
  err_consent: "يرجى الموافقة للمتابعة",
  err_submit: "تعذر إرسال الطلب، يرجى المحاولة مرة أخرى.",
};

const en = {
  hero_h1: "Is your management system supporting your company's growth?",
  hero_p: "An advisory assessment that helps you understand how effective your current management system is, identify the gaps affecting performance, efficiency and decision speed, then organize them into priorities and an actionable improvement roadmap.",
  hero_cta: "Request a management system assessment",

  ch_title: "Is your company facing these challenges?",
  ch_intro: "As a business grows and expands, challenges may emerge that are not tied to market opportunities alone, but to the way the company manages its operations, resources and decisions, such as:",
  ch_items: [
    "Delayed decisions, or decisions concentrated with specific individuals.",
    "Unclear authorities and responsibilities between departments or subsidiaries.",
    "Many indicators and reports without a unified management view.",
    "Weak linkage between performance and commercial and financial results.",
    "Overlapping roles, or processes executed differently without clear justification.",
    "Critical processes and decisions relying on the experience of specific individuals.",
    "Difficulty identifying which management priorities should be addressed first.",
  ],
  ch_note: "These challenges may be symptoms of a deeper issue within the management system. That is why improvement starts with understanding the current situation and the causes of the gaps before proposing solutions.",

  about_title: "What is the Management Audit service?",
  about_ps: [
    "Management Audit is an advisory service that assesses the effectiveness of a company's management system and its ability to support the company's strategy, performance and growth.",
    "Consolve reviews documents and data, conducts management interviews, and analyzes processes, decisions and available evidence. This helps determine the level of management maturity, understand the root causes of gaps, and link them to their business impact.",
    "The assessment is not limited to whether policies or documents exist; it looks at how management practices are applied, what they deliver, and how sustainable they are.",
  ],

  areas_title: "What areas does the assessment cover?",
  areas: [
    { t: "Strategic Management", d: "How well strategic directions and priorities are linked to management decisions and practices." },
    { t: "Governance and Authorities", d: "Clarity of decision rights, limits of authority, and escalation and approval paths." },
    { t: "Structure and Accountability", d: "Clarity of roles and responsibilities and of the relationships between departments and units." },
    { t: "Operating Model and Processes", d: "Fitness of the operating model, clarity of process ownership, and efficiency of coordination across functions." },
    { t: "Performance Management", d: "How performance indicators connect to goals and results, and how they are used for follow-up and corrective action." },
    { t: "Management Information and Reporting", d: "Availability of connected, reliable information that helps management track performance and make decisions." },
    { t: "Management Systems and Controls", d: "Fitness of management systems, controls and practices for the company's nature and size." },
    { t: "Management Capabilities and Enablement", d: "Availability of the capabilities, roles and mechanisms that enable managers to run their responsibilities effectively." },
  ],

  process_title: "How does Consolve conduct the assessment?",
  steps: [
    { t: "Understanding the company and its business model", d: "Learning about the company's nature, stage, and management and operational direction." },
    { t: "Reviewing data and evidence", d: "Reviewing relevant documents, reports, policies, procedures and data, and interviewing key stakeholders." },
    { t: "Analyzing practices and decisions", d: "Studying how the management system actually works, and analyzing processes, decisions, and points of friction or overlap." },
    { t: "Assessing maturity and gaps", d: "Assessing management practices, identifying gaps and their root causes, and linking them to their impact on performance and the business." },
    { t: "Prioritizing and designing the improvement roadmap", d: "Turning assessment results into practical initiatives ranked by priority and impact, to make them easier to implement and track." },
  ],

  deliv_title: "What does the company receive?",
  deliv_items: [
    "A clear picture of how effective the current management system is.",
    "An assessment of maturity across the management dimensions.",
    "Identified gaps, their supporting evidence and their root causes.",
    "An understanding of how the gaps affect performance, decisions and efficiency.",
    "Gaps and initiatives ranked by priority.",
    "Recommendations and an improvement roadmap with trackable, measurable initiatives.",
  ],
  deliv_note: "The details of the deliverables are defined according to the assessment scope, the nature of the company and the information available.",
  report_label: "Illustrative example",
  report_title: "Management System Assessment Report",
  report_radar: "Maturity across dimensions",
  report_priorities: "Improvement priorities",
  report_priority_items: ["Priority one", "Priority two", "Priority three"],

  value_title: "What is the practical value of the assessment?",
  value_intro: "Management Audit helps management direct improvement efforts toward the most impactful issues, and base its decisions on a clearer understanding of the current situation.",
  value_lead: "This may support:",
  value_items: [
    "Clearer authorities and responsibilities.",
    "Better information flow and higher-quality management reporting.",
    "Stronger linkage between performance indicators, results and actions.",
    "Less overlap and less reliance on informal coordination.",
    "Directing resources and time to the highest-value priorities.",
    "A management system better able to keep pace with the company's growth.",
  ],
  value_note: "The expected impact depends on the assessment results, the company's priorities, and the extent to which improvement initiatives are implemented.",

  fit_title: "Who is this service for?",
  fit_intro: "The service suits companies that want to:",
  fit_items: [
    "Understand the causes of recurring management and operational challenges.",
    "Assess how ready their management system is for a new stage of growth.",
    "Review the clarity of roles and authorities between departments or subsidiaries.",
    "Improve the quality of follow-up and management reporting.",
    "Set management development priorities based on evidence.",
    "Build an improvement roadmap grounded in the company's reality and needs.",
  ],

  faq_title: "Frequently asked questions",
  faqs: [
    { q: "Is Management Audit a financial or legal audit?", a: "No. It is an advisory assessment of the effectiveness of the management system. It is not a financial, legal or regulatory audit, and it does not replace the internal audit function." },
    { q: "Is the assessment limited to reviewing policies and documents?", a: "No. The methodology includes reviewing documents and data, alongside interviews and analysis of processes, decisions and how management practices are actually applied." },
    { q: "Does Consolve offer one-size-fits-all solutions?", a: "Assessment results and recommendations are built on the company's nature, business model, stage, and the gaps that emerge during the study." },
    { q: "How long does the service take?", a: "The duration is set after understanding the company's scope, the number of units or departments included, and the availability of data and the people involved." },
  ],

  form_title: "Start by understanding your management system before deciding what needs to change",
  form_text: "Consolve helps you assess the current situation, understand the causes of gaps, and identify the priorities worth addressing, then turn the results into a practical improvement roadmap that fits your company.",
  f_name: "Name",
  f_company: "Company name",
  f_email: "Email",
  f_phone: "Contact number",
  f_message: "Brief description of the challenge or the goal of the assessment",
  f_consent: "I agree to Consolve contacting me about my request in accordance with the privacy policy",
  f_submit: "Discuss your company's needs with Consolve",
  f_under: "Share a brief overview of your company and the management challenges you want to understand.",
  f_success: "Thank you, we have received your request and the Consolve team will contact you soon.",
  err_required: "This field is required",
  err_email: "Please enter a valid email address",
  err_phone: "Please enter a valid Saudi mobile number (9 digits starting with 5)",
  err_consent: "Please agree to continue",
  err_submit: "We couldn't send your request. Please try again.",
};

export const AUDIT_COPY = { ar, en };