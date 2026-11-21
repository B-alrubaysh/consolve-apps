import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { escapeHtml } from '../../shared/escapeHtml.ts';
import { cleanClientInfo, cleanAnswers, cleanLang, COMPANY_SIZES } from '../../shared/assessmentInput.ts';

// Public: saves a Smart Assessment and sends one confirmation email to the
// contact email stored on that new record. The recipient is never taken
// separately from the request, names are HTML-escaped, and each address gets
// at most one confirmation per 24 hours.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RISK = ['Low', 'Medium', 'High'];
const MATURITY = ['Early Stage', 'Growing', 'Structured', 'Advanced'];
const DAY_MS = 24 * 60 * 60 * 1000;

const clip = (v, max) => String(v ?? '').slice(0, max);
const score = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : undefined);

function buildEmail(isAr, name, company) {
  const greeting = name || (isAr ? 'عزيزنا' : 'there');
  const comp = company || (isAr ? 'شركتك' : 'your company');
  const text = isAr
    ? `عزيزي ${greeting}،\n\nشكراً لإتمامك التقييم الذكي لشركة ${comp}.\n\nتم استلام طلبك. سيقوم فريقنا بمراجعة نتائج تقييمك والتواصل معك قريباً لمناقشة الخطوات التالية.\n\nمع أطيب التحيات،\nفريق كونسولف`
    : `Dear ${greeting},\n\nThank you for completing the Consolve Smart Assessment for ${comp}.\n\nYour request has been received. Our team will review your assessment results and contact you shortly.\n\nBest regards,\nThe Consolve Team`;
  const html = `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1a2a33; max-width: 560px;">
    ${text.split('\n').map((line) => `<p style="margin: 0 0 12px;">${escapeHtml(line) || '&nbsp;'}</p>`).join('')}
  </div>`;
  return { text, html };
}

async function sendConfirmation(base44, record, lang) {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) return;
  const since = new Date(Date.now() - DAY_MS).toISOString();
  const recent = await base44.asServiceRole.entities.Assessment.filter(
    { contact_email: record.contact_email, confirmation_sent: true, created_date: { $gte: since } },
    '-created_date',
    1
  );
  if ((recent || []).length > 0) return;

  const isAr = lang === 'ar';
  const { text, html } = buildEmail(isAr, record.contact_name, record.company_name);
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Consolve <onboarding@resend.dev>',
      to: [record.contact_email],
      subject: isAr ? 'تم استلام تقييمك من كونسولف' : 'Your Consolve Assessment Has Been Received',
      text,
      html,
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) {
    console.error('Resend error:', res.status, await res.text());
    return;
  }
  await base44.asServiceRole.entities.Assessment.update(record.id, { confirmation_sent: true });
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const info = cleanClientInfo(body.client_info);
    const lang = cleanLang(body.lang);
    const d = body.diagnosis && typeof body.diagnosis === 'object' ? body.diagnosis : {};

    if (!info.company_name || !info.industry || !COMPANY_SIZES.includes(info.company_size)) {
      return Response.json({ error: 'Company name, industry and size are required' }, { status: 400 });
    }
    if (!info.contact_name || !EMAIL_RE.test(info.contact_email)) {
      return Response.json({ error: 'A valid contact name and email are required' }, { status: 400 });
    }

    const record = await base44.asServiceRole.entities.Assessment.create({
      ...info,
      questionnaire_answers: JSON.stringify(cleanAnswers(body.answers)),
      diagnosis: clip(JSON.stringify(d), 50000),
      business_snapshot: clip(body.business_snapshot ?? d.business_snapshot, 5000),
      identified_problems: clip(body.identified_problems ?? d.identified_problems, 5000),
      risk_level: RISK.includes(d.risk_level) ? d.risk_level : undefined,
      maturity_level: MATURITY.includes(d.maturity_level) ? d.maturity_level : undefined,
      suggested_services: (Array.isArray(d.suggested_services) ? d.suggested_services : []).slice(0, 20).map((s) => clip(s, 200)).join(', '),
      operational_score: score(d.operational_score),
      financial_score: score(d.financial_score),
      marketing_score: score(d.marketing_score),
      status: 'New',
      language: lang,
    });

    // Best-effort — never fail the submission because of email.
    await sendConfirmation(base44, record, lang).catch((e) => console.error('Confirmation email failed:', e?.message));

    return Response.json({ success: true });
  } catch (error) {
    console.error('submitAssessment error:', error?.message);
    return Response.json({ error: 'Could not submit your assessment' }, { status: 500 });
  }
}