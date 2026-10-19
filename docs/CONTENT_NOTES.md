# Content Notes

Rules the copy follows, what was written from confirmed facts, and what Albert must confirm before publication.

## Ground rules (from the briefs)

- **Direction (16 Oct 2026, night):** visually led, but with substance — each project explains what it does, what Albert developed, how the workflow works and what the media shows, in short editorial sections paired with the media. (The earlier “minimal text” pass went too far.)
- Previously (16 Oct, late): a visual exhibition — real media first. The homepage opening is typography only (no 3D model, no equipment photo). Code-made simulations and schematics (city diagram, drawer configurator, ORTESIS process isometric) are no longer shown.
- Never call the scanning machine a "photogrammetry" machine: it carries a Creality 3D scanner whose optical technology is not confirmed.
- City and Drawer pages use only Albert's **screen recordings**, clips cut from them and frames from them. Captions say only what is visible. The city recording shows finished layouts and street-level views — the input-plane → subdivisions → roads → buildings stages are described in one sentence but not shown until footage exists.
- Capabilities are shown per project (a few labels each, from `projects.ts`), not as a generic skills list; About maps them to the projects. No percentages or proficiency meters.
- The homepage ORTESIS stack shows Albert's **real STL models** (16 Oct 2026). Its caption says what it is ("Project STL models … shared scale and coordinate system; vertical spacing added for display") and nothing more: no claims about accuracy, clinical suitability, manufacturing readiness or performance. "Design preview" is a digital preview stage, not a separately manufactured object.

- Degree: **Bachelor's Degree in Industrial Design Engineering and Product Development** (UPC, ESEIAAT). Never "Mechanical Engineering".
- No invented dates, job titles, metrics, specs, materials, results, testimonials or clinical claims.
- ORTESIS STUDIO: no clinical validation, certification, medical approval or diagnosis claims; printing is a **separate** step; the web app lets users avoid opening Blender **manually** (Blender is still used).
- Procedural City: AI-assisted (Claude Code) — never "hand-written"; no traffic, planning or code-compliance claims.
- Employer work (Amazon RIVR, GUTMAR): general description only; no confidential material.
- Future work (Computational Healthcare) exists only as a `draft` entry in `src/content/projects.ts` and is never rendered.

## Where content lives

| What | File |
|---|---|
| Name, role, location, contact links, domain | `src/content/site.ts` |
| Statement, intro, approach, capabilities, experience, education | `src/content/profile.ts` |
| Project facts, status, attribution, draft flag | `src/content/projects.ts` |
| Media slots | `src/content/media.ts` |
| Long-form case-study text | `src/app/**/page.tsx` |

Development notes (`<DevNote>`, dashed amber boxes) only render in development, or in production with `NEXT_PUBLIC_SHOW_DEV_NOTES=true`.

## Needs Albert's confirmation before publishing

### Identity & contact
- [ ] Public email address (`site.email`) — not set; nothing is shown until it is.
- [ ] LinkedIn URL (`site.linkedin`).
- [ ] CV PDF (`site.cvUrl`).
- [ ] Use of the full name "Albert Gracia i Riera" anywhere (`site.formalName`, currently unused).
- [ ] Domain (`NEXT_PUBLIC_SITE_URL`) for canonical URLs, sitemap, Open Graph.
- [ ] Contact line "Open to conversations about mechanical and hardware engineering, robotics, product development and computational design." — keep or change.

### Experience
- [ ] Job titles and periods for Amazon RIVR and GUTMAR (fields `title`, `period` in `profile.ts`; hidden while undefined).
- [ ] RIVR description wording: "Robotics hardware and mechanical product development" with areas: mechanical design & CAD, electromechanical integration, prototyping, manufacturability, cross-disciplinary collaboration.
- [ ] GUTMAR wording: "...progressing from practical engineering experience to a junior engineering role".

### First-person copy (drafted in Albert's voice — please read and adjust)
- [ ] Statement: "I am interested not only in designing products, but in developing the tools and processes that make better products possible."
- [ ] About intro (two paragraphs) and the four "Engineering approach" items in `profile.ts`.

### ORTESIS STUDIO

Rewritten 16 Oct 2026 from Albert's photographs, the application recording and the facts he gave in the brief. The separate hardware/software context document was **not received as a file**; only the portfolio context text pasted in the message was available.

Confirmed and used:
- [x] Machine: PLA-printed parts, bearings, guides, mechanical transmissions (pinion on ring gear for rotation, belt-driven carriage on guide rails for translation — visible in the photos); Creality 3D scanner on the carriage; Arduino-based motion control; basic mechanical testing of both movements. The arm stays still while the scanner moves around and along it.
- [x] Development order (Albert): workflow first built with Geometry Nodes and modifiers in Blender, then the application built on it. Current engine: headless Blender, Python/BMesh, modifiers — Decimate → Wireframe → Subdivision Surface → Smooth by Angle. Not an exact Voronoi generator; not claimed to run the pictured node graph.
- [x] Application: Import → Prepare → Design → Export with an explicit Generate action; built with HTML/CSS/JavaScript, Three.js, Python and headless Blender; private and local, never linked.
- [x] Qualification on the page: "Independent experimental engineering prototype. Not clinically validated."

Deliberately left out:
- The **≈ 2 h** process time (removed from the page — an estimate, not a benchmark).
- Synchronised scanning with the motion, and any helical (combined) trajectory — not confirmed; stated as such in ch. 3 / ch. 7.
- Cell-size calibration, landmark normalisation, inspection tools, installer — shown only under "Next steps — planned, not implemented".
- Budget, commercialisation and regulatory material.
- Node names from the screenshot (unreadable at source resolution).

Still to confirm:
- [ ] The CAD model differs from the built prototype in some structural details (e.g. the photographed frames). The ch. 2 caption says so — confirm the wording, or supply an updated CAD.
- [ ] The recording ends after Generate/Inspect; Export is described in text but not shown. Send a short clip of the export if you want it shown.
- [ ] "Role: Sole developer — hardware, software, fabrication".
- [ ] The person in the arm photo agrees to the photo being public.

### ORTESIS 3D models (homepage)
- [x] Stage labels and order — given by Albert: 01 Original scan, 02 Anatomical mesh, 03 Trimmed mesh, 04 Design preview, 05 Final orthosis (bottom → top).
- [x] No visible caption; screen-reader description in `caption` of `src/content/ortesis-models.ts`. Since 16 Oct (late): with a mouse/pen the whole stack tilts towards the pointer (±7° horizontally, ±4° vertically, eased) and returns when the pointer leaves; touch and reduced motion keep the fixed view.
- [x] Homepage summary beside the models — copy given by Albert (label, headline, two paragraphs). It replaced the old subtitle/summary row below the title, which repeated the same idea; "Explore the case study" moved into the summary.
- [ ] Publishing the mesh files: they become downloadable from the site, including the anatomical scan of an arm. Confirm whose arm it is and that sharing the scan publicly is OK.

### ORTESIS application chapter (16 Oct, night)
- [x] Chapter 4 “The Application — From anatomical geometry to a configurable orthosis.” Steps checked against the recording: Import (STL loaded; the app states the scan mesh is never modified), Prepare (anatomical mesh reconstructed, original kept as a layer; four landmarks set orientation; cutting planes), Design (presets Light/Standard/Reinforced, shape/finish/advanced parameters, explicit Generate at 0:44, Regenerate, layer toggles), Export (not in the recording — described, not shown).
- [x] Interface tools named only as visible in the recording: New/Open/Save (“Keep” in the recording's labels), a “Record” counter that increments after generating (presented as generation history).
- [x] Architecture as Albert described: interface + Three.js viewer → local Python layer → headless Blender → geometry/STL.
- [x] The machine and the application are described as one workflow but **not** one automated system (the app starts from a scan file).
- [~] Next step reworded: the recording shows landmarks setting orientation (“Standardized orientation”), so the planned item is now “fuller anatomical normalisation from the landmarks”.
- [ ] Confirm “generation history” is the right description of the Record counter.

### Portrait
- [x] Processed into a monochrome cut-out, then **removed at Albert's request** — not shown anywhere.

### Experience (About + homepage)
- [x] Paragraph + three contribution areas per role, from the brief: RIVR — SolidWorks components and mechanical interfaces, fastening and cable/connector integration, prototyping/integration; GUTMAR — CATIA V5, CAD/CAM and machining, tolerances/technical development. No role titles or dates shown (not confirmed).
- [ ] Confirm role titles and periods to show them.

### Hero machine
- [x] Removed from the homepage at Albert's request (16 Oct, late). Kept unused in the repo.

### Procedural City
- [x] Page rebuilt around footage: result clip, "Street level", "Around the blocks", two stills, full recording. Explanation limited to the confirmed rule: the input plane and its subdivisions define the layout; roads through the subdivision centres; buildings generated.
- [ ] Clips of the intermediate steps and a Geometry Nodes screenshot (slots ready).
- [ ] The recording's side panel shows more modules (layout, streets, lots, massing, façades, roofs…) than the page describes — nothing was added about them.

### Parametric Drawer
- [x] Page rebuilt around footage: in-drawer clip, organiser clip, three stills, full recording. The browser configurator (simplified demo) was removed everywhere.
- [ ] Geometry Nodes screenshot (slot ready).

### Chair → "Bar Stool"
- [x] From the material Albert sent: "Adaptable bar stool with a flexible backrest and a demountable structure. Prototype validated at 1:1 scale." The page says "Full scale, 1:1" prototype and "Demountable" — the word **"validated" was not used**, since no testing is described. Material shown only as "Wood" (no species). Title changed from "Chair" to **Bar Stool**; the route stays `/work/chair-design`.
- [ ] Confirm "Bar Stool" as the title and whether "validated" should be stated (and how it was validated).
- [ ] More photos: angles and close-ups.

### MotoSpirit / AED Monitoring (kept short on purpose)
- [x] MotoSpirit: team logo (MotoSpirit ESEIAAT) as its image; one line + "My part: Mechanical and structural design, mainly the chassis."
- [x] AED Monitoring: the cover is an **AI-generated illustration** (supplied 19 Oct 2026) captioned "AI-generated contextual illustration — not the project prototype." — contextual imagery only, never the team's prototype, a tested device or evidence of implementation. It replaced a stock photo (removed from `public/`; the code never carried a credit line for it).
- [ ] AED illustration: was the old stock photo (or any other image) uploaded as a **reference** when generating it? If yes, the stock licence/terms may still apply to the result, so a credit or replacement may be needed; do not assume AI generation removes those rights.
- [x] AED Monitoring copy supplied by Albert 19 Oct 2026: context "University Team Project — University of Twente"; description and "My contribution" text as written by him (mechanical design and CAD development; enclosure, component integration, assembly; component placement, manufacturability, practical constraints). Shown verbatim in `projects.ts`.

## 17 Oct 2026 — refinement round

- **Homepage hero:** large muted background sculpture on the right (supplied `ortesis_prototipo for presentation.stl`, 303 104 triangles, packed losslessly to `ortesis-prototipo.mesh.bin`), behind headline and panel, clipped to the hero, rest orientation turned 180° in the screen plane (upside down, same lean) plus a quarter turn about its own long axis; old circle/ring graphics removed. Cursor tilt ≤ 6° / 3.5°; none on touch or reduced motion.
- **ORTESIS:** the application is its own full-width section (Import → Prepare → Design → Generate and inspect → Export; Export described, not shown). Chapter 1 is now a four-step story (starting point, approach, user control, intended benefit — benefits are intentions, not measured results). Homepage flagship gets a short "The software" intro. The Inspect section shows the real final orthosis STL (orbit on desktop and touch); the cube placeholder and GLB note are gone.
- **MotoSpirit:** paragraph + three points, only from supplied context (mechanical and structural design, mainly the chassis; CAD). Other subsystems, manufacturing, testing and results are explicitly the team's.
- **Videos:** City, Drawer and application recordings re-encoded at native resolution as full frames (no crop, no zoom, `contain`).
- **About → Education:** thesis subject "Aerospace Manufacturing & Tooling Development", "Bachelor’s Thesis · Grade: 10/10" (a descriptive subject, not a confirmed official title). No company, customer, CAD or process details. **UPC logo:** slot `upc-logo` exists but no file has been supplied, so nothing is shown yet.
- Open: "generation record" wording (the app shows a Record counter), MotoSpirit responsibilities beyond the chassis, UPC logo file/permission.

## Hero exploration (17 Oct 2026) — temporary
Three homepage-opening variants at `/hero-lab`; no new copy was added (same headline, lead and four links). Material is a presentation shader (warm ivory satin, steel-blue reflection, restrained terracotta bounce); geometry is the real prototype STL derivative, unmodified. Pending Albert's choice.
