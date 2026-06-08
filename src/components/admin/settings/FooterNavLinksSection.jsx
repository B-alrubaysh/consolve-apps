import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { base44 } from "@/api/base44Admin";
import { Plus, GripVertical, Pencil, Trash2, Loader2, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import FooterNavLinkDialog from "./FooterNavLinkDialog";

export default function FooterNavLinksSection() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const list = await base44.entities.FooterNavLink.list("display_order", 200).catch(() => []);
    setLinks(list || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    if (editing?.id) {
      await base44.entities.FooterNavLink.update(editing.id, form);
    } else {
      const maxOrder = links.reduce((m, l) => Math.max(m, l.display_order || 0), 0);
      await base44.entities.FooterNavLink.create({ ...form, display_order: maxOrder + 10 });
    }
    setDialogOpen(false);
    setEditing(null);
    await load();
  };

  const handleDelete = async (link) => {
    if (!confirm(`Delete link "${link.label_en || link.url}"?`)) return;
    await base44.entities.FooterNavLink.delete(link.id);
    await load();
  };

  const handleToggleActive = async (link) => {
    await base44.entities.FooterNavLink.update(link.id, { ...link, is_active: !link.is_active });
    await load();
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const reordered = Array.from(links);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setLinks(reordered);
    for (let i = 0; i < reordered.length; i++) {
      const l = reordered[i];
      const newOrder = (i + 1) * 10;
      if (l.display_order !== newOrder) {
        await base44.entities.FooterNavLink.update(l.id, { ...l, display_order: newOrder });
      }
    }
    await load();
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Navigation Links</p>
          <p className="text-xs text-white/40 mt-1">Drag to reorder. Active links appear in the public footer.</p>
        </div>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Add Link
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-white/40" />
        </div>
      ) : links.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-white/10 rounded-lg">
          <LinkIcon className="w-8 h-8 text-white/30 mx-auto mb-3" />
          <p className="text-sm text-white/50 mb-4">No footer links yet — add the first one</p>
          <Button onClick={() => { setEditing(null); setDialogOpen(true); }} className="gap-2">
            <Plus className="w-4 h-4" /> Add Link
          </Button>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="footer-links">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                {links.map((link, index) => (
                  <Draggable key={link.id} draggableId={link.id} index={index}>
                    {(p) => (
                      <div
                        ref={p.innerRef}
                        {...p.draggableProps}
                        className="grid grid-cols-12 items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10"
                      >
                        <div {...p.dragHandleProps} className="col-span-1 flex items-center text-white/30 hover:text-white/60 cursor-grab">
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <div className="col-span-3 min-w-0">
                          <p className="text-sm text-white truncate">{link.label_en || "—"}</p>
                          {link.label_ar && <p className="text-xs text-white/50 truncate" dir="rtl">{link.label_ar}</p>}
                        </div>
                        <div className="col-span-4 text-xs text-white/60 truncate">{link.url}</div>
                        <div className="col-span-1 text-[10px] text-white/40 uppercase tracking-widest">
                          {link.is_external ? "External" : "Internal"}
                        </div>
                        <div className="col-span-1">
                          <Switch checked={!!link.is_active} onCheckedChange={() => handleToggleActive(link)} />
                        </div>
                        <div className="col-span-2 flex items-center justify-end gap-1">
                          <button onClick={() => { setEditing(link); setDialogOpen(true); }}
                            className="p-1.5 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(link)}
                            className="p-1.5 rounded-lg text-white/60 hover:bg-destructive/20 hover:text-destructive transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <FooterNavLinkDialog
        open={dialogOpen}
        onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditing(null); }}
        initial={editing}
        onSave={handleSave}
      />
    </div>
  );
}