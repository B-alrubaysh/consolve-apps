import { Phone, MessageCircle, Mail } from "lucide-react";
import { waLink } from "./leadsConfig";

export default function LeadQuickActions({ phone, email, lang }) {
  const isAr = lang === "ar";
  const tel = String(phone || "").replace(/[^\d+]/g, "");
  const wa = waLink(phone);
  const items = [
    { href: tel ? `tel:${tel}` : "", label: isAr ? "اتصال" : "Call", Icon: Phone },
    { href: wa, label: isAr ? "واتساب" : "WhatsApp", Icon: MessageCircle, external: true },
    { href: email ? `mailto:${email}` : "", label: isAr ? "بريد" : "Email", Icon: Mail },
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map(({ href, label, Icon, external }) =>
        href ? (
          <a key={label} href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}
            className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 py-2.5 text-sm text-white hover:bg-primary hover:border-primary transition-colors">
            <Icon className="w-4 h-4" /> {label}
          </a>
        ) : (
          <span key={label} className="flex items-center justify-center gap-2 rounded-full border border-white/5 py-2.5 text-sm text-white/30">
            <Icon className="w-4 h-4" /> {label}
          </span>
        )
      )}
    </div>
  );
}