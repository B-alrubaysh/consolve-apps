import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "consolve_salt_2024");
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function generateToken() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { action } = body;

    if (action === "login") {
      const { email, password } = body;
      if (!email || !password) {
        return Response.json({ error: "Email and password required" }, { status: 400 });
      }

      const users = await base44.asServiceRole.entities.AdminUser.filter({ email: email.toLowerCase().trim() });
      if (!users || users.length === 0) {
        return Response.json({ error: "Invalid email or password" }, { status: 401 });
      }

      const user = users[0];
      if (user.status !== "active") {
        return Response.json({ error: "Account is deactivated. Contact your administrator." }, { status: 403 });
      }

      const passwordHash = await hashPassword(password);
      if (passwordHash !== user.password_hash) {
        return Response.json({ error: "Invalid email or password" }, { status: 401 });
      }

      const sessionToken = await generateToken();
      await base44.asServiceRole.entities.AdminUser.update(user.id, {
        last_login: new Date().toISOString()
      });

      // Log activity
      await base44.asServiceRole.entities.ActivityLog.create({
        admin_user_id: user.id,
        admin_user_name: user.full_name,
        admin_user_email: user.email,
        action: "Logged in",
        module: "auth"
      });

      return Response.json({
        token: sessionToken,
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
          is_super_admin: user.is_super_admin
        }
      });
    }

    if (action === "setup_owner") {
      // Check if any owner exists
      const owners = await base44.asServiceRole.entities.AdminUser.filter({ role: "owner" });
      if (owners && owners.length > 0) {
        return Response.json({ error: "Owner account already exists" }, { status: 400 });
      }

      const { full_name, email, password } = body;
      if (!full_name || !email || !password) {
        return Response.json({ error: "All fields required" }, { status: 400 });
      }

      if (password.length < 8) {
        return Response.json({ error: "Password must be at least 8 characters" }, { status: 400 });
      }

      const passwordHash = await hashPassword(password);
      const owner = await base44.asServiceRole.entities.AdminUser.create({
        full_name,
        email: email.toLowerCase().trim(),
        password_hash: passwordHash,
        role: "owner",
        is_super_admin: false,
        status: "active"
      });

      await base44.asServiceRole.entities.ActivityLog.create({
        admin_user_id: owner.id,
        admin_user_name: full_name,
        admin_user_email: email,
        action: "Owner account created (initial setup)",
        module: "auth"
      });

      return Response.json({ success: true });
    }

    if (action === "check_setup") {
      const owners = await base44.asServiceRole.entities.AdminUser.filter({ role: "owner" });
      return Response.json({ hasOwner: owners && owners.length > 0 });
    }

    if (action === "verify_session") {
      const { userId } = body;
      if (!userId) {
        return Response.json({ error: "No session" }, { status: 401 });
      }
      const users = await base44.asServiceRole.entities.AdminUser.filter({ id: userId });
      if (!users || users.length === 0) {
        return Response.json({ error: "User not found" }, { status: 401 });
      }
      const user = users[0];
      if (user.status !== "active") {
        return Response.json({ error: "Account deactivated" }, { status: 403 });
      }
      return Response.json({
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
          is_super_admin: user.is_super_admin
        }
      });
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});