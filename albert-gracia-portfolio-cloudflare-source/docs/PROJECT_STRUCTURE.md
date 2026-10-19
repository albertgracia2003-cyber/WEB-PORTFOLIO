# Project Structure

```
src/
  app/                              Next.js App Router (all routes statically rendered)
    layout.tsx                      Fonts (Geist via next/font), metadata, JS flag, SiteShell
    page.tsx                        Homepage: Hero → ORTESIS → Computational → Physical → About → Contact
    globals.css                     Imports styles/*
    work/ortesis-studio/            Flagship case study (7 chapters, process sequence, compare, breakdown)
    work/chair-design/              Editorial warm-tone page + lightbox gallery + supporting projects
    computational-design/           Collection index (rendered from projects.ts)
      procedural-city/              Case study with scroll-driven schematic sequence
      parametric-drawer/            Case study with conceptual configurator
    about/  contact/                Profile and contact
    not-found.tsx  sitemap.ts  robots.ts  icon.svg

  components/
    layout/      SiteShell, Header (compact on scroll, accessible mobile menu), ThemeToggle, Footer
    home/        Homepage sections
    projects/    CaseStudy (CaseHero, Chapter, Split, Disclosure, NextProject), ChapterNav,
                 SupportingProject, ContactLinks, AppWalkthrough (recording + chapter buttons; ORTESIS ch. 5),
                 Showcase (City/Drawer sections from showcase.ts: steps, mosaic, day/night, behind, recording),
                 DayNight (selector between two separate recordings), Thread (ORTESIS operate/geometry/print strip),
                 DrawerConfigurator (unused)
    media/       MediaFrame (single entry point for media), MediaPlaceholder (designed "studio stage"),
                 VideoMedia (ambient loops / recordings with controls, lazy sources, one video at a time),
                 MediaZoom (image that opens at native size in a <dialog>), MediaGallery (native <dialog>
                 lightbox), ComparisonSlider (currently unused)
    motion/      RevealController (one IntersectionObserver), ScrollSequence (currently unused), PauseOffscreen
    graphics/    HeroMachine (CAD model of the scanning machine — unused since the hero became typographic),
                 home/Portrait (unused — portrait removed),
                 OrtesisModelStack (the five real ORTESIS STL models with labels and a bounded pointer tilt,
                 homepage + case ch. 4), ProcessStack and CityRuleDiagram (unused),
                 HeroSculpture + HeroField (legacy, unused)
    graphics/    OrthosisViewer (hero + inspect), OrtesisModelStack, …
    ui/          primitives: SectionHeading, TagList, ArrowLink, MetaList, StatusBadge,
                 Breadcrumbs, DevNote

  content/       site.ts · profile.ts · projects.ts · media.ts · navigation.ts · ortesis-models.ts (STL paths,
                 labels, order) · hero-machine.ts (hero model file, posters, view, separation, caption)
  types/         project.ts · media.ts
  lib/           utils.ts · seo.ts · theme.ts (theme key + no-flash head script) · sculpture.ts (geometry + mat4)
                 · stl.ts (STL / packed-mesh parsing, vertex welding, normals) · assembly.ts (hero model decoder)
                 · model-render.ts (shared shaders, colours, floor shadow, buffered fetch)
  styles/        tokens.css (both themes) · base.css · layout.css · components.css · home.css · pages.css

public/assets/brand/                Hero artwork posters (light / dark)
public/assets/ortesis-studio/models/ Original STL models, lossless .mesh.bin derivatives, viewer posters
(not deployed) hero machine web file + posters: media-source/_removed-before-publication/public-unused/ortesis-studio/machine/
public/assets/procedural-city/, parametric-drawer/  Web videos (WebM + MP4), posters, stills
media-source/                       Original files (machine STL, raw screen recordings) — git-ignored, not served
scripts/pack-stl-models.mjs         Writes/verifies the .mesh.bin derivatives (Node, no dependencies)
scripts/pack-assembly.mjs           Writes the hero machine's .agm.gz (bodies, copies, quantised, gzip)
public/assets/<project>/            Optimised media (empty until assets are supplied)
docs/                               ASSET_MANIFEST · CONTENT_NOTES · PROJECT_STRUCTURE · SKILLS_SETUP
```

## Key decisions

| Decision | Why |
|---|---|
| **Plain CSS with design tokens** instead of Tailwind | Bespoke editorial layouts with a small, readable stylesheet. Re-evaluated in the redesign: it carried the new design system without strain, so it was kept. |
| **One brand, two lighting environments** | `tokens.css` defines semantic tokens (`--color-background`, `--color-surface`, `--color-surface-elevated`, `--color-text…`, `--color-accent`, `--color-steel-blue`, `--color-metallic-blue`, `--color-pearl-blue`, glows, shadows, stage and geometry colours) for `[data-theme="light"]` and `[data-theme="dark"]`. Brand colours are shared; only neutrals invert. Sections choose a surface (`.surface-base / -deep / -elevated`) and atmosphere (`.atmos`, `.atmos--ember`, `.atmos--steel`). No component contains a theme-specific colour. |
| **Theme switching** | `lib/theme.ts` head script sets `data-theme` before paint (stored choice → OS preference). `ThemeToggle` writes `localStorage["ag-theme"]`, fires a `themechange` event (the WebGL artwork re-lights on it) and cross-fades colours for 380 ms unless reduced motion is on. Icons are swapped by CSS, so server and client markup match. |
| **Hand-written WebGL for the hero** | One small mesh set, one shader, renders only while visible, disposes buffers on unmount; ~250 lines vs. ~150 kB for Three.js. Reduced motion / no WebGL → static poster. |
| **No animation library** (Motion / GSAP not installed yet) | Every current motion is transform/opacity/clip-path in CSS driven by one IntersectionObserver — zero JS cost, honours `prefers-reduced-motion`, works without JS. Add `motion` when a sequence needs spring physics or gesture-driven timelines. |
| **Real models without Three.js** | The ORTESIS STL stack (`OrtesisModelStack`) uses the same hand-written WebGL approach as the hero: an STL parser (~150 lines, `lib/stl.ts`), one shader, an orbit camera and DOM labels. No new dependency, nothing to install, fully testable here. Three.js (+ STLLoader/OrbitControls) would be the choice if the 3D needs grow (materials, environment lighting, many viewers). |
| **3D model loading** | Lossless `.mesh.bin` derivatives (3.2 MB) instead of raw STL (13.4 MB); STL is the automatic fallback. Loading starts when the section is ~250 px from the viewport; a still render holds the space. Renders on demand only (no idle frame loop). |
| **3D presentation** | Both 3D views are fixed compositions: no rotation, zoom or selection; canvases have `pointer-events: none`, so scrolling (wheel, touch, pinch) always passes through. ORTESIS labels are plain text positioned from the projected models. |
| **Hero machine** | Plain WebGL like the rest. The STL (26 MB) is packed into 1.3 MB (copies stored once, 16-bit quantisation, gzip; decoded with `DecompressionStream`). Loads after the page's `load` event; poster first. One-time vertical separation of top / base frames along the rod axis; none with reduced motion. |
| **Video** | VP9 WebM first, H.264 MP4 fallback; sources attached near the viewport; ambient loops pause offscreen and never autoplay with reduced motion; recordings use native controls. |
| **Central media registry** | Replacing a placeholder is a one-line data change; the manifest is generated from the same data. |
| **Draft/publish flag** on projects | Future work can be prepared without appearing anywhere (lists, sitemap, nav). |
| **Dev notes** | Pending content is visible while developing and stripped from production builds. |

## Adding a project

1. Add an entry to `src/content/projects.ts` (start with `publication: "draft"`).
2. Register its media slots in `src/content/media.ts`.
3. Create `src/app/<section>/<slug>/page.tsx` using `CaseHero`, `Chapter`, `MediaFrame`.
4. For computational projects add an input/output line to `systemSheet` in `app/computational-design/page.tsx`; the collection and homepage pick it up automatically.
5. Set `publication: "published"` and add the slug to `caseStudyOrder` if it should appear in "Next project".
