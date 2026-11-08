import { r2 } from "@/lib/utils";
import { PauseOffscreen } from "@/components/motion/PauseOffscreen";

/**
 * FIG. 00 — an abstract study of cross-sections stacked along an axis,
 * swept by a travelling "scan" wave. Generated from a simple profile
 * function: it is a temporary graphic composition, explicitly not a
 * depiction of the orthosis or of any project output.
 */

const N = 44;
const P0 = { x: 640, y: 60 };
const P1 = { x: 300, y: 880 };

function profile(t: number): number {
  // Smooth taper with a gentle secondary swell.
  return 64 + 92 * Math.pow(1 - t, 0.85) + 14 * Math.sin(t * Math.PI * 2.2 + 0.4);
}

function buildRings() {
  const dx = P1.x - P0.x;
  const dy = P1.y - P0.y;
  const len = Math.hypot(dx, dy);
  const d = { x: dx / len, y: dy / len }; // axis direction
  const n = { x: -d.y, y: d.x }; // ring major axis
  const angle = (Math.atan2(n.y, n.x) * 180) / Math.PI;

  const rings = Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    const c = { x: P0.x + dx * t, y: P0.y + dy * t };
    const rx = profile(t);
    const ry = rx * 0.3;
    const pt = (th: number) => ({
      x: c.x + rx * Math.cos(th) * n.x + ry * Math.sin(th) * d.x,
      y: c.y + rx * Math.cos(th) * n.y + ry * Math.sin(th) * d.y,
    });
    const a = pt(0);
    const b = pt(Math.PI);
    const front = `M${r2(a.x)} ${r2(a.y)} A${r2(rx)} ${r2(ry)} ${r2(angle)} 0 1 ${r2(b.x)} ${r2(b.y)}`;
    const back = `M${r2(b.x)} ${r2(b.y)} A${r2(rx)} ${r2(ry)} ${r2(angle)} 0 1 ${r2(a.x)} ${r2(a.y)}`;
    return { i, t, c, rx, a, b, front, back };
  });

  const left = rings.map((r, k) => `${k ? "L" : "M"}${r2(r.a.x)} ${r2(r.a.y)}`).join(" ");
  const right = rings.map((r, k) => `${k ? "L" : "M"}${r2(r.b.x)} ${r2(r.b.y)}`).join(" ");
  return { rings, left, right, d, n };
}

const geo = buildRings();

export function HeroField() {
  const { rings, left, right, n } = geo;
  const sample = rings[17]!;
  const ticks = rings.filter((r) => r.i % 4 === 0);

  return (
    <PauseOffscreen className="hero-field">
      <svg viewBox="0 0 900 940" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
        {/* axis */}
        <line className="hf-axis" x1={P0.x - 40 * geo.d.x} y1={P0.y - 40 * geo.d.y} x2={P1.x + 30 * geo.d.x} y2={P1.y + 30 * geo.d.y} />

        {/* silhouette generatrices */}
        <path className="hf-gen" d={left} />
        <path className="hf-gen" d={right} />

        {/* rings */}
        <g className="hf-rings">
          {rings.map((r) => (
            <g key={r.i} className="hf-ring" style={{ "--i": r.i } as React.CSSProperties}>
              <path className="hf-ring__back" d={r.back} />
              <path className="hf-ring__front" d={r.front} />
            </g>
          ))}
        </g>

        {/* axis ticks */}
        <g className="hf-ticks">
          {ticks.map((r) => (
            <g key={r.i}>
              <line x1={r.c.x - 6 * n.x} y1={r.c.y - 6 * n.y} x2={r.c.x + 6 * n.x} y2={r.c.y + 6 * n.y} />
              <text x={r.b.x - 58} y={r.b.y + 4}>
                {String(r.i).padStart(3, "0")}
              </text>
            </g>
          ))}
        </g>

        {/* dimension annotation */}
        <g className="hf-dim">
          <line x1={sample.a.x + 24 * n.x} y1={sample.a.y + 24 * n.y} x2={sample.a.x + 74 * n.x} y2={sample.a.y + 74 * n.y} />
          <circle cx={sample.c.x} cy={sample.c.y} r="3" />
          <text x={sample.a.x + 80 * n.x + 6} y={sample.a.y + 80 * n.y}>
            r(t) · slice 17/{N}
          </text>
        </g>
      </svg>
    </PauseOffscreen>
  );
}
