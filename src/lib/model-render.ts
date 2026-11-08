/**
 * Shared plain-WebGL pieces for the project model viewers (ORTESIS stack, hero machine):
 * shaders, colour parsing, small maths helpers, soft floor shadow and buffered fetch.
 */
import type { Mat4 } from "@/lib/sculpture";

export type Rgb = [number, number, number];

/* ---------- shaders ------------------------------------------------ */

export const MODEL_VS = `
attribute vec3 aPos;
attribute vec3 aNor;
uniform mat4 uMV;
uniform mat4 uProj;
uniform mat3 uN;
varying vec3 vN;
varying vec3 vP;
void main() {
  vec4 p = uMV * vec4(aPos, 1.0);
  vP = p.xyz;
  vN = uN * aNor;
  gl_Position = uProj * p;
}`;

// Studio lights are fixed to the camera, so the geometry stays readable from every angle.
export const MODEL_FS = `
precision highp float;
uniform vec3 uColor;
uniform vec3 uKey;
uniform vec3 uFill;
uniform vec3 uRimCol;
uniform vec3 uBg;
uniform float uAmbient;
uniform float uRim;
uniform float uSpec;
uniform float uDim;
varying vec3 vN;
varying vec3 vP;
void main() {
  vec3 N = normalize(vN);
  float back = 1.0;
  if (!gl_FrontFacing) { N = -N; back = 0.8; }
  vec3 V = normalize(-vP);
  vec3 L1 = normalize(vec3(-0.55, 0.7, 0.55));
  vec3 L2 = normalize(vec3(0.9, 0.2, -0.35));
  vec3 L3 = normalize(vec3(0.4, -0.55, 0.7));
  float d1 = max(dot(N, L1), 0.0);
  float d2 = max(dot(N, L2), 0.0);
  float d3 = max(dot(N, L3), 0.0);
  float hemi = 0.78 + 0.22 * N.y;
  vec3 H = normalize(L1 + V);
  float spec = pow(max(dot(N, H), 0.0), 48.0) * uSpec;
  float fres = pow(1.0 - max(dot(N, V), 0.0), 4.0);
  vec3 c = uColor * (uAmbient * hemi + d1 * uKey + d3 * uFill * 0.5) * back
         + uRimCol * (d2 * 0.22 + fres * uRim)
         + vec3(spec);
  c = pow(clamp(c, 0.0, 1.0), vec3(0.94));
  gl_FragColor = vec4(mix(c, uBg, uDim), 1.0);
}`;

/**
 * Presentation material for the homepage hero variants: warm ivory satin.
 * Soft wrapped key light with a warm taupe shadow tint (uShade), a broad satin sheen, steel-blue environment
 * reflection that grows towards grazing angles (uFill), and a restrained terracotta bounce from below-right (uRimCol).
 * Highlights are tone-mapped so nothing clips to pure white. Geometry is untouched.
 */
export const SATIN_FS = `
precision highp float;
uniform vec3 uColor;
uniform vec3 uKey;
uniform vec3 uFill;
uniform vec3 uRimCol;
uniform vec3 uShade;
uniform vec3 uBg;
uniform float uAmbient;
uniform float uRim;
uniform float uSpec;
uniform float uDim;
varying vec3 vN;
varying vec3 vP;
void main() {
  vec3 N = normalize(vN);
  float back = 1.0;
  if (!gl_FrontFacing) { N = -N; back = 0.82; }
  vec3 V = normalize(-vP);
  vec3 L = normalize(vec3(-0.5, 0.78, 0.6));
  float ndl = dot(N, L);
  float wrap = clamp((ndl + 0.5) / 1.5, 0.0, 1.0);
  wrap = wrap * wrap * (3.0 - 2.0 * wrap);
  float ndv = max(dot(N, V), 0.0);
  float graze = pow(1.0 - ndv, 2.4);
  vec3 R = reflect(-V, N);
  float sky = smoothstep(-0.25, 0.95, R.y);
  vec3 bounceDir = normalize(vec3(0.65, -0.62, 0.25));
  float bounce = smoothstep(-0.05, 0.95, dot(N, bounceDir));
  vec3 H = normalize(L + V);
  float nh = max(dot(N, H), 0.0);
  float sheen = (pow(nh, 12.0) * 0.55 + pow(nh, 56.0) * 0.45) * uSpec;
  vec3 diff = mix(uShade * uAmbient, uKey, wrap);
  vec3 c = uColor * diff * back;
  c += uFill * sky * (0.1 + 0.9 * graze) * 0.55;
  c += uRimCol * bounce * uRim * (0.35 + 0.65 * (1.0 - wrap));
  c += uKey * sheen * (0.4 + 0.6 * wrap);
  c = vec3(1.0) - exp(-c * 1.45);
  c = pow(clamp(c, 0.0, 1.0), vec3(0.96));
  gl_FragColor = vec4(mix(c, uBg, uDim), 1.0);
}`;

export const FLAT_VS = `
attribute vec3 aPos;
attribute vec2 aUv;
uniform mat4 uMVP;
varying vec2 vUv;
void main() {
  vUv = aUv;
  gl_Position = uMVP * vec4(aPos, 1.0);
}`;

// Mode 0: soft floor shadow (texture alpha). Mode 1: dashed axis (vUv.x = length in mm).
export const FLAT_FS = `
precision mediump float;
uniform sampler2D uTex;
uniform vec3 uColor;
uniform float uAlpha;
uniform float uMode;
varying vec2 vUv;
void main() {
  float a;
  if (uMode < 0.5) {
    a = texture2D(uTex, vUv).a;
  } else {
    if (mod(vUv.x, 11.0) > 5.0) discard;
    a = 1.0;
  }
  gl_FragColor = vec4(uColor * uAlpha * a, uAlpha * a);
}`;

/* ---------- colour ------------------------------------------------- */

export function parseColor(v: string, fallback: Rgb): Rgb {
  const s = v.trim();
  if (/^#([0-9a-f]{3}){1,2}$/i.test(s)) {
    const h = s.length === 4 ? s.replace(/^#(.)(.)(.)$/, "#$1$1$2$2$3$3") : s;
    return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as Rgb;
  }
  const m = s.match(/rgba?\(([^)]+)\)/i);
  if (m) {
    const [r, g, b] = m[1]!.split(/[\s,/]+/).map(Number);
    if ([r, g, b].every((x) => Number.isFinite(x))) return [r! / 255, g! / 255, b! / 255];
  }
  return fallback;
}
export const mix = (a: Rgb, b: Rgb, t: number): Rgb => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];


export function apply(m: Mat4, x: number, y: number, z: number): [number, number, number, number] {
  return [
    m[0]! * x + m[4]! * y + m[8]! * z + m[12]!,
    m[1]! * x + m[5]! * y + m[9]! * z + m[13]!,
    m[2]! * x + m[6]! * y + m[10]! * z + m[14]!,
    m[3]! * x + m[7]! * y + m[11]! * z + m[15]!,
  ];
}
export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const mat3 = (m: Mat4) => new Float32Array([m[0]!, m[1]!, m[2]!, m[4]!, m[5]!, m[6]!, m[8]!, m[9]!, m[10]!]);

/** Soft floor shadow from the combined footprint (vertex splat + box blur). */
export function footprintTexture(samples: Float32Array[], rect: { x0: number; z0: number; x1: number; z1: number }, W = 192, H = 96): Uint8Array {
  const grid = new Float32Array(W * H);
  for (const s of samples) {
    for (let i = 0; i < s.length; i += 3) {
      const u = Math.floor(((s[i]! - rect.x0) / (rect.x1 - rect.x0)) * W);
      const v = Math.floor(((s[i + 2]! - rect.z0) / (rect.z1 - rect.z0)) * H);
      if (u >= 0 && u < W && v >= 0 && v < H) grid[v * W + u] = 1;
    }
  }
  const tmp = new Float32Array(W * H);
  const blur = (r: number) => {
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        let a = 0;
        for (let k = -r; k <= r; k++) a += grid[y * W + clamp(x + k, 0, W - 1)]!;
        tmp[y * W + x] = a / (2 * r + 1);
      }
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        let a = 0;
        for (let k = -r; k <= r; k++) a += tmp[clamp(y + k, 0, H - 1) * W + x]!;
        grid[y * W + x] = a / (2 * r + 1);
      }
  };
  blur(3);
  for (let i = 0; i < grid.length; i++) grid[i] = Math.min(1, grid[i]! * 2.2);
  blur(5);
  blur(5);
  const out = new Uint8Array(W * H);
  for (let i = 0; i < out.length; i++) out[i] = Math.round(clamp(grid[i]!, 0, 1) * 255);
  return out;
}

export async function fetchBuffer(url: string, signal: AbortSignal, onProgress: (loaded: number, total: number) => void): Promise<ArrayBuffer> {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const total = Number(res.headers.get("content-length")) || 0;
  if (!res.body) {
    const b = await res.arrayBuffer();
    onProgress(b.byteLength, b.byteLength);
    return b;
  }
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let loaded = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.byteLength;
    onProgress(loaded, total);
  }
  const out = new Uint8Array(loaded);
  let o = 0;
  for (const c of chunks) {
    out.set(c, o);
    o += c.byteLength;
  }
  return out.buffer;
}

