import { useLanguage } from "@/lib/useLanguage";
import { AUDIT_COPY } from "./auditCopy";
import { useInView, PING } from "./auditUi";

// Illustrative report: 8-axis radar that draws itself + growing priority bars.
// Shapes only — no real percentages are shown.
const SHAPE = [0.78, 0.55, 0.7, 0.42, 0.62, 0.48, 0.74, 0.58];
const BARS = ["88%", "66%", "46%"];
const ax = (i, r) => {
  const a = (-90 + i * 45) * (Math.PI / 180);
  return [100 + r * Math.cos(a), 100 + r * Math.sin(a)];
};

export default function ReportCard() {
  const { lang } = useLanguage();
  const C = AUDIT_COPY[lang];
  const [ref, inView] = useInView(0.3);
  const poly = SHAPE.map((v, i) => ax(i, v * 80).join(",")).join(" ");

  return (
    <div ref={ref} className="au-anim bg-white rounded-[24px] border border-gray-100 shadow-[0_20px_60px_-30px_rgba(13,37,40,0.35)] p-5 sm:p-7">
      <div className="flex items-center justify-between gap-3 mb-5">
        <p className={`${PING} text-sm text-[#0D2528]`}>{C.report_title}</p>
        <span className="text-[11px] font-semibold text-[#718487] bg-[#F7F7F5] px-2.5 py-1 rounded-full shrink-0">{C.report_label}</span>
      </div>
      <p className="text-xs text-[#718487] mb-2">{C.report_radar}</p>
      <svg viewBox="0 0 200 200" className="w-full max-w-[260px] mx-auto h-auto" aria-hidden="true">
        {[0.25, 0.5, 0.75, 1].map((s) => (
          <polygon key={s} points={Array.from({ length: 8 }, (_, i) => ax(i, s * 80).join(",")).join(" ")} fill="none" stroke="#E7E9E8" strokeWidth="0.8" />
        ))}
        {Array.from({ length: 8 }, (_, i) => {
          const [x, y] = ax(i, 80);
          return <line key={i} x1="100" y1="100" x2={x} y2={y} stroke="#E7E9E8" strokeWidth="0.8" />;
        })}
        <polygon points={poly} fill="rgba(232,123,89,0.18)" stroke="#E87B59" strokeWidth="1.6" strokeLinejoin="round"
          pathLength="1" strokeDasharray="1" strokeDashoffset={inView ? 0 : 1}
          style={{ transition: "stroke-dashoffset 1.6s ease-out, fill-opacity .8s ease 1.2s", fillOpacity: inView ? 1 : 0 }} />
        {SHAPE.map((v, i) => {
          const [x, y] = ax(i, v * 80);
          return <circle key={i} cx={x} cy={y} r="2.6" fill="#E87B59" style={{ opacity: inView ? 1 : 0, transition: `opacity .4s ease ${0.4 + i * 0.12}s` }} />;
        })}
      </svg>
      <p className="text-xs text-[#718487] mt-5 mb-3">{C.report_priorities}</p>
      <div className="space-y-3">
        {C.report_priority_items.map((label, i) => (
          <div key={i}>
            <p className="text-xs text-[#3D4D4F] mb-1.5">{label}</p>
            <div className="h-2 rounded-full bg-[#F7F7F5] overflow-hidden">
              <div className="h-full rounded-full bg-[#E87B59]" style={{
                width: inView ? BARS[i] : "0%", opacity: 1 - i * 0.22,
                transition: `width 1.1s cubic-bezier(.22,1,.36,1) ${0.6 + i * 0.2}s`,
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}