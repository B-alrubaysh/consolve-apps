import { AREA_ICONS } from "./auditIcons";

// Animated "management system" visual: 8 connected nodes (one per assessment
// area). Lines draw in one by one, a soft scanning ring sweeps around, and a
// few nodes briefly turn coral as "gaps" before settling. Loops gently.
const N = 8;
const R = 37; // node radius in % of the box
const GAPS = { 1: 0, 4: 1.6, 6: 3.2 }; // node index -> extra delay (s)
const pt = (i) => {
  const a = (-90 + i * (360 / N)) * (Math.PI / 180);
  return { x: 50 + R * Math.cos(a), y: 50 + R * Math.sin(a) };
};

const css = `
.au-net-line { stroke-dasharray: 1; stroke-dashoffset: 1; animation: auDraw 12s ease-in-out infinite; }
@keyframes auDraw { 0% { stroke-dashoffset: 1; } 7%, 90% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: 1; } }
.au-net-scan { transform-origin: 50px 50px; animation: auSpin 7s linear infinite; }
@keyframes auSpin { to { transform: rotate(360deg); } }
.au-net-node { animation: auNodeIn .6s cubic-bezier(.22,1,.36,1) both; }
@keyframes auNodeIn { from { opacity: 0; transform: translate(-50%,-50%) scale(.6); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
.au-net-gap { animation: auGap 12s ease-in-out infinite; }
@keyframes auGap {
  0%, 38%, 62%, 100% { background: #fff; color: #0D2528; box-shadow: 0 6px 18px -8px rgba(13,37,40,.25); }
  44%, 55% { background: #E87B59; color: #fff; box-shadow: 0 0 0 6px rgba(232,123,89,.18); }
}
`;

export default function SystemNetwork() {
  const pts = Array.from({ length: N }, (_, i) => pt(i));
  return (
    <div dir="ltr" aria-hidden="true" className="au-anim relative mx-auto w-[min(76vw,320px)] sm:w-[340px] aspect-square">
      <style>{css}</style>
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible">
        <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(13,37,40,0.08)" strokeWidth="0.4" />
        <circle className="au-net-scan" cx="50" cy="50" r={R} fill="none" stroke="#E87B59" strokeOpacity="0.35"
          strokeWidth="5" strokeLinecap="round" pathLength="100" strokeDasharray="9 91" />
        {pts.map((p, i) => (
          <line key={`s${i}`} className="au-net-line" pathLength="1" x1="50" y1="50" x2={p.x} y2={p.y}
            stroke="rgba(13,37,40,0.28)" strokeWidth="0.5" style={{ animationDelay: `${i * 0.22}s` }} />
        ))}
        {pts.map((p, i) => {
          const q = pts[(i + 1) % N];
          return (
            <line key={`r${i}`} className="au-net-line" pathLength="1" x1={p.x} y1={p.y} x2={q.x} y2={q.y}
              stroke="rgba(232,123,89,0.45)" strokeWidth="0.5" style={{ animationDelay: `${1.8 + i * 0.18}s` }} />
          );
        })}
      </svg>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0D2528] flex items-center justify-center shadow-lg">
        <span className="w-3 h-3 rounded-full bg-[#E87B59]" />
      </div>
      {pts.map((p, i) => {
        const Icon = AREA_ICONS[i];
        const gap = GAPS[i];
        return (
          <div key={i} className="au-net-node absolute" style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%,-50%)", animationDelay: `${i * 0.08}s` }}>
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl border border-gray-100 bg-white text-[#0D2528] flex items-center justify-center shadow-[0_6px_18px_-8px_rgba(13,37,40,.25)] ${gap !== undefined ? "au-net-gap" : ""}`}
              style={gap !== undefined ? { animationDelay: `${gap}s` } : undefined}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}