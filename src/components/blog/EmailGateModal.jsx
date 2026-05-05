import { useState } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailGateModal({ post, isAr, lang, onSubmitted, onSkip }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!EMAIL_REGEX.test(email)) {
      setError(isAr ? "يرجى إدخال بريد إلكتروني صالح" : "Please enter a valid email address");
      return;
    }
    setSubmitting(true);
    await base44.entities.BlogEmailCapture.create({
      email,
      blog_post_id: post.id,
      language: lang,
      source_url: window.location.href,
      captured_at: new Date().toISOString(),
    });
    try {
      localStorage.setItem(`blog_gate_${post.id}`, "submitted");
    } catch {}
    setSubmitting(false);
    onSubmitted?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl p-7"
        dir={isAr ? "rtl" : "ltr"}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
          {isAr ? "تابع القراءة" : "Continue reading"}
        </p>
        <h3 className="text-xl font-bold text-foreground mb-2">
          {isAr ? "أدخل بريدك الإلكتروني للمتابعة" : "Enter your email to continue"}
        </h3>
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
          {isAr
            ? "احصل على رؤى منتظمة من فريق كونسولف."
            : "Get regular insights from the Consolve team."}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            type="email"
            required
            placeholder={isAr ? "example@email.com" : "example@email.com"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`h-11 ${isAr ? "text-right" : ""}`}
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary text-primary-foreground text-sm font-semibold py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {submitting
              ? (isAr ? "جارٍ الإرسال..." : "Submitting...")
              : (isAr ? "متابعة القراءة" : "Continue reading")}
          </button>
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-1"
            >
              {isAr ? "تخطي" : "Skip"}
            </button>
          )}
        </form>
      </motion.div>
    </div>
  );
}