import { Link } from "react-router-dom";
import { format } from "date-fns";

function fmt(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "";
  return format(dt, "MMM d, yyyy");
}

export default function BlogCard({ post, isAr }) {
  const title = isAr ? (post.title_ar || post.title_en) : (post.title_en || post.title_ar);
  const excerpt = isAr ? (post.excerpt_ar || post.excerpt_en) : (post.excerpt_en || post.excerpt_ar);

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-md transition-all duration-200"
    >
      {post.hero_image_url ? (
        <img src={post.hero_image_url} alt={title || ""} className="aspect-video w-full object-cover" />
      ) : (
        <div className="aspect-video w-full bg-gradient-to-br from-primary/20 via-secondary/30 to-accent/20" />
      )}
      <div className="p-5 flex flex-col flex-1">
        {post.category && (
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
            {post.category}
          </p>
        )}
        <h3 className="font-bold text-foreground text-lg leading-snug mb-2 group-hover:text-primary transition-colors">
          {title || "Untitled"}
        </h3>
        {post.publish_date && (
          <p className="text-xs text-muted-foreground mb-3">{fmt(post.publish_date)}</p>
        )}
        {excerpt && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
            {excerpt}
          </p>
        )}
        <span className="text-xs font-semibold text-primary mt-auto">
          {isAr ? "اقرأ المزيد ←" : "Read more →"}
        </span>
      </div>
    </Link>
  );
}