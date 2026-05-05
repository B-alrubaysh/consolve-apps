import { useLocation } from "react-router-dom";

export default function AdminPlaceholder({ title }) {
  const location = useLocation();
  const heading = title || location.pathname.replace("/admin/", "").replace("/", " · ") || "Admin";
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold capitalize mb-2">{heading}</h1>
      <p className="text-white/50 text-sm">This admin section is not implemented yet.</p>
    </div>
  );
}