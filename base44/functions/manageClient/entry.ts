import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Create / update / delete Client records on behalf of an authorized admin.
// Frontend can't write to Client directly because the entity RLS evaluates the
// platform user role, not the app-level User.role. This function verifies the
// caller's User entity role (owner/admin) and uses asServiceRole for the write.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const me = await base44.auth.me();
    if (!me) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const callerRecords = await base44.asServiceRole.entities.User.filter({ email: me.email });
    const caller = callerRecords[0];
    if (!caller || caller.status !== 'active' || !['owner', 'admin'].includes(caller.role)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { action, id, data } = await req.json();

    if (action === 'create') {
      if (!data?.name_en || !data?.logo_url) {
        return Response.json({ error: 'name_en and logo_url are required' }, { status: 400 });
      }
      const created = await base44.asServiceRole.entities.Client.create(data);
      return Response.json({ success: true, client: created });
    }

    if (action === 'update') {
      if (!id) return Response.json({ error: 'id required' }, { status: 400 });
      const updated = await base44.asServiceRole.entities.Client.update(id, data || {});
      return Response.json({ success: true, client: updated });
    }

    if (action === 'delete') {
      if (!id) return Response.json({ error: 'id required' }, { status: 400 });
      await base44.asServiceRole.entities.Client.delete(id);
      return Response.json({ success: true });
    }

    if (action === 'reorder') {
      // data: [{ id, display_order }, ...]
      if (!Array.isArray(data)) return Response.json({ error: 'data must be an array' }, { status: 400 });
      for (const row of data) {
        if (!row?.id) continue;
        await base44.asServiceRole.entities.Client.update(row.id, { display_order: Number(row.display_order) || 0 });
      }
      return Response.json({ success: true });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('manageClient error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});