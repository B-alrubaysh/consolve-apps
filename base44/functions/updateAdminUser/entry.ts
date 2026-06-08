import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Update or remove an admin user.
// - Owner cannot be removed or demoted by anyone.
// - Only owner/admin can mutate users.
// - Exactly one owner is allowed at any time.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const me = await base44.auth.me();

    if (!me) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const inviterRecords = await base44.asServiceRole.entities.User.filter({ email: me.email });
    const inviter = inviterRecords[0];
    if (!inviter || inviter.status !== 'active' || !['owner', 'admin'].includes(inviter.role)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { action, target_user_id, updates } = await req.json();

    if (!target_user_id) return Response.json({ error: 'target_user_id required' }, { status: 400 });

    const target = await base44.asServiceRole.entities.User.filter({ id: target_user_id });
    if (target.length === 0) return Response.json({ error: 'User not found' }, { status: 404 });
    const targetUser = target[0];

    // Owner is sacred.
    if (targetUser.role === 'owner') {
      return Response.json({ error: 'The owner cannot be modified or removed' }, { status: 403 });
    }

    if (action === 'delete') {
      await base44.asServiceRole.entities.User.delete(targetUser.id);
      return Response.json({ success: true });
    }

    if (action === 'update') {
      const safe = {};
      if (updates.role !== undefined) {
        if (updates.role === 'owner') {
          return Response.json({ error: 'Cannot promote to owner. Only one owner is permitted.' }, { status: 403 });
        }
        if (!['admin', 'writer', 'hr'].includes(updates.role)) {
          return Response.json({ error: 'Invalid role' }, { status: 400 });
        }
        safe.role = updates.role;
      }
      if (updates.status !== undefined) {
        if (!['invited', 'active', 'suspended'].includes(updates.status)) {
          return Response.json({ error: 'Invalid status' }, { status: 400 });
        }
        safe.status = updates.status;
      }
      await base44.asServiceRole.entities.User.update(targetUser.id, safe);
      return Response.json({ success: true });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('updateAdminUser error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});