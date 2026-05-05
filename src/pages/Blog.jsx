import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "../lib/useLanguage";
import BlogCard from "../components/blog/BlogCard";

export default function BlogList() {
  const { dir, isAr } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const all = await base44.entities.BlogPost.list("-publish_date", 100);
      if (cancelled) return;
      setPosts((all || []).filter((p) => p.status === "published"));
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div dir={dir} className="min-h-screen bg-background">
      <section className="py-24 md:py-36 bg-secondary text-secondary-foreground">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">
              {isAr ? "المرئيات" : "Insights"}
            </p>
            <h1 className="text-4xl md:text-6xl font-black text-secondary-foreground leading-tight mb-5">
              {isAr ? "أحدث المقالات" : "Latest Articles"}
            </h1>
            <p className="text-secondary-foreground/60 text-lg max-w-xl leading-relaxed">
              {isAr
                ? "الاستراتيجية، العمليات، الحوكمة، والنمو — مباشرةً من فريقنا."
                : "Strategy, operations, governance, and growth — straight from our team."}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : posts.length === 0 ? (
            <div className="max-w-md mx-auto text-center bg-card border border-border rounded-2xl px-6 py-12">
              <p className="text-muted-foreground text-sm">
                {isAr
                  ? "لا توجد مقالات منشورة بعد. عد قريباً."
                  : "No articles published yet. Check back soon."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  <BlogCard post={post} isAr={isAr} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}