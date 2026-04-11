import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import {
  Loader2,
  Plus,
  Search,
  MoreHorizontal,
  Shield,
  ShieldCheck,
  UserCheck,
  UserX,
  Mail,
  Trash2,
  Pencil,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ROLE_LABELS } from "../../lib/adminAuth";

const ROLE_COLORS = {
  owner: "bg-amber-500/15 text-amber-600",
  admin: "bg-blue-500/15 text-blue-600",
  cms_manager: "bg-purple-500/15 text-purple-600",
  hr: "bg-green-500/15 text-green-600",
};

function getAssignableRoles(currentRole) {
  if (currentRole === "owner") return ["admin", "cms_manager", "hr"];
  if (currentRole === "admin") return ["cms_manager", "hr"];
  return [];
}

export default function AdminUsers() {
  const { adminUser } = useOutletContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState({ full_name: "", email: "", password: "", role: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke("adminUsers", {
        action: "list",
        requestingUserId: adminUser.id,
      });
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingUser) {
        await base44.functions.invoke("adminUsers", {
          action: "update",
          requestingUserId: adminUser.id,
          userId: editingUser.id,
          full_name: form.full_name,
          email: form.email,
          role: form.role,
        });
      } else {
        await base44.functions.invoke("adminUsers", {
          action: "create",
          requestingUserId: adminUser.id,
          full_name: form.full_name,
          email: form.email,
          password: form.password,
          role: form.role,
        });
      }
      setDialogOpen(false);
      setEditingUser(null);
      setForm({ full_name: "", email: "", password: "", role: "" });
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.error || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    await base44.functions.invoke("adminUsers", {
      action: "toggle_status",
      requestingUserId: adminUser.id,
      userId,
    });
    loadUsers();
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await base44.functions.invoke("adminUsers", {
      action: "delete",
      requestingUserId: adminUser.id,
      userId: deleteConfirm.id,
    });
    setDeleteConfirm(null);
    loadUsers();
  };

  const handleSendReset = async (userId) => {
    await base44.functions.invoke("adminUsers", {
      action: "send_reset",
      requestingUserId: adminUser.id,
      userId,
    });
  };

  const openCreate = () => {
    setEditingUser(null);
    setForm({ full_name: "", email: "", password: "", role: getAssignableRoles(adminUser.role)[0] || "" });
    setError("");
    setDialogOpen(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setForm({ full_name: user.full_name, email: user.email, password: "", role: user.role });
    setError("");
    setDialogOpen(true);
  };

  const filtered = users.filter((u) => {
    const matchSearch = !search || u.full_name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || u.role === filterRole;
    const matchStatus = filterStatus === "all" || u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const assignableRoles = getAssignableRoles(adminUser.role);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{users.length} users total</p>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus className="w-4 h-4 mr-1.5" /> Add User
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="pl-10 h-10"
          />
        </div>
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-40 h-10"><SelectValue placeholder="Role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="owner">Owner</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="cms_manager">CMS Manager</SelectItem>
            <SelectItem value="hr">HR</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40 h-10"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Name</th>
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Email</th>
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Role</th>
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Created</th>
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-foreground">{user.full_name}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{user.email}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${ROLE_COLORS[user.role] || ""}`}>
                        {ROLE_LABELS[user.role]}
                        {user.is_super_admin && " ★"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        user.status === "active" ? "bg-green-500/15 text-green-600" : "bg-red-500/15 text-red-500"
                      }`}>
                        {user.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground text-xs">
                      {user.created_date ? new Date(user.created_date).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {user.role !== "owner" && assignableRoles.includes(user.role) && (
                            <DropdownMenuItem onClick={() => openEdit(user)}>
                              <Pencil className="w-4 h-4 mr-2" /> Edit
                            </DropdownMenuItem>
                          )}
                          {user.role !== "owner" && (
                            <DropdownMenuItem onClick={() => handleToggleStatus(user.id)}>
                              {user.status === "active" ? (
                                <><UserX className="w-4 h-4 mr-2" /> Deactivate</>
                              ) : (
                                <><UserCheck className="w-4 h-4 mr-2" /> Reactivate</>
                              )}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleSendReset(user.id)}>
                            <Mail className="w-4 h-4 mr-2" /> Send Password Reset
                          </DropdownMenuItem>
                          {adminUser.role === "owner" && user.role !== "owner" && (
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setDeleteConfirm(user)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 mt-2">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-sm px-3 py-2 rounded-lg">{error}</div>
            )}
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Full Name</label>
              <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Email</label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            {!editingUser && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Temporary Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    minLength={8}
                    placeholder="Min 8 characters"
                    className="pr-10"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Role</label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                <SelectContent>
                  {assignableRoles.map((r) => (
                    <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingUser ? "Save Changes" : "Create User"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete {deleteConfirm?.full_name}? This action cannot be undone. Activity logs will be retained.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}