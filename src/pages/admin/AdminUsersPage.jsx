import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Admin";
import { Loader2, UserPlus, Trash2, ShieldOff, ShieldCheck } from "lucide-react";
import { useAdminUser } from "../../components/admin/ProtectedAdminLayout";
import { requireRole, ROLES } from "../../lib/rbac";
import AccessDenied from "../../components/admin/AccessDenied";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";

const ROLE_LABEL = {
  owner: "Owner",
  admin: "Admin",
  writer: "Writer",
  hr: "HR",
};

const STATUS_BADGE = {
  active: "bg-green-500/10 text-green-400 border-green-500/30",
  invited: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  suspended: "bg-red-500/10 text-red-400 border-red-500/30",
};

export default function AdminUsersPage() {
  const me = useAdminUser();
  const allowed = requireRole(me, ROLES.OWNER, ROLES.ADMIN);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: "", role: "admin", full_name: "" });
  const [inviteSubmitting, setInviteSubmitting] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteNotice, setInviteNotice] = useState("");

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.User.list("-created_date", 200);
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    if (allowed) load();
  }, [allowed]);

  if (!allowed) {
    return <AccessDenied />;
  }

  const submitInvite = async () => {
    setInviteError("");
    setInviteNotice("");
    setInviteSubmitting(true);
    try {
      const res = await base44.functions.invoke("inviteAdminUser", inviteForm);
      if (res.data?.success && res.data?.emailSent !== false) {
        setInviteOpen(false);
        setInviteForm({ email: "", role: "admin", full_name: "" });
        await load();
      } else if (res.data?.success && res.data?.emailSent === false) {
        setInviteNotice(
          "Role saved. We couldn't send the invite email (the account may already exist). Ask them to go to /admin/login → Continue to Login → 'Forgot password' to set their password. Their admin access will be applied automatically when they sign in."
        );
        await load();
      } else {
        setInviteError(res.data?.error || "Failed to invite user.");
      }
    } catch (err) {
      setInviteError(err?.response?.data?.error || err?.message || "Failed to invite user.");
    }
    setInviteSubmitting(false);
  };

  const updateUser = async (target_user_id, updates) => {
    await base44.functions.invoke("updateAdminUser", { action: "update", target_user_id, updates });
    await load();
  };

  const deleteUser = async (target_user_id) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    await base44.functions.invoke("updateAdminUser", { action: "delete", target_user_id });
    await load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-sm text-white/40 mt-1">Manage admin team and roles</p>
        </div>

        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><UserPlus className="w-4 h-4" /> Invite User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite a new user</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Full name (optional)</label>
                <Input
                  value={inviteForm.full_name}
                  onChange={(e) => setInviteForm({ ...inviteForm, full_name: e.target.value })}
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Email</label>
                <Input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Role</label>
                <Select value={inviteForm.role} onValueChange={(v) => setInviteForm({ ...inviteForm, role: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin — full access</SelectItem>
                    <SelectItem value="writer">{"Writer — Blog & Templates"}</SelectItem>
                    <SelectItem value="hr">{"HR — Careers & Submissions"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {inviteError && (
                <p className="text-sm text-destructive">{inviteError}</p>
              )}
              {inviteNotice && (
                <p className="text-sm text-muted-foreground bg-muted/40 border border-border rounded-md p-3 leading-relaxed">
                  {inviteNotice}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setInviteOpen(false)}>Cancel</Button>
              <Button onClick={submitInvite} disabled={!inviteForm.email || inviteSubmitting}>
                {inviteSubmitting ? "Sending…" : "Send Invite"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="py-20 text-center"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-white/50 uppercase text-xs tracking-widest">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Name</th>
                <th className="text-left px-5 py-3 font-medium">Email</th>
                <th className="text-left px-5 py-3 font-medium">Role</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Last Login</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isOwner = u.role === "owner";
                const isSelf = u.email === me.email;
                return (
                  <tr key={u.id} className="border-t border-white/5">
                    <td className="px-5 py-4 text-white">{u.full_name || "—"}</td>
                    <td className="px-5 py-4 text-white/70">{u.email}</td>
                    <td className="px-5 py-4">
                      {isOwner ? (
                        <span className="text-xs uppercase tracking-widest text-primary font-semibold">Owner</span>
                      ) : (
                        <Select
                          value={u.role || "admin"}
                          onValueChange={(v) => updateUser(u.id, { role: v })}
                          disabled={isSelf}
                        >
                          <SelectTrigger className="w-32 h-8 bg-transparent border-white/10 text-white"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">{ROLE_LABEL.admin}</SelectItem>
                            <SelectItem value="writer">{ROLE_LABEL.writer}</SelectItem>
                            <SelectItem value="hr">{ROLE_LABEL.hr}</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs border ${STATUS_BADGE[u.status] || "bg-white/5 text-white/40 border-white/10"}`}>
                        {u.status || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-white/50 text-xs">
                      {u.last_login_at ? format(new Date(u.last_login_at), "MMM d, yyyy") : "—"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {!isOwner && !isSelf && (
                        <div className="flex items-center justify-end gap-2">
                          {u.status === "suspended" ? (
                            <Button size="sm" variant="ghost" className="text-green-400 hover:text-green-300"
                              onClick={() => updateUser(u.id, { status: "active" })}>
                              <ShieldCheck className="w-4 h-4" />
                            </Button>
                          ) : u.status === "active" ? (
                            <Button size="sm" variant="ghost" className="text-yellow-400 hover:text-yellow-300"
                              onClick={() => updateUser(u.id, { status: "suspended" })}>
                              <ShieldOff className="w-4 h-4" />
                            </Button>
                          ) : null}
                          <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300"
                            onClick={() => deleteUser(u.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}