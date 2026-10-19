#!/usr/bin/env node
/**
 * Web derivative of a CAD assembly exported as one binary STL.
 *
 *   node scripts/pack-assembly.mjs <input.stl> <output.agm.gz>
 *
 * 1. Splits the triangle soup into connected bodies (triangles that share a vertex).
 * 2. Finds bodies that are exact copies of another body (same triangles under a rigid
 *    or mirrored transform, verified to < 0.001 mm) and stores them once + a transform.
 * 3. Stores vertices quantised to 16 bits per axis within each body's bounding box
 *    (step ≤ 0.01 mm for a 650 mm assembly) and delta-encoded; triangles keep their
 *    order and connectivity. Facet normals and STL attribute bytes are dropped.
 * 4. Tags each body by height in the assembly (Z up): top (lowest point in the upper
 *    quarter), bottom (highest point in the lower quarter) or fixed — used by the
 *    viewer for its optional vertical separation.
 * 5. Gzips the result (decoded in the browser with DecompressionStream).
 *
 * The STL is only read. Layout ("AGM2", little-endian):
 *   u32 magic, u32 meshCount, u32 partCount, f32 min[3], f32 max[3]
 *   per mesh: u32 verts, u32 tris, f32 qmin[3], f32 qstep[3],
 *             u16 zigzag-delta positions [verts*3], u16 index codes [tris*3], pad to 4 bytes
 *   per part: u32 mesh, u32 group (0 fixed, 1 top, 2 bottom), f32 m[12] (3×4 row-major, source mm)
 */
import fs from "node:fs";
import zlib from "node:zlib";

const [, , input, output] = process.argv;
if (!input || !output) throw new Error("usage: node scripts/pack-assembly.mjs <input.stl> <output.agm.gz>");

const buf = fs.readFileSync(input);
const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
const T = dv.getUint32(80, true);
if (84 + T * 50 !== buf.byteLength) throw new Error("expected a binary STL");
const soup = new Float32Array(T * 9);
for (let t = 0; t < T; t++) for (let k = 0; k < 9; k++) soup[t * 9 + k] = dv.getFloat32(84 + t * 50 + 12 + k * 4, true);

// --- weld (bit-exact) ---
const bits = new Uint32Array(soup.buffer);
const nv = T * 3;
let size = 1;
while (size < nv * 2) size <<= 1;
const table = new Int32Array(size).fill(-1);
const vid = new Uint32Array(nv);
const first = [];
let count = 0;
for (let i = 0; i < nv; i++) {
  const x = bits[i * 3], y = bits[i * 3 + 1], z = bits[i * 3 + 2];
  let h = (Math.imul(x, 73856093) ^ Math.imul(y, 19349663) ^ Math.imul(z, 83492791)) & (size - 1);
  for (;;) {
    const s = table[h];
    if (s === -1) { table[h] = count; first.push(i); vid[i] = count++; break; }
    const f = first[s];
    if (bits[f * 3] === x && bits[f * 3 + 1] === y && bits[f * 3 + 2] === z) { vid[i] = s; break; }
    h = (h + 1) & (size - 1);
  }
}

// --- connected bodies (union-find over vertices) ---
const parent = new Int32Array(count).map((_, i) => i);
const find = (a) => { while (parent[a] !== a) { parent[a] = parent[parent[a]]; a = parent[a]; } return a; };
for (let t = 0; t < T; t++) {
  const a = find(vid[t * 3]), b = find(vid[t * 3 + 1]), c = find(vid[t * 3 + 2]);
  parent[b] = a; parent[find(c)] = a;
}
const bodyOf = new Map();
const bodies = [];
for (let t = 0; t < T; t++) {
  const r = find(vid[t * 3]);
  let b = bodyOf.get(r);
  if (b === undefined) { b = bodies.length; bodyOf.set(r, b); bodies.push([]); }
  bodies[b].push(t);
}

// --- helpers ---
const corner = (t, k) => [soup[t * 9 + k * 3], soup[t * 9 + k * 3 + 1], soup[t * 9 + k * 3 + 2]];
function solve4(A, B) {
  // Affine M (3×4) with B_i = M · [A_i, 1] from 4 point pairs (Gauss-Jordan on 4×4).
  const M = [];
  for (let r = 0; r < 3; r++) {
    const m = A.map((a, i) => [a[0], a[1], a[2], 1, B[i][r]]);
    for (let c = 0; c < 4; c++) {
      let p = c;
      for (let i = c + 1; i < 4; i++) if (Math.abs(m[i][c]) > Math.abs(m[p][c])) p = i;
      if (Math.abs(m[p][c]) < 1e-9) return null;
      [m[c], m[p]] = [m[p], m[c]];
      for (let i = 0; i < 4; i++) if (i !== c) { const f = m[i][c] / m[c][c]; for (let j = c; j < 5; j++) m[i][j] -= f * m[c][j]; }
    }
    M.push([0, 1, 2, 3].map((i) => m[i][4] / m[i][i]));
  }
  return M;
}
function spanning4(tris) {
  const pts = [];
  const vol = (a, b, c, d) => {
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]], w = [d[0] - a[0], d[1] - a[1], d[2] - a[2]];
    return Math.abs(u[0] * (v[1] * w[2] - v[2] * w[1]) - u[1] * (v[0] * w[2] - v[2] * w[0]) + u[2] * (v[0] * w[1] - v[1] * w[0]));
  };
  // greedy: far-apart, non-coplanar corners (index pairs so the same corners are used on the copy)
  const all = [];
  for (let i = 0; i < tris.length; i += Math.max(1, Math.floor(tris.length / 400))) for (let k = 0; k < 3; k++) all.push([i, k]);
  let best = null, bv = 0;
  const p0 = all[0];
  for (let a = 1; a < all.length; a += 3) for (let b = a + 1; b < all.length; b += 7) for (let c = b + 1; c < all.length; c += 11) {
    const v = vol(corner(tris[p0[0]], p0[1]), corner(tris[all[a][0]], all[a][1]), corner(tris[all[b][0]], all[b][1]), corner(tris[all[c][0]], all[c][1]));
    if (v > bv) { bv = v; best = [p0, all[a], all[b], all[c]]; }
  }
  return bv > 1e-3 ? best : null;
}
const applyM = (M, p) => [0, 1, 2].map((r) => M[r][0] * p[0] + M[r][1] * p[1] + M[r][2] * p[2] + M[r][3]);

// --- find copies ---
let zMin = Infinity, zMax = -Infinity;
for (let i = 0; i < count; i++) { const z = soup[first[i] * 3 + 2]; if (z < zMin) zMin = z; if (z > zMax) zMax = z; }
const H = zMax - zMin;
const bases = []; // { tris, refs }
const parts = []; // { mesh, M }
for (const tris of bodies) {
  let placed = false;
  for (let m = 0; m < bases.length && !placed; m++) {
    const base = bases[m];
    if (base.tris.length !== tris.length || !base.refs) continue;
    const A = base.refs.map(([i, k]) => corner(base.tris[i], k));
    const B = base.refs.map(([i, k]) => corner(tris[i], k));
    const M = solve4(A, B);
    if (!M) continue;
    // must be rigid or mirrored (orthonormal 3×3)
    const R = [0, 1, 2].map((r) => M[r].slice(0, 3));
    const ortho = [0, 1, 2].every((i) => [0, 1, 2].every((j) => Math.abs(R[0][i] * R[0][j] + R[1][i] * R[1][j] + R[2][i] * R[2][j] - (i === j ? 1 : 0)) < 1e-4));
    if (!ortho) continue;
    let ok = true;
    for (let t = 0; t < tris.length && ok; t++)
      for (let k = 0; k < 3 && ok; k++) {
        const p = applyM(M, corner(base.tris[t], k)), q = corner(tris[t], k);
        if (Math.abs(p[0] - q[0]) > 1e-3 || Math.abs(p[1] - q[1]) > 1e-3 || Math.abs(p[2] - q[2]) > 1e-3) ok = false;
      }
    if (ok) { parts.push({ mesh: m, M, tris }); placed = true; }
  }
  if (!placed) {
    bases.push({ tris, refs: spanning4(tris) });
    parts.push({ mesh: bases.length - 1, M: [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0]], tris });
  }
}

// --- encode meshes ---
const chunks = [];
const u32 = (...v) => chunks.push(Buffer.from(new Uint32Array(v).buffer));
const f32 = (...v) => chunks.push(Buffer.from(new Float32Array(v).buffer));
let min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
for (let i = 0; i < count; i++) for (let k = 0; k < 3; k++) { const v = soup[first[i] * 3 + k]; min[k] = Math.min(min[k], v); max[k] = Math.max(max[k], v); }
u32(0x324d4741, bases.length, parts.length);
f32(...min, ...max);
let maxErr = 0;
for (const base of bases) {
  // Vertices in order of first use; index code 0 = next new vertex, c ≥ 1 = (vertices seen so far) − c.
  const seen = new Map();
  const order = [];
  const codes = new Uint16Array(base.tris.length * 3);
  base.tris.forEach((t, ti) => {
    for (let k = 0; k < 3; k++) {
      const g = vid[t * 3 + k];
      const l = seen.get(g);
      if (l === undefined) { seen.set(g, order.length); order.push(g); codes[ti * 3 + k] = 0; }
      else codes[ti * 3 + k] = order.length - l;
    }
  });
  if (order.length > 65535) throw new Error("body has more than 65535 vertices");
  const V = order.length;
  const bmin = [Infinity, Infinity, Infinity], bmax = [-Infinity, -Infinity, -Infinity];
  for (const g of order) for (let k = 0; k < 3; k++) { const v = soup[first[g] * 3 + k]; bmin[k] = Math.min(bmin[k], v); bmax[k] = Math.max(bmax[k], v); }
  const step = bmin.map((m, k) => Math.max(1e-6, (bmax[k] - m) / 65535));
  const q = new Uint16Array(V * 3);
  const prev = [0, 0, 0];
  order.forEach((g, i) => {
    for (let k = 0; k < 3; k++) {
      const v = soup[first[g] * 3 + k];
      const qi = Math.round((v - bmin[k]) / step[k]);
      maxErr = Math.max(maxErr, Math.abs(bmin[k] + qi * step[k] - v));
      const d = ((((qi - prev[k]) + 32768) & 0xffff) - 32768); // 16-bit wrapping delta
      prev[k] = qi;
      q[i * 3 + k] = d >= 0 ? d * 2 : -d * 2 - 1; // zigzag; decoder: q = (prev + d) & 0xffff
    }
  });
  u32(V, base.tris.length);
  f32(...bmin, ...step);
  chunks.push(Buffer.from(q.buffer), Buffer.from(codes.buffer));
  const bytes = q.byteLength + codes.byteLength;
  if (bytes % 4) chunks.push(Buffer.alloc(4 - (bytes % 4)));
}
for (const p of parts) {
  let lo = Infinity, hi = -Infinity;
  for (const t of p.tris) for (let k = 0; k < 3; k++) { const z = soup[t * 9 + k * 3 + 2]; lo = Math.min(lo, z); hi = Math.max(hi, z); }
  const group = lo > zMin + 0.75 * H ? 1 : hi < zMin + 0.25 * H ? 2 : 0;
  p.group = group;
  u32(p.mesh, group);
  f32(...p.M[0], ...p.M[1], ...p.M[2]);
}
const raw = Buffer.concat(chunks);
const gz = zlib.gzipSync(raw, { level: 9 });
fs.writeFileSync(output, gz);
const groups = [0, 1, 2].map((g) => parts.filter((p) => p.group === g).length);
console.log(`${T} triangles, ${count} vertices → ${bodies.length} bodies, ${bases.length} unique (${parts.length - bases.length} stored as copies)`);
console.log(`groups: fixed ${groups[0]}, top ${groups[1]}, bottom ${groups[2]} · max quantisation error ${maxErr.toFixed(4)} mm`);
console.log(`${(buf.byteLength / 1e6).toFixed(1)} MB STL → ${(raw.length / 1e6).toFixed(2)} MB packed → ${(gz.length / 1e6).toFixed(2)} MB gzip (${output})`);
