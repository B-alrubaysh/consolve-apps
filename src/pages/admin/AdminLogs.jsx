import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Loader2, Search, ScrollText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminLogs() {
  const { adminUser } = useOutletContext();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterModule, setFilterModule] = useState("all");

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    const data = await base44.entities.ActivityLog.list("-created_date", 200);
    setLogs(data);
    setLoading(false);
  };

  const filtered = logs.filter((l) => {
    const matchSearch = !search ||
      l.action?.toLowerCase().includes(search.toLowerCase()) ||
      l.admin_user_name?.toLowerCase().includes(search.toLowerCase());
    const matchModule = filterModule === "all" || l.module === filterModule;
    return matchSearch && matchModule;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Activity Logs</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Audit trail of all admin actions</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logs..."
            className="pl-10 h-10"
          />
        </div>
        <Select value={filterModule} onValueChange={setFilterModule}>
          <SelectTrigger className="w-44 h-10"><SelectValue placeholder="Module" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            <SelectItem value="auth">Auth</SelectItem>
            <SelectItem value="users">Users</SelectItem>
            <SelectItem value="cms">CMS</SelectItem>
            <SelectItem value="careers">Careers</SelectItem>
            <SelectItem value="forms">Forms</SelectItem>
            <SelectItem value="clients">Clients</SelectItem>
            <SelectItem value="settings">Settings</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <ScrollText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No logs found</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Timestamp</th>
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground">User</th>
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Action</th>
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Module</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => {
                  const date = new Date(log.created_date);
                  return (
                    <tr key={log.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className="px-5 py-3 text-muted-foreground text-xs whitespace-nowrap">
                        {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-medium text-foreground">{log.admin_user_name || "Deleted User"}</p>
                        <p className="text-xs text-muted-foreground">{log.admin_user_email || ""}</p>
                      </td>
                      <td className="px-5 py-3 text-foreground">{log.action}</td>
                      <td className="px-5 py-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {log.module}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}