import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Accepts an invite token. Validates token + expiry, marks the user active,
// clears the token. The user must already be authenticated via Base44's
// platform login flow (since Base44 manages auth — passwords cannot be set
// directly).
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const me = await base44.auth.me();

    if (!me) {
      return Response.json({ error: 'You must be logged in via Base44 to accept this invite.' }, { status: 401 });
    }

    const { token } = await req.json();
    if (!token) return Response.json({ error: 'Token required' }, { status: 400 });

    const matches = await base44.asServiceRole.entities.User.filter({ invite_token: token });
    if (matches.length === 0) {
      return Response.json({ error: 'Invalid or already-used invite token.' }, { status: 404 });
    }

    const user = matches[0];

    if (user.email !== me.email) {
      return Response.json({ error: 'This invite was issued for a different account.' }, { status: 403 });
    }

    if (user.invite_expires_at && new Date(user.invite_expires_at) < new Date()) {
      return Response.json({ error: 'This invite has expired.' }, { status: 410 });
    }

    await base44.asServiceRole.entities.User.update(user.id, {
      status: 'active',
      invite_token: null,
      invite_expires_at: null,
      last_login_at: new Date().toISOString(),
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('acceptInvite error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});