import { Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { GripVertical, Pencil, Eye, EyeOff, Trash2, ExternalLink } from "lucide-react";
import { format } from "date-fns";

const checkerBg = {
  backgroundImage:
    "linear-gradient(45deg, rgba(255,255,255,0.06) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.06) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.06) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.06) 75%)",
  backgroundSize: "12px 12px",
  backgroundPosition: "0 0, 0 6px, 6px -6px, -6px 0px",
};

export default function ClientRow({ client, index, onEdit, onToggleActive, onDelete }) {
  return (
    <Draggable draggableId={client.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`flex items-center gap-4 px-4 py-3 border-t border-white/5 ${
            snapshot.isDragging ? "bg-white/10" : "bg-transparent"
          }`}
        >
          <span {...provided.dragHandleProps} className="text-white/30 hover:text-white/60 cursor-grab">
            <GripVertical className="w-4 h-4" />
          </span>

          <div className="w-24 h-10 rounded border border-white/10 flex items-center justify-center overflow-hidden shrink-0" style={checkerBg}>
            {client.logo_url ? (
              <img src={client.logo_url} alt={client.name_en} className="h-10 w-auto max-w-24 object-contain" />
            ) : (
              <span className="text-[10px] text-white/30">No logo</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{client.name_en}</p>
            {client.name_ar && (
              <p className="text-xs text-white/50 truncate" dir="rtl">{client.name_ar}</p>
            )}
          </div>

          <div className="hidden md:block min-w-0 max-w-48">
            {client.website_url ? (
              <a
                href={client.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline truncate"
              >
                <ExternalLink className="w-3 h-3 shrink-0" />
                <span className="truncate">{client.website_url.replace(/^https?:\/\//, "")}</span>
              </a>
            ) : (
              <span className="text-xs text-white/30">—</span>
            )}
          </div>

          <div className="hidden lg:block text-xs text-white/50 w-12 text-right">
            {client.display_order ?? 0}
          </div>

          <div className="hidden md:block">
            <span
              className={`px-2 py-1 rounded-full text-xs border ${
                client.is_active
                  ? "bg-green-500/10 text-green-400 border-green-500/30"
                  : "bg-white/5 text-white/40 border-white/10"
              }`}
            >
              {client.is_active ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="hidden lg:block text-xs text-white/40 w-24 text-right">
            {client.updated_date ? format(new Date(client.updated_date), "MMM d, yyyy") : "—"}
          </div>

          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" className="text-white/60 hover:text-white" onClick={() => onEdit(client)}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className={client.is_active ? "text-yellow-400 hover:text-yellow-300" : "text-green-400 hover:text-green-300"}
              onClick={() => onToggleActive(client)}
            >
              {client.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300" onClick={() => onDelete(client)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </Draggable>
  );
}