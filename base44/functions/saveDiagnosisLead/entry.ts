// Public endpoint used by the /diagnosis flow to save progress step by step.
// Visitors are anonymous, so writes go through the service role. A random
// edit token returned on create is required for every later update, so a
// visitor can only ever touch their own record.
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { secrets } from 'base44:runtime';

const TEXT_FIELDS = [
  "full_name", "job_title", "company_name", "sector", "company_size", "city",
  "main_activity", "key_challenges", "email", "phone", "language",
  "questionnaire_answers", "maturity_level", "risk_level", "suggested_services", "diagnosis",
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "referrer", "landing_page",
];
const LONG_FIELDS = ["questionnaire_answers", "diagnosis"];

function clean(data) {
  const out = {};
  for (const k of TEXT_FIELDS) {
    if (typeof data[k] === "string") out[k] = data[k].slice(0, LONG_FIELDS.includes(k) ? 30000 : 2000);
  }
  if (out.language && !["ar", "en"].includes(out.language)) delete out.language;
  if (typeof data.consent_given === "boolean") out.consent_given = data.consent_given;
  if (typeof data.completed === "boolean") out.completed = data.completed;
  if (Number.isFinite(Number(data.last_step_reached))) out.last_step_reached = Number(data.last_step_reached);
  return out;
}

const esc = (v) => String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

async function notify(lead) {
  const apiKey = secrets.get("RESEND_API_KEY");
  if (!apiKey) return;
  const rows = [
    ["Company", lead.company_name], ["Sector", lead.sector], ["Size", lead.company_size], ["City", lead.city],
    ["Name", lead.full_name], ["Job Title", lead.job_title], ["Email", lead.email], ["Phone", lead.phone],
    ["Risk Level", lead.risk_level], ["Maturity Stage", lead.maturity_level],
    ["Recommended Services", lead.suggested_services],
    ["Campaign", [lead.utm_source, lead.utm_medium, lead.utm_campaign].filter(Boolean).join(" / ")],
    ["Language", lead.language],
  ];
  const html = `<div style="font-family:Arial,sans-serif;color:#0f2124;max-width:600px">
    <h2 style="margin:0 0 16px">New completed business diagnosis</h2>
    <table style="border-collapse:collapse;width:100%">${rows.map(([k, v]) =>
      `<tr><td style="padding:6px 10px;border:1px solid #e5e7eb;font-weight:bold;width:180px">${k}</td><td style="padding:6px 10px;border:1px solid #e5e7eb">${esc(v) || "-"}</td></tr>`).join("")}
    </table></div>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: secrets.get("RESEND_FROM") || "Consolve <onboarding@resend.dev>",
      to: ["info@consolve.sa"],
      reply_to: lead.email || undefined,
      subject: `New Diagnosis: ${lead.company_name || "Unknown company"} (${lead.risk_level || "-"} risk)`,
      html,
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) console.error("Resend error:", res.status, await res.text());
}

export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const data = clean(body?.data || {});
    const Lead = base44.asServiceRole.entities.DiagnosisLead;

    if (!body?.id) {
      if (!data.company_name) return Response.json({ error: "company_name is required" }, { status: 400 });
      const token = crypto.randomUUID();
      const rec = await Lead.create({ ...data, completed: false, edit_token: token });
      return Response.json({ id: rec.id, token });
    }

    if (typeof body.token !== "string" || !body.token) return Response.json({ error: "token is required" }, { status: 400 });
    const existing = await Lead.get(body.id).catch((e) => (e.status === 404 ? null : Promise.reject(e)));
    if (!existing || existing.edit_token !== body.token) return Response.json({ error: "Not found" }, { status: 404 });

    const updated = await Lead.update(body.id, data);
    if (data.completed === true && !existing.completed) {
      await notify({ ...existing, ...data }).catch((e) => console.error("Notify failed:", e));
    }
    return Response.json({ id: updated.id, ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}