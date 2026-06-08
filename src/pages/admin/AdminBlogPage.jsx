import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Admin";
import { Loader2, Plus, BookOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminUser } from "../../components/admin/ProtectedAdminLayout";
import { requireRole, ROLES } from "../../lib/rbac";
import AccessDenied from "../../components/admin/AccessDenied";
import BlogPostRow from "../../components/admin/blog/BlogPostRow";

const STATUS_OPTIONS = ["draft", "scheduled", "published", "archived"];

export default function AdminBlogPage() {
  const me = useAdminUser();
  const allowed = requireRole(me, ROLES.OWNER, ROLES.ADMIN, ROLES.WRITER);
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [langFilter, setLangFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const load = async () => {
    setLoading(true);
    const [p, u] = await Promise.all([
      base44.entities.BlogPost.list("-created_date", 500),
      base44.entities.User.list("-created_date", 500).catch(() => []),
    ]);
    setPosts(p || []);
    setUsers(u || []);
    setLoading(false);
  };

  useEffect(() => {
    if (allowed) load();
  }, [allowed]);

  const userMap = useMemo(() => {
    const m = new Map();
    users.forEach((u) => m.set(u.id, u));
    return m;
  }, [users]);

  const authorOptions = useMemo(() => {
    const ids = new Set(posts.map((p) => p.author_id).filter(Boolean));
    return Array.from(ids).map((id) => {
      const u = userMap.get(id);
      return { id, name: u?.full_name || u?.email || id };
    });
  }, [posts, userMap]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const cq = categoryFilter.trim().toLowerCase();
    const startTs = startDate ? new Date(startDate).getTime() : null;
    const endTs = endDate ? new Date(endDate).getTime() + 24 * 60 * 60 * 1000 - 1 : null;

    return posts.filter((p) => {
      if (q) {
        const hay = `${p.title_en || ""} ${p.title_ar || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (cq && !(p.category || "").toLowerCase().includes(cq)) return false;
      if (authorFilter !== "all" && p.author_id !== authorFilter) return false;
      if (langFilter !== "all") {
        const hasEn = !!(p.title_en && p.content_en);
        const hasAr = !!(p.title_ar && p.content_ar);
        if (langFilter === "en" && !hasEn) return false;
        if (langFilter === "ar" && !hasAr) return false;
        if (langFilter === "both" && !(hasEn && hasAr)) return false;
      }
      if (startTs || endTs) {
        const ts = p.created_date ? new Date(p.created_date).getTime() : 0;
        if (startTs && ts < startTs) return false;
        if (endTs && ts > endTs) return false;
      }
      return true;
    });
  }, [posts, search, statusFilter, categoryFilter, authorFilter, langFilter, startDate, endDate]);

  if (!allowed) return <AccessDenied />;

  const onEdit = (post) => navigate(`/admin/blog/${post.id}/edit`);
  const onPreview = (post) => window.open(`/blog/${post.slug}?preview=true`, "_blank");

  const onPublish = async (post) => {
    const patch = { status: "published" };
    if (!post.publish_date) patch.publish_date = new Date().toISOString();
    await base44.entities.BlogPost.update(post.id, patch);
    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, ...patch } : p)));
  };

  const onArchive = async (post) => {
    await base44.entities.BlogPost.update(post.id, { status: "archived" });
    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, status: "archived" } : p)));
  };

  const onDelete = async (post) => {
    if (!confirm(`Delete post "${post.title_en || post.title_ar || post.slug}"? This cannot be undone.`)) return;
    await base44.entities.BlogPost.delete(post.id);
    setPosts((prev) => prev.filter((p) => p.id !== post.id));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog</h1>
          <p className="text-sm text-white/40 mt-1">Create and manage articles</p>
        </div>
        <Button onClick={() => navigate("/admin/blog/new")} className="gap-2">
          <Plus className="w-4 h-4" /> New Post
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 mb-4">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title…"
            className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          placeholder="Category…"
          className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30"
        />
        <Select value={authorFilter} onValueChange={setAuthorFilter}>
          <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white"><SelectValue placeholder="Author" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Authors</SelectItem>
            {authorOptions.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={langFilter} onValueChange={setLangFilter}>
          <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white"><SelectValue placeholder="Language" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Language</SelectItem>
            <SelectItem value="en">Has EN</SelectItem>
            <SelectItem value="ar">Has AR</SelectItem>
            <SelectItem value="both">Has Both</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-11 bg-white/5 border-white/10 text-white md:col-span-1" />
        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-11 bg-white/5 border-white/10 text-white md:col-span-1" />
      </div>

      {/* Body */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
          <p className="text-sm text-white/40 mt-3">Loading posts…</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="py-20 text-center bg-white/5 border border-white/10 rounded-xl">
          <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40 mb-6">No posts yet — write your first article</p>
          <Button onClick={() => navigate("/admin/blog/new")} className="gap-2">
            <Plus className="w-4 h-4" /> New Post
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-white/5 border border-white/10 rounded-xl">
          <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">No posts match your filters</p>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="hidden md:grid grid-cols-12 items-center gap-4 px-4 py-3 text-xs uppercase tracking-widest text-white/40 bg-white/5">
            <span className="col-span-5 lg:col-span-4 xl:col-span-2">Title</span>
            <span className="col-span-2 lg:col-span-1">Lang</span>
            <span className="hidden lg:block lg:col-span-1">Category</span>
            <span className="hidden lg:block lg:col-span-2">Author</span>
            <span className="col-span-2 lg:col-span-1 lg:-ml-6">Status</span>
            <span className="hidden xl:block xl:col-span-1">Created</span>
            <span className="hidden xl:block xl:col-span-1">Published</span>
            <span className="hidden xl:block xl:col-span-1">Updated</span>
            <span className="col-span-3 lg:col-span-2 xl:col-span-2 text-right">Actions</span>
          </div>
          {filtered.map((post) => {
            const u = post.author_id ? userMap.get(post.author_id) : null;
            const authorName = u ? (u.full_name || u.email) : "";
            return (
              <BlogPostRow
                key={post.id}
                post={post}
                authorName={authorName}
                onEdit={onEdit}
                onPreview={onPreview}
                onPublish={onPublish}
                onArchive={onArchive}
                onDelete={onDelete}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}