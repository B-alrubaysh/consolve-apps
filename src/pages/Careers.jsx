import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, MapPin, Clock, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "../lib/useLanguage";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPLOYMENT_TYPE_AR = {
  "full-time": "دوام كامل",
  "part-time": "دوام جزئي",
  "contract": "عقد",
  "internship": "تدريب",
};

function getEmploymentLabel(value, isAr) {
  if (!value) return "";
  return isAr ? (EMPLOYMENT_TYPE_AR[value] || value) : value;
}

function isJobClosed(job) {
  return job.application_limit != null && (job.application_count || 0) >= job.application_limit;
}

function JobCard({ job, isAr, onApply }) {
  const closed = isJobClosed(job);
  return (
    <div className="flex flex-col justify-between bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-md transition-all duration-200">
      <div>
        <div className={`flex items-center gap-2 mb-3 ${isAr ? 'flex-row-reverse' : ''}`}>
          <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            {isAr ? (job.department_ar || job.department_en) : (job.department_en || job.department_ar)}
          </span>
        </div>
        <h3 className="font-bold text-foreground text-lg leading-snug mb-3">
          {isAr ? (job.title_ar || job.title_en) : (job.title_en || job.title_ar)}
        </h3>
        <div className={`flex flex-col gap-1.5 mb-4 ${isAr ? 'items-end' : ''}`}>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {isAr ? (job.location_ar || job.location_en) : (job.location_en || job.location_ar)}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            {getEmploymentLabel(job.employment_type, isAr)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isAr ? (job.description_ar || job.description_en) : (job.description_en || job.description_ar)}
        </p>
      </div>
      {closed ? (
        <div
          className="mt-6 w-full bg-muted text-muted-foreground text-sm font-bold py-2.5 rounded-xl tracking-wide uppercase text-center cursor-not-allowed"
          aria-disabled="true"
        >
          {isAr ? 'أُغلق التقديم' : 'Applications closed'}
        </div>
      ) : (
        <button
          onClick={() => onApply(job)}
          className="mt-6 w-full bg-primary text-primary-foreground text-sm font-bold py-2.5 rounded-xl hover:opacity-90 transition-opacity tracking-wide uppercase"
        >
          {isAr ? 'تقدم الآن' : 'Apply Now'}
        </button>
      )}
    </div>
  );
}

function ApplicationForm({ job, isAr, dir, lang, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", linkedin: "", portfolio: "", message: "" });
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      setFileError(isAr ? 'الحجم الأقصى للملف هو 10 ميغابايت' : 'File size must be under 10MB');
      setFile(null);
      return;
    }
    setFileError('');
    setFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');

    if (!EMAIL_REGEX.test(form.email)) {
      setEmailError(isAr ? 'يرجى إدخال بريد إلكتروني صالح' : 'Please enter a valid email address');
      return;
    }
    if (!file) {
      setFileError(isAr ? 'السيرة الذاتية مطلوبة' : 'CV is required');
      return;
    }

    setLoading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });

    await base44.entities.JobApplication.create({
      submission_type: "job_application",
      job_post_id: job.id,
      full_name: form.name,
      email: form.email,
      phone: form.phone,
      linkedin_url: form.linkedin,
      portfolio_url: form.portfolio,
      cv_url: file_url,
      cover_message: form.message,
      consent_given: true,
      language: lang,
      source_page: "/careers",
      status: "new",
    });

    await base44.functions.invoke("incrementJobApplicationCount", { job_post_id: job.id });

    setLoading(false);
    setSubmitted(true);
    setTimeout(onSuccess, 2000);
  };

  const fields = isAr
    ? [
        { key: "name", label: "الاسم الكامل", placeholder: "أدخل اسمك الكامل", type: "text", required: true },
        { key: "email", label: "البريد الإلكتروني", placeholder: "example@email.com", type: "email", required: true },
        { key: "phone", label: "رقم الهاتف", placeholder: "+966 xx xxx xxxx", type: "tel", required: true },
        { key: "linkedin", label: "رابط LinkedIn", placeholder: "https://linkedin.com/in/...", type: "url", required: false },
        { key: "portfolio", label: "رابط المعرض (اختياري)", placeholder: "https://...", type: "url", required: false },
      ]
    : [
        { key: "name", label: "Full Name", placeholder: "Enter your full name", type: "text", required: true },
        { key: "email", label: "Email Address", placeholder: "example@email.com", type: "email", required: true },
        { key: "phone", label: "Phone Number", placeholder: "+1 (555) 000-0000", type: "tel", required: true },
        { key: "linkedin", label: "LinkedIn Profile", placeholder: "https://linkedin.com/in/...", type: "url", required: false },
        { key: "portfolio", label: "Portfolio URL (optional)", placeholder: "https://...", type: "url", required: false },
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
        dir={dir}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-7 py-6 border-b border-border">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
            {isAr ? "تقديم للوظيفة" : "Applying for"}
          </p>
          <h3 className="text-xl font-bold text-foreground">{isAr ? (job.title_ar || job.title_en) : (job.title_en || job.title_ar)}</h3>
        </div>

        {submitted ? (
          <div className="px-7 py-14 text-center">
            <div className="text-4xl mb-3">✅</div>
            <h4 className="text-lg font-bold text-foreground mb-1">{isAr ? "تم الإرسال بنجاح!" : "Application Submitted!"}</h4>
            <p className="text-sm text-muted-foreground">{isAr ? "سنتواصل معك قريبًا." : "We'll be in touch soon."}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-7 py-6 flex flex-col gap-4">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">{f.label}</label>
                <input
                  type={f.type}
                  required={f.required}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  className={`w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 ${isAr ? "text-right" : ""}`}
                />
                {f.key === "email" && emailError && (
                  <p className="text-xs text-destructive mt-1">{emailError}</p>
                )}
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                {isAr ? "رسالة التغطية (اختياري)" : "Cover Message (optional)"}
              </label>
              <textarea
                rows={4}
                placeholder={isAr ? "أخبرنا عن نفسك..." : "Tell us about yourself..."}
                value={form.message}
                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                className={`w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none ${isAr ? "text-right" : ""}`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                {isAr ? "السيرة الذاتية (PDF أو Word — بحد أقصى 10MB)" : "Resume / CV (PDF or Word — max 10MB)"}
              </label>
              <label className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-background cursor-pointer transition-colors ${isAr ? 'flex-row-reverse' : ''}`}>
                <Briefcase className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground truncate">
                  {file ? file.name : (isAr ? 'انقر لرفع الملف' : 'Click to upload file')}
                </span>
                <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFile} />
              </label>
              {fileError && <p className="text-xs text-destructive mt-1">{fileError}</p>}
              {file && !fileError && (
                <p className="text-xs text-primary mt-1">
                  {file.name} — {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
            </div>
            <label className={`flex items-start gap-2.5 cursor-pointer ${isAr ? 'flex-row-reverse text-right' : ''}`}>
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-primary shrink-0"
              />
              <span className="text-xs text-muted-foreground leading-relaxed">
                {isAr
                  ? "أوافق على معالجة كونسولف لمعلوماتي لأغراض التوظيف"
                  : "I consent to Consolve processing my information for recruitment purposes"}
              </span>
            </label>
            <button
              type="submit"
              disabled={loading || !consent}
              className="mt-1 bg-primary text-primary-foreground text-sm font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (isAr ? "جارٍ الإرسال..." : "Submitting...") : (isAr ? "إرسال الطلب" : "Submit Application")}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

function GeneralForm({ isAr, dir, lang }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      setFileError(isAr ? 'الحجم الأقصى للملف هو 10 ميغابايت' : 'File size must be under 10MB');
      setFile(null);
      return;
    }
    setFileError('');
    setFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');

    if (!EMAIL_REGEX.test(form.email)) {
      setEmailError(isAr ? 'يرجى إدخال بريد إلكتروني صالح' : 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    let cv_url = null;
    if (file) {
      const res = await base44.integrations.Core.UploadFile({ file });
      cv_url = res.file_url;
    }
    await base44.entities.JobApplication.create({
      submission_type: "general_submission",
      job_post_id: null,
      full_name: form.name,
      email: form.email,
      phone: form.phone,
      cv_url,
      cover_message: form.message,
      consent_given: true,
      language: lang,
      source_page: "/careers",
      status: "new",
    });
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={`text-center py-12 ${isAr ? 'text-right' : ''}`} dir={dir}>
        <div className="text-4xl mb-3">✅</div>
        <h4 className="text-lg font-bold text-foreground mb-1">{isAr ? 'تم الإرسال!' : 'Application Sent!'}</h4>
        <p className="text-sm text-muted-foreground">{isAr ? 'سنتواصل معك عند توفر فرصة مناسبة.' : "We'll be in touch when a matching role opens up."}</p>
      </div>
    );
  }

  const fields = isAr
    ? [
        { key: 'name', label: 'الاسم الكامل', placeholder: 'أدخل اسمك', type: 'text', required: true },
        { key: 'email', label: 'البريد الإلكتروني', placeholder: 'example@email.com', type: 'email', required: true },
        { key: 'phone', label: 'رقم الهاتف', placeholder: '+966 xx xxx xxxx', type: 'tel', required: false },
      ]
    : [
        { key: 'name', label: 'Full Name', placeholder: 'Your full name', type: 'text', required: true },
        { key: 'email', label: 'Email Address', placeholder: 'example@email.com', type: 'email', required: true },
        { key: 'phone', label: 'Phone Number', placeholder: '+1 (555) 000-0000', type: 'tel', required: false },
      ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" dir={dir}>
      {fields.map((f) => (
        <div key={f.key}>
          <label className={`block text-xs font-semibold text-muted-foreground mb-1.5 ${isAr ? 'text-right' : ''}`}>{f.label}</label>
          <input
            type={f.type}
            required={f.required}
            placeholder={f.placeholder}
            value={form[f.key]}
            onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
            className={`w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 ${isAr ? 'text-right' : ''}`}
          />
          {f.key === 'email' && emailError && (
            <p className={`text-xs text-destructive mt-1 ${isAr ? 'text-right' : ''}`}>{emailError}</p>
          )}
        </div>
      ))}
      <div>
        <label className={`block text-xs font-semibold text-muted-foreground mb-1.5 ${isAr ? 'text-right' : ''}`}>
          {isAr ? 'رسالة (اختياري)' : 'Message (optional)'}
        </label>
        <textarea
          rows={3}
          placeholder={isAr ? 'أخبرنا عن خبراتك ومجال اهتمامك...' : 'Tell us about your background and areas of interest...'}
          value={form.message}
          onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
          className={`w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none ${isAr ? 'text-right' : ''}`}
        />
      </div>
      <div>
        <label className={`block text-xs font-semibold text-muted-foreground mb-1.5 ${isAr ? 'text-right' : ''}`}>
          {isAr ? 'السيرة الذاتية (PDF أو Word — بحد أقصى 10MB)' : 'Resume / CV (PDF or Word — max 10MB)'}
        </label>
        <label className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-background cursor-pointer transition-colors ${isAr ? 'flex-row-reverse' : ''}`}>
          <Briefcase className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-sm text-muted-foreground truncate">
            {file ? file.name : (isAr ? 'انقر لرفع الملف' : 'Click to upload file')}
          </span>
          <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFile} />
        </label>
        {fileError && <p className="text-xs text-destructive mt-1">{fileError}</p>}
        {file && !fileError && (
          <p className="text-xs text-primary mt-1">
            {file.name} — {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        )}
      </div>
      <label className={`flex items-start gap-2.5 cursor-pointer ${isAr ? 'flex-row-reverse text-right' : ''}`}>
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-primary shrink-0"
        />
        <span className="text-xs text-muted-foreground leading-relaxed">
          {isAr
            ? "أوافق على معالجة كونسولف لمعلوماتي لأغراض التوظيف"
            : "I consent to Consolve processing my information for recruitment purposes"}
        </span>
      </label>
      <button
        type="submit"
        disabled={loading || !consent}
        className="mt-2 bg-secondary text-secondary-foreground text-sm font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wide"
      >
        {loading ? (isAr ? 'جارٍ الإرسال...' : 'Submitting...') : (isAr ? 'إرسال الطلب' : 'Submit Application')}
      </button>
    </form>
  );
}

export default function Careers() {
  const { lang, dir, isAr } = useLanguage();
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const all = await base44.entities.JobPost.list("-publish_date", 100);
      if (cancelled) return;
      setJobs(all.filter((j) => j.status === "open"));
      setLoadingJobs(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const handleApplySuccess = async () => {
    // Refresh list to reflect any application_count / closure changes
    const all = await base44.entities.JobPost.list("-publish_date", 100);
    setJobs(all.filter((j) => j.status === "open"));
    setSelectedJob(null);
  };

  return (
    <div dir={dir} className="min-h-screen bg-background">
      <section className="py-24 md:py-36 bg-secondary text-secondary-foreground">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">
              {isAr ? "الوظائف" : "Careers"}
            </p>
            <h1 className="text-4xl md:text-6xl font-black text-secondary-foreground leading-tight mb-5">
              {isAr ? "انضم إلى فريقنا" : "Join Our Team"}
            </h1>
            <p className="text-secondary-foreground/60 text-lg max-w-xl leading-relaxed">
              {isAr
                ? "نبحث عن مواهب استثنائية تشاركنا شغفنا بتحويل المنظمات وخلق أثر حقيقي."
                : "We're looking for exceptional talent who share our passion for transforming organizations and creating real impact."}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            {isAr ? `الوظائف المتاحة (${jobs.length})` : `Open Positions (${jobs.length})`}
          </h2>

          {loadingJobs ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-sm">
              {isAr ? 'لا توجد وظائف مفتوحة حالياً. عد قريباً.' : 'No open positions right now. Check back soon.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {jobs.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                >
                  <JobCard job={job} isAr={isAr} onApply={setSelectedJob} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 border-t border-border bg-card">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
              {isAr ? 'لم تجد وظيفتك المناسبة؟' : "Didn't find the right role?"}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {isAr ? 'تقدم بطلب عام' : 'Submit a General Application'}
            </h2>
            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
              {isAr
                ? 'أرسل ملفك الشخصي وسنتواصل معك عند توفر فرصة تناسب مؤهلاتك.'
                : "Send us your profile and we'll reach out when a matching opportunity arises."}
            </p>
            <GeneralForm isAr={isAr} dir={dir} lang={lang} />
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {selectedJob && (
          <ApplicationForm
            key="form"
            job={selectedJob}
            isAr={isAr}
            dir={dir}
            lang={lang}
            onClose={() => setSelectedJob(null)}
            onSuccess={handleApplySuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}