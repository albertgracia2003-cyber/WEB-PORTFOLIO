"use client";

import { useEffect, useRef, useState } from "react";
import {
  multiply,
  normalMatrix,
  perspective,
  plateMesh,
  rotationX,
  rotationY,
  rotationZ,
  sculptureLayers,
  shaftMesh,
  translation,
  type LayerSpec,
  type Mesh,
} from "@/lib/sculpture";
import { cn } from "@/lib/utils";

/**
 * FIG. 00 — abstract brand artwork rendered with plain WebGL (no library).
 * - Static poster (CSS background, per theme) is shown first and whenever
 *   WebGL is unavailable, so the hero never depends on the canvas.
 * - Renders only while visible; reduced-motion visitors get the static poster.
 * - Responds gently to pointer and scroll; re-lights on theme change.
 */

const VERT = `
attribute vec3 aPos;
attribute vec3 aNor;
uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProj;
uniform mat3 uNormal;
varying vec3 vNor;
varying vec3 vPos;
void main() {
  vec4 world = uModel * vec4(aPos, 1.0);
  vPos = world.xyz;
  vNor = uNormal * aNor;
  gl_Position = uProj * uView * world;
}`;

const FRAG = `
precision highp float;
uniform vec3 uColor;
uniform vec3 uCam;
uniform vec3 uKey;
uniform vec3 uRimCol;
uniform vec3 uFill;
uniform float uAmbient;
uniform float uRim;
uniform float uSpec;
varying vec3 vNor;
varying vec3 vPos;
void main() {
  vec3 N = normalize(vNor);
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(uCam - vPos);
  vec3 L1 = normalize(vec3(-0.45, 0.85, 0.55));
  vec3 L2 = normalize(vec3(0.8, 0.1, -0.6));
  vec3 L3 = normalize(vec3(0.3, -0.85, 0.4));
  float d1 = max(dot(N, L1), 0.0);
  float d2 = max(dot(N, L2), 0.0);
  float d3 = max(dot(N, L3), 0.0);
  vec3 H = normalize(L1 + V);
  float spec = pow(max(dot(N, H), 0.0), 64.0) * uSpec;
  float fres = pow(1.0 - max(dot(N, V), 0.0), 5.0);
  vec3 c = uColor * (uAmbient + d1 * uKey + d3 * uFill * 0.45)
         + uRimCol * (d2 * 0.32 + fres * uRim)
         + vec3(spec);
  gl_FragColor = vec4(pow(clamp(c, 0.0, 1.0), vec3(0.92)), 1.0);
}`;

type Rgb = [number, number, number];
const hex = (h: string): Rgb => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as Rgb;

const PALETTE: Record<"light" | "dark", Record<LayerSpec["tone"] | "shaft", Rgb> & { ambient: number; rim: number; spec: number; key: Rgb; fill: Rgb }> = {
  light: {
    pearl: hex("#d9e0e8"),
    metal: hex("#a3afbd"),
    steel: hex("#56677e"),
    neutral: hex("#efe9e1"),
    accent: hex("#d86a50"),
    shaft: hex("#c9d2dc"),
    ambient: 0.52,
    rim: 0.35,
    spec: 0.3,
    key: [0.58, 0.6, 0.64],
    fill: [0.3, 0.38, 0.48],
  },
  dark: {
    pearl: hex("#b4bfcb"),
    metal: hex("#7f8d9d"),
    steel: hex("#46566c"),
    neutral: hex("#5a6370"),
    accent: hex("#d86a50"),
    shaft: hex("#8e9cac"),
    ambient: 0.3,
    rim: 0.6,
    spec: 0.38,
    key: [0.72, 0.75, 0.8],
    fill: [0.26, 0.34, 0.46],
  },
};
const RIM: Rgb = hex("#d86a50");

interface GpuMesh {
  pos: WebGLBuffer;
  nor: WebGLBuffer;
  count: number;
}

export function HeroSculpture({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Reduced motion: keep the static poster (same artwork, zero GPU cost).
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const gl = canvas.getContext("webgl", { antialias: true, alpha: true, premultipliedAlpha: true, preserveDrawingBuffer: false });
    if (!gl) return; // poster stays

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const aPos = gl.getAttribLocation(prog, "aPos");
    const aNor = gl.getAttribLocation(prog, "aNor");
    const u = (n: string) => gl.getUniformLocation(prog, n);
    const U = {
      model: u("uModel"),
      view: u("uView"),
      proj: u("uProj"),
      normal: u("uNormal"),
      color: u("uColor"),
      cam: u("uCam"),
      key: u("uKey"),
      rimCol: u("uRimCol"),
      fill: u("uFill"),
      ambient: u("uAmbient"),
      rim: u("uRim"),
      spec: u("uSpec"),
    };

    const upload = (m: Mesh): GpuMesh => {
      const pos = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, pos);
      gl.bufferData(gl.ARRAY_BUFFER, m.positions, gl.STATIC_DRAW);
      const nor = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, nor);
      gl.bufferData(gl.ARRAY_BUFFER, m.normals, gl.STATIC_DRAW);
      return { pos, nor, count: m.count };
    };

    const layers = sculptureLayers();
    const plates = layers.map((l) => upload(plateMesh(l)));
    const shaft = upload(shaftMesh(0.035, 4.4));

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 0);

    const eye: Rgb = [0, 0.15, 8];
    const view = translation(-eye[0], -eye[1], -eye[2]);
    gl.uniformMatrix4fv(U.view, false, view);
    gl.uniform3fv(U.cam, eye);
    gl.uniform3fv(U.rimCol, RIM);

    let theme: "light" | "dark" = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const applyLighting = () => {
      const p = PALETTE[theme];
      gl.uniform1f(U.ambient, p.ambient);
      gl.uniform1f(U.rim, p.rim);
      gl.uniform1f(U.spec, p.spec);
      gl.uniform3fv(U.key, p.key);
      gl.uniform3fv(U.fill, p.fill);
    };
    applyLighting();

    let width = 0;
    let height = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width * dpr));
      height = Math.max(1, Math.round(rect.height * dpr));
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniformMatrix4fv(U.proj, false, perspective((30 * Math.PI) / 180, width / height, 0.1, 50));
    };
    resize();

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let scroll = 0;

    const drawMesh = (m: GpuMesh, model: Float32Array, color: Rgb) => {
      gl.uniformMatrix4fv(U.model, false, model);
      gl.uniformMatrix3fv(U.normal, false, normalMatrix(model));
      gl.uniform3fv(U.color, color);
      gl.bindBuffer(gl.ARRAY_BUFFER, m.pos);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, m.nor);
      gl.enableVertexAttribArray(aNor);
      gl.vertexAttribPointer(aNor, 3, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, m.count);
    };

    const draw = (time: number) => {
      const t = time / 1000;
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
      const spacing = 0.34 + scroll * 0.18 + Math.sin(t * 0.55) * 0.015;
      const spin = 0.55 + t * 0.09 + pointer.x * 0.35;
      const tilt = 0.34 + pointer.y * 0.1 - scroll * 0.1;
      // Place the assembly slightly right of centre, axis leaning into the frame.
      const base = multiply(translation(0.2, -0.05, 0), multiply(rotationZ(-0.42), rotationX(tilt)));
      const pal = PALETTE[theme];

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      drawMesh(shaft, multiply(base, rotationY(spin)), pal.shaft);
      const mid = (layers.length - 1) / 2;
      layers.forEach((l, i) => {
        const bob = Math.sin(t * 0.8 + i * 0.7) * 0.01;
        const model = multiply(base, multiply(translation(0, (i - mid) * spacing + bob, 0), rotationY(spin + l.twist)));
        drawMesh(plates[i]!, model, pal[l.tone]);
      });
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = true;
    const loop = (time: number) => {
      draw(time);
      raf = visible && !reduce ? requestAnimationFrame(loop) : 0;
    };
    const start = () => {
      if (!raf && !reduce) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    draw(performance.now());
    const readyId = requestAnimationFrame(() => setReady(true));
    start();

    const io = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting) && document.visibilityState === "visible";
      if (visible) start();
      else stop();
    });
    io.observe(canvas);

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      if (visible) start();
      else stop();
    };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.tx = e.clientX / window.innerWidth - 0.5;
      pointer.ty = e.clientY / window.innerHeight - 0.5;
    };
    const onScroll = () => {
      scroll = Math.min(1, Math.max(0, window.scrollY / Math.max(1, window.innerHeight)));
      if (reduce) draw(performance.now());
    };
    const onTheme = () => {
      theme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      applyLighting();
      draw(performance.now());
    };
    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("themechange", onTheme);

    return () => {
      stop();
      cancelAnimationFrame(readyId);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("themechange", onTheme);
      [...plates, shaft].forEach((m) => {
        gl.deleteBuffer(m.pos);
        gl.deleteBuffer(m.nor);
      });
      gl.deleteProgram(prog);
    };
  }, []);

  return (
    <div className={cn("hero-sculpture", ready && "is-ready", className)} aria-hidden="true">
      <div className="hero-sculpture__poster" />
      <canvas ref={canvasRef} className="hero-sculpture__canvas" />
      <div className="hero-sculpture__shadow" />
    </div>
  );
}
