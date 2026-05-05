import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../../lib/useLanguage";

export default function AdminInvitePage() {
  const { token } = useParams();
  const { lang, dir, isAr } = useLanguage();

  const [state, setState] = useState({ status: "loading", message: "" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Step 1: User must be logged in via Base44 first.
      let me = null;
      try {
        me = await base44.auth.me();
      } catch {
        me = null;
      }
      if (cancelled) return;

      if (!me) {
        // Send them to login, then back here.
        base44.auth.redirectToLogin(window.location.href);
        return;
      }

      // Step 2: Validate the token and accept the invite.
      try {
        const res = await base44.functions.invoke("acceptInvite", { token });
        if (res.data?.success) {
          if (!cancelled) setState({ status: "success", message: "" });
        } else {
          throw new Error(res.data?.error || "Failed to accept invite.");
        }
      } catch (err) {
        const errMsg = err?.response?.data?.error || err?.message || "Invalid invite.";
        if (!cancelled) {
          if (errMsg.toLowerCase().includes("expired")) {
            setState({ status: "expired", message: errMsg });
          } else {
            setState({ status: "error", message: errMsg });
          }
        }
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  const tx = isAr
    ? {
        loading: "جارٍ التحقق من الدعوة...",
        successTitle: "تم قبول الدعوة!",
        successMsg: "تم تفعيل حسابك. يمكنك الآن الوصول إلى لوحة الإدارة.",
        goAdmin: "الذهاب إلى لوحة الإدارة",
        expiredTitle: "انتهت صلاحية الدعوة",
        errorTitle: "دعوة غير صالحة",
        backHome: "العودة إلى الرئيسية",
      }
    : {
        loading: "Verifying invite…",
        successTitle: "Invite accepted!",
        successMsg: "Your account is now active. You can access the admin panel.",
        goAdmin: "Go to Admin Dashboard",
        expiredTitle: "Invite Expired",
        errorTitle: "Invalid Invite",
        backHome: "Back to home",
      };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-20" dir={dir}>
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center">
        {state.status === "loading" && (
          <>
            <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">{tx.loading}</p>
          </>
        )}

        {state.status === "success" && (
          <>
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
              <CheckCircle2 className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2 text-card-foreground">{tx.successTitle}</h1>
            <p className="text-sm text-muted-foreground mb-6">{tx.successMsg}</p>
            <Link
              to="/admin/dashboard"
              className="inline-block bg-primary text-primary-foreground text-sm font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              {tx.goAdmin}
            </Link>
          </>
        )}

        {(state.status === "expired" || state.status === "error") && (
          <>
            <h1 className="text-2xl font-bold mb-2 text-destructive">
              {state.status === "expired" ? tx.expiredTitle : tx.errorTitle}
            </h1>
            <p className="text-sm text-muted-foreground mb-6">{state.message}</p>
            <Link to="/" className="text-xs font-semibold uppercase tracking-widest text-primary hover:opacity-80">
              ← {tx.backHome}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}