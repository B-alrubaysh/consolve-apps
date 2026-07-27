import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Admin";
import { Loader2, Plus, Layout as LayoutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminUser } from "../../components/admin/ProtectedAdminLayout";
import { requireRole, ROLES } from "../../lib/rbac";
import AccessDenied from "../../components/admin/AccessDenied";
import LandingPageRow from "../../components/admin/landing/LandingPageRow";
import NewLandingPageDialog from "../../components/admin/landing/NewLandingPageDialog";

export default function AdminLandingPagesPage() {
  const me = useAdminUser();
  const allowed = requireRole(me, ROLES.OWNER, ROLES.ADMIN);
  const navigate = useNavigate();

  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.LandingPage.list("-updated_date", 200);
    setPages(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (allowed) load();
  }, [allowed]);

  if (!allowed) return <AccessDenied />;

  const onTogglePublished = (page, value) => {
    setPages((prev) => prev.map((p) => (p.id === page.id ? { ...p, is_published: value } : p)));
  };

  const onEdit = (page) => navigate(`/admin/landing/${page.id}`);

  const onDuplicate = async (page) => {
    await base44.entities.LandingPage.create({
      name: `${page.name} (copy)`,
      slug: `${page.slug}-copy`,
      html_content: page.html_content || "",
      css_content: page.css_content || "",
      js_content: page.js_content || "",
      seo_title: page.seo_title || "",
      seo_description: page.seo_description || "",
      og_image_url: page.og_image_url || "",
      notes: page.notes || "",
      is_published: false,
    });
    await load();
  };

  const onDelete = async (page) => {
    if (!confirm(`Delete landing page '${page.name}'? This cannot be undone.`)) return;
    await base44.entities.LandingPage.delete(page.id);
    setPages((prev) => prev.filter((p) => p.id !== page.id));
  };

  const onCreated = (created) => {
    setDialogOpen(false);
    navigate(`/admin/landing/${created.id}`);
  };

  const existingSlugs = pages.map((p) => p.slug).filter(Boolean);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Landing Pages</h1>
          <p className="text-sm text-white/40 mt-1">Build and publish standalone landing pages</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> New Landing Page
        </Button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
          <p className="text-sm text-white/40 mt-3">Loading landing pages…</p>
        </div>
      ) : pages.length === 0 ? (
        <div className="py-16 px-8 text-center bg-white/5 border border-white/10 rounded-xl">
          <LayoutIcon className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white font-semibold mb-2">No landing pages yet</p>
          <p className="text-white/40 text-sm max-w-md mx-auto mb-6">
            Create your first landing page — a standalone page with custom HTML, CSS and JavaScript
            reachable at /p/&lt;slug&gt;.
          </p>
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> New Landing Page
          </Button>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="flex items-center gap-4 px-4 py-3 text-xs uppercase tracking-widest text-white/40 bg-white/5">
            <span className="flex-1">Name</span>
            <span className="hidden md:block w-28 text-right">Updated</span>
            <span className="w-24 text-right">Status</span>
            <span className="w-48 text-right">Actions</span>
          </div>
          {pages.map((p) => (
            <LandingPageRow
              key={p.id}
              page={p}
              onTogglePublished={onTogglePublished}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      <NewLandingPageDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        existingSlugs={existingSlugs}
        onCreated={onCreated}
      />
    </div>
  );
}