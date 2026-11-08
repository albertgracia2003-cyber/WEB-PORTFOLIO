#!/usr/bin/env node
/**
 * Web derivative of a large STL: quadric edge-collapse simplification (Garland–Heckbert), written to the same
 * `.mesh.bin` layout as `pack-stl-models.mjs` ("AGM1").
 *
 *   node scripts/simplify-stl.mjs <in.stl> <out.mesh.bin> [targetTriangles=110000]
 *
 * Unlike `pack-stl-models.mjs` this is NOT lossless: it is used for the scanning-rig CAD model, whose source has
 * 284 175 triangles (14 MB; the updated rig model has 374 938 triangles, 18 MB) and would be too heavy to stream into a page. Collapses are ordered by quadric error,
 * so flat areas lose triangles first and edges, holes, gear teeth and thin ribs are the last to change. Folds are
 * rejected, boundary and non-manifold edges are never collapsed away, and no vertex is ever added: every output
 * vertex is a (moved) vertex of the source. The original STL stays in `media-source/` and is not deployed.
 * The script prints the maximum quadric error (as a distance, in source units) so the result can be judged.
 */
import fs from "node:fs";

const [inPath, outPath, targetArg] = process.argv.slice(2);
if (!inPath || !outPath) {
  console.error("usage: node scripts/simplify-stl.mjs <in.stl> <out.mesh.bin> [targetTriangles]");
  process.exit(1);
}
const TARGET = Number(targetArg ?? 110000);

/* ---- read + weld ------------------------------------------------------------------------------------------- */
const buf = fs.readFileSync(inPath);
const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
const nTri = dv.getUint32(80, true);
if (84 + nTri * 50 !== buf.length) throw new Error("only binary STL is supported");
const soup = new Float32Array(nTri * 9);
for (let t = 0; t < nTri; t++) for (let k = 0; k < 9; k++) soup[t * 9 + k] = dv.getFloat32(84 + t * 50 + 12 + k * 4, true);

const bits = new Uint32Array(soup.buffer);
let size = 1;
while (size < nTri * 6) size <<= 1;
const table = new Int32Array(size).fill(-1);
const uniq = [];
const remap = new Int32Array(nTri * 3);
for (let i = 0; i < nTri * 3; i++) {
  const x = bits[i * 3], y = bits[i * 3 + 1], z = bits[i * 3 + 2];
  let h = (Math.imul(x, 73856093) ^ Math.imul(y, 19349663) ^ Math.imul(z, 83492791)) & (size - 1);
  for (;;) {
    const s = table[h];
    if (s === -1) {
      table[h] = uniq.length / 3;
      remap[i] = uniq.length / 3;
      uniq.push(soup[i * 3], soup[i * 3 + 1], soup[i * 3 + 2]);
      break;
    }
    if (soup[i * 3] === uniq[s * 3] && soup[i * 3 + 1] === uniq[s * 3 + 1] && soup[i * 3 + 2] === uniq[s * 3 + 2]) {
      remap[i] = s;
      break;
    }
    h = (h + 1) & (size - 1);
  }
}
const V = uniq.length / 3;
const P = Float64Array.from(uniq);
let faceList = [];
for (let t = 0; t < nTri; t++) {
  const a = remap[t * 3], b = remap[t * 3 + 1], c = remap[t * 3 + 2];
  if (a === b || b === c || a === c) continue;
  faceList.push(a, b, c);
}
const F0 = faceList.length / 3;
const F = Int32Array.from(faceList);
faceList = null;
const alive = new Uint8Array(F0).fill(1);
let liveFaces = F0;

/* ---- adjacency + quadrics ---------------------------------------------------------------------------------- */
const vf = Array.from({ length: V }, () => []);
for (let f = 0; f < F0; f++) for (let k = 0; k < 3; k++) vf[F[f * 3 + k]].push(f);

const Q = new Float64Array(V * 10);
function addPlane(v, a, b, c, d, w) {
  const o = v * 10;
  Q[o] += w * a * a; Q[o + 1] += w * a * b; Q[o + 2] += w * a * c; Q[o + 3] += w * a * d;
  Q[o + 4] += w * b * b; Q[o + 5] += w * b * c; Q[o + 6] += w * b * d;
  Q[o + 7] += w * c * c; Q[o + 8] += w * c * d; Q[o + 9] += w * d * d;
}
function faceNormal(f, out) {
  const a = F[f * 3] * 3, b = F[f * 3 + 1] * 3, c = F[f * 3 + 2] * 3;
  const ux = P[b] - P[a], uy = P[b + 1] - P[a + 1], uz = P[b + 2] - P[a + 2];
  const vx = P[c] - P[a], vy = P[c + 1] - P[a + 1], vz = P[c + 2] - P[a + 2];
  out[0] = uy * vz - uz * vy; out[1] = uz * vx - ux * vz; out[2] = ux * vy - uy * vx;
  return Math.hypot(out[0], out[1], out[2]); // 2 × area
}
const nrm = [0, 0, 0];
for (let f = 0; f < F0; f++) {
  const area2 = faceNormal(f, nrm);
  if (area2 === 0) continue;
  const a = nrm[0] / area2, b = nrm[1] / area2, c = nrm[2] / area2;
  const p = F[f * 3] * 3;
  const d = -(a * P[p] + b * P[p + 1] + c * P[p + 2]);
  for (let k = 0; k < 3; k++) addPlane(F[f * 3 + k], a, b, c, d, area2 / 2);
}
// Boundary / non-manifold edges: add a plane through the edge, perpendicular to the face, so open borders do not drift.
const edgeCount = new Map();
const ekey = (a, b) => (a < b ? a * V + b : b * V + a);
for (let f = 0; f < F0; f++) for (let k = 0; k < 3; k++) {
  const key = ekey(F[f * 3 + k], F[f * 3 + ((k + 1) % 3)]);
  edgeCount.set(key, (edgeCount.get(key) ?? 0) + 1);
}
let openEdges = 0;
for (let f = 0; f < F0; f++) {
  const area2 = faceNormal(f, nrm);
  if (area2 === 0) continue;
  for (let k = 0; k < 3; k++) {
    const a = F[f * 3 + k], b = F[f * 3 + ((k + 1) % 3)];
    if (edgeCount.get(ekey(a, b)) === 2) continue;
    openEdges++;
    const ex = P[b * 3] - P[a * 3], ey = P[b * 3 + 1] - P[a * 3 + 1], ez = P[b * 3 + 2] - P[a * 3 + 2];
    const el = Math.hypot(ex, ey, ez);
    // m = e × n
    let mx = ey * nrm[2] - ez * nrm[1], my = ez * nrm[0] - ex * nrm[2], mz = ex * nrm[1] - ey * nrm[0];
    const ml = Math.hypot(mx, my, mz);
    if (!ml) continue;
    mx /= ml; my /= ml; mz /= ml;
    const d = -(mx * P[a * 3] + my * P[a * 3 + 1] + mz * P[a * 3 + 2]);
    const w = 20 * el * el;
    addPlane(a, mx, my, mz, d, w);
    addPlane(b, mx, my, mz, d, w);
  }
}

/* ---- cost of collapsing (a, b) ------------------------------------------------------------------------------ */
const qs = new Float64Array(10);
const best = [0, 0, 0];
function qErr(q, x, y, z) {
  return q[0] * x * x + 2 * q[1] * x * y + 2 * q[2] * x * z + 2 * q[3] * x + q[4] * y * y + 2 * q[5] * y * z + 2 * q[6] * y + q[7] * z * z + 2 * q[8] * z + q[9];
}
function collapseCost(a, b) {
  for (let i = 0; i < 10; i++) qs[i] = Q[a * 10 + i] + Q[b * 10 + i];
  const ax = P[a * 3], ay = P[a * 3 + 1], az = P[a * 3 + 2], bx = P[b * 3], by = P[b * 3 + 1], bz = P[b * 3 + 2];
  const mx = (ax + bx) / 2, my = (ay + by) / 2, mz = (az + bz) / 2;
  const el = Math.hypot(ax - bx, ay - by, az - bz);
  // Solve A v = -b for the optimal position.
  const a00 = qs[0], a01 = qs[1], a02 = qs[2], a11 = qs[4], a12 = qs[5], a22 = qs[7];
  const b0 = -qs[3], b1 = -qs[6], b2 = -qs[8];
  const det = a00 * (a11 * a22 - a12 * a12) - a01 * (a01 * a22 - a12 * a02) + a02 * (a01 * a12 - a11 * a02);
  let bestC = Infinity;
  const tryPos = (x, y, z) => {
    const c = qErr(qs, x, y, z);
    if (c < bestC) { bestC = c; best[0] = x; best[1] = y; best[2] = z; }
  };
  tryPos(ax, ay, az);
  tryPos(bx, by, bz);
  tryPos(mx, my, mz);
  if (Math.abs(det) > 1e-9 * Math.max(1e-12, (a00 + a11 + a22) ** 3)) {
    const x = (b0 * (a11 * a22 - a12 * a12) - a01 * (b1 * a22 - a12 * b2) + a02 * (b1 * a12 - a11 * b2)) / det;
    const y = (a00 * (b1 * a22 - a12 * b2) - b0 * (a01 * a22 - a12 * a02) + a02 * (a01 * b2 - b1 * a02)) / det;
    const z = (a00 * (a11 * b2 - b1 * a12) - a01 * (a01 * b2 - b1 * a02) + b0 * (a01 * a12 - a11 * a02)) / det;
    if (Math.hypot(x - mx, y - my, z - mz) <= el * 1.5) tryPos(x, y, z);
  }
  return Math.max(0, bestC);
}

/* ---- priority queue (lazy deletion by per-vertex version) -------------------------------------------------- */
const ver = new Int32Array(V);
const dead = new Uint8Array(V);
let cap = 1 << 20, hn = 0;
let hc = new Float64Array(cap), ha = new Int32Array(cap), hb = new Int32Array(cap), hva = new Int32Array(cap), hvb = new Int32Array(cap);
function hSwap(i, j) {
  let t = hc[i]; hc[i] = hc[j]; hc[j] = t;
  t = ha[i]; ha[i] = ha[j]; ha[j] = t;
  t = hb[i]; hb[i] = hb[j]; hb[j] = t;
  t = hva[i]; hva[i] = hva[j]; hva[j] = t;
  t = hvb[i]; hvb[i] = hvb[j]; hvb[j] = t;
}
function push(c, a, b) {
  if (hn === cap) {
    cap *= 2;
    const g = (arr, T) => { const n = new T(cap); n.set(arr); return n; };
    hc = g(hc, Float64Array); ha = g(ha, Int32Array); hb = g(hb, Int32Array); hva = g(hva, Int32Array); hvb = g(hvb, Int32Array);
  }
  let i = hn++;
  hc[i] = c; ha[i] = a; hb[i] = b; hva[i] = ver[a]; hvb[i] = ver[b];
  while (i > 0) {
    const p = (i - 1) >> 1;
    if (hc[p] <= hc[i]) break;
    hSwap(p, i);
    i = p;
  }
}
function pop() {
  const out = [hc[0], ha[0], hb[0], hva[0], hvb[0]];
  hn--;
  if (hn > 0) {
    hc[0] = hc[hn]; ha[0] = ha[hn]; hb[0] = hb[hn]; hva[0] = hva[hn]; hvb[0] = hvb[hn];
    let i = 0;
    for (;;) {
      const l = i * 2 + 1, r = l + 1;
      let m = i;
      if (l < hn && hc[l] < hc[m]) m = l;
      if (r < hn && hc[r] < hc[m]) m = r;
      if (m === i) break;
      hSwap(i, m);
      i = m;
    }
  }
  return out;
}
const seen = new Set();
for (let f = 0; f < F0; f++) for (let k = 0; k < 3; k++) {
  const a = F[f * 3 + k], b = F[f * 3 + ((k + 1) % 3)];
  const key = ekey(a, b);
  if (seen.has(key)) continue;
  seen.add(key);
  push(collapseCost(a, b), a, b);
}
seen.clear();

/* ---- collapse loop ----------------------------------------------------------------------------------------- */
const na = [0, 0, 0], nb = [0, 0, 0];
function tryCollapse(a, b, cost) {
  const fa = vf[a], fb = vf[b];
  // faces shared by a and b, and the vertices they close with
  const shared = [];
  for (const f of fa) if (alive[f] && (F[f * 3] === b || F[f * 3 + 1] === b || F[f * 3 + 2] === b)) shared.push(f);
  if (!shared.length || shared.length > 2) return false;
  const third = new Set();
  for (const f of shared) for (let k = 0; k < 3; k++) { const v = F[f * 3 + k]; if (v !== a && v !== b) third.add(v); }
  // link condition: the only common neighbours are the vertices opposite the shared faces
  const nbA = new Set();
  for (const f of fa) if (alive[f]) for (let k = 0; k < 3; k++) { const v = F[f * 3 + k]; if (v !== a && v !== b) nbA.add(v); }
  let common = 0;
  for (const f of fb) if (alive[f]) for (let k = 0; k < 3; k++) { const v = F[f * 3 + k]; if (v !== a && v !== b && nbA.has(v)) { common++; nbA.delete(v); nbA.add(-1 - v); } }
  if (common !== third.size) return false;
  // position (recomputed so it matches the cost) and fold-over / sliver check on every surviving face
  collapseCost(a, b);
  const px = best[0], py = best[1], pz = best[2];
  const check = (list, from) => {
    for (const f of list) {
      if (!alive[f] || shared.includes(f)) continue;
      const area0 = faceNormal(f, na);
      if (area0 === 0) return false;
      const save = [F[f * 3], F[f * 3 + 1], F[f * 3 + 2]];
      const sx = P[a * 3], sy = P[a * 3 + 1], sz = P[a * 3 + 2];
      for (let k = 0; k < 3; k++) if (F[f * 3 + k] === from) F[f * 3 + k] = a;
      P[a * 3] = px; P[a * 3 + 1] = py; P[a * 3 + 2] = pz;
      const area1 = faceNormal(f, nb);
      P[a * 3] = sx; P[a * 3 + 1] = sy; P[a * 3 + 2] = sz;
      F[f * 3] = save[0]; F[f * 3 + 1] = save[1]; F[f * 3 + 2] = save[2];
      if (area1 < area0 * 0.02) return false;
      if ((na[0] * nb[0] + na[1] * nb[1] + na[2] * nb[2]) / (area0 * area1) < 0.35) return false;
    }
    return true;
  };
  if (!check(fa, a) || !check(fb, b)) return false;
  // apply
  for (const f of shared) { alive[f] = 0; liveFaces--; }
  P[a * 3] = px; P[a * 3 + 1] = py; P[a * 3 + 2] = pz;
  for (let i = 0; i < 10; i++) Q[a * 10 + i] += Q[b * 10 + i];
  const merged = [];
  for (const f of fa) if (alive[f]) merged.push(f);
  for (const f of fb) {
    if (!alive[f]) continue;
    for (let k = 0; k < 3; k++) if (F[f * 3 + k] === b) F[f * 3 + k] = a;
    merged.push(f);
  }
  vf[a] = merged;
  vf[b] = [];
  dead[b] = 1;
  ver[a]++;
  ver[b]++;
  // the vertices around the merged one: drop their dead faces and re-queue the edges to `a`
  const around = new Set();
  for (const f of merged) for (let k = 0; k < 3; k++) { const v = F[f * 3 + k]; if (v !== a) around.add(v); }
  for (const v of around) {
    vf[v] = vf[v].filter((f) => alive[f]);
    push(collapseCost(a, v), a, v);
  }
  maxCost = Math.max(maxCost, cost);
  return true;
}
let maxCost = 0, rejected = 0;
while (liveFaces > TARGET && hn > 0) {
  const [cost, a, b, va, vb] = pop();
  if (dead[a] || dead[b] || ver[a] !== va || ver[b] !== vb) continue;
  if (!tryCollapse(a, b, cost)) rejected++;
}

/* ---- write ------------------------------------------------------------------------------------------------- */
const idx = new Int32Array(V).fill(-1);
const outPos = [];
const outIdx = [];
for (let f = 0; f < F0; f++) {
  if (!alive[f]) continue;
  const a = F[f * 3], b = F[f * 3 + 1], c = F[f * 3 + 2];
  if (a === b || b === c || a === c) continue;
  for (const v of [a, b, c]) {
    if (idx[v] === -1) { idx[v] = outPos.length / 3; outPos.push(P[v * 3], P[v * 3 + 1], P[v * 3 + 2]); }
    outIdx.push(idx[v]);
  }
}
const nv = outPos.length / 3, nt = outIdx.length / 3;
const positions = Float32Array.from(outPos);
const indices = nv <= 65535 ? Uint16Array.from(outIdx) : Uint32Array.from(outIdx);
const head = new Uint32Array([0x314d4741, nv, nt, indices.BYTES_PER_ELEMENT]);
const out = Buffer.concat([Buffer.from(head.buffer), Buffer.from(positions.buffer), Buffer.from(indices.buffer, indices.byteOffset, indices.byteLength)]);
fs.writeFileSync(outPath, out);
console.log(
  `${inPath}: ${nTri} triangles, ${V} welded vertices, ${openEdges} open/non-manifold edge sides → ${nt} triangles, ${nv} vertices, ` +
    `${(out.length / 1e6).toFixed(2)} MB; largest collapse error ≈ ${Math.sqrt(maxCost).toFixed(4)} units (${rejected} collapses rejected)`,
);
