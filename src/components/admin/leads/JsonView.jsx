// Readable rendering of nested JSON (generated report, raw form data).
const pretty = (k) => String(k).replace(/_/g, " ");

export default function JsonView({ value, depth = 0 }) {
  if (value === null || value === undefined || value === "") return <span className="text-white/40">-</span>;
  if (typeof value !== "object") return <span className="text-white/90 whitespace-pre-wrap break-words">{String(value)}</span>;
  if (Array.isArray(value)) {
    if (value.every((v) => typeof v !== "object")) {
      return <ul className="list-disc ps-5 space-y-1">{value.map((v, i) => <li key={i} className="text-white/90">{String(v)}</li>)}</ul>;
    }
    return <div className="space-y-3">{value.map((v, i) => <div key={i} className="rounded-lg bg-white/5 p-3"><JsonView value={v} depth={depth + 1} /></div>)}</div>;
  }
  return (
    <div className="space-y-2">
      {Object.entries(value).map(([k, v]) => (
        <div key={k}>
          <p className="text-[11px] uppercase tracking-widest text-white/40 mb-0.5">{pretty(k)}</p>
          <div className="text-sm"><JsonView value={v} depth={depth + 1} /></div>
        </div>
      ))}
    </div>
  );
}