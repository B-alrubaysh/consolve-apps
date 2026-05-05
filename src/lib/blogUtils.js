export function slugify(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function htmlIsEmpty(html) {
  if (!html) return true;
  // Quill emits <p><br></p> for empty content
  const stripped = html.replace(/<p>(\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, "").replace(/<[^>]*>/g, "").trim();
  return stripped.length === 0;
}