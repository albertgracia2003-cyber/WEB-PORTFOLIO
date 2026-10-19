"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { finalOrthosis, heroOrthosis } from "@/content/ortesis-models";
import { buildRenderMesh, parsePackedMesh, parseStl, type IndexedMesh } from "@/lib/stl";
import { multiply, perspective, rotationX, rotationY, rotationZ, translation, type Mat4 } from "@/lib/sculpture";
import { MODEL_FS, MODEL_VS, SATIN_FS, apply, clamp, fetchBuffer, mat3, mix, parseColor, type Rgb } from "@/lib/model-render";
import { cn } from "@/lib/utils";

/**
 * The real final orthosis (ORTESIS STUDIO model 05, the supplied STL), rendered with plain WebGL.
 *
 * variant "hero"    – decorative secondary visual on the homepage. A three-quarter view that follows the cursor by a
 *                     few degrees (eased, returns to rest), never spins, has no controls, ignores touch and pointer
 *                     events on itself (links and scrolling are untouched) and stays still with reduced motion.
 * variant "inspect" – the case-study viewer: drag (mouse, pen or touch) to orbit, buttons and arrow keys as
 *                     alternatives, Ctrl/⌘ + wheel or the +/− buttons to zoom. Vertical swipes on touch still scroll the page.
 *
 * Geometry is the original mesh (packed derivative = same vertices and triangles; STL as fallback). Nothing is
 * simplified, so thin ribs and the perforations are kept.
 */

type Status = "idle" | "loading" | "ready" | "error" | "nogl";
const DEG = Math.PI / 180;
const HOME = { yaw: -38 * DEG, pitch: 18 * DEG };
const FOV = 24 * DEG;
const HERO_TILT = { yaw: 6 * DEG, pitch: 3.5 * DEG, tauMs: 300 };
/** Hero composition: the model is turned so its long axis runs up the hero, centred at `cx` (fraction of the width) and scaled to `fill` of the height. */
/** Original resting roll (-74°) turned 180° in the screen plane: the model stands upside down relative to before, same lean. */
const HERO_ROLL = (-74 + 180) * DEG;
/** Quarter turn about the model's own long axis (source X). */
const HERO_SPIN = 90 * DEG;
/** Placement per canvas width: wide screens centre the model at 86% of the width; phones tuck it further right and smaller so the text stays first. */
const heroViewDefault = (w: number) => (w < 700 ? { cx: 0.99, cy: 0.55, fill: 0.78 } : { cx: 0.86, cy: 0.53, fill: 0.9 });
/**
 * Homepage hero variants (A editorial, B sculptural detail, C product exhibition). Each has its own resting
 * orientation (`roll` in the screen plane, `spin` about the long axis, `yaw`/`pitch` of the camera), cursor tilt, and
 * placement per canvas width (`cx`/`cy` = pivot position as a fraction of the canvas, `fill` = model height / canvas height).
 */
export type HeroPose = "a" | "b" | "c";
interface PoseCfg {
  roll: number;
  spin: number;
  yaw: number;
  pitch: number;
  tilt: { yaw: number; pitch: number };
  view: (w: number) => { cx: number; cy: number; fill: number };
}
export const POSES: Record<HeroPose, PoseCfg> = {
  a: { roll: 100 * DEG, spin: 55 * DEG, yaw: -30 * DEG, pitch: 12 * DEG, tilt: { yaw: 5 * DEG, pitch: 3 * DEG }, view: (w) => (w < 700 ? { cx: 0.6, cy: 0.5, fill: 1.0 } : { cx: 0.5, cy: 0.47, fill: 0.74 }) },
  b: { roll: 112 * DEG, spin: 80 * DEG, yaw: -36 * DEG, pitch: 16 * DEG, tilt: { yaw: 5 * DEG, pitch: 3 * DEG }, view: (w) => (w < 700 ? { cx: 0.62, cy: 0.5, fill: 1.9 } : { cx: 0.42, cy: 0.5, fill: 1.9 }) },
  c: { roll: 18 * DEG, spin: 0, yaw: -32 * DEG, pitch: 14 * DEG, tilt: { yaw: 6 * DEG, pitch: 3.5 * DEG }, view: (w) => (w < 700 ? { cx: 0.5, cy: 0.5, fill: 0.66 } : { cx: 0.47, cy: 0.5, fill: 0.64 }) },
};

const PRESETS = {
  perspective: { yaw: HOME.yaw, pitch: HOME.pitch },
  side: { yaw: 0, pitch: 0 },
  top: { yaw: HOME.yaw, pitch: 89 * DEG },
} as const;

interface Look {
  /** Use the original steel-blue shader (dark homepage hero). */
  legacy?: boolean;
  shade?: Rgb;
  tone: Rgb;
  rim: Rgb;
  bg: Rgb;
  /** 0–1: blend towards the page background (mutes contrast while keeping the shading). */
  dim: number;
  ambient: number;
  rimK: number;
  spec: number;
  key: Rgb;
  fill: Rgb;
}

function readLook(el: Element, hero: boolean, pose?: HeroPose): Look {
  const cs = getComputedStyle(el);
  const tok = (name: string, fb: string) => parseColor(cs.getPropertyValue(name), parseColor(fb, [0.5, 0.5, 0.5]));
  const dark = document.documentElement.getAttribute("data-theme") === "dark";
  const accent = tok("--color-accent", "#d86a50");
  const metal = tok("--color-metallic-blue", "#8e9cac");
  const pearl = tok("--color-pearl-blue", "#c9d2dc");
  const bg = tok("--bg", dark ? "#16191f" : "#e6e2dc");
  if (hero && !pose && dark) {
    // Dark theme keeps the original steel-blue background sculpture.
    const steel = tok("--color-steel-blue", "#46566c");
    return { legacy: true, tone: mix(steel, metal, 0.3), rim: accent, bg, dim: 0.2, ambient: 0.4, rimK: 0.4, spec: 0.03, key: [0.42, 0.46, 0.52], fill: [0.2, 0.26, 0.36] };
  }
  if (pose || hero) {
    // Ivory satin presentation material, same in both themes; only exposure and shadow depth change with the ground.
    return dark
      ? { tone: [0.385, 0.365, 0.345], shade: [0.3, 0.29, 0.33], rim: [accent[0] * 0.95, accent[1] * 0.8, accent[2] * 0.75], bg, dim: 0, ambient: 1, rimK: 0.34, spec: 0.12, key: [0.84, 0.78, 0.69], fill: [0.17, 0.24, 0.37] }
      : { tone: [0.95, 0.91, 0.83], shade: [0.5, 0.47, 0.5], rim: [accent[0] * 0.95, accent[1] * 0.8, accent[2] * 0.75], bg, dim: 0, ambient: 1, rimK: 0.5, spec: 0.34, key: [1.0, 0.94, 0.84], fill: [0.3, 0.42, 0.6] };
  }
  if (hero) {
    // Background sculpture: metallic blue-grey body, terracotta rim light, low specular so nothing glares behind the text.
    const steel = tok("--color-steel-blue", "#46566c");
    return dark
      ? { tone: mix(steel, metal, 0.3), rim: accent, bg, dim: 0.2, ambient: 0.4, rimK: 0.4, spec: 0.03, key: [0.42, 0.46, 0.52], fill: [0.2, 0.26, 0.36] }
      : { tone: mix(metal, pearl, 0.6), rim: accent, bg, dim: 0.17, ambient: 0.58, rimK: 0.3, spec: 0.03, key: [0.34, 0.37, 0.42], fill: [0.26, 0.32, 0.4] };
  }
  // Terracotta body; the rim light is the metallic blue, so the two palette colours meet on the edges.
  return dark
    ? { tone: mix(accent, pearl, 0.08), rim: mix(metal, pearl, 0.5), bg, dim: 0, ambient: 0.4, rimK: 0.5, spec: 0.34, key: [0.82, 0.8, 0.8], fill: [0.3, 0.38, 0.5] }
    : { tone: mix(accent, [0.2, 0.12, 0.1], 0.1), rim: metal, bg, dim: 0, ambient: 0.46, rimK: 0.34, spec: 0.26, key: [0.62, 0.6, 0.6], fill: [0.3, 0.38, 0.5] };
}

async function loadMesh(model: { packed?: string; src?: string }, signal: AbortSignal, onProgress: (f: number) => void): Promise<IndexedMesh> {
  const rep = (l: number, t: number) => onProgress(t ? l / t : 0.5);
  if (model.packed) {
    try {
      return parsePackedMesh(await fetchBuffer(model.packed, signal, rep));
    } catch (e) {
      if (signal.aborted || !model.src) throw e;
    }
  }
  return parseStl(await fetchBuffer(model.src!, signal, rep));
}

interface Api {
  set(view: { yaw: number; pitch: number }, animate?: boolean): void;
  zoom(f: number): void;
  reset(): void;
}

export function OrthosisViewer({ variant, className, pose }: { variant: "hero" | "inspect"; className?: string; pose?: HeroPose }) {
  const hero = variant === "hero";
  const P = pose ? POSES[pose] : null;
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const api = useRef<Api | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const helpId = useId();

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const later = (s: Status) => {
      const id = requestAnimationFrame(() => setStatus(s));
      return () => cancelAnimationFrame(id);
    };
    const glOrNull = canvas.getContext("webgl", { antialias: true, alpha: true, premultipliedAlpha: true });
    if (!glOrNull) return later("nogl");
    const gl: WebGLRenderingContext = glOrNull;
    const abort = new AbortController();
    let disposed = false;
    let raf = 0;
    const cleanups: (() => void)[] = [];

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const UNI = ["uMV", "uProj", "uN", "uColor", "uKey", "uFill", "uRimCol", "uBg", "uAmbient", "uRim", "uSpec", "uDim", "uShade"];
    const build = (fsSrc: string) => {
      const prog = gl.createProgram()!;
      const vs = sh(gl.VERTEX_SHADER, MODEL_VS);
      const fs = sh(gl.FRAGMENT_SHADER, fsSrc);
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
      return { prog, U: Object.fromEntries(UNI.map((n) => [n, gl.getUniformLocation(prog, n)])), aPos: gl.getAttribLocation(prog, "aPos"), aNor: gl.getAttribLocation(prog, "aNor") };
    };
    // Homepage hero: ivory satin in the light theme, the original steel-blue material in the dark theme (both compiled; the theme picks).
    const satinP = pose || hero ? build(SATIN_FS) : null;
    const plainP = !pose ? build(MODEL_FS) : null;
    if ((pose || hero) && !satinP) return later("nogl");
    if (!pose && !hero && !plainP) return later("nogl");

    const buffers: WebGLBuffer[] = [];
    let mesh: { pos: WebGLBuffer; nor: WebGLBuffer; count: number } | null = null;
    let model: Mat4 | null = null;
    let corners: [number, number, number][] = [];
    let radius = 100;
    let look = readLook(root, hero, pose);
    let cssW = 1;
    let cssH = 1;
    let fit = 600;
    let zoom = 1;
    const REST = P ? { yaw: P.yaw, pitch: P.pitch } : HOME;
    const TILT = P ? P.tilt : HERO_TILT;
    const heroView = P ? P.view : heroViewDefault;
    const cur = { ...REST };
    const target = { ...REST };
    let visible = true;

    const rot = (yaw: number, pitch: number) => multiply(rotationX(pitch), rotationY(yaw));

    const computeFit = () => {
      if (!corners.length) return;
      const f = 1 / Math.tan(FOV / 2);
      const aspect = cssW / cssH;
      let d = 0;
      if (hero) {
        // Scale to the hero's height over the whole tilt range (width may run past the right edge, where it is clipped).
        for (let a = -1; a <= 1; a += 1)
          for (let b = -1; b <= 1; b += 1) {
            const R = rot(REST.yaw + a * TILT.yaw, REST.pitch + b * TILT.pitch);
            for (const c of corners) {
              const e = apply(R, c[0], c[1], c[2]);
              d = Math.max(d, e[2] + f * Math.abs(e[1]));
            }
          }
        fit = d / heroView(cssW).fill;
      } else {
        // Orbit: any orientation must fit, so use the bounding sphere.
        const half = Math.min(FOV / 2, Math.atan(Math.tan(FOV / 2) * aspect));
        fit = (radius / Math.sin(half)) * 1.04;
      }
    };

    const draw = () => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      if (!mesh || !model) return;
      const dist = fit / zoom;
      const view = multiply(translation(0, 0, -dist), rot(cur.yaw, cur.pitch));
      const proj = perspective(FOV, cssW / cssH, Math.max(5, dist - radius * 1.3), dist + radius * 1.3);
      if (hero) {
        const hv = heroView(cssW);
        proj[8] = -(hv.cx * 2 - 1);
        proj[9] = hv.cy * 2 - 1;
      } // centre the pivot at cx of the width; the view itself is never translated
      const mv = multiply(view, model);
      gl.enable(gl.DEPTH_TEST);
      gl.disable(gl.BLEND);
      const { prog: _p, U, aPos, aNor } = look.legacy || !satinP ? plainP! : satinP;
      gl.useProgram(_p);
      gl.uniformMatrix4fv(U.uProj!, false, proj);
      gl.uniformMatrix4fv(U.uMV!, false, mv);
      gl.uniformMatrix3fv(U.uN!, false, mat3(mv));
      gl.uniform3fv(U.uColor!, look.tone);
      gl.uniform3fv(U.uShade!, look.shade ?? look.tone);
      gl.uniform3fv(U.uKey!, look.key);
      gl.uniform3fv(U.uFill!, look.fill);
      gl.uniform3fv(U.uRimCol!, look.rim);
      gl.uniform3fv(U.uBg!, look.bg);
      gl.uniform1f(U.uAmbient!, look.ambient);
      gl.uniform1f(U.uRim!, look.rimK);
      gl.uniform1f(U.uSpec!, look.spec);
      gl.uniform1f(U.uDim!, look.dim);
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.pos);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.nor);
      gl.enableVertexAttribArray(aNor);
      gl.vertexAttribPointer(aNor, 3, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, mesh.count);
      root.dataset.view = `${((cur.yaw - REST.yaw) / DEG).toFixed(2)},${((cur.pitch - REST.pitch) / DEG).toFixed(2)},${zoom.toFixed(2)}`;
    };

    /* eased animation towards `target` (shared by hero tilt and inspect presets) */
    let animRaf = 0;
    let lastT = 0;
    let tau = HERO_TILT.tauMs;
    const step = (t: number) => {
      animRaf = 0;
      const dt = lastT ? Math.min(250, t - lastT) : 16;
      lastT = t;
      const k = 1 - Math.exp(-dt / tau);
      cur.yaw += (target.yaw - cur.yaw) * k;
      cur.pitch += (target.pitch - cur.pitch) * k;
      const done = Math.abs(target.yaw - cur.yaw) < 0.0004 && Math.abs(target.pitch - cur.pitch) < 0.0004;
      if (done) {
        cur.yaw = target.yaw;
        cur.pitch = target.pitch;
      }
      draw();
      if (!done && !disposed) animRaf = requestAnimationFrame(step);
      else lastT = 0;
    };
    const kick = () => {
      if (!animRaf && !disposed) animRaf = requestAnimationFrame(step);
    };
    const request = () => {
      if (!raf && !disposed)
        raf = requestAnimationFrame(() => {
          raf = 0;
          draw();
        });
    };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      cssW = Math.max(1, r.width);
      cssH = Math.max(1, r.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      computeFit();
      draw();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    cleanups.push(() => ro.disconnect());

    const mo = new MutationObserver(() => {
      look = readLook(root, hero, pose);
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

    /* ---- interaction ---- */
    if (hero) {
      // Cursor follows over the whole window; mouse / pen only; passive; the visual itself takes no pointer events.
      const onMove = (e: PointerEvent) => {
        if (e.pointerType === "touch" || reduced.matches || !mesh || !visible) return;
        const nx = clamp((e.clientX / window.innerWidth) * 2 - 1, -1, 1);
        const ny = clamp((e.clientY / window.innerHeight) * 2 - 1, -1, 1);
        target.yaw = REST.yaw + nx * TILT.yaw;
        target.pitch = REST.pitch + ny * TILT.pitch;
        tau = HERO_TILT.tauMs;
        kick();
      };
      const rest = () => {
        target.yaw = REST.yaw;
        target.pitch = REST.pitch;
        kick();
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", rest, { passive: true });
      window.addEventListener("blur", rest);
      cleanups.push(() => {
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", rest);
        window.removeEventListener("blur", rest);
      });
    } else {
      let drag: { id: number; x: number; y: number } | null = null;
      const onDown = (e: PointerEvent) => {
        if (!mesh || (e.pointerType === "mouse" && e.button !== 0)) return;
        drag = { id: e.pointerId, x: e.clientX, y: e.clientY };
        canvas.setPointerCapture(e.pointerId);
        root.dataset.dragging = "true";
        if (animRaf) cancelAnimationFrame(animRaf);
        animRaf = 0;
        lastT = 0;
      };
      const onMoveDrag = (e: PointerEvent) => {
        if (!drag || e.pointerId !== drag.id) return;
        const dx = e.clientX - drag.x;
        const dy = e.clientY - drag.y;
        drag.x = e.clientX;
        drag.y = e.clientY;
        cur.yaw += dx * 0.009;
        cur.pitch = clamp(cur.pitch + dy * 0.007, -89 * DEG, 89 * DEG);
        target.yaw = cur.yaw;
        target.pitch = cur.pitch;
        request();
      };
      const onUp = (e: PointerEvent) => {
        if (drag && e.pointerId === drag.id) {
          drag = null;
          delete root.dataset.dragging;
        }
      };
      const onWheel = (e: WheelEvent) => {
        // Only a pinch gesture or Ctrl/⌘ + wheel zooms; a plain wheel always scrolls the page.
        if (!e.ctrlKey && !e.metaKey) return;
        e.preventDefault();
        zoom = clamp(zoom * Math.exp(-e.deltaY * 0.01), 0.7, 3.2);
        request();
      };
      const onKey = (e: KeyboardEvent) => {
        const k = e.key;
        let handled = true;
        if (k === "ArrowLeft") cur.yaw -= 8 * DEG;
        else if (k === "ArrowRight") cur.yaw += 8 * DEG;
        else if (k === "ArrowUp") cur.pitch = clamp(cur.pitch - 6 * DEG, -89 * DEG, 89 * DEG);
        else if (k === "ArrowDown") cur.pitch = clamp(cur.pitch + 6 * DEG, -89 * DEG, 89 * DEG);
        else if (k === "+" || k === "=") zoom = clamp(zoom * 1.15, 0.7, 3.2);
        else if (k === "-") zoom = clamp(zoom / 1.15, 0.7, 3.2);
        else if (k === "0" || k === "Home") {
          cur.yaw = HOME.yaw;
          cur.pitch = HOME.pitch;
          zoom = 1;
        } else handled = false;
        if (!handled) return;
        e.preventDefault();
        target.yaw = cur.yaw;
        target.pitch = cur.pitch;
        request();
      };
      canvas.addEventListener("pointerdown", onDown);
      canvas.addEventListener("pointermove", onMoveDrag);
      canvas.addEventListener("pointerup", onUp);
      canvas.addEventListener("pointercancel", onUp);
      canvas.addEventListener("wheel", onWheel, { passive: false });
      canvas.addEventListener("keydown", onKey);
      cleanups.push(() => {
        canvas.removeEventListener("pointerdown", onDown);
        canvas.removeEventListener("pointermove", onMoveDrag);
        canvas.removeEventListener("pointerup", onUp);
        canvas.removeEventListener("pointercancel", onUp);
        canvas.removeEventListener("wheel", onWheel);
        canvas.removeEventListener("keydown", onKey);
      });
    }
    api.current = {
      set(v, animate = true) {
        target.yaw = v.yaw;
        target.pitch = v.pitch;
        if (animate && !reduced.matches) {
          tau = 110;
          kick();
        } else {
          cur.yaw = v.yaw;
          cur.pitch = v.pitch;
          request();
        }
      },
      zoom(f) {
        zoom = clamp(zoom * f, 0.7, 3.2);
        request();
      },
      reset() {
        zoom = 1;
        this.set(HOME);
      },
    };
    cleanups.push(() => {
      api.current = null;
      if (animRaf) cancelAnimationFrame(animRaf);
    });

    /* ---- load when near the viewport; pause hero response when off-screen ---- */
    const start = async () => {
      setStatus("loading");
      let last = 0;
      const indexed = await loadMesh(hero ? heroOrthosis : finalOrthosis, abort.signal, (f) => {
        const n = performance.now();
        if (n - last > 100) {
          last = n;
          setProgress(f);
        }
      });
      if (disposed) return;
      setProgress(1);
      // Z-up (mm) → Y-up, centred on the bounding box.
      const D = hero ? multiply(rotationZ(P ? P.roll : HERO_ROLL), multiply(rotationX(-Math.PI / 2), rotationX(P ? P.spin : HERO_SPIN))) : rotationX(-Math.PI / 2);
      const pts: [number, number, number][] = [];
      for (const x of [indexed.min[0], indexed.max[0]])
        for (const y of [indexed.min[1], indexed.max[1]])
          for (const z of [indexed.min[2], indexed.max[2]]) {
            const p = apply(D, x, y, z);
            pts.push([p[0], p[1], p[2]]);
          }
      const mid = [0, 1, 2].map((k) => (Math.min(...pts.map((p) => p[k]!)) + Math.max(...pts.map((p) => p[k]!))) / 2) as [number, number, number];
      model = multiply(translation(-mid[0], -mid[1], -mid[2]), D);
      corners = pts.map((p) => [p[0] - mid[0], p[1] - mid[1], p[2] - mid[2]] as [number, number, number]);
      radius = Math.max(...corners.map((c) => Math.hypot(c[0], c[1], c[2])));
      const r = buildRenderMesh(indexed);
      const mk = (d: Float32Array) => {
        const b = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, b);
        gl.bufferData(gl.ARRAY_BUFFER, d, gl.STATIC_DRAW);
        buffers.push(b);
        return b;
      };
      mesh = { pos: mk(r.positions), nor: mk(r.normals), count: r.count };
      look = readLook(root, hero, pose);
      computeFit();
      draw();
      setStatus("ready");
    };
    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        const on = entries.some((e) => e.isIntersecting);
        visible = on;
        if (on && !started) {
          started = true;
          const go = () => {
            if (!disposed)
              void start().catch(() => {
                if (!disposed) setStatus("error");
              });
          };
          // The hero model is large: wait until the page has settled so it never competes with the headline.
          if (hero) {
            if ("requestIdleCallback" in window) window.requestIdleCallback(go, { timeout: 1500 });
            else setTimeout(go, 400);
          } else go();
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(root);
    cleanups.push(() => io.disconnect());

    return () => {
      disposed = true;
      abort.abort();
      if (raf) cancelAnimationFrame(raf);
      cleanups.forEach((c) => c());
      buffers.forEach((b) => gl.deleteBuffer(b));
      if (satinP) gl.deleteProgram(satinP.prog);
      if (plainP) gl.deleteProgram(plainP.prog);
    };
  }, [attempt, hero, pose, P]);

  const retry = useCallback(() => {
    setStatus("idle");
    setAttempt((a) => a + 1);
  }, []);

  const ready = status === "ready";
  const failed = status === "error" || status === "nogl";

  if (hero) {
    return (
      <div ref={rootRef} className={cn("hero-ortho", `is-${status}`, className)} aria-hidden="true">
        <canvas ref={canvasRef} className="hero-ortho__canvas" />
      </div>
    );
  }

  return (
    <div ref={rootRef} className={cn("oviewer", `is-${status}`, className)}>
      <div className="oviewer__stage">
        <canvas
          ref={canvasRef}
          className="oviewer__canvas"
          tabIndex={0}
          role="img"
          aria-label="Interactive 3D view of the final orthosis. Drag to rotate; arrow keys rotate, plus and minus zoom, 0 resets."
          aria-describedby={helpId}
        />
        {status === "loading" || status === "idle" ? (
          <p className="oviewer__state" role="status">
            Loading the orthosis model… {progress > 0 && progress < 1 ? `${Math.round(progress * 100)}%` : ""}
          </p>
        ) : null}
        {failed ? (
          <div className="oviewer__state oviewer__state--error" role="alert">
            <p>{status === "nogl" ? "This browser cannot display the 3D model (WebGL is unavailable)." : "The 3D model could not be loaded."}</p>
            <p className="oviewer__fallback">The printed result and the generated design are shown in the photographs above.</p>
            {status === "error" ? (
              <button type="button" className="oviewer__btn" onClick={retry}>
                Try again
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="oviewer__bar">
        <p id={helpId} className="oviewer__hint">
          Drag to rotate · Ctrl/⌘ + scroll or +/− to zoom
        </p>
        <div className="oviewer__controls" role="group" aria-label="Model view controls">
          <button type="button" className="oviewer__btn" disabled={!ready} onClick={() => api.current?.set(PRESETS.perspective)}>
            Perspective
          </button>
          <button type="button" className="oviewer__btn" disabled={!ready} onClick={() => api.current?.set(PRESETS.side)}>
            Side
          </button>
          <button type="button" className="oviewer__btn" disabled={!ready} onClick={() => api.current?.set(PRESETS.top)}>
            Top
          </button>
          <button type="button" className="oviewer__btn oviewer__btn--icon" disabled={!ready} aria-label="Zoom out" onClick={() => api.current?.zoom(1 / 1.2)}>
            −
          </button>
          <button type="button" className="oviewer__btn oviewer__btn--icon" disabled={!ready} aria-label="Zoom in" onClick={() => api.current?.zoom(1.2)}>
            +
          </button>
          <button type="button" className="oviewer__btn" disabled={!ready} onClick={() => api.current?.reset()}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
