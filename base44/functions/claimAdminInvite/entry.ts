import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const me = await base44.auth.me();

    if (!me) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Look up pending invites for this authenticated email.
    const invites = await base44.asServiceRole.entities.AdminInvite.filter({
      email: me.email,
      status: 'pending',
    });

    if (!invites || invites.length === 0) {
      return Response.json({ applied: false });
    }

    // Pick the first non-expired invite.
    const now = Date.now();
    const invite = invites.find((i) => {
      if (!i.invite_expires_at) return true;
      const exp = new Date(i.invite_expires_at).getTime();
      return Number.isNaN(exp) || exp > now;
    });

    if (!invite) {
      return Response.json({ applied: false, expired: true });
    }

    // Locate the caller's User entity record.
    const users = await base44.asServiceRole.entities.User.filter({ email: me.email });
    const user = users[0];
    if (!user) {
      // Platform record not materialized yet — safe to retry on next visit.
      return Response.json({ applied: false, pending: true });
    }

    // Apply role + mark invite accepted (service role bypasses RLS).
    await base44.asServiceRole.entities.User.update(user.id, {
      role: invite.role,
      status: 'active',
    });

    await base44.asServiceRole.entities.AdminInvite.update(invite.id, {
      status: 'accepted',
      accepted_at: new Date().toISOString(),
    });

    return Response.json({ applied: true, role: invite.role });
  } catch (error) {
    console.error('claimAdminInvite error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});