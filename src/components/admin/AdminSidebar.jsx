import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users2,
  Briefcase,
  MessageSquare,
  ScrollText,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { canAccessModule, clearAdminSession, ROLE_LABELS } from "../../lib/adminAuth";

const NAV_ITEMS = [
  { to: "/csaccess/dashboard", icon: LayoutDashboard, label: "Dashboard", module: "dashboard" },
  { to: "/csaccess/cms", icon: FileText, label: "CMS", module: "cms" },
  { to: "/csaccess/clients", icon: Users2, label: "Our Clients", module: "clients" },
  { to: "/csaccess/forms", icon: MessageSquare, label: "Form Results", module: "forms" },
  { to: "/csaccess/careers-admin", icon: Briefcase, label: "Careers", module: "careers" },
  { to: "/csaccess/logs", icon: ScrollText, label: "Logs", module: "logs" },
  { to: "/csaccess/users", icon: Users2, label: "Users", module: "users" },
  { to: "/csaccess/settings", icon: Settings, label: "Settings", module: "settings" },
];

export default function AdminSidebar({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    clearAdminSession();
    navigate("/csaccess");
  };

  const visibleItems = NAV_ITEMS.filter((item) => canAccessModule(user?.role, item.module));

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo area */}
      <div className="px-4 py-5 border-b border-white/10 flex items-center justify-between">
        {!collapsed && (
          <img
            src="https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/4c25434d1_Consolve_identity_compressed_HQai.png"
            alt="Consolve"
            className="h-7 w-auto"
            style={{ mixBlendMode: "screen" }}
          />
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:block text-white/40 hover:text-white transition-colors"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* User info */}
      {!collapsed && (
        <div className="px-4 py-4 border-b border-white/10">
          <p className="text-sm font-semibold text-white truncate">{user?.full_name}</p>
          <p className="text-xs text-white/40 truncate">{user?.email}</p>
          <span className="inline-block mt-1.5 text-[10px] uppercase tracking-widest font-semibold text-primary bg-primary/15 px-2 py-0.5 rounded-full">
            {ROLE_LABELS[user?.role] || user?.role}
          </span>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + "/");
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 py-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all w-full ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="w-4.5 h-4.5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-secondary text-white p-2 rounded-lg shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-secondary z-40 transition-all duration-300 border-r border-white/10 ${
          collapsed ? "w-16" : "w-60"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}