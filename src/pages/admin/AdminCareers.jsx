import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Loader2, Search, Eye, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AdminCareers() {
  const { adminUser } = useOutletContext();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [detail, setDetail] = useState(null);

  useEffect(() => { loadApps(); }, []);

  const loadApps = async () => {
    setLoading(true);
    const all = await base44.entities.ContactInquiry.list("-created_date", 200);
    const careerApps = all.filter(
      (c) => c.company?.includes("Job Application") || c.company?.includes("توظيف")
    );
    setApps(careerApps);
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    await base44.entities.ContactInquiry.update(id, { status });
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const filtered = apps.filter((a) => {
    const matchSearch = !search || a.name?.toLowerCase().includes(search.toLowerCase()) || a.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Careers</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{apps.length} career applications</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search applicants..."
            className="pl-10 h-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40 h-10"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Read">Read</SelectItem>
            <SelectItem value="Replied">Replied</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Briefcase className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No career applications found</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Name</th>
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Email</th>
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Position</th>
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Date</th>
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground">View</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => (
                  <tr key={app.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                    <td className="px-5 py-3.5 font-medium text-foreground">{app.name}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{app.email}</td>
                    <td className="px-5 py-3.5 text-muted-foreground text-xs">{app.company}</td>
                    <td className="px-5 py-3.5">
                      <Select value={app.status || "New"} onValueChange={(v) => updateStatus(app.id, v)}>
                        <SelectTrigger className="h-7 w-24 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Read">Read</SelectItem>
                          <SelectItem value="Replied">Replied</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground text-xs">
                      {new Date(app.created_date).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Button size="sm" variant="ghost" onClick={() => setDetail(app)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{detail?.name}</DialogTitle>
          </DialogHeader>
          {detail && (
            <div className="space-y-3 text-sm mt-2">
              <div className="flex gap-3 py-2 border-b border-border">
                <span className="text-muted-foreground w-24">Email</span>
                <span className="text-foreground">{detail.email}</span>
              </div>
              <div className="flex gap-3 py-2 border-b border-border">
                <span className="text-muted-foreground w-24">Phone</span>
                <span className="text-foreground">{detail.phone || "—"}</span>
              </div>
              <div className="flex gap-3 py-2 border-b border-border">
                <span className="text-muted-foreground w-24">Position</span>
                <span className="text-foreground">{detail.company}</span>
              </div>
              <div className="flex gap-3 py-2">
                <span className="text-muted-foreground w-24">Message</span>
                <span className="text-foreground whitespace-pre-wrap break-words">{detail.message}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}