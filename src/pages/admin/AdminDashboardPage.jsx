import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  BookOpen, FileEdit, CalendarClock, Users, Briefcase, Inbox, FileText, ArrowRight,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAdminUser } from "../../components/admin/ProtectedAdminLayout";
import { requireRole, ROLES } from "../../lib/rbac";
import AccessDenied from "../../components/admin/AccessDenied";

const ROLE_LABEL = {
  [ROLES.OWNER]: "Owner",
  [ROLES.ADMIN]: "Admin",
  [ROLES.WRITER]: "Writer",
  [ROLES.HR]: "HR",
};

function MetricCard({ icon: Icon, label, value, to }) {
  return (
    <Link
      to={to}
      className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors block relative"
    >
      <Icon className="w-5 h-5 text-white/30 absolute top-4 right-4" />
      <div className="text-3xl font-bold text-white">{value}</div>
      <p className="text-xs text-white/40 uppercase tracking-widest mt-2">{label}</p>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse">
      <div className="h-8 w-16 bg-white/10 rounded mb-3" />
      <div className="h-3 w-24 bg-white/10 rounded" />
    </div>
  );
}

const TYPE_BADGE = {
  Blog: "bg-blue-500/15 text-blue-400",
  Application: "bg-yellow-500/15 text-yellow-400",
  Assessment: "bg-green-500/15 text-green-400",
};

function relativeTime(ts) {
  const d = new Date(ts);
  if (isNaN(d.getTime())) return "";
  return formatDistanceToNow(d, { addSuffix: true });
}

export default function AdminDashboardPage() {
  const me = useAdminUser();
  const allowed = requireRole(me, ROLES.OWNER, ROLES.ADMIN, ROLES.WRITER, ROLES.HR);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    blogs: [], clients: [], jobs: [], applications: [], assessments: [],
  });

  useEffect(() => {
    if (!allowed) return;
    let cancelled = false;
    (async () => {
      const [blogs, clients, jobs, applications, assessments] = await Promise.all([
        base44.entities.BlogPost.list("-created_date", 500).catch(() => []),
        base44.entities.Client.list("display_order", 500).catch(() => []),
        base44.entities.JobPost.list("-created_date", 500).catch(() => []),
        base44.entities.JobApplication.list("-created_date", 500).catch(() => []),
        base44.entities.Assessment.list("-created_date", 500).catch(() => []),
      ]);
      if (cancelled) return;
      setData({
        blogs: blogs || [],
        clients: clients || [],
        jobs: jobs || [],
        applications: applications || [],
        assessments: assessments || [],
      });
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [allowed]);

  const metrics = useMemo(() => {
    const { blogs, clients, jobs, applications, assessments } = data;
    return {
      publishedBlogs: blogs.filter((b) => b.status === "published").length,
      draftBlogs: blogs.filter((b) => b.status === "draft").length,
      scheduledBlogs: blogs.filter((b) => b.status === "scheduled").length,
      activeClients: clients.filter((c) => c.is_active === true).length,
      openJobs: jobs.filter((j) => j.status === "open").length,
      newApplications: applications.filter((a) => (a.status || "new") === "new").length,
      newAssessments: assessments.filter((a) => (a.status || "New") === "New").length,
    };
  }, [data]);

  const recent = useMemo(() => {
    const { blogs, applications, assessments } = data;
    return [
      ...blogs.map((b) => ({
        ts: b.created_date,
        type: "Blog",
        label: b.title_en || b.title_ar || b.slug || "Untitled",
        link: `/admin/blog/${b.id}/edit`,
      })),
      ...applications.map((a) => ({
        ts: a.created_date,
        type: "Application",
        label: `${a.full_name || "Unknown"} — ${a.email || ""}`,
        link: `/admin/submissions`,
      })),
      ...assessments.map((a) => ({
        ts: a.created_date,
        type: "Assessment",
        label: a.company_name || "Unknown company",
        link: `/admin/assessments`,
      })),
    ]
      .filter((r) => r.ts)
      .sort((a, b) => new Date(b.ts) - new Date(a.ts))
      .slice(0, 10);
  }, [data]);

  if (!allowed) return <AccessDenied />;

  const role = me?.role;
  const isOwnerAdmin = role === ROLES.OWNER || role === ROLES.ADMIN;
  const isWriter = role === ROLES.WRITER;
  const isHR = role === ROLES.HR;

  const ALL_CARDS = [
    { key: "publishedBlogs", label: "Published Blogs", icon: BookOpen, value: metrics.publishedBlogs, to: "/admin/blog?status=published", visible: isOwnerAdmin || isWriter },
    { key: "draftBlogs", label: "Draft Blogs", icon: FileEdit, value: metrics.draftBlogs, to: "/admin/blog?status=draft", visible: isOwnerAdmin || isWriter },
    { key: "scheduledBlogs", label: "Scheduled Blogs", icon: CalendarClock, value: metrics.scheduledBlogs, to: "/admin/blog?status=scheduled", visible: isOwnerAdmin || isWriter },
    { key: "activeClients", label: "Active Clients", icon: Users, value: metrics.activeClients, to: "/admin/clients", visible: isOwnerAdmin },
    { key: "openJobs", label: "Open Job Posts", icon: Briefcase, value: metrics.openJobs, to: "/admin/careers", visible: isOwnerAdmin || isHR },
    { key: "newApplications", label: "New HR Submissions", icon: Inbox, value: metrics.newApplications, to: "/admin/submissions", visible: isOwnerAdmin || isHR },
    { key: "newAssessments", label: "New Assessments", icon: FileText, value: metrics.newAssessments, to: "/admin/assessments", visible: isOwnerAdmin },
  ];

  const visibleCards = ALL_CARDS.filter((c) => c.visible);

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-white/50 mt-1">Admin overview</p>
        </div>
        {role && (
          <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-widest bg-primary/15 text-primary">
            {ROLE_LABEL[role] || role}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: visibleCards.length || 4 }).map((_, i) => <SkeletonCard key={i} />)
          : visibleCards.map((c) => (
              <MetricCard key={c.key} icon={c.icon} label={c.label} value={c.value} to={c.to} />
            ))}
      </div>

      {isOwnerAdmin && (
        <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-white/60 mb-4">Recent Activity</h2>

          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-white/5 rounded animate-pulse" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <p className="text-sm text-white/40">No recent activity yet</p>
          ) : (
            <div className="divide-y divide-white/5">
              {recent.map((r, i) => (
                <Link
                  key={i}
                  to={r.link}
                  className="flex items-center gap-4 py-3 hover:bg-white/5 transition-colors px-2 -mx-2 rounded-lg"
                >
                  <span className="text-xs text-white/40 w-32 shrink-0">{relativeTime(r.ts)}</span>
                  <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-widest ${TYPE_BADGE[r.type] || "bg-white/10 text-white/60"} shrink-0`}>
                    {r.type}
                  </span>
                  <span className="text-sm text-white/80 truncate flex-1">{r.label}</span>
                  <ArrowRight className="w-4 h-4 text-white/30 shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}