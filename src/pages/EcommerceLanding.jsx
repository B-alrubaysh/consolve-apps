import { useEffect, useRef, useState, useCallback } from "react";
import {
  Layers3, Users, ListChecks, TrendingUp, Megaphone, Home, Search, Shuffle, LogOut,
  PanelsTopLeft, Lightbulb, PackageCheck, BadgeCheck, PackageOpen, Boxes, Link2,
  GitCompareArrows, BadgePercent, ShieldCheck, Route, PackageSearch, FileText,
  Smartphone, Code2, ChevronDown, ShoppingCart, CreditCard, ClipboardCheck,
  BarChart3, MousePointerClick, Eye, Timer, ArrowDownUp, DollarSign, Target,
  Undo2, Gauge, ScrollText, Layers, CircleDot, CheckCircle2, RefreshCw, SlidersHorizontal, Sparkles,
  Store, CalendarDays, RotateCcw, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { WHATSAPP_URL } from "@/components/WhatsAppFloat";
import CTAButton from "@/components/CTAButton";
import { useLanguage, setGlobalLang } from "@/lib/useLanguage";
import t from "@/lib/translations";
import { SALLA, ZID, SHOPIFY, SNAPCHAT, META, ANALYTICS, CASE_STUDY } from "@/lib/landing-images";
import { usePageMetadata } from "@/lib/usePageMetadata";
import { HeroRail, RailBadge, heroRailStyles } from "@/components/ecom/HeroRails";

// Anchor id on the quote-request form section. The hero CTA scrolls to this.
export const ORDER_FORM_ID = "order-form";
function scrollToOrderForm() {
  document.getElementById(ORDER_FORM_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useInView(opts = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); if (!opts.repeat) obs.disconnect(); } }, { threshold: opts.threshold ?? 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function useCountUp(end, duration = 1600, active = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      setVal(Math.round(p * end));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, end, duration]);
  return val;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const WA = WHATSAPP_URL;
// Business WhatsApp number in full international format — country code + number,
// no "+" and no spaces. This is used to build wa.me/<phone>?text=<message>
// deep-links for the prefilled order form (wa.me/message/<id> links do NOT
// accept a ?text= parameter, so we cannot reuse the general WA link here).
const WHATSAPP_PHONE = "966593092097";

function buildWaLink(message) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${message}`;
}
const PING = "font-['PingAR'] font-bold";

function SectionTitle({ children, className = "", light = false }) {
  return <h2 className={`${PING} text-2xl sm:text-3xl md:text-4xl leading-tight ${light ? "text-white" : "text-[#102629]"} ${className}`}>{children}</h2>;
}

function FadeUp({ children, className = "", delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function PlatformLogo({ src, alt, size = "w-12 h-12", style = {} }) {
  return <img src={src} alt={alt} className={`${size} rounded-xl object-contain bg-white shadow-sm border border-gray-100`} style={style} loading="lazy" />;
}

// Simple SVG icon circles for platforms without logos
function PlatformCircle({ letter, color, size = "w-12 h-12" }) {
  return <div className={`${size} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm`} style={{ backgroundColor: color }}>{letter}</div>;
}

// Inline SVG brand icons for missing logos
function TikTokIcon({ className = "w-6 h-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13.2a8.16 8.16 0 005.58 2.19V12a4.85 4.85 0 01-3.58-1.59V6.69h3.58z" />
    </svg>
  );
}

function GoogleAdsIcon({ className = "w-6 h-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path d="M3.2 15.2L9.6 4h4.8l-6.4 11.2z" fill="#FBBC04" />
      <path d="M14.4 4L8 15.2l2.4 4.2L16.8 8.2z" fill="#4285F4" />
      <circle cx="6" cy="18" r="3" fill="#34A853" />
    </svg>
  );
}

function WooCommerceIcon({ className = "w-6 h-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="#96588A" className={className}>
      <path d="M2 4h20a1 1 0 011 1v10a1 1 0 01-1 1H2a1 1 0 01-1-1V5a1 1 0 011-1zm4 3c-.6 0-1 .7-1 1.5v3c0 .8.4 1.5 1 1.5s1-.7 1-1.5v-3C7 7.7 6.6 7 6 7zm4 0c-.6 0-1 .7-1 1.5v3c0 .8.4 1.5 1 1.5s1-.7 1-1.5v-3c0-.8-.4-1.5-1-1.5zm6.5.5c-.3 0-.5.2-.7.5l-1.3 3.5-1.3-3.5c-.2-.3-.4-.5-.7-.5-.4 0-.7.4-.5.9l2 4.6c.1.3.3.5.5.5s.4-.2.5-.5l2-4.6c.2-.5-.1-.9-.5-.9zM8 19l2 2m4-2l2 2" />
    </svg>
  );
}

function GTMIcon({ className = "w-6 h-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path d="M12 2L2 12l10 10 10-10L12 2zm0 3l7 7-7 7-7-7 7-7z" fill="#8AB4F8" />
      <path d="M12 8v8M8 12h8" stroke="#4285F4" strokeWidth="2" fill="none" />
    </svg>
  );
}

// Inline WhatsApp glyph (lucide has no brand icons)
function WhatsAppIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.004 4c-6.627 0-12 5.373-12 12 0 2.117.551 4.186 1.598 6.01L4 28l6.146-1.562A11.94 11.94 0 0 0 16.004 28c6.627 0 12-5.373 12-12s-5.373-12-12-12zm0 21.818a9.79 9.79 0 0 1-4.99-1.36l-.358-.213-3.647.927.973-3.557-.234-.366a9.78 9.78 0 0 1-1.51-5.249c0-5.418 4.408-9.826 9.826-9.826 5.417 0 9.825 4.408 9.825 9.826 0 5.417-4.408 9.818-9.825 9.818zm5.387-7.357c-.295-.148-1.746-.861-2.016-.96-.271-.099-.468-.148-.665.148-.198.296-.764.96-.937 1.158-.172.197-.345.222-.64.074-.296-.148-1.247-.46-2.375-1.465-.878-.783-1.47-1.75-1.643-2.046-.172-.296-.018-.456.13-.603.133-.132.295-.345.443-.518.148-.172.197-.296.296-.493.098-.197.049-.37-.025-.518-.074-.148-.665-1.602-.911-2.194-.24-.576-.484-.498-.665-.507l-.567-.01c-.197 0-.517.074-.788.37-.27.296-1.034 1.01-1.034 2.464 0 1.453 1.059 2.858 1.207 3.055.148.197 2.083 3.18 5.047 4.46.705.304 1.256.486 1.685.622.708.225 1.353.193 1.862.117.568-.085 1.746-.714 1.992-1.403.246-.69.246-1.28.172-1.404-.074-.123-.27-.197-.566-.345z" />
    </svg>
  );
}

// ─── Hero rails (horizontal replacement for the old orbit system) ───────────
// See @/components/ecom/HeroRails for the reusable rail primitives. The old
// concentric orbits collided with the headline on mobile — three horizontal
// rails above the copy are in the layout flow, cannot overlap the text, and
// stay legible because logos travel in a straight line.

/* Old orbit primitives removed — replaced by HeroRail / RailBadge from
   @/components/ecom/HeroRails. Kept this block empty on purpose so the diff
   is easy to review. */



// ─── Section 1: Hero ─────────────────────────────────────────────────────────

function HeroSection() {
  const { lang } = useLanguage();
  const E = t[lang].ecom;
  const IMG = {
    snapchat: SNAPCHAT,
    meta: META,
    salla: SALLA,
    zid: ZID,
    shopify: SHOPIFY,
    analytics: ANALYTICS,
  };

  return (
    <section className="relative overflow-hidden flex items-center -mt-20" style={{ background: "#F7F7F5", minHeight: "100svh" }}>
      {/* 1) Grid pattern */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(13,37,40,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(13,37,40,0.05) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
      {/* 2) Coral + Teal glows */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 55% 45% at 30% 36%, rgba(232,123,89,0.16) 0%, transparent 64%), radial-gradient(ellipse 52% 44% at 74% 66%, rgba(13,37,40,0.10) 0%, transparent 64%)",
      }} />
      {/* Soft blur layers */}
      <div className="absolute -z-0 pointer-events-none rounded-full" style={{ width: "440px", height: "440px", top: "-10%", right: "-8%", background: "rgba(232,123,89,0.10)", filter: "blur(90px)" }} />
      <div className="absolute -z-0 pointer-events-none rounded-full" style={{ width: "400px", height: "400px", bottom: "-12%", left: "-8%", background: "rgba(13,37,40,0.08)", filter: "blur(90px)" }} />
      {/* Very light noise texture */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-multiply"
        style={{
          opacity: 0.035,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Hero rails scoped animation CSS */}
      <style>{heroRailStyles}</style>

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 py-16 sm:py-16 w-full">
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          {/* Three horizontal rails ABOVE the headline. dir="ltr" fixes the motion
              geometry across both languages (no text inside the rails). The negative
              marginInline cancels the container's px-4/sm:px-6 so rails span edge
              to edge on every viewport, in both LTR and RTL. */}
          <FadeUp>
            <div dir="ltr" className="flex flex-col gap-1 sm:gap-2 mb-8 sm:mb-10" style={{ marginInline: "calc(50% - 50vw)" }}>
              {/* Rail 1 — Advertising platforms + Analytics */}
              <HeroRail duration={100} delay={-18} heightPx={118} gap="clamp(52px, 11vw, 86px)">
                <RailBadge src={IMG.snapchat} sizePx={62} depth={1} />
                <RailBadge sizePx={58} depth={0.92}><TikTokIcon className="w-6 h-6 text-[#0D2528]" /></RailBadge>
                <RailBadge src={IMG.meta} sizePx={60} depth={0.94} />
                <RailBadge sizePx={58} depth={0.88}><GoogleAdsIcon className="w-7 h-7" /></RailBadge>
                <RailBadge src={IMG.analytics} sizePx={58} depth={0.86} />
              </HeroRail>

              {/* Rail 2 — Store platforms — reverse direction */}
              <HeroRail duration={90} reverse delay={-41} heightPx={108} gap="clamp(46px, 10vw, 76px)" lineColor="rgba(232,123,89,0.38)" inset="1.5%">
                <RailBadge src={IMG.salla} sizePx={54} depth={0.72} />
                <RailBadge src={IMG.zid} sizePx={52} depth={0.68} />
                <RailBadge src={IMG.shopify} sizePx={52} depth={0.66} />
                <RailBadge sizePx={50} depth={0.62}><WooCommerceIcon className="w-6 h-6 text-[#0D2528]" /></RailBadge>
              </HeroRail>

              {/* Rail 3 — Checkout — quietest and farthest */}
              <HeroRail duration={72} delay={-3} heightPx={96} gap="clamp(42px, 9vw, 68px)" lineColor="rgba(13,37,40,0.18)" inset="2%">
                <RailBadge sizePx={42} depth={0.4}><ShoppingCart className="w-5 h-5 text-[#0D2528]" /></RailBadge>
                <RailBadge sizePx={42} depth={0.38}><CreditCard className="w-5 h-5 text-[#0D2528]" /></RailBadge>
                <RailBadge sizePx={42} depth={0.36}><PackageCheck className="w-5 h-5 text-[#0D2528]" /></RailBadge>
              </HeroRail>
            </div>
          </FadeUp>

          <FadeUp>
            <h1 className={`${PING} text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.3] text-[#102629] mb-5`}>
              {E.hero_h1}
            </h1>
          </FadeUp>
          <FadeUp delay={150}>
            <p className="text-[#3D4D4F] text-base sm:text-lg leading-relaxed mb-9 max-w-xl mx-auto">
              {E.hero_sub}
            </p>
          </FadeUp>
          <FadeUp delay={300}>
            {/* Single CTA — scrolls to the order form. WhatsApp only opens
                after the visitor picks their options, so we never receive an
                empty message from the hero. */}
            <div className="flex items-center justify-center">
              <CTAButton variant="primary" cta size="block" className="sm:w-auto" onClick={scrollToOrderForm}>
                {E.hero_cta1}
              </CTAButton>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ─── Section 2: Experience Stats ─────────────────────────────────────────────

// One animated stat card. Extracted so useCountUp is called at the top level of
// a component (not inside a .map callback), satisfying react-hooks/rules-of-hooks.
function StatCard({ n, label, inView }) {
  const val = useCountUp(n, 1600, inView);
  return (
    <div className="flex-1 text-center px-6 py-8 sm:py-4">
      <div className={`${PING} text-6xl text-[#0D2528] leading-none mb-3`}>{val}</div>
      <p className="text-sm text-[#718487] leading-relaxed max-w-[20ch] mx-auto">{label}</p>
    </div>
  );
}

function StatsSection() {
  const [ref, inView] = useInView();
  const { lang } = useLanguage();
  const E = t[lang].ecom;
  const stats = E.stats;
  return (
    <section className="py-16 sm:py-20 bg-white" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Moved from Hero: intro message + supporting paragraphs */}
        <div className="max-w-2xl mx-auto text-center mb-14 sm:mb-16">
          <FadeUp><SectionTitle className="mb-5">{E.intro_title}</SectionTitle></FadeUp>
          <FadeUp delay={80}>
            <p className="text-[#3D4D4F] text-base sm:text-lg leading-relaxed mb-4">
              {E.intro_p1}
            </p>
          </FadeUp>
          <FadeUp delay={160}>
            <p className="text-[#718487] text-sm sm:text-base leading-relaxed">
              {E.intro_p2}
            </p>
          </FadeUp>
        </div>
        <FadeUp><SectionTitle className="text-center mb-12">{E.stats_title}</SectionTitle></FadeUp>
        <FadeUp>
          <div className="flex flex-col sm:flex-row items-stretch justify-center max-w-3xl mx-auto divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-[#0D2528]/10">
            {stats.map((s, i) => (
              <StatCard key={i} n={s.n} label={s.label} inView={inView} />
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Shared MockupWindow (used by DashboardSection) ────────────────────────

function MockupWindow({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm ${className}`}>
      <div className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

// ─── Section 5: Landing-page portfolio (phone carousel) ─────────────────────
//
// Data-driven. To add or swap a project, edit CASE_PROJECTS only. Drop a tall
// mobile screenshot into /public/images/case-studies/ and set `image` to its
// path; leave `image: null` to render the built-in demo skeleton instead.
// The first slide is always the real Remover project.

// Non-translatable per-case metadata; all case copy lives in translations.js
// (ecom.cases) and is merged in by index inside CaseStudiesSection.
const CASE_META = [
  { id: "remover", real: true, image: CASE_STUDY, accent: "#2E7D6B" },
  { id: "skincare", real: false, image: null, accent: "#E87B59" },
  { id: "accessories", real: false, image: null, accent: "#0D2528" },
  { id: "launch", real: false, image: null, accent: "#3D4D4F" },
];

// A tasteful device frame — thin bezel, quiet speaker bar, no gimmicks.
function PhoneFrame({ children }) {
  return (
    <div className="relative mx-auto w-[248px] max-w-full">
      <div className="rounded-[42px] bg-[#0D2528] p-2.5 shadow-[0_34px_70px_-24px_rgba(13,37,40,0.5)]">
        <div className="relative rounded-[34px] overflow-hidden bg-white" style={{ aspectRatio: "9 / 19.2" }}>
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-14 h-1.5 rounded-full bg-black/25 z-20" />
          {children}
        </div>
      </div>
    </div>
  );
}

// Built-in polished skeleton for demo projects that have no screenshot yet.
function DemoScreen({ accent }) {
  return (
    <div className="absolute inset-0 flex flex-col gap-2.5 p-3.5 pt-8 bg-[#FAFAF8]">
      <div className="h-7 rounded-lg" style={{ background: accent }} />
      <div className="h-24 rounded-2xl bg-gray-100" />
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => <div key={i} className="h-14 rounded-xl bg-gray-100" />)}
      </div>
      <div className="h-2.5 w-3/4 rounded bg-gray-100" />
      <div className="h-2.5 w-1/2 rounded bg-gray-100" />
      <div className="h-16 rounded-2xl bg-gray-100" />
      <div className="mt-auto h-9 rounded-xl" style={{ background: accent, opacity: 0.92 }} />
    </div>
  );
}

function PhoneScreen({ project }) {
  if (project.image) {
    // object-contain / object-top shows the full page width with no side cropping and
    // never distorts the aspect ratio. The current Remover asset is a partial-height
    // screenshot, so a little whitespace can appear below it — replace `image` with a
    // fuller-length screenshot to fill the frame. Do NOT AI-upscale or stretch.
    return (
      <div className="absolute inset-0 bg-white">
        <img
          src={project.image}
          alt={project.alt}
          className="w-full h-full object-contain object-top"
          loading="lazy"
        />
      </div>
    );
  }
  return <DemoScreen accent={project.accent} />;
}

function CaseStudiesSection() {
  const { lang } = useLanguage();
  const E = t[lang].ecom;
  // Merge non-translatable meta with the translated copy (by index).
  const projects = CASE_META.map((m, i) => ({
    ...m,
    ...E.cases[i],
    alt: `${E.case_alt_prefix} ${E.cases[i].title}`,
  }));
  // TEMPORARY LOCK: only the real Remover slide (index 0) is reachable.
  // Cases 2–4 stay in CASE_PROJECTS but all navigation is disabled until their
  // content is ready. Flip LOCKED to false to re-enable the full carousel
  // (arrows, dots, and swipe are all already wired below).
  const LOCKED = true;
  const [active, setActive] = useState(0);
  const go = (d) => { if (LOCKED) return; setActive((a) => (a + d + projects.length) % projects.length); };
  const p = projects[active];

  // Mobile swipe — no-op while locked
  const startX = useRef(null);
  const onTouchStart = (e) => { if (LOCKED) return; startX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (LOCKED || startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 44) go(dx < 0 ? 1 : -1);
    startX.current = null;
  };

  return (
    <section className="py-16 sm:py-24 overflow-hidden" style={{ background: "#F7F7F5" }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <FadeUp><SectionTitle className="text-center mb-4">{E.cases_title}</SectionTitle></FadeUp>
        <FadeUp delay={100}>
          <p className="text-center text-[#718487] text-sm sm:text-base max-w-3xl mx-auto mb-12 sm:mb-14 leading-relaxed">
            {E.cases_sub}
          </p>
        </FadeUp>

        <FadeUp delay={150}>
          <div className="relative">
            {/* Desktop arrows — hidden while the carousel is locked to the first slide */}
            {!LOCKED && (
              <>
                <button
                  onClick={() => go(1)}
                  aria-label={E.carousel_next}
                  className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 -translate-x-2 z-20 w-11 h-11 items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm text-[#0D2528] hover:bg-[#0D2528] hover:text-white hover:border-[#0D2528] transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => go(-1)}
                  aria-label={E.carousel_prev}
                  className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 translate-x-2 z-20 w-11 h-11 items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm text-[#0D2528] hover:bg-[#0D2528] hover:text-white hover:border-[#0D2528] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Slide */}
            <div
              className={`bg-white rounded-[28px] border border-gray-100 shadow-[0_20px_60px_-30px_rgba(13,37,40,0.35)] p-6 sm:p-10 ${LOCKED ? "" : "md:mx-14"}`}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <div key={p.id} className="case-slide grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Text side */}
                <div className="order-2 lg:order-1 text-center lg:text-start">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                    <span className="inline-block text-[11px] font-semibold text-[#E87B59] bg-[#E87B59]/10 px-3 py-1 rounded-full">{p.tag}</span>
                    <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${p.real ? "bg-[#0D2528] text-white" : "bg-gray-100 text-[#718487]"}`}>
                      {p.real ? E.badge_real : E.badge_demo}
                    </span>
                  </div>
                  <h3 className={`${PING} text-xl sm:text-2xl text-[#0D2528] mb-4`}>{p.title}</h3>
                  <div className="mb-4">
                    <span className={`${PING} text-4xl sm:text-5xl text-[#E87B59]`}>{p.result}</span>
                    <p className="text-sm text-[#718487] mt-1">{p.resultLabel}</p>
                  </div>
                  <p className="text-sm text-[#3D4D4F] leading-relaxed mb-6 max-w-md mx-auto lg:mx-0">{p.description}</p>
                  <CTAButton asChild variant="primary" cta>
                    <a href={WA} target="_blank" rel="noopener noreferrer">{E.case_cta}</a>
                  </CTAButton>
                </div>

                {/* Phone side */}
                <div className="order-1 lg:order-2 flex justify-center">
                  <PhoneFrame><PhoneScreen project={p} /></PhoneFrame>
                </div>
              </div>
            </div>

            {/* Pagination — only when the full carousel is unlocked. While locked to
                the single real case, showing faint disabled dots would advertise the
                empty slots; a lone confident showcase reads stronger. */}
            {!LOCKED && (
              <div className="flex items-center justify-center gap-2.5 mt-8">
                {projects.map((pr, i) => {
                  const isActive = i === active;
                  return (
                    <button
                      key={pr.id}
                      onClick={() => setActive(i)}
                      aria-label={`${E.carousel_goto_prefix} ${pr.title}`}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isActive ? "w-7 bg-[#E87B59]" : "w-2 bg-[#0D2528]/20 hover:bg-[#0D2528]/40"
                      }`}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </FadeUp>
      </div>

      <style>{`
        @keyframes phoneScroll {
          0%, 10% { transform: translateY(0); }
          46%, 60% { transform: translateY(-58%); }
          94%, 100% { transform: translateY(0); }
        }
        .motion-safe\\:animate-phone-scroll { animation: phoneScroll 16s ease-in-out infinite; }
        @keyframes caseSlideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .case-slide { animation: caseSlideIn 0.45s cubic-bezier(0.22, 1, 0.36, 1); }
        @media (prefers-reduced-motion: reduce) {
          .motion-safe\\:animate-phone-scroll { animation: none !important; }
          .case-slide { animation: none !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Section 7: What We Offer ────────────────────────────────────────────────

function ServicesSection() {
  const { lang } = useLanguage();
  const E = t[lang].ecom;
  const services = E.services;
  return (
    <section id="services-section" className="py-16 sm:py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <FadeUp><SectionTitle className="text-center mb-12">{E.services_title}</SectionTitle></FadeUp>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-14 max-w-4xl mx-auto border-t border-[#0D2528]/10">
          {services.map((s, i) => (
            <FadeUp key={i} delay={i * 60}>
              <div className="flex gap-5 py-6 border-b border-[#0D2528]/10">
                <span className={`${PING} text-2xl text-[#E87B59] leading-none w-9 shrink-0 pt-0.5`} style={{ fontVariantNumeric: "tabular-nums" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className={`${PING} text-base text-[#0D2528] mb-1.5`}>{s.title}</h3>
                  <p className="text-sm text-[#718487] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 10: KPI Metrics ─────────────────────────────────────────────────

function KPISection() {
  const { lang } = useLanguage();
  const E = t[lang].ecom;
  const kpis = E.kpis;
  return (
    <section className="py-16 sm:py-20" style={{ background: "#F7F7F5" }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <FadeUp><SectionTitle className="text-center mb-4">{E.kpi_title}</SectionTitle></FadeUp>
        <FadeUp delay={100}><p className="text-center text-[#718487] text-sm sm:text-base max-w-3xl mx-auto mb-10">{E.kpi_sub}</p></FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-14 max-w-3xl mx-auto border-t border-[#0D2528]/10">
          {kpis.map((k, i) => (
            <FadeUp key={i} delay={i * 30}>
              <div className="flex items-center gap-3 py-3.5 border-b border-[#0D2528]/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E87B59] shrink-0" aria-hidden="true" />
                <span className="text-sm text-[#3D4D4F]">{k}</span>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 11: Dashboard Mockup ────────────────────────────────────────────

function ConversionLineChart() {
  const { lang } = useLanguage();
  const E = t[lang].ecom;
  const values = [1.4, 1.7, 2.1, 2.4, 2.8, 3.2];
  const weeks = values.map((_, i) => `${E.week_prefix} ${i + 1}`);
  const w = 560, h = 200, padX = 30, padY = 24;
  const min = 1.0, max = 3.4;
  // RTL: week 1 sits on the right, later weeks to the left, so time reads
  // right-to-left with the page. The rising trend still reads as improvement.
  const x = (i) => padX + ((values.length - 1 - i) * (w - padX * 2)) / (values.length - 1);
  const y = (v) => h - padY - ((v - min) / (max - min)) * (h - padY * 2);

  const linePath = values.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ");
  const areaPath = `${linePath} L ${x(values.length - 1)} ${h - padY} L ${x(0)} ${h - padY} Z`;

  return (
    <div>
      <p className={`${PING} text-sm text-[#0D2528] mb-2`}>{E.chart_title}</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
        <defs>
          <linearGradient id="convAreaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E87B59" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#E87B59" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Baseline */}
        <line x1={padX} y1={h - padY} x2={w - padX} y2={h - padY} stroke="#E7E9E8" strokeWidth="1" />
        {/* Area fill */}
        <path d={areaPath} fill="url(#convAreaFill)" />
        {/* Line */}
        <path d={linePath} fill="none" stroke="#E87B59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots + labels */}
        {values.map((v, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(v)} r="4" fill="#E87B59" stroke="white" strokeWidth="1.5" />
            <text x={x(i)} y={y(v) - 10} textAnchor="middle" fontSize="10" fill="#0D2528" fontWeight="600">{v}%</text>
            <text x={x(i)} y={h - 6} textAnchor="middle" fontSize="8" fill="#718487">{weeks[i]}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function DashboardSection() {
  const { lang } = useLanguage();
  const E = t[lang].ecom;
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <FadeUp><SectionTitle className="text-center mb-4">{E.dash_title}</SectionTitle></FadeUp>
        <FadeUp delay={100}><p className="text-center text-[#718487] text-sm sm:text-base max-w-3xl mx-auto mb-10">{E.dash_sub}</p></FadeUp>
        <FadeUp delay={200}>
          <MockupWindow className="max-w-3xl mx-auto">
            <div className="relative">
              <span className="absolute top-2 left-2 text-[10px] text-[#718487] bg-[#F7F7F5] px-2 py-0.5 rounded">{E.demo_data}</span>
              {/* Top stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 pt-6">
                {E.dash_stats.map((s, i) => (
                  <div key={i} className="bg-[#F7F7F5] rounded-xl p-3 text-center">
                    <div className={`${PING} text-lg text-[#0D2528]`}>{s.val}</div>
                    <p className="text-[10px] text-[#718487]">{s.label}</p>
                  </div>
                ))}
              </div>
              {/* Line chart */}
              <div className="bg-[#F7F7F5] rounded-xl p-4 mb-4">
                <ConversionLineChart />
              </div>
              {/* Comparison */}
              <div className="grid grid-cols-3 gap-3">
                {E.dash_cmp.map((s, i) => (
                  <div key={i} className="bg-[#F7F7F5] rounded-lg p-2 text-center">
                    <div className="text-sm font-semibold text-[#0D2528]">{s.val}</div>
                    <p className="text-[9px] text-[#718487]">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </MockupWindow>
        </FadeUp>
        <FadeUp delay={300}>
          <div className="text-center mt-6 space-y-2">
            <span className="inline-block bg-[#E87B59]/10 text-[#E87B59] font-semibold text-sm px-4 py-1.5 rounded-full">{E.dash_price_badge}</span>
            <p className="text-xs text-[#718487]">{E.dash_price_note}</p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Section 12: Quote Request Form ─────────────────────────────────────────

function PricingSection() {
  const { lang } = useLanguage();
  const E = t[lang].ecom;

  const pageCountOptions = [1, 2, 3, 4, 5];

  // Static (non-translatable) option metadata merged by index with translated labels.
  const PAGE_TYPE_META = [
    { id: "product", Icon: PackageSearch },
    { id: "offer", Icon: BadgePercent },
    { id: "campaign", Icon: Megaphone },
    { id: "info", Icon: FileText },
  ];
  const pageTypes = PAGE_TYPE_META.map((m, i) => ({ ...m, ...E.pageTypes[i] }));

  const PLATFORM_META = [
    { id: "salla", src: SALLA },
    { id: "zid", src: ZID },
    { id: "shopify", src: SHOPIFY },
    { id: "other", icon: <Store className="w-6 h-6 text-[#718487]" /> },
  ];
  const platforms = PLATFORM_META.map((m, i) => ({ ...m, label: E.platforms[i] }));

  const START_META = [{ id: "week" }, { id: "month" }, { id: "quarter" }, { id: "undecided" }];
  const startOptions = START_META.map((m, i) => ({ ...m, label: E.startOptions[i] }));

  const [pages, setPages] = useState(1);
  const [pageType, setPageType] = useState("product");
  const [mixedTypes, setMixedTypes] = useState(false);
  const [mixedNote, setMixedNote] = useState("");
  const [platform, setPlatform] = useState("salla");
  const [platformOther, setPlatformOther] = useState("");
  const [dashboard, setDashboard] = useState(false);
  const [startTime, setStartTime] = useState("month");

  const dashboardTotal = dashboard ? pages * 800 : 0;
  const fmt = (n) => n.toLocaleString("en-US");

  const pageTypeLabel = pageTypes.find((opt) => opt.id === pageType)?.label || "";
  const platformLabel =
    platform === "other" && platformOther.trim()
      ? platformOther.trim()
      : platforms.find((opt) => opt.id === platform)?.label || "";
  const startLabel = startOptions.find((opt) => opt.id === startTime)?.label || "";

  const waMessage = encodeURIComponent(
    [
      E.wa_greeting,
      "",
      E.wa_intro,
      "",
      E.wa_details_header,
      "",
      E.wa_pages(pages),
      E.wa_type(mixedTypes ? E.mixed_types_short : pageTypeLabel),
      ...(mixedTypes && mixedNote.trim() ? [E.wa_types_detail(mixedNote.trim())] : []),
      E.wa_platform(platformLabel),
      E.wa_tracking(dashboard),
      E.wa_start(startLabel),
      "",
      E.wa_closing,
    ].join("\n")
  );
  const waLink = buildWaLink(waMessage);

  const includedServices = E.included;

  return (
    <section id={ORDER_FORM_ID} className="py-16 sm:py-20" style={{ background: "#F7F7F5" }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <FadeUp><SectionTitle className="text-center mb-3">{E.price_title}</SectionTitle></FadeUp>
        <FadeUp delay={100}><p className="text-center text-[#718487] text-sm sm:text-base max-w-3xl mx-auto mb-10">{E.price_sub}</p></FadeUp>

        <FadeUp delay={200}>
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            {/* Left column: form steps */}
            <div className="flex-1 w-full space-y-6">
              {/* 1. Page count */}
              <div className="bg-white rounded-2xl p-5">
                <h3 className={`${PING} text-sm text-[#0D2528] mb-3`}>{E.step1_title}</h3>
                <div className="grid grid-cols-5 gap-2">
                  {pageCountOptions.map((n) => (
                    <button
                      key={n}
                      onClick={() => setPages(n)}
                      className={`rounded-xl py-3 text-center transition-all border-2 ${
                        pages === n
                          ? "bg-[#E87B59] border-[#E87B59] text-white shadow-md"
                          : "bg-white border-gray-100 hover:border-[#E87B59]/40 text-[#0D2528]"
                      }`}
                    >
                      <span className={`${PING} text-base block`}>{n === 5 ? "+5" : n}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Page type */}
              <div className="bg-white rounded-2xl p-5">
                <h3 className={`${PING} text-sm text-[#0D2528] mb-3`}>{E.step2_title}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pageTypes.map((pt) => (
                    <button
                      key={pt.id}
                      onClick={() => setPageType(pt.id)}
                      disabled={mixedTypes}
                      className={`text-start rounded-xl p-4 border-2 transition-all ${mixedTypes ? "opacity-40 cursor-not-allowed" : ""} ${
                        pageType === pt.id && !mixedTypes
                          ? "bg-[#E87B59]/10 border-[#E87B59]"
                          : "bg-[#F7F7F5] border-transparent hover:border-[#E87B59]/30"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <pt.Icon className={`w-4 h-4 shrink-0 ${pageType === pt.id && !mixedTypes ? "text-[#E87B59]" : "text-[#718487]"}`} />
                        <span className={`${PING} text-sm ${pageType === pt.id && !mixedTypes ? "text-[#0D2528]" : "text-[#3D4D4F]"}`}>{pt.label}</span>
                      </div>
                      <p className="text-xs text-[#718487] leading-relaxed">{pt.desc}</p>
                    </button>
                  ))}
                </div>

                {pages > 1 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <div
                        onClick={() => setMixedTypes(!mixedTypes)}
                        className={`mt-0.5 w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${mixedTypes ? "bg-[#E87B59] border-[#E87B59]" : "border-gray-300"}`}
                      >
                        {mixedTypes && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-xs text-[#3D4D4F] select-none" onClick={() => setMixedTypes(!mixedTypes)}>{E.mixed_label}</span>
                    </label>
                    {mixedTypes && (
                      <input
                        type="text"
                        value={mixedNote}
                        onChange={(e) => setMixedNote(e.target.value)}
                        placeholder={E.mixed_placeholder}
                        className="mt-3 w-full text-sm rounded-xl border border-gray-200 px-3.5 py-2.5 text-[#0D2528] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E87B59]/30 focus:border-[#E87B59]"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* 3. Store platform */}
              <div className="bg-white rounded-2xl p-5">
                <h3 className={`${PING} text-sm text-[#0D2528] mb-3`}>{E.step3_title}</h3>
                <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
                  {platforms.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPlatform(p.id)}
                      className={`flex flex-col items-center gap-1.5 rounded-xl p-3 border-2 transition-all ${
                        platform === p.id ? "bg-[#E87B59]/10 border-[#E87B59]" : "bg-[#F7F7F5] border-transparent hover:border-[#E87B59]/30"
                      }`}
                    >
                      {p.src ? (
                        <img src={p.src} alt={p.label} className="w-8 h-8 rounded-lg object-contain bg-white" loading="lazy" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-gray-100">{p.icon}</div>
                      )}
                      <span className="text-[10px] text-[#3D4D4F] text-center leading-tight">{p.label}</span>
                    </button>
                  ))}
                </div>
                {platform === "other" && (
                  <input
                    type="text"
                    value={platformOther}
                    onChange={(e) => setPlatformOther(e.target.value)}
                    placeholder={E.platform_other_placeholder}
                    className="mt-3 w-full text-sm rounded-xl border border-gray-200 px-3.5 py-2.5 text-[#0D2528] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E87B59]/30 focus:border-[#E87B59]"
                  />
                )}
              </div>

              {/* 4. Dashboard add-on */}
              <div className={`rounded-2xl p-4 sm:p-5 border-2 transition-colors cursor-pointer ${dashboard ? "bg-[#0D2528] border-[#0D2528]" : "bg-white border-gray-100"}`} onClick={() => setDashboard(!dashboard)}>
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${dashboard ? "bg-[#E87B59] border-[#E87B59]" : "border-gray-300"}`}>
                    {dashboard && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`${PING} text-sm ${dashboard ? "text-white" : "text-[#0D2528]"}`}>{E.step4_title}</h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${dashboard ? "bg-[#E87B59] text-white" : "bg-[#E87B59]/10 text-[#E87B59]"}`}>{E.step4_badge}</span>
                    </div>
                    <p className={`text-xs mt-1.5 leading-relaxed ${dashboard ? "text-white/60" : "text-[#718487]"}`}>
                      {E.step4_desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* 5. Start date */}
              <div className="bg-white rounded-2xl p-5">
                <h3 className={`${PING} text-sm text-[#0D2528] mb-3`}>{E.step5_title}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {startOptions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStartTime(s.id)}
                      className={`rounded-xl py-2.5 px-2 text-center transition-all border-2 ${
                        startTime === s.id ? "bg-[#E87B59] border-[#E87B59] text-white" : "bg-white border-gray-100 hover:border-[#E87B59]/40 text-[#0D2528]"
                      }`}
                    >
                      <span className="text-xs font-semibold">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Included services checklist */}
              <div className="bg-white rounded-2xl p-5">
                <h3 className={`${PING} text-sm text-[#0D2528] mb-3`}>{E.included_title}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {includedServices.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-[#3D4D4F]">
                      <CheckCircle2 className="w-4 h-4 text-[#E87B59] shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#718487] mt-4">{E.included_note}</p>
              </div>
            </div>

            {/* Right column: request summary (sticky on desktop) */}
            <div className="w-full lg:w-[360px] lg:sticky lg:top-8 shrink-0">
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
                <h3 className={`${PING} text-base text-[#0D2528] mb-4`}>{E.summary_title}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#718487]">{E.sum_pages}</span>
                    <span className="text-[#0D2528] font-semibold">{pages === 5 ? "+5" : pages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#718487]">{E.sum_type}</span>
                    <span className="text-[#0D2528] font-semibold text-xs">{mixedTypes ? E.mixed_types_short : pageTypeLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#718487]">{E.sum_platform}</span>
                    <span className="text-[#0D2528] font-semibold">{platformLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#718487]">{E.sum_tracking}</span>
                    <span className="text-[#0D2528] font-semibold text-xs">
                      {dashboard ? E.sum_tracking_val(pages) : E.sum_not_added}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#718487]">{E.sum_start}</span>
                    <span className="text-[#0D2528] font-semibold text-xs">{startLabel}</span>
                  </div>
                  {dashboard && (
                    <div className="border-t border-gray-100 pt-3 mt-3">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs text-[#718487]">{E.tracking_cost_label}</span>
                        <span className={`${PING} text-lg text-[#0D2528]`}>{fmt(dashboardTotal)} {E.currency}</span>
                      </div>
                      <p className="text-[10px] text-[#718487] mt-1">{E.price_note2}</p>
                    </div>
                  )}
                </div>
                <CTAButton asChild variant="primary" cta size="block" className="mt-5">
                  <a href={waLink} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon className="w-5 h-5" />
                    {E.submit_btn}
                  </a>
                </CTAButton>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Section 13: Decision Tree ───────────────────────────────────────────────

function DecisionTreeSection() {
  const { lang } = useLanguage();
  const E = t[lang].ecom;
  const questions = E.tree;
  return (
    <section className="py-16 sm:py-20" style={{ background: "#F7F7F5" }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <FadeUp><SectionTitle className="text-center mb-10">{E.tree_title}</SectionTitle></FadeUp>
        <FadeUp delay={100}>
          <div className="max-w-xl mx-auto space-y-4">
            {questions.map((q, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4">
                <p className="text-sm font-semibold text-[#0D2528] mb-3 text-center">{q}</p>
                <div className="flex gap-3 justify-center">
                  <div className="flex-1 max-w-[180px] bg-[#E87B59]/10 border border-[#E87B59]/20 rounded-xl p-2.5 text-center">
                    <span className="text-xs font-semibold text-[#E87B59]">{E.tree_yes}</span>
                    <p className="text-[10px] text-[#718487] mt-0.5">{E.tree_yes_note}</p>
                  </div>
                  <div className="flex-1 max-w-[180px] bg-gray-50 rounded-xl p-2.5 text-center">
                    <span className="text-xs font-semibold text-[#718487]">{E.tree_no}</span>
                    <p className="text-[10px] text-[#718487] mt-0.5">{E.tree_no_note}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Section 15: FAQ ─────────────────────────────────────────────────────────

function FAQSection() {
  const { lang } = useLanguage();
  const E = t[lang].ecom;
  const faqs = E.faqs;
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <FadeUp><SectionTitle className="text-center mb-10">{E.faq_title}</SectionTitle></FadeUp>
        <FadeUp delay={100}>
          <div className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="bg-[#F7F7F5] rounded-xl border-none px-4">
                  <AccordionTrigger className="text-sm font-semibold text-[#0D2528] text-start hover:no-underline py-4">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-[#718487] leading-relaxed">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Landing header ──────────────────────────────────────────────────────────
// This page renders outside the site PublicLayout, so we ship the header
// ourselves — matched to the main site's floating dark bar exactly:
//   • floating pill: bg-secondary/80, rounded-[14px], px-4 pt-4 outer padding
//   • backdrop-blur-md + shadow-md + white/10 border
//   • image logo with mixBlendMode: 'screen' so it reads clean on the dark bar
//   • language toggle only (no other nav) — the "back to main site" link is
//     intentionally moved out of the top bar and lives in a tiny page footer
//     below the WhatsApp CTA, so no exit link competes with the offer.
function LandingHeader() {
  const { lang, setLang, isAr } = useLanguage();
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <header className="bg-secondary/80 py-3 opacity-75 rounded-[14px] w-full max-w-6xl transition-all duration-500 backdrop-blur-md shadow-md border border-white/10">
        <div className="px-6 flex items-center justify-between">
          <a href="/" className="flex items-center shrink-0" aria-label="Consolve">
            <img
              src="https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/4c25434d1_Consolve_identity_compressed_HQai.png"
              alt="Consolve"
              className="h-8 w-auto"
              style={{ mixBlendMode: "screen" }}
            />
          </a>
          <button
            onClick={() => setLang(isAr ? "en" : "ar")}
            className="text-sm font-medium text-white/90 hover:text-primary transition-colors"
          >
            {isAr ? "EN" : "AR"}
          </button>
        </div>
      </header>
    </div>
  );
}

// ─── Minimal page footer ─────────────────────────────────────────────────────
// The only exit link on the page. Placed at the very bottom so the visitor
// only encounters it after the offer + form. Keep it quiet on purpose.
function LandingFooter() {
  const { isAr } = useLanguage();
  return (
    <footer className="py-10 border-t border-[#0D2528]/10 bg-[#F7F7F5]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
        <a
          href="/"
          className="inline-block text-sm text-[#3D4D4F] hover:text-[#E87B59] transition-colors underline underline-offset-4 decoration-[#0D2528]/20 hover:decoration-[#E87B59]"
        >
          {isAr ? "الانتقال إلى موقع كونسولف" : "Go to the Consolve website"}
        </a>
      </div>
    </footer>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function EcommerceLanding() {
  // Direction follows the active language; sync <html dir/lang> here since this
  // page renders outside the site's PublicLayout (which normally does this).
  const { lang, dir } = useLanguage();

  // Share-preview metadata. The audience for this page is Saudi ecommerce stores
  // (Arabic-first), so we ship the Arabic title as the primary and pair it with
  // the English label when the visitor is in English mode. og:site_name stays
  // "Consolve Management Solutions" via index.html + the hook re-assertion.
  usePageMetadata({
    title:
      lang === "ar"
        ? "تصميم وتطوير صفحات الهبوط للمتاجر الإلكترونية"
        : "Landing pages designed and built for e-commerce stores",
    description:
      lang === "ar"
        ? "نصمّم ونبني صفحات هبوط للمتاجر الإلكترونية تربط رسالة الإعلان بتجربة شراء تزيد احتمالية التحويل."
        : "We design and build landing pages that connect your ad's message to a buying experience that lifts conversion.",
    image: CASE_STUDY,
  });

  // Arabic-first for this landing page only: the audience is Saudi stores and
  // it will receive traffic from Arabic ad campaigns. If the visitor has never
  // picked a language on this device (no stored preference), we switch them to
  // Arabic on arrival. Once they've explicitly chosen a language (stored in
  // consolve_lang), we respect that on every future visit — including the rest
  // of the site — so this override is one-shot per device, not per-page.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("consolve_lang")) {
      setGlobalLang("ar");
    }
    // Run once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <LandingHeader />
      <HeroSection />
      <StatsSection />
      <CaseStudiesSection />
      <ServicesSection />
      <KPISection />
      <DashboardSection />
      <PricingSection />
      <DecisionTreeSection />
      <FAQSection />
      <LandingFooter />
    </div>
  );
}