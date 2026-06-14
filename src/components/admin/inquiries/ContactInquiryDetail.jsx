import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { base44 } from "@/api/base44Admin";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail } from "lucide-react";

const STATUS_OPTIONS = ["New", "Read", "Replied"];

function fmt(d) {
  if (!d) return "—";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "—";
  return format(dt, "PPpp");
}

function MetaRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <span className="text-white/40">{label}</span>
      <span className="text-white text-right break-all">{value || "—"}</span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mt-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-2">{title}</p>
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">{children}</div>
    </div>
  );
}

export default function ContactInquiryDetail({ inquiry, onClose, onUpdate }) {
  // Auto-promote "New" → "Read" the first time this inquiry is opened.
  const autoMarkedId = useRef(null);
  useEffect(() => {
    if (!inquiry) return;
    if (inquiry.status && inquiry.status !== "New") return;
    if (autoMarkedId.current === inquiry.id) return;
    autoMarkedId.current = inquiry.id;
    base44.entities.ContactInquiry.update(inquiry.id, { status: "Read" })
      .then(() => onUpdate?.({ ...inquiry, status: "Read" }))
      .catch(() => { autoMarkedId.current = null; });
  }, [inquiry, onUpdate]);

  if (!inquiry) return null;

  const handleStatusChange = async (newStatus) => {
    await base44.entities.ContactInquiry.update(inquiry.id, { status: newStatus });
    onUpdate?.({ ...inquiry, status: newStatus });
  };

  const replySubject = encodeURIComponent(`Re: your message to Consolve`);
  const mailto = `mailto:${inquiry.email}?subject=${replySubject}`;

  return (
    <Sheet open={!!inquiry} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="bg-secondary text-white border-white/10 sm:max-w-xl w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white text-2xl">{inquiry.name}</SheetTitle>
          <div className="text-sm text-white/60 flex flex-wrap gap-x-3 gap-y-1 mt-1">
            <span>{inquiry.email}</span>
            {inquiry.phone && <span>· {inquiry.phone}</span>}
            {inquiry.company && <span>· {inquiry.company}</span>}
          </div>
        </SheetHeader>

        <Section title="Inquiry">
          <MetaRow label="Name" value={inquiry.name} />
          <MetaRow label="Email" value={inquiry.email} />
          <MetaRow label="Phone" value={inquiry.phone} />
          <MetaRow label="Company" value={inquiry.company} />
          <MetaRow label="Submitted" value={fmt(inquiry.created_date)} />
          <MetaRow label="Language" value={inquiry.language?.toUpperCase()} />
          <div className="flex justify-between items-center gap-4 pt-2 mt-2 border-t border-white/10">
            <span className="text-white/40 text-sm">Status</span>
            <Select value={inquiry.status || "New"} onValueChange={handleStatusChange}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white w-44 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="pt-3 mt-1">
            <a
              href={mailto}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Mail className="w-4 h-4" /> Reply by email
            </a>
          </div>
        </Section>

        <Section title="Message">
          {inquiry.message ? (
            <p className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed">{inquiry.message}</p>
          ) : (
            <p className="text-white/40 text-sm">No message</p>
          )}
        </Section>
      </SheetContent>
    </Sheet>
  );
}