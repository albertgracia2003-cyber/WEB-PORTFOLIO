import type { CSSProperties } from "react";

/** Join class names, skipping falsy values. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Zero-padded index, e.g. 3 → "03". */
export function pad(n: number, width = 2): string {
  return String(n).padStart(width, "0");
}

/** Deterministic PRNG (mulberry32). Same seed → same sequence, on server and client. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/** Round to 2 decimals for compact SVG output. */
export function r2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Inline style for staggered reveal delays: style={rd(120)}. */
export function rd(ms: number): CSSProperties {
  return { "--reveal-delay": `${ms}ms` } as CSSProperties;
}
