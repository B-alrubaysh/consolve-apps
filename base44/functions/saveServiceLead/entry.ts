// Public endpoint for service landing-page forms (e.g. /management-audit).
// Visitors are anonymous, so the record is created with the service role after
// validating the input. Each submission emails info@consolve.sa.
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { secrets } from 'base44:runtime';

const SERVICES = { management_audit: "Management Audit" };
const FIELDS = [
  "full_name", "company_name", "email", "phone", "message", "language", "source_page",
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "referrer", "landing_page",
];

const esc = (v) => String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

async function notify(lead) {
  const apiKey = secrets.get("RESEND_API_KEY");
  if (!apiKey) return;
  const rows = [
    ["Service", SERVICES[lead.service]], ["Name", lead.full_name], ["Company", lead.company_name],
    ["Email", lead.email], ["Phone", lead.phone], ["Challenge / Goal", lead.message],
    ["Campaign", [lead.utm_source, lead.utm_medium, lead.utm_campaign].filter(Boolean).join(" / ")],
    ["Referrer", lead.referrer], ["Language", lead.language],
  ];
  const html = `<div style="font-family:Arial,sans-serif;color:#0f2124;max-width:600px">
    <h2 style="margin:0 0 16px">New ${esc(SERVICES[lead.service])} request</h2>
    <table style="border-collapse:collapse;width:100%">${rows.map(([k, v]) =>
      `<tr><td style="padding:6px 10px;border:1px solid #e5e7eb;font-weight:bold;width:160px">${k}</td><td style="padding:6px 10px;border:1px solid #e5e7eb;white-space:pre-wrap">${esc(v) || "-"}</td></tr>`).join("")}
    </table></div>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: secrets.get("RESEND_FROM") || "Consolve <onboarding@resend.dev>",
      to: ["info@consolve.sa"],
      reply_to: lead.email || undefined,
      subject: `New ${SERVICES[lead.service]} request: ${lead.company_name || lead.full_name}`,
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
    const input = body?.data || {};
    if (!SERVICES[input.service]) return Response.json({ error: "Unknown service" }, { status: 400 });

    const lead = { service: input.service, consent_given: input.consent_given === true };
    for (const k of FIELDS) if (typeof input[k] === "string") lead[k] = input[k].trim().slice(0, k === "message" ? 5000 : 500);
    if (lead.language && !["ar", "en"].includes(lead.language)) delete lead.language;

    if (!lead.full_name || !lead.company_name || !lead.message) return Response.json({ error: "Missing required fields" }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email || "")) return Response.json({ error: "Invalid email" }, { status: 400 });
    if (!/^\+9665\d{8}$/.test(lead.phone || "")) return Response.json({ error: "Invalid phone" }, { status: 400 });
    if (!lead.consent_given) return Response.json({ error: "Consent is required" }, { status: 400 });

    const rec = await base44.asServiceRole.entities.ServiceLead.create({ ...lead, status: "New" });
    await notify(lead).catch((e) => console.error("Notify failed:", e));
    return Response.json({ id: rec.id, ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}