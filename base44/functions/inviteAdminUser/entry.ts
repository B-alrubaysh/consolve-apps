import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const me = await base44.auth.me();

    if (!me) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Look up the inviter's User record by email to check their role/status.
    const inviterRecords = await base44.asServiceRole.entities.User.filter({ email: me.email });
    const inviter = inviterRecords[0];
    if (!inviter || inviter.status !== 'active' || !['owner', 'admin'].includes(inviter.role)) {
      return Response.json({ error: 'Forbidden — only owner/admin can invite users' }, { status: 403 });
    }

    const { email, role } = await req.json();

    if (!email || !role) {
      return Response.json({ error: 'email and role are required' }, { status: 400 });
    }
    if (!['admin', 'writer', 'hr'].includes(role)) {
      return Response.json({ error: 'Invalid role. Allowed: admin, writer, hr' }, { status: 400 });
    }

    // Dedupe — pending invite already exists.
    const pending = await base44.asServiceRole.entities.AdminInvite.filter({ email, status: 'pending' });
    if (pending.length > 0) {
      return Response.json({ error: 'An invite is already pending for this email.' }, { status: 409 });
    }

    // Dedupe — user is already an active admin/writer/hr/owner.
    const existingUsers = await base44.asServiceRole.entities.User.filter({ email });
    const existingActiveAdmin = existingUsers.find(
      (u) => u.status === 'active' && ['owner', 'admin', 'writer', 'hr'].includes(u.role)
    );
    if (existingActiveAdmin) {
      return Response.json({ error: 'This user is already an admin.' }, { status: 409 });
    }

    // Record the pending invite — this is the source of truth for the role and
    // is applied on first login by claimAdminInvite. Always written first.
    await base44.asServiceRole.entities.AdminInvite.create({
      email,
      role,
      invited_by: me.email,
      status: 'pending',
      invite_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    // Send a branded invite email via Resend. Never throw — the AdminInvite is
    // already persisted and will apply on first sign-in regardless.
    let emailSent = false;
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (apiKey) {
      const from = Deno.env.get("RESEND_FROM") || "Consolve <onboarding@resend.dev>";
      const loginUrl = "https://consolve.sa/admin/login";
      const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);
      const subject = "You've been invited to the Consolve admin panel";

      const text = `Hello,

You've been granted ${roleLabel} access to the Consolve admin panel.

To get started, visit ${loginUrl} and sign up (or sign in) using this email address: ${email}.

Your admin access will be applied automatically on your first sign-in.

Best regards,
The Consolve Team`;

      const html = `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1a2a33; max-width: 560px;">
  <p style="margin: 0 0 16px;">Hello,</p>
  <p style="margin: 0 0 16px;">You've been granted <strong>${roleLabel}</strong> access to the Consolve admin panel.</p>
  <p style="margin: 0 0 16px;">To get started, visit
    <a href="${loginUrl}" style="color: #e07856; text-decoration: none; font-weight: 600;">${loginUrl}</a>
    and sign up (or sign in) using this email address: <strong>${email}</strong>.
  </p>
  <p style="margin: 0 0 16px;">Your admin access will be applied automatically on your first sign-in.</p>
  <p style="margin: 24px 0 0; color: #4a5d66;">Best regards,<br/>The Consolve Team</p>
</div>`;

      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ from, to: [email], subject, text, html }),
        });
        emailSent = res.ok;
        if (!res.ok) {
          const detail = await res.text();
          console.error("Resend invite error:", res.status, detail);
        }
      } catch (e) {
        console.error("Resend invite fetch failed (non-fatal):", e?.message);
      }
    }

    return Response.json({ success: true, email, role, emailSent });
  } catch (error) {
    console.error('inviteAdminUser error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});