import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "consolve_salt_2024");
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function generateResetToken() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { action } = body;

    if (action === "request_reset") {
      const { email } = body;
      if (!email) return Response.json({ error: "Email required" }, { status: 400 });

      const users = await base44.asServiceRole.entities.AdminUser.filter({ email: email.toLowerCase().trim() });
      // Always return success to not reveal if email exists
      if (!users || users.length === 0) {
        return Response.json({ success: true });
      }

      const user = users[0];
      const resetToken = generateResetToken();
      const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

      await base44.asServiceRole.entities.AdminUser.update(user.id, {
        reset_token: resetToken,
        reset_token_expires: expires
      });

      // Send email via Resend
      const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
      const resetLink = `${req.headers.get("origin") || "https://clear-solve-path.base44.app"}/csaccess?reset=${resetToken}`;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "noreply@consolve.com",
          to: user.email,
          subject: "Password Reset - Consolve Admin",
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
              <h2>Password Reset</h2>
              <p>Hi ${user.full_name},</p>
              <p>You requested a password reset for your Consolve admin account.</p>
              <p><a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background: #D4836B; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a></p>
              <p style="color: #666; font-size: 14px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
            </div>
          `
        })
      });

      await base44.asServiceRole.entities.ActivityLog.create({
        admin_user_id: user.id,
        admin_user_name: user.full_name,
        admin_user_email: user.email,
        action: "Password reset requested",
        module: "auth"
      });

      return Response.json({ success: true });
    }

    if (action === "reset_password") {
      const { token, password } = body;
      if (!token || !password) return Response.json({ error: "Token and password required" }, { status: 400 });
      if (password.length < 8) return Response.json({ error: "Password must be at least 8 characters" }, { status: 400 });

      const users = await base44.asServiceRole.entities.AdminUser.filter({ reset_token: token });
      if (!users || users.length === 0) {
        return Response.json({ error: "Invalid or expired reset link" }, { status: 400 });
      }

      const user = users[0];
      if (new Date(user.reset_token_expires) < new Date()) {
        return Response.json({ error: "Reset link has expired" }, { status: 400 });
      }

      const passwordHash = await hashPassword(password);
      await base44.asServiceRole.entities.AdminUser.update(user.id, {
        password_hash: passwordHash,
        reset_token: "",
        reset_token_expires: ""
      });

      await base44.asServiceRole.entities.ActivityLog.create({
        admin_user_id: user.id,
        admin_user_name: user.full_name,
        admin_user_email: user.email,
        action: "Password reset completed",
        module: "auth"
      });

      return Response.json({ success: true });
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});