// Invite-only signup enforcement.
//
// Trigger: SCHEDULED — runs hourly. The built-in User entity does not support
// entity-level "create" automations on this platform, so we cannot react to a
// real "user-registered" event. Instead, this function scans every default-role
// account created since the last run and applies the rules below. The signup
// form itself stays fully public — visitors do not need to log in to browse.
//
// Decision rules (in order):
//   1. KEEP — the owner email b.alrubaysh@gmail.com is never touched.
//   2. KEEP — user already has a privileged role (owner / admin / writer / hr).
//   3. KEEP — there is a pending AdminInvite whose email matches the user's
//      email (case-insensitive). The existing `claimAdminInvite` flow will
//      promote them on first admin visit.
//   4. DELETE — none of the above. Removed via service role (same approach
//      `updateAdminUser` uses for its delete action).
//
// Every decision is logged so the audit trail lives in the function logs:
// Dashboard → Code → Functions → enforceInviteOnlySignup → Logs.

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const OWNER_EMAIL = 'b.alrubaysh@gmail.com';
const PRIVILEGED_ROLES = ['owner', 'admin', 'writer', 'hr'];
// 75 minutes — overlaps the 60-minute schedule slightly so a slow run never
// leaves a gap where a signup escapes the scan.
const SCAN_WINDOW_MS = 75 * 60 * 1000;

function normalizeEmail(value) {
  return String(value || '').toLowerCase().trim();
}

async function decideAndAct({ base44, user, pendingInviteEmails }) {
  const userId = user.id;
  const email = normalizeEmail(user.email);
  const role = user.role || 'user';

  // Rule 1 — owner email is sacred.
  if (email === OWNER_EMAIL.toLowerCase()) {
    console.log('[enforceInviteOnlySignup] KEEP owner_email', { userId, email });
    return { decision: 'keep', reason: 'owner_email', userId, email };
  }

  // Rule 2 — privileged role.
  if (PRIVILEGED_ROLES.includes(role)) {
    console.log('[enforceInviteOnlySignup] KEEP privileged_role', { userId, email, role });
    return { decision: 'keep', reason: 'privileged_role', userId, email, role };
  }

  // Rule 3 — pending invite for this email.
  if (pendingInviteEmails.has(email)) {
    console.log('[enforceInviteOnlySignup] KEEP pending_invite', { userId, email });
    return { decision: 'keep', reason: 'pending_invite', userId, email };
  }

  // Rule 4 — uninvited account. Delete via service role.
  await base44.asServiceRole.entities.User.delete(userId);
  console.log('[enforceInviteOnlySignup] DELETED uninvited_signup', {
    userId,
    email,
    role,
    fullName: user.full_name || null,
    createdDate: user.created_date || null,
  });
  return { decision: 'delete', userId, email, role };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Fetch the pending-invite email set ONCE per run.
    const invites = await base44.asServiceRole.entities.AdminInvite
      .filter({ status: 'pending' })
      .catch(() => []);
    const pendingInviteEmails = new Set(
      (invites || []).map((inv) => normalizeEmail(inv.email))
    );

    // Pull the most-recently-created users and keep only those created within
    // the scan window AND still holding the default "user" role.
    const recentUsers = await base44.asServiceRole.entities.User
      .list('-created_date', 500)
      .catch(() => []);
    const cutoffMs = Date.now() - SCAN_WINDOW_MS;
    const candidates = (recentUsers || []).filter((u) => {
      const role = u.role || 'user';
      if (role !== 'user') return false;
      const createdMs = new Date(u.created_date || 0).getTime();
      return Number.isFinite(createdMs) && createdMs >= cutoffMs;
    });

    console.log('[enforceInviteOnlySignup] run start', {
      candidates: candidates.length,
      pendingInvites: pendingInviteEmails.size,
      windowMinutes: SCAN_WINDOW_MS / 60000,
    });

    const results = [];
    for (const user of candidates) {
      try {
        const r = await decideAndAct({ base44, user, pendingInviteEmails });
        results.push(r);
      } catch (err) {
        console.error('[enforceInviteOnlySignup] per-user error', {
          userId: user?.id,
          email: user?.email,
          error: err?.message,
        });
        results.push({ decision: 'error', userId: user?.id, error: err?.message });
      }
    }

    const kept = results.filter((r) => r.decision === 'keep').length;
    const deleted = results.filter((r) => r.decision === 'delete').length;
    const errored = results.filter((r) => r.decision === 'error').length;
    console.log('[enforceInviteOnlySignup] run complete', { kept, deleted, errored });

    return Response.json({
      scanned: candidates.length,
      kept,
      deleted,
      errored,
      results,
    });
  } catch (error) {
    console.error('[enforceInviteOnlySignup] FATAL', error?.message, error?.stack);
    return Response.json({ error: error?.message || 'unknown error' }, { status: 500 });
  }
});