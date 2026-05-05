import { format } from "date-fns";
import { Pencil, Eye, UploadCloud, Archive, Trash2 } from "lucide-react";

const STATUS_STYLES = {
  draft: "bg-white/10 text-white/60",
  scheduled: "bg-blue-500/15 text-blue-400",
  published: "bg-green-500/15 text-green-400",
  archived: "bg-white/5 text-white/40",
};

function fmt(d) {
  if (!d) return "—";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "—";
  return format(dt, "MMM d, yyyy");
}

function Chip({ on, label }) {
  return (
    <span
      className={`inline-block px-1.5 py-0.5 rounded-md text-[10px] font-semibold tracking-widest ${
        on ? "bg-green-500/15 text-green-400" : "bg-white/5 text-white/30"
      }`}
    >
      {label}
    </span>
  );
}

export default function BlogPostRow({ post, authorName, onEdit, onPreview, onPublish, onArchive, onDelete }) {
  const hasEn = !!(post.title_en && post.content_en);
  const hasAr = !!(post.title_ar && post.content_ar);

  return (
    <div className="grid grid-cols-12 items-center gap-4 px-4 py-3 border-t border-white/5 hover:bg-white/5 transition-colors text-sm">
      <div className="col-span-12 md:col-span-5 lg:col-span-4 xl:col-span-3 min-w-0">
        <p className="text-white font-medium truncate">{post.title_en || post.title_ar || "—"}</p>
        {post.title_ar && post.title_en && (
          <p className="text-white/50 text-xs truncate text-left" dir="ltr">{post.title_ar}</p>
        )}
      </div>
      <div className="col-span-3 md:col-span-2 lg:col-span-1 flex items-center gap-1 min-w-0">
        <Chip on={hasEn} label="EN" />
        <Chip on={hasAr} label="AR" />
      </div>
      <div className="hidden lg:block lg:col-span-1 text-white/60 text-xs truncate">{post.category || "—"}</div>
      <div className="hidden lg:block lg:col-span-2 text-white/60 text-xs truncate">{authorName || "—"}</div>
      <div className="col-span-3 md:col-span-2 lg:col-span-1 min-w-0">
        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-widest ${STATUS_STYLES[post.status] || STATUS_STYLES.draft}`}>
          {post.status || "draft"}
        </span>
      </div>
      <div className="hidden xl:block xl:col-span-1 text-white/40 text-xs truncate">{fmt(post.created_date)}</div>
      <div className="hidden xl:block xl:col-span-1 text-white/40 text-xs truncate">{fmt(post.publish_date)}</div>
      <div className="hidden xl:block xl:col-span-1 text-white/40 text-xs truncate">{fmt(post.updated_date)}</div>
      <div className="col-span-6 md:col-span-3 lg:col-span-2 xl:col-span-1 flex items-center justify-end gap-1">
        <button onClick={() => onEdit(post)} title="Edit"
          className="p-2 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors">
          <Pencil className="w-4 h-4" />
        </button>
        <button onClick={() => onPreview(post)} title="Preview"
          className="p-2 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors">
          <Eye className="w-4 h-4" />
        </button>
        <button onClick={() => onPublish(post)} title="Publish"
          className="p-2 rounded-lg text-white/60 hover:bg-green-500/20 hover:text-green-400 transition-colors">
          <UploadCloud className="w-4 h-4" />
        </button>
        <button onClick={() => onArchive(post)} title="Archive"
          className="p-2 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors">
          <Archive className="w-4 h-4" />
        </button>
        <button onClick={() => onDelete(post)} title="Delete"
          className="p-2 rounded-lg text-white/60 hover:bg-destructive/20 hover:text-destructive transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}