// Campaign attribution: remembers UTM params + external referrer from the
// visitor's landing URL so they can be attached to a later submission, even
// after browsing other pages. A new campaign URL replaces the stored values.
const KEY = "consolve_attribution";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

export function getAttribution() {
  try { return JSON.parse(localStorage.getItem(KEY) || "null") || {}; } catch { return {}; }
}

function externalReferrer() {
  const ref = document.referrer || "";
  try { return ref && new URL(ref).origin !== window.location.origin ? ref : ""; } catch { return ""; }
}

export function captureAttribution() {
  const params = new URLSearchParams(window.location.search);
  const hasUtm = UTM_KEYS.some((k) => params.get(k));
  const stored = localStorage.getItem(KEY);
  if (!hasUtm && stored) return;
  const next = { referrer: externalReferrer() || getAttribution().referrer || "", landing_page: window.location.pathname + window.location.search };
  UTM_KEYS.forEach((k) => { next[k] = params.get(k) || ""; });
  localStorage.setItem(KEY, JSON.stringify(next));
}