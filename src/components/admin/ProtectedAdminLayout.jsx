import { useEffect, useState } from "react";
import { Outlet, Navigate, Link, useLocation } from "react-router-dom";
import { Loader2, LayoutDashboard, FileText, Users, Briefcase, Inbox, Settings, BookOpen, LogOut } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "../../lib/useLanguage";

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/assessments", label: "Assessments", icon: FileText },
  { to: "/admin/clients", label: "Clients", icon: Users },
  { to: "/admin/blog", label: "Blog", icon: BookOpen },
  { to: "/admin/careers", label: "Careers", icon: Briefcase },
  { to: "/admin/submissions", label: "Submissions", icon: Inbox },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

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
  return (
    <aside className="w-64 shrink-0 border-r border-white/10 bg-secondary text-white min-h-screen flex flex-col">
      <div className="px-6 py-6 border-b border-white/10">
        <Link to="/" className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Consolve Admin
        </Link>
        <p className="text-xs text-white/40 mt-2 truncate">{user?.email}</p>
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = location.pathname.startsWith(item.to);
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
    // Preserve language settings — admin can be RTL or LTR.
    document.documentElement.dir = isAr ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang, isAr]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const user = await base44.auth.me();
        if (cancelled) return;
        if (!user) {
          setState({ status: "unauthenticated", user: null });
          return;
        }
        if (user.is_suspended) {
          setState({ status: "suspended", user });
          return;
        }
        if (user.role !== "admin") {
          setState({ status: "denied", user });
          return;
        }
        setState({ status: "ok", user });
      } catch {
        if (!cancelled) setState({ status: "unauthenticated", user: null });
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleLogout = () => {
    base44.auth.logout(window.location.origin + "/admin/login");
  };

  if (state.status === "loading") {
    return <CenteredSpinner text="Verifying admin access…" />;
  }

  if (state.status === "unauthenticated") {
    return <Navigate to="/admin/login" replace />;
  }

  if (state.status === "suspended") {
    return <StatusScreen title="Account Suspended" message="Your account has been suspended. Please contact the administrator." />;
  }

  if (state.status === "denied") {
    return <StatusScreen title="Access Denied" message="You do not have permission to access the admin area." />;
  }

  return (
    <div className="min-h-screen bg-secondary text-white flex">
      <AdminSidebar user={state.user} onLogout={handleLogout} />
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}