import { useEffect } from "react";
import { useLanguage, setGlobalLang } from "@/lib/useLanguage";
import { usePageMetadata } from "@/lib/usePageMetadata";
import { captureAttribution } from "@/lib/attribution";
import { Footer } from "@/components/Layout";
import { auditStyles } from "@/components/audit/auditUi";
import AuditHeader from "@/components/audit/AuditHeader";
import AuditHero from "@/components/audit/AuditHero";
import AuditChallenges from "@/components/audit/AuditChallenges";
import AuditAbout from "@/components/audit/AuditAbout";
import AuditAreas from "@/components/audit/AuditAreas";
import AuditProcess from "@/components/audit/AuditProcess";
import AuditDeliverables from "@/components/audit/AuditDeliverables";
import AuditValue from "@/components/audit/AuditValue";
import AuditAudience from "@/components/audit/AuditAudience";
import AuditFAQ from "@/components/audit/AuditFAQ";
import AuditFormSection from "@/components/audit/AuditFormSection";

// Dedicated 1200×630 share image (headline + Consolve logo).
const SHARE_IMAGE = "https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/515ce58b1_Icon2.png";

const META = {
  ar: {
    title: "Management Audit | تقييم فعالية منظومة الإدارة | كونسولف",
    description: "تساعدكم كونسولف على تقييم فعالية منظومة الإدارة، وتحديد الفجوات وأسبابها، وربطها بأثرها على الأعمال، ثم ترتيب أولويات التحسين في خارطة عملية قابلة للمتابعة.",
    alt: "هل تدعم منظومة الإدارة نمو شركتكم؟ | كونسولف",
  },
  en: {
    title: "Management Audit | Management System Effectiveness Assessment | Consolve",
    description: "Consolve helps you assess the effectiveness of your management system, identify gaps and their causes, link them to their business impact, then prioritize improvements in a practical, trackable roadmap.",
    alt: "Is your management system supporting your company's growth? | Consolve",
  },
};

export default function ManagementAudit() {
  const { lang, dir } = useLanguage();
  const M = META[lang];

  usePageMetadata({
    title: M.title, description: M.description, rawTitle: true,
    image: SHARE_IMAGE, imageWidth: 1200, imageHeight: 630, imageAlt: M.alt,
  });

  // Arabic-first campaign page: default to Arabic unless the visitor already chose a language.
  useEffect(() => {
    if (!localStorage.getItem("consolve_lang")) setGlobalLang("ar");
    captureAttribution();
  }, []);

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

  return (
    <div dir={dir} style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
      <style>{auditStyles}</style>
      <AuditHeader />
      <AuditHero />
      <AuditChallenges />
      <AuditAbout />
      <AuditAreas />
      <AuditProcess />
      <AuditDeliverables />
      <AuditValue />
      <AuditAudience />
      <AuditFAQ />
      <AuditFormSection />
      <Footer />
    </div>
  );
}