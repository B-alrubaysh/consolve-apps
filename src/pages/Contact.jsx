import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import AnimatedSection from "../components/AnimatedSection";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await base44.entities.ContactInquiry.create(form);
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div>
      <section className="pt-32 pb-20 md:pt-44 md:pb-28">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-4">
              Contact Us
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight mb-8 max-w-3xl">
              Let's Start a Conversation
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Have a question or ready to explore how we can help? Reach out and our team
              will respond within 24 hours.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-28 md:pb-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Form */}
            <div className="lg:col-span-3">
              <AnimatedSection>
                {submitted ? (
                  <div className="rounded-2xl border border-primary/30 bg-primary/5 p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <Send className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">Message Sent</h3>
                    <p className="text-muted-foreground">
                      Thank you for reaching out. Our team will contact you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Name *</label>
                        <Input
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Your full name"
                          className="h-12"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Email *</label>
                        <Input
                          required
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="your@email.com"
                          className="h-12"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Phone</label>
                        <Input
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+1 (555) 000-0000"
                          className="h-12"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Company</label>
                        <Input
                          value={form.company}
                          onChange={(e) => setForm({ ...form, company: e.target.value })}
                          placeholder="Company name"
                          className="h-12"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Message *</label>
                      <Textarea
                        required
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Tell us about your needs..."
                        className="min-h-[150px]"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-primary text-primary-foreground rounded-full px-8 h-12 font-semibold"
                    >
                      {loading ? "Sending..." : "Submit Your Inquiry"}
                    </Button>
                  </form>
                )}
              </AnimatedSection>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2">
              <AnimatedSection delay={200}>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Email</p>
                      <p className="text-sm text-muted-foreground">info@consolve.com</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Phone</p>
                      <p className="text-sm text-muted-foreground">+1 (800) 555-0199</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Office</p>
                      <p className="text-sm text-muted-foreground">Available by appointment</p>
                    </div>
                  </div>

                  <div className="mt-12 p-8 rounded-2xl bg-secondary">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Prefer a Quick Start?
                    </h3>
                    <p className="text-sm text-white/60 leading-relaxed mb-4">
                      Take our AI-powered assessment and receive a comprehensive
                      business diagnosis in minutes.
                    </p>
                    <a
                      href="/assessment"
                      className="text-primary text-sm font-semibold hover:underline"
                    >
                      Start Assessment →
                    </a>
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