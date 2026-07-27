import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { base44 } from "@/api/base44Admin";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, ArrowLeft, Monitor, Smartphone, Save, Eye, EyeOff } from "lucide-react";
import { useAdminUser } from "../../components/admin/ProtectedAdminLayout";
import { requireRole, ROLES } from "../../lib/rbac";
import AccessDenied from "../../components/admin/AccessDenied";

const EDITABLE_FIELDS = [
  "html_content",
  "css_content",
  "js_content",
  "seo_title",
  "seo_description",
  "og_image_url",
  "notes",
];

function buildSrcDoc({ html_content = "", css_content = "", js_content = "" }) {
  return (
    '<!DOCTYPE html><html><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    "<style>" + (css_content || "") + "</style>" +
    "</head><body>" + (html_content || "") +
    "<scr" + "ipt>" + (js_content || "") + "</scr" + "ipt>" +
    "</body></html>"
  );
}

export default function AdminLandingEditorPage() {
  const me = useAdminUser();
  const allowed = requireRole(me, ROLES.OWNER, ROLES.ADMIN);
  const { id } = useParams();

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [device, setDevice] = useState("desktop");
  const [srcDoc, setSrcDoc] = useState("");
  const debounceRef = useRef(null);

  // Load record
  useEffect(() => {
    if (!allowed || !id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const rows = await base44.entities.LandingPage.filter({ id });
      if (cancelled) return;
      const found = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
      if (!found) {
        setNotFound(true);
      } else {
        setPage(found);
        setForm({
          html_content: found.html_content || "",
          css_content: found.css_content || "",
          js_content: found.js_content || "",
          seo_title: found.seo_title || "",
          seo_description: found.seo_description || "",
          og_image_url: found.og_image_url || "",
          notes: found.notes || "",
        });
        setSrcDoc(buildSrcDoc(found));
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [id, allowed]);

  // Debounced preview rebuild
  useEffect(() => {
    if (!form) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSrcDoc(buildSrcDoc(form));
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [form]);

  // Unsaved changes guard
  useEffect(() => {
    const onBeforeUnload = (e) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const doSave = async () => {
    if (!form || saving) return;
    setSaving(true);
    try {
      const payload = {};
      for (const k of EDITABLE_FIELDS) payload[k] = form[k] ?? "";
      const updated = await base44.entities.LandingPage.update(id, payload);
      setPage((prev) => ({ ...(prev || {}), ...(updated || payload) }));
      setDirty(false);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  // Cmd/Ctrl+S shortcut
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        doSave();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [form, saving, id]); // eslint-disable-line react-hooks/exhaustive-deps

  const togglePublish = async () => {
    if (!page) return;
    const next = !page.is_published;
    const updated = await base44.entities.LandingPage.update(id, { is_published: next });
    setPage((prev) => ({ ...(prev || {}), ...(updated || { is_published: next }) }));
  };

  if (!allowed) return <AccessDenied />;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary text-white">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
          <p className="text-sm text-white/40 mt-3">Loading landing page…</p>
        </div>
      </div>
    );
  }

  if (notFound || !page || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary text-white px-6">
        <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <h1 className="text-xl font-bold mb-2">Landing page not found</h1>
          <p className="text-white/60 text-sm mb-6">This landing page no longer exists.</p>
          <Link to="/admin/landing" className="inline-block text-xs font-semibold uppercase tracking-widest text-primary hover:opacity-80">
            ← Back to Landing Pages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-secondary text-white">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-white/10">
        <Link to="/admin/landing" className="text-white/60 hover:text-white" title="Back">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-white truncate">{page.name}</p>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] border ${
                page.is_published
                  ? "bg-green-500/10 text-green-400 border-green-500/30"
                  : "bg-white/5 text-white/40 border-white/10"
              }`}
            >
              {page.is_published ? "Published" : "Draft"}
            </span>
            {dirty && <span className="text-[10px] text-yellow-400 uppercase tracking-widest">Unsaved</span>}
            {savedFlash && <span className="text-[10px] text-green-400 uppercase tracking-widest">Saved</span>}
          </div>
          <p className="text-xs text-white/40 truncate">/p/{page.slug}</p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="inline-flex bg-white/5 border border-white/10 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setDevice("desktop")}
              className={`px-2.5 py-1.5 rounded-md text-xs inline-flex items-center gap-1.5 ${
                device === "desktop" ? "bg-white/10 text-white" : "text-white/60 hover:text-white"
              }`}
              title="Desktop preview"
            >
              <Monitor className="w-4 h-4" /> Desktop
            </button>
            <button
              type="button"
              onClick={() => setDevice("mobile")}
              className={`px-2.5 py-1.5 rounded-md text-xs inline-flex items-center gap-1.5 ${
                device === "mobile" ? "bg-white/10 text-white" : "text-white/60 hover:text-white"
              }`}
              title="Mobile preview"
            >
              <Smartphone className="w-4 h-4" /> Mobile
            </button>
          </div>

          <Button
            variant="outline"
            onClick={togglePublish}
            className="gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            {page.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {page.is_published ? "Unpublish" : "Publish"}
          </Button>

          <Button onClick={doSave} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : savedFlash ? "Saved" : "Save"}
          </Button>
        </div>
      </div>

      {/* Split view */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2">
        {/* Editor */}
        <div className="min-h-0 flex flex-col border-r border-white/10">
          <Tabs defaultValue="html" className="flex-1 min-h-0 flex flex-col">
            <div className="px-4 pt-3">
              <TabsList className="bg-white/5 border border-white/10">
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="css">CSS</TabsTrigger>
                <TabsTrigger value="js">JavaScript</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="html" className="flex-1 min-h-0 p-4">
              <Textarea
                value={form.html_content}
                onChange={(e) => setField("html_content", e.target.value)}
                spellCheck={false}
                className="h-full w-full resize-none font-mono text-sm bg-black/30 border-white/10 text-white"
                placeholder="<section>…</section>"
              />
            </TabsContent>
            <TabsContent value="css" className="flex-1 min-h-0 p-4">
              <Textarea
                value={form.css_content}
                onChange={(e) => setField("css_content", e.target.value)}
                spellCheck={false}
                className="h-full w-full resize-none font-mono text-sm bg-black/30 border-white/10 text-white"
                placeholder="body { … }"
              />
            </TabsContent>
            <TabsContent value="js" className="flex-1 min-h-0 p-4">
              <Textarea
                value={form.js_content}
                onChange={(e) => setField("js_content", e.target.value)}
                spellCheck={false}
                className="h-full w-full resize-none font-mono text-sm bg-black/30 border-white/10 text-white"
                placeholder="// runs in the sandboxed preview"
              />
            </TabsContent>
            <TabsContent value="settings" className="flex-1 min-h-0 p-4 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs text-white/60 mb-1.5">SEO Title</label>
                <Input
                  value={form.seo_title}
                  onChange={(e) => setField("seo_title", e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-white/60 mb-1.5">SEO Description</label>
                <Textarea
                  rows={3}
                  value={form.seo_description}
                  onChange={(e) => setField("seo_description", e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-white/60 mb-1.5">Share Image URL</label>
                <Input
                  value={form.og_image_url}
                  onChange={(e) => setField("og_image_url", e.target.value)}
                  placeholder="https://…"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-white/60 mb-1.5">Internal Notes</label>
                <Textarea
                  rows={4}
                  value={form.notes}
                  onChange={(e) => setField("notes", e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview */}
        <div className="min-h-0 bg-black/40 p-4 overflow-auto">
          <div
            className={
              device === "mobile"
                ? "mx-auto w-[390px] h-full border border-white/20 rounded-2xl overflow-hidden bg-white shadow-xl"
                : "w-full h-full border border-white/10 rounded-lg overflow-hidden bg-white"
            }
          >
            <iframe
              key={device}
              title="Landing page preview"
              srcDoc={srcDoc}
              sandbox="allow-scripts allow-popups allow-forms"
              className="w-full h-full border-0 bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}