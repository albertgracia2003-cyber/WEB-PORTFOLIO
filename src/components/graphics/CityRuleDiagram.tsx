import { cn, mulberry32, r2 } from "@/lib/utils";

/**
 * SCHEMATIC — isometric reading of the Procedural City Generator's rule:
 * a predefined plane is subdivided; roads are generated through the
 * centres of the subdivisions; building blocks are generated from the
 * resulting layout. Explanatory drawing only — NOT output of the Blender
 * system (heights are illustrative). Albert to confirm the reading.
 */

interface Cell {
  x: number;
  y: number;
  w: number;
  h: number;
}

const PLANE: Cell = { x: 0, y: 0, w: 560, h: 400 };
const CELLS: Cell[] = [
  { x: 0, y: 0, w: 220, h: 180 },
  { x: 0, y: 180, w: 220, h: 220 },
  { x: 220, y: 0, w: 170, h: 400 },
  { x: 390, y: 0, w: 170, h: 210 },
  { x: 390, y: 210, w: 170, h: 190 },
];
const ROAD = 14;

const centreRoad = (c: Cell): Cell =>
  c.w >= c.h
    ? { x: c.x + c.w / 2 - ROAD / 2, y: c.y, w: ROAD, h: c.h }
    : { x: c.x, y: c.y + c.h / 2 - ROAD / 2, w: c.w, h: ROAD };

const halves = (c: Cell): Cell[] =>
  c.w >= c.h
    ? [
        { x: c.x, y: c.y, w: c.w / 2, h: c.h },
        { x: c.x + c.w / 2, y: c.y, w: c.w / 2, h: c.h },
      ]
    : [
        { x: c.x, y: c.y, w: c.w, h: c.h / 2 },
        { x: c.x, y: c.y + c.h / 2, w: c.w, h: c.h / 2 },
      ];

const inset = (c: Cell, d: number): Cell => ({ x: c.x + d, y: c.y + d, w: Math.max(0, c.w - 2 * d), h: Math.max(0, c.h - 2 * d) });

const rand = mulberry32(7);
const BLOCKS = CELLS.flatMap(halves).map((h) => inset(h, ROAD / 2 + 6));
const LOTS = BLOCKS.flatMap((b) => {
  const alongX = b.w >= b.h;
  const span = alongX ? b.w : b.h;
  const count = Math.max(2, Math.round(span / 44));
  const out: (Cell & { z: number })[] = [];
  let cursor = 0;
  for (let i = 0; i < count; i++) {
    const size = i === count - 1 ? span - cursor : (span / count) * (0.75 + rand() * 0.5);
    const gap = 5;
    const z = 14 + Math.pow(rand(), 1.6) * 70;
    out.push(
      alongX
        ? { x: b.x + cursor, y: b.y, w: Math.max(0, size - gap), h: b.h, z }
        : { x: b.x, y: b.y + cursor, w: b.w, h: Math.max(0, size - gap), z },
    );
    cursor += size;
  }
  return out;
}).sort((a, b) => a.x + a.w + a.y + a.h - (b.x + b.w + b.y + b.h));

/* Isometric projection: plan (x, y, z) → screen. */
const COS = Math.cos(Math.PI / 6);
const SIN = Math.sin(Math.PI / 6);
const S = 0.8;
const OX = 312;
const OY = 110;
const pt = (x: number, y: number, z = 0): [number, number] => [r2(OX + (x - y) * COS * S), r2(OY + (x + y) * SIN * S - z * S)];
const P = (x: number, y: number, z = 0) => pt(x, y, z).join(",");
const quad = (c: Cell, z = 0) => [P(c.x, c.y, z), P(c.x + c.w, c.y, z), P(c.x + c.w, c.y + c.h, z), P(c.x, c.y + c.h, z)].join(" ");

function Box({ c, z }: { c: Cell; z: number }) {
  const x1 = c.x + c.w;
  const y1 = c.y + c.h;
  return (
    <g>
      {/* +x face (right) and +y face (left) are the visible sides */}
      <polygon className="iso-right" points={[P(x1, c.y, 0), P(x1, y1, 0), P(x1, y1, z), P(x1, c.y, z)].join(" ")} />
      <polygon className="iso-left" points={[P(c.x, y1, 0), P(x1, y1, 0), P(x1, y1, z), P(c.x, y1, z)].join(" ")} />
      <polygon className="iso-top" points={quad(c, z)} />
    </g>
  );
}

export const cityStages = [
  "Input plane",
  "Subdivisions",
  "Roads through subdivision centres",
  "Building blocks",
  "Generated layout",
] as const;

export function CityRuleDiagram({ stage, className }: { stage: number; className?: string }) {
  const on = (s: number) => (stage >= s ? "is-on" : undefined);
  return (
    <svg
      className={cn("city-iso", className)}
      viewBox="0 0 760 560"
      role="img"
      aria-label={`Schematic diagram, step ${stage + 1} of ${cityStages.length}: ${cityStages[stage]}.`}
    >
      {/* plane slab */}
      <polygon className="iso-slab-left" points={[P(0, 400, 0), P(560, 400, 0), P(560, 400, -14), P(0, 400, -14)].join(" ")} />
      <polygon className="iso-slab-right" points={[P(560, 0, 0), P(560, 400, 0), P(560, 400, -14), P(560, 0, -14)].join(" ")} />
      <polygon className="iso-plane" points={quad(PLANE)} />

      {/* 1 — subdivisions */}
      <g className={cn("iso-layer iso-sub", on(1))}>
        {CELLS.map((c, i) => (
          <polygon key={i} points={quad(c)} />
        ))}
      </g>

      {/* 2 — roads through the centres */}
      <g className={cn("iso-layer iso-roads", on(2))}>
        {CELLS.map((c, i) => (
          <polygon key={i} points={quad(centreRoad(c), 0.5)} />
        ))}
        {CELLS.map((c, i) => (
          <circle key={`c${i}`} className="iso-centre" cx={pt(c.x + c.w / 2, c.y + c.h / 2)[0]} cy={pt(c.x + c.w / 2, c.y + c.h / 2)[1]} r={4} />
        ))}
      </g>

      {/* 3 — block footprints */}
      <g className={cn("iso-layer iso-blocks", on(3) && stage < 4 ? "is-on" : undefined)}>
        {BLOCKS.map((b, i) => (
          <Box key={i} c={b} z={4} />
        ))}
      </g>

      {/* 4 — generated volumes (illustrative heights) */}
      <g className={cn("iso-layer iso-lots", on(4))}>
        {LOTS.map((l, i) => (
          <Box key={i} c={l} z={l.z} />
        ))}
      </g>

      <g className="iso-annot" aria-hidden="true">
        <text x={24} y={538}>
          {String(stage + 1).padStart(2, "0")} / {String(cityStages.length).padStart(2, "0")} — {cityStages[stage]}
        </text>
        <text x={736} y={538} textAnchor="end">
          Schematic · heights illustrative
        </text>
      </g>
    </svg>
  );
}
