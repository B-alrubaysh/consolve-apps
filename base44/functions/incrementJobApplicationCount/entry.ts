import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Public endpoint (no auth) — increments a JobPost's application_count by 1.
// The applicant is anonymous; the increment runs via asServiceRole so the
// JobPost RLS (hr/admin/owner only) is bypassed safely server-side. The new
// count is computed from the server-side record, not from a client value.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const { job_post_id } = await req.json();
    if (!job_post_id) {
      return Response.json({ error: 'job_post_id required' }, { status: 400 });
    }

    const matches = await base44.asServiceRole.entities.JobPost.filter({ id: job_post_id });
    if (matches.length === 0) {
      return Response.json({ error: 'JobPost not found' }, { status: 404 });
    }

    const job = matches[0];
    const next = (job.application_count || 0) + 1;

    await base44.asServiceRole.entities.JobPost.update(job.id, {
      application_count: next,
    });

    return Response.json({ success: true, application_count: next });
  } catch (error) {
    console.error('incrementJobApplicationCount error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});