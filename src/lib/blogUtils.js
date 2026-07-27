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

// Returns the hero image to use for the given language. Posts use one shared image by
// default; when "same for both" is switched off, Arabic uses its own image, falling back
// to the English one if the Arabic image is empty.
export function heroImageFor(post, isAr) {
  if (!post) return "";
  if (isAr && post.hero_image_same_for_both === false && post.hero_image_url_ar) {
    return post.hero_image_url_ar;
  }
  return post.hero_image_url || "";
}