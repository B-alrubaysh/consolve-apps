// Same-origin admin user fetch.
//
// Why this exists:
// `base44.auth.me()` resolves against the platform host (app.base44.com), which
// returns 401 for sessions established on the custom domain (consolve.sa) — that
// caused the admin login loop. The same call against the *current origin*
// (`GET /api/apps/<appId>/entities/User/me`) with the Bearer token returns the
// full User record (id, email, role, status, ...).
//
// Public pages must NOT use this — they remain anonymous.

import { appParams } from "@/lib/app-params";

function readToken() {
  if (appParams?.token) return appParams.token;
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem("base44_access_token") || null;
  } catch {
    return null;
  }
}

/**
 * Returns the current admin user's full User entity record, or null if not
 * authenticated / not authorized.
 */
export async function getAdminUser() {
  const token = readToken();
  const appId = appParams?.appId;
  if (!token || !appId) return null;

  try {
    const res = await fetch(`/api/apps/${appId}/entities/User/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}