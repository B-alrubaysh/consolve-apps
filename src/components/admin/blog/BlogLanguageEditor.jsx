import { useCallback, useMemo, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";

const QUILL_FORMATS = [
  "header",
  "bold", "italic", "underline", "strike",
  "color", "background",
  "link", "image", "video",
  "blockquote", "code-block",
  "list", "bullet",
  "align",
];

// Upload a File and return its public URL
async function uploadAndGetUrl(file) {
  const res = await base44.integrations.Core.UploadFile({ file });
  return res?.file_url || "";
}

// Replace any base64 <img src="data:..."> in the editor with uploaded URLs
async function replaceBase64Images(quill) {
  if (!quill) return;
  const root = quill.root;
  const imgs = Array.from(root.querySelectorAll('img[src^="data:"]'));
  for (const img of imgs) {
    try {
      const dataUrl = img.getAttribute("src");
      const blob = await (await fetch(dataUrl)).blob();
      const ext = (blob.type.split("/")[1] || "png").split("+")[0];
      const file = new File([blob], `pasted-image.${ext}`, { type: blob.type || "image/png" });
      const url = await uploadAndGetUrl(file);
      if (url) img.setAttribute("src", url);
      else img.remove();
    } catch {
      img.remove();
    }
  }
}

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
  const quillRef = useRef(null);

  // Toolbar image button — open file picker, upload, insert URL at cursor
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const editor = quillRef.current?.getEditor?.();
      if (!editor) return;
      const range = editor.getSelection(true) || { index: editor.getLength(), length: 0 };
      // Insert a placeholder so the user sees progress
      editor.insertText(range.index, "Uploading image…", "italic", true);
      const url = await uploadAndGetUrl(file).catch(() => "");
      editor.deleteText(range.index, "Uploading image…".length);
      if (url) {
        editor.insertEmbed(range.index, "image", url, "user");
        editor.setSelection(range.index + 1, 0);
      }
    };
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [
          { color: ["#000000", "#374151", "#6b7280", "#dc2626", "#f97316", "#16a34a", "#0ea5e9", "#7c3aed", "#db2777", "#ffffff"] },
          { background: ["#fef3c7", "#fee2e2", "#dcfce7", "#dbeafe", "#fce7f3", "transparent"] },
        ],
        ["link", "image", "video"],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["clean"],
      ],
      handlers: { image: imageHandler },
    },
  }), [imageHandler]);

  // Catch pasted/dropped base64 images and swap them for uploaded URLs
  const handleChange = useCallback((value) => {
    onContentChange(value);
    if (value && value.includes('src="data:')) {
      const editor = quillRef.current?.getEditor?.();
      if (editor) {
        replaceBase64Images(editor).then(() => {
          const html = editor.root.innerHTML;
          if (html !== value) onContentChange(html);
        });
      }
    }
  }, [onContentChange]);

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
            ref={quillRef}
            theme="snow"
            value={content || ""}
            onChange={handleChange}
            modules={modules}
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

        /* Force editor text to black on its white background — beats the parent bg-secondary text-white inheritance */
        .blog-quill-wrapper .ql-editor {
          color: #111827;
        }
        .blog-quill-wrapper .ql-editor p,
        .blog-quill-wrapper .ql-editor h1,
        .blog-quill-wrapper .ql-editor h2,
        .blog-quill-wrapper .ql-editor h3,
        .blog-quill-wrapper .ql-editor li,
        .blog-quill-wrapper .ql-editor blockquote {
          color: inherit;
        }
        /* Placeholder is gray, not white */
        .blog-quill-wrapper .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        /* Link tooltip — never clip on the left edge */
        .blog-quill-wrapper {
          position: relative;
        }
        .blog-quill-wrapper .ql-tooltip {
          left: 12px !important;
          max-width: calc(100% - 24px);
          white-space: normal;
          z-index: 50;
        }
        .blog-quill-wrapper .ql-tooltip input[type="text"] {
          min-width: 200px;
        }
        /* Toolbar dropdown labels stay readable on the white background */
        .blog-quill-wrapper .ql-toolbar .ql-picker-label,
        .blog-quill-wrapper .ql-toolbar .ql-picker-item,
        .blog-quill-wrapper .ql-toolbar button {
          color: #374151;
        }
        .blog-quill-wrapper .ql-toolbar .ql-stroke { stroke: #374151; }
        .blog-quill-wrapper .ql-toolbar .ql-fill { fill: #374151; }
      `}</style>
    </div>
  );
}