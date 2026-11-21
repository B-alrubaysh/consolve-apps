import { useEffect } from "react";
import { getStoredLang } from "./useLanguage";

// Shared brand — this is what shows as the small header line above the title
// in WhatsApp / LinkedIn / Slack link previews.
const SITE_NAME = "Consolve Management Consulting";
const SITE_NAME_AR = "كونسولف للاستشارات الإدارية";

// 1200×630 brand share image used by every page that has no image of its own.
export const DEFAULT_SHARE_IMAGE =
  "https://base44.app/api/apps/69c6e2cf0b61fa041c4eb06c/files/mp/public/69c6e2cf0b61fa041c4eb06c/94fba1ad5_consolve-share-1200x630.png";

// Previews are single-line: collapse whitespace/newlines and cap the length.
export function cleanMetaText(text, max = 150) {
  const s = String(text || "").replace(/\s+/g, " ").trim();
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

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
  el.setAttribute("content", String(content));
  return { el, prev, created };
}

/**
 * usePageMetadata — sets <title>, description, og:* and twitter:* for the page
 * and restores the previous values on unmount. Base44 prerenders pages for
 * link-preview crawlers by running this code, so these tags are what
 * WhatsApp / iMessage / Telegram / Slack show.
 *
 * @param {string}  opts.title       page title (og/twitter title)
 * @param {string}  [opts.description]
 * @param {string}  [opts.image]     absolute URL; defaults to the 1200×630 brand image
 * @param {number}  [opts.imageWidth]  only for a custom image of known size
 * @param {number}  [opts.imageHeight]
 * @param {string}  [opts.imageAlt]
 * @param {string}  [opts.type]      og:type; defaults to "website"
 * @param {boolean} [opts.rawTitle]  use `title` as-is for the tab (no brand suffix)
 */
export function usePageMetadata({
  title, description, image, imageWidth, imageHeight, imageAlt,
  type = "website", rawTitle = false,
} = {}) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const prevTitle = document.title;
    const isAr = getStoredLang() === "ar";
    if (title) document.title = rawTitle ? title : `${title} | ${isAr ? SITE_NAME_AR : SITE_NAME}`;

    const url = window.location.origin + window.location.pathname;
    const usingDefault = !image;
    const finalImage = image || DEFAULT_SHARE_IMAGE;
    const w = usingDefault ? 1200 : imageWidth;
    const h = usingDefault ? 630 : imageHeight;
    const ogTitle = title || (isAr ? SITE_NAME_AR : SITE_NAME);
    const desc = description ? cleanMetaText(description) : undefined;
    const alt = imageAlt || ogTitle;

    const undo = [
      upsertMeta("og:title", "property", ogTitle),
      upsertMeta("twitter:title", "name", ogTitle),
      upsertMeta("og:description", "property", desc),
      upsertMeta("twitter:description", "name", desc),
      upsertMeta("description", "name", desc),
      upsertMeta("og:image", "property", finalImage),
      upsertMeta("og:image:width", "property", w),
      upsertMeta("og:image:height", "property", h),
      upsertMeta("og:image:alt", "property", alt),
      upsertMeta("twitter:image", "name", finalImage),
      upsertMeta("twitter:image:alt", "name", alt),
      upsertMeta("og:url", "property", url),
      upsertMeta("og:type", "property", type),
      upsertMeta("og:locale", "property", isAr ? "ar_SA" : "en_US"),
      upsertMeta("og:locale:alternate", "property", isAr ? "en_US" : "ar_SA"),
      upsertMeta("og:site_name", "property", isAr ? SITE_NAME_AR : SITE_NAME),
    ].filter(Boolean);

    return () => {
      document.title = prevTitle;
      undo.forEach(({ el, prev, created }) => {
        if (created) el.parentNode?.removeChild(el);
        else if (prev != null) el.setAttribute("content", prev);
      });
    };
  }, [title, description, image, imageWidth, imageHeight, imageAlt, type, rawTitle]);
}

export default usePageMetadata;