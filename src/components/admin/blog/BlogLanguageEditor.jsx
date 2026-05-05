import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [
      { color: ["#000000", "#374151", "#6b7280", "#dc2626", "#f97316", "#16a34a", "#0ea5e9", "#7c3aed", "#db2777", "#ffffff"] },
      { background: ["#fef3c7", "#fee2e2", "#dcfce7", "#dbeafe", "#fce7f3", "transparent"] },
    ],
    ["link", "image", "video"],
    ["blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ],
};

const QUILL_FORMATS = [
  "header",
  "bold", "italic", "underline",
  "color", "background",
  "link", "image", "video",
  "blockquote",
  "list", "bullet",
];

export default function BlogLanguageEditor({
  lang,
  title,
  slug,
  excerpt,
  content,
  onTitleChange,
  onSlugChange,
  onExcerptChange,
  onContentChange,
  errors,
  showSlug,
}) {
  const isAr = lang === "ar";
  const dir = isAr ? "rtl" : "ltr";

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-white/60 mb-1.5">Title</label>
        <Input
          dir={dir}
          value={title || ""}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder={isAr ? "عنوان المقال" : "Article title"}
          className={`bg-white/5 border-white/10 text-white text-2xl h-14 ${isAr ? "text-right" : ""}`}
        />
      </div>

      {showSlug && (
        <div>
          <label className="block text-xs text-white/60 mb-1.5">Slug</label>
          <Input
            value={slug || ""}
            onChange={(e) => onSlugChange(e.target.value)}
            placeholder="my-article-slug"
            className="bg-white/5 border-white/10 text-white"
          />
          {errors?.slug && <p className="text-xs text-destructive mt-1">{errors.slug}</p>}
        </div>
      )}

      <div>
        <label className="block text-xs text-white/60 mb-1.5">Excerpt</label>
        <Textarea
          dir={dir}
          rows={3}
          value={excerpt || ""}
          onChange={(e) => onExcerptChange(e.target.value)}
          placeholder={isAr ? "مقدمة قصيرة..." : "Short summary…"}
          className={`bg-white/5 border-white/10 text-white ${isAr ? "text-right" : ""}`}
        />
      </div>

      <div>
        <label className="block text-xs text-white/60 mb-1.5">Content</label>
        <div dir={dir} className={`blog-quill-wrapper bg-white rounded-lg overflow-hidden ${isAr ? "rtl" : ""}`}>
          <ReactQuill
            theme="snow"
            value={content || ""}
            onChange={onContentChange}
            modules={QUILL_MODULES}
            formats={QUILL_FORMATS}
          />
        </div>
        {errors?.content && <p className="text-xs text-destructive mt-1">{errors.content}</p>}
      </div>

      <style>{`
        .blog-quill-wrapper .ql-toolbar { border: none; border-bottom: 1px solid #e5e7eb; }
        .blog-quill-wrapper .ql-container { border: none; min-height: 320px; font-size: 15px; }
        .blog-quill-wrapper .ql-editor { min-height: 320px; }
        .blog-quill-wrapper.rtl .ql-editor { direction: rtl; text-align: right; }
      `}</style>
    </div>
  );
}