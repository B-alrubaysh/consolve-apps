// Allowlist HTML sanitizer for editor-authored rich text (blog posts, templates).
// Strips scripts, event handlers and javascript: URLs while keeping formatting.
const ALLOWED_TAGS = new Set([
  "p", "br", "h1", "h2", "h3", "h4", "h5", "h6", "strong", "b", "em", "i", "u", "s", "strike",
  "a", "ul", "ol", "li", "blockquote", "pre", "code", "img", "figure", "figcaption", "hr",
  "table", "thead", "tbody", "tfoot", "tr", "th", "td", "span", "div", "sub", "sup", "iframe",
]);
const ALLOWED_ATTRS = new Set([
  "href", "src", "alt", "title", "class", "target", "rel", "width", "height",
  "colspan", "rowspan", "dir", "style", "frameborder", "allowfullscreen",
]);
const SAFE_URL = /^(https?:|mailto:|tel:|#|\/(?!\/))/i;
const SAFE_IFRAME = /^https:\/\/(www\.youtube\.com|www\.youtube-nocookie\.com|player\.vimeo\.com)\//i;

function clean(node) {
  [...node.children].forEach((el) => {
    const tag = el.tagName.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) { el.remove(); return; }
    [...el.attributes].forEach(({ name, value }) => {
      const n = name.toLowerCase();
      const v = value.trim();
      if (!ALLOWED_ATTRS.has(n)) el.removeAttribute(name);
      else if (n === "href" && !SAFE_URL.test(v)) el.removeAttribute(name);
      else if (n === "src" && !SAFE_URL.test(v) && !(tag === "img" && /^data:image\/(png|jpe?g|gif|webp);/i.test(v))) el.removeAttribute(name);
      else if (n === "style" && /expression|url\s*\(|javascript:/i.test(v)) el.removeAttribute(name);
    });
    if (tag === "iframe" && !SAFE_IFRAME.test(el.getAttribute("src") || "")) { el.remove(); return; }
    if (tag === "a" && el.getAttribute("target") === "_blank") el.setAttribute("rel", "noopener noreferrer");
    clean(el);
  });
}

export function sanitizeHtml(html) {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");
  clean(doc.body);
  return doc.body.innerHTML;
}