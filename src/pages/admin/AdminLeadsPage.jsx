import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAdminUser } from "../../components/admin/ProtectedAdminLayout";
import { requireRole, ROLES } from "../../lib/rbac";
import AccessDenied from "../../components/admin/AccessDenied";
import { useLanguage } from "../../lib/useLanguage";
import { SOURCES, getSource } from "../../components/admin/leads/leadsConfig";
import useLeadCounts from "../../components/admin/leads/useLeadCounts";
import LeadsTable from "../../components/admin/leads/LeadsTable";
import LeadDetailSheet from "../../components/admin/leads/LeadDetailSheet";

export default function AdminLeadsPage() {
  const me = useAdminUser();
  const allowed = requireRole(me, ROLES.OWNER, ROLES.ADMIN);
  const { lang, isAr, setLang } = useLanguage();
  const [params, setParams] = useSearchParams();
  const source = getSource(params.get("tab"));
  const counts = useLeadCounts(allowed);
  const [open, setOpen] = useState(null);
  const patchRef = useRef(() => {});

  if (!allowed) return <AccessDenied />;

  const patched = (id, data) => {
    patchRef.current(id, data);
    setOpen((o) => (o && o.id === id ? { ...o, ...data } : o));
  };

  return (
    <div className="p-4 md:p-8 font-inter" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-relaxed">{isAr ? "طلبات العملاء" : "Leads"}</h1>
          <p className="text-sm text-white/50 mt-1">
            {isAr ? "كل الطلبات الواردة من الموقع في مكان واحد" : "Every request from the website in one place"}
          </p>
        </div>
        <div className="flex rounded-full border border-white/10 p-1 text-xs">
          {["ar", "en"].map((l) => (
            <button key={l} onClick={() => setLang(l)}
              className={`px-3 py-1 rounded-full ${lang === l ? "bg-primary text-white" : "text-white/60 hover:text-white"}`}>
              {l === "ar" ? "عربي" : "EN"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-5" role="tablist">
        {SOURCES.map((s) => {
          const active = s.key === source.key;
          return (
            <button key={s.key} role="tab" aria-selected={active}
              onClick={() => setParams({ tab: s.key })}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                active ? "border-primary bg-primary/15 text-white" : "border-white/10 bg-white/5 text-white/60 hover:text-white"}`}>
              {s.label[lang]}
              <span className={`min-w-[22px] rounded-full px-1.5 text-xs font-semibold ${counts[s.key] ? "bg-primary text-white" : "bg-white/10 text-white/50"}`}>
                {counts[s.key] ?? "…"}
              </span>
            </button>
          );
        })}
      </div>

      {source.key === "landing" && (
        <p className="text-xs text-white/40 mb-4">
          {isAr
            ? "تشمل هذه القائمة طلبات صفحات الهبوط المنشأة من لوحة التحكم. نموذج صفحة /ecommerce-landing يفتح واتساب مباشرة ولا يحفظ الطلبات."
            : "This list holds requests from landing pages built in the admin. The /ecommerce-landing form opens WhatsApp directly and does not save requests."}
        </p>
      )}

      <LeadsTable key={source.key} lang={lang} source={source} onOpen={setOpen} patchRef={patchRef} />
      <LeadDetailSheet lang={lang} source={source} lead={open} onClose={() => setOpen(null)} onPatched={patched} />
    </div>
  );
}