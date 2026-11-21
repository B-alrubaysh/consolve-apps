import { useEffect, useRef, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { usePageMetadata } from "../lib/usePageMetadata";
import { blogPostMeta, BLOG_SLUG_REDIRECTS } from "../lib/blogMeta";
import { Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "../lib/useLanguage";
import PageNotFound from "../lib/PageNotFound";
import BlogCard from "../components/blog/BlogCard";
import EmailGateModal from "../components/blog/EmailGateModal";
import { heroImageFor } from "../lib/blogUtils";
import { formatArticleDate } from "../lib/formatDate";
import { sanitizeHtml } from "@/lib/sanitizeHtml";

function setCanonical(href) {
  if (!href) return null;
  let el = document.querySelector('link[rel="canonical"]');
  let created = false;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
    created = true;
  }
  const prev = el.getAttribute("href");
  el.setAttribute("href", href);
  return { el, prev, created };
}

export default function BlogDetail() {
  const { slug } = useParams();
  const { lang, dir, isAr } = useLanguage();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [authorName, setAuthorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [showGate, setShowGate] = useState(false);
  const [gateDismissed, setGateDismissed] = useState(false);
  const articleRef = useRef(null);

  const isPreview = new URLSearchParams(window.location.search).get("preview") === "true";

  // Load post
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const matches = await base44.entities.BlogPost.filter({ slug });
      const found = (matches || [])[0] || null;
      if (cancelled) return;
      setPost(found);
      setLoading(false);
      if (found) console.log("post.email_gate_enabled:", found.email_gate_enabled);

      if (found?.author_id) {
        try {
          const users = await base44.entities.User.filter({ id: found.author_id });
          if (!cancelled && users?.[0]?.full_name) setAuthorName(users[0].full_name);
        } catch {}
      }

      if (found?.status === "published" && found?.category) {
        const all = await base44.entities.BlogPost.list("-publish_date", 50);
        if (cancelled) return;
        setRelated(
          (all || [])
            .filter((p) => p.status === "published" && p.id !== found.id && p.category === found.category)
            .slice(0, 3)
        );
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  // Link-preview / SEO meta (title, description, og:*, twitter:*)
  usePageMetadata(blogPostMeta(post, isAr));

  // Canonical URL (optional, per post)
  useEffect(() => {
    const c = setCanonical(post?.canonical_url || "");
    if (!c) return;
    return () => {
      if (c.created) c.el.parentNode?.removeChild(c.el);
      else if (c.prev != null) c.el.setAttribute("href", c.prev);
    };
  }, [post]);

  // Email gate scroll listener
  useEffect(() => {
    if (!post || !post.email_gate_enabled || gateDismissed) return;
    try {
      if (localStorage.getItem(`blog_gate_${post.id}`) === "submitted") return;
    } catch {}

    const threshold = post.email_gate_threshold ?? 35;

    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        console.log("scroll pct: doc too short — firing gate");
        setShowGate(true);
        return;
      }
      const pct = (scrollTop / docHeight) * 100;
      console.log("scroll pct:", pct);
      if (pct >= threshold) setShowGate(true);
    };

    console.log("Email gate active, threshold:", threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [post, gateDismissed]);

  const redirectTo = BLOG_SLUG_REDIRECTS[slug];
  if (redirectTo) return <Navigate to={`/blog/${redirectTo}${window.location.search}`} replace />;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) return <PageNotFound />;
  if (post.status !== "published" && !isPreview) return <PageNotFound />;

  const title = (isAr ? post.title_ar : post.title_en) || post.title_en || post.title_ar || "";
  const heroImage = heroImageFor(post, isAr);
  const content = (isAr ? post.content_ar : post.content_en) || post.content_en || post.content_ar || "";
  const displayAuthor = authorName || (isAr ? "فريق كونسولف" : "Consolve Team");

  const skippable = post.email_gate_skippable !== false;

  return (
    <div dir={dir} className="min-h-screen bg-background">
      <article ref={articleRef} className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        {heroImage && (
          <img
            src={heroImage}
            alt={title}
            className="w-full aspect-video object-cover rounded-2xl mb-10"
          />
        )}

        {post.category && (
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            {post.category}
          </p>
        )}
        <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          {displayAuthor}
          {post.publish_date && <> · {formatArticleDate(post.publish_date, isAr)}</>}
        </p>

        <hr className="border-border mb-8" />

        <div
          className="blog-content prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
        />
      </article>

      {related.length > 0 && (
        <section className="border-t border-border bg-card py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              {isAr ? "مقالات ذات صلة" : "Related Articles"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((p) => (
                <BlogCard key={p.id} post={p} isAr={isAr} />
              ))}
            </div>
          </div>
        </section>
      )}

      {showGate && (
        <EmailGateModal
          post={post}
          isAr={isAr}
          lang={lang}
          onSubmitted={() => { setShowGate(false); setGateDismissed(true); }}
          onSkip={skippable ? () => { setShowGate(false); setGateDismissed(true); } : null}
        />
      )}

      <style>{`
        .blog-content { color: hsl(var(--foreground)); }
        .blog-content h1, .blog-content h2 { font-weight: 700; margin-top: 1.5em; margin-bottom: 0.5em; line-height: 1.25; }
        .blog-content h1 { font-size: 1.875rem; }
        .blog-content h2 { font-size: 1.5rem; }
        .blog-content h3 { font-size: 1.25rem; font-weight: 600; margin-top: 1.25em; margin-bottom: 0.4em; }
        .blog-content p { margin: 0.9em 0; line-height: 1.75; }
        .blog-content a { color: hsl(var(--primary)); text-decoration: underline; }
        .blog-content ul, .blog-content ol { margin: 0.9em 0; padding-${isAr ? "right" : "left"}: 1.5rem; }
        .blog-content ul { list-style: disc; }
        .blog-content ol { list-style: decimal; }
        .blog-content li { margin: 0.4em 0; line-height: 1.7; }
        .blog-content blockquote { border-${isAr ? "right" : "left"}: 3px solid hsl(var(--primary)); padding-${isAr ? "right" : "left"}: 1rem; color: hsl(var(--muted-foreground)); margin: 1.2em 0; font-style: italic; }
        .blog-content img { border-radius: 0.75rem; margin: 1.2em 0; }
        .blog-content code { background: hsl(var(--muted)); padding: 0.1em 0.3em; border-radius: 0.25rem; font-size: 0.9em; }
        .blog-content pre, .blog-content .ql-syntax {
          background: hsl(var(--muted));
          padding: 1rem 1.25rem;
          border-radius: 0.5rem;
          margin: 1.2em 0;
          overflow-x: auto;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 0.9em;
          line-height: 1.6;
          color: hsl(var(--foreground));
        }
        .blog-content pre code, .blog-content .ql-syntax {
          background: transparent;
          padding: 0;
        }
        .blog-content s, .blog-content strike { text-decoration: line-through; }
        .blog-content .ql-align-center { text-align: center; }
        .blog-content .ql-align-right { text-align: right; }
        .blog-content .ql-align-justify { text-align: justify; }
      `}</style>
    </div>
  );
}