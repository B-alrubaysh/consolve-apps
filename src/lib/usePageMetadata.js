import { useEffect } from "react";

// Shared brand — never override; this is what shows as the small header line
// above the title in WhatsApp / LinkedIn / Slack link previews.
const SITE_NAME = "Consolve Management Solutions";
const DEFAULT_IMAGE =
  "https://base44.app/api/apps/69c6e2cf0b61fa041c4eb06c/files/mp/public/69c6e2cf0b61fa041c4eb06c/8df118fe6_Logo3.png";

// Upsert a <meta> tag by name/property and return an undo record so we can
// restore the previous value (or remove the element) on unmount.
function upsertMeta(key, attr, content) {
  if (content == null || content === "") return null;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  const created = !el;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  const prev = el.getAttribute("content");
  el.setAttribute("content", content);
  return { el, prev, created };
}

/**
 * usePageMetadata — sets <title>, og:title, twitter:title, og:description,
 * og:image, og:url, og:type and twitter:description on mount, and restores
 * the previous values on unmount. Every public page uses this so social
 * previews carry that page's real title with the Consolve brand as
 * og:site_name (defined once in index.html, never overridden here).
 *
 * @param {object} opts
 * @param {string} opts.title       — the page-specific title (also becomes og/twitter title)
 * @param {string} [opts.description] — page description (og + twitter)
 * @param {string} [opts.image]     — absolute URL to the preview image
 * @param {string} [opts.type]      — og:type; defaults to "website"
 */
export function usePageMetadata({ title, description, image, type = "website" } = {}) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    // <title> — for the browser tab and non-OG-aware crawlers. We include the
    // brand suffix here (title | site) but NOT in og:title, because previews
    // already show og:site_name as a separate line — repeating it looks noisy.
    const prevTitle = document.title;
    if (title) document.title = `${title} | ${SITE_NAME}`;

    const url = typeof window !== "undefined" ? window.location.href : undefined;
    const finalImage = image || DEFAULT_IMAGE;
    const ogTitle = title || SITE_NAME;

    const undo = [
      upsertMeta("og:title", "property", ogTitle),
      upsertMeta("twitter:title", "name", ogTitle),
      upsertMeta("og:description", "property", description),
      upsertMeta("twitter:description", "name", description),
      upsertMeta("description", "name", description),
      upsertMeta("og:image", "property", finalImage),
      upsertMeta("twitter:image", "name", finalImage),
      upsertMeta("og:url", "property", url),
      upsertMeta("og:type", "property", type),
      // og:site_name is set in index.html and stays constant across every page;
      // we re-assert it here defensively so a stale override never leaks.
      upsertMeta("og:site_name", "property", SITE_NAME),
    ].filter(Boolean);

    return () => {
      document.title = prevTitle;
      undo.forEach(({ el, prev, created }) => {
        if (created) {
          el.parentNode?.removeChild(el);
        } else if (prev != null) {
          el.setAttribute("content", prev);
        }
      });
    };
  }, [title, description, image, type]);
}

export default usePageMetadata;