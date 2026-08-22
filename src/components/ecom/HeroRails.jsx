import { useEffect, useRef } from "react";

// Edge fade for each rail: opaque in the middle, transparent at the edges over
// a full-logo width, so logos dissolve at the edge instead of being clipped by
// the container's hard border. 96px covers a full logo width on every viewport.
const EDGE_FADE =
  "linear-gradient(90deg, transparent 0px, #000 96px, #000 calc(100% - 96px), transparent 100%)";

// A single logo/icon badge sitting on a rail. `depth` (0..1) drives opacity and
// scale so different rails read at different distances.
export function RailBadge({ src, sizePx = 64, depth = 0.9, children }) {
  const opacity = 0.6 + depth * 0.4;
  const scale = 0.9 + depth * 0.1;
  return (
    <div
      className="hero-rail-badge rounded-[18px] flex items-center justify-center shrink-0"
      style={{ width: sizePx, height: sizePx, opacity, transform: `scale(${scale})` }}
    >
      {src ? (
        <img
          src={src}
          alt=""
          className="object-contain rounded-[12px]"
          style={{ width: sizePx * 0.56, height: sizePx * 0.56 }}
          loading="lazy"
        />
      ) : (
        children
      )}
    </div>
  );
}

// One horizontal rail: a hairline that logos travel along.
// The track holds its badge set twice and slides -50% exactly, so the loop is
// visually seamless. The badge crossing the mid-point of the rail scales up
// and lifts, then returns as it moves away.
export function HeroRail({
  children,
  duration = 40,
  reverse = false,
  delay = 0,
  copies = 4,
  heightPx = 76,
  gap = "clamp(44px, 9vw, 72px)",
  lineColor = "rgba(13,37,40,0.28)",
  inset = "1.5%",
}) {
  const items = Array.isArray(children) ? children : [children];
  const half = Array.from({ length: copies }, () => items).flat();
  const wrapRef = useRef(null);
  const trackRef = useRef(null);

  // Mid-focus effect: the badge nearest to the horizontal center of the rail
  // scales up and lifts. Positions are measured once (and on resize); each
  // frame reads a single transform per rail — no per-element layout reads.
  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const beads = Array.from(track.children);
    let centers = [];
    const measure = () => {
      centers = beads.map((b) => b.offsetLeft + b.offsetWidth / 2);
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(wrap);

    let raf = 0;
    const tick = () => {
      const w = wrap.clientWidth;
      const mid = w / 2;
      // Narrower reach on mobile — same growth ratio eats a larger share of
      // the gap between logos on small screens.
      const narrow = w < 640;
      const reach = w * (narrow ? 0.22 : 0.28);
      const grow = narrow ? 0.24 : 0.34;
      const lift = narrow ? 9 : 12;
      const x = new DOMMatrixReadOnly(getComputedStyle(track).transform).m41;
      for (let i = 0; i < beads.length; i++) {
        const d = Math.abs(centers[i] + x - mid);
        const f = d >= reach ? 0 : (1 - d / reach) ** 2;
        const bead = beads[i];
        if (f > 0.01) {
          bead.style.transform = `translateY(${(-lift * f).toFixed(2)}px) scale(${(1 + grow * f).toFixed(3)})`;
          bead.style.zIndex = f > 0.45 ? "2" : "1";
        } else if (bead.style.transform) {
          bead.style.transform = "";
          bead.style.zIndex = "";
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    // The mask lives on the wrapper (not on the track) so the horizontal fade
    // is measured against the viewport width, not the ~3400px track width.
    // overflow stays `visible` so a badge scaling up at mid-focus is never
    // clipped from the top of the box — the mask height of 300% leaves a
    // full box-height of headroom above and below.
    <div
      ref={wrapRef}
      className="relative w-full"
      style={{
        height: heightPx,
        WebkitMaskImage: EDGE_FADE,
        maskImage: EDGE_FADE,
        WebkitMaskSize: "100% 300%",
        maskSize: "100% 300%",
        WebkitMaskPosition: "50% 50%",
        maskPosition: "50% 50%",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
      }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${lineColor} ${inset}, ${lineColor} calc(100% - ${inset}), transparent 100%)`,
        }}
      />
      <div
        ref={trackRef}
        className="hero-rail-track absolute top-1/2 left-0 flex items-center w-max"
        style={{
          "--dur": `${duration}s`,
          gap,
          animationDirection: reverse ? "reverse" : "normal",
          animationDelay: `${delay}s`,
        }}
      >
        {[...half, ...half].map((child, i) => (
          <div key={i} className="hero-rail-bead shrink-0">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}

// Scoped animation CSS for the rails. Included once by the hero section.
export const heroRailStyles = `
@keyframes heroRail {
  from { transform: translate3d(0, -50%, 0); }
  to   { transform: translate3d(-50%, -50%, 0); }
}
.hero-rail-track {
  transform: translate3d(0, -50%, 0);
  animation: heroRail var(--dur, 40s) linear infinite;
  will-change: transform;
}
.hero-rail-badge {
  background: rgba(255,255,255,0.86);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(13,37,40,0.10);
  box-shadow: 0 10px 26px -12px rgba(13,37,40,0.20), inset 0 1px 0 rgba(255,255,255,0.9);
}
.hero-rail-bead {
  transform-origin: 50% 60%;
  transition: transform 120ms linear;
  will-change: transform;
}
@media (prefers-reduced-motion: reduce) {
  .hero-rail-track { animation: none !important; }
  .hero-rail-bead  { transform: none !important; }
}
`;