import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import AnimatedSection from "../components/AnimatedSection";
import { useLanguage } from "../lib/useLanguage";
import t from "../lib/translations";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { lang, dir, isAr } = useLanguage();
  const tx = t[lang];

  // PageContent → editable bilingual hero / office / aside text.
  // SiteSettings → real contact email + phone (same source the Footer uses).
  const [rec, setRec] = useState(null);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      base44.entities.PageContent.list("-created_date", 1).catch(() => []),
      base44.entities.SiteSettings.list("-created_date", 1).catch(() => []),
    ]).then(([pcList, ssList]) => {
      if (cancelled) return;
      setRec((pcList || [])[0] || null);
      setSettings((ssList || [])[0] || null);
    });
    return () => { cancelled = true; };
  }, []);

  const pick = (key, fallback) =>
    (isAr ? rec?.[`${key}_ar`] : rec?.[`${key}_en`]) || fallback;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await base44.entities.ContactInquiry.create({ ...form, language: lang });
    setSubmitted(true);
    setLoading(false);
  };

  const email = settings?.contact_email || "info@consolve.com";
  const phone = settings?.contact_phone || "+1 (800) 555-0199";

  return (
    <div dir={dir}>
      <section className="pt-32 pb-20 md:pt-44 md:pb-28">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-4">{pick("contact_label", tx.contact_label)}</p>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight mb-8 max-w-3xl">{pick("contact_h1", tx.contact_h1)}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">{pick("contact_sub", tx.contact_sub)}</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-28 md:pb-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            <div className="lg:col-span-3">
              <AnimatedSection>
                {submitted ? (
                  <div className="rounded-2xl border border-primary/30 bg-primary/5 p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <Send className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">{tx.contact_success_title}</h3>
                    <p className="text-muted-foreground">{tx.contact_success_p}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">{tx.contact_name} {tx.contact_required}</label>
                        <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={tx.contact_name_ph} className="h-12" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">{tx.contact_email} {tx.contact_required}</label>
                        <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={tx.contact_email_ph} className="h-12" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">{tx.contact_phone}</label>
                        <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={tx.contact_phone_ph} className="h-12" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">{tx.contact_company}</label>
                        <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder={tx.contact_company_ph} className="h-12" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">{tx.contact_message} {tx.contact_required}</label>
                      <Textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={tx.contact_message_ph} className="min-h-[150px]" />
                    </div>
                    <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground rounded-full px-8 h-12 font-semibold">
                      {loading ? tx.contact_sending : tx.contact_submit}
                    </Button>
                  </form>
                )}
              </AnimatedSection>
            </div>

            <div className="lg:col-span-2">
              <AnimatedSection delay={200}>
                <div className="space-y-8">
                  {[
                    { icon: Mail, label: tx.contact_email_label, val: email },
                    { icon: Phone, label: tx.contact_phone_label, val: phone },
                    { icon: MapPin, label: tx.contact_office_label, val: pick("contact_office", tx.contact_office_val) },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.val}</p>
                      </div>
                    </div>
                  ))}
                  <div className="mt-12 p-8 rounded-2xl bg-secondary">
                    <h3 className="text-lg font-semibold text-white mb-3">{pick("contact_aside_title", tx.contact_aside_h)}</h3>
                    <p className="text-sm text-white/60 leading-relaxed mb-4">{pick("contact_aside_text", tx.contact_aside_p)}</p>
                    <a href="/assessment" className="text-primary text-sm font-semibold hover:underline">{pick("contact_aside_link_label", tx.contact_aside_link)}</a>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}