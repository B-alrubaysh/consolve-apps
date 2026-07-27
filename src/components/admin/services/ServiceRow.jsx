import { base44 } from "@/api/base44Admin";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";

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

      <div className="hidden md:block">
        <span
          className={`px-2 py-1 rounded-full text-xs border ${
            service.is_active
              ? "bg-green-500/10 text-green-400 border-green-500/30"
              : "bg-white/5 text-white/40 border-white/10"
          }`}
        >
          {service.is_active ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          className={service.is_active ? "text-yellow-400 hover:text-yellow-300" : "text-green-400 hover:text-green-300"}
          onClick={() => handleToggle(!service.is_active)}
          title={service.is_active ? "Deactivate" : "Activate"}
        >
          {service.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
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