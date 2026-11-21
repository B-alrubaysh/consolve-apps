import { cleanMetaText } from "./usePageMetadata";
import { heroImageFor } from "./blogUtils";

// Old URLs that must keep working → their current slug.
export const BLOG_SLUG_REDIRECTS = {
  "Centralized and Decentralized Management": "centralized-and-decentralized-management",
};

const stripHtml = (html) => String(html || "").replace(/<[^>]*>/g, " ");

// Remove a leading copy of the title so the description never repeats it.
function withoutTitle(text, title) {
  const t = cleanMetaText(text, 10000);
  const head = cleanMetaText(title, 10000).replace(/[؟?!.:]+$/, "");
  if (head && t.startsWith(head)) return t.slice(head.length).replace(/^[\s؟?!.:\-—|،,]+/, "");
  return t;
}

// Link-preview metadata for one blog post in the given language.
export function blogPostMeta(post, isAr) {
  if (!post) return {};
  const pick = (ar, en) => (isAr ? ar || en : en || ar);
  const title = cleanMetaText(pick(post.title_ar, post.title_en) || pick(post.seo_title_ar, post.seo_title_en), 90);
  const candidates = [
    pick(post.excerpt_ar, post.excerpt_en),
    pick(post.seo_description_ar, post.seo_description_en),
    stripHtml(pick(post.content_ar, post.content_en)),
  ];
  const description = candidates.map((c) => withoutTitle(c, title)).find(Boolean) || "";
  // og_image_url is stored as a 1200×630 crop; the hero is the fallback.
  const image = post.og_image_url || heroImageFor(post, isAr) || undefined;
  return {
    title,
    description: cleanMetaText(description, 150),
    image,
    imageWidth: post.og_image_url ? 1200 : undefined,
    imageHeight: post.og_image_url ? 630 : undefined,
    imageAlt: title,
    type: "article",
  };
}