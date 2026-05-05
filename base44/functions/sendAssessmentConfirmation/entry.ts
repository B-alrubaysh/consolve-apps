// Sends an assessment confirmation email to the submitter via Resend.
// Public endpoint — used by the public assessment flow, so no auth required.

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { to, contact_name, company_name, lang } = payload || {};
  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return Response.json({ error: "Valid recipient email is required" }, { status: 400 });
  }

  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    return Response.json({ error: "Email service not configured" }, { status: 500 });
  }

  const isAr = lang === "ar";
  const subject = isAr
    ? "تم استلام تقييمك من كونسولف"
    : "Your Consolve Assessment Has Been Received";

  const greeting = contact_name || (isAr ? "عزيزنا" : "there");
  const company = company_name || (isAr ? "شركتك" : "your company");

  const text = isAr
    ? `عزيزي ${greeting}،

شكراً لإتمامك التقييم الذكي لشركة ${company}.

تم استلام طلبك. سيقوم فريقنا بمراجعة نتائج تقييمك والتواصل معك قريباً لمناقشة الخطوات التالية.

مع أطيب التحيات،
فريق كونسولف`
    : `Dear ${greeting},

Thank you for completing the Consolve Smart Assessment for ${company}.

Your request has been received. Our team will review your assessment results and contact you shortly.

Best regards,
The Consolve Team`;

  const html = `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1a2a33; max-width: 560px;">
    ${text.split("\n").map((line) => `<p style="margin: 0 0 12px;">${line || "&nbsp;"}</p>`).join("")}
  </div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Consolve <onboarding@resend.dev>",
      to: [to],
      subject,
      text,
      html,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("Resend error:", res.status, detail);
    return Response.json({ error: "Failed to send email", detail }, { status: 502 });
  }

  return Response.json({ success: true });
});