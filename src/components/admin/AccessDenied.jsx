import { Link } from "react-router-dom";

export default function AccessDenied({ message }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
        <h1 className="text-2xl font-bold mb-3 text-white">Access Denied</h1>
        <p className="text-white/60 text-sm mb-6">
          {message || "You do not have permission to view this page."}
        </p>
        <Link to="/admin/dashboard" className="text-xs font-semibold uppercase tracking-widest text-primary hover:opacity-80">
          ← Back to dashboard
        </Link>
      </div>
    </div>
  );
}