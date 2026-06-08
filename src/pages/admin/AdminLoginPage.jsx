import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Admin";
import { getAdminUser } from "@/lib/getAdminUser";
import { Loader2 } from "lucide-react";
import { useLanguage } from "../../lib/useLanguage";

export default function AdminLoginPage() {
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const { lang, dir, isAr } = useLanguage();

  useEffect(() => {
    document.documentElement.dir = isAr ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang, isAr]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Apply any pending admin invite (best-effort) before reading the record.
      try { await base44.functions.invoke("claimAdminInvite"); } catch { /* non-fatal */ }

      const record = await getAdminUser();
      if (cancelled) return;

      if (record) {
        if (record.status === "invited" && record.invite_token) {
          window.location.href = `/admin/invite/${record.invite_token}`;
          return;
        }
        if (record.status === "active" && ["owner", "admin", "writer", "hr"].includes(record.role)) {
          window.location.href = "/admin/dashboard";
          return;
        }
        // Authenticated but no admin access — show inline error.
        setError(isAr ? "هذا الحساب لا يملك صلاحية الوصول إلى لوحة الإدارة." : "This account does not have admin access.");
      }
      // No record → not authenticated, stay on this page.
      if (!cancelled) setChecking(false);
    })();
    return () => { cancelled = true; };
  }, [isAr]);

  const handleLogin = () => {
    base44.auth.redirectToLogin(window.location.origin + "/admin/login");
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary text-white" dir={dir}>
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary text-white px-6 font-inter" dir={dir}>
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
          {isAr ? "إدارة كونسولف" : "Consolve Admin"}
        </p>
        <h1 className="text-2xl font-bold mb-2 text-card-foreground">
          {isAr ? "تسجيل الدخول" : "Sign In"}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          {isAr
            ? "سجّل الدخول بحساب مسؤول معتمد للمتابعة."
            : "Sign in with an authorized admin account to continue."}
        </p>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-primary text-primary-foreground text-sm font-semibold py-3 rounded-full hover:opacity-90 transition-opacity"
        >
          {isAr ? "متابعة لتسجيل الدخول" : "Continue to Login"}
        </button>

        <p className="text-xs text-muted-foreground mt-6 leading-relaxed">
          {isAr
            ? "تتم المصادقة عبر منصة Base44 الآمنة."
            : "Authentication is handled securely by the Base44 platform."}
        </p>
      </div>
    </div>
  );
}