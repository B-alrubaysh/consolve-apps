import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { base44 } from "@/api/base44Client";
import { Loader2, Search, Mail, Download, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function csvEscape(v) {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const CSV_COLUMNS = ["email", "blog_post_title", "blog_post_id", "language", "captured_at", "source_url"];

export default function EmailCapturesTab() {
  const [captures, setCaptures] = useState([]);
  const [postMap, setPostMap] = useState(new Map());
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [postFilter, setPostFilter] = useState("all");
  const [langFilter, setLangFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [caps, blogs] = await Promise.all([
        base44.entities.BlogEmailCapture.list("-captured_at", 1000).catch(() => []),
        base44.entities.BlogPost.list("-created_date", 500).catch(() => []),
      ]);
      if (cancelled) return;
      const map = new Map();
      (blogs || []).forEach((b) => map.set(b.id, b));
      setCaptures(caps || []);
      setPosts(blogs || []);
      setPostMap(map);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const titleFor = (id) => {
    const p = postMap.get(id);
    if (!p) return "Unknown post";
    return p.title_en || p.title_ar || p.slug || "Untitled";
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const start = startDate ? new Date(startDate).getTime() : null;
    const end = endDate ? new Date(endDate).getTime() + 24 * 60 * 60 * 1000 - 1 : null;

    return captures.filter((c) => {
      if (q && !(c.email || "").toLowerCase().includes(q)) return false;
      if (postFilter !== "all" && c.blog_post_id !== postFilter) return false;
      if (langFilter !== "all" && c.language !== langFilter) return false;
      const ts = c.captured_at ? new Date(c.captured_at).getTime() : null;
      if (start && (!ts || ts < start)) return false;
      if (end && (!ts || ts > end)) return false;
      return true;
    });
  }, [captures, search, postFilter, langFilter, startDate, endDate]);

  const handleExport = () => {
    const rows = filtered.map((c) => ({
      email: c.email || "",
      blog_post_title: titleFor(c.blog_post_id),
      blog_post_id: c.blog_post_id || "",
      language: c.language || "",
      captured_at: c.captured_at || "",
      source_url: c.source_url || "",
    }));
    const lines = [CSV_COLUMNS.join(",")];
    rows.forEach((r) => lines.push(CSV_COLUMNS.map((k) => csvEscape(r[k])).join(",")));
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `email-captures-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <p className="text-sm text-white/40">Loading email captures…</p>
      </div>
    );
  }

  const ipt = "bg-white/5 border-white/10 text-white";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-white/60">{filtered.length} email capture{filtered.length === 1 ? "" : "s"}</p>
        <Button onClick={handleExport} disabled={filtered.length === 0} variant="outline" className="gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by email…" className={`pl-9 ${ipt}`} />
        </div>
        <Select value={postFilter} onValueChange={setPostFilter}>
          <SelectTrigger className={ipt}><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All posts</SelectItem>
            {posts.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.title_en || p.title_ar || p.slug || "Untitled"}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={langFilter} onValueChange={setLangFilter}>
          <SelectTrigger className={ipt}><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All languages</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ar">Arabic</SelectItem>
          </SelectContent>
        </Select>
        <div className="grid grid-cols-2 gap-2">
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={ipt} />
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={ipt} />
        </div>
      </div>

      {captures.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
          <Mail className="w-10 h-10 text-white/30 mx-auto mb-4" />
          <p className="text-sm text-white/50">No email captures yet</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
          <Mail className="w-10 h-10 text-white/30 mx-auto mb-4" />
          <p className="text-sm text-white/50">No captures match your filters</p>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-4 py-3 text-[11px] uppercase tracking-widest text-white/40">
            <div className="col-span-3">Email</div>
            <div className="col-span-4">Post</div>
            <div className="col-span-1">Lang</div>
            <div className="col-span-2">Captured</div>
            <div className="col-span-2">Source</div>
          </div>
          {filtered.map((c) => (
            <div key={c.id} className="grid grid-cols-12 gap-4 items-center px-4 py-3 border-t border-white/5 hover:bg-white/5 transition-colors text-sm">
              <div className="col-span-3 text-white truncate">{c.email}</div>
              <div className="col-span-4 text-white/70 truncate">{titleFor(c.blog_post_id)}</div>
              <div className="col-span-1">
                <span className="inline-block px-1.5 py-0.5 rounded-md text-[10px] font-semibold tracking-widest bg-white/10 text-white/70">
                  {(c.language || "—").toUpperCase()}
                </span>
              </div>
              <div className="col-span-2 text-white/50 text-xs">
                {c.captured_at ? format(new Date(c.captured_at), "MMM d, yyyy HH:mm") : "—"}
              </div>
              <div className="col-span-2 text-xs truncate">
                {c.source_url ? (
                  <a href={c.source_url} target="_blank" rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" /> Link
                  </a>
                ) : <span className="text-white/40">—</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}