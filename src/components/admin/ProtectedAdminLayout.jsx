import { useEffect, useState, createContext, useContext } from "react";
import { Outlet, Navigate, Link, useLocation } from "react-router-dom";
import { Loader2, LayoutDashboard, FileText, Users, Briefcase, Inbox, Settings, BookOpen, FilePlus2, LogOut } from "lucide-react";
import { base44 } from "@/api/base44Admin";
import { getAdminUser } from "@/lib/getAdminUser";
import { useLanguage } from "../../lib/useLanguage";
import { ALL_ADMIN_ROLES, canSeeNavItem } from "../../lib/rbac";

const NAV = [
  { key: "dashboard", to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "blog", to: "/admin/blog", label: "Blog", icon: BookOpen },
  { key: "templates", to: "/admin/blog/templates", label: "Templates", icon: FilePlus2 },
  { key: "clients", to: "/admin/clients", label: "Clients", icon: Users },
  { key: "careers", to: "/admin/careers", label: "Careers", icon: Briefcase },
  { key: "submissions", to: "/admin/submissions", label: "Submissions", icon: Inbox },
  { key: "assessments", to: "/admin/assessments", label: "Assessments", icon: FileText },
  { key: "users", to: "/admin/users", label: "Users", icon: Users },
  { key: "settings", to: "/admin/settings", label: "Settings", icon: Settings },
];

// Context exposes the resolved admin user (User entity record) to admin pages.
const AdminUserContext = createContext(null);
export const useAdminUser = () => useContext(AdminUserContext);

function CenteredSpinner({ text }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-secondary text-white">
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
      <p className="text-sm text-white/60">{text}</p>
    </div>
  );
}

function StatusScreen({ title, message }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-secondary text-white">
      <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
        <h1 className="text-2xl font-bold mb-3">{title}</h1>
        <p className="text-white/60 text-sm mb-6">{message}</p>
        <Link to="/" className="inline-block text-xs font-semibold uppercase tracking-widest text-primary hover:opacity-80">
          ← Back to site
        </Link>
      </div>
    </div>
  );
}

function AdminSidebar({ user, onLogout }) {
  const location = useLocation();
  const visibleItems = NAV.filter((item) => canSeeNavItem(user.role, item.key));

  return (
    <aside className="w-64 shrink-0 border-r border-white/10 bg-secondary text-white min-h-screen flex flex-col">
      <div className="px-6 py-6 border-b border-white/10">
        <Link to="/" className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Consolve Admin
        </Link>
        <p className="text-xs text-white/40 mt-2 truncate">{user?.email}</p>
        <p className="text-[10px] uppercase tracking-widest text-primary/70 mt-1">{user.role}</p>
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.to || (item.to !== "/admin" && location.pathname.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:bg-white/5 hover:text-white"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );
}

export default function ProtectedAdminLayout() {
  const { lang, isAr } = useLanguage();
  const [state, setState] = useState({ status: "loading", user: null });

  useEffect(() => {
    document.documentElement.dir = isAr ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang, isAr]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Step 1 — apply any pending admin invite for this email (best-effort),
      // BEFORE reading the user record so a freshly accepted invite is reflected.
      try { await base44.functions.invoke("claimAdminInvite"); } catch { /* non-fatal */ }

      // Step 2 — fetch the current admin user via same-origin endpoint.
      // We do NOT use base44.auth.me() here because it resolves against the
      // platform host and returns 401 for custom-domain sessions.
      const record = await getAdminUser();

      if (cancelled) return;

      if (!record) {
        setState({ status: "unauthenticated", user: null });
        return;
      }

      // Invited users with a valid token go through the invite flow.
      if (record.status === "invited" && record.invite_token) {
        setState({ status: "invited", user: record });
        return;
      }

      if (record.status === "suspended") {
        setState({ status: "suspended", user: record });
        return;
      }

      if (record.status !== "active" || !ALL_ADMIN_ROLES.includes(record.role)) {
        setState({ status: "denied", user: record });
        return;
      }

      // Update last_login_at (best-effort, don't block).
      base44.entities.User.update(record.id, { last_login_at: new Date().toISOString() }).catch(() => {});

      setState({ status: "ok", user: record });
    })();
    return () => { cancelled = true; };
  }, []);

  const handleLogout = () => {
    base44.auth.logout(window.location.origin + "/admin/login");
  };

  if (state.status === "loading") return <CenteredSpinner text="Verifying admin access…" />;

  if (state.status === "unauthenticated") return <Navigate to="/admin/login" replace />;

  if (state.status === "invited") {
    return <Navigate to={`/admin/invite/${state.user.invite_token}`} replace />;
  }

  if (state.status === "suspended") {
    return <StatusScreen title="Account Suspended" message="Your account has been suspended. Please contact the administrator." />;
  }

  if (state.status === "denied") {
    return <StatusScreen title="Access Denied" message="You do not have permission to access the admin area." />;
  }

  return (
    <AdminUserContext.Provider value={state.user}>
      <div className="min-h-screen bg-secondary text-white flex">
        <AdminSidebar user={state.user} onLogout={handleLogout} />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </AdminUserContext.Provider>
  );
}