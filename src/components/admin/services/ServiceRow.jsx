import { base44 } from "@/api/base44Admin";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2 } from "lucide-react";

export default function ServiceRow({ service, onEdit, onToggleActive, onDelete }) {
  const subEnCount = Array.isArray(service.sub_services_en) ? service.sub_services_en.length : 0;
  const subArCount = Array.isArray(service.sub_services_ar) ? service.sub_services_ar.length : 0;

  const handleToggle = async (value) => {
    // Optimistic: parent updates local state, then we persist.
    onToggleActive(service, value);
    await base44.entities.Service.update(service.id, { is_active: value });
  };

  return (
    <div className="flex items-center gap-4 px-4 py-3 border-t border-white/5">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{service.name_en || "—"}</p>
        {service.name_ar && (
          <p className="text-xs text-white/50 truncate" dir="rtl">{service.name_ar}</p>
        )}
      </div>

      <div className="hidden md:block flex-1 min-w-0 max-w-sm">
        <p className="text-xs text-white/60 truncate">{service.tagline_en || "—"}</p>
      </div>

      <div className="hidden lg:block w-28 text-xs text-white/50 truncate">
        {service.icon || "—"}
      </div>

      <div className="hidden md:block w-24 text-xs text-white/50 text-right">
        {subEnCount} EN / {subArCount} AR
      </div>

      <div className="hidden lg:block w-12 text-xs text-white/50 text-right">
        {service.display_order ?? 0}
      </div>

      <div className="flex items-center gap-2">
        <Switch checked={!!service.is_active} onCheckedChange={handleToggle} />
      </div>

      <div className="flex items-center gap-1">
        <Button size="sm" variant="ghost" className="text-white/60 hover:text-white" onClick={() => onEdit(service)}>
          <Pencil className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300" onClick={() => onDelete(service)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}