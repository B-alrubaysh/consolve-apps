// Shared input cleaning for the public Smart Assessment functions.
const CLIENT_FIELDS = {
  company_name: 200,
  industry: 100,
  company_size: 20,
  main_activity: 500,
  key_challenges: 2000,
  contact_name: 150,
  contact_email: 254,
  contact_phone: 40,
};

export const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-500', '500+'];

function clip(value, max) {
  return String(value ?? '').trim().slice(0, max);
}

export function cleanLang(lang) {
  return lang === 'ar' ? 'ar' : 'en';
}

export function cleanClientInfo(raw) {
  const src = raw && typeof raw === 'object' ? raw : {};
  const out = {};
  for (const [key, max] of Object.entries(CLIENT_FIELDS)) out[key] = clip(src[key], max);
  return out;
}

export function cleanAnswers(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.slice(0, 15).map((a) => ({
    question: clip(a?.question, 1000),
    answer: clip(a?.answer, 1000),
    category: clip(a?.category, 100),
  }));
}