/**
 * Decoder for the CAD-assembly web derivative written by `scripts/pack-assembly.mjs`
 * (format "AGM2", gzip-compressed): unique bodies + per-part transforms + height groups.
 * Coordinates stay in the source units (mm) and coordinate system (Z up).
 */
import type { IndexedMesh } from "@/lib/stl";

export type PartGroup = 0 | 1 | 2; // 0 fixed, 1 top, 2 bottom

export interface AssemblyPart {
  mesh: number;
  group: PartGroup;
  /** Column-major 4×4, source coordinates. */
  matrix: Float32Array;
  /** Mirrored copy (negative determinant): winding is reversed. */
  mirrored: boolean;
}

export interface Assembly {
  meshes: IndexedMesh[];
  parts: AssemblyPart[];
  min: [number, number, number];
  max: [number, number, number];
}

const MAGIC = 0x324d4741; // "AGM2"

export function parseAssembly(buf: ArrayBuffer): Assembly {
  const dv = new DataView(buf);
  if (buf.byteLength < 36 || dv.getUint32(0, true) !== MAGIC) throw new Error("Not an assembly file");
  const meshCount = dv.getUint32(4, true);
  const partCount = dv.getUint32(8, true);
  const f = (o: number) => dv.getFloat32(o, true);
  const min: [number, number, number] = [f(12), f(16), f(20)];
  const max: [number, number, number] = [f(24), f(28), f(32)];
  let o = 36;
  const meshes: IndexedMesh[] = [];
  for (let m = 0; m < meshCount; m++) {
    const V = dv.getUint32(o, true);
    const T = dv.getUint32(o + 4, true);
    const qmin = [f(o + 8), f(o + 12), f(o + 16)];
    const step = [f(o + 20), f(o + 24), f(o + 28)];
    o += 32;
    const positions = new Float32Array(V * 3);
    const prev = [0, 0, 0];
    const bmin: [number, number, number] = [Infinity, Infinity, Infinity];
    const bmax: [number, number, number] = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < V; i++) {
      for (let k = 0; k < 3; k++) {
        const z = dv.getUint16(o, true);
        o += 2;
        const d = z & 1 ? -((z + 1) >> 1) : z >> 1;
        const q = (prev[k]! + d) & 0xffff;
        prev[k] = q;
        const v = qmin[k]! + q * step[k]!;
        positions[i * 3 + k] = v;
        if (v < bmin[k]!) bmin[k] = v;
        if (v > bmax[k]!) bmax[k] = v;
      }
    }
    const indices = new Uint16Array(T * 3);
    let seen = 0;
    for (let i = 0; i < T * 3; i++) {
      const c = dv.getUint16(o, true);
      o += 2;
      indices[i] = c === 0 ? seen++ : seen - c;
    }
    if (o % 4) o += 4 - (o % 4);
    meshes.push({ positions, indices, min: bmin, max: bmax });
  }
  const parts: AssemblyPart[] = [];
  for (let p = 0; p < partCount; p++) {
    const mesh = dv.getUint32(o, true);
    const group = dv.getUint32(o + 4, true) as PartGroup;
    const r = Array.from({ length: 12 }, (_, i) => f(o + 8 + i * 4));
    o += 56;
    // 3×4 row-major → 4×4 column-major
    const matrix = new Float32Array([r[0]!, r[4]!, r[8]!, 0, r[1]!, r[5]!, r[9]!, 0, r[2]!, r[6]!, r[10]!, 0, r[3]!, r[7]!, r[11]!, 1]);
    const det =
      r[0]! * (r[5]! * r[10]! - r[6]! * r[9]!) - r[1]! * (r[4]! * r[10]! - r[6]! * r[8]!) + r[2]! * (r[4]! * r[9]! - r[5]! * r[8]!);
    if (mesh >= meshCount) throw new Error("Corrupt assembly file");
    parts.push({ mesh, group, matrix, mirrored: det < 0 });
  }
  return { meshes, parts, min, max };
}

/**
 * Decompress a gzip buffer in the browser (DecompressionStream). Returns the buffer unchanged
 * when it is not gzip data — e.g. a host that served the file with `Content-Encoding: gzip`,
 * so the browser already decompressed it.
 */
export async function gunzip(buf: ArrayBuffer): Promise<ArrayBuffer> {
  const head = new Uint8Array(buf, 0, Math.min(2, buf.byteLength));
  if (!(head[0] === 0x1f && head[1] === 0x8b)) return buf;
  if (typeof DecompressionStream === "undefined") throw new Error("DecompressionStream unsupported");
  const stream = new Blob([buf]).stream().pipeThrough(new DecompressionStream("gzip"));
  return new Response(stream).arrayBuffer();
}
