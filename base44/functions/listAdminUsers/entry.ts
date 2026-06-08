import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const ADMIN_ROLES = ["owner", "admin", "writer", "hr"];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const me = await base44.auth.me();
    if (!me) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify caller is an active owner/admin.
    const callerRecords = await base44.asServiceRole.entities.User.filter({ email: me.email });
    const caller = callerRecords[0];
    if (!caller || caller.status !== "active" || !["owner", "admin"].includes(caller.role)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Load all admin team users (filter client-side by role).
    const all = await base44.asServiceRole.entities.User.list("-created_date", 500);
    const users = all.filter((u) => ADMIN_ROLES.includes(u.role));

    // Load pending invites.
    const pendingInvites = await base44.asServiceRole.entities.AdminInvite.filter({ status: "pending" });

    return Response.json({ users, pendingInvites });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});