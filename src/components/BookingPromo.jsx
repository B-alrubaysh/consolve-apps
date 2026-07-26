import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarCheck, X, ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "../lib/useLanguage";

export const BOOKING_URL = "https://bookings.cloud.microsoft/book/Bookings@consolve.sa/?ismsaljsauthenabled=true";

// Shown once per browser session, after the visitor has spent this long on the site.
const POPUP_DELAY_MS = 60000;
const SESSION_KEY = "consolve_booking_popup_shown";

const COPY = {
  ar: {
    label: "استشارة مجانية",
    title: "احجز استشارتك المجانية",
    text: "جلسة استشارية مجانية نتعرف فيها على تحدياتك، ونساعدك على تحديد أولويات التطوير في شركتك.",
    cta: "احجز الآن",
    later: "لاحقًا",
  },
  en: {
    label: "Free Consultation",
    title: "Book Your Free Consultation",
    text: "A free consulting session where we get to know your challenges and help you set your company's development priorities.",
    cta: "Book Now",
    later: "Maybe later",
  },
};

// Popup that appears after the visitor has been on the site for over a minute.
export function BookingPopup() {
  const { lang, dir, isAr } = useLanguage();
  const c = COPY[lang] || COPY.en;
  const [open, setOpen] = useState(false);
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const timer = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem(SESSION_KEY, "1");
    }, POPUP_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center px-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          dir={dir}
        >
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-8 text-center"
          >
            <button
              onClick={() => setOpen(false)}
              aria-label={isAr ? "إغلاق" : "Close"}
              className={`absolute top-4 ${isAr ? "left-4" : "right-4"} w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors`}
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <CalendarCheck className="w-7 h-7 text-primary" />
            </div>
            <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-2">{c.label}</p>
            <h3 className="text-2xl font-bold text-foreground mb-3">{c.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-7">{c.text}</p>

            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-full h-12 font-semibold hover:opacity-90 transition-opacity"
            >
              {c.cta} <Arrow className="w-4 h-4" />
            </a>
            <button onClick={() => setOpen(false)} className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors">
              {c.later}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Booking band shown at the end of every public page, right above the footer.
export function BookingBand() {
  const { lang, dir, isAr } = useLanguage();
  const c = COPY[lang] || COPY.en;
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  return (
    <section className="bg-primary" dir={dir}>
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-14 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-start">
        <div className="flex items-center gap-4">
          <div className="hidden md:flex w-12 h-12 rounded-full bg-white/15 items-center justify-center shrink-0">
            <CalendarCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-1">{c.title}</h2>
            <p className="text-white/80 text-sm md:text-base">{c.text}</p>
          </div>
        </div>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-secondary px-8 py-4 rounded-full font-bold text-sm hover:opacity-90 transition-opacity shrink-0"
        >
          {c.cta} <Arrow className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}