import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../lib/useLanguage";

const WHATSAPP_URL = "https://wa.me/message/M6AP4IL4RCJIO1";

// Official WhatsApp glyph (lucide has no brand icons).
function WhatsAppIcon({ className }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.004 4c-6.627 0-12 5.373-12 12 0 2.117.551 4.186 1.598 6.01L4 28l6.146-1.562A11.94 11.94 0 0 0 16.004 28c6.627 0 12-5.373 12-12s-5.373-12-12-12zm0 21.818a9.79 9.79 0 0 1-4.99-1.36l-.358-.213-3.647.927.973-3.557-.234-.366a9.78 9.78 0 0 1-1.51-5.249c0-5.418 4.408-9.826 9.826-9.826 5.417 0 9.825 4.408 9.825 9.826 0 5.417-4.408 9.818-9.825 9.818zm5.387-7.357c-.295-.148-1.746-.861-2.016-.96-.271-.099-.468-.148-.665.148-.198.296-.764.96-.937 1.158-.172.197-.345.222-.64.074-.296-.148-1.247-.46-2.375-1.465-.878-.783-1.47-1.75-1.643-2.046-.172-.296-.018-.456.13-.603.133-.132.295-.345.443-.518.148-.172.197-.296.296-.493.098-.197.049-.37-.025-.518-.074-.148-.665-1.602-.911-2.194-.24-.576-.484-.498-.665-.507l-.567-.01c-.197 0-.517.074-.788.37-.27.296-1.034 1.01-1.034 2.464 0 1.453 1.059 2.858 1.207 3.055.148.197 2.083 3.18 5.047 4.46.705.304 1.256.486 1.685.622.708.225 1.353.193 1.862.117.568-.085 1.746-.714 1.992-1.403.246-.69.246-1.28.172-1.404-.074-.123-.27-.197-.566-.345z" />
    </svg>
  );
}

// Floating WhatsApp button with a message bubble that pops out and re-appears
// every 15 seconds. Rendered on all public pages via the public Layout.
export default function WhatsAppFloat() {
  const { lang, isAr } = useLanguage();
  const [showBubble, setShowBubble] = useState(false);

  const message = isAr
    ? "موجودين لخدمتك عبر الواتساب"
    : "We're here for you on WhatsApp";

  // Cycle: bubble visible for 6s, hidden for 9s (a full round every 15s).
  useEffect(() => {
    let hideTimer;
    const appear = () => {
      setShowBubble(true);
      hideTimer = setTimeout(() => setShowBubble(false), 6000);
    };
    const firstTimer = setTimeout(appear, 2000);
    const cycleTimer = setInterval(appear, 15000);
    return () => { clearTimeout(firstTimer); clearTimeout(hideTimer); clearInterval(cycleTimer); };
  }, []);

  return (
    // dir is forced to ltr so the flex order is stable: the button stays pinned
    // in its corner and the bubble pops out beside it without shifting it.
    <div className={`fixed bottom-6 z-50 flex items-center gap-3 ${isAr ? "left-6 flex-row" : "right-6 flex-row-reverse"}`} dir="ltr">
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={lang === "ar" ? "تواصل معنا عبر الواتساب" : "Chat with us on WhatsApp"}
        className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-black/20 hover:scale-110 transition-transform duration-300 shrink-0"
      >
        <WhatsAppIcon className="w-8 h-8" />
      </a>

      <AnimatePresence>
        {showBubble && (
          <motion.a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            dir={isAr ? "rtl" : "ltr"}
            className="max-w-[230px] rounded-2xl bg-card border border-border shadow-xl px-4 py-3 text-sm font-medium text-foreground leading-relaxed"
          >
            {message}
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
}