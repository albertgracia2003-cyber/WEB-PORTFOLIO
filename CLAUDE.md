# Albert Gracia — Portfolio · Claude instructions

Next.js App Router + TypeScript (strict) + plain CSS tokens. Static, content-driven; deployed as a static export (`output: "export"`) on Cloudflare Pages — no server features (no Server Actions, middleware, API routes, rewrites/redirects, `next/image` optimiser). Read `docs/PROJECT_STRUCTURE.md` first.

## Source of truth
1. The portfolio master brief (hierarchy: ORTESIS STUDIO → Computational Design → Physical Design → About/Contact). It wins over any skill's advice.
2. `docs/CONTENT_NOTES.md` — what is confirmed, what is not. **Never invent** dates, titles, specs, metrics, materials or clinical claims. Degree = Industrial Design Engineering and Product Development.
3. `src/content/*` — all facts and media live here, not in components.

## Design process (use the installed skills — see docs/SKILLS_SETUP.md)
1. Direction: `frontend-design` (+ `ui-ux-pro-max` for exploration only).
2. Implement with the semantic tokens in `src/styles/tokens.css` and the surface/atmosphere classes (`.surface-base | -deep | -elevated`, `.atmos`). Never hard-code colours; check every change in BOTH themes (toggle in the header). Terracotta (`--color-accent`) for graphics/large type; `--color-accent-text` for small text.
3. Refine with `impeccable` (critique → polish).
4. Motion with Emil Kowalski's skills: transform/opacity, ≤ 300 ms for UI feedback, never from `scale(0)`, honour reduced motion.
5. Review React/perf with Vercel `react-best-practices`; UI/a11y with `web-design-guidelines`.
6. Open the page in a browser (Chrome DevTools MCP), screenshot desktop 1440 + mobile 390, critique, fix, re-check.

## Rules
- Media: only through `<MediaFrame id="…">`; add slots in `src/content/media.ts`. No stock or AI-generated images presented as Albert's work.
- Pending content: `<DevNote>` (dev-only). Unconfigured links are never rendered.
- Interactions must work with keyboard, touch and without animation. No scroll hijacking.
- Direction: visually led with substance — short editorial sections that pair one idea (what it does / what Albert developed / how it works / what the media shows) with the media. No code-made simulations or schematics standing in for project media. Homepage hero = typography over one large, muted background sculpture (the orthosis prototype, `OrthosisViewer variant="hero"`); never a portrait.
- Video: one video plays at a time; only the most visible ambient loop autoplays (`VideoMedia.tsx` arbiter).
- 3D only for real models. Fixed compositions (ORTESIS stack, hero) have no controls; the case-study "Inspect" viewer (`OrthosisViewer variant="inspect"`, final orthosis STL) is the one place with orbit/zoom (drag, buttons, keys; vertical swipes still scroll). The ORTESIS stack has one bounded response: a ±7°/±4° tilt towards a mouse/pen pointer, eased, none on touch or with reduced motion. ORTESIS stack: `src/content/ortesis-models.ts` + `components/graphics/OrtesisModelStack.tsx` (after replacing an STL run `node scripts/pack-stl-models.mjs`). Hero machine (unused, files not deployed): `src/content/hero-machine.ts` + `components/graphics/HeroMachine.tsx` (re-pack with `node scripts/pack-assembly.mjs`; assets in `media-source/_removed-before-publication/public-unused/ortesis-studio/machine/`). Never resize models individually, recolour parts or add invented geometry; regenerate posters after changes.
- Videos: show the whole recorded frame — box aspect = source aspect, `object-fit: contain`, no zoom/scale/hover enlargement, no cropping (re-encode from `media-source/` originals at native size). Real footage only, via media slots (`playback: "controls"` for recordings); originals stay in `media-source/`. Order/selection of City, Drawer and Chair media lives in `src/content/showcase.ts` (pending entries are skipped).
- Homepage order: Hero → 01 ORTESIS → 02 Mechanical & Product Design (Handlebar, MotoSpirit, AED) → 03 Computational Design → Bar Stool (`ChairSection`, id `chair`, labelled 02 · closing project, highlights the Mechanical nav item via `alsoIds`) → 04 About → 05 Contact. Case-study "next" order lives in `caseStudyOrder` (projects.ts).
- Capabilities: a few labels per project (`disciplines` in `projects.ts`), no generic skills lists or proficiency meters.
- Confidential employer material (Amazon RIVR, GUTMAR) never appears. Never link the private ORTESIS web app.
- ORTESIS wording: "motorised 3D scanning machine" / "optical 3D scanning rig", never "photogrammetry". Keep the qualification "Independent experimental engineering prototype. Not clinically validated." No time/accuracy/speed claims; planned features stay labelled as planned. The scanning-machine CAD (`hero-machine.ts`) is no longer on the homepage. Hero model (warm ivory-satin presentation material via `SATIN_FS`, contrast to the background ≈1.6:1 in both themes — the dark theme uses a deeper stone tone so the model never becomes the focal point; behind the headline, type always on top; both headline lines left-aligned): `heroOrthosis` in `ortesis-models.ts` (packed derivative of `ortesis_prototipo for presentation.stl`, original in `media-source/ortesis-studio/`); rest orientation turned 180° in the screen plane (upside down relative to the first version) and a quarter turn about its long axis, cursor tilt ≤ 6°/3.5° eased, still on touch and with reduced motion.
- Public legal wording approved by Albert (19 Oct 2026): ORTESIS STUDIO = "independent experimental engineering prototype developed for learning and applied research. Not clinically validated or offered for clinical use. Nothing on this site constitutes medical advice. The application shown is private and not publicly available." Never state or deny a regulatory classification ("not a medical device"). Collaborative projects: describe only Albert's contribution; never assert who owns team/university rights. Open legal questions live in `docs/LEGAL_OPEN_ITEMS.md`, never on the public pages. `site.hostedOn` stays `null` until the site is live on Cloudflare Pages.
- The temporary hero exploration (`/hero-lab`) was removed before publication; its files are kept in git-ignored `media-source/_removed-before-publication/`.
- Final content (v1): contact details are set in `site.ts`; no CV button until `cvUrl` is set; media that is not supplied is omitted (not shown as a placeholder); dev notes only show with `NEXT_PUBLIC_SHOW_DEV_NOTES=true`; UPC logo at `public/assets/about/upc-logo.webp`. `/privacy` and `/legal` exist (footer links); keep them accurate whenever data flows change (analytics, forms, embeds, new storage).
- Text emphasis: content strings may use `**key term/contribution/tool**` (semibold) and `==one important concept==` (semibold + `--accent-text`, at most 1–2 per section) via `rich()` in `src/lib/rich.tsx` (`.em`, `.em--accent` in `base.css`). Never colour whole paragraphs; weight carries meaning first. Use `plain()` for metadata.
- Ask before: publishing/deploying, adding paid services, exposing private info, unsupported engineering/medical claims, destructive file changes.

## Commands
`npm run dev` · `npm run typecheck` · `npm run lint` · `npm run build` · `npm run check` (all three)
