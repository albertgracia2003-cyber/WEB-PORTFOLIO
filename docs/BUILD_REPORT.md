# Build & Test Report

## 16 Oct 2026 (night) — more substance, ORTESIS application chapter, Computational restructure, experience, asset clean-up

**Not run:** `npm install`, `next build`, ESLint, real-type `tsc`. Preview harness only (esbuild + React 19.2 Strict Mode, headless Chromium + SwiftShader). Stand-in type-check: clean apart from known stand-in noise.

| Suite | Result |
|---|---|
| Site (`test`) — incl. new: ORTESIS application headline, Import/Prepare/Design/Export with Export not a seek button, Generate/Inspect jumps, 4-stage architecture strip, operate→geometry→print thread, chapter order; no portrait on the homepage/About; professional-background block links to About; two roles × paragraph + 2–3 contributions, exact degree; transparent MotoSpirit logo; cleaned sketch on paper backing; Bar Stool title same family/weight as other project titles; City sections how→inside→above→recording with the day clip and no Day/Night selector yet | 56/56 |
| Features (`feature-test`) — stack tilt (light/dark, framing, return), touch/reduced motion, typographic hero, homepage: 4 clips (main + supporting per project), **only one autoplays**, hand-over on scroll; City (5 videos) and Drawer (3): result plays, recording lazy and alone, **full-page scroll sweep never has two videos playing**, reduced-motion mobile | 57/57 |
| ORTESIS page (`ct`) 1440/390 — images/alt, node-graph zoom, chapter seek (Design 0:14) | 11/11 |
| Overflow 320–1920 px, all routes | none |

Visual review: hero (light/dark, 390), City sections, Drawer parameters/arrangements, ORTESIS application + geometry chapters, Bar Stool (light/dark), team-project panels (dark), About experience. Asset edges checked on light and dark composites.

---


## 16 Oct 2026 (late) — exhibition direction: typographic hero, pointer tilt, real footage, bar stool

**Not run (no npm registry here):** `npm install`, `next build`, ESLint, `tsc` against the real React/Next types. Checked in the preview harness only (same source; esbuild + React 19.2 Strict Mode; headless Chromium + SwiftShader). Type-check against stand-in React types: clean apart from the stand-ins' known loose ref/event typing. Run `npm install && npm run check && npm run build` on your machine.

| Suite | Result |
|---|---|
| Features (`feature-test`): ORTESIS stack in light + dark — 5 models load; labels 05→01; **pointer at the right edge → +6.9° yaw, canvas visibly different**; top-left → −6.9° / −4.0°; labels stay ordered and visible while tilted; models stay inside the canvas at both extremes (transparent edge rows/columns); dragging doesn't orbit; pointer leaves → back to exactly the default view (pixel-identical); wheel scrolls the page · mobile touch: swipe scrolls, no tilt · reduced motion: no tilt · hero (1440 + 390): no model/image/video, nothing heavy requested, second line right-aligned · homepage: City + Drawer clips both play muted · City/Drawer pages: result clip plays, recording lazy with controls and plays alone, reduced-motion mobile poster + manual play, no sliders/schematics · no console errors | 54/54 |
| Site (`test`): menu, keyboard, theme toggle, headings/ids/labels on all 8 routes, real videos and no simulations on 4 routes, ORTESIS chapter nav + qualification + no app link, equipment photo only inside the ORTESIS workflow band, chair photos with alt text and no placeholders | 44/44 |
| ORTESIS case page at 1440 / 390 (`ct`): images + alt, node graph zoom, Escape/focus, chapter seek | 11/11 |
| Horizontal overflow, all routes, 320–1920 px | none |

Visual review: homepage, City, Drawer, collection, Bar Stool, ORTESIS and About at 1440 (light), hero/computational/chair in dark, homepage and chair at 390.

**Harness limits:** H.264 can't play in its Chromium (WebM tested; MP4 probed only). SwiftShader renders slowly, so the tilt was verified by its end state and pixels, not by frame rate. A `/favicon.ico` 404 appears only on the test server.

---


## 16 Oct 2026 (evening) — ORTESIS media integration, case-study rewrite, hero reorientation

**Not run (no npm registry here):** `npm install`, `next build`, ESLint, `tsc` against the real React/Next types. Checked in the preview harness only (same source; esbuild + React 19.2 Strict Mode; headless Chromium + SwiftShader). Type-check against stand-in React types: no errors apart from the stand-ins' own loose ref/event typing (same pattern in untouched files). Run `npm install && npm run check && npm run build` on your machine.

| Suite | Result |
|---|---|
| Site (`test`): navigation, theme toggle (first visit, persistence, no flash, keyboard, mobile), drawer configurator, lightbox, reduced motion / no-JS, headings + ids + labels on all 8 routes, ORTESIS chapter nav + disclosure, qualification sentence present, no link/launch button to the private app | 43/43 |
| Features (`feature-test`): hero machine (new file name, caption, poster, one-time separation, reduced motion, no WebGL), ORTESIS model stack, city/drawer videos | 41/41 |
| ORTESIS case page at 1440 / 390 px: real images with alt text (lazy except hero), node graph opens at native 1280 px in a dialog, Escape closes and focus returns, chapter button seeks the recording (Design → 0:14) and plays with native controls, no console errors | 11/11 |
| Horizontal overflow, all routes, 320–1920 px | none |

Visual review: case page in light and dark at 1440 and 390 px; hero in the confirmed orientation at 1440 / 1024 / 768 / 390 px.

**Harness limits:** H.264 cannot play in its Chromium, so the WebM was played; the MP4 was probed with ffprobe only. Seeking needs a server with HTTP Range support (Next's server and any normal host have it).

---


## 16 Oct 2026 (later) — fixed ORTESIS stack + summary, machine hero, project videos

**Not run (no npm registry here):** `npm run dev`, `next build`, ESLint, `tsc` against real React/Next types. Everything below was checked in the preview harness only (same source; esbuild + React 19.2 in Strict Mode; headless Chromium with SwiftShader WebGL). Run `npm install && npm run check && npm run build` on your machine.

**Feature checks — 41/41** (`feature-test`):

| Check | Result |
|---|---|
| ORTESIS stack, light + dark: 5 files load, labels 05→01 top to bottom with leader lines, no buttons / zoom / reset / hint / visible caption, canvas ignores input, dragging changes nothing, wheel over it scrolls the page | ✅ |
| Desktop: summary directly below the title, left of the models · mobile 390 px: summary before the models, labels on-screen and not overlapping, vertical swipe over the viewer scrolls, no overflow | ✅ |
| Hero: poster first, model (1.34 MB) requested after page load; one-time separation runs and ends; view then static (no continuous motion); theme switch re-lights; machine area ends above the lower panel; canvas ignores input; new caption; headline unchanged | ✅ |
| Hero, reduced motion: assembled, no movement · WebGL disabled: poster stays, model not downloaded | ✅ |
| Videos (city, drawer): hero loop plays muted when visible; full recording not downloaded on load, attaches near the viewport, native controls, no autoplay/loop; loop pauses offscreen; never two videos playing · reduced motion + mobile: poster, no autoplay, manual play works, no overflow | ✅ |
| Console / page / hydration errors | ✅ none |
| Hero web file: decoded geometry vs. original STL — same 528,732 triangles; max vertex deviation 0.004 mm | ✅ |

Site suite (`test`): 43/43. Horizontal overflow at 320–1920 px: none on all routes. Visual review: hero at 1440 / 1024 / 768 / 390 px, flagship and case pages in both themes.

**Harness limits:** its Chromium cannot decode H.264, so the WebM versions were what played; the MP4 fallbacks were encoded and probed with ffprobe but not played. SwiftShader is slow, so frame timing and load time were not measured.

---

## 16 Oct 2026 — ORTESIS model stack (homepage) — *superseded: the interactive controls were removed later the same day*

The abstract five-plate stack in the homepage flagship section was replaced by the five real STL models (bottom → top: original scan, anatomical mesh, trimmed mesh, design preview, final orthosis). Nothing else on the page changed; the case-study page keeps its process diagram.

**Not run (no npm registry here):** `npm run dev`, `next build`, ESLint, `tsc` against real React/Next types. Run `npm install && npm run check && npm run build` on your machine.

**Verified in the preview harness** (same source, esbuild + React 19.2 in Strict Mode, headless Chromium with SwiftShader WebGL) — `stack-test`, 31/31:

| Check | Result |
|---|---|
| All five `.mesh.bin` files load (HTTP 200); viewer reaches ready | ✅ |
| With the derivatives blocked, all five original `.stl` files load instead | ✅ |
| Labels: DOM and on-screen order 05 → 01 top to bottom, each beside its model; order kept while rotating | ✅ |
| Initial view frames the whole stack (checked in renders at 1440 px and 390 px) | ✅ |
| Drag rotates; zoom buttons and Ctrl + wheel zoom within limits; plain wheel scrolls the page | ✅ |
| Reset view restores the exact initial layout; arrow keys / +/− / 0 on the focused canvas | ✅ |
| Label click focuses that model, announced to screen readers; reset clears it | ✅ |
| Light ↔ dark switch re-lights the models | ✅ |
| One file missing → named error + "Try again" (recovers); all missing → error state | ✅ |
| Mobile 390 px (touch): labels readable and on-screen, sideways swipe rotates, vertical swipe scrolls the page, no horizontal overflow | ✅ |
| Reduced motion: no easing, everything works | ✅ |
| WebGL disabled: still render + visible text list, no model downloads | ✅ |
| Console / page errors (incl. hydration) | ✅ none |
| `pack-stl-models.mjs`: every triangle of every derivative matches its STL bit-for-bit; STL copies byte-identical (SHA-256) to the supplied files | ✅ |

Site suite (`test`): 42/43 — the failing check, "toggle switches to dark instantly", is a timing check that also fails with the old diagram restored: this session's SwiftShader is slow enough that a click takes 1–4 s (the theme does switch). Horizontal overflow 320–1920 px: none on all routes.

---

# Redesign — 15 Oct 2026

## Important limitation (unchanged)

The cloud workspace still has **no access to npm, GitHub or CDNs** (verified again at the start of this session: `registry.npmjs.org` does not resolve, GitHub/CDNs are refused by the network policy). Therefore these were **not run**:

- `npm install`, `next dev`, `next build` (real Next.js runtime)
- `tsc` against the real React/Next type definitions
- `eslint` with `eslint-config-next`
- Lighthouse / Core Web Vitals
- Any skill or plugin installation

**The site is not verified as production-ready.** First thing on a machine with npm: `npm install && npm run check`.

## What was verified (preview harness)

Same source files, bundled with esbuild against React 19.2; only `next/link`, `next/image`, `next/navigation` and `next/font` were replaced by minimal stand-ins. Every route was server-rendered with `react-dom/server`, served with the real theme `<head>` script, hydrated in headless Chromium (Playwright) and tested. Inter stands in for Geist in screenshots.

| Check | Result |
|---|---|
| Server render of all 9 routes | ✅ no errors |
| Hydration / runtime console errors (both themes) | ✅ none |
| Strict TypeScript (`strict`, `noUncheckedIndexedAccess`) against loose React stubs | ✅ only stub noise (`key` prop) |
| Horizontal overflow at 320 / 390 / 768 / 1024 / 1440 / 1920 px | ✅ 0 px on every route |
| **Theme:** first visit follows OS (dark and light) | ✅ |
| **Theme:** script runs before the stylesheet (no wrong-theme flash) | ✅ |
| **Theme:** toggle switches instantly, `aria-pressed` updates, keyboard operable | ✅ |
| **Theme:** choice stored, persists across navigation and reload, overrides OS | ✅ |
| **Theme:** mobile menu contains a working toggle | ✅ |
| Hero WebGL artwork renders; static poster defined as fallback | ✅ |
| Mobile menu: open, focus in, scroll lock, Escape, focus return | ✅ |
| Skip link first in tab order, visible on focus | ✅ |
| Drawer configurator (isometric): keyboard + pointer, reset, disabled state | ✅ |
| Comparison slider via keyboard | ✅ |
| Disclosures, chapter navigation (jump + active state) | ✅ |
| Scroll sequence: active step follows scroll; sticky stage works | ✅ (bug found and fixed: `overflow:hidden` on the band broke `position:sticky` → now `overflow:clip`) |
| Lightbox: open, ← →, Escape | ✅ |
| Reduced motion: nothing hidden; hero uses static poster | ✅ |
| JavaScript disabled: all content visible (light theme) | ✅ |
| One `<h1>` per page, no skipped heading levels, unique ids, labelled controls | ✅ 8 pages |
| Text contrast of token pairs, both themes (WCAG AA) | ✅ body/muted ≥ 5.8:1; faint ≥ 4.5:1; small orange text uses `--color-accent-text` (5.1:1 light / 6.0:1 dark) |

**Test totals: 43 / 43 passed.** Screenshots reviewed at 1440, 834 and 390 px in both themes.

### Issues found during visual review and fixed
- Reveal animation's rounded `clip-path` clipped descenders on large headings → clip limited to media frames.
- Fast scrolling could leave elements unrevealed → elements already scrolled past are revealed too.
- Sticky scroll-sequence stage was stuck (see above).
- Mobile hero: headline over the artwork → artwork moved up and shrunk, text halo added.
- Light-mode glows were muddy grey → steel glow lightened toward metallic blue.

### Known limitations
- Banding seen around the hero disc in reduced-motion screenshots was traced to the SwiftShader GPU emulator (it disappears with software rendering); verify on a real GPU.
- Inactive scroll-sequence steps are dimmed to 45 % opacity on desktop by design (active step full contrast).
- Harness JS bundle size isn't representative of Next.js's per-route splitting.
- LCP/CLS/INP not measured. Media frames reserve their aspect ratio; hero posters are 35 kB; WebGL renders only while visible.

## Dependencies
Still only `next`, `react`, `react-dom` (+ types, ESLint, TypeScript). The hero artwork uses hand-written WebGL (~250 lines) instead of Three.js; Motion/GSAP were not needed — all motion is CSS + one IntersectionObserver + small rAF loops.

## 17 Oct 2026 — refinement round

Verified with the preview harness (esbuild bundle of the real source + Playwright/Chromium with SwiftShader WebGL, served with Range support): site 57/57, features 57/57, ORTESIS page 9/9, new checks 46/46 (hero model rendered at 320–1920 px in both themes, layering and no overflow, cursor tilt bounded and returning, none on touch/reduced motion, uncropped videos, inspect viewer orbit/buttons/keyboard, thesis entry, MotoSpirit copy), no horizontal overflow at 768–1920 px.

**Not run:** `next build` / `npm run build` — the sandbox has no access to the npm registry, so the real Next.js production build, `typecheck` and `lint` have not been run. The checks above exercise the same source through the harness, not the Next.js output. Run `npm run check` locally before relying on this.
