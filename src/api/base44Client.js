import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

// Resolve the auth host to the same origin the app is served from (e.g. consolve.sa).
// Without this, the SDK falls back to https://app.base44.com for auth.me() — which
// returns 401 for sessions established on the custom domain, causing an /admin/login
// redirect loop. Entity calls already use same-origin via serverUrl: ''.
const sameOriginAppBaseUrl =
  typeof window !== 'undefined' ? window.location.origin : appParams.appBaseUrl;

export const base44 = createClient({
  appId: appParams.appId,
  token: appParams.token,
  functionsVersion: appParams.functionsVersion,
  serverUrl: '',
  requiresAuth: false,
  appBaseUrl: sameOriginAppBaseUrl,
});