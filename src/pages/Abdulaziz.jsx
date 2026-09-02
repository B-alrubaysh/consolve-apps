import { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  Target,
  Megaphone,
  FlaskConical,
  Check,
  CalendarDays,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";
import { useLanguage } from "@/lib/useLanguage";
import { usePageMetadata } from "@/lib/usePageMetadata";

// ─── Constants ───────────────────────────────────────────────────────────────

const BOOKING_URL =
  "https://bookings.cloud.microsoft/book/Bookings@consolve.sa/?ismsaljsauthenabled=true";
const WHATSAPP_URL = "https://wa.me/message/M6AP4IL4RCJIO1";
const HOME_URL = "https://consolve.sa";

// Consultant portrait placeholder — user will upload the real one and swap
// this URL. Sized square, centered subject, neutral background.
const PORTRAIT_URL =
  "https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/747068aa4_Mypic2025.jpg";

// Consolve wordmark used on the header and footer (white/screen-blend).
const LOGO_URL =
  "https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/4c25434d1_Consolve_identity_compressed_HQai.png";

// Marquee sources. These are stand-in URLs — user will replace with the real
// logo assets on upload. Kept small and recognizable so the layout is right
// even before final assets arrive.
const TOOL_LOGOS = [
  { name: "Google Analytics", src: "https://cdn.simpleicons.org/googleanalytics/E37400" },
  { name: "Microsoft Clarity", src: "https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/6e6928612_logo-microsoft-clarity.jpg" },
  { name: "Meta Ads", src: "https://cdn.simpleicons.org/meta/0668E1" },
  { name: "Snapchat Ads", src: "https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/5cad6c9c9_og_image.png" },
  { name: "Salla", src: "https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/fac35738b_salla.jpg" },
  { name: "Zid", src: "https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/58e2be714_images1.jpeg" },
  { name: "Shopify", src: "https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/eb9a37276_shopyfy.jpg" },
  { name: "SAP", src: "https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/334edf673_SAP.webp" },
  { name: "GitHub", src: "https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/3be8aca30_bslogo.jpg" },
  { name: "Python", src: "https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/98f99422e_pynew2.jpeg" },
  { name: "Visual Studio Code", src: "https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/5d7b487d7_vs22.webp" },
  { name: "Google Trends", src: "https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/2ad6b8328_Google-Trends-Logo-Square-Insight-Platforms.webp" },
  { name: "Hotjar", src: "https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/6c525637f_hotjar_logo.png" },
  { name: "Microsoft Dynamics 365", src: "https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/e69a47813_Microsoft_Dynamics_365_Logo_2021presentsvg.webp" },
  { name: "Power BI", src: "https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/d711ff515_Microsoft-Power-BI-Symbol.png" },
];

const COMPANY_LOGOS = [
  { name: "Saudi Industrial Development Co. (SIDC)", src: "https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/4991d7e67_.jpeg" },
  { name: "MEGA Group", src: "https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/69641090f_mega_consult_logo.jpeg" },
  { name: "Neyam Group", src: "https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/6fa13f21e_.jpeg" },
  { name: "Unicode", src: "https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/413c02dbc_unicode_sa_logo.jpeg" },
  { name: "Nice One", src: "https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/6c9584de8_.png" },
  { name: "Tela Home", src: "https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/b71e36cb0_1755129578_telahome.png" },
  { name: "Option B", src: "https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/3e5bac055_Option-B-Promo-Code-logo-png.png" },
  { name: "Sleep High", src: "https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/3b2a92e05_MTcyMTcxMzg3ODY2OWY0NGQ2MzYwMjA.png" },
  { name: "Zeer", src: "https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/8e8b513f4_zeer.webp" },
];

// ─── Localized copy ──────────────────────────────────────────────────────────
// Kept inside this page (not in the shared translations.js) because none of
// this copy is reused anywhere else on the site.

const COPY = {
  ar: {
    // header
    menu: "القائمة",
    // hero
    hero_wordmark: "consolve",
    // intro
    intro_name: "عبدالعزيز الدايل",
    intro_title: "مستشار بحث وتطوير الأعمال",
    intro_desc:
      "متخصص في دراسات السوق، وتحليل المنافسين، وتطوير المنتجات، وفرص النمو.",
    intro_cta_primary: "احجز جلسة استشارية",
    intro_cta_secondary: "استكشف مجالات العمل",
    intro_note:
      "جلسة أولية لفهم التحدي وتحديد نطاق العمل المناسب.",
    // problem
    problem_h: "قد لا تكون المشكلة في نقص الأنشطة",
    problem_points: [
      "قد تنفّذ الشركة حملات ومبادرات متعددة، لكن دون ارتباط واضح بين ما تنفذه وأهدافها التجارية.",
      "وقد تتوفر أمام الإدارة أسواق أو شرائح أو مسارات نمو متعددة، دون معايير واضحة تساعدها على المقارنة بينها.",
      "وقد تُجمع بيانات السوق والعملاء دون أن تتحول إلى خيارات واضحة يمكن للإدارة تقييمها.",
    ],
    problem_close:
      "تبدأ المعالجة بتحديد التحدي، وجمع البيانات اللازمة، وتحليلها، وبناء خيارات واضحة تدعم القرار والتنفيذ.",
    problem_cta: "ناقش التحدي",
    // services
    services_label: "مجالات العمل",
    services_h: "مجالات عمل تربط البحث بالقرار والتنفيذ",
    services: [
      {
        icon: "target",
        title: "أبحاث السوق والعملاء",
        desc:
          "إعداد أبحاث ودراسات تساعد الشركات على فهم السوق والعملاء والمنافسين، والإجابة عن أسئلة تجارية محددة قبل قرارات التوسع أو الاستثمار أو تطوير الأعمال.",
        points: [
          "تحديد نطاق الدراسة.",
          "جمع وتحليل بيانات السوق.",
          "دراسة شرائح العملاء واحتياجاتهم.",
          "تحليل المنافسين والبدائل.",
          "تحليل الاتجاهات المؤثرة.",
        ],
        cta: "ناقش احتياجك",
      },
      {
        icon: "megaphone",
        title: "الاستراتيجية التسويقية ودخول السوق",
        desc:
          "بناء استراتيجية تسويقية تربط أهداف الشركة بالسوق والعملاء، وتحدد الشرائح والتموضع وعرض القيمة والقنوات ومؤشرات القياس.",
        points: [
          "تشخيص الوضع التسويقي.",
          "تحليل السوق والمنافسين.",
          "تحديد الشرائح المستهدفة.",
          "تطوير التموضع وعرض القيمة.",
          "بناء الرسائل الرئيسية.",
          "تحديد القنوات والمبادرات.",
          "إعداد خطة دخول السوق.",
          "تصميم مؤشرات الأداء.",
        ],
        cta: "طوّر استراتيجيتك التسويقية",
      },
      {
        icon: "flask",
        title: "تأسيس وتطوير إدارة البحث والتطوير",
        desc:
          "نساعد الشركات على تأسيس وتطوير إدارة البحث والتطوير بما يربط بين السوق والعملاء والمنتجات وفرص النمو، ويحوّل البحث والتحليل إلى قرارات ومبادرات تطوير واضحة.",
        scope_h: "يشمل نطاق العمل:",
        points: [
          "تقييم الوضع الحالي وتحديد فجوات البحث والتطوير.",
          "تحديد دور الإدارة ونطاق عملها وأولوياتها.",
          "بناء منهجيات دراسة السوق والعملاء والمنافسين.",
          "تصميم آلية لرصد وتحليل فرص النمو والتطوير.",
          "بناء منهجية لإدارة الأفكار ودراسة جدواها وأولوياتها.",
          "تصميم مراحل تطوير المنتجات والخدمات الجديدة وتحسين القائمة منها.",
          "إعداد أدوات ونماذج البحث والتحليل.",
          "بناء آلية لمتابعة السوق والمنتجات بشكل مستمر.",
          "إعداد خطة تأسيس وتشغيل الإدارة.",
          "تدريب الفريق على أدوات ومنهجيات العمل.",
        ],
        outcome_h: "النتيجة:",
        outcome:
          "إدارة بحث وتطوير منظمة تساعد الشركة على اكتشاف الفرص، وتطوير المنتجات والخدمات، واتخاذ قرارات مبنية على البحث والتحليل.",
        cta: "أسّس إدارة البحث والتطوير",
      },
    ],
    // tools + companies
    tools_h: "أدوات ومنصات أستخدمها",
    tools_p:
      "أدوات أستخدمها في البحث والتحليل وقياس الأداء بحسب احتياج كل مشروع.",
    companies_h: "شركات سبق العمل بها",
    companies_p:
      "خبرات مهنية تشكّلت من خلال العمل ضمن جهات وبيئات أعمال متنوعة.",
    // about
    about_paras: [
      "خبرة مهنية تجمع بين التسويق، وأبحاث السوق، والبحث والتطوير، وتطوير الأعمال، وإدارة المنتجات، والجانب التشغيلي.",
      "أعمل في كونسولف على إعداد الأبحاث، ودراسة خيارات النمو، وبناء الاستراتيجيات التسويقية، وتأسيس وتطوير إدارات البحث والتطوير وإدارة المنتجات.",
      "ترتكز منهجيتي على فهم التحدي، وجمع البيانات وتحليلها، وبناء خيارات واضحة، ثم تحويل المسار الذي يختاره العميل إلى خطة قابلة للتنفيذ والمتابعة.",
    ],
    about_cta: "احجز جلستك الأولى الآن!",
    // final CTA
    final_h: "هل لديك تحدي مرتبط بالسوق أو النمو؟",
    final_p:
      "ابدأ بجلسة لفهم التحدي، ومراجعة السياق، وتحديد نطاق العمل المناسب.",
    final_book: "احجز استشارتك المجانية",
    final_wa: "تواصل معي عبر واتساب",
    // footer
    footer_tagline:
      "بُنيت للحل. نساعد الشركات على بناء أنظمة إدارية وتشغيلية أكثر وضوحًا وكفاءة، وتحويل الاستراتيجية والحوكمة والعمليات إلى أداء أفضل.",
    footer_home: "الرئيسية",
    footer_copy: "© 2026 كونسولف. جميع الحقوق محفوظة.",
    footer_privacy: "الخصوصية",
    footer_terms: "الشروط",
    // floating
    wa_bubble: "موجودين لخدمتك عبر الواتساب",
  },
  en: {
    menu: "Menu",
    hero_wordmark: "consolve",
    intro_name: "Abdulaziz Aldayel",
    intro_title: "Research & Development Consultant",
    intro_desc:
      "Specialized in market research, customer and competitor analysis, product development, growth opportunities, and business improvement.",
    intro_cta_primary: "Book a Consulting Session",
    intro_cta_secondary: "Explore Areas of Work",
    intro_note:
      "An initial session to understand the challenge and define the appropriate scope of work.",
    problem_h: "The Issue May Not Be a Shortage of Activity",
    problem_points: [
      "A company may run many campaigns and initiatives, yet without a clear link between what it executes and its business objectives.",
      "Leadership may face multiple markets, segments, or growth paths, without clear criteria to compare between them.",
      "Market and customer data may be collected without ever turning into clear options that leadership can evaluate.",
    ],
    problem_close:
      "Resolution begins by defining the challenge, gathering the needed data, analyzing it, and building clear options that support decision and execution.",
    problem_cta: "Discuss the Challenge",
    services_label: "Areas of Work",
    services_h: "Areas of Work That Connect Research to Decision and Execution",
    services: [
      {
        icon: "target",
        title: "Market & Customer Research",
        desc:
          "Research and studies that help companies understand the market, customers, and competitors, and answer specific business questions before expansion, investment, or business-development decisions.",
        points: [
          "Defining the study scope.",
          "Collecting and analyzing market data.",
          "Studying customer segments and their needs.",
          "Analyzing competitors and alternatives.",
          "Analyzing influential trends.",
        ],
        cta: "Discuss Your Requirement",
      },
      {
        icon: "megaphone",
        title: "Marketing Strategy and Market Entry",
        desc:
          "Building a marketing strategy that links the company's objectives to the market and customers, and defines segments, positioning, value proposition, channels, and performance metrics.",
        points: [
          "Diagnosing the current marketing situation.",
          "Analyzing the market and competitors.",
          "Defining target segments.",
          "Developing positioning and value proposition.",
          "Building key messages.",
          "Selecting channels and initiatives.",
          "Preparing the market-entry plan.",
          "Designing performance metrics.",
        ],
        cta: "Develop Your Marketing Strategy",
      },
      {
        icon: "flask",
        title: "Establishing and Developing the Research and Development Function",
        desc:
          "We help companies establish and develop their R&D function so it connects market, customers, products, and growth opportunities, and turns research and analysis into clear decisions and development initiatives.",
        scope_h: "Scope of work includes:",
        points: [
          "Assessing the current situation and identifying R&D gaps.",
          "Defining the function's role, scope, and priorities.",
          "Building methodologies for studying market, customers, and competitors.",
          "Designing a mechanism to identify and analyze growth and development opportunities.",
          "Building a methodology to manage ideas, evaluate feasibility, and prioritize them.",
          "Designing the stages for developing new products and services and improving existing ones.",
          "Preparing research and analysis tools and templates.",
          "Building a mechanism for ongoing market and product monitoring.",
          "Preparing the plan to establish and operate the function.",
          "Training the team on the tools and methodologies.",
        ],
        outcome_h: "Outcome:",
        outcome:
          "An organized R&D function that helps the company discover opportunities, develop products and services, and take decisions grounded in research and analysis.",
        cta: "Establish Your R&D Function",
      },
    ],
    tools_h: "Tools and Platforms I Use",
    tools_p:
      "Tools I use for research, analysis, and performance measurement — chosen per project need.",
    companies_h: "Companies I Have Worked With",
    companies_p:
      "Professional experience shaped by working within diverse organizations and business environments.",
    about_paras: [
      "Specialized in research and development, with experience in market research, customer and competitor analysis, product tracking and evaluation, identifying growth opportunities, and developing products and services.",
      "His work also includes analyzing and improving business processes, developing workflows and procedures, and supporting decision makers through data driven analysis.",
      "He focuses on translating research, data, and business challenges into clear decisions, development opportunities, and practical implementation plans.",
    ],
    about_cta: "Book Your First Session Now!",
    final_h: "Do You Have a Challenge Related to Market or Growth?",
    final_p:
      "Start with a session to understand the challenge, review the context, and define the appropriate scope of work.",
    final_book: "Book Your Free Consultation",
    final_wa: "Contact Me on WhatsApp",
    footer_tagline:
      "Built to Solve. We help companies build clearer, more efficient management and operating systems, turning strategy, governance, and operations into better performance.",
    footer_home: "Home",
    footer_copy: "© 2026 Consolve. All rights reserved.",
    footer_privacy: "Privacy",
    footer_terms: "Terms",
    wa_bubble: "We're here to help on WhatsApp",
  },
};

// ─── Reveal on scroll ────────────────────────────────────────────────────────

function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, shown];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, shown] = useReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─── Buttons ─────────────────────────────────────────────────────────────────

// Primary button with a slowly rotating conic glow around its edge — reserved
// for the hero + final CTAs, kept off body buttons to protect its impact.
function GlowButton({ href, onClick, children, variant = "primary", className = "" }) {
  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-full font-semibold h-[52px] px-8 text-sm sm:text-base transition-transform duration-200 active:scale-[0.98] hover:-translate-y-0.5";
  const styles = {
    primary: "bg-primary text-primary-foreground shadow-[0_10px_30px_-10px_rgba(232,123,89,0.55)]",
    white: "bg-white text-secondary shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)]",
    outline_dark: "border-2 border-secondary text-secondary bg-transparent hover:bg-secondary/5",
    outline_white: "border-2 border-white text-white bg-transparent hover:bg-white/10",
  };
  const withGlow = variant === "primary" || variant === "white";
  const Comp = href ? "a" : "button";
  const extra = href
    ? { href, target: href.startsWith("http") ? "_blank" : undefined, rel: href.startsWith("http") ? "noopener noreferrer" : undefined }
    : { onClick, type: "button" };

  return (
    <span className={`relative inline-flex ${withGlow ? "abd-glow-wrap" : ""} ${className}`}>
      <Comp className={`${base} ${styles[variant]}`} {...extra}>
        {children}
      </Comp>
    </span>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────

function Header({ lang, setLang, onOpenMenu }) {
  const C = COPY[lang];
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <header className="w-full max-w-6xl bg-secondary/85 backdrop-blur-md rounded-[16px] shadow-lg border border-white/10">
        <div className="flex items-center justify-between px-5 py-3">
          <a href="#top" className="flex items-center shrink-0" aria-label="Consolve">
            <img
              src={LOGO_URL}
              alt="Consolve"
              className="h-7 w-auto"
              style={{ mixBlendMode: "screen" }}
            />
          </a>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="text-sm font-semibold text-white/90 hover:text-primary transition-colors h-8 px-3 rounded-full border border-white/15"
            >
              {lang === "ar" ? "EN" : "ع"}
            </button>
            <button
              onClick={onOpenMenu}
              aria-label={C.menu}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white/90 hover:text-primary border border-white/15 transition-colors"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

function MobileMenu({ open, onClose, lang }) {
  const C = COPY[lang];
  if (!open) return null;
  const items = [
    { label: lang === "ar" ? "التعريف" : "Intro", href: "#intro" },
    { label: lang === "ar" ? "المشكلة" : "The Issue", href: "#problem" },
    { label: lang === "ar" ? "مجالات العمل" : "Areas of Work", href: "#services" },
    { label: lang === "ar" ? "أدوات" : "Tools", href: "#tools" },
    { label: lang === "ar" ? "شركات" : "Companies", href: "#companies" },
    { label: lang === "ar" ? "نبذة عني" : "About", href: "#about" },
    { label: C.footer_home, href: HOME_URL, external: true },
  ];
  return (
    <div className="fixed inset-0 z-[60] bg-secondary/95 backdrop-blur-sm flex flex-col" onClick={onClose}>
      <div className="flex justify-end p-6">
        <button
          onClick={onClose}
          aria-label="Close"
          className="w-10 h-10 rounded-full flex items-center justify-center text-white/90 border border-white/20"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <nav className="flex-1 flex flex-col items-center justify-center gap-6">
        {items.map((i) =>
          i.external ? (
            <a
              key={i.href}
              href={i.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl text-white/90 hover:text-primary transition-colors"
            >
              {i.label}
            </a>
          ) : (
            <a
              key={i.href}
              href={i.href}
              className="text-2xl text-white/90 hover:text-primary transition-colors"
            >
              {i.label}
            </a>
          )
        )}
      </nav>
    </div>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero({ lang }) {
  const C = COPY[lang];
  return (
    <section
      id="top"
      className="relative min-h-[92svh] flex flex-col justify-end overflow-hidden"
      style={{
        // Base: deep near-black with a subtle diagonal warmth so the whole
        // canvas isn't flat green/black like before.
        background:
          "linear-gradient(135deg, #0d2528 0%, #14201f 45%, #241612 100%)",
      }}
    >
      {/* Deep teal bloom on the LEFT (cool side) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 10% 30%, rgba(30,90,90,0.55) 0%, rgba(30,90,90,0.25) 30%, transparent 60%)",
        }}
      />
      {/* Warm terracotta/brown glow on the RIGHT — the tone that was missing */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 75% 85% at 85% 55%, rgba(180,90,60,0.55) 0%, rgba(150,70,45,0.28) 32%, transparent 65%)",
        }}
      />
      {/* Soft lift near the top-center so the wordmark area isn't crushed */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 15%, rgba(255,255,255,0.06) 0%, transparent 70%)",
        }}
      />
      <div className="relative pb-2 sm:pb-4">
        {/* Giant wordmark spanning the viewport width. leading-[0.75] pulls the
            baseline up so it sits flush with the bottom of the hero, matching
            the reference. */}
        <h1
          className="text-white font-black tracking-tight text-center px-2 select-none"
          style={{
            fontSize: "clamp(88px, 22vw, 320px)",
            lineHeight: 0.78,
            letterSpacing: "-0.04em",
          }}
        >
          {C.hero_wordmark}
        </h1>
      </div>
    </section>
  );
}

// ─── Intro ───────────────────────────────────────────────────────────────────

function Intro({ lang }) {
  const C = COPY[lang];
  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <section id="intro" className="py-16 sm:py-20 bg-background">
      <div className="max-w-3xl mx-auto px-5 text-center">
        <Reveal>
          <div className="flex justify-center mb-6">
            <div className="p-1.5 rounded-full border-2 border-primary/70">
              <img
                src={PORTRAIT_URL}
                alt={C.intro_name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover bg-white"
              />
            </div>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="text-2xl sm:text-3xl font-bold text-foreground mb-2"
            style={{ textWrap: "balance" }}
          >
            {C.intro_name}
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="text-primary font-semibold text-sm sm:text-base mb-4">
            {C.intro_title}
          </p>
        </Reveal>
        <Reveal delay={200}>
          <p
            className="text-muted-foreground text-sm sm:text-base leading-[1.9] max-w-xl mx-auto mb-8"
            style={{ textWrap: "pretty" }}
          >
            {C.intro_desc}
          </p>
        </Reveal>
        <Reveal delay={260}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <GlowButton href={BOOKING_URL} variant="primary">
              {C.intro_cta_primary}
              <ArrowUpRight className="w-4 h-4" />
            </GlowButton>
            <GlowButton onClick={scrollToServices} variant="outline_dark">
              {C.intro_cta_secondary}
            </GlowButton>
          </div>
        </Reveal>
        <Reveal delay={320}>
          <p className="text-xs text-muted-foreground mt-5">{C.intro_note}</p>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Problem ─────────────────────────────────────────────────────────────────

function Problem({ lang }) {
  const C = COPY[lang];
  return (
    <section id="problem" className="py-16 sm:py-20 bg-background">
      <div className="max-w-2xl mx-auto px-5">
        <Reveal>
          <h2
            className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-10"
            style={{ textWrap: "balance" }}
          >
            {C.problem_h}
          </h2>
        </Reveal>
        <ul className="space-y-5 mb-8">
          {C.problem_points.map((p, i) => (
            <Reveal key={i} delay={i * 80}>
              <li className="flex gap-3 items-start">
                <span className="mt-2 w-2 h-2 rounded-full bg-primary shrink-0" />
                <p
                  className="text-foreground text-sm sm:text-base leading-[1.9]"
                  style={{ textWrap: "pretty" }}
                >
                  {p}
                </p>
              </li>
            </Reveal>
          ))}
        </ul>
        <Reveal delay={200}>
          <p
            className="text-foreground font-bold text-sm sm:text-base leading-[1.9] mb-8"
            style={{ textWrap: "pretty" }}
          >
            {C.problem_close}
          </p>
        </Reveal>
        <Reveal delay={280}>
          <div className="flex justify-center">
            <GlowButton href={BOOKING_URL} variant="primary">
              {C.problem_cta}
              <ArrowUpRight className="w-4 h-4" />
            </GlowButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Services ────────────────────────────────────────────────────────────────

const ICON_FOR = { target: Target, megaphone: Megaphone, flask: FlaskConical };

function ServiceCard({ svc, delay }) {
  const Icon = ICON_FOR[svc.icon] || Target;
  return (
    <Reveal delay={delay}>
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-7 flex flex-col h-full shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3
          className="text-lg sm:text-xl font-bold text-foreground mb-3"
          style={{ textWrap: "balance" }}
        >
          {svc.title}
        </h3>
        <p
          className="text-muted-foreground text-sm leading-[1.9] mb-5"
          style={{ textWrap: "pretty" }}
        >
          {svc.desc}
        </p>
        {svc.scope_h && (
          <p className="text-foreground font-bold text-sm mb-3">{svc.scope_h}</p>
        )}
        <ul className="space-y-2.5 mb-5 flex-1">
          {svc.points.map((pt, i) => (
            <li key={i} className="flex gap-2.5 items-start">
              <Check className="w-4 h-4 text-primary shrink-0 mt-1" />
              <span className="text-foreground text-sm leading-[1.7]">{pt}</span>
            </li>
          ))}
        </ul>
        {svc.outcome && (
          <p
            className="text-foreground text-sm leading-[1.9] mb-5"
            style={{ textWrap: "pretty" }}
          >
            <span className="font-bold">{svc.outcome_h} </span>
            {svc.outcome}
          </p>
        )}
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center justify-center gap-2 h-12 rounded-full bg-primary text-primary-foreground font-semibold text-sm px-6 transition-transform hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_8px_20px_-8px_rgba(232,123,89,0.5)]"
        >
          {svc.cta}
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </Reveal>
  );
}

function Services({ lang }) {
  const C = COPY[lang];
  return (
    <section id="services" className="py-16 sm:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-5">
        <Reveal>
          <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] text-center mb-3">
            {C.services_label}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-12"
            style={{ textWrap: "balance" }}
          >
            {C.services_h}
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {C.services.map((svc, i) => (
            <ServiceCard key={i} svc={svc} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Marquee ─────────────────────────────────────────────────────────────────

// A single infinite horizontal marquee row. duration in seconds; higher = slower.
// Direction is fixed left→right visually via a negative translate on the track;
// the row content is duplicated so the loop is seamless.
function MarqueeRow({ items, duration = 40, reverse = false }) {
  const set = [...items, ...items];
  return (
    <div className="marquee-viewport">
      <div
        className="marquee-track"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {set.map((it, i) => (
          <div
            key={i}
            className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mx-2 sm:mx-3 shadow-sm p-2"
            title={it.name}
          >
            <img
              src={it.src}
              alt={it.name}
              className="object-contain"
              style={{ maxHeight: "60%", maxWidth: "85%" }}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function LogosBlock({ label, heading, subtitle, items }) {
  return (
    <section className="py-14 sm:py-20 bg-background" id={label}>
      <div className="max-w-6xl mx-auto px-5">
        <Reveal>
          <h2
            className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-3"
            style={{ textWrap: "balance" }}
          >
            {heading}
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p
            className="text-muted-foreground text-sm sm:text-base text-center max-w-2xl mx-auto mb-10 leading-[1.9]"
            style={{ textWrap: "pretty" }}
          >
            {subtitle}
          </p>
        </Reveal>
        <Reveal delay={140}>
          <div className="bg-card border border-border rounded-3xl p-4 sm:p-6 marquee-mask">
            <div className="flex flex-col gap-4">
              <MarqueeRow items={items.filter((_, i) => i % 2 === 0)} duration={42} />
              <MarqueeRow items={items.filter((_, i) => i % 2 === 1)} duration={54} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── About ───────────────────────────────────────────────────────────────────

function About({ lang }) {
  const C = COPY[lang];
  return (
    <section id="about" className="py-16 sm:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 items-center">
          <Reveal className="md:col-span-2">
            <div className="bg-card border border-border rounded-3xl p-4 shadow-sm">
              <img
                src={PORTRAIT_URL}
                alt={C.intro_name}
                className="w-full aspect-[4/5] object-cover rounded-2xl bg-muted"
              />
            </div>
          </Reveal>
          <div className="md:col-span-3">
            <Reveal delay={80}>
              <h2
                className="text-2xl sm:text-3xl font-bold text-foreground mb-2"
                style={{ textWrap: "balance" }}
              >
                {C.intro_name}
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="text-primary font-semibold text-sm sm:text-base mb-6">
                {C.intro_title}
              </p>
            </Reveal>
            <div className="space-y-4 mb-8">
              {C.about_paras.map((p, i) => (
                <Reveal key={i} delay={200 + i * 80}>
                  <p
                    className="text-foreground text-sm sm:text-base leading-[1.9]"
                    style={{ textWrap: "pretty" }}
                  >
                    {p}
                  </p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={500}>
              <GlowButton href={WHATSAPP_URL} variant="outline_dark">
                {C.about_cta}
              </GlowButton>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ───────────────────────────────────────────────────────────────

function FinalCTA({ lang }) {
  const C = COPY[lang];
  return (
    <section className="py-16 sm:py-24 bg-primary">
      <div className="max-w-3xl mx-auto px-5 text-center">
        <Reveal>
          <div className="w-16 h-16 rounded-full bg-white/15 border border-white/25 flex items-center justify-center mx-auto mb-6">
            <CalendarDays className="w-7 h-7 text-white" />
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ textWrap: "balance" }}
          >
            {C.final_h}
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p
            className="text-white/85 text-sm sm:text-base leading-[1.9] max-w-xl mx-auto mb-8"
            style={{ textWrap: "pretty" }}
          >
            {C.final_p}
          </p>
        </Reveal>
        <Reveal delay={200}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <GlowButton href={BOOKING_URL} variant="white">
              {C.final_book}
              <ArrowUpRight className="w-4 h-4" />
            </GlowButton>
            <GlowButton href={WHATSAPP_URL} variant="outline_white">
              <MessageCircle className="w-4 h-4" />
              {C.final_wa}
            </GlowButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function PageFooter({ lang }) {
  const C = COPY[lang];
  return (
    <footer className="bg-secondary text-secondary-foreground py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-5 text-center">
        <img
          src={LOGO_URL}
          alt="Consolve"
          className="h-8 w-auto mx-auto mb-5"
          style={{ mixBlendMode: "screen" }}
        />
        <p
          className="text-secondary-foreground/70 text-sm sm:text-base leading-[1.9] max-w-2xl mx-auto mb-6"
          style={{ textWrap: "pretty" }}
        >
          {C.footer_tagline}
        </p>
        <a
          href={HOME_URL}
          className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          {C.footer_home}
          <ArrowUpRight className="w-4 h-4" />
        </a>
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-secondary-foreground/50">
          <p>{C.footer_copy}</p>
          <div className="flex items-center gap-5">
            <a href={HOME_URL} className="hover:text-primary transition-colors">
              {C.footer_privacy}
            </a>
            <a href={HOME_URL} className="hover:text-primary transition-colors">
              {C.footer_terms}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Floating WhatsApp ───────────────────────────────────────────────────────

function WhatsAppIconSvg({ className = "w-6 h-6" }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.004 4c-6.627 0-12 5.373-12 12 0 2.117.551 4.186 1.598 6.01L4 28l6.146-1.562A11.94 11.94 0 0 0 16.004 28c6.627 0 12-5.373 12-12s-5.373-12-12-12zm5.387 17.461c-.295-.148-1.746-.861-2.016-.96-.271-.099-.468-.148-.665.148-.198.296-.764.96-.937 1.158-.172.197-.345.222-.64.074-.296-.148-1.247-.46-2.375-1.465-.878-.783-1.47-1.75-1.643-2.046-.172-.296-.018-.456.13-.603.133-.132.295-.345.443-.518.148-.172.197-.296.296-.493.098-.197.049-.37-.025-.518-.074-.148-.665-1.602-.911-2.194-.24-.576-.484-.498-.665-.507l-.567-.01c-.197 0-.517.074-.788.37-.27.296-1.034 1.01-1.034 2.464 0 1.453 1.059 2.858 1.207 3.055.148.197 2.083 3.18 5.047 4.46.705.304 1.256.486 1.685.622.708.225 1.353.193 1.862.117.568-.085 1.746-.714 1.992-1.403.246-.69.246-1.28.172-1.404-.074-.123-.27-.197-.566-.345z" />
    </svg>
  );
}

function WhatsAppFloat({ lang, isAr }) {
  const C = COPY[lang];
  const [bubble, setBubble] = useState(true);
  useEffect(() => {
    // Cycle: bubble stays 6s, hides for 9s, repeat.
    let visible = true;
    const t = setInterval(() => {
      visible = !visible;
      setBubble(visible);
    }, visible ? 6000 : 9000);
    return () => clearInterval(t);
  }, []);
  return (
    <div
      className={`fixed bottom-5 z-40 flex items-center gap-3 ${isAr ? "left-5 flex-row-reverse" : "right-5"}`}
    >
      {bubble && (
        <span className="bg-white text-secondary text-xs sm:text-sm font-medium px-4 py-2 rounded-full shadow-lg border border-border animate-in fade-in slide-in-from-bottom-1 duration-300">
          {C.wa_bubble}
        </span>
      )}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_10px_30px_-6px_rgba(37,211,102,0.55)] hover:-translate-y-0.5 active:scale-95 transition-transform"
      >
        <WhatsAppIconSvg className="w-7 h-7" />
      </a>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Abdulaziz() {
  const { lang, setLang, isAr, dir } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  usePageMetadata({
    title:
      lang === "ar"
        ? "عبدالعزيز الدايل — مستشار بحث وتطوير الأعمال | كونسولف"
        : "Abdulaziz Aldayel — R&D Consultant | Consolve",
    description:
      lang === "ar"
        ? "متخصص في دراسات السوق، وتحليل المنافسين، وتطوير المنتجات، وفرص النمو. احجز جلسة استشارية أولية لفهم التحدي وتحديد نطاق العمل."
        : "Specialized in market research, competitor analysis, product development, and growth opportunities. Book an initial session to scope your challenge.",
  });

  // Standalone page — assert dir/lang on the document (PublicLayout is not
  // wrapping us). Restore on unmount so the rest of the site is unaffected.
  useEffect(() => {
    const prevDir = document.documentElement.dir;
    const prevLang = document.documentElement.lang;
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.dir = prevDir;
      document.documentElement.lang = prevLang;
    };
  }, [lang, dir]);

  const C = COPY[lang];

  return (
    <div dir={dir} className="bg-background text-foreground font-inter">
      {/* Scoped CSS: rotating glow ring on primary/white buttons + marquee. */}
      <style>{`
        .abd-glow-wrap { position: relative; isolation: isolate; border-radius: 9999px; padding: 2px; }
        .abd-glow-wrap::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          padding: 2px;
          background: conic-gradient(from 0deg,
            rgba(232,123,89,0) 0deg,
            rgba(232,123,89,0.75) 60deg,
            rgba(255,255,255,0.4) 120deg,
            rgba(232,123,89,0) 200deg,
            rgba(232,123,89,0.75) 300deg,
            rgba(232,123,89,0) 360deg);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: abdGlowSpin 6s linear infinite;
          pointer-events: none;
          z-index: -1;
        }
        @keyframes abdGlowSpin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          .abd-glow-wrap::before { animation: none; }
        }

        .marquee-mask {
          -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%);
          mask-image: linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%);
        }
        .marquee-viewport {
          overflow: hidden;
          width: 100%;
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation-name: abdMarquee;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .marquee-viewport:hover .marquee-track { animation-play-state: paused; }
        @keyframes abdMarquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>

      <Header lang={lang} setLang={setLang} onOpenMenu={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} lang={lang} />

      <Hero lang={lang} />
      <Intro lang={lang} />
      <Problem lang={lang} />
      <Services lang={lang} />

      <div id="tools">
        <LogosBlock
          label="tools"
          heading={C.tools_h}
          subtitle={C.tools_p}
          items={TOOL_LOGOS}
        />
      </div>
      <div id="companies">
        <LogosBlock
          label="companies"
          heading={C.companies_h}
          subtitle={C.companies_p}
          items={COMPANY_LOGOS}
        />
      </div>

      <About lang={lang} />
      <FinalCTA lang={lang} />
      <PageFooter lang={lang} />

      <WhatsAppFloat lang={lang} isAr={isAr} />
    </div>
  );
}