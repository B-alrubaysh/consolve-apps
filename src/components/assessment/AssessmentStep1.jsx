import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AnimatedSection from "../AnimatedSection";

const INDUSTRIES = [
  "Technology", "Healthcare", "Financial Services", "Manufacturing",
  "Retail & E-commerce", "Energy", "Real Estate", "Education",
  "Logistics", "Professional Services", "Government", "Hospitality", "Other"
];

export default function AssessmentStep1({ onNext }) {
  const [form, setForm] = useState({
    company_name: "", industry: "", company_size: "", main_activity: "",
    key_challenges: "", contact_name: "", contact_email: "", contact_phone: ""
  });

  const canSubmit = form.company_name && form.industry && form.company_size && form.contact_name && form.contact_email;

  return (
    <div className="max-w-2xl mx-auto px-6">
      <AnimatedSection>
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-3">
            Tell Us About Your Business
          </h2>
          <p className="text-muted-foreground">
            This information helps our AI tailor the assessment to your specific context.
          </p>
        </div>

        <div className="space-y-6 bg-card border border-border rounded-2xl p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Company Name *</label>
              <Input
                value={form.company_name}
                onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                placeholder="Acme Corp"
                className="h-12"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Industry *</label>
              <Select value={form.industry} onValueChange={(v) => setForm({ ...form, industry: v })}>
                <SelectTrigger className="h-12"><SelectValue placeholder="Select industry" /></SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Company Size *</label>
              <Select value={form.company_size} onValueChange={(v) => setForm({ ...form, company_size: v })}>
                <SelectTrigger className="h-12"><SelectValue placeholder="Select size" /></SelectTrigger>
                <SelectContent>
                  {["1-10", "11-50", "51-200", "201-500", "500+"].map((s) => (
                    <SelectItem key={s} value={s}>{s} employees</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Main Activity</label>
              <Input
                value={form.main_activity}
                onChange={(e) => setForm({ ...form, main_activity: e.target.value })}
                placeholder="e.g. Software development"
                className="h-12"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Key Challenges (Optional)</label>
            <Textarea
              value={form.key_challenges}
              onChange={(e) => setForm({ ...form, key_challenges: e.target.value })}
              placeholder="Briefly describe the main challenges you face..."
              className="min-h-[100px]"
            />
          </div>

          <div className="border-t border-border pt-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Your Contact Details
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Name *</label>
                <Input
                  value={form.contact_name}
                  onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
                  placeholder="Full name"
                  className="h-12"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Email *</label>
                <Input
                  type="email"
                  value={form.contact_email}
                  onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                  placeholder="email@company.com"
                  className="h-12"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Phone</label>
                <Input
                  value={form.contact_phone}
                  onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="h-12"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={() => onNext(form)}
              disabled={!canSubmit}
              className="bg-primary text-primary-foreground rounded-full px-8 h-12 font-semibold"
            >
              Continue to Assessment →
            </Button>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}