import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

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

    const { email, role, full_name } = await req.json();

    if (!email || !role) {
      return Response.json({ error: 'email and role are required' }, { status: 400 });
    }
    if (!['admin', 'writer', 'hr'].includes(role)) {
      return Response.json({ error: 'Invalid role. Allowed: admin, writer, hr' }, { status: 400 });
    }

    // Check if a user with this email already exists.
    const existing = await base44.asServiceRole.entities.User.filter({ email });
    if (existing.length > 0) {
      return Response.json({ error: 'A user with this email already exists' }, { status: 409 });
    }

    // Generate invite token.
    const token = crypto.randomUUID().replace(/-/g, '');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    // Invite via Base44 platform (sends standard onboarding email + creates the User record).
    // Role on the platform = 'user'; our app-level role lives on the entity record.
    const platformRole = role === 'admin' ? 'admin' : 'user';
    await base44.asServiceRole.users.inviteUser(email, platformRole);

    // Update the newly created User record with our extended fields.
    // Wait briefly for the record to exist, then patch.
    let invitedUser = null;
    for (let i = 0; i < 5; i++) {
      const rec = await base44.asServiceRole.entities.User.filter({ email });
      if (rec.length > 0) {
        invitedUser = rec[0];
        break;
      }
      await new Promise((r) => setTimeout(r, 400));
    }

    if (invitedUser) {
      await base44.asServiceRole.entities.User.update(invitedUser.id, {
        role,
        status: 'invited',
        invited_by: me.email,
        invite_token: token,
        invite_expires_at: expiresAt,
        full_name: full_name || invitedUser.full_name || email.split('@')[0],
      });
    }

    return Response.json({ success: true, email, role, invite_token: token, invite_expires_at: expiresAt });
  } catch (error) {
    console.error('inviteAdminUser error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});