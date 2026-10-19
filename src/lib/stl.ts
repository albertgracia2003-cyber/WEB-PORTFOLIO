/**
 * Mesh loading for the ORTESIS STUDIO model stack.
 *
 * - `parseStl` reads binary or ASCII STL and welds identical vertices, so the
 *   result is an indexed mesh with exactly the source triangles and the
 *   source vertex coordinates (bit-for-bit; nothing is simplified).
 * - `parsePackedMesh` reads the optional lossless derivative written by
 *   `scripts/pack-stl-models.mjs` (same vertices, same triangles, ~4x smaller).
 * - `buildRenderMesh` expands an indexed mesh into GPU arrays with smooth
 *   normals that keep hard edges (crease angle).
 *
 * Coordinates stay in the source units (mm) and the source coordinate system.
 */

export interface IndexedMesh {
  /** xyz per vertex, source units. */
  positions: Float32Array;
  /** 3 vertex indices per triangle. */
  indices: Uint32Array | Uint16Array;
  min: [number, number, number];
  max: [number, number, number];
}

export interface RenderMesh {
  positions: Float32Array;
  normals: Float32Array;
  count: number;
}

const PACK_MAGIC = 0x314d4741; // "AGM1" little-endian

function bounds(positions: Float32Array): Pick<IndexedMesh, "min" | "max"> {
  const min: [number, number, number] = [Infinity, Infinity, Infinity];
  const max: [number, number, number] = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < positions.length; i += 3) {
    for (let k = 0; k < 3; k++) {
      const v = positions[i + k]!;
      if (v < min[k]!) min[k] = v;
      if (v > max[k]!) max[k] = v;
    }
  }
  return { min, max };
}

/** Weld bit-identical vertices of a triangle soup (9 floats per triangle). */
function weld(soup: Float32Array): IndexedMesh {
  const n = soup.length / 3;
  const bits = new Uint32Array(soup.buffer, soup.byteOffset, soup.length);
  let size = 1;
  while (size < n * 2) size <<= 1;
  const mask = size - 1;
  const table = new Int32Array(size).fill(-1);
  const remap = new Uint32Array(n);
  const unique = new Float32Array(soup.length);
  const ubits = new Uint32Array(unique.buffer);
  let count = 0;
  for (let i = 0; i < n; i++) {
    const x = bits[i * 3]!;
    const y = bits[i * 3 + 1]!;
    const z = bits[i * 3 + 2]!;
    let h = (Math.imul(x, 73856093) ^ Math.imul(y, 19349663) ^ Math.imul(z, 83492791)) & mask;
    for (;;) {
      const slot = table[h]!;
      if (slot === -1) {
        table[h] = count;
        unique[count * 3] = soup[i * 3]!;
        unique[count * 3 + 1] = soup[i * 3 + 1]!;
        unique[count * 3 + 2] = soup[i * 3 + 2]!;
        remap[i] = count++;
        break;
      }
      if (ubits[slot * 3] === x && ubits[slot * 3 + 1] === y && ubits[slot * 3 + 2] === z) {
        remap[i] = slot;
        break;
      }
      h = (h + 1) & mask;
    }
  }
  const positions = unique.slice(0, count * 3);
  const indices = count <= 65535 ? Uint16Array.from(remap) : remap;
  return { positions, indices, ...bounds(positions) };
}

function isBinaryStl(buf: ArrayBuffer): boolean {
  if (buf.byteLength < 84) return false;
  const tris = new DataView(buf).getUint32(80, true);
  return 84 + tris * 50 === buf.byteLength;
}

export function parseStl(buf: ArrayBuffer): IndexedMesh {
  if (isBinaryStl(buf)) {
    const dv = new DataView(buf);
    const tris = dv.getUint32(80, true);
    const soup = new Float32Array(tris * 9);
    for (let t = 0; t < tris; t++) {
      const o = 84 + t * 50 + 12; // skip the facet normal
      for (let k = 0; k < 9; k++) soup[t * 9 + k] = dv.getFloat32(o + k * 4, true);
    }
    return weld(soup);
  }
  // ASCII STL
  const text = new TextDecoder().decode(buf);
  if (!/^\s*solid/i.test(text)) throw new Error("Not an STL file");
  const values: number[] = [];
  const re = /vertex\s+(\S+)\s+(\S+)\s+(\S+)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) values.push(Number(m[1]), Number(m[2]), Number(m[3]));
  if (!values.length || values.length % 9) throw new Error("STL contains no complete triangles");
  return weld(Float32Array.from(values));
}

/** Lossless derivative: header (magic, vertexCount, triangleCount, indexBytes) + float32 xyz + uint16/uint32 indices. */
export function parsePackedMesh(buf: ArrayBuffer): IndexedMesh {
  const dv = new DataView(buf);
  if (buf.byteLength < 16 || dv.getUint32(0, true) !== PACK_MAGIC) throw new Error("Not a packed mesh");
  const verts = dv.getUint32(4, true);
  const tris = dv.getUint32(8, true);
  const ib = dv.getUint32(12, true);
  const posBytes = verts * 12;
  if (buf.byteLength < 16 + posBytes + tris * 3 * ib) throw new Error("Packed mesh is truncated");
  const positions = new Float32Array(buf.slice(16, 16 + posBytes));
  const idx = buf.slice(16 + posBytes, 16 + posBytes + tris * 3 * ib);
  const indices = ib === 2 ? new Uint16Array(idx) : new Uint32Array(idx);
  return { positions, indices, ...bounds(positions) };
}

/**
 * Expand to GPU arrays. Normals are area-weighted vertex normals, except where
 * a face bends more than `creaseDeg` away from them (keeps edges crisp).
 */
export function buildRenderMesh(mesh: IndexedMesh, creaseDeg = 48): RenderMesh {
  const { positions: P, indices: I } = mesh;
  const tris = I.length / 3;
  const faceN = new Float32Array(tris * 3);
  const vertN = new Float32Array(P.length);
  for (let t = 0; t < tris; t++) {
    const a = I[t * 3]! * 3;
    const b = I[t * 3 + 1]! * 3;
    const c = I[t * 3 + 2]! * 3;
    const ux = P[b]! - P[a]!, uy = P[b + 1]! - P[a + 1]!, uz = P[b + 2]! - P[a + 2]!;
    const vx = P[c]! - P[a]!, vy = P[c + 1]! - P[a + 1]!, vz = P[c + 2]! - P[a + 2]!;
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx; // |n| = 2·area
    faceN[t * 3] = nx;
    faceN[t * 3 + 1] = ny;
    faceN[t * 3 + 2] = nz;
    for (const v of [a, b, c]) {
      vertN[v] = vertN[v]! + nx;
      vertN[v + 1] = vertN[v + 1]! + ny;
      vertN[v + 2] = vertN[v + 2]! + nz;
    }
  }
  const cosCrease = Math.cos((creaseDeg * Math.PI) / 180);
  const positions = new Float32Array(tris * 9);
  const normals = new Float32Array(tris * 9);
  for (let t = 0; t < tris; t++) {
    let fx = faceN[t * 3]!, fy = faceN[t * 3 + 1]!, fz = faceN[t * 3 + 2]!;
    const fl = Math.hypot(fx, fy, fz) || 1;
    fx /= fl;
    fy /= fl;
    fz /= fl;
    for (let k = 0; k < 3; k++) {
      const v = I[t * 3 + k]! * 3;
      const o = t * 9 + k * 3;
      positions[o] = P[v]!;
      positions[o + 1] = P[v + 1]!;
      positions[o + 2] = P[v + 2]!;
      let nx = vertN[v]!, ny = vertN[v + 1]!, nz = vertN[v + 2]!;
      const l = Math.hypot(nx, ny, nz) || 1;
      nx /= l;
      ny /= l;
      nz /= l;
      if (nx * fx + ny * fy + nz * fz < cosCrease) {
        nx = fx;
        ny = fy;
        nz = fz;
      }
      normals[o] = nx;
      normals[o + 1] = ny;
      normals[o + 2] = nz;
    }
  }
  return { positions, normals, count: tris * 3 };
}

/** Evenly strided subset of vertices (used to place label leaders on the silhouette). */
export function sampleVertices(mesh: IndexedMesh, max = 480): Float32Array {
  const n = mesh.positions.length / 3;
  const step = Math.max(1, Math.floor(n / max));
  const out: number[] = [];
  for (let i = 0; i < n; i += step) out.push(mesh.positions[i * 3]!, mesh.positions[i * 3 + 1]!, mesh.positions[i * 3 + 2]!);
  return Float32Array.from(out);
}
