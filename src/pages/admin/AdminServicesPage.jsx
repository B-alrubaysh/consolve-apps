import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Admin";
import { Loader2, Plus, Layers, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminUser } from "../../components/admin/ProtectedAdminLayout";
import { requireRole, ROLES } from "../../lib/rbac";
import AccessDenied from "../../components/admin/AccessDenied";
import ServiceRow from "../../components/admin/services/ServiceRow";
import ServiceFormDialog from "../../components/admin/services/ServiceFormDialog";
import { SERVICES_FALLBACK } from "../../lib/servicesData";

export default function AdminServicesPage() {
  const me = useAdminUser();
  const allowed = requireRole(me, ROLES.OWNER, ROLES.ADMIN);

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [importing, setImporting] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Service.list("display_order", 200);
    setServices(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (allowed) load();
  }, [allowed]);

  if (!allowed) return <AccessDenied />;

  const onAdd = () => { setEditing(null); setFormOpen(true); };
  const onEdit = (svc) => { setEditing(svc); setFormOpen(true); };

  const onToggleActive = (svc, value) => {
    setServices((prev) => prev.map((s) => (s.id === svc.id ? { ...s, is_active: value } : s)));
  };

  const onDelete = async (svc) => {
    if (!confirm(`Delete service '${svc.name_en}'? This cannot be undone.`)) return;
    await base44.entities.Service.delete(svc.id);
    setServices((prev) => prev.filter((s) => s.id !== svc.id));
  };

  const handleImport = async () => {
    if (!confirm(`Import the ${SERVICES_FALLBACK.length} current services into the database?`)) return;
    setImporting(true);
    try {
      for (const svc of SERVICES_FALLBACK) {
        await base44.entities.Service.create(svc);
      }
      await load();
    } finally {
      setImporting(false);
    }
  };

  const maxOrder = services.reduce((m, s) => Math.max(m, s.display_order || 0), 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Services</h1>
          <p className="text-sm text-white/40 mt-1">Manage the services catalogue shown on the homepage and the services page</p>
        </div>
        <Button onClick={onAdd} className="gap-2"><Plus className="w-4 h-4" /> Add Service</Button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
          <p className="text-sm text-white/40 mt-3">Loading services…</p>
        </div>
      ) : services.length === 0 ? (
        <div className="py-16 px-8 text-center bg-white/5 border border-white/10 rounded-xl">
          <Layers className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white font-semibold mb-2">No services yet</p>
          <p className="text-white/40 text-sm max-w-md mx-auto mb-6">
            You can import the {SERVICES_FALLBACK.length} services currently hardcoded on the public site,
            then edit them here. Or start from scratch with "Add Service".
          </p>
          <div className="flex items-center justify-center gap-2">
            <Button onClick={handleImport} disabled={importing} className="gap-2">
              {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {importing ? "Importing…" : "Import current services"}
            </Button>
            <Button variant="outline" onClick={onAdd} className="gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10">
              <Plus className="w-4 h-4" /> Add Service
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="flex items-center gap-4 px-4 py-3 text-xs uppercase tracking-widest text-white/40 bg-white/5">
            <span className="flex-1">Name</span>
            <span className="hidden md:block flex-1 max-w-sm">Tagline</span>
            <span className="hidden lg:block w-28">Icon</span>
            <span className="hidden md:block w-24 text-right">Sub-items</span>
            <span className="hidden lg:block w-12 text-right">Order</span>
            <span className="w-14">Active</span>
            <span className="w-20 text-right">Actions</span>
          </div>
          {services.map((s) => (
            <ServiceRow
              key={s.id}
              service={s}
              onEdit={onEdit}
              onToggleActive={onToggleActive}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      <ServiceFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initialService={editing}
        defaultDisplayOrder={maxOrder + 10}
        onSaved={load}
      />
    </div>
  );
}