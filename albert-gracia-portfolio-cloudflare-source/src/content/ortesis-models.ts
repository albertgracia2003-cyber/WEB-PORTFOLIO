/**
 * ORTESIS STUDIO — real project models shown in the homepage flagship stack.
 *
 * To replace a model: drop the new STL into `public/assets/ortesis-studio/models/`,
 * point `src` at it, then either re-run `node scripts/pack-stl-models.mjs`
 * (regenerates the lossless `.mesh.bin` derivatives) or remove `packed` for that
 * stage so the viewer reads the STL directly.
 *
 * Stages are listed BOTTOM → TOP. All files share one coordinate system
 * (millimetres, Z up); the viewer keeps that registration and scale and only
 * separates the models vertically for display.
 */

import { withBase } from "@/lib/base";

export interface ModelStage {
  id: string;
  n: string;
  label: string;
  /** Original STL (served unchanged). */
  src: string;
  /** Optional lossless derivative (same vertices and triangles). Preferred when present; STL is the fallback. */
  packed?: string;
  /** Terracotta highlight. */
  accent?: boolean;
}

const dir = withBase("/assets/ortesis-studio/models");

export const ortesisModelStack = {
  /** Axis of the source files that points up. */
  upAxis: "z" as const,
  /** Display gap between consecutive models, in source units (mm). */
  gapMm: 34,
  stages: [
    { id: "original-scan", n: "01", label: "Original scan", src: `${dir}/01_escaneo_original.stl`, packed: `${dir}/01_escaneo_original.mesh.bin` },
    { id: "anatomical-mesh", n: "02", label: "Anatomical mesh", src: `${dir}/02_malla_anatomica.stl`, packed: `${dir}/02_malla_anatomica.mesh.bin` },
    { id: "trimmed-mesh", n: "03", label: "Trimmed mesh", src: `${dir}/03_malla_recortada.stl`, packed: `${dir}/03_malla_recortada.mesh.bin` },
    { id: "design-preview", n: "04", label: "Design preview", src: `${dir}/04_vista_previa.stl`, packed: `${dir}/04_vista_previa.mesh.bin` },
    { id: "final-orthosis", n: "05", label: "Final orthosis", src: `${dir}/05_ortesis.stl`, packed: `${dir}/05_ortesis.mesh.bin`, accent: true },
  ] satisfies ModelStage[],
  /** Still renders of the initial view (used while loading and without WebGL). */
  posters: {
    light: { wide: `${dir}/stack-poster-light-wide.webp`, tall: `${dir}/stack-poster-light-tall.webp` },
    dark: { wide: `${dir}/stack-poster-dark-wide.webp`, tall: `${dir}/stack-poster-dark-tall.webp` },
  },
  /** Accessible description (screen readers only). */
  caption: "Five ORTESIS STUDIO project models, from the original scan at the bottom to the final orthosis at the top.",
};

/** The final orthosis on its own (used by the homepage hero and the case-study viewer). Same files as stage 05. */
export const finalOrthosis = ortesisModelStack.stages.find((s) => s.id === "final-orthosis")!;

/**
 * Higher-resolution orthosis prototype shown large behind the homepage headline (supplied 17 Oct 2026,
 * `ortesis_prototipo for presentation.stl`, 303 104 triangles, ~279 × 84 × 101 mm). The original STL stays in
 * `media-source/ortesis-studio/`; the site serves the lossless packed derivative (same vertices and triangles).
 */
export const heroOrthosis = { packed: `${dir}/ortesis-prototipo.mesh.bin` } as { packed: string; src?: string };
