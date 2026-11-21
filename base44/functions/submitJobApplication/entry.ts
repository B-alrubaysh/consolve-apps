import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

// Public: the only way to submit a job application (or a general CV
// submission). Enforces the job's open status, closing date and application
// limit server-side, blocks duplicate applications per email, and increments
// the job's application count in the same flow.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clip = (v, max) => String(v ?? '').trim().slice(0, max);

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const email = clip(body.email, 254).toLowerCase();
    const fullName = clip(body.full_name, 150);
    if (!fullName || !EMAIL_RE.test(email)) {
      return Response.json({ error: 'invalid_input' }, { status: 400 });
    }

    const base = {
      full_name: fullName,
      email,
      phone: clip(body.phone, 40),
      cv_url: clip(body.cv_file_uri, 500) || null,
      cover_message: clip(body.cover_message, 5000),
      consent_given: true,
      language: body.language === 'ar' ? 'ar' : 'en',
      source_page: '/careers',
      status: 'new',
    };

    if (!body.job_post_id) {
      await base44.asServiceRole.entities.JobApplication.create({
        ...base, submission_type: 'general_submission', job_post_id: null,
      });
      return Response.json({ success: true });
    }

    const job = await base44.asServiceRole.entities.JobPost.get(String(body.job_post_id))
      .catch((e) => (e.status === 404 ? null : Promise.reject(e)));
    if (!job || job.status !== 'open') return Response.json({ error: 'job_closed' }, { status: 409 });
    if (job.closing_date && new Date(job.closing_date).getTime() < Date.now()) {
      return Response.json({ error: 'job_closed' }, { status: 409 });
    }
    const count = job.application_count || 0;
    if (job.application_limit != null && count >= job.application_limit) {
      return Response.json({ error: 'job_closed' }, { status: 409 });
    }
    if (!base.cv_url) return Response.json({ error: 'cv_required' }, { status: 400 });

    const existing = await base44.asServiceRole.entities.JobApplication.filter({ job_post_id: job.id, email }, '-created_date', 1);
    if ((existing || []).length > 0) return Response.json({ error: 'already_applied' }, { status: 409 });

    await base44.asServiceRole.entities.JobApplication.create({
      ...base,
      submission_type: 'job_application',
      job_post_id: job.id,
      linkedin_url: clip(body.linkedin_url, 500),
      portfolio_url: clip(body.portfolio_url, 500),
    });
    await base44.asServiceRole.entities.JobPost.update(job.id, { application_count: count + 1 });

    return Response.json({ success: true });
  } catch (error) {
    console.error('submitJobApplication error:', error?.message);
    return Response.json({ error: 'server_error' }, { status: 500 });
  }
}