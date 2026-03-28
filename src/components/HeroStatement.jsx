import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "../lib/useLanguage";

function CountUp({ target, duration = 900 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return <span ref={ref}>{count}</span>;
}

const METRICS_EN = [
  { value: 100, suffix: "+", label: "Projects Delivered" },
  { value: 20,  suffix: "+", label: "Clients Served" },
  { value: 10,  suffix: "+", label: "Industries Covered" },
  { value: 9,   suffix: "",  label: "Core Service Areas" },
];

const METRICS_AR = [
  { value: 100, suffix: "+", label: "مشروع تم تنفيذه" },
  { value: 20,  suffix: "+", label: "عميل تم خدمتهم" },
  { value: 10,  suffix: "+", label: "قطاعات تم خدمتها" },
  { value: 9,   suffix: "",  label: "مجالات استشارية" },
];

export default function HeroStatement() {
  const { lang, dir, isAr } = useLanguage();

  const headline = isAr
    ? ["تمكين", " المنظمات باستخدام مفاهيم ", "حديثة"]
    : ["Empowering", " Entities Through Modern ", "Concepts"];

  const highlightFirst = true; // index 0 is highlighted
  const highlightThird = isAr; // "حديثة" is index 2 in AR; in EN "Modern" is inside index 1

  const headlineEN = (
    <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground leading-[1.0] tracking-tight">
      <span className="text-primary">Empowering</span>
      {" Entities Through "}
      <span className="text-primary">Modern</span>
      {" Concepts"}
    </h2>
  );

  const headlineAR = (
    <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground leading-[1.0] tracking-tight" dir="rtl">
      <span className="text-primary">تمكين</span>
      {" المنظمات باستخدام مفاهيم "}
      <span className="text-primary">حديثة</span>
    </h2>
  );

  const metrics = isAr ? METRICS_AR : METRICS_EN;

  return (
    <section className="py-24 md:py-36 bg-background border-b border-border" dir={dir}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Section 1 — Split layout */}
        <div className={`flex flex-col ${isAr ? "md:flex-row-reverse" : "md:flex-row"} gap-16 md:gap-24 items-start mb-24 md:mb-32`}>

          {/* Headline side */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            {isAr ? headlineAR : headlineEN}
          </motion.div>

          {/* Supporting content side */}
          <motion.div
            className="flex-1 max-w-[480px]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-5">
              {isAr ? "ماذا نقدم؟" : "What we do?"}
            </p>
            <p className="text-muted-foreground text-base md:text-lg leading-[1.8]">
              {isAr
                ? "نساعد المؤسسات على تحويل الاستراتيجيات إلى نتائج ملموسة. من خلال نهج متكامل يشمل الاستراتيجية، العمليات، الحوكمة، والابتكار، نعمل مع الشركات لحل التحديات المعقدة، وتحسين الأداء، وتحقيق نمو مستدام. بدءًا من صياغة الرؤية وإعادة الهيكلة، وصولًا إلى تحسين العمليات، وإدارة المخاطر، والتوسع في الأسواق — نقدم حلولًا عملية تحقق أثرًا حقيقيًا."
                : "We help organizations transform strategy into measurable results. Through an integrated approach across strategy, operations, governance, and innovation, we partner with businesses to solve complex challenges, optimize performance, and unlock sustainable growth. From defining vision and restructuring organizations to improving operations, managing risk, and driving market expansion — we deliver practical solutions that create real impact."}
            </p>
          </motion.div>
        </div>

        {/* Section 2 — Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {metrics.map((m, i) => (
            <motion.div
              key={i}
              className={`flex flex-col ${isAr ? "items-end" : "items-start"} gap-2 p-6 md:p-8 rounded-2xl border border-border bg-card`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="text-4xl md:text-5xl font-black text-foreground tabular-nums">
                {isAr && m.suffix ? (
                  <><span className="text-primary">{m.suffix}</span><CountUp target={m.value} /></>
                ) : (
                  <><CountUp target={m.value} /><span className="text-primary">{m.suffix}</span></>
                )}
              </div>
              <p className="text-sm text-muted-foreground font-medium leading-snug">{m.label}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}