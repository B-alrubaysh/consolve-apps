import { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Plus, Users, Search } from "lucide-react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminUser } from "../../components/admin/ProtectedAdminLayout";
import { requireRole, ROLES } from "../../lib/rbac";
import AccessDenied from "../../components/admin/AccessDenied";
import ClientFormDialog from "../../components/admin/clients/ClientFormDialog";
import ClientRow from "../../components/admin/clients/ClientRow";

export default function AdminClientsPage() {
  // Hooks first — before any early return.
  const me = useAdminUser();
  const allowed = requireRole(me, ROLES.OWNER, ROLES.ADMIN);

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Client.list("display_order", 200);
    setClients(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (allowed) load();
  }, [allowed]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return clients.filter((c) => {
      if (q) {
        const hay = `${c.name_en || ""} ${c.name_ar || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (statusFilter === "active" && !c.is_active) return false;
      if (statusFilter === "inactive" && c.is_active) return false;
      return true;
    });
  }, [clients, search, statusFilter]);

  // DnD only operates on the unfiltered list (drag is disabled when filtered).
  const dndEnabled = !search && statusFilter === "all";

  if (!allowed) return <AccessDenied />;

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const fromIdx = result.source.index;
    const toIdx = result.destination.index;
    if (fromIdx === toIdx) return;

    const next = Array.from(clients);
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);

    // Optimistic local reorder + recompute display_order as (index + 1) * 10.
    const reordered = next.map((c, i) => ({ ...c, display_order: (i + 1) * 10 }));
    setClients(reordered);

    // Persist only the rows whose order changed.
    const changed = reordered.filter((c, i) => clients[i]?.id !== c.id || clients[i]?.display_order !== c.display_order);
    for (const c of changed) {
      await base44.entities.Client.update(c.id, { display_order: c.display_order });
    }
  };

  const onAdd = () => { setEditing(null); setFormOpen(true); };
  const onEdit = (client) => { setEditing(client); setFormOpen(true); };

  const onToggleActive = async (client) => {
    const newVal = !client.is_active;
    setClients((prev) => prev.map((c) => (c.id === client.id ? { ...c, is_active: newVal } : c)));
    await base44.entities.Client.update(client.id, { is_active: newVal });
  };

  const onDelete = async (client) => {
    if (!confirm(`Delete client '${client.name_en}'? This cannot be undone.`)) return;
    await base44.entities.Client.delete(client.id);
    setClients((prev) => prev.filter((c) => c.id !== client.id));
  };

  const maxOrder = clients.reduce((m, c) => Math.max(m, c.display_order || 0), 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Clients</h1>
          <p className="text-sm text-white/40 mt-1">Manage homepage logo carousel</p>
        </div>
        <Button onClick={onAdd} className="gap-2"><Plus className="w-4 h-4" /> Add Client</Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <div className="relative md:col-span-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name (English or Arabic)…"
            className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Body */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
          <p className="text-sm text-white/40 mt-3">Loading clients…</p>
        </div>
      ) : clients.length === 0 ? (
        <div className="py-20 text-center bg-white/5 border border-white/10 rounded-xl">
          <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40 mb-6">No clients yet — add your first one</p>
          <Button onClick={onAdd} className="gap-2"><Plus className="w-4 h-4" /> Add Client</Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-white/5 border border-white/10 rounded-xl">
          <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">No clients match your filters</p>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          {/* Header row */}
          <div className="flex items-center gap-4 px-4 py-3 text-xs uppercase tracking-widest text-white/40 bg-white/5">
            <span className="w-4" />
            <span className="w-24">Logo</span>
            <span className="flex-1">Name</span>
            <span className="hidden md:block max-w-48 w-48">Website</span>
            <span className="hidden lg:block w-12 text-right">Order</span>
            <span className="hidden md:block w-20">Status</span>
            <span className="hidden lg:block w-24 text-right">Updated</span>
            <span className="w-28 text-right">Actions</span>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="clients-list" isDropDisabled={!dndEnabled}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {filtered.map((c, i) => (
                    <ClientRow
                      key={c.id}
                      client={c}
                      index={i}
                      onEdit={onEdit}
                      onToggleActive={onToggleActive}
                      onDelete={onDelete}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {!dndEnabled && (
            <div className="px-4 py-2 text-xs text-white/30 border-t border-white/5 bg-white/5">
              Drag-to-reorder is disabled while filters are applied.
            </div>
          )}
        </div>
      )}

      <ClientFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initialClient={editing}
        defaultDisplayOrder={maxOrder + 10}
        onSaved={load}
      />
    </div>
  );
}