import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Loader2, Search, FileText, MessageSquare, Eye, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AdminForms() {
  const { adminUser } = useOutletContext();
  const [tab, setTab] = useState("assessments");
  const [assessments, setAssessments] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [a, c] = await Promise.all([
      base44.entities.Assessment.list("-created_date", 200),
      base44.entities.ContactInquiry.list("-created_date", 200),
    ]);
    setAssessments(a);
    setInquiries(c.filter((i) => !i.company?.includes("Job Application") && !i.company?.includes("توظيف")));
    setLoading(false);
  };

  const updateAssessmentStatus = async (id, status) => {
    await base44.entities.Assessment.update(id, { status });
    setAssessments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const updateInquiryStatus = async (id, status) => {
    await base44.entities.ContactInquiry.update(id, { status });
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  const items = tab === "assessments" ? assessments : inquiries;
  const filtered = items.filter((item) => {
    const searchStr = tab === "assessments"
      ? `${item.company_name} ${item.contact_name} ${item.contact_email}`
      : `${item.name} ${item.email} ${item.company}`;
    const matchSearch = !search || searchStr.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Form Results</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {assessments.length} assessments · {inquiries.length} contact inquiries
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-muted rounded-lg p-1 w-fit">
        <button
          onClick={() => { setTab("assessments"); setFilterStatus("all"); setSearch(""); }}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === "assessments" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="w-4 h-4 inline mr-1.5" />Assessments ({assessments.length})
        </button>
        <button
          onClick={() => { setTab("inquiries"); setFilterStatus("all"); setSearch(""); }}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === "inquiries" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessageSquare className="w-4 h-4 inline mr-1.5" />Inquiries ({inquiries.length})
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="pl-10 h-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40 h-10"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {tab === "assessments" ? (
              <>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Read">Read</SelectItem>
                <SelectItem value="Replied">Replied</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No submissions found</div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground">
                    {tab === "assessments" ? "Company" : "Name"}
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Email</th>
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Date</th>
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                    <td className="px-5 py-3.5 font-medium text-foreground">
                      {tab === "assessments" ? item.company_name : item.name}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {tab === "assessments" ? item.contact_email : item.email}
                    </td>
                    <td className="px-5 py-3.5">
                      <Select
                        value={item.status || "New"}
                        onValueChange={(v) => tab === "assessments" ? updateAssessmentStatus(item.id, v) : updateInquiryStatus(item.id, v)}
                      >
                        <SelectTrigger className="h-7 w-28 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {tab === "assessments" ? (
                            <>
                              <SelectItem value="New">New</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Contacted">Contacted</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="New">New</SelectItem>
                              <SelectItem value="Read">Read</SelectItem>
                              <SelectItem value="Replied">Replied</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground text-xs">
                      {new Date(item.created_date).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Button size="sm" variant="ghost" onClick={() => setDetail(item)}>
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

      {/* Detail Dialog */}
      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {tab === "assessments" ? detail?.company_name : detail?.name}
            </DialogTitle>
          </DialogHeader>
          {detail && (
            <div className="space-y-3 text-sm mt-2">
              {tab === "assessments" ? (
                <>
                  <InfoRow label="Company" value={detail.company_name} />
                  <InfoRow label="Industry" value={detail.industry} />
                  <InfoRow label="Size" value={detail.company_size} />
                  <InfoRow label="Contact" value={detail.contact_name} />
                  <InfoRow label="Email" value={detail.contact_email} />
                  <InfoRow label="Phone" value={detail.contact_phone} />
                  <InfoRow label="Risk Level" value={detail.risk_level} />
                  <InfoRow label="Maturity" value={detail.maturity_level} />
                  {detail.business_snapshot && <InfoRow label="Snapshot" value={detail.business_snapshot} />}
                  {detail.identified_problems && <InfoRow label="Problems" value={detail.identified_problems} />}
                  {detail.suggested_services && <InfoRow label="Suggested Services" value={detail.suggested_services} />}
                </>
              ) : (
                <>
                  <InfoRow label="Name" value={detail.name} />
                  <InfoRow label="Email" value={detail.email} />
                  <InfoRow label="Phone" value={detail.phone} />
                  <InfoRow label="Company" value={detail.company} />
                  <InfoRow label="Message" value={detail.message} />
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex gap-3 py-2 border-b border-border last:border-0">
      <span className="text-muted-foreground w-28 shrink-0">{label}</span>
      <span className="text-foreground break-words">{value}</span>
    </div>
  );
}