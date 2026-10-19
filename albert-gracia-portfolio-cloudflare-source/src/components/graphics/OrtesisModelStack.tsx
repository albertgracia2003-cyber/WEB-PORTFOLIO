"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { ortesisModelStack as CFG } from "@/content/ortesis-models";
import { buildRenderMesh, parsePackedMesh, parseStl, sampleVertices, type IndexedMesh } from "@/lib/stl";
import { multiply, perspective, rotationX, rotationY, translation, type Mat4 } from "@/lib/sculpture";
import { FLAT_FS, FLAT_VS, MODEL_FS, MODEL_VS, apply, fetchBuffer, footprintTexture, mat3, mix, parseColor, type Rgb } from "@/lib/model-render";
import { cn } from "@/lib/utils";

/**
 * ORTESIS STUDIO — the five real project models as one exploded stack.
 * Plain WebGL (same approach as the hero artwork; no 3D library).
 *
 * - Models keep their shared coordinate system and scale; each one only gets
 *   a vertical display offset (see `layoutStack`).
 * - Loads when the section approaches the viewport. A still render (poster)
 *   holds the space while loading and stands in when WebGL is unavailable.
 * - Renders on demand (only while something changes); all GPU resources are
 *   released on unmount.
 * - A fixed composition with one restrained response: with a mouse or pen,
 *   the whole stack tilts a few degrees towards the pointer (about its centre,
 *   as one group) and eases back when the pointer leaves. No orbit, zoom or
 *   selection; touch input and wheel are never captured, so page scrolling
 *   always works over it. Reduced motion → the default view only.
 *   Labels and leader lines are re-projected every frame.
 */

type Vec3 = [number, number, number];
type Status = "idle" | "loading" | "ready" | "partial" | "error" | "nogl";

const STAGES = CFG.stages;
const N = STAGES.length;
const DEG = Math.PI / 180;
const VIEW = { yaw: -38 * DEG, pitch: 21 * DEG, zoom: 1, fov: 24 * DEG };
/** Pointer tilt: maximum offsets from the default view, and easing time constant. */
const TILT = { yaw: 7 * DEG, pitch: 4 * DEG, tauMs: 220 };

interface Look {
  tones: Rgb[];
  bg: Rgb;
  accent: Rgb;
  shadow: Rgb;
  shadowAlpha: number;
  ambient: number;
  rim: number;
  spec: number;
  key: Rgb;
  fill: Rgb;
}

/** Brand colours come from the CSS tokens; only the lighting balance differs per theme. */
function readLook(el: Element): Look {
  const cs = getComputedStyle(el);
  const tok = (name: string, fb: string) => parseColor(cs.getPropertyValue(name), parseColor(fb, [0.5, 0.5, 0.5]));
  const dark = document.documentElement.getAttribute("data-theme") === "dark";
  const accent = tok("--color-accent", "#d86a50");
  const steel = tok("--color-steel-blue", "#46566c");
  const metal = tok("--color-metallic-blue", "#8e9cac");
  const pearl = tok("--color-pearl-blue", "#c9d2dc");
  const bg = tok("--bg", dark ? "#16191f" : "#e6e2dc");
  // Ramp from steel/metallic (raw scan) to pearl (design preview); the final orthosis is terracotta.
  const ramp = dark
    ? [mix(steel, metal, 0.5), mix(steel, metal, 0.85), mix(metal, pearl, 0.4), mix(metal, pearl, 0.85)]
    : [mix(steel, metal, 0.62), mix(metal, pearl, 0.1), mix(metal, pearl, 0.45), mix(metal, pearl, 0.8)];
  let k = 0;
  const plain = STAGES.filter((s) => !("accent" in s && s.accent)).length;
  const tones = STAGES.map((s) => {
    if ("accent" in s && s.accent) return accent;
    const t = plain > 1 ? k++ / (plain - 1) : 0;
    const idx = Math.min(ramp.length - 1.001, t * (ramp.length - 1));
    return mix(ramp[Math.floor(idx)]!, ramp[Math.floor(idx) + 1] ?? ramp[ramp.length - 1]!, idx % 1);
  });
  return dark
    ? { tones, bg, accent, shadow: [0, 0, 0], shadowAlpha: 0.55, ambient: 0.34, rim: 0.42, spec: 0.3, key: [0.74, 0.76, 0.8], fill: [0.28, 0.34, 0.44] }
    : { tones, bg, accent, shadow: [0.16, 0.13, 0.11], shadowAlpha: 0.26, ambient: 0.5, rim: 0.26, spec: 0.22, key: [0.56, 0.57, 0.6], fill: [0.3, 0.36, 0.44] };
}

/* ---------- maths -------------------------------------------------- */


/** Source axes → display axes (Y up). Z-up files are turned so their Z becomes display Y. */
const SOURCE_TO_DISPLAY = CFG.upAxis === "z" ? rotationX(-Math.PI / 2) : translation(0, 0, 0);

interface Box {
  min: Vec3;
  max: Vec3;
}

interface Slot {
  /** Model matrix (source → world). Identity rotation apart from the axis swap. */
  model: Mat4;
  box: Box;
  loaded: boolean;
}

/**
 * Shared registration: one horizontal offset for all models (centre of their
 * combined footprint), plus a vertical offset per model so consecutive
 * bounding boxes are separated by `gap`. No scaling, no rotation per model.
 */
function layoutStack(meshes: (IndexedMesh | null)[], gap: number): { slots: Slot[]; height: number } {
  const disp = meshes.map((m) => {
    if (!m) return null;
    const c: Vec3[] = [];
    for (const x of [m.min[0], m.max[0]]) for (const y of [m.min[1], m.max[1]]) for (const z of [m.min[2], m.max[2]]) {
      const p = apply(SOURCE_TO_DISPLAY, x, y, z);
      c.push([p[0], p[1], p[2]]);
    }
    return {
      min: [0, 1, 2].map((k) => Math.min(...c.map((p) => p[k]!))) as Vec3,
      max: [0, 1, 2].map((k) => Math.max(...c.map((p) => p[k]!))) as Vec3,
    };
  });
  const ok = disp.filter(Boolean) as Box[];
  const cx = (Math.min(...ok.map((b) => b.min[0])) + Math.max(...ok.map((b) => b.max[0]))) / 2;
  const cz = (Math.min(...ok.map((b) => b.min[2])) + Math.max(...ok.map((b) => b.max[2]))) / 2;
  const heights = ok.map((b) => b.max[1] - b.min[1]).sort((a, b) => a - b);
  const median = heights[Math.floor(heights.length / 2)] ?? 100;
  const ref = ok[0]!;
  let cursor = 0;
  const slots = disp.map((b) => {
    const box: Box = b ?? { min: [ref.min[0], 0, ref.min[2]], max: [ref.max[0], median, ref.max[2]] };
    const h = box.max[1] - box.min[1];
    const dy = cursor - box.min[1];
    const t = translation(-cx, dy, -cz);
    const slot: Slot = {
      model: multiply(t, SOURCE_TO_DISPLAY),
      box: { min: [box.min[0] - cx, cursor, box.min[2] - cz], max: [box.max[0] - cx, cursor + h, box.max[2] - cz] },
      loaded: Boolean(b),
    };
    cursor += h + gap;
    return slot;
  });
  return { slots, height: cursor - gap };
}

/* ---------- loading ------------------------------------------------ */

async function loadStage(stage: (typeof STAGES)[number], signal: AbortSignal, onProgress: (f: number) => void): Promise<IndexedMesh> {
  const report = (l: number, t: number) => onProgress(t ? l / t : 0.5);
  if ("packed" in stage && stage.packed) {
    try {
      return parsePackedMesh(await fetchBuffer(stage.packed, signal, report));
    } catch (e) {
      if (signal.aborted) throw e;
      // fall through to the original STL
    }
  }
  return parseStl(await fetchBuffer(stage.src, signal, report));
}

const nextTask = () => new Promise<void>((r) => setTimeout(r, 0));

/* ---------- component ---------------------------------------------- */

export function OrtesisModelStack({ className }: { className?: string }) {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const leaderRefs = useRef<(SVGGElement | null)[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [failed, setFailed] = useState<boolean[]>(() => STAGES.map(() => false));
  const [attempt, setAttempt] = useState(0);
  const uid = useId().replace(/:/g, "");
  const capId = `${uid}-cap`;
  const listId = `${uid}-list`;

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    // State changes go through a frame callback (no synchronous setState in the effect body).
    const unsupported = () => {
      const id = requestAnimationFrame(() => setStatus("nogl"));
      return () => cancelAnimationFrame(id);
    };
    const glOrNull = canvas.getContext("webgl", { antialias: true, alpha: true, premultipliedAlpha: true });
    if (!glOrNull) return unsupported();
    const gl: WebGLRenderingContext = glOrNull;
    const abort = new AbortController();
    let disposed = false;
    let raf = 0;
    const cleanups: (() => void)[] = [];

    /* --- programs --- */
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const link = (vs: string, fs: string) => {
      const p = gl.createProgram()!;
      const a = compile(gl.VERTEX_SHADER, vs);
      const b = compile(gl.FRAGMENT_SHADER, fs);
      gl.attachShader(p, a);
      gl.attachShader(p, b);
      gl.linkProgram(p);
      gl.deleteShader(a);
      gl.deleteShader(b);
      return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : null;
    };
    const modelProg = link(MODEL_VS, MODEL_FS);
    const flatProg = link(FLAT_VS, FLAT_FS);
    if (!modelProg || !flatProg) return unsupported();
    const loc = (p: WebGLProgram, names: string[]) => Object.fromEntries(names.map((n) => [n, gl.getUniformLocation(p, n)]));
    const MU = loc(modelProg, ["uMV", "uProj", "uN", "uColor", "uKey", "uFill", "uRimCol", "uBg", "uAmbient", "uRim", "uSpec", "uDim"]);
    const FU = loc(flatProg, ["uMVP", "uTex", "uColor", "uAlpha", "uMode"]);
    const mA = { pos: gl.getAttribLocation(modelProg, "aPos"), nor: gl.getAttribLocation(modelProg, "aNor") };
    const fA = { pos: gl.getAttribLocation(flatProg, "aPos"), uv: gl.getAttribLocation(flatProg, "aUv") };

    const buffers: WebGLBuffer[] = [];
    const textures: WebGLTexture[] = [];
    const makeBuffer = (data: Float32Array) => {
      const b = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      buffers.push(b);
      return b;
    };

    /* --- scene state (filled after loading) --- */
    let meshes: ({ pos: WebGLBuffer; nor: WebGLBuffer; count: number } | null)[] = [];
    let slots: Slot[] = [];
    let samplesWorld: Float32Array[] = [];
    let stackH = 0;
    let floorY = 0;
    let shadowBuf: WebGLBuffer | null = null;
    let axisBuf: WebGLBuffer | null = null;
    let shadowTex: WebGLTexture | null = null;
    let look = readLook(root);

    const cur = { ...VIEW, ty: 0 };
    let fitDist = 1000;
    let cssW = 1;
    let cssH = 1;
    let region = { sx: 0, sy: 0, hw: 1, hh: 1, labelX: 0 };

    const viewRotation = (yaw: number, pitch: number) => multiply(rotationX(pitch), rotationY(yaw));

    const computeRegion = () => {
      const tall = cssW / cssH < 0.78 || cssW < 520;
      const labelFrac = tall ? 0.5 : 0.78;
      const left = tall ? -0.97 : -0.5; // desktop: keep clear of the section title
      const right = labelFrac * 2 - 1 - 0.05;
      const top = 0.9;
      const bottom = -0.9;
      region = { sx: (left + right) / 2, sy: (top + bottom) / 2, hw: (right - left) / 2, hh: (top - bottom) / 2, labelX: labelFrac * cssW };
    };

    /** Camera distance that keeps every model in frame for any yaw and across the tilt's pitch range. */
    const computeFit = () => {
      const f = 1 / Math.tan(VIEW.fov / 2);
      const aspect = cssW / cssH;
      const pts: Vec3[] = [];
      for (const s of slots)
        for (const x of [s.box.min[0], s.box.max[0]]) for (const y of [s.box.min[1], s.box.max[1]]) for (const z of [s.box.min[2], s.box.max[2]]) pts.push([x, y, z]);
      let d = 0;
      for (let k = 0; k < 9; k++) {
        const R = viewRotation(VIEW.yaw + (Math.floor(k / 3) - 1) * TILT.yaw, VIEW.pitch + ((k % 3) - 1) * TILT.pitch);
        for (const p of pts) {
          const e = apply(R, p[0], p[1] - stackH / 2, p[2]);
          d = Math.max(d, e[2] + (f * Math.abs(e[0])) / (aspect * region.hw), e[2] + (f * Math.abs(e[1])) / region.hh);
        }
      }
      fitDist = d * 1.02;
    };

    const matrices = () => {
      const dist = fitDist / cur.zoom;
      const R = viewRotation(cur.yaw, cur.pitch);
      const view = multiply(translation(0, 0, -dist), multiply(R, translation(0, -cur.ty, 0)));
      const radius = Math.hypot(stackH, 400);
      const proj = perspective(VIEW.fov, cssW / cssH, Math.max(5, dist - radius * 1.2), dist + radius * 1.5);
      proj[8] = -region.sx;
      proj[9] = -region.sy;
      return { view, proj, pv: multiply(proj, view) };
    };

    const toScreen = (pv: Mat4, x: number, y: number, z: number) => {
      const c = apply(pv, x, y, z);
      return [((c[0] / c[3] + 1) / 2) * cssW, ((1 - c[1] / c[3]) / 2) * cssH] as const;
    };

    /* --- labels (DOM, positioned imperatively every frame) --- */
    const placeLabels = (pv: Mat4) => {
      const minGap = cssW < 560 ? 30 : 34;
      const items = slots.map((s, i) => {
        const cxw = (s.box.min[0] + s.box.max[0]) / 2;
        const czw = (s.box.min[2] + s.box.max[2]) / 2;
        const mid = (s.box.min[1] + s.box.max[1]) / 2;
        const [, y] = toScreen(pv, cxw, mid, czw);
        const [, yTop] = toScreen(pv, cxw, s.box.max[1], czw);
        const [, yBot] = toScreen(pv, cxw, s.box.min[1], czw);
        const band = Math.max(8, Math.abs(yBot - yTop) * 0.35);
        let tipX = -Infinity;
        let anyX = -Infinity;
        const smp = samplesWorld[i];
        if (smp)
          for (let k = 0; k < smp.length; k += 3) {
            const [sx, sy] = toScreen(pv, smp[k]!, smp[k + 1]!, smp[k + 2]!);
            if (sx > anyX) anyX = sx;
            if (Math.abs(sy - y) < band && sx > tipX) tipX = sx;
          }
        if (!Number.isFinite(tipX)) tipX = Number.isFinite(anyX) ? anyX : toScreen(pv, s.box.max[0], mid, czw)[0];
        return { i, anchorY: y, labelY: y, tipX };
      });
      // Keep labels apart (top of the stack = last stage = smallest y).
      const order = [...items].sort((a, b) => a.anchorY - b.anchorY);
      for (let k = 1; k < order.length; k++) {
        const prev = order[k - 1]!;
        const it = order[k]!;
        if (it.labelY - prev.labelY < minGap) it.labelY = prev.labelY + minGap;
      }
      const labelX = region.labelX;
      for (const it of items) {
        const el = labelRefs.current[it.i];
        const g = leaderRefs.current[it.i];
        const inView = it.anchorY > 6 && it.anchorY < cssH - 6 && it.labelY > 10 && it.labelY < cssH - 10;
        if (el) {
          el.style.transform = `translate3d(${labelX.toFixed(1)}px, ${it.labelY.toFixed(1)}px, 0) translateY(-50%)`;
          el.dataset.hidden = inView ? "false" : "true";
        }
        if (g) {
          const x1 = Math.min(it.tipX + 10, labelX - 28);
          const x2 = labelX - 10;
          const show = inView && x2 - x1 > 14;
          const line = g.querySelector("line");
          const dot = g.querySelector("circle");
          line?.setAttribute("x1", x1.toFixed(1));
          line?.setAttribute("y1", it.anchorY.toFixed(1));
          line?.setAttribute("x2", x2.toFixed(1));
          line?.setAttribute("y2", it.labelY.toFixed(1));
          dot?.setAttribute("cx", x1.toFixed(1));
          dot?.setAttribute("cy", it.anchorY.toFixed(1));
          g.style.opacity = show ? "" : "0";
        }
      }
    };

    /* --- drawing --- */
    const draw = () => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      if (!slots.length) return;
      const { view, proj, pv } = matrices();

      // Floor shadow + axis (blended, no depth write).
      gl.useProgram(flatProg);
      gl.uniformMatrix4fv(FU.uMVP!, false, pv);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.DEPTH_TEST);
      gl.depthMask(false);
      if (shadowBuf && shadowTex) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, shadowTex);
        gl.uniform1i(FU.uTex!, 0);
        gl.uniform1f(FU.uMode!, 0);
        gl.uniform3fv(FU.uColor!, look.shadow);
        gl.uniform1f(FU.uAlpha!, look.shadowAlpha);
        gl.bindBuffer(gl.ARRAY_BUFFER, shadowBuf);
        gl.enableVertexAttribArray(fA.pos);
        gl.vertexAttribPointer(fA.pos, 3, gl.FLOAT, false, 20, 0);
        gl.enableVertexAttribArray(fA.uv);
        gl.vertexAttribPointer(fA.uv, 2, gl.FLOAT, false, 20, 12);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      gl.depthMask(true);

      // Models (opaque).
      gl.disable(gl.BLEND);
      gl.useProgram(modelProg);
      gl.uniformMatrix4fv(MU.uProj!, false, proj);
      gl.uniform3fv(MU.uKey!, look.key);
      gl.uniform3fv(MU.uFill!, look.fill);
      gl.uniform3fv(MU.uRimCol!, look.accent);
      gl.uniform3fv(MU.uBg!, look.bg);
      gl.uniform1f(MU.uAmbient!, look.ambient);
      gl.uniform1f(MU.uRim!, look.rim);
      gl.uniform1f(MU.uSpec!, look.spec);
      meshes.forEach((m, i) => {
        if (!m) return;
        const mv = multiply(view, slots[i]!.model);
        gl.uniformMatrix4fv(MU.uMV!, false, mv);
        gl.uniformMatrix3fv(MU.uN!, false, mat3(mv));
        gl.uniform3fv(MU.uColor!, look.tones[i]!);
        gl.uniform1f(MU.uDim!, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, m.pos);
        gl.enableVertexAttribArray(mA.pos);
        gl.vertexAttribPointer(mA.pos, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, m.nor);
        gl.enableVertexAttribArray(mA.nor);
        gl.vertexAttribPointer(mA.nor, 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, m.count);
      });

      // Dashed axis through the shared registration centre (hidden inside the models by the depth test).
      if (axisBuf) {
        gl.useProgram(flatProg);
        gl.enable(gl.BLEND);
        gl.uniformMatrix4fv(FU.uMVP!, false, pv);
        gl.uniform1f(FU.uMode!, 1);
        gl.uniform3fv(FU.uColor!, look.accent);
        gl.uniform1f(FU.uAlpha!, 0.75);
        gl.bindBuffer(gl.ARRAY_BUFFER, axisBuf);
        gl.enableVertexAttribArray(fA.pos);
        gl.vertexAttribPointer(fA.pos, 3, gl.FLOAT, false, 20, 0);
        gl.enableVertexAttribArray(fA.uv);
        gl.vertexAttribPointer(fA.uv, 2, gl.FLOAT, false, 20, 12);
        gl.drawArrays(gl.LINES, 0, 2);
        gl.disable(gl.BLEND);
      }
      placeLabels(pv);
    };

    /* --- on-demand redraw (theme change) --- */
    const request = () => {
      if (!raf && !disposed)
        raf = requestAnimationFrame(() => {
          raf = 0;
          draw();
        });
    };

    /* --- size / theme --- */
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      cssW = Math.max(1, rect.width);
      cssH = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      computeRegion();
      if (slots.length) computeFit();
      draw();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    cleanups.push(() => ro.disconnect());

    const mo = new MutationObserver(() => {
      look = readLook(root);
      request();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    cleanups.push(() => mo.disconnect());

    const onLost = (e: Event) => {
      e.preventDefault();
      setStatus("nogl");
    };
    canvas.addEventListener("webglcontextlost", onLost);
    cleanups.push(() => canvas.removeEventListener("webglcontextlost", onLost));

    /* --- pointer tilt (mouse / pen only; never touch, never wheel) --- */
    const target = { yaw: VIEW.yaw, pitch: VIEW.pitch };
    let tiltRaf = 0;
    let lastT = 0;
    const tiltStep = (t: number) => {
      tiltRaf = 0;
      const dt = lastT ? Math.min(250, t - lastT) : 16; // time-based, so slow frames don't slow the motion
      lastT = t;
      const k = 1 - Math.exp(-dt / TILT.tauMs);
      cur.yaw += (target.yaw - cur.yaw) * k;
      cur.pitch += (target.pitch - cur.pitch) * k;
      const done = Math.abs(target.yaw - cur.yaw) < 0.0004 && Math.abs(target.pitch - cur.pitch) < 0.0004;
      if (done) {
        cur.yaw = target.yaw;
        cur.pitch = target.pitch;
      }
      root.dataset.tilt = `${((cur.yaw - VIEW.yaw) / DEG).toFixed(2)},${((cur.pitch - VIEW.pitch) / DEG).toFixed(2)}`;
      draw();
      if (!done && !disposed) tiltRaf = requestAnimationFrame(tiltStep);
      else lastT = 0;
    };
    const kick = () => {
      if (!tiltRaf && !disposed) tiltRaf = requestAnimationFrame(tiltStep);
    };
    const viewport = canvas.parentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch" || reduced.matches || !slots.length || !viewport) return;
      const r = viewport.getBoundingClientRect();
      const nx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      const ny = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
      target.yaw = VIEW.yaw + nx * TILT.yaw;
      target.pitch = VIEW.pitch + ny * TILT.pitch;
      kick();
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      target.yaw = VIEW.yaw;
      target.pitch = VIEW.pitch;
      kick();
    };
    if (viewport) {
      viewport.addEventListener("pointermove", onMove, { passive: true });
      viewport.addEventListener("pointerleave", onLeave, { passive: true });
      cleanups.push(() => {
        viewport.removeEventListener("pointermove", onMove);
        viewport.removeEventListener("pointerleave", onLeave);
        if (tiltRaf) cancelAnimationFrame(tiltRaf);
      });
    }

    /* --- load when near the viewport --- */
    const start = async () => {
      setStatus("loading");
      const fractions = Array<number>(N).fill(0);
      let lastReport = 0;
      const report = (i: number, f: number) => {
        fractions[i] = f;
        const now = performance.now();
        if (now - lastReport > 120) {
          lastReport = now;
          setProgress(fractions.reduce((a, b) => a + b, 0) / N);
        }
      };
      const results = await Promise.allSettled(STAGES.map((s, i) => loadStage(s, abort.signal, (f) => report(i, f))));
      if (disposed) return;
      setProgress(1);
      const indexed = results.map((r) => (r.status === "fulfilled" ? r.value : null));
      const fails = indexed.map((m) => !m);
      setFailed(fails);
      if (indexed.every((m) => !m)) {
        setStatus("error");
        return;
      }
      const layout = layoutStack(indexed, CFG.gapMm);
      slots = layout.slots;
      stackH = layout.height;
      floorY = -CFG.gapMm * 1.1;
      cur.ty = stackH / 2;

      meshes = [];
      samplesWorld = [];
      for (let i = 0; i < N; i++) {
        const m = indexed[i];
        if (!m) {
          meshes.push(null);
          samplesWorld.push(new Float32Array(0));
          continue;
        }
        await nextTask(); // keep the main thread responsive between models
        if (disposed) return;
        const r = buildRenderMesh(m);
        meshes.push({ pos: makeBuffer(r.positions), nor: makeBuffer(r.normals), count: r.count });
        const s = sampleVertices(m);
        const w = new Float32Array(s.length);
        for (let k = 0; k < s.length; k += 3) {
          const p = apply(slots[i]!.model, s[k]!, s[k + 1]!, s[k + 2]!);
          w[k] = p[0];
          w[k + 1] = p[1];
          w[k + 2] = p[2];
        }
        samplesWorld.push(w);
      }

      // Floor shadow quad under the combined footprint.
      const xs = slots.flatMap((s) => [s.box.min[0], s.box.max[0]]);
      const zs = slots.flatMap((s) => [s.box.min[2], s.box.max[2]]);
      const padX = (Math.max(...xs) - Math.min(...xs)) * 0.18 + 24;
      const padZ = (Math.max(...zs) - Math.min(...zs)) * 0.3 + 24;
      const rect = { x0: Math.min(...xs) - padX, x1: Math.max(...xs) + padX, z0: Math.min(...zs) - padZ, z1: Math.max(...zs) + padZ };
      const W = 192;
      const H = 96;
      const tex = footprintTexture(indexed.map((m, i) => (m ? worldVertices(m, slots[i]!.model) : new Float32Array(0))), rect, W, H);
      shadowTex = gl.createTexture()!;
      textures.push(shadowTex);
      gl.bindTexture(gl.TEXTURE_2D, shadowTex);
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, W, H, 0, gl.ALPHA, gl.UNSIGNED_BYTE, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      // u runs along x, v along z (texture rows were written with v = z).
      shadowBuf = makeBuffer(
        new Float32Array([
          rect.x0, floorY, rect.z0, 0, 0,
          rect.x1, floorY, rect.z0, 1, 0,
          rect.x0, floorY, rect.z1, 0, 1,
          rect.x1, floorY, rect.z1, 1, 1,
        ]),
      );
      const axisTop = stackH + CFG.gapMm * 0.9;
      axisBuf = makeBuffer(new Float32Array([0, floorY, 0, 0, 0, 0, axisTop, 0, axisTop - floorY, 0]));

      computeFit();
      look = readLook(root);
      draw();
      setStatus(fails.some(Boolean) ? "partial" : "ready");
    };

    let io: IntersectionObserver | null = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io?.disconnect();
          io = null;
          void start().catch(() => {
            if (!disposed) setStatus("error");
          });
        }
      },
      { rootMargin: "250px 0px" },
    );
    io.observe(root);
    cleanups.push(() => io?.disconnect());

    return () => {
      disposed = true;
      abort.abort();
      if (raf) cancelAnimationFrame(raf);
      cleanups.forEach((c) => c());
      buffers.forEach((b) => gl.deleteBuffer(b));
      textures.forEach((t) => gl.deleteTexture(t));
      gl.deleteProgram(modelProg);
      gl.deleteProgram(flatProg);
      // No WEBGL_lose_context here: React Strict Mode re-runs this effect on the same canvas.
    };
  }, [attempt]);

  const failedNames = STAGES.filter((_, i) => failed[i]).map((s) => `${s.n} — ${s.label}`);
  const top = [...STAGES.keys()].reverse(); // DOM order: top of the stack first
  const posterVars = {
    "--ostack-poster-light-wide": `url(${CFG.posters.light.wide})`,
    "--ostack-poster-light-tall": `url(${CFG.posters.light.tall})`,
    "--ostack-poster-dark-wide": `url(${CFG.posters.dark.wide})`,
    "--ostack-poster-dark-tall": `url(${CFG.posters.dark.tall})`,
  } as CSSProperties;

  return (
    <figure ref={rootRef} className={cn("ostack", `is-${status}`, className)} aria-labelledby={capId} style={posterVars}>
      <div className="ostack__viewport">
        <div className="ostack__poster" aria-hidden="true" />
        <canvas
          key={attempt}
          ref={canvasRef}
          className="ostack__canvas"
          role="img"
          aria-label="3D view of the five ORTESIS STUDIO models stacked from the original scan (bottom) to the final orthosis (top)."
          aria-describedby={listId}
        />
        <svg className="ostack__leaders" aria-hidden="true">
          {STAGES.map((s, i) => (
            <g
              key={s.id}
              ref={(el) => {
                leaderRefs.current[i] = el;
              }}
              className={cn("ostack__leader", "accent" in s && s.accent && "is-accent")}
            >
              <line x1="0" y1="0" x2="0" y2="0" />
              <circle cx="0" cy="0" r="2.5" />
            </g>
          ))}
        </svg>
        <div className="ostack__labels">
          {top.map((i) => {
            const s = STAGES[i]!;
            return (
              <span
                key={s.id}
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
                className={cn("ostack__label", "accent" in s && s.accent && "is-accent", failed[i] && "is-failed")}
                aria-hidden="true"
              >
                <span className="ostack__n">{s.n}</span>
                <span className="ostack__dash" aria-hidden="true">
                  —
                </span>
                <span className="ostack__name">{s.label}</span>
                {failed[i] ? <span className="ostack__note">not loaded</span> : null}
              </span>
            );
          })}
        </div>

        {status === "loading" ? (
          <p className="ostack__status" role="status">
            <span className="ostack__progress" aria-hidden="true">
              <span className="ostack__progress-fill" style={{ transform: `scaleX(${Math.max(0.04, progress)})` }} />
            </span>
            Loading 3D models · {Math.round(progress * 100)}%
          </p>
        ) : null}
        {status === "error" || status === "partial" ? (
          <div className="ostack__status ostack__status--error" role="alert">
            <span>{status === "error" ? "The 3D models couldn't be loaded." : `Couldn't load ${failedNames.join(", ")}.`}</span>
            <button type="button" className="btn btn--line ostack__retry" onClick={() => setAttempt((a) => a + 1)}>
              Try again
            </button>
          </div>
        ) : null}
        {status === "nogl" ? (
          <p className="ostack__status" role="note">
            Interactive 3D isn&apos;t available in this browser — showing a still render.
          </p>
        ) : null}
      </div>

      <ol className="ostack__list" id={listId} aria-label="Models, top to bottom">
        {top.map((i) => {
          const s = STAGES[i]!;
          return (
            <li key={s.id} className={cn("accent" in s && s.accent && "is-accent")}>
              <span className="ostack__n">{s.n}</span>
              <span>{s.label}</span>
            </li>
          );
        })}
      </ol>
      <figcaption id={capId} className="visually-hidden">
        {CFG.caption}
      </figcaption>
    </figure>
  );
}

function worldVertices(m: IndexedMesh, model: Mat4): Float32Array {
  const P = m.positions;
  const out = new Float32Array(P.length);
  for (let k = 0; k < P.length; k += 3) {
    const p = apply(model, P[k]!, P[k + 1]!, P[k + 2]!);
    out[k] = p[0];
    out[k + 1] = p[1];
    out[k + 2] = p[2];
  }
  return out;
}
