// Bilingual labels for request fields shown in the detail view.
export const FIELD_LABELS = {
  full_name: ["الاسم", "Name"], name: ["الاسم", "Name"], job_title: ["المسمى الوظيفي", "Job title"],
  company_name: ["الشركة", "Company"], company: ["الشركة", "Company"], email: ["البريد الإلكتروني", "Email"],
  phone: ["الجوال", "Phone"], sector: ["القطاع", "Sector"], company_size: ["حجم الشركة", "Company size"],
  city: ["المدينة", "City"], main_activity: ["النشاط الرئيسي", "Main activity"],
  key_challenges: ["التحدي الرئيسي", "Key challenge"], message: ["وصف التحدي / الرسالة", "Challenge / message"],
  service: ["الخدمة", "Service"], page_name: ["صفحة الهبوط", "Landing page name"], page_slug: ["رابط الصفحة", "Page slug"],
  language: ["اللغة", "Language"], consent_given: ["الموافقة على التواصل", "Consent given"],
  maturity_level: ["مرحلة النضج", "Maturity stage"], risk_level: ["مستوى المخاطر", "Risk level"],
  suggested_services: ["الخدمات المقترحة", "Recommended services"], completed: ["اكتمل التشخيص", "Completed"],
  last_step_reached: ["آخر خطوة", "Last step reached"], source_page: ["صفحة المصدر", "Source page"],
  landing_page: ["أول صفحة دخول", "Landing page"], referrer: ["المُحيل", "Referrer"],
  utm_source: ["utm_source", "utm_source"], utm_medium: ["utm_medium", "utm_medium"],
  utm_campaign: ["utm_campaign", "utm_campaign"], utm_content: ["utm_content", "utm_content"], utm_term: ["utm_term", "utm_term"],
  created_date: ["تاريخ الإرسال", "Submitted"],
};

// Shown elsewhere in the sheet, or internal.
export const HIDDEN_FIELDS = new Set([
  "id", "edit_token", "is_read", "lead_status", "internal_notes", "status", "questionnaire_answers",
  "diagnosis", "raw_data", "updated_date", "created_by", "created_by_id", "is_sample", "app_id", "entity_name",
]);

export const fieldLabel = (key, lang) => (FIELD_LABELS[key] || [key, key])[lang === "ar" ? 0 : 1];

export function formatValue(v, lang) {
  if (v === true) return lang === "ar" ? "نعم" : "Yes";
  if (v === false) return lang === "ar" ? "لا" : "No";
  if (v === null || v === undefined || v === "") return "-";
  return String(v);
}

export function parseJSON(s) {
  if (!s || typeof s !== "string") return s || null;
  try { return JSON.parse(s); } catch { return s; }
}