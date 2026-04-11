import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2 } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import { getAdminSession, clearAdminSession } from "@/lib/adminAuth";

export default function AdminLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    verifySession();
  }, []);

  const verifySession = async () => {
    const session = getAdminSession();
    if (!session?.user?.id) {
      clearAdminSession();
      navigate("/csaccess");
      return;
    }

    try {
      const res = await base44.functions.invoke("adminAuth", {
        action: "verify_session",
        userId: session.user.id,
      });
      setUser(res.data.user);
    } catch {
      clearAdminSession();
      navigate("/csaccess");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar user={user} />
      <div className="md:ml-60 min-h-screen transition-all duration-300">
        <main className="p-6 md:p-8">
          <Outlet context={{ adminUser: user }} />
        </main>
      </div>
    </div>
  );
}