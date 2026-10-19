# Asset Manifest

Every visual on the site is a **slot** in `src/content/media.ts`. A slot without `src` renders a labelled technical-sheet placeholder (in production the file path is hidden and the label reads "Original media in preparation").

**Status (16 Oct 2026, night):** 27 of 51 slots supplied. New: City daylight aerial render; transparent MotoSpirit logo and cleaned bar-stool sketch (derivatives). The portrait is **not used** (Albert asked to remove it; its web derivative was deleted).
**Real project assets received:** the five ORTESIS STUDIO STL models (homepage flagship), the scanning-machine CAD model (homepage hero), four ORTESIS prototype photographs, a Geometry Nodes screenshot and a recording of the ORTESIS STUDIO application, and screen recordings of the Procedural City Generator and the Parametric Drawer System (see the sections below).

## How to publish an asset

1. Keep originals outside the repo (e.g. `/media-source/`, already git-ignored). Never overwrite them.
2. Export an optimised copy into `public/assets/<project>/`:
   - Photos / renders / CAD screenshots → **WebP or AVIF**, longest edge 2560 px (hero) or 1600 px (others), quality ~80. Strip EXIF/GPS.
   - Video loops → **MP4 (H.264)**, 1080p max, 6–15 s, no audio track, ~2–6 MB; plus a WebP poster frame.
   - Screen recordings with speech → add a `.vtt` caption file and set `captionsTrack`.
   - 3D → convert STL to **GLB**, decimate to < 2 MB, Draco/Meshopt compression, real-world scale in metres.
3. In `src/content/media.ts` set `src`, `width`/`height` (images), `poster` (videos) and a real `alt`.
4. Check the ratio: the frame crops to the slot's `aspect` with `object-fit: cover`. If the original has a different ratio, change `aspect` in the registry rather than distorting the layout.

Before publishing anything, confirm the material is yours to show (no employer CAD, drawings, customer data or private photos — see `CONTENT_NOTES.md`).

## Slots

Entries listed in `src/content/showcase.ts` (City, Drawer, Chair) whose slot has no file yet are simply **not rendered** — no placeholder appears on those pages until the file exists.

### ORTESIS STUDIO

| Slot id | Kind | Ratio | What it should show | Recommended file | Used in | Status |
|---|---|---|---|---|---|---|
| `ortesis-hero` | image | 16/10 | System overview — scanning machine, laptop and printer | `/assets/ortesis-studio/ortesis-system-overview.webp` | work/ortesis-studio/page.tsx | ✅ supplied |
| `ortesis-result` | image | 13/9 | Printed orthosis prototype shown on an arm | `/assets/ortesis-studio/ortesis-orthosis-on-arm.webp` | work/ortesis-studio/page.tsx | ✅ supplied |
| `ortesis-machine-overview` | image | 4/3 | Scanning machine — overview photograph | `/assets/ortesis-studio/ortesis-machine-overview.webp` | — | ⏳ pending |
| `ortesis-machine-cad` | image | 16/10 | Scanning machine — CAD model render | `/assets/ortesis-studio/ortesis-machine-cad.webp` | work/ortesis-studio/page.tsx | ✅ supplied |
| `ortesis-gear-detail` | image | 3/4 | Rotation drive — pinion on the ring gear | `/assets/ortesis-studio/ortesis-ring-gear-drive.webp` | work/ortesis-studio/page.tsx | ✅ supplied |
| `ortesis-carriage` | image | 16/10 | Translation drive — scanner carriage on guide rails | `/assets/ortesis-studio/ortesis-scanner-carriage.webp` | work/ortesis-studio/page.tsx | ✅ supplied |
| `ortesis-electronics` | image | 1/1 | Electronics integration — detail | `/assets/ortesis-studio/ortesis-electronics.webp` | — | ⏳ pending |
| `ortesis-motion-demo` | video | 16/9 | Machine motion — short loop | `/assets/ortesis-studio/ortesis-motion-demo.mp4` | — | ⏳ pending |
| `ortesis-scan-input` | image | 4/3 | Stage 1 — input scan geometry | `/assets/ortesis-studio/ortesis-scan-input.webp` | — | ⏳ pending |
| `ortesis-geometry-intermediate` | image | 4/3 | Stage 2 — intermediate geometry | `/assets/ortesis-studio/ortesis-geometry-intermediate.webp` | — | ⏳ pending |
| `ortesis-geometry-parametric` | image | 4/3 | Stage 3 — parameterised orthosis geometry | `/assets/ortesis-studio/ortesis-geometry-parametric.webp` | — | ⏳ pending |
| `ortesis-geometry-final` | image | 4/3 | Stage 4 — final digital model | `/assets/ortesis-studio/ortesis-geometry-final.webp` | — | ⏳ pending |
| `ortesis-nodes` | image | 3/1 | Geometry Nodes graph — complete overview | `/assets/ortesis-studio/ortesis-geometry-nodes.webp` | work/ortesis-studio/page.tsx | ✅ supplied |
| `ortesis-web-interface` | video | 40/19 | ORTESIS STUDIO application — screen recording | `/assets/ortesis-studio/ortesis-app-demo.mp4` | work/ortesis-studio/page.tsx | ✅ supplied |
| `ortesis-print-photo` | image | 4/3 | Printed orthosis — photograph for comparison | `/assets/ortesis-studio/ortesis-print-photo.webp` | — | ⏳ pending |
| `ortesis-print-digital` | image | 4/3 | Digital model — same viewpoint as the photograph | `/assets/ortesis-studio/ortesis-print-digital.webp` | — | ⏳ pending |
| `ortesis-model` | model | 4/3 | Orthosis 3D model for interactive inspection | `/assets/ortesis-studio/ortesis-orthosis.glb (from STL, decimated)` | work/ortesis-studio/page.tsx | ⏳ pending |

### Procedural City Generator

| Slot id | Kind | Ratio | What it should show | Recommended file | Used in | Status |
|---|---|---|---|---|---|---|
| `city-hero` | video | 17/9 | Generated city — Blender viewport loop | `/assets/procedural-city/city-generator-loop.mp4` | — | ✅ supplied |
| `city-demo` | video | 17/9 | Generated city — full screen recording | `/assets/procedural-city/city-generator-demo.mp4` | — | ✅ supplied |
| `city-clip-layouts` | video | 16/9 | Clip — layouts at different sizes | `/assets/procedural-city/city-clip-layouts.mp4` | — | ✅ supplied |
| `city-clip-street` | video | 16/9 | Clip — street level | `/assets/procedural-city/city-clip-street.mp4` | — | ✅ supplied (not used on the page since 19 Oct 2026 — replaced in “Inside the result”) |
| `city-clip-flyover` | video | 16/9 | Clip — moving through the result | `/assets/procedural-city/city-clip-flyover.mp4` | — | ✅ supplied (not used on the page since 19 Oct 2026 — replaced in “Inside the result”) |
| `city-aerial-day` | video | 16/9 | Aerial view — daylight render | `/assets/procedural-city/city-aerial-day.mp4` | — | ✅ supplied |
| `city-aerial-night` | video | 16/9 | Aerial view — night render | `/assets/procedural-city/city-aerial-night.mp4` | — | ⏳ pending |
| `city-nodes-recording` | video | 16/9 | Geometry Nodes — screen recording | `/assets/procedural-city/city-geometry-nodes.mp4` | — | ⏳ pending |
| `city-input-plane` | image | 4/3 | Input plane — layout | `/assets/procedural-city/city-input-plane.webp` | — | ⏳ pending |
| `city-subdivision` | image | 4/3 | Plane with subdivisions | `/assets/procedural-city/city-subdivision.webp` | — | ⏳ pending |
| `city-roads` | image | 4/3 | Generated roads | `/assets/procedural-city/city-roads.webp` | — | ⏳ pending |
| `city-blocks` | image | 4/3 | Generated building blocks | `/assets/procedural-city/city-blocks.webp` | — | ⏳ pending |
| `city-scene` | image | 16/9 | Complete generated scene | `/assets/procedural-city/city-generated-scene.webp` | — | ✅ supplied |
| `city-nodes` | image | 16/9 | Geometry Nodes — authentic screenshot | `/assets/procedural-city/city-geometry-nodes.webp` | — | ⏳ pending |
| `city-render-01` | image | 3/2 | Viewport frame — street level A | `/assets/procedural-city/city-viewport-street-01.webp` | — | ✅ supplied (not used on the page since 19 Oct 2026 — replaced in “Inside the result”) |
| `city-render-02` | image | 3/2 | Viewport frame — street level B | `/assets/procedural-city/city-viewport-street-02.webp` | — | ✅ supplied (not used on the page since 19 Oct 2026 — replaced in “Inside the result”) |
| `city-grid-recording` | video (controls) | 1918/1024 | Grid layout generation — Blender screen recording (80 s, no audio, full window) | `/assets/procedural-city/city-grid-layout-generation.mp4` (+ `.webm`, `-poster.webp`) | original `GRID LAYOUT GENERATION.mp4` (1918×1024, 84 MB) kept by Albert; web version re-encoded without the silent audio track | ✅ supplied |
| `city-render-elevated` | image | 16/9 | Render — elevated view of the towers | `/assets/procedural-city/city-render-elevated-towers.webp` (1920×1080) | `media-source/procedural-city/city-render-elevated-towers.png` | ✅ supplied |
| `city-render-street` | image | 16/9 | Render — street level at golden hour | `/assets/procedural-city/city-render-street-golden-hour.webp` (1920×1080) | `media-source/procedural-city/city-render-street-golden-hour.png` | ✅ supplied |

### Parametric Drawer System

| Slot id | Kind | Ratio | What it should show | Recommended file | Used in | Status |
|---|---|---|---|---|---|---|
| `drawer-hero` | video | 17/9 | Drawer system — Blender viewport loop | `/assets/parametric-drawer/drawer-generator-loop.mp4` | — | ✅ supplied |
| `drawer-demo` | video | 17/9 | Drawer system — full screen recording | `/assets/parametric-drawer/drawer-generator-demo.mp4` | — | ✅ supplied |
| `drawer-clip-in-drawer` | video | 16/9 | Clip — layouts inside the drawer | `/assets/parametric-drawer/drawer-clip-in-drawer.mp4` | — | ✅ supplied |
| `drawer-clip-organiser` | video | 16/9 | Clip — the organiser on its own | `/assets/parametric-drawer/drawer-clip-organiser.mp4` | — | ✅ supplied |
| `drawer-nodes-recording` | video | 16/9 | Geometry Nodes — screen recording | `/assets/parametric-drawer/drawer-geometry-nodes.mp4` | — | ⏳ pending |
| `drawer-nodes` | image | 16/9 | Geometry Nodes — authentic screenshot | `/assets/parametric-drawer/drawer-geometry-nodes.webp` | — | ⏳ pending |
| `drawer-variation-01` | image | 16/9 | Variation — inside the drawer | `/assets/parametric-drawer/drawer-variation-01.webp` | — | ✅ supplied |
| `drawer-variation-02` | image | 16/9 | Variation — denser layout | `/assets/parametric-drawer/drawer-variation-02.webp` | — | ✅ supplied |
| `drawer-variation-03` | image | 16/9 | Variation — organiser on its own | `/assets/parametric-drawer/drawer-variation-03.webp` | — | ✅ supplied |

### Chair

| Slot id | Kind | Ratio | What it should show | Recommended file | Used in | Status |
|---|---|---|---|---|---|---|
| `chair-hero` | image | 3/4 | Bar stool — main photograph | `/assets/chair-design/bar-stool-photo.webp` | work/chair-design/page.tsx<br>home/PhysicalSection.tsx | ✅ supplied |
| `chair-cad-sketch` | image | 4/5 | Bar stool — CAD sketch (side) | `/assets/chair-design/bar-stool-cad-sketch-clean.webp` | work/chair-design/page.tsx | ✅ supplied |
| `chair-view-01` | image | 4/5 | Additional angle — front or side | `/assets/chair-design/bar-stool-view-01.webp` | — | ⏳ pending |
| `chair-view-02` | image | 4/5 | Additional angle — rear | `/assets/chair-design/bar-stool-view-02.webp` | — | ⏳ pending |
| `chair-detail-01` | image | 1/1 | Close-up — backrest connection | `/assets/chair-design/bar-stool-detail-01.webp` | — | ⏳ pending |
| `chair-detail-02` | image | 1/1 | Close-up — seat edge and grain | `/assets/chair-design/bar-stool-detail-02.webp` | — | ⏳ pending |

### MotoSpirit

| Slot id | Kind | Ratio | What it should show | Recommended file | Used in | Status |
|---|---|---|---|---|---|---|
| `motospirit-cover` | image | 4/3 | MotoSpirit ESEIAAT — team logo | `/assets/motospirit/motospirit-logo-transparent.webp` | — | ✅ supplied |

### AED Monitoring

| Slot id | Kind | Ratio | What it should show | Recommended file | Used in | Status |
|---|---|---|---|---|---|---|
| `aed-cover` | image | 4/3 | AED cabinet in a station concourse — **AI-generated** context illustration (caption: "AI-generated contextual illustration — not the project prototype."; not a tested device, not evidence of implementation) | `/assets/aed-monitoring/aed-context-illustration.webp` (1448 × 1086) | AED Monitoring panel (homepage Physical section; supporting panel on `/work/chair-design`) | ✅ supplied 19 Oct 2026 (second illustration — green/white cabinet — supplied later the same day; first version kept as `aed-context-illustration-v1-superseded.png` in git-ignored `media-source/`) |

### Profile

| Slot id | Kind | Ratio | What it should show | Recommended file | Used in | Status |
|---|---|---|---|---|---|---|
| `profile-portrait` | image | 4/5 | Portrait — monochrome cut-out | `/assets/profile/portrait-mono.webp` | about/page.tsx<br>home/Portrait.tsx | ⏳ pending |

## ORTESIS STUDIO 3D models (homepage flagship stack)

Supplied by Albert on 16 Oct 2026. Configured in `src/content/ortesis-models.ts` (paths, labels, order); rendered by `components/graphics/OrtesisModelStack.tsx`. All five files share one coordinate system (mm, Z up; STL header "ORTESIS STUDIO - PROTOTIPO - NO APTO PARA USO CLINICO").

| Position | Label | Original STL (unchanged, byte-identical) | Triangles | Size | Lossless derivative | Size |
|---|---|---|---|---|---|---|
| 5 (top) | 05 — Final orthosis | `05_ortesis.stl` | 19,584 | 0.98 MB | `05_ortesis.mesh.bin` | 0.23 MB |
| 4 | 04 — Design preview | `04_vista_previa.stl` | 23,264 | 1.16 MB | `04_vista_previa.mesh.bin` | 0.29 MB |
| 3 | 03 — Trimmed mesh | `03_malla_recortada.stl` | 26,355 | 1.32 MB | `03_malla_recortada.mesh.bin` | 0.32 MB |
| 2 | 02 — Anatomical mesh | `02_malla_anatomica.stl` | 99,255 | 4.96 MB | `02_malla_anatomica.mesh.bin` | 1.19 MB |
| 1 (bottom) | 01 — Original scan | `01_escaneo_original.stl` | 99,359 | 4.97 MB | `01_escaneo_original.mesh.bin` | 1.19 MB |

All in `public/assets/ortesis-studio/models/`. Totals: STL 13.4 MB · derivatives 3.2 MB.

- **Derivatives (`.mesh.bin`)** — written by `node scripts/pack-stl-models.mjs`. Same vertex coordinates (float32, bit-for-bit) and the same triangles; only the STL's repeated vertices are merged and the stored facet normals / attribute bytes are dropped (the viewer recomputes normals). The script verifies every triangle against its STL. Nothing is decimated or smoothed. The viewer loads the derivative and falls back to the STL if it is missing or unreadable.
- **Posters** — `stack-poster-{light,dark}-{wide,tall}.webp` (27–43 kB): transparent still renders of the real models in the viewer's initial view (square desktop frame, 4:5 mobile frame). Shown while the models load and when WebGL is unavailable. Regenerate them after changing models, gap or camera (transparent screenshot of the canvas at 1440 px and 390 px wide), or delete them — the viewer works without posters.
- **Replacing a model** — copy the new STL into the folder, update `src` in the config, re-run the pack script (or remove the `packed` entry), regenerate posters.
- **Public files** — anything in `public/` can be downloaded by visitors, including these meshes (an anatomical scan of an arm). Confirm that is acceptable before deploying.

## Scanning-machine CAD model (formerly the homepage hero)

**Removed from the homepage on 16 Oct 2026 (late)** at Albert's request — the opening is now typography only. The component (`HeroMachine.tsx`), config (`hero-machine.ts`) and files below are kept unused, so the model can return elsewhere; the CAD *still render* is used in ORTESIS ch. 2.

Supplied 16 Oct 2026: `Conjunt fotogrametria.STL` — binary STL, 528,732 triangles, mm, Z up, 648 × 597 × 695 mm, one colour (no material data in the file).

- **Original** — kept unchanged at `media-source/ortesis-studio/Conjunt fotogrametria.STL` (git-ignored, not served).
- **Structure found** — 52 separate bodies (no shared vertices): top plate with ring gear and motor mount + 8 rod arms; base plate with ring gear and motor mount + 8 rod arms; 8 vertical rods; 2 inner guide rods; carriage with its parts. 29 bodies are exact copies of others (e.g. the 16 rod arms, the rods). No assembly constraints or part names survive in an STL.
- **Not deployed (moved 19 Oct 2026):** the web file and posters below now live in git-ignored `media-source/_removed-before-publication/public-unused/ortesis-studio/machine/` because nothing on the site uses them. Move the folder back to `public/assets/ortesis-studio/machine/` before re-enabling `HeroMachine`.
- **Web file** — `machine/scanning-machine.agm.gz` (1.34 MB; renamed from `photogrammetry-machine.agm.gz` on 16 Oct — the machine carries a Creality 3D scanner, not a photogrammetry camera set-up) written by `node scripts/pack-assembly.mjs "<stl>" <out>`: each unique body once + a transform per copy, vertices quantised to 16 bits per body (max deviation measured 0.004 mm), same triangles, gzip. 26.4 MB → 1.34 MB. Decoded in the browser by `lib/assembly.ts`.
- **Orientation** — shown as the built prototype stands: ring axis horizontal (the arm passes through the rings), frames upright (`orientation: { axis: [0,0,1], up: [0,1,0] }`), view yaw −58°, pitch 14°, machine in the upper-right region on desktop. Confirmed by Albert on 16 Oct 2026 — keep it.
- **Separation** — the two end frames (with their ring gears) move apart along the machine's long axis by 6.5 % of its length, once; rods and carriage stay.
- **Posters** — `hero-machine-{light,dark}-{wide,tall}.webp` (21–34 kB): transparent renders of the assembled view in the confirmed orientation (regenerated 16 Oct). Regenerate after changing the model, orientation or view.
- **Config** — `src/content/hero-machine.ts` (file, posters, view angle, separation, caption).

## ORTESIS STUDIO photographs, screenshot and application recording

Supplied 16 Oct 2026. Originals unchanged in `media-source/ortesis-studio/` (git-ignored, not served). Web copies in `public/assets/ortesis-studio/`, EXIF stripped, native size (no upscaling).

| Original | Web file | Size | Slot | Placement |
|---|---|---|---|---|
| `photo-system-overview.png` (1154 × 711) — machine, laptop with the app and the node graph, Creality printer | `ortesis-system-overview.webp` | 63 kB | `ortesis-hero` (16/10, lazy) | ORTESIS “One workflow, machine to print” band, beside the workflow text (not the cover, not the homepage) |
| `photo-scanner-carriage.png` (1218 × 768) — belt-driven carriage, scanner, two gear motors | `ortesis-scanner-carriage.webp` | 48 kB | `ortesis-carriage` (16/10) | Ch. 3 Movement & control — translation |
| `photo-ring-gear-drive.png` (698 × 955) — pinion on the ring gear | `ortesis-ring-gear-drive.webp` | 34 kB | `ortesis-gear-detail` (3/4) | Ch. 3 — rotation |
| `photo-orthosis-on-arm.png` (1135 × 784) — printed prototype on an arm | `ortesis-orthosis-on-arm.webp` | 37 kB | `ortesis-result` (13/9) | Ch. 6 The printed result |
| `screenshot-geometry-nodes.png` (1280 × 436) | `ortesis-geometry-nodes.webp` (lossless) | 124 kB | `ortesis-nodes` (3/1) | Ch. 4 — enlargeable (`MediaZoom`, opens at native 1280 px) |
| `Ortesis Demo.mp4` (2276 × 1080, 50.1 s, 41 MB, silent audio −91 dB) | `ortesis-app-demo.webm` (VP9) / `.mp4` (H.264), 1920 × 912, no audio, faststart; poster `ortesis-app-demo-poster.webp` (frame at 49.8 s) | 3.2 MB / 4.9 MB / 89 kB | `ortesis-web-interface` (40/19, native controls) | Ch. 5 The application (`AppWalkthrough`) |
| `Conjunt fotogrametria.STL` (CAD) | `ortesis-machine-cad.webp` — 1600 × 1000 transparent still render in the hero orientation | 65 kB | `ortesis-machine-cad` (16/10) | Ch. 2 The scanning machine — captioned as a CAD render |

- Each photo appears once, on the case page only. Photos are not inverted or filtered in dark mode.
- **Chapter timestamps** (read from the recording): 0:00 Import · 0:02 Prepare · 0:14 Design · 0:44 Generate · 0:46 Inspect. The recording does **not** show Export, so there is no Export chapter.
- The recording shows the app window only (no browser address bar or local URL). The page adds no link or launch button to the private app.
- The app's own step bar reads "Matter · Prepare · Design · Export"; the page uses Import → Prepare → Design → Export as in the brief.
- Higher-resolution originals of the four photos (≥ 2000 px wide) would sharpen the hero and result images on large screens — swap the files and keep the names.

## Project videos (city, drawer)

Supplied 16 Oct 2026. Originals kept unchanged in `media-source/` (git-ignored). Both are Blender screen recordings at 30 fps with a **silent** audio track (−91 dB), so the web versions have no audio. Source resolution is low (≈1080 × 576), so clips look soft when shown large — higher-resolution recordings would help.

| Source | Web files | Used |
|---|---|---|
| `Demo city generator.mp4` (43.3 s) | `city-clip-layouts` (2.2–13.5 s, viewport only, 784 × 440) | Homepage, collection page, City page top |
| | `city-clip-street` (15.4–25 s, 640 × 360) · `city-clip-flyover` (25–36 s, 640 × 360) | City page sequence |
| | `city-generator-demo` (full, Blender UI, controls) | City page “Full recording” |
| | `city-generator-loop` (0–7.9 s, full frame) | not used any more |
| `DEMO Drawer.mp4` (36.6 s) | `drawer-clip-in-drawer` (0–22.5 s, 784 × 440) | Homepage, collection page, Drawer page top |
| | `drawer-clip-organiser` (23.5–36.6 s, 784 × 440) | Drawer page sequence |
| | `drawer-generator-demo` (full, controls) · 3 stills | Drawer page |
| | `drawer-generator-loop` (0–12 s, full frame) | not used any more |

- Clips are cropped to the Blender viewport (toolbar, side panel and navigation gizmo removed), VP9 WebM + H.264 MP4, no audio, faststart, posters from the clip.
- Loops are muted, play only while visible (never with reduced motion; play/pause button always there) and may play side by side. A recording with controls plays alone (starting it pauses everything else). Files attach only near the viewport.
- **To add a clip:** encode it the same way into `public/assets/<project>/`, register a slot in `media.ts`, add `{ id, title }` to the project in `src/content/showcase.ts`. Order there = order on the page.

## Added 16 Oct 2026 (night)

| Original (unchanged, `media-source/`) | Web file | Slot | Notes |
|---|---|---|---|
| `procedural-city/daylight_video0001-0072.mkv` (1920 × 1080, 24 fps, 3 s, rendered) | `city-aerial-day.{webm,mp4}` (1600 × 900, no audio) + poster | `city-aerial-day` | City page “From above”; homepage supporting clip. Loops. |
| — (expected) | `city-aerial-night.mp4` | `city-aerial-night` | When it exists, “From above” becomes a Day / Night selector (`DayNight.tsx`) — assumes the same framing as the day render; otherwise list the clips separately. |
| — (expected) | `city-geometry-nodes.mp4`, `drawer-geometry-nodes.mp4` | `city-nodes-recording`, `drawer-nodes-recording` | “Behind the system” sections (controls, enlargeable via fullscreen). Hidden until supplied. |
| `profile/portrait-original.jpg` (1086 × 1029) | — (a monochrome cut-out was made, then deleted) | `profile-portrait` (no `src`) | **Not used** — removed at Albert's request. The derivative was deleted from `public/` so it can't be downloaded from the site. |
| `motospirit/logo-motospirit-eseiaat.jpg` | `motospirit-logo-transparent.webp` (320 × 128, lossless, alpha) | `motospirit-cover` (`fit: contain`) | Background removed from the border inwards only, so the white lettering (enclosed by black) is kept; the thin gaps between the red stripes are open to the background and are transparent (negative space). Edge pixels un-mixed from white — no halo on light or dark. The original JPEG is low-resolution (400 px). |
| `chair-design/portfolio-sheet-bar-stool-cad.png` | `bar-stool-cad-sketch-clean.webp` (343 × 437, lossless, alpha) | `chair-cad-sketch` (`fit: contain`) | CAD screenshot (not a pencil sketch): gradient background removed by background estimation + un-mixing; all lines, dimensions, dashed construction lines and blue points kept. Shown on a light “paper” backing in both themes (`--paper`), because the dark lines disappear on graphite. |

## Chair (bar stool) and team projects

Supplied 16 Oct 2026 (late). Originals unchanged in `media-source/chair-design/`, `media-source/aed-monitoring/`, `media-source/motospirit/`.

| Original | Web file | Slot | Use |
|---|---|---|---|
| `photo-bar-stool.png` (1076 × 1462) | `bar-stool-photo.webp` (1076 × 1435, cropped to 3:4) | `chair-hero` | Chair page main photo; homepage Physical section |
| `portfolio-sheet-bar-stool-cad.png` (918 × 443, a page from an earlier portfolio) | `bar-stool-cad-sketch.webp` (350 × 437 — superseded by the cleaned cut-out above) | — | not used |
| `photo-aed-cabinet.jpg` (7416 × 4949, third-party stock photo) | `aed-cabinet.webp` — **removed from `public/` 19 Oct 2026**, replaced by the AI-generated illustration below | — | not used (original kept only in git-ignored `media-source/`; never redistribute it, and never serve it from `public/`). **Open:** whether that photo was used as a reference when the new illustration was generated is unconfirmed, so the illustration is not assumed to be free of that photo's licence terms |
| `aed-context-illustration-original.png` (1448 × 1086, AI-generated, supplied 19 Oct 2026) | `aed-context-illustration.webp` (1448 × 1086, native size, q82, no metadata) | `aed-cover` | AED Monitoring panel — contextual imagery only, captioned "AI-generated contextual illustration — not the project prototype." |
| `logo-motospirit-eseiaat.jpg` (400 × 400) | `motospirit-logo.webp` (white background — superseded by the transparent version) | — | not used |

- Further chair views: slots `chair-view-01/02`, `chair-detail-01/02` (listed in `chairGallery`, `showcase.ts`). The gallery section appears once one file exists.

## Not using media slots

- **Code-made illustrations no longer shown** (kept in the repo, unused): `HeroSculpture.tsx` (old hero artwork), `HeroMachine.tsx` (CAD hero), `ProcessStack.tsx` (ORTESIS isometric — replaced by the overview photo), `CityRuleDiagram.tsx` (city schematic), `DrawerConfigurator.tsx` (simplified browser drawer demo), `ScrollSequence.tsx`, `ComparisonSlider.tsx`. Safe to delete once you're sure you don't want them back.
- **Social preview image** (1200×630) — set `site.ogImage` in `src/content/site.ts` once a real project image exists.
- **CV PDF** — place at `public/assets/documents/` and set `site.cvUrl`.

## What to send first (highest visual impact)

1. **City:** short clips of the steps — input plane, subdivisions, roads, buildings (slots `city-input-plane` … `city-blocks`, already in the City sequence) — and a Geometry Nodes screenshot (`city-nodes`).
2. **Drawer:** a Geometry Nodes screenshot (`drawer-nodes`) and any further parameter-change clips.
3. **Chair:** further angles and close-ups (`chair-view-01/02`, `chair-detail-01/02`).
4. Higher-resolution City/Drawer recordings and ORTESIS photos (same framing).
5. Optional: a MotoSpirit chassis image and an AED project image, if you have permission.

## Added / changed 17 Oct 2026

| Item | File | Notes |
|---|---|---|
| Hero orthosis | `models/ortesis-prototipo.mesh.bin` (5.45 MB, lossless) | From `media-source/ortesis-studio/ortesis_prototipo_for_presentation.stl` (15.2 MB, unchanged). Hero shows it only via the packed file. |
| App stills | `ortesis-app-import/prepare/design/result.webp` (2276 × 1080) | Frames of `Ortesis Demo.mp4` at 1 s, 13 s, 26 s, 47 s |
| City/Drawer clips, demos, aerial day, app recording | `*.mp4` / `*.webm` / posters | Re-encoded from originals, full frame, native size (city 1088 × 576, drawer 1072 × 576, aerial 1920 × 1080, app 2276 × 1080). Aspect ratios in `media.ts` are the exact source ratios. |
| `ortesis-model` slot | removed | The viewer uses `05_ortesis.mesh.bin` (STL fallback). |
| `upc-logo` | pending | No file supplied. |

## Metadata clean-up (19 Oct 2026)
`public/assets/procedural-city/city-aerial-day.webm` and `.mp4` carried container metadata (local `.blend` path, scene name, timestamp). Both were remuxed losslessly with `ffmpeg -map_metadata -1 -c copy -fflags +bitexact` (same streams, same duration). A scan of all 42 images and 20 videos in `public/` found no other personal strings. The Blender title bar visible *inside* four videos and the city-grid poster is a separate, still-open item (see `docs/LEGAL_OPEN_ITEMS.md`).
