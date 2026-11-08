#!/usr/bin/env node
/**
 * Lossless web derivatives of the ORTESIS STUDIO STL models.
 *
 *   node scripts/pack-stl-models.mjs [dir]      (default: public/assets/ortesis-studio/models)
 *
 * For every `<name>.stl` it writes `<name>.mesh.bin`:
 *   - identical vertex coordinates (float32, bit-for-bit) and identical triangles;
 *   - duplicate vertices welded (an STL repeats each shared vertex), uint16 indices
 *     when there are < 65 536 vertices;
 *   - STL facet normals and attribute bytes dropped (the viewer recomputes normals).
 * Layout: "AGM1" magic, uint32 vertexCount, uint32 triangleCount, uint32 indexBytes,
 * float32[vertexCount*3], uint16|uint32[triangleCount*3] (little-endian).
 * The STL files are only read, never modified. Each output is verified against its source.
 */
import fs from "node:fs";
import path from "node:path";

const dir = path.resolve(process.argv[2] ?? "public/assets/ortesis-studio/models");

function readStlSoup(buf) {
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  const dv = new DataView(ab);
  const tris = ab.byteLength >= 84 ? dv.getUint32(80, true) : 0;
  if (ab.byteLength >= 84 && 84 + tris * 50 === ab.byteLength) {
    const soup = new Float32Array(tris * 9);
    for (let t = 0; t < tris; t++) for (let k = 0; k < 9; k++) soup[t * 9 + k] = dv.getFloat32(84 + t * 50 + 12 + k * 4, true);
    return soup;
  }
  const text = buf.toString("utf8");
  const v = [...text.matchAll(/vertex\s+(\S+)\s+(\S+)\s+(\S+)/gi)].flatMap((m) => [+m[1], +m[2], +m[3]]);
  if (!v.length || v.length % 9) throw new Error("not a valid STL");
  return Float32Array.from(v);
}

function weld(soup) {
  const n = soup.length / 3;
  const bits = new Uint32Array(soup.buffer, soup.byteOffset, soup.length);
  let size = 1;
  while (size < n * 2) size <<= 1;
  const table = new Int32Array(size).fill(-1);
  const unique = new Float32Array(soup.length);
  const ubits = new Uint32Array(unique.buffer);
  const remap = new Uint32Array(n);
  let count = 0;
  for (let i = 0; i < n; i++) {
    const x = bits[i * 3], y = bits[i * 3 + 1], z = bits[i * 3 + 2];
    let h = (Math.imul(x, 73856093) ^ Math.imul(y, 19349663) ^ Math.imul(z, 83492791)) & (size - 1);
    for (;;) {
      const s = table[h];
      if (s === -1) {
        table[h] = count;
        ubits[count * 3] = x; ubits[count * 3 + 1] = y; ubits[count * 3 + 2] = z;
        remap[i] = count++;
        break;
      }
      if (ubits[s * 3] === x && ubits[s * 3 + 1] === y && ubits[s * 3 + 2] === z) { remap[i] = s; break; }
      h = (h + 1) & (size - 1);
    }
  }
  return { positions: unique.slice(0, count * 3), indices: count <= 65535 ? Uint16Array.from(remap) : remap };
}

const files = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith(".stl")).sort();
if (!files.length) throw new Error(`no .stl files in ${dir}`);
for (const f of files) {
  const src = fs.readFileSync(path.join(dir, f));
  const soup = readStlSoup(src);
  const { positions, indices } = weld(soup);
  const ib = indices.BYTES_PER_ELEMENT;
  const head = new Uint32Array([0x314d4741, positions.length / 3, indices.length / 3, ib]);
  const out = Buffer.concat([Buffer.from(head.buffer), Buffer.from(positions.buffer), Buffer.from(indices.buffer, indices.byteOffset, indices.byteLength)]);
  // Verify: every triangle corner resolves to the exact source float bits.
  const sb = new Uint32Array(soup.buffer), pb = new Uint32Array(positions.buffer);
  for (let i = 0; i < indices.length; i++) for (let k = 0; k < 3; k++) if (pb[indices[i] * 3 + k] !== sb[i * 3 + k]) throw new Error(`${f}: mismatch at corner ${i}`);
  const name = f.replace(/\.stl$/i, ".mesh.bin");
  fs.writeFileSync(path.join(dir, name), out);
  console.log(`${f}: ${indices.length / 3} triangles, ${positions.length / 3} vertices — ${(src.length / 1e6).toFixed(2)} MB → ${name} ${(out.length / 1e6).toFixed(2)} MB (verified)`);
}
