import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

// HR/admin/owner only: returns a short-lived link to an application's CV.
const ALLOWED = ['owner', 'admin', 'hr'];

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (!ALLOWED.includes(user.role)) return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { application_id } = await req.json().catch(() => ({}));
    if (!application_id) return Response.json({ error: 'application_id is required' }, { status: 400 });

    const app = await base44.asServiceRole.entities.JobApplication.get(String(application_id))
      .catch((e) => (e.status === 404 ? null : Promise.reject(e)));
    if (!app || !app.cv_url) return Response.json({ error: 'Not found' }, { status: 404 });

    // Older applications stored a public link; newer ones store a private file reference.
    if (/^https?:\/\//i.test(app.cv_url)) return Response.json({ url: app.cv_url });

    const { signed_url } = await base44.asServiceRole.integrations.Core.CreateFileSignedUrl({
      file_uri: app.cv_url,
      expires_in: 300,
    });
    return Response.json({ url: signed_url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}