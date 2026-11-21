import { CheckCircle2, TriangleAlert, Target, Users, BarChart3, Settings } from "lucide-react";

const FOCUS_ICONS = [Target, Users, BarChart3, Settings];

function Gauge({ label, value, tone }) {
  const stroke = tone === "risk" ? "hsl(0 72% 51%)" : "hsl(var(--primary))";
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-background p-3">
      <p className="text-[11px] font-semibold text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-foreground">{value}</p>
      <svg viewBox="0 0 64 36" className="w-16 h-9">
        <path d="M6 32 A26 26 0 0 1 58 32" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" strokeLinecap="round" />
        <path d="M6 32 A26 26 0 0 1 58 32" fill="none" stroke={stroke} strokeWidth="6" strokeLinecap="round"
          strokeDasharray="82" strokeDashoffset={tone === "risk" ? 20 : 38} />
        {tone === "risk" && <TriangleAlert className="text-destructive" x="26" y="14" width="12" height="12" stroke="hsl(0 72% 51%)" />}
      </svg>
    </div>
  );
}

function SkeletonLines({ count = 3 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-2.5 rounded-full bg-muted" style={{ width: `${100 - i * 12}%` }} />
      ))}
    </div>
  );
}

export default function ReportPreviewCard({ c }) {
  const barHeights = [14, 22, 10, 26, 18, 30];
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <p className="text-center font-bold text-foreground mb-5">{c.preview_title}</p>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Gauge label={c.maturity} value={c.maturity_v} />
        <Gauge label={c.risk} value={c.risk_v} tone="risk" />
        <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-background p-3">
          <p className="text-[11px] font-semibold text-muted-foreground">{c.axes}</p>
          <div className="flex items-end gap-1 h-12 mt-auto">
            {barHeights.map((h, i) => (
              <div key={i} className={`w-2 rounded-sm ${i % 2 ? "bg-primary" : "bg-secondary/70"}`} style={{ height: h }} />
            ))}
          </div>
        </div>
      </div>
      <div className="mb-6">
        <p className="text-sm font-semibold text-foreground mb-3">{c.summary}</p>
        <SkeletonLines count={3} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">{c.services}</p>
          <ul className="space-y-2">
            {c.service_items.map((s) => (
              <li key={s} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />{s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">{c.problems}</p>
          <SkeletonLines count={3} />
        </div>
      </div>
      <div className="mt-6 pt-5 border-t border-border">
        <p className="text-sm font-semibold text-foreground mb-4 text-center">{c.focus}</p>
        <div className="grid grid-cols-4 gap-3">
          {FOCUS_ICONS.map((Icon, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Icon className="w-5 h-5 text-muted-foreground" />
              <div className="h-2 w-full rounded-full bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}