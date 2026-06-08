// Authenticated Base44 client used by the admin area ONLY.
//
// The default client (`@/api/base44Client`) is configured with `requiresAuth: false`
// so the public site stays fully anonymous. That client does NOT attach the user's
// access token to requests, which means `base44.auth.me()` returns 401 on the
// custom domain even when a valid token exists in localStorage.
//
// This second client is configured with `requiresAuth: true` so the SDK sends the
// `Authorization: Bearer <token>` header on every request. It is imported by the
// admin gate, admin pages, admin sub-components, and admin function invokes.
// Public pages must keep importing `@/api/base44Client` so anonymous browsing is
// preserved.

import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

// Same trick as the anonymous client: pin the auth host to the same origin the
// app is served from so a session established on the custom domain (e.g.
// consolve.sa) is recognized instead of failing against app.base44.com.
const sameOriginAppBaseUrl =
  typeof window !== 'undefined' ? window.location.origin : appParams.appBaseUrl;

export const base44 = createClient({
  appId: appParams.appId,
  token: appParams.token,
  functionsVersion: appParams.functionsVersion,
  serverUrl: '',
  requiresAuth: true,
  appBaseUrl: sameOriginAppBaseUrl,
});