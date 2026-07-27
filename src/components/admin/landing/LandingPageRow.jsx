import { useState } from "react";
import { base44 } from "@/api/base44Admin";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye, EyeOff, Link2, Copy } from "lucide-react";

export default function LandingPageRow({ page, onTogglePublished, onEdit, onDuplicate, onDelete }) {
  const [copied, setCopied] = useState(false);

  const handleToggle = async () => {
    const next = !page.is_published;
    onTogglePublished(page, next);
    await base44.entities.LandingPage.update(page.id, { is_published: next });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`https://consolve.sa/p/${page.slug}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard denied */
    }
  };

  const updated = page.updated_date ? new Date(page.updated_date).toLocaleDateString() : "—";

  return (
    <div className="flex items-center gap-4 px-4 py-3 border-t border-white/5">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{page.name || "—"}</p>
        <p className="text-xs text-white/50 truncate">/p/{page.slug}</p>
      </div>

      <div className="hidden md:block w-28 text-xs text-white/50 text-right">
        {updated}
      </div>

      <div className="w-24 flex justify-end">
        <span
          className={`px-2 py-1 rounded-full text-xs border ${
            page.is_published
              ? "bg-green-500/10 text-green-400 border-green-500/30"
              : "bg-white/5 text-white/40 border-white/10"
          }`}
        >
          {page.is_published ? "Published" : "Draft"}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          className={page.is_published ? "text-yellow-400 hover:text-yellow-300" : "text-green-400 hover:text-green-300"}
          onClick={handleToggle}
          title={page.is_published ? "Unpublish" : "Publish"}
        >
          {page.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
        <Button size="sm" variant="ghost" className="text-white/60 hover:text-white" onClick={() => onEdit(page)} title="Edit">
          <Pencil className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" className="text-white/60 hover:text-white" onClick={handleCopy} title="Copy public link">
          <Link2 className="w-4 h-4" />
          {copied && <span className="ml-1 text-xs text-green-400">Copied!</span>}
        </Button>
        <Button size="sm" variant="ghost" className="text-white/60 hover:text-white" onClick={() => onDuplicate(page)} title="Duplicate">
          <Copy className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300" onClick={() => onDelete(page)} title="Delete">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}