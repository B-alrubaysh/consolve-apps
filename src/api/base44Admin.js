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
//
// IMPORTANT — LAZY INITIALIZATION:
// `createClient({ requiresAuth: true })` triggers a redirect to /login the moment
// the SDK detects no session. Because the whole app is bundled together, simply
// `export const base44 = createClient(...)` at module load runs on EVERY page —
// including public ones — and instantly kicks anonymous visitors to /login.
//
// To fix that, the real client is constructed lazily on first property access via
// a Proxy. Public pages never touch any property of this object, so the
// `createClient` call never runs for anonymous visitors. Admin pages access
// properties inside effects/handlers, which is when the client is actually built.

import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

let _client = null;

function getClient() {
  if (_client) return _client;

  // Same trick as the anonymous client: pin the auth host to the same origin the
  // app is served from so a session established on the custom domain (e.g.
  // consolve.sa) is recognized instead of failing against app.base44.com.
  const sameOriginAppBaseUrl =
    typeof window !== 'undefined' ? window.location.origin : appParams.appBaseUrl;

  _client = createClient({
    appId: appParams.appId,
    token: appParams.token,
    functionsVersion: appParams.functionsVersion,
    serverUrl: '',
    requiresAuth: true,
    appBaseUrl: sameOriginAppBaseUrl,
  });

  return _client;
}

// Exported Proxy — drop-in replacement for the previous eager client.
// Existing imports (`import { base44 } from "@/api/base44Admin"`) keep working;
// the real client is only built on the first property access.
export const base44 = new Proxy(
  {},
  {
    get(_target, prop) {
      const client = getClient();
      const value = client[prop];
      return typeof value === 'function' ? value.bind(client) : value;
    },
    has(_target, prop) {
      return prop in getClient();
    },
  }
);