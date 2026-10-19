/**
 * FIG. 00 — "Exploded parametric assembly"
 * ----------------------------------------
 * Brand artwork, not project documentation: a stack of flange-like plates
 * whose outline morphs from circle to squircle (superellipse exponent),
 * twisted layer by layer around a shared axis. Generated in code; no
 * relationship to the geometry of any of Albert's projects.
 *
 * This module is renderer-agnostic: it builds plain Float32Arrays and
 * provides the small amount of matrix maths the WebGL renderer needs.
 */

export interface LayerSpec {
  /** Outer radius (scene units). */
  radius: number;
  /** Superellipse exponent of the outer contour (2 = circle). */
  exponent: number;
  /** Inner hole radius as a fraction of the outer radius. */
  hole: number;
  /** Plate thickness. */
  thickness: number;
  /** Rotation about the stack axis (radians). */
  twist: number;
  /** Colour role, resolved per theme by the renderer. */
  tone: "pearl" | "metal" | "steel" | "accent" | "neutral";
}

export interface Mesh {
  positions: Float32Array;
  normals: Float32Array;
  count: number;
}

const TONES: LayerSpec["tone"][] = ["pearl", "metal", "steel", "neutral", "accent", "metal", "pearl", "steel", "metal"];
const RADII = [0.92, 1.12, 0.66, 1.04, 0.98, 1.16, 0.62, 0.98, 0.78];
const HOLES = [0.3, 0.56, 0.36, 0.68, 0.84, 0.44, 0.3, 0.62, 0.4];

export function sculptureLayers(): LayerSpec[] {
  const n = TONES.length;
  return TONES.map((tone, i) => {
    const t = i / (n - 1);
    return {
      radius: RADII[i]!,
      exponent: 2 + 2.8 * Math.abs(Math.sin(Math.PI * t * 1.5)),
      hole: HOLES[i]!,
      thickness: tone === "accent" ? 0.04 : 0.06,
      twist: t * 1.35,
      tone,
    };
  });
}

function superellipse(a: number, n: number): number {
  const c = Math.abs(Math.cos(a));
  const s = Math.abs(Math.sin(a));
  return Math.pow(Math.pow(c, n) + Math.pow(s, n), -1 / n);
}

/** Flat plate with a superellipse outline and a circular hole, centred at y = 0. */
export function plateMesh(spec: LayerSpec, segments = 128): Mesh {
  const { radius: R, exponent: n, hole, thickness: h } = spec;
  const outer: [number, number][] = [];
  const inner: [number, number][] = [];
  for (let k = 0; k < segments; k++) {
    const a = (k / segments) * Math.PI * 2;
    const r = R * superellipse(a, n);
    outer.push([Math.cos(a) * r, Math.sin(a) * r * 0.9]);
    inner.push([Math.cos(a) * R * hole, Math.sin(a) * R * hole * 0.9]);
  }
  const pos: number[] = [];
  const nor: number[] = [];
  const push = (x: number, y: number, z: number, nx: number, ny: number, nz: number) => {
    pos.push(x, y, z);
    nor.push(nx, ny, nz);
  };
  const y0 = -h / 2;
  const y1 = h / 2;

  // Smooth wall normals from the contour tangent.
  const wallNormal = (ring: [number, number][], k: number, sign: 1 | -1): [number, number] => {
    const p = ring[(k - 1 + segments) % segments]!;
    const q = ring[(k + 1) % segments]!;
    let nx = q[1] - p[1];
    let nz = -(q[0] - p[0]);
    const l = Math.hypot(nx, nz) || 1;
    nx /= l;
    nz /= l;
    const self = ring[k]!;
    if ((nx * self[0] + nz * self[1]) * sign < 0) {
      nx = -nx;
      nz = -nz;
    }
    return [nx, nz];
  };

  for (let k = 0; k < segments; k++) {
    const j = (k + 1) % segments;
    const o0 = outer[k]!;
    const o1 = outer[j]!;
    const i0 = inner[k]!;
    const i1 = inner[j]!;

    // Top (+y) and bottom (−y) faces.
    push(o0[0], y1, o0[1], 0, 1, 0);
    push(i0[0], y1, i0[1], 0, 1, 0);
    push(o1[0], y1, o1[1], 0, 1, 0);
    push(o1[0], y1, o1[1], 0, 1, 0);
    push(i0[0], y1, i0[1], 0, 1, 0);
    push(i1[0], y1, i1[1], 0, 1, 0);

    push(o0[0], y0, o0[1], 0, -1, 0);
    push(o1[0], y0, o1[1], 0, -1, 0);
    push(i0[0], y0, i0[1], 0, -1, 0);
    push(o1[0], y0, o1[1], 0, -1, 0);
    push(i1[0], y0, i1[1], 0, -1, 0);
    push(i0[0], y0, i0[1], 0, -1, 0);

    // Outer wall.
    const no0 = wallNormal(outer, k, 1);
    const no1 = wallNormal(outer, j, 1);
    push(o0[0], y0, o0[1], no0[0], 0, no0[1]);
    push(o0[0], y1, o0[1], no0[0], 0, no0[1]);
    push(o1[0], y0, o1[1], no1[0], 0, no1[1]);
    push(o1[0], y0, o1[1], no1[0], 0, no1[1]);
    push(o0[0], y1, o0[1], no0[0], 0, no0[1]);
    push(o1[0], y1, o1[1], no1[0], 0, no1[1]);

    // Inner wall (normals face the axis).
    const ni0 = wallNormal(inner, k, -1);
    const ni1 = wallNormal(inner, j, -1);
    push(i0[0], y0, i0[1], ni0[0], 0, ni0[1]);
    push(i1[0], y0, i1[1], ni1[0], 0, ni1[1]);
    push(i0[0], y1, i0[1], ni0[0], 0, ni0[1]);
    push(i1[0], y0, i1[1], ni1[0], 0, ni1[1]);
    push(i1[0], y1, i1[1], ni1[0], 0, ni1[1]);
    push(i0[0], y1, i0[1], ni0[0], 0, ni0[1]);
  }
  return { positions: new Float32Array(pos), normals: new Float32Array(nor), count: pos.length / 3 };
}

/** Thin cylinder along y (the shared axis of the assembly). */
export function shaftMesh(radius: number, length: number, segments = 48): Mesh {
  const pos: number[] = [];
  const nor: number[] = [];
  const y0 = -length / 2;
  const y1 = length / 2;
  for (let k = 0; k < segments; k++) {
    const a0 = (k / segments) * Math.PI * 2;
    const a1 = ((k + 1) / segments) * Math.PI * 2;
    const c0 = Math.cos(a0);
    const s0 = Math.sin(a0);
    const c1 = Math.cos(a1);
    const s1 = Math.sin(a1);
    const quad: [number, number, number, number][] = [
      [c0, y0, s0, 0],
      [c0, y1, s0, 0],
      [c1, y0, s1, 1],
      [c1, y0, s1, 1],
      [c0, y1, s0, 0],
      [c1, y1, s1, 1],
    ];
    for (const [c, y, s] of quad) {
      pos.push(c * radius, y, s * radius);
      nor.push(c, 0, s);
    }
  }
  return { positions: new Float32Array(pos), normals: new Float32Array(nor), count: pos.length / 3 };
}

/* ---------- Minimal column-major mat4 helpers --------------------- */

export type Mat4 = Float32Array;

export function identity(): Mat4 {
  const m = new Float32Array(16);
  m[0] = m[5] = m[10] = m[15] = 1;
  return m;
}

export function multiply(a: Mat4, b: Mat4): Mat4 {
  const o = new Float32Array(16);
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      let s = 0;
      for (let k = 0; k < 4; k++) s += a[k * 4 + r]! * b[c * 4 + k]!;
      o[c * 4 + r] = s;
    }
  }
  return o;
}

export function perspective(fovY: number, aspect: number, near: number, far: number): Mat4 {
  const f = 1 / Math.tan(fovY / 2);
  const m = new Float32Array(16);
  m[0] = f / aspect;
  m[5] = f;
  m[10] = (far + near) / (near - far);
  m[11] = -1;
  m[14] = (2 * far * near) / (near - far);
  return m;
}

export function translation(x: number, y: number, z: number): Mat4 {
  const m = identity();
  m[12] = x;
  m[13] = y;
  m[14] = z;
  return m;
}

export function rotationX(a: number): Mat4 {
  const m = identity();
  const c = Math.cos(a);
  const s = Math.sin(a);
  m[5] = c;
  m[6] = s;
  m[9] = -s;
  m[10] = c;
  return m;
}

export function rotationY(a: number): Mat4 {
  const m = identity();
  const c = Math.cos(a);
  const s = Math.sin(a);
  m[0] = c;
  m[2] = -s;
  m[8] = s;
  m[10] = c;
  return m;
}

export function rotationZ(a: number): Mat4 {
  const m = identity();
  const c = Math.cos(a);
  const s = Math.sin(a);
  m[0] = c;
  m[1] = s;
  m[4] = -s;
  m[5] = c;
  return m;
}

/** Upper-left 3×3 (pure rotations here, so it is also the normal matrix). */
export function normalMatrix(m: Mat4): Float32Array {
  return new Float32Array([m[0]!, m[1]!, m[2]!, m[4]!, m[5]!, m[6]!, m[8]!, m[9]!, m[10]!]);
}
