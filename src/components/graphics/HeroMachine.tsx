"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { heroMachine as CFG } from "@/content/hero-machine";
import { gunzip, parseAssembly, type Assembly } from "@/lib/assembly";
import { buildRenderMesh } from "@/lib/stl";
import { multiply, perspective, rotationX, rotationY, translation, type Mat4 } from "@/lib/sculpture";
import { FLAT_FS, FLAT_VS, MODEL_FS, MODEL_VS, apply, fetchBuffer, footprintTexture, mat3, mix, parseColor, type Rgb } from "@/lib/model-render";
import { cn } from "@/lib/utils";

/**
 * Homepage hero: the real CAD model of the ORTESIS STUDIO motorised 3D scanning machine.
 * - Shown as the built prototype stands (photographs): ring axis horizontal — the forearm passes
 *   through the rings — and the scanner rails on top. Only a presentation rotation; the geometry
 *   and relative positions are the file's own.
 * - Fixed three-quarter view; no rotation, zoom or other input (the canvas ignores pointer events).
 * - A still render (poster) is shown first; the model loads after the page has loaded.
 * - Once, after it appears: the two end frames move slightly apart along the machine's
 *   longitudinal axis (the direction its rods assemble in). Rods and carriage stay put.
 *   Reduced motion: assembled view, no movement.
 * - Renders only while that transition runs, on resize and on theme change.
 */

type Status = "idle" | "ready" | "fallback";
const DEG = Math.PI / 180;
/** Rows: source → display axes. Display X = machine axis, display Y = up (see `orientation` in the config). */
function orientationMatrix(axis: readonly number[], up: readonly number[]): Mat4 {
  const n = (v: number[]) => { const l = Math.hypot(v[0]!, v[1]!, v[2]!) || 1; return v.map((x) => x / l); };
  const X = n([...axis]);
  // make "up" orthogonal to the axis
  const d = up[0]! * X[0]! + up[1]! * X[1]! + up[2]! * X[2]!;
  const Y = n([up[0]! - d * X[0]!, up[1]! - d * X[1]!, up[2]! - d * X[2]!]);
  const Z = [X[1]! * Y[2]! - X[2]! * Y[1]!, X[2]! * Y[0]! - X[0]! * Y[2]!, X[0]! * Y[1]! - X[1]! * Y[0]!];
  // column-major: element (row r, col c) at [c*4 + r]
  return new Float32Array([X[0]!, Y[0]!, Z[0]!, 0, X[1]!, Y[1]!, Z[1]!, 0, X[2]!, Y[2]!, Z[2]!, 0, 0, 0, 0, 1]);
}
const SOURCE_TO_DISPLAY = orientationMatrix(CFG.orientation.axis, CFG.orientation.up);
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

interface Look {
  color: Rgb;
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

/** One material (the STL carries no colours); tones come from the brand tokens. */
function readLook(el: Element): Look {
  const cs = getComputedStyle(el);
  const tok = (name: string, fb: string) => parseColor(cs.getPropertyValue(name), parseColor(fb, [0.5, 0.5, 0.5]));
  const dark = document.documentElement.getAttribute("data-theme") === "dark";
  const steel = tok("--color-steel-blue", "#46566c");
  const metal = tok("--color-metallic-blue", "#8e9cac");
  const pearl = tok("--color-pearl-blue", "#c9d2dc");
  const accent = tok("--color-accent", "#d86a50");
  const bg = tok("--bg", dark ? "#20242b" : "#f4f1eb");
  return dark
    ? { color: mix(metal, pearl, 0.25), bg, accent, shadow: [0, 0, 0], shadowAlpha: 0.5, ambient: 0.34, rim: 0.18, spec: 0.3, key: [0.74, 0.76, 0.8], fill: [0.28, 0.34, 0.44] }
    : { color: mix(steel, metal, 0.55), bg, accent, shadow: [0.16, 0.13, 0.11], shadowAlpha: 0.22, ambient: 0.5, rim: 0.08, spec: 0.22, key: [0.58, 0.59, 0.62], fill: [0.3, 0.36, 0.44] };
}

export function HeroMachine({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const later = (s: Status) => {
      const id = requestAnimationFrame(() => setStatus(s));
      return () => cancelAnimationFrame(id);
    };
    const glOrNull = canvas.getContext("webgl", { antialias: true, alpha: true, premultipliedAlpha: true });
    if (!glOrNull || typeof DecompressionStream === "undefined") return later("fallback");
    const gl: WebGLRenderingContext = glOrNull;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const abort = new AbortController();
    let disposed = false;
    let raf = 0;
    const cleanups: (() => void)[] = [];

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
    if (!modelProg || !flatProg) return later("fallback");
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

    /* --- scene --- */
    let asm: Assembly | null = null;
    let gpu: { pos: WebGLBuffer; nor: WebGLBuffer; count: number }[] = [];
    let base: Mat4 = SOURCE_TO_DISPLAY; // centring
    let height = 1; // display units (mm)
    let lift = 0;
    let explodeT = 0;
    let shadowBuf: WebGLBuffer | null = null;
    let shadowTex: WebGLTexture | null = null;
    let look = readLook(root);
    let cssW = 1;
    let cssH = 1;
    let fitDist = 2000;
    let region = { sx: 0, sy: 0, hw: 1, hh: 1 };
    let shift: [number, number] = [0, 0];
    let corners: [number, number, number][] = [];
    const yaw = CFG.view.yaw * DEG;
    const pitch = CFG.view.pitch * DEG;
    const fov = CFG.view.fov * DEG;
    const R = multiply(rotationX(pitch), rotationY(yaw));

    // Separation along the machine axis (display X): group 1 = high end, group 2 = low end.
    const offsetFor = (g: number, t: number) => (g === 1 ? lift * t : g === 2 ? -lift * t : 0);

    // Fitting margins inside the canvas (the canvas box itself is placed by CSS, clear of the lower panel).
    const computeRegion = () => {
      // Desktop (portrait 8:9 box beside the headline): keep the machine in the upper right of the
      // box, clear of the headline's first line. Mobile (4:5 box above the headline): full box.
      const desktop = window.matchMedia("(min-width: 1200px)").matches && cssW / cssH < 1.2;
      const top = 0.96;
      const bottom = desktop ? -0.5 : -0.96;
      const left = desktop ? -0.5 : -0.94;
      const right = 0.96;
      region = { sx: (left + right) / 2, sy: (top + bottom) / 2, hw: (right - left) / 2, hh: (top - bottom) / 2 };
    };

    const computeFit = () => {
      const f = 1 / Math.tan(fov / 2);
      const aspect = cssW / cssH;
      let d = 0;
      for (const p of corners) {
        const e = apply(R, p[0], p[1], p[2]);
        d = Math.max(d, e[2] + (f * Math.abs(e[0])) / (aspect * region.hw), e[2] + (f * Math.abs(e[1])) / region.hh);
      }
      fitDist = d * 1.05;
      // Centre the projected silhouette inside the region (the machine is not symmetric in view).
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (const p of corners) {
        const e = apply(R, p[0], p[1], p[2]);
        const w = fitDist - e[2];
        const x = (f / aspect) * (e[0] / w);
        const y = f * (e[1] / w);
        x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
      }
      shift = [region.sx - (x0 + x1) / 2, region.sy - (y0 + y1) / 2];
    };

    const matrices = () => {
      const view = multiply(translation(0, 0, -fitDist), R);
      const radius = height * 1.2;
      const proj = perspective(fov, cssW / cssH, Math.max(5, fitDist - radius * 1.5), fitDist + radius * 1.5);
      proj[8] = -shift[0];
      proj[9] = -shift[1];
      return { view, proj, pv: multiply(proj, view) };
    };

    const draw = () => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      if (!asm) return;
      const { view, proj, pv } = matrices();
      const t = ease(explodeT);

      if (shadowBuf && shadowTex) {
        gl.useProgram(flatProg);
        gl.uniformMatrix4fv(FU.uMVP!, false, pv);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.DEPTH_TEST);
        gl.depthMask(false);
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
        gl.depthMask(true);
        gl.disable(gl.BLEND);
      }

      gl.useProgram(modelProg);
      gl.enable(gl.DEPTH_TEST);
      gl.uniformMatrix4fv(MU.uProj!, false, proj);
      gl.uniform3fv(MU.uKey!, look.key);
      gl.uniform3fv(MU.uFill!, look.fill);
      gl.uniform3fv(MU.uRimCol!, look.accent);
      gl.uniform3fv(MU.uBg!, look.bg);
      gl.uniform1f(MU.uAmbient!, look.ambient);
      gl.uniform1f(MU.uRim!, look.rim);
      gl.uniform1f(MU.uSpec!, look.spec);
      gl.uniform1f(MU.uDim!, 0);
      gl.uniform3fv(MU.uColor!, look.color);
      for (const part of asm.parts) {
        const m = gpu[part.mesh];
        if (!m) continue;
        const model = multiply(translation(offsetFor(part.group, t), 0, 0), multiply(base, part.matrix));
        const mv = multiply(view, model);
        gl.frontFace(part.mirrored ? gl.CW : gl.CCW);
        gl.uniformMatrix4fv(MU.uMV!, false, mv);
        gl.uniformMatrix3fv(MU.uN!, false, mat3(mv));
        gl.bindBuffer(gl.ARRAY_BUFFER, m.pos);
        gl.enableVertexAttribArray(mA.pos);
        gl.vertexAttribPointer(mA.pos, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, m.nor);
        gl.enableVertexAttribArray(mA.nor);
        gl.vertexAttribPointer(mA.nor, 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, m.count);
      }
      gl.frontFace(gl.CCW);
    };

    const request = () => {
      if (!raf && !disposed)
        raf = requestAnimationFrame(() => {
          raf = 0;
          draw();
        });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      cssW = Math.max(1, rect.width);
      cssH = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      computeRegion();
      if (asm) computeFit();
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
      setStatus("fallback");
    };
    canvas.addEventListener("webglcontextlost", onLost);
    cleanups.push(() => canvas.removeEventListener("webglcontextlost", onLost));

    const explode = () => {
      if (reduceMotion || lift === 0) {
        root.dataset.motion = "assembled";
        return;
      }
      root.dataset.motion = "separating";
      const start = performance.now() + CFG.explode.delayMs;
      const tick = (now: number) => {
        if (disposed) return;
        explodeT = Math.min(1, Math.max(0, (now - start) / CFG.explode.durationMs));
        draw();
        if (explodeT < 1) raf = requestAnimationFrame(tick);
        else {
          raf = 0;
          root.dataset.motion = "separated";
        }
      };
      raf = requestAnimationFrame(tick);
    };

    const load = async () => {
      const gz = await fetchBuffer(CFG.src, abort.signal, () => undefined);
      const a = parseAssembly(await gunzip(gz));
      if (disposed) return;
      // Centre the assembly (display coords) on its bounding box.
      const lo = [Infinity, Infinity, Infinity];
      const hi = [-Infinity, -Infinity, -Infinity];
      for (const x of [a.min[0], a.max[0]]) for (const y of [a.min[1], a.max[1]]) for (const z of [a.min[2], a.max[2]]) {
        const q = apply(SOURCE_TO_DISPLAY, x, y, z);
        for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k]!, q[k]!); hi[k] = Math.max(hi[k]!, q[k]!); }
      }
      const c = [0, 1, 2].map((k) => (lo[k]! + hi[k]!) / 2);
      height = Math.max(hi[0]! - lo[0]!, hi[1]! - lo[1]!, hi[2]! - lo[2]!);
      const liftFit = (hi[0]! - lo[0]!) * CFG.explode.amount; // framing always allows for the separation (same view with or without motion)
      lift = reduceMotion ? 0 : liftFit;
      base = multiply(translation(-c[0]!, -c[1]!, -c[2]!), SOURCE_TO_DISPLAY);
      const ext = [0, 1, 2].map((k) => Math.abs(hi[k]! - lo[k]!) / 2);
      // Fit to sampled vertices (assembled and separated positions), tighter than the bounding box.
      corners = [];
      for (const p of a.parts) {
        const m = a.meshes[p.mesh]!;
        const model = multiply(base, p.matrix);
        const step = Math.max(1, Math.floor(m.positions.length / 3 / 2000));
        for (let i = 0; i < m.positions.length / 3; i += step) {
          const w = apply(model, m.positions[i * 3]!, m.positions[i * 3 + 1]!, m.positions[i * 3 + 2]!);
          const dx = p.group === 1 ? liftFit : p.group === 2 ? -liftFit : 0;
          corners.push([w[0], w[1], w[2]], [w[0] + dx, w[1], w[2]]);
        }
      }
      corners.push([0, -ext[1]! - height * 0.03, 0]); // floor shadow level

      gpu = [];
      for (const m of a.meshes) {
        await new Promise<void>((r) => setTimeout(r, 0)); // keep the main thread responsive
        if (disposed) return;
        const r = buildRenderMesh(m, 38);
        gpu.push({ pos: makeBuffer(r.positions), nor: makeBuffer(r.normals), count: r.count });
      }

      // Soft floor shadow under the base (footprint of every part, vertex splat).
      const samples: Float32Array[] = a.parts.map((p) => {
        const m = a.meshes[p.mesh]!;
        const model = multiply(base, p.matrix);
        const step = Math.max(1, Math.floor(m.positions.length / 3 / 1500));
        const out: number[] = [];
        for (let i = 0; i < m.positions.length / 3; i += step) {
          const w = apply(model, m.positions[i * 3]!, m.positions[i * 3 + 1]!, m.positions[i * 3 + 2]!);
          out.push(w[0], w[1], w[2]);
        }
        return Float32Array.from(out);
      });
      const pad = Math.max(ext[0]!, ext[2]!) * 0.35;
      const rect = { x0: -ext[0]! - liftFit - pad, x1: ext[0]! + liftFit + pad, z0: -ext[2]! - pad, z1: ext[2]! + pad };
      const W = 160;
      const H = 160;
      const tex = footprintTexture(samples, rect, W, H);
      shadowTex = gl.createTexture()!;
      textures.push(shadowTex);
      gl.bindTexture(gl.TEXTURE_2D, shadowTex);
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, W, H, 0, gl.ALPHA, gl.UNSIGNED_BYTE, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const fy = -ext[1]! - height * 0.03;
      shadowBuf = makeBuffer(new Float32Array([rect.x0, fy, rect.z0, 0, 0, rect.x1, fy, rect.z0, 1, 0, rect.x0, fy, rect.z1, 0, 1, rect.x1, fy, rect.z1, 1, 1]));

      asm = a;
      computeRegion();
      computeFit();
      look = readLook(root);
      draw();
      setStatus("ready");
      explode();
    };

    // Start after the page itself has loaded, so the hero text and poster come first.
    let started = false;
    const begin = () => {
      if (started || disposed) return;
      started = true;
      void load().catch(() => {
        if (!disposed) setStatus("fallback");
      });
    };
    const schedule = () => {
      const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      if (idle) idle(begin, { timeout: 1500 });
      else setTimeout(begin, 300);
    };
    if (document.readyState === "complete") schedule();
    else {
      window.addEventListener("load", schedule, { once: true });
      cleanups.push(() => window.removeEventListener("load", schedule));
    }

    return () => {
      disposed = true;
      abort.abort();
      if (raf) cancelAnimationFrame(raf);
      cleanups.forEach((c) => c());
      buffers.forEach((b) => gl.deleteBuffer(b));
      textures.forEach((t) => gl.deleteTexture(t));
      gl.deleteProgram(modelProg);
      gl.deleteProgram(flatProg);
    };
  }, []);

  const posterVars = {
    "--machine-poster-light-wide": `url(${CFG.posters.light.wide})`,
    "--machine-poster-light-tall": `url(${CFG.posters.light.tall})`,
    "--machine-poster-dark-wide": `url(${CFG.posters.dark.wide})`,
    "--machine-poster-dark-tall": `url(${CFG.posters.dark.tall})`,
  } as CSSProperties;

  return (
    <div ref={rootRef} className={cn("hero-machine", `is-${status}`, className)} style={posterVars} role="img" aria-label={CFG.alt}>
      <div className="hero-machine__poster" aria-hidden="true" />
      <canvas ref={canvasRef} className="hero-machine__canvas" aria-hidden="true" />
    </div>
  );
}
