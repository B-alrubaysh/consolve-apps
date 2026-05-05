import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Loader2, ArrowLeft, Save, CalendarClock, UploadCloud, Archive, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminUser } from "../../components/admin/ProtectedAdminLayout";
import { requireRole, ROLES } from "../../lib/rbac";
import AccessDenied from "../../components/admin/AccessDenied";
import BlogLanguageEditor from "../../components/admin/blog/BlogLanguageEditor";
import BlogEditorSidebar from "../../components/admin/blog/BlogEditorSidebar";
import { slugify, htmlIsEmpty } from "../../lib/blogUtils";

const EMPTY = {
  title_en: "",
  title_ar: "",
  slug: "",
  excerpt_en: "",
  excerpt_ar: "",
  content_en: "",
  content_ar: "",
  hero_image_url: "",
  og_image_url: "",
  author_id: "",
  category: "",
  tags: [],
  seo_title_en: "",
  seo_title_ar: "",
  seo_description_en: "",
  seo_description_ar: "",
  canonical_url: "",
  status: "draft",
  publish_date: "",
  email_gate_enabled: false,
  email_gate_threshold: 35,
  email_gate_skippable: true,
};

function buildPayload(form) {
  return {
    ...form,
    tags: Array.isArray(form.tags) ? form.tags : [],
    application_limit: undefined, // not on this entity, just defensive
  };
}

export default function AdminBlogEditorPage() {
  const me = useAdminUser();
  const allowed = requireRole(me, ROLES.OWNER, ROLES.ADMIN, ROLES.WRITER);
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState(EMPTY);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(!!id);
  const [errors, setErrors] = useState({});
  const [slugTouched, setSlugTouched] = useState(false);
  const [saveState, setSaveState] = useState({ status: "idle", at: null });
  const [actionLoading, setActionLoading] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  const currentIdRef = useRef(id || null);
  const dirtyRef = useRef(false);
  const debounceRef = useRef(null);
  const formRef = useRef(form);
  formRef.current = form;

  // Initial load
  useEffect(() => {
    if (!allowed) return;
    let cancelled = false;
    (async () => {
      const userList = await base44.entities.User.list("-created_date", 500).catch(() => []);
      if (cancelled) return;
      setUsers(userList || []);

      if (!id) {
        const tpls = await base44.entities.BlogTemplate.list("-updated_date", 200).catch(() => []);
        if (!cancelled) setTemplates((tpls || []).filter((t) => t.is_active));
      }

      if (id) {
        const post = await base44.entities.BlogPost.filter({ id });
        const found = (post || [])[0];
        if (cancelled) return;
        if (found) {
          setForm({ ...EMPTY, ...found, tags: Array.isArray(found.tags) ? found.tags : [] });
          setSlugTouched(true);
        }
      } else {
        // default author = me
        setForm((p) => ({ ...p, author_id: me?.id || "" }));
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, allowed, me?.id]);

  const setField = (key, value) => {
    setForm((p) => {
      const next = { ...p, [key]: value };
      if (key === "title_en" && !slugTouched && !id) {
        next.slug = slugify(value);
      }
      return next;
    });
    dirtyRef.current = true;
    setSaveState((s) => ({ status: "dirty", at: s.at }));
    scheduleAutosave();
  };

  const setSlug = (value) => {
    setSlugTouched(true);
    setForm((p) => ({ ...p, slug: value }));
    dirtyRef.current = true;
    setSaveState((s) => ({ status: "dirty", at: s.at }));
    scheduleAutosave();
  };

  // Autosave (debounced)
  const scheduleAutosave = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { autosave(); }, 3000);
  };

  const autosave = async () => {
    if (!dirtyRef.current) return;
    const data = formRef.current;
    if (!data.slug) return; // need at least a slug
    setSaveState({ status: "saving", at: null });
    const payload = buildPayload(data);
    delete payload.application_limit;

    if (currentIdRef.current) {
      await base44.entities.BlogPost.update(currentIdRef.current, payload);
    } else {
      const created = await base44.entities.BlogPost.create(payload);
      currentIdRef.current = created.id;
      navigate(`/admin/blog/${created.id}/edit`, { replace: true });
    }
    dirtyRef.current = false;
    setSaveState({ status: "saved", at: new Date() });
  };

  // Flush autosave on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const validateForPublish = () => {
    const e = {};
    if (!(form.title_en || form.title_ar)) e.title = "Title is required (EN or AR)";
    const hasEn = !htmlIsEmpty(form.content_en);
    const hasAr = !htmlIsEmpty(form.content_ar);
    if (!hasEn && !hasAr) e.content = "Content is required (EN or AR)";
    if (!form.slug) e.slug = "Slug is required";
    if (!form.hero_image_url) e.hero_image_url = "Hero image is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const performAction = async (action) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (action === "publish" && !validateForPublish()) return;
    if (action === "schedule") {
      if (!validateForPublish()) return;
      if (!form.publish_date || new Date(form.publish_date).getTime() <= Date.now()) {
        setErrors((p) => ({ ...p, schedule: "Publish date must be in the future" }));
        return;
      }
    }
    setErrors({});
    setActionLoading(action);

    const patch = {};
    if (action === "draft") patch.status = "draft";
    if (action === "schedule") patch.status = "scheduled";
    if (action === "publish") {
      patch.status = "published";
      if (!form.publish_date) patch.publish_date = new Date().toISOString();
    }
    if (action === "archive") patch.status = "archived";

    const merged = { ...form, ...patch };
    setForm(merged);
    const payload = buildPayload(merged);
    delete payload.application_limit;

    if (currentIdRef.current) {
      await base44.entities.BlogPost.update(currentIdRef.current, payload);
    } else {
      const created = await base44.entities.BlogPost.create(payload);
      currentIdRef.current = created.id;
      navigate(`/admin/blog/${created.id}/edit`, { replace: true });
    }
    dirtyRef.current = false;
    setSaveState({ status: "saved", at: new Date() });
    setActionLoading(null);
  };

  const handlePreview = async () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setActionLoading("preview");
    if (!form.slug) {
      setErrors({ slug: "Slug is required to preview" });
      setActionLoading(null);
      return;
    }
    const payload = buildPayload(form);
    delete payload.application_limit;
    if (currentIdRef.current) {
      await base44.entities.BlogPost.update(currentIdRef.current, payload);
    } else {
      const created = await base44.entities.BlogPost.create(payload);
      currentIdRef.current = created.id;
      navigate(`/admin/blog/${created.id}/edit`, { replace: true });
    }
    dirtyRef.current = false;
    setSaveState({ status: "saved", at: new Date() });
    setActionLoading(null);
    window.open(`/blog/${form.slug}?preview=true`, "_blank");
  };

  const applyTemplate = (tplId) => {
    if (!tplId) return;
    const tpl = templates.find((t) => t.id === tplId);
    if (!tpl) return;

    const targetFields = [
      "title_en", "title_ar", "content_en", "content_ar",
      "excerpt_en", "excerpt_ar",
      "seo_title_en", "seo_title_ar",
      "seo_description_en", "seo_description_ar",
    ];
    const hasAnyContent = targetFields.some((k) => {
      const v = form[k];
      if (typeof v !== "string") return false;
      if (k.startsWith("content_")) return !htmlIsEmpty(v);
      return v.trim().length > 0;
    });

    if (hasAnyContent) {
      const ok = confirm("Apply template? Empty fields will be filled. Existing content will NOT be overwritten.");
      if (!ok) {
        setSelectedTemplateId("");
        return;
      }
    }

    const isEmpty = (v) => !v || (typeof v === "string" && v.trim().length === 0);
    const isHtmlEmpty = (v) => htmlIsEmpty(v);

    setForm((p) => {
      const next = { ...p };
      if (isEmpty(next.title_en) && tpl.suggested_title_pattern_en) next.title_en = tpl.suggested_title_pattern_en;
      if (isEmpty(next.title_ar) && tpl.suggested_title_pattern_ar) next.title_ar = tpl.suggested_title_pattern_ar;
      if (isEmpty(next.excerpt_en) && tpl.suggested_excerpt_pattern_en) next.excerpt_en = tpl.suggested_excerpt_pattern_en;
      if (isEmpty(next.excerpt_ar) && tpl.suggested_excerpt_pattern_ar) next.excerpt_ar = tpl.suggested_excerpt_pattern_ar;
      if (isHtmlEmpty(next.content_en) && tpl.content_structure_en) next.content_en = tpl.content_structure_en;
      if (isHtmlEmpty(next.content_ar) && tpl.content_structure_ar) next.content_ar = tpl.content_structure_ar;
      if (isEmpty(next.seo_title_en) && tpl.suggested_seo_title_pattern_en) next.seo_title_en = tpl.suggested_seo_title_pattern_en;
      if (isEmpty(next.seo_title_ar) && tpl.suggested_seo_title_pattern_ar) next.seo_title_ar = tpl.suggested_seo_title_pattern_ar;
      if (isEmpty(next.seo_description_en) && tpl.suggested_seo_description_pattern_en) next.seo_description_en = tpl.suggested_seo_description_pattern_en;
      if (isEmpty(next.seo_description_ar) && tpl.suggested_seo_description_pattern_ar) next.seo_description_ar = tpl.suggested_seo_description_pattern_ar;
      if (isEmpty(next.category) && tpl.category) next.category = tpl.category;
      if (isEmpty(next.title_en) === false && !slugTouched && isEmpty(next.slug)) {
        next.slug = slugify(next.title_en);
      }
      return next;
    });
    setSelectedTemplateId(tplId);
    dirtyRef.current = true;
    setSaveState((s) => ({ status: "dirty", at: s.at }));
    scheduleAutosave();
  };

  const saveIndicator = useMemo(() => {
    if (saveState.status === "saving") return "Saving…";
    if (saveState.status === "dirty") return "Unsaved changes";
    if (saveState.status === "saved" && saveState.at) {
      const t = saveState.at;
      const pad = (n) => String(n).padStart(2, "0");
      return `Saved at ${pad(t.getHours())}:${pad(t.getMinutes())}`;
    }
    return "";
  }, [saveState]);

  if (!allowed) return <AccessDenied />;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <p className="text-sm text-white/40">Loading editor…</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6 gap-4">
        <Link to="/admin/blog" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
        <div className="text-xs text-white/50">{saveIndicator}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: editor */}
        <div className="lg:col-span-2">
          {!id && templates.length > 0 && (
            <div className="mb-4 bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
              <label className="text-xs text-white/60 whitespace-nowrap">Start from template</label>
              <Select value={selectedTemplateId || "__blank__"} onValueChange={(v) => applyTemplate(v === "__blank__" ? "" : v)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__blank__">Blank post</SelectItem>
                  {templates.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name_en}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <Tabs defaultValue="en">
            <TabsList className="bg-white/5 border border-white/10">
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ar">العربية</TabsTrigger>
            </TabsList>
            <TabsContent value="en" className="mt-4">
              <BlogLanguageEditor
                lang="en"
                title={form.title_en}
                slug={form.slug}
                excerpt={form.excerpt_en}
                content={form.content_en}
                onTitleChange={(v) => setField("title_en", v)}
                onSlugChange={setSlug}
                onExcerptChange={(v) => setField("excerpt_en", v)}
                onContentChange={(v) => setField("content_en", v)}
                errors={errors}
                showSlug
              />
            </TabsContent>
            <TabsContent value="ar" className="mt-4">
              <BlogLanguageEditor
                lang="ar"
                title={form.title_ar}
                slug={form.slug}
                excerpt={form.excerpt_ar}
                content={form.content_ar}
                onTitleChange={(v) => setField("title_ar", v)}
                onSlugChange={setSlug}
                onExcerptChange={(v) => setField("excerpt_ar", v)}
                onContentChange={(v) => setField("content_ar", v)}
                errors={errors}
                showSlug={false}
              />
            </TabsContent>
          </Tabs>

          {(errors.title || errors.content) && (
            <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">
              {errors.title && <p>{errors.title}</p>}
              {errors.content && <p>{errors.content}</p>}
            </div>
          )}
        </div>

        {/* Right: actions + sidebar */}
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
            <Button onClick={() => performAction("draft")} disabled={!!actionLoading} variant="outline"
              className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 gap-2">
              {actionLoading === "draft" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Draft
            </Button>
            <Button onClick={() => performAction("schedule")} disabled={!!actionLoading} variant="outline"
              className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 gap-2">
              {actionLoading === "schedule" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CalendarClock className="w-4 h-4" />}
              Schedule
            </Button>
            <Button onClick={() => performAction("publish")} disabled={!!actionLoading} className="w-full gap-2">
              {actionLoading === "publish" ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
              Publish
            </Button>
            <Button onClick={() => performAction("archive")} disabled={!!actionLoading} variant="outline"
              className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 gap-2">
              {actionLoading === "archive" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Archive className="w-4 h-4" />}
              Archive
            </Button>
            <Button onClick={handlePreview} disabled={!!actionLoading} variant="outline"
              className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 gap-2">
              {actionLoading === "preview" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
              Preview
            </Button>
            {errors.schedule && <p className="text-xs text-destructive">{errors.schedule}</p>}
          </div>

          <BlogEditorSidebar
            form={form}
            setField={setField}
            users={users}
            errors={errors}
          />
        </div>
      </div>
    </div>
  );
}