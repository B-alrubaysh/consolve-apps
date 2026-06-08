import { useEffect, useState } from "react";
import { format } from "date-fns";
import { base44 } from "@/api/base44Admin";
import { Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ROLE_LABEL = { owner: "Owner", admin: "Admin", writer: "Writer", hr: "HR" };

const STATUS_STYLES = {
  active: "bg-green-500/15 text-green-400",
  invited: "bg-blue-500/15 text-blue-400",
  suspended: "bg-destructive/15 text-destructive",
};

export default function ProfileTab({ me }) {
  const [record, setRecord] = useState(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  const load = async () => {
    if (!me?.email) return;
    const list = await base44.entities.User.filter({ email: me.email }).catch(() => []);
    const rec = (list || [])[0];
    setRecord(rec || null);
    setFullName(rec?.full_name || "");
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me?.email]);

  const handleSave = async () => {
    if (!record?.id) return;
    setSaving(true);
    await base44.entities.User.update(record.id, { full_name: fullName });
    await load();
    setSaving(false);
    setSavedAt(new Date());
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <p className="text-sm text-white/40">Loading profile…</p>
      </div>
    );
  }

  if (!record) {
    return <p className="text-sm text-white/40">No profile record found.</p>;
  }

  const ipt = "bg-white/5 border-white/10 text-white";
  const lastLogin = record.last_login_at ? format(new Date(record.last_login_at), "MMM d, yyyy HH:mm") : "—";

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Your Profile</p>
        <div>
          <label className="block text-xs text-white/60 mb-1.5">Full Name</label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className={ipt} />
        </div>
        <div>
          <label className="block text-xs text-white/60 mb-1.5">Email</label>
          <Input value={record.email || ""} readOnly disabled className={ipt} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Role</label>
            <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-widest bg-primary/15 text-primary">
              {ROLE_LABEL[record.role] || record.role || "—"}
            </span>
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Status</label>
            <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-widest ${STATUS_STYLES[record.status] || "bg-white/10 text-white/60"}`}>
              {record.status || "—"}
            </span>
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Last Login</label>
            <p className="text-sm text-white/70">{lastLogin}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save
        </Button>
        {savedAt && <span className="text-xs text-green-400">Updated</span>}
      </div>
    </div>
  );
}