import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Loader2 } from "lucide-react";

const BRIDGE = `
(function(){
  function handle(form){
    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      try {
        var fd = new FormData(form);
        var data = {};
        fd.forEach(function(value, key){ data[key] = typeof value === 'string' ? value : ''; });
        window.parent.postMessage({ type: 'consolve-lead', data: data }, '*');
        var success = form.getAttribute('data-success') || "Thank you \\u2014 we'll be in touch.";
        form.innerHTML = '<div class="consolve-lead-success">' + success + '</div>';
      } catch(e) { /* swallow */ }
    });
  }
  function init(){
    var forms = document.querySelectorAll('form[data-consolve-lead]');
    for (var i=0; i<forms.length; i++) handle(forms[i]);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
`;

function buildSrcDoc({ html_content = "", css_content = "", js_content = "" }) {
  return (
    '<!DOCTYPE html><html><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    "<style>" + (css_content || "") + "</style>" +
    "</head><body>" + (html_content || "") +
    "<scr" + "ipt>" + BRIDGE + (js_content || "") + "</scr" + "ipt>" +
    "</body></html>"
  );
}

export default function LandingPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const rows = await base44.entities.LandingPage.filter({ slug });
        if (cancelled) return;
        const found = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
        setPage(found);
      } catch {
        if (!cancelled) setPage(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  // Tab title
  useEffect(() => {
    if (!page || !page.is_published) return;
    const previous = document.title;
    document.title = page.seo_title || page.name || previous;
    return () => { document.title = previous; };
  }, [page]);

  // Lead bridge listener
  useEffect(() => {
    if (!page || !page.is_published) return;
    const onMessage = async (ev) => {
      if (!ev || !ev.data || ev.data.type !== "consolve-lead") return;
      const d = (ev.data.data && typeof ev.data.data === "object") ? ev.data.data : {};
      try {
        await base44.entities.LandingPageLead.create({
          page_slug: slug || "",
          page_name: page.name || "",
          name: d.name || "",
          email: d.email || "",
          phone: d.phone || "",
          company: d.company || "",
          message: d.message || "",
          raw_data: JSON.stringify(d),
          status: "New",
        });
      } catch {
        /* never break the page */
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [page, slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!page || !page.is_published) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-background">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-3">Page not found</h1>
          <p className="text-muted-foreground text-sm mb-6">
            The page you're looking for doesn't exist or is no longer available.
          </p>
          <Link to="/" className="inline-block text-xs font-semibold uppercase tracking-widest text-primary hover:opacity-80">
            ← Back to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <iframe
      title={page.seo_title || page.name || "Landing page"}
      srcDoc={buildSrcDoc(page)}
      sandbox="allow-scripts allow-popups allow-forms"
      style={{ width: "100%", height: "100vh", border: 0, display: "block" }}
    />
  );
}