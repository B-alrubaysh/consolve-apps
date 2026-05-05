import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const user = await base44.auth.me();
        if (cancelled) return;
        if (user && user.role === "admin") {
          window.location.href = "/admin/dashboard";
          return;
        }
      } catch {
        // not authenticated — stay on this page
      }
      if (!cancelled) setChecking(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const handleLogin = () => {
    base44.auth.redirectToLogin(window.location.origin + "/admin/dashboard");
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary text-white">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary text-white px-6">
      <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Consolve Admin</p>
        <h1 className="text-2xl font-bold mb-2">Admin Login</h1>
        <p className="text-sm text-white/60 mb-8">
          Sign in with an authorized admin account to continue.
        </p>
        <button
          onClick={handleLogin}
          className="w-full bg-primary text-primary-foreground text-sm font-semibold py-3 rounded-full hover:opacity-90 transition-opacity"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}