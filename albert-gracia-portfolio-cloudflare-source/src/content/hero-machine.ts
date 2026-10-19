/**
 * Homepage hero — CAD model of the ORTESIS STUDIO motorised 3D scanning machine.
 *
 * Source: `Conjunt fotogrametria.STL` (binary STL, 528,732 triangles, mm, Z up), kept
 * unchanged outside `public/` (see docs/ASSET_MANIFEST.md). The web file is a derivative
 * written by `node scripts/pack-assembly.mjs <stl> <out.agm.gz>`.
 */

import { withBase } from "@/lib/base";

const dir = withBase("/assets/ortesis-studio/machine");

export const heroMachine = {
  src: `${dir}/scanning-machine.agm.gz`,
  /**
   * Presentation orientation (source mm, Z = ring axis). The built prototype lies with the ring
   * axis horizontal (the forearm passes through the rings) and the frame plates upright — see the
   * photographs. `axis` becomes horizontal, `up` points up (the plates' long side, rails side up).
   */
  orientation: { axis: [0, 0, 1] as const, up: [0, 1, 0] as const },
  /** Still renders of the assembled view: shown while loading, with reduced motion and without WebGL. */
  posters: {
    light: { wide: `${dir}/hero-machine-light-wide.webp`, tall: `${dir}/hero-machine-light-tall.webp` },
    dark: { wide: `${dir}/hero-machine-dark-wide.webp`, tall: `${dir}/hero-machine-dark-tall.webp` },
  },
  /** Three-quarter view (degrees): yaw around the vertical axis, pitch looking down. */
  view: { yaw: -58, pitch: 14, fov: 22 },
  /**
   * One-time separation along the machine's longitudinal axis, as a fraction of its length:
   * the two end frames move apart off the rods; rods and carriage stay. Skipped with reduced motion.
   */
  explode: { amount: 0.065, delayMs: 700, durationMs: 1700 },
  caption: ["ORTESIS STUDIO — Motorised 3D scanning machine", "CAD model · Independent project"],
  alt: "CAD model of the motorised 3D scanning machine designed for ORTESIS STUDIO: two ring frames with gear rims joined by rods, with guide rails and a scanner carriage running between them.",
};
