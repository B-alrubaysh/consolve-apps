import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AnimatedSection from "../AnimatedSection";
import t from "../../lib/translations";

const INDUSTRIES_EN = ["Technology", "Healthcare", "Financial Services", "Manufacturing", "Retail & E-commerce", "Energy", "Real Estate", "Education", "Logistics", "Professional Services", "Government", "Hospitality", "Other"];
const INDUSTRIES_AR = ["التكنولوجيا", "الرعاية الصحية", "الخدمات المالية", "التصنيع", "التجزئة والتجارة الإلكترونية", "الطاقة", "العقارات", "التعليم", "الخدمات اللوجستية", "الخدمات المهنية", "الحكومة", "الضيافة", "أخرى"];
const SIZES = ["1-10", "11-50", "51-200", "201-500", "500+"];

export default function AssessmentStep1({ onNext, lang }) {
  const tx = t[lang];
  const [form, setForm] = useState({
    company_name: "", industry: "", company_size: "", main_activity: "",
    key_challenges: "", contact_name: "", contact_email: "", contact_phone: ""
  });

  const industries = lang === "ar" ? INDUSTRIES_AR : INDUSTRIES_EN;
  const canSubmit = form.company_name && form.industry && form.company_size && form.contact_name && form.contact_email;

  return (
    <div className="max-w-2xl mx-auto px-6">
      <AnimatedSection>
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-3">{tx.assess_step1_title}</h2>
          <p className="text-muted-foreground">{tx.assess_step1_sub}</p>
        </div>

        <div className="space-y-6 bg-card border border-border rounded-2xl p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">{tx.assess_company_name} *</label>
              <Input value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} placeholder={tx.assess_company_ph} className="h-12" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">{tx.assess_industry} *</label>
              <Select value={form.industry} onValueChange={(v) => setForm({ ...form, industry: v })}>
                <SelectTrigger className="h-12"><SelectValue placeholder={tx.assess_industry_ph} /></SelectTrigger>
                <SelectContent>
                  {industries.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">{tx.assess_size} *</label>
              <Select value={form.company_size} onValueChange={(v) => setForm({ ...form, company_size: v })}>
                <SelectTrigger className="h-12"><SelectValue placeholder={tx.assess_size_ph} /></SelectTrigger>
                <SelectContent>
                  {SIZES.map((s) => <SelectItem key={s} value={s}>{s} {tx.employees}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">{tx.assess_activity}</label>
              <Input value={form.main_activity} onChange={(e) => setForm({ ...form, main_activity: e.target.value })} placeholder={tx.assess_activity_ph} className="h-12" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">{tx.assess_challenges}</label>
            <Textarea value={form.key_challenges} onChange={(e) => setForm({ ...form, key_challenges: e.target.value })} placeholder={tx.assess_challenges_ph} className="min-h-[100px]" />
          </div>

          <div className="border-t border-border pt-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">{tx.assess_contact_label}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">{tx.assess_contact_name} *</label>
                <Input value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} placeholder={tx.assess_contact_name_ph} className="h-12" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">{tx.assess_contact_email} *</label>
                <Input type="email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} placeholder={tx.assess_contact_email_ph} className="h-12" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">{tx.assess_contact_phone}</label>
                <Input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} placeholder={tx.assess_contact_phone_ph} className="h-12" />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={() => onNext({ ...form, language: lang })} disabled={!canSubmit} className="bg-primary text-primary-foreground rounded-full px-8 h-12 font-semibold">
              {tx.assess_continue}
            </Button>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}