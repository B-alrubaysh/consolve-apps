// Lead sources shown in the admin "Leads" section, plus shared helpers.

export const SOURCES = [
  {
    key: "diagnosis", entity: "DiagnosisLead", base: {}, utm: true,
    label: { ar: "تشخيص الشركات", en: "Business Diagnosis" },
    f: { name: "full_name", company: "company_name", phone: "phone", email: "email" },
  },
  {
    key: "audit", entity: "ServiceLead", base: { service: "management_audit" }, utm: true,
    label: { ar: "Management Audit", en: "Management Audit" },
    f: { name: "full_name", company: "company_name", phone: "phone", email: "email" },
  },
  {
    key: "landing", entity: "LandingPageLead", base: {}, utm: false,
    label: { ar: "طلبات صفحات الهبوط", en: "Landing page requests" },
    f: { name: "name", company: "company", phone: "phone", email: "email" },
  },
  {
    key: "contact", entity: "ContactInquiry", base: {}, utm: false,
    label: { ar: "تواصل معنا", en: "Contact us" },
    f: { name: "name", company: "company", phone: "phone", email: "email" },
  },
];

export const getSource = (key) => SOURCES.find((s) => s.key === key) || SOURCES[0];

export const STATUSES = [
  { key: "new", ar: "جديد", en: "New", color: "#8C97FF", grad: "var(--dt1-new-grad)" },
  { key: "contacted", ar: "تم التواصل", en: "Contacted", color: "#F7CC32", grad: "var(--dt1-contacted-grad)" },
  { key: "interested", ar: "مهتم", en: "Interested", color: "#E87B59", grad: "var(--dt1-interested-grad)" },
  { key: "not_interested", ar: "غير مهتم", en: "Not interested", color: "#FF5A5A", grad: "var(--dt1-not_interested-grad)" },
  { key: "converted", ar: "تحول لعميل", en: "Converted", color: "#48E781", grad: "var(--dt1-converted-grad)" },
];

export const statusOf = (r) => r.lead_status || "new";
export const statusLabel = (key, lang) => (STATUSES.find((s) => s.key === key) || STATUSES[0])[lang === "ar" ? "ar" : "en"];

export const UNREAD = { is_read: { $ne: true } };

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Server-side query for a source + the list filters (+ optional status). */
export function buildQuery(source, { from, to, campaign, search } = {}, status) {
  const and = [source.base];
  if (from || to) {
    const d = {};
    if (from) d.$gte = new Date(`${from}T00:00:00`).toISOString();
    if (to) d.$lte = new Date(`${to}T23:59:59.999`).toISOString();
    and.push({ created_date: d });
  }
  if (status) and.push({ lead_status: status });
  if (source.utm && campaign?.trim()) {
    const rx = { $regex: esc(campaign.trim()), $options: "i" };
    and.push({ $or: [{ utm_campaign: rx }, { utm_source: rx }] });
  }
  if (search?.trim()) {
    const rx = { $regex: esc(search.trim()), $options: "i" };
    and.push({ $or: [source.f.name, source.f.company, source.f.phone].map((k) => ({ [k]: rx })) });
  }
  const parts = and.filter((p) => Object.keys(p).length);
  if (parts.length === 0) return {};
  return parts.length === 1 ? parts[0] : { $and: parts };
}

export function waLink(phone) {
  let d = String(phone || "").replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("0")) d = "966" + d.slice(1);
  if (d.length === 9 && d.startsWith("5")) d = "966" + d;
  return d ? `https://wa.me/${d}` : "";
}

export const initials = (name) =>
  String(name || "?").trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("") || "?";

export const formatDate = (ts) => {
  const d = new Date(ts);
  if (isNaN(d)) return "-";
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

const csvCell = (v) => {
  const s = v === null || v === undefined ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function downloadCSV(rows, filename) {
  const skip = new Set(["edit_token"]);
  const keys = [];
  rows.forEach((r) => Object.keys(r).forEach((k) => { if (!skip.has(k) && !keys.includes(k)) keys.push(k); }));
  const body = rows.map((r) => keys.map((k) => csvCell(r[k])).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + keys.join(",") + "\n" + body], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

export const LEADS_CHANGED = "consolve:leads-changed";
export const notifyLeadsChanged = () => window.dispatchEvent(new Event(LEADS_CHANGED));