"use client";

import { useId, useMemo, useState } from "react";
import { clamp, cn, mulberry32, r2 } from "@/lib/utils";

/**
 * CONCEPTUAL INTERACTIVE ILLUSTRATION
 * A deliberately simplified browser-side model of the idea behind the
 * Parametric Drawer System (dimensions + separator count + irregularity
 * → independent divider pieces). It is NOT the original Blender
 * Geometry Nodes system and is labelled as such wherever it appears.
 */

interface Params {
  length: number; // mm, x
  width: number; // mm, y
  separators: number;
  irregularity: number; // 0–100
  seed: number;
}

interface Piece {
  x: number;
  y: number;
  w: number;
  h: number;
}

const DEFAULTS: Params = { length: 600, width: 420, separators: 5, irregularity: 35, seed: 11 };
const T = 6; // divider thickness, mm (illustrative)

function generate({ length: L, width: W, separators: n, irregularity, seed }: Params) {
  const rand = mulberry32(seed);
  const irr = irregularity / 100;

  // Split separators between the two directions in proportion to the drawer.
  const v = clamp(Math.round((n * L) / (L + W)), 1, n);
  const h = n - v;

  // Cross dividers (full width).
  const pitchX = L / (v + 1);
  let xs = Array.from({ length: v }, (_, k) => pitchX * (k + 1) + (rand() - 0.5) * irr * pitchX * 0.9);
  xs = xs.sort((a, b) => a - b).map((x) => clamp(x, 24, L - 24));
  const bounds = [0, ...xs, L];

  const pieces: Piece[] = xs.map((x) => ({ x: x - T / 2, y: 0, w: T, h: W }));

  // Longitudinal dividers: one independent piece per bay, offset by irregularity.
  const pitchY = W / (h + 1);
  for (let j = 0; j < h; j++) {
    for (let b = 0; b < bounds.length - 1; b++) {
      const x0 = bounds[b]! + (b === 0 ? 0 : T / 2);
      const x1 = bounds[b + 1]! - (b === bounds.length - 2 ? 0 : T / 2);
      const y = clamp(pitchY * (j + 1) + (rand() - 0.5) * irr * pitchY * 0.95, 18, W - 18);
      pieces.push({ x: x0, y: y - T / 2, w: x1 - x0, h: T });
    }
  }

  return { pieces, compartments: (v + 1) * (h + 1), cross: v, longitudinal: h };
}

interface DrawerConfiguratorProps {
  variant?: "full" | "compact";
  className?: string;
}

export function DrawerConfigurator({ variant = "full", className }: DrawerConfiguratorProps) {
  const [p, setP] = useState<Params>(DEFAULTS);
  const uid = useId();
  const result = useMemo(() => generate(p), [p]);
  const compact = variant === "compact";

  // Isometric product view of the tray (plan x = length, y = width, z = up).
  const VB_W = 680;
  const VB_H = 470;
  const HW = 70; // wall height (illustrative)
  const HD = 56; // divider height (illustrative)
  const WT = 10; // wall thickness (illustrative)
  const C = Math.cos(Math.PI / 6);
  const S = Math.sin(Math.PI / 6);
  const L = p.length + 2 * WT;
  const W = p.width + 2 * WT;
  const sc = Math.min((VB_W - 140) / ((L + W) * C), (VB_H - 120) / ((L + W) * S + HW));
  const ox = (VB_W - (L - W) * C * sc) / 2;
  const oy = (VB_H - ((L + W) * S + HW) * sc) / 2 + HW * sc - 8;
  // Plan coordinates are measured from the inner corner; walls sit at negative / beyond-size coordinates.
  const pt = (x: number, y: number, z = 0): [number, number] => [
    r2(ox + (x + WT - (y + WT)) * C * sc),
    r2(oy + (x + WT + y + WT) * S * sc - z * sc),
  ];
  const P = (x: number, y: number, z = 0) => pt(x, y, z).join(",");
  const top = (x: number, y: number, w: number, h: number, z: number) =>
    [P(x, y, z), P(x + w, y, z), P(x + w, y + h, z), P(x, y + h, z)].join(" ");
  const box = (x: number, y: number, w: number, h: number, z: number, cls: string, key: string | number) => (
    <g key={key} className={cls}>
      <polygon className="iso-right" points={[P(x + w, y, 0), P(x + w, y + h, 0), P(x + w, y + h, z), P(x + w, y, z)].join(" ")} />
      <polygon className="iso-left" points={[P(x, y + h, 0), P(x + w, y + h, 0), P(x + w, y + h, z), P(x, y + h, z)].join(" ")} />
      <polygon className="iso-top" points={top(x, y, w, h, z)} />
    </g>
  );
  const sorted = [...result.pieces].sort((a, b) => a.x + a.w + a.y + a.h - (b.x + b.w + b.y + b.h));
  const [fx, fy] = pt(p.length / 2, p.width / 2, 0);

  const set = <K extends keyof Params>(k: K, value: Params[K]) => setP((prev) => ({ ...prev, [k]: value }));

  const controls: {
    key: "length" | "width" | "separators" | "irregularity";
    label: string;
    min: number;
    max: number;
    step: number;
    unit: string;
  }[] = [
    { key: "length", label: "Drawer length", min: 300, max: 900, step: 10, unit: "mm" },
    { key: "width", label: "Drawer width", min: 200, max: 600, step: 10, unit: "mm" },
    { key: "separators", label: "Separators", min: 1, max: 12, step: 1, unit: "" },
    { key: "irregularity", label: "Irregularity", min: 0, max: 100, step: 1, unit: "%" },
  ];
  const visible = compact ? controls.filter((c) => c.key === "separators" || c.key === "irregularity") : controls;

  return (
    <div className={cn("drawer-cfg", compact && "drawer-cfg--compact", className)}>
      <div className="drawer-cfg__canvas">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          role="img"
          aria-labelledby={`${uid}-desc`}
          className="drawer-cfg__svg"
        >
          <desc id={`${uid}-desc`}>
            Top view of a {p.length} by {p.width} millimetre drawer with {result.cross} cross dividers and{" "}
            {result.longitudinal} rows of longitudinal divider pieces, forming {result.compartments} compartments.
          </desc>
          <ellipse className="dc-shadow" cx={fx} cy={fy + 18} rx={(L + W) * C * sc * 0.55} ry={(L + W) * S * sc * 0.42} />
          {/* back walls (inner faces visible) */}
          {box(-WT, -WT, p.length + 2 * WT, WT, HW, "dc-wall", "wb")}
          {box(-WT, 0, WT, p.width + WT, HW, "dc-wall", "wl")}
          <polygon className="dc-floor" points={top(0, 0, p.length, p.width, 0)} />
          {/* independent divider pieces, drawn back to front */}
          {sorted.map((pc, i) => box(pc.x + 0.6, pc.y + 0.6, Math.max(0, pc.w - 1.2), Math.max(0, pc.h - 1.2), HD, "dc-piece", i))}
          {/* front walls, translucent so the layout stays readable */}
          {box(-WT, p.width, p.length + 2 * WT, WT, HW, "dc-wall dc-wall--front", "wf")}
          {box(p.length, -WT, WT, p.width + WT, HW, "dc-wall dc-wall--front", "wr")}
          {/* dimensions */}
          <g className="dc-dim">
            <line x1={pt(0, p.width + WT + 40)[0]} y1={pt(0, p.width + WT + 40)[1]} x2={pt(p.length, p.width + WT + 40)[0]} y2={pt(p.length, p.width + WT + 40)[1]} />
            <circle cx={pt(0, p.width + WT + 40)[0]} cy={pt(0, p.width + WT + 40)[1]} r={3} />
            <circle cx={pt(p.length, p.width + WT + 40)[0]} cy={pt(p.length, p.width + WT + 40)[1]} r={3} />
            <text x={pt(p.length / 2, p.width + WT + 70)[0]} y={pt(p.length / 2, p.width + WT + 70)[1]} textAnchor="middle">
              L {p.length} mm
            </text>
            <line x1={pt(p.length + WT + 40, 0)[0]} y1={pt(p.length + WT + 40, 0)[1]} x2={pt(p.length + WT + 40, p.width)[0]} y2={pt(p.length + WT + 40, p.width)[1]} />
            <circle cx={pt(p.length + WT + 40, 0)[0]} cy={pt(p.length + WT + 40, 0)[1]} r={3} />
            <circle cx={pt(p.length + WT + 40, p.width)[0]} cy={pt(p.length + WT + 40, p.width)[1]} r={3} />
            <text x={pt(p.length + WT + 70, p.width / 2)[0]} y={pt(p.length + WT + 70, p.width / 2)[1]} textAnchor="middle">
              W {p.width} mm
            </text>
          </g>
        </svg>
        <p className="drawer-cfg__badge label">Conceptual illustration · simplified browser model</p>
      </div>

      <div className="drawer-cfg__panel">
        <fieldset className="drawer-cfg__fields">
          <legend className="label">Parameters</legend>
          {visible.map((c) => {
            const id = `${uid}-${c.key}`;
            const value = p[c.key];
            return (
              <div key={c.key} className="drawer-cfg__field">
                <div className="drawer-cfg__field-head">
                  <label htmlFor={id}>{c.label}</label>
                  <output htmlFor={id} className="mono">
                    {value}
                    {c.unit ? ` ${c.unit}` : ""}
                  </output>
                </div>
                <input
                  id={id}
                  type="range"
                  min={c.min}
                  max={c.max}
                  step={c.step}
                  value={value}
                  onChange={(e) => set(c.key, Number(e.target.value))}
                  style={{ "--fill": `${((value - c.min) / (c.max - c.min)) * 100}%` } as React.CSSProperties}
                />
              </div>
            );
          })}
        </fieldset>

        <div className="drawer-cfg__readout" aria-live="polite">
          <div>
            <span className="label">Pieces</span>
            <span className="drawer-cfg__num">{result.pieces.length}</span>
          </div>
          <div>
            <span className="label">Compartments</span>
            <span className="drawer-cfg__num">{result.compartments}</span>
          </div>
        </div>

        <div className="drawer-cfg__actions">
          <button
            type="button"
            className="btn btn--line"
            onClick={() => set("seed", (p.seed * 9301 + 49297) % 233280)}
            disabled={p.irregularity === 0}
          >
            New variation
          </button>
          {!compact ? (
            <button type="button" className="btn btn--ghost" onClick={() => setP(DEFAULTS)}>
              Reset
            </button>
          ) : null}
        </div>

        {!compact ? (
          <p className="drawer-cfg__note">
            This browser model only illustrates the relationship between parameters and layout. The real system is built
            in Blender Geometry Nodes; its authentic outputs are shown under Variations.
          </p>
        ) : null}
      </div>
    </div>
  );
}
