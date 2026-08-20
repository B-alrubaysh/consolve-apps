import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Public endpoint (no auth) — returns a small HTML document with correct
// per-post Open Graph / Twitter Card tags for a blog post, so social crawlers
// (WhatsApp, LinkedIn, X, Facebook) get a proper link preview. Real visitors
// are redirected client-side to the canonical article page.
//
// Usage: /functions/sharePost?slug=<post-slug>&lang=en|ar
//
// Lookup runs via asServiceRole because crawlers are anonymous.

const SITE_ORIGIN = 'https://consolve.sa';
const DEFAULT_TITLE = 'Consolve — Management Consulting';
const DEFAULT_DESCRIPTION = 'Consolve helps organizations grow through practical management consulting.';
const DEFAULT_IMAGE = 'https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/df2296388_Cover1.png';

function escapeHtml(value: unknown): string {
  const s = value == null ? '' : String(value);
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderHtml(opts: {
  lang: string;
  title: string;
  description: string;
  image: string;
  url: string;
  isRtl: boolean;
}): string {
  const title = escapeHtml(opts.title);
  const description = escapeHtml(opts.description);
  const image = escapeHtml(opts.image);
  const url = escapeHtml(opts.url);
  const lang = escapeHtml(opts.lang);
  const dirAttr = opts.isRtl ? ' dir="rtl"' : '';
  const continueLabel = opts.isRtl ? 'المتابعة إلى المقال' : 'Continue to the article';

  return `<!DOCTYPE html>
<html lang="${lang}"${dirAttr}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<meta property="og:type" content="article">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${image}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="ConSolve Management Solutions">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${image}">
<link rel="canonical" href="${url}">
<meta http-equiv="refresh" content="0; url=${url}">
</head>
<body>
<p><a href="${url}">${continueLabel}</a></p>
<script>window.location.replace(${JSON.stringify(opts.url)});</script>
</body>
</html>`;
}

function htmlResponse(body: string): Response {
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}

function fallbackResponse(): Response {
  return htmlResponse(
    renderHtml({
      lang: 'en',
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      image: DEFAULT_IMAGE,
      url: `${SITE_ORIGIN}/blog`,
      isRtl: false,
    })
  );
}

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug');
    const langParam = url.searchParams.get('lang');
    const lang = langParam === 'ar' ? 'ar' : 'en';

    if (!slug) return fallbackResponse();

    const base44 = createClientFromRequest(req);
    const matches = await base44.asServiceRole.entities.BlogPost.filter({ slug });
    const post = matches.find((p: any) => p.status === 'published');
    if (!post) return fallbackResponse();

    const title =
      lang === 'ar'
        ? post.seo_title_ar || post.title_ar || post.title_en
        : post.seo_title_en || post.title_en || post.title_ar;

    const description =
      lang === 'ar'
        ? post.seo_description_ar || post.excerpt_ar || post.excerpt_en
        : post.seo_description_en || post.excerpt_en || post.excerpt_ar;

    let image = post.og_image_url;
    if (!image) {
      if (lang === 'ar' && post.hero_image_same_for_both === false && post.hero_image_url_ar) {
        image = post.hero_image_url_ar;
      } else {
        image = post.hero_image_url;
      }
    }

    const canonical = `${SITE_ORIGIN}/blog/${post.slug}`;

    return htmlResponse(
      renderHtml({
        lang,
        title: title || DEFAULT_TITLE,
        description: description || DEFAULT_DESCRIPTION,
        image: image || DEFAULT_IMAGE,
        url: canonical,
        isRtl: lang === 'ar',
      })
    );
  } catch (error) {
    console.error('sharePost error:', error);
    return fallbackResponse();
  }
});