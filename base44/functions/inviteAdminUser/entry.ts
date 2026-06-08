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

    // Record the pending invite FIRST — this is the source of truth for the role and
    // must always be written. The role is applied on first login by claimAdminInvite.
    await base44.asServiceRole.entities.AdminInvite.create({
      email,
      role,
      invited_by: me.email,
      status: 'pending',
      invite_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    // Best-effort: send Base44's native invite email. Never abort on failure —
    // the AdminInvite is already persisted and will apply on next login.
    let emailSent = true;
    try {
      await base44.users.inviteUser(email, 'user');
    } catch (e) {
      emailSent = false;
      console.error('inviteUser failed (non-fatal):', e?.message);
    }

    return Response.json({ success: true, email, role, emailSent });
  } catch (error) {
    console.error('inviteAdminUser error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});