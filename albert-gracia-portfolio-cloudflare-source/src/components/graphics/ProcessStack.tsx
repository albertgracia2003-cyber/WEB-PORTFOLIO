import { cn } from "@/lib/utils";

/**
 * Exploded diagram of the ORTESIS STUDIO workflow: one floating plate per
 * stage, stacked in isometric space with callouts. It visualises the
 * PROCESS (confirmed stages only), not the machine or the orthosis.
 */

export interface StackStep {
  n: string;
  title: string;
  body: string;
}

const COS = Math.cos(Math.PI / 6);
const SIN = Math.sin(Math.PI / 6);
const W = 220; // plate size in plan units
const D = 150;
const GAP = 64; // vertical spacing between plates
const T = 8; // plate thickness

export function ProcessStack({ steps, id, className }: { steps: readonly StackStep[]; id: string; className?: string }) {
  const n = steps.length;
  const ox = 210;
  const oy = 70 + (n - 1) * GAP;
  // Isometric projection of the plan rectangle (x along W, y along D).
  const iso = (x: number, y: number) => [ox + (x - y) * COS, oy + (x + y) * SIN] as const;
  const corner = iso(W, 0); // right-most corner, used for callout anchors
  const vbH = oy + (W + D) * SIN + 40;

  return (
    <figure className={cn("pstack", className)} aria-labelledby={`${id}-cap`}>
      <svg viewBox={`0 0 760 ${vbH}`} className="pstack__svg" role="img" aria-labelledby={`${id}-cap`}>
        <defs>
          <linearGradient id={`${id}-plate`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--color-surface-elevated)" />
            <stop offset="1" stopColor="var(--color-pearl-blue)" />
          </linearGradient>
          <linearGradient id={`${id}-accent`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e9907a" />
            <stop offset="1" stopColor="var(--color-accent)" />
          </linearGradient>
          <radialGradient id={`${id}-floor`} cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="var(--color-shadow-strong)" />
            <stop offset="1" stopColor="var(--color-shadow-strong)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* floor shadow */}
        <ellipse cx={iso(W / 2, D / 2)[0]} cy={oy + (W + D) * SIN * 0.5 + 34} rx={(W + D) * COS * 0.62} ry={44} fill={`url(#${id}-floor)`} />

        {/* axis through the stack */}
        <line
          className="pstack__axis"
          x1={iso(W / 2, D / 2)[0]}
          y1={iso(W / 2, D / 2)[1] + 20}
          x2={iso(W / 2, D / 2)[0]}
          y2={iso(W / 2, D / 2)[1] - (n - 1) * GAP - 40}
        />

        {steps
          .map((s, i) => ({ s, i, level: n - 1 - i }))
          .sort((a, b) => a.level - b.level)
          .map(({ s, i, level }) => {
          const dy = -level * GAP;
          const accent = i === Math.floor(n / 2);
          const p = [iso(0, 0), iso(W, 0), iso(W, D), iso(0, D)].map(([x, y]) => `${x.toFixed(1)},${(y + dy).toFixed(1)}`).join(" ");
          const edge = [iso(W, 0), iso(W, D), iso(0, D)];
          const side = [
            ...edge.map(([x, y]) => `${x.toFixed(1)},${(y + dy).toFixed(1)}`),
            ...edge.reverse().map(([x, y]) => `${x.toFixed(1)},${(y + dy + T).toFixed(1)}`),
          ].join(" ");
          const ax = corner[0];
          const ay = corner[1] + dy;
          return (
            <g key={s.n} className={cn("pstack__layer", accent && "is-accent")} style={{ "--i": i } as React.CSSProperties}>
              <polygon className="pstack__side" points={side} />
              <polygon className="pstack__plate" points={p} fill={`url(#${id}-${accent ? "accent" : "plate"})`} />
              <polygon className="pstack__rim" points={p} />
              <circle cx={iso(W / 2, D / 2)[0]} cy={iso(W / 2, D / 2)[1] + dy} r={3} className="pstack__hub" />
              <line className="pstack__leader" x1={ax + 6} y1={ay} x2={500} y2={ay} />
              <circle className="pstack__tick" cx={ax + 6} cy={ay} r={2.5} />
              <text className="pstack__n" x={510} y={ay - 6}>
                {s.n}
              </text>
              <text className="pstack__title" x={548} y={ay - 6}>
                {s.title}
              </text>
              <text className="pstack__body" x={510} y={ay + 14}>
                {s.body}
              </text>
            </g>
          );
          })}
      </svg>
      <ol className="pstack__list">
        {steps.map((s) => (
          <li key={s.n}>
            <span className="mono accent">{s.n}</span>
            <span className="pstack__list-title">{s.title}</span>
            <span className="pstack__list-body">{s.body}</span>
          </li>
        ))}
      </ol>
      <figcaption id={`${id}-cap`} className="visually-hidden">
        Exploded diagram of the workflow stages: {steps.map((s) => `${s.n} ${s.title}`).join(", ")}.
      </figcaption>
    </figure>
  );
}
