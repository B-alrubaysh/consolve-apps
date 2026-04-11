import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "consolve_salt_2024");
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function getManageableRoles(role) {
  if (role === "owner") return ["admin", "cms_manager", "hr"];
  if (role === "admin") return ["cms_manager", "hr"];
  return [];
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { action, requestingUserId } = body;

    // Verify requesting user
    if (!requestingUserId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reqUsers = await base44.asServiceRole.entities.AdminUser.filter({ id: requestingUserId });
    if (!reqUsers || reqUsers.length === 0) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const requestingUser = reqUsers[0];
    if (requestingUser.status !== "active") {
      return Response.json({ error: "Account deactivated" }, { status: 403 });
    }

    const allowedRoles = ["owner", "admin"];
    if (!allowedRoles.includes(requestingUser.role)) {
      return Response.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    if (action === "list") {
      const allUsers = await base44.asServiceRole.entities.AdminUser.list("-created_date", 200);
      // Admin can only see cms_manager and hr
      const manageableRoles = getManageableRoles(requestingUser.role);
      const filteredUsers = requestingUser.role === "owner"
        ? allUsers
        : allUsers.filter(u => manageableRoles.includes(u.role));

      // Strip password hashes
      const safeUsers = filteredUsers.map(u => ({
        id: u.id,
        full_name: u.full_name,
        email: u.email,
        role: u.role,
        is_super_admin: u.is_super_admin,
        status: u.status,
        last_login: u.last_login,
        created_date: u.created_date
      }));

      return Response.json({ users: safeUsers });
    }

    if (action === "create") {
      const { full_name, email, password, role, is_super_admin } = body;
      if (!full_name || !email || !password || !role) {
        return Response.json({ error: "All fields required" }, { status: 400 });
      }
      if (password.length < 8) {
        return Response.json({ error: "Password must be at least 8 characters" }, { status: 400 });
      }

      const manageableRoles = getManageableRoles(requestingUser.role);
      if (!manageableRoles.includes(role)) {
        return Response.json({ error: "Cannot create user with this role" }, { status: 403 });
      }

      // Check email uniqueness
      const existing = await base44.asServiceRole.entities.AdminUser.filter({ email: email.toLowerCase().trim() });
      if (existing && existing.length > 0) {
        return Response.json({ error: "Email already in use" }, { status: 400 });
      }

      const passwordHash = await hashPassword(password);
      const newUser = await base44.asServiceRole.entities.AdminUser.create({
        full_name,
        email: email.toLowerCase().trim(),
        password_hash: passwordHash,
        role,
        is_super_admin: role === "admin" && is_super_admin ? true : false,
        status: "active"
      });

      await base44.asServiceRole.entities.ActivityLog.create({
        admin_user_id: requestingUser.id,
        admin_user_name: requestingUser.full_name,
        admin_user_email: requestingUser.email,
        action: `Created user: ${full_name} (${email}) with role ${role}`,
        module: "users"
      });

      return Response.json({ success: true, userId: newUser.id });
    }

    if (action === "update") {
      const { userId, full_name, email, role } = body;
      if (!userId) return Response.json({ error: "User ID required" }, { status: 400 });

      const targetUsers = await base44.asServiceRole.entities.AdminUser.filter({ id: userId });
      if (!targetUsers || targetUsers.length === 0) {
        return Response.json({ error: "User not found" }, { status: 400 });
      }
      const targetUser = targetUsers[0];

      // Can't edit owner unless you're owner
      if (targetUser.role === "owner" && requestingUser.role !== "owner") {
        return Response.json({ error: "Cannot modify owner accounts" }, { status: 403 });
      }

      // Admin can only edit manageable roles
      if (requestingUser.role === "admin") {
        const manageableRoles = getManageableRoles("admin");
        if (!manageableRoles.includes(targetUser.role)) {
          return Response.json({ error: "Cannot modify this user" }, { status: 403 });
        }
        if (role && !manageableRoles.includes(role)) {
          return Response.json({ error: "Cannot assign this role" }, { status: 403 });
        }
      }

      const updates = {};
      if (full_name) updates.full_name = full_name;
      if (email) updates.email = email.toLowerCase().trim();
      if (role) updates.role = role;

      await base44.asServiceRole.entities.AdminUser.update(userId, updates);

      await base44.asServiceRole.entities.ActivityLog.create({
        admin_user_id: requestingUser.id,
        admin_user_name: requestingUser.full_name,
        admin_user_email: requestingUser.email,
        action: `Updated user: ${targetUser.full_name} (${targetUser.email})`,
        details: JSON.stringify(updates),
        module: "users"
      });

      return Response.json({ success: true });
    }

    if (action === "toggle_status") {
      const { userId } = body;
      const targetUsers = await base44.asServiceRole.entities.AdminUser.filter({ id: userId });
      if (!targetUsers || targetUsers.length === 0) {
        return Response.json({ error: "User not found" }, { status: 400 });
      }
      const targetUser = targetUsers[0];

      if (targetUser.role === "owner") {
        return Response.json({ error: "Cannot deactivate owner" }, { status: 403 });
      }
      if (requestingUser.role === "admin" && !getManageableRoles("admin").includes(targetUser.role)) {
        return Response.json({ error: "Cannot modify this user" }, { status: 403 });
      }

      const newStatus = targetUser.status === "active" ? "inactive" : "active";
      await base44.asServiceRole.entities.AdminUser.update(userId, { status: newStatus });

      await base44.asServiceRole.entities.ActivityLog.create({
        admin_user_id: requestingUser.id,
        admin_user_name: requestingUser.full_name,
        admin_user_email: requestingUser.email,
        action: `${newStatus === "active" ? "Reactivated" : "Deactivated"} user: ${targetUser.full_name}`,
        module: "users"
      });

      return Response.json({ success: true, newStatus });
    }

    if (action === "delete") {
      const { userId } = body;
      if (requestingUser.role !== "owner") {
        return Response.json({ error: "Only owner can delete users" }, { status: 403 });
      }

      const targetUsers = await base44.asServiceRole.entities.AdminUser.filter({ id: userId });
      if (!targetUsers || targetUsers.length === 0) {
        return Response.json({ error: "User not found" }, { status: 400 });
      }
      const targetUser = targetUsers[0];

      if (targetUser.role === "owner") {
        return Response.json({ error: "Cannot delete owner account" }, { status: 403 });
      }

      await base44.asServiceRole.entities.AdminUser.delete(userId);

      await base44.asServiceRole.entities.ActivityLog.create({
        admin_user_id: requestingUser.id,
        admin_user_name: requestingUser.full_name,
        admin_user_email: requestingUser.email,
        action: `Deleted user: ${targetUser.full_name} (${targetUser.email})`,
        module: "users"
      });

      return Response.json({ success: true });
    }

    if (action === "send_reset") {
      const { userId } = body;
      const targetUsers = await base44.asServiceRole.entities.AdminUser.filter({ id: userId });
      if (!targetUsers || targetUsers.length === 0) {
        return Response.json({ error: "User not found" }, { status: 400 });
      }
      const targetUser = targetUsers[0];

      // Trigger password reset
      const result = await base44.asServiceRole.functions.invoke("adminPasswordReset", {
        action: "request_reset",
        email: targetUser.email
      });

      return Response.json({ success: true });
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});