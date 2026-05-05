import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "../lib/useLanguage";
import BlogCard from "./blog/BlogCard";

export default function RecentBlogs() {
  const { isAr } = useLanguage();
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const list = await base44.entities.BlogPost.list("-publish_date", 4);
      if (cancelled) return;
      const published = (list || []).filter((p) => p.status === "published").slice(0, 4);
      setPosts(published);
    })();
    return () => { cancelled = true; };
  }, []);

  if (posts === null) return null;
  if (posts.length === 0) return null;

  return (
    <section className="py-24 md:py-36 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">
          {isAr ? "المرئيات" : "Insights"}
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-4 leading-tight">
          {isAr ? "أحدث المقالات" : "Recently Published"}
        </h2>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          {isAr
            ? "اطلع على أحدث أفكارنا حول الاستراتيجية، العمليات، الحوكمة، والنمو."
            : "Explore our latest thinking on strategy, operations, governance, and growth."}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-w-7xl mx-auto px-6 mt-12">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} isAr={isAr} />
        ))}
      </div>

      <div className="text-center">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 mt-12 mx-auto text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
        >
          {isAr ? "اطلع على جميع المقالات" : "View all articles"}
          <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
        </Link>
      </div>
    </section>
  );
}