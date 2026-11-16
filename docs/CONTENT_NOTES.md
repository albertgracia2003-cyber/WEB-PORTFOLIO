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

## 7 Nov 2026 — ORTESIS STUDIO page restructured for the Baseline Robotics interview

`/work/ortesis-studio` is now a visual hardware case study that can be understood without the presenter. Order: hero ("From forearm scan to printed orthosis.", real machine + orthosis photos, ownership panel) → sticky jump bar → 02 Designing the scanning rig → 03 From CAD to the built rig → 04 From scan to print → 05 What I'd build next → "Details" (application recording, pipeline, geometry stages, engine, 3D viewer, breakdown). The home page and other projects are unchanged. Facts live in `src/content/ortesis-case.ts`; photos/CAD crops are slots in `media.ts` (`ortesis-rig-cad`, `ortesis-rig-built` are derivative crops of the existing CAD and rig photos).

Used, from Albert's brief of 7 Nov: goal (capture the forearm shape while the person stays still); the Creality 3D scanner is a commercial component he integrated; scans are **transferred by hand** to the application, and synchronising movement with the scanner's capture software is **not confirmed**; rotation = pinion on ring gear, translation = carriage on guide rails with a toothed belt; Arduino control programmed by him; "experimental prototype, not clinically validated" kept visible (hero and the closing status panel), not repeated per block.

Deliberately NOT stated (not documented): why gear rather than belt (or vice versa) and any drawbacks; any real build incident, iteration or failed test (`rigIterations` is empty, so the block is hidden); any confirmed hardware improvement or how it would be tested; scan accuracy, fit, comfort, time saving (listed under "Not measured"). CAD-vs-built differences are limited to what is visible in the two images plus the earlier statement that structural details differ.

Still to confirm:
- [ ] Design trade-offs: reasons and drawbacks for the gear (rotation) and belt (translation) choices.
- [ ] A real incident or iteration on the rig: what was observed, how investigated, what changed, how checked (feeds `rigIterations`).
- [ ] Hardware improvements he would actually make, and how each would be tested.
- [ ] Exact CAD-vs-built differences (rod/strut cage vs one rail pair, frames) and the pin positions/labels in the annotated images.
- [ ] Consent of the person shown in the arm/orthosis photo; "wearable-looking" wording if kept.

### 7 Nov 2026 (second pass) — hardware reinforcement of the ORTESIS page
Changes, all in `src/content/ortesis-case.ts` + `page.tsx`:
- **Mechanism:** the two generic decision cards were replaced by ONE explained decision inside axis A (`ringDecision`): "The problem" (the axis of rotation is the arm, so nothing can drive it from the centre) and "What the ring gear does" (drive moved to the rim, teeth printed into the frame, opening left clear). Both rows come from the project goal and from what the photographs show — they are **not** Albert's own account of why he chose it. "What it adds" (the difficulty) and "Alternative" are optional fields (`adds`, `alternative`) and stay hidden until documented. The Blender animation has a pending slot `ortesis-rig-animation` ("CAD animation showing the scanner's two axes of motion"); the page shows it under the overview photo only when `src` is set.
- **CAD vs built:** new row 4 "Motors, belt and scanner" marked **Photo only**: visible on the photograph, absent from this view of the model; no cause given. Pin 4 on the current built-rig photo marks the area. `rigIterations` is still empty (block hidden); its schema is now observed / checked / changed / result plus an optional `zone` marker on the CURRENT photo (never presented as an earlier build).
- **What next:** "Open on the rig" is the lead card, written as two open questions (coordination with the scanner's capture software; direct capture-to-application link instead of a manual file transfer). `hardwareNext.first` / `.check` ("Change first", "How I'd check it") stay hidden until Albert confirms his priority and test. "Demonstrated" (mechanical movement, a printed part) and "Not measured" (scan accuracy, fit/comfort/clinical, time) keep the evidence line. The four software steps moved to Details → "Software next steps — planned, not implemented".
- **Wording removed as unsupported:** "wearable-looking geometry" → "3D-printed orthosis prototype"; "from below the elbow to the palm" (the elbow is not in the photo) → "covering the forearm up to the palm" (also in the image alt text); "one relaxed position" and "two ring frames … rests" (undocumented) removed; "one controller" → "each motor-driven under Arduino control".

Still to confirm (three questions asked at delivery): (1) why ring gear + pinion for rotation, the alternative considered and the difficulty it added (or the same for the belt carriage); (2) one real assembly iteration (observed / checked / changed / result, and where on the photo); (3) what he would change first on the rig and how he would test it.

### 7 Nov 2026 (third pass) — laptop-size layout and removal of deduced reasons
Layout (screen-share at 1280 × 650 and 1440 × 780; nothing else changes): the case hero is compact (title and goal share one band, the stage flow moved under the photographs) so the machine photo starts at about 315 px; "Mechanism" shows the overview photograph with letters and short labels drawn on it (A Rotation, B Translation) next to the two axis cards, and the jump lands right under the two sticky bars (the page had a doubled scroll offset); "CAD vs built" is a client component (`CadVsBuilt`): both images as large as the screen height allows, point buttons on the heading row, one open note beside its pin on each image (CAD note and photograph note), the four points listed in full underneath and linked to the pins.

Content removed because it was my deduction, not Albert's account:
- The "problem / what the ring gear does" panel under axis A. `ringDecision` is now `{ title }` plus optional `reason`, `adds`, `alternative`; the panel stays hidden until at least one of them has Albert's own words.
- "The rail-and-carriage assembly turns with it" and "so the belt sets where along the forearm it points" (axis texts). The axis texts now only restate what the photographs show and what he confirmed (pinion turns a ring gear to rotate the mechanism around the arm; carriage on two steel rails pulled by a toothed belt; the scanner is mounted on the carriage).

The scan shown in "From scan to print" is captioned "An example forearm scan, loaded in the application as the workflow's input". Nothing on the page says it was captured with this rig (not confirmed); the page only says the application starts from a scan file transferred by hand.

Chapter 5 is titled **Open questions** (jump bar too) while `hardwareNext.first` is empty. It switches to "What I'd build next" automatically once Albert confirms the first change.

Still to confirm (the same three questions, now asked together at delivery): (1) which design decision he wants to explain (e.g. ring gear + pinion, or the belt carriage): why, what difficulty it added, what he considered instead; (2) one real incident or assembly iteration he investigated (observed / checked / changed / result, and where on the photo); (3) what he would change first on the rig and how he would test it. Optional: whether the scan shown was captured with the rig (if yes, the caption can say so).

### 7 Nov 2026 (fourth pass) — hero panels removed
Albert asked to drop the two panels under the hero photographs (the three-column "Designed & built / Programmed / Integrated, not made by me" and the five-cell Type · Role · Integrated component · Tools · Status strip). The hero is now title, goal, the two photographs and the five-stage flow. The same facts sit in one small, right-aligned block at the end of the page, just above "Next project" (`.facts-band`: "Who made what" and "Project"). The duplicate "Integrated component" cell was dropped (it repeats "Integrated, not made by me"). The qualification "Independent experimental engineering prototype. Not clinically validated." stays visible in that block, in chapter 5 ("Current status") and in the hero badge ("functional experimental prototype").

### 7 Nov 2026 (fifth pass) — ORTESIS page redesigned from scratch
Albert asked for the page to be rebuilt (structure, order, composition) so a reader understands what was built and can follow the design reasoning from photos, CAD and real tests, without the questionnaire/interview-script feel. Same URL, identity and rest of the site; all visible text in English.

Structure: sticky section links first; **01 The system at a glance** (title, one-line description, the challenge in one sentence, authorship line, machine photograph `ortesis-hero` with the printed orthosis as an inset); **02 The scanning rig** (one annotated overview of the built rig with both movements and their names, one real detail per axis of equal size with part labels, the Arduino control stated next to the movement it drives, then CAD vs built); **03 From scan file to printed part** (scan file → prepared geometry → printed orthosis, the four application steps with the import point flagged, the 50 s application recording one click away, and "Where it stands"); then **Technical details** (architecture, geometry stages, Blender, software next steps, 3D viewer, system breakdown) and the small facts block (Type · Role · Tools).

Wording decisions (all from facts already confirmed):
- Authorship line: "I designed and built: the mechanism (CAD, printed parts, assembly), the Arduino motion control and the generation workflow. Integrated, not made by me: a commercial Creality 3D scanner, mounted on the rig's carriage." (taken from the former "Who made what" panel).
- Control text per axis: "The motor that turns the pinion / pulls the belt is driven by Arduino-based control that I programmed … Tested mechanically on the prototype." The belt/pinion motor pairing follows the existing "belt-driven carriage" and "motor-driven pinion" facts; **no motor is labelled on the carriage photograph** (which motor drives which axis is not visible there).
- Part labels on the detail photographs name only what is visible (pinion, ring gear, motor; guide rails, toothed belt, carriage, scanner).
- The example scan is captioned as "the input to the generation flow"; the page says only that the application starts from a scan file transferred by hand. Nothing says the scan came from this rig, that the motors are synchronised with capture, or that precision was measured.
- The machine's movement (Arduino, tested mechanically) and the geometry workflow (printed orthosis) are listed separately under "Demonstrated". "Not measured or tested": scan accuracy, fit/comfort/clinical performance, time savings. The two open questions (coordination with the scanner's capture software; scan reaching the application directly) are shown as questions under "Open for a next version"; the column becomes "In a next version" with "Change first / How I'd check it" once `hardwareNext` is filled in.
- The qualification "Independent experimental engineering prototype. Not clinically validated." is visible once, under "Where it stands". (The hero badge, an existing component, says "functional experimental prototype".)
- The application's steps are named as in the existing breakdown: Import → Prepare → Design → Export.

Hidden until supplied or confirmed: `decisions.A`/`.B` (reason, difficulty, alternative), `rigIterations` (one real incident: observed / checked / changed / result + marker on the current photograph), `hardwareNext`, the CAD animation (`ortesis-rig-animation`, shown labelled "CAD animation") and a real motion-test clip (`ortesis-motion-demo`, shown labelled "Motion test"; its caption must describe only what the clip shows).

Images that would improve the page: a Blender CAD animation showing both axes; a short clip of the rig actually moving (a motion test); a clean machine-only photograph (no laptop/printer) or a second angle; a photograph or scan confirmed to come from this rig; a closer carriage photograph with the belt path visible; the missing `ortesis-app-prepare` and `ortesis-app-result` screenshots (not on disk, not used).

Still to confirm (the same three questions): (1) which design decision to explain (ring gear + pinion or belt carriage): why, what difficulty it added, what he considered instead; (2) one real incident or assembly iteration he investigated (observed / checked / changed / result, and where on the photo); (3) what he would change first on the rig and how he would test it. Optional: whether the scan shown was captured with the rig. Also unconfirmed: the "Sole developer: hardware, software, fabrication" role wording in the facts block.

### 7 Nov 2026 (sixth pass) — ORTESIS presentation redone: more visual and natural
Albert asked to rework the presentation so the page explains the project from the machine, the animation and the photographs, with fewer labels, authorship blocks and part lists interrupting the story. All visible text stays in English.

Opening: removed "The challenge", "I designed and built / Integrated, not made by me", the kicker, the status badge and the two breadcrumb links (replaced by one "← Portfolio" link). The text is Albert's own: "A prototype for capturing forearm geometry and designing a personalised orthosis for 3D printing. The project combines a motorised scanning rig with a separate local tool that turns a scan file into a printable model." with one discreet line: "Independent project · Mechanical design, fabrication, motion control and geometry software". Photo caption: "The scanning rig and printed orthosis prototype". The small inset of the printed orthosis over the photograph was removed on Albert's request (8 Nov): the photograph stands alone (the printed orthosis is visible in it, in the printer and on the laptop screen, and again in "From scan file to printed part"). The qualification sits under that caption (visible once; removed from "Where it stands"). No first person and no commercial brand name remain in the page text, alt texts or tools list (the scanner is "3D scanner"). Note: the hero photograph still shows the printer's logo.

How it moves: one sentence ("The forearm stays in place while the scanner moves around it and along its length.") beside the CAD animation. Until Albert supplies the Blender animation (`ortesis-rig-animation`, muted loop, `playback: "toggle"`: one click or Enter/Space starts/stops it, never autoplays, stops when scrolled away, labelled "CAD animation"), the built-rig photograph takes its place: no empty frame, no placeholder player. Arrows, A/B letters and the legend are gone. Two close-ups (pinion on ring gear; belt-driven carriage) each carry one caption that says what the mechanism does as a whole; the Arduino-control fact is one sentence beside the animation (programmed for the project, tested mechanically on the prototype). Part labels and the component list moved to Technical details ("The rig, part by part", system breakdown).

How it was built: the CAD vs built table (six rows) was replaced by a large pair — a CAD render from a view close to the photograph (rendered from the project's own assembly; yaw 72°, pitch 14°, wide field of view) and the rig photograph — with only the captions "CAD model" and "Built prototype". Differences seen in the pair are not described or explained. A confirmed assembly change would be explained right under its image (`rigChanges`); none is confirmed, so none is shown.

Hidden until supplied or confirmed (unchanged in spirit, renamed): `decisions.rotation/.translation`, `rigChanges`, `hardwareNext`, the animation and the real motion-test clip (`ortesis-motion-demo`, also `playback: "toggle"`).

Still to confirm with Albert: (1) which design decision to explain (ring gear + pinion or belt carriage): why, what difficulty it added, what he considered instead; (2) one real assembly change on the rig (observed / checked / changed / result, and where on the photo); (3) what he would change first on the rig and how he would test it. Optional: whether the scan shown was captured with the rig; whether "Independent project · Mechanical design, fabrication, motion control and geometry software" is the wording he wants for his contribution. To hand over the Blender animation: an MP4 (H.264, 16:9, no audio needed) saved as `public/assets/ortesis-studio/ortesis-rig-animation.mp4` (plus an optional WebM and a poster frame), then set `src` (and `poster`, `alt`) on the `ortesis-rig-animation` slot in `src/content/media.ts`.

### 8 Nov 2026 — animation supplied, shown small; scanner close-up leads "How it moves"
Albert supplied the CAD animation (`Photogrametry video animation.mp4`, 20 s, 1024 × 576, silent; original kept in `media-source/ortesis-studio/ortesis-rig-animation-original.mp4`, web copies MP4 1.9 MB + WebM 1.4 MB + poster, no audio) and judged it not professional enough to lead the section, but useful to understand the function. It is now small and discreet beside the rotation close-up (`playback: "toggle"`: one click starts/stops it), labelled "CAD animation"; the large piece of "How it moves" is the scanner-carriage close-up. He also supplied a "detail of the scanner" image carrying a Gemini watermark: compared with `photo-scanner-carriage.png` it is the same photograph regenerated, with details that are not on the rig (a brass gear beside the motor, new text on the motor labels, a larger gold bearing). It is not used; the real photograph (same composition) is used instead. If Albert wants a different crop or lighting of the real photograph, that can be done without adding or changing any detail. The file name contains "Photogrametry": the word never appears on the page (rule: "scanning rig", never photogrammetry).

### 8 Nov 2026 (second request) — rig CAD as an interactive viewer, application explained
Albert asked for four changes (in Catalan):
1. **CAD animation** placed where he circled it: the right column of "How it moves" row 1, under the lead and body sentences, at the width of that column (smaller on short laptop screens). Click or Enter/Space starts and stops it (`playback: "toggle"`). Row 2 is mirrored (sentence + optional decision text left, rotation close-up right).
2. **"How it was built"** now shows the complete CAD model of the rig as an interactive 3D viewer (drag to orbit, Ctrl/⌘ + wheel or +/− to zoom, arrow keys, Reset; views Perspective, Front, Side, Top), like the orthosis viewer. Source: `fotogrametria model def.stl` — the **second** file he sent (rig only, 284,175 triangles, 14.2 MB; original kept in `media-source/ortesis-studio/fotogrametria-model-def.stl`). The first file he sent was a whole scene (a human figure, a table and a stray block) and was **not used**; if it is ever used, check the rights of the human figure first. The web copy is **simplified** (109,999 triangles, 1.3 MB, `scripts/simplify-stl.mjs`), nearly identical visually because the plates are heavily tessellated in flat areas, but not lossless: the note next to the viewer says "Web version of the CAD model, simplified from 284,175 to about 110,000 triangles."
3. **No photograph of the built rig**: Albert has no good photograph of the whole rig. The old CAD-render-vs-photo pair, its two media slots and `CadVsBuilt` were removed. If he supplies one it goes beside the model with the caption "Built prototype".
4. **The application explained better** (interpreted as the private local web application, not the portfolio site). The section now says what it is (a Blender workflow wrapped by a local interface; a local Python layer runs Blender in the background as the geometry engine; all on the same computer), then four steps with real frames of the recording: Import, Prepare (reconstructs the anatomical mesh, original kept as a layer; four approximate landmarks set the orientation, which is confirmed before moving on), Design (region between two cutting planes; presets Light/Standard/Reinforced; start/end, opening, one piece or two valves, tape slots; lattice cell size, rib width, minimum thickness, irregularity), Generate and inspect (runs the engine, shows the result beside the anatomy, layers on/off, Regenerate). Export is **not in the recording**, so it is described in one sentence (STL, printed in a separate step) with the printed-part photograph. Still said plainly: the scan arrives as a file transferred by hand, printing is separate, the application is private. All step texts were checked frame by frame against `Ortesis Demo.mp4`.

Still to confirm with Albert: (1) which design decision to explain (ring gear + pinion or belt carriage): why, what it makes harder, what he considered instead; (2) one real assembly change on the rig; (3) what he would change first on the rig and how he would test it. Optional: whether the scan shown was captured with the rig; whether the contribution line wording is right; a real motion-test clip. The hero photograph still shows the printer's logo (offer a crop).

### 8 Nov 2026 (third request) — pinion row removed, no screenshots of the application
- Albert did not like the pinion part: the rotation close-up row (`ortesis-gear-detail`, "A motor-driven pinion meshes with the large ring gear…") was removed from "How it moves", which is now one row. The rotation is said in the body sentence: "one turns the mechanism around the arm, the other moves the scanner along it" (both facts are in his own drive captions). The rotation close-up, its labels (Pinion, Ring gear, Motor) and caption still exist under Technical details → "The rig, part by part"; ask Albert if they should go there too.
- A slider on the CAD model (to move the carriage / rotate) was considered and dropped at his request. Findings kept for later: the rig-only STL has 22 rigid bodies, the ring gears are fused with the two frame plates, and it has no carriage, scanner or belt; the first (scene) STL contains those extra bodies in the same coordinates (scanner head, carriage hardware, belt loop, belt pulley), so a faithful slider would need a CAD export with the moving parts as separate files.
- "Don't put so many images of the web": the four screenshots of the application were removed (slots and files deleted). The four steps are text only; the printed-part photo and the closed 50 s recording remain. He will show the application running live.

### 8 Nov 2026 (fourth request) — rig CAD viewer without its bar
Albert asked to remove the hint line, the note and the buttons under the rig CAD viewer in "How it was built", keeping everything working, with a plain scroll over the viewer zooming it, and everything obvious. (His message was cut off after "i podries…"; whatever followed is still to be asked.) Done with two new `OrthosisViewer` props, `minimal` and `scrollZoom`, used only by the rig viewer (the final-orthosis viewer under Technical details is unchanged): drag orbits; the plain wheel zooms and, at either end of the zoom range, scrolls the page again so the model never traps the scroll; Ctrl/⌘ + wheel, arrows, +/−, 0 still work; double-click resets; a small cube-and-arrow icon on the stage (no text) fades after the first touch; the +/−/Reset buttons remain on touch screens (coarse pointer) only, since a phone has no wheel or keyboard. Removing the note means the simplification is now stated in the body sentence ("This is its CAD model, simplified for the web: …") — the web copy is 109,999 of 284,175 triangles and not lossless, so the page must not call it the exact model. The views Perspective / Front / Side / Top are no longer on the page (only the opening view is used); the `views` data stays in `ortesis-case.ts`.

### 8 Nov 2026 (fifth request) — flat stage behind the rig CAD model; qualification line removed
- "Remove the lighting of the 3D model of the photogrammetry" was read as the light pool / vignette behind the rig CAD model (the stage had a lighter radial centre fading to darker edges). The stage in "How it was built" is now one flat slate colour in both themes (`.build__viewer .oviewer__stage` in `ortesis.css`); the model's own shading is unchanged so its shapes stay readable. If he meant the model's shading/gloss (matte, unlit look), that is the `satin` look in `OrthosisViewer.tsx` (`readLook`, `spec`/`rimK`) — ask before flattening it, because a fully unlit model loses its form. The orthosis viewer under Technical details keeps its original stage.
- The caption line "Independent experimental engineering prototype. Not clinically validated." under the hero photo was removed at his request (constant `QUALIFICATION` and style `.glance__qual` deleted). The limits are still stated on the case page under Technical details ("Fit, comfort or clinical performance: not tested"), in the page metadata description and in /legal. Do not re-add it unless he asks.

### 8 Nov 2026 (sixth request) — section menu removed
- Albert asked to remove the top menu of the case page (the sticky row Overview · How it moves · How it was built · Scan to part · Technical details, `JumpBar`). It is gone from `/work/ortesis-studio`; the main site header is unchanged. `JumpBar.tsx` and its `.jump*` CSS stay in the repo unused (can be deleted on the PC if it is never coming back). Section ids stay. With one sticky bar fewer, `--fit-h` is now viewport height − 10rem (was 13.5rem) and the section scroll offsets were reduced by the bar's height; re-checked at 1440×900, 1280×650 (photograph, text and clip on screen together) and 390 (dark).

### 8 Nov 2026 (seventh request) — rig CAD model replaced by the updated one
- Albert supplied the latest `fotogrametria model def.stl` (374,938 triangles, 18.7 MB, binary, 28 rigid bodies — all rig parts, no scene objects). Same frames, rails and rings as the first version; the motor/gear parts on the left frame were rearranged and a few new parts added (bounds grew by ≈1.5 units in −X). It replaces the model in "How it was built": web derivative `ortesis-rig-cad.mesh.bin` = 130,000 triangles, 62,899 vertices, 1.53 MB (target chosen so the vertex count stays under 65,536 and indices stay 16-bit; largest collapse error ≈ 0). Same viewer settings (`crease={22}`, opening view `build.views[0]`, framing from the bounds); checked at the opening view, from the sides and top, and zoomed in on the rails/carriage — no holes or spikes. The first version is kept in `media-source/ortesis-studio/` as `fotogrametria-model-def-previous-superseded.stl`.
- Page text did not change (it says two frames with toothed rings joined by the rails, simplified for the web). If the new gear arrangement should be named on the page, ask Albert what it is — nothing is inferred from the geometry.

### 8 Nov 2026 (eighth request) — third version of the rig model; real photograph of the built rig added
- Albert re-sent `fotogrametria model def.stl` (third version: 359,194 triangles, 17.96 MB, 28 rigid bodies, all rig parts). Compared with the second version the motor/gear parts now sit on the opposite side of the frames (x ≈ 4.1–5.4 instead of −6.8…−5), the frames, rails and rings are identical, and two more rods appear on that side. It replaces the model: web derivative 125,000 triangles, 60,417 vertices, 1.48 MB (16-bit indices). Checked at the opening view, from both sides and the top, and zoomed on the rails: clean. The two earlier versions are kept in `media-source/ortesis-studio/` as `fotogrametria-model-def-superseded-v1.stl` and `-v2.stl`.
- New photograph `ortesis-rig-built` (a real photograph, supplied by Albert; no watermark or metadata found; he describes it as real): the built rig from above and at an angle on a white background. Shown SMALL under the two sentences, to the left of the CAD model, caption "Built prototype", opens enlarged on click (`MediaZoom`); the "Enlarge" pill is reduced to its icon. On narrow screens it sits between the text and the model. The viewer fallback text now says "The photograph beside it shows the built rig." Alt text describes only what is visible (two white printed frames with large round openings and toothed outer rings, steel rails, two small motors with wiring on a bracket at the front). Nothing is said about how the CAD differs from the build.

### 8 Nov 2026 (ninth request) — columns always level (How it moves, How it was built)
- Albert asked that the right-hand image of "How it moves" (the CAD animation) be framed relative to the photograph on the left so both always end at the same height, and "the same concept" for "How it was built" below.
- **How it moves (desktop, ≥ 900 px)**: the carriage photograph now fills exactly the height of the right-hand column (title, sentences and CAD animation); the animation takes the space left under the text, bottom edge level with the photograph's, never cropped (16:9, shrinks with the available height); both captions hang on the same line under that edge. The photograph is cropped a little more than before when the text column is tall (box from 1 : 1.3 upwards in height); its `position` is unchanged.
- **How it was built (desktop)**: the model stage takes the full row height (it grows a little taller than 16 : 10 if the left column needs it); the photograph of the built rig fills the space under the text (3 : 4, as wide as the height allows, up to the column), bottom edge level with the stage; its caption hangs under that edge. The photograph is therefore larger than in the previous round (about 17 rem wide at 1440 px; it shrinks on short or narrow screens).
- Mobile and tablet (< 900 px) keep the stacked layout. Checked at 1920, 1440, 1280 × 650, 1100, 900 and 390: photograph and animation (and photograph and stage) end at the same pixel row at every size. The sizing uses container units in an `@supports (container-type: size)` block at the end of `ortesis.css`; browsers without container queries get the stacked layout. If the motion-test clip is ever supplied, the two clips share the space (`--n` on `.moves__clips`) — re-check then.
- The optional "decision" text (`DriveWhy`) moved from under the photograph to the text column; it is still empty.

### 8 Nov 2026 (tenth request) — text against the model; fourth rig model
- "How it was built": on desktop the text block (title, two sentences, built-rig photograph) now sits against the left edge of the CAD viewer (the text column takes the free width; the viewer keeps its height-fitted width). Mobile and tablet-stacked layouts unchanged.
- Albert re-sent `fotogrametria model def.stl` (fourth file: 378,666 triangles, 18.9 MB, 29 rigid bodies) after spotting a small error in the previous one. Compared with the third version everything is identical except ONE new part: a thin toothed disc (about 1.6 × 0.2 × 1.6 units, 19,472 triangles) beside the motor group on the same side as the motors. It replaces the model: web derivative 125,000 triangles, 60,401 vertices, 1.47 MB (16-bit indices). Checked at the opening view, from both sides and from above: clean. The third version is kept as `fotogrametria-model-def-superseded-v3.stl`.

### 15 Nov 2026 — new project: Three-Instrument Retention Insert (TIRI)
- Source: Albert's `TIRI_Website_Material.zip` (ASSETS.md, copy.md, images, video, documents). Nothing from its `_backup/` folder is used. All facts come from `copy.md`; no number was added or rounded differently; no company or job is named.
- Honest framing: it is a personal CAD and product-design project and a digital demonstrator. The label ("Personal project · Digital demonstrator") and the status badge say so on the card and on the page; the "Limits" block lists what was not done. (The extra italic line "Digital demonstrator: designed and checked on the CAD model. Nothing was built or tested." was removed from the card and the page header at Albert's request on 15 Nov, third request.)
- Placement: lead entry of section 02 (final order in the fifth request below).
- Card (short): cover image `tiri-hero`, label, title, the three summary sentences, the small simulation, "See the project →". The "What I did" line is only on the project page.
- Page: header (image, title, limit line, capabilities) → problem + "What I did" → video "Use, simulated" (32 s) → "How it works" (6 points) + exploded view → six detail views → "Checked on the model" (5 numbers + sections) → what went wrong / limits / next → "How it was made" → next project (the Downloads section with five PDFs and two drawings was removed at Albert's request, sixth request below). Images used: 11 of the 17 supplied: all eight priority A and B images (hero-closed, exploded, push-tab-detail, insert-moulded-shell, tool-lift, tilted-presentation, bridge-lift-fin, finger-room-plan) plus three priority C (critical-sections, drawing-insert, drawing-bridge). NOT used, to keep the page light (all priority C): lid-stepped-rim, scallop-tool1, five-states, study-reach, study-thermal, bridge-shapes. The poster is the supplied WebP.
- Video: `playback: "toggle"` (same Play pattern as the other clips: muted, loop, no autoplay, `preload="metadata"`); WebP poster; `.vtt` attached as a captions track but not default, because the captions are already burned into the picture (`captionsBurnedIn`).
- "How it was made" wording is a PROPOSAL (Albert to confirm or edit): it names Claude Code and a second AI instance that reviewed an early version (14 findings, from copy.md). The source line names the team-report co-authors as in copy.md (A. Gràcia, N. Galí, D. Navas): Albert to decide whether to keep their names.
- Nothing was published or deployed by Claude. A real `next build` could not be run in the working environment (no npm registry); the pages were checked with a bundler-based render harness at 1440 and 390 px, light and dark.

### 15 Nov 2026 (second request) — section 02 entries share the MotoSpirit panel
- (Superseded by the fourth request.) Albert asked for the other entries in section 02 to look like MotoSpirit; TIRI, Handlebar and AED were put in the same panel. He then clarified that only MotoSpirit and AED should have it.

### 15 Nov 2026 (third request) — simulation on the card, video higher, limit line out; facts audit
- Removed the italic "Digital demonstrator…" line (and its accent bar) from the homepage card and the project-page header. The label, the status badge, the "Limits" block and the page description (metadata) still say it is a digital demonstrator.
- Homepage card: the 32 s simulation sits small under the text (`MediaFrame id="tiri-use-simulation"`, toggle mode: muted loop, never autoplays, Play cue, poster, `preload="metadata"`), caption "Use, simulated · 32 s", then "See the project →". No figure number on the small video.
- Project page: the video section now comes right after the opening (title, image, capabilities) and before "The problem".
- Facts audit against the five PDFs (pdftotext): every number and claim on the card and page matches the documents (200 × 120 × 35 mm; 0.322 – 0.965 vs 0.30 – 1.00 mm; 0.53 mm; 5.9 mm; 1.41 mm; 110° / 115° stops; 2.5 mm shell, 1.5 mm ribs, −42 %, 108 g PPSU; 25 % lighter bridge (56 g to 42 g); 371 g; 13 revisions; 47 decisions; 14 findings from a separate agent instance at Rev C; Ø16, 2.2 mm; 15° tilt). NOT in the PDFs, taken from Albert's own captions: "the back edge rises about 32 mm" and "the steel rule, pen and disc are there for scale". "Claude Code" is only in the proposed "How it was made" wording. No company, employer or job is named on the page; the PDFs cite published sources by name (Aesculap sterilisation-container catalogue, an instrument-tray web page, a CDC Stacks dental-scaler study) and say the work was not requested or reviewed by any company or organisation.


### 15 Nov 2026 (fourth request) — card format only for MotoSpirit and AED (its TIRI placement is superseded by the fifth request)
- Only MotoSpirit and AED Monitoring keep the card ("fitxa") format (`.mx--moto, .mx--aed` in `home.css`). Handlebar is back to its original open layout (hairline top rule, no panel); its figure numbers are 02.1 / 02.2 again.
- TIRI is no longer inside section 02: `TiriSection` (`src/components/home/TiriSection.tsx`, id `tiri`) renders it as its own block directly after the Bar Stool and before About, with the kicker "02 — Mechanical & Product Design · Closing project". Layout: photo (fig 02.6), text, the small simulation, "See the project →". Order on the page: Hero → ORTESIS → 02 Mechanical → 03 Computational → Bar Stool → TIRI → About → Contact.
- Figure numbers: Handlebar 02.1 / 02.2, MotoSpirit 02.3, Bar Stool 02.4 (sketch 02.4b), AED 02.5, TIRI 02.6.
- Navigation: the Mechanical item is highlighted on `/work/chair-design` and `/work/tiri-insert`, and on the home page for `chair` and `tiri` (`alsoIds: ["chair", "tiri"]`).
- Coherence: "Closing project" moved from the Bar Stool kicker to the TIRI kicker (TIRI is now the last block of 02). Albert to confirm.
- Nothing published or deployed. Checked in the render harness at 1440 and 390 px, light and dark; no horizontal overflow.

### 15 Nov 2026 (fifth request) — new homepage order, "University projects" section, TIRI video plays on its own
Albert's order: 02 "Where geometry becomes tangible." (a Three-Instrument Retention Insert, b Bicycle Handlebar) · 03 Computational Design · 04 University projects (a MotoSpirit, b AED Monitoring, c Bar Stool) · 05 About · 06 Contact.
- New `UniversitySection` (id `university`): index 04, kicker "Team & group work" (wording mine — MotoSpirit and AED are labelled "University team project", the Bar Stool "University group project"), headline "University projects." Albert to confirm the kicker. The Bar Stool is now `ChairEntry` (an entry, no longer its own section; open layout); `ChairSection.tsx` and `TiriSection.tsx` were deleted.
- Card format ("fitxa") stays only on MotoSpirit and AED; Handlebar, TIRI and the Bar Stool are open.
- Figure numbers: TIRI 02.1, Handlebar 02.2 / 02.3, MotoSpirit 04.1, AED 04.2, Bar Stool 04.3 / 04.3b. About is 05, Contact 06.
- Navigation gains "University projects" (highlighted on `/work/chair-design`, whose breadcrumb now reads Portfolio / University projects / Bar Stool); the Mechanical item highlights on `/work/tiri-insert`; the Hero index now lists five items (01–05, About = 05). Six links no longer fit beside the logo below about 1150 px, so the Menu button starts at 1150 px (was 1100; `layout.css` and `Header.tsx`).
- TIRI card video: plays on its own from the start while the card is in view (muted, looping, small pause button; one video at a time; not for visitors who prefer reduced motion — they get the poster and a play button). Implemented with a new optional `playback` prop on `MediaFrame` that overrides the slot's mode for this one use. The project page keeps the Play button (the slot is still `toggle`).
- The "Closing project" kicker from the fourth request is gone (Bar Stool and TIRI are no longer separate sections).
- Nothing published or deployed. Checked in the render harness at 1440 / 1100 / 960 / 390 px, light and dark; no horizontal overflow; autoplay verified (plays when in view, stays paused with reduced motion).

### 15 Nov 2026 (sixth request) — equal-height cards, section 04 intro, shared column lines, TIRI image hierarchy, Downloads removed
- MotoSpirit and AED cards are exactly the same height on wide screens (`.uni-cards`, equal grid rows; stacked and natural height below 900 px). Refined in the seventh request below: the common height is MotoSpirit's own.
- Section 04 got a short lead under its heading: "Team and group projects from my university studies: a motorcycle, a compact electronic device and a wooden bar stool. In each, my part was mechanical design and CAD — the chassis, the enclosure and the side profile." Every claim comes from the entries' own text (MotoSpirit: chassis; AED: enclosure, mechanical design and CAD; Bar Stool: "Side profile developed in CAD"). Albert to confirm the wording.
- Alignment: Handlebar is now full container width (the 72 rem cap is gone) and uses the same 12-column lines as the TIRI entry (media columns 1–7, text 9–12; 8–12 below 1100 px). In section 04 the two cards and the Bar Stool share media columns 1–5 and text columns 6–12 (the Bar Stool gets the cards' inner inset on wide screens). Measured at 1440 / 1100 / 1000 px: identical left and right edges. All home sections stay inside the container at 1100 / 1440 / 1920 px.
- TIRI page "Views from the model": hierarchy instead of six equal tiles. The two priority-A images in his ASSETS.md (Fig. 4 push tab, Fig. 8 moulded insert) span 8 of 12 columns; the four priority-B images (Fig. 5, 6, 7, 9) keep the size they had (the plan view, Fig. 9, carries small lettering, so it was not made smaller). Tablet: large images full width, small ones in pairs; phone: one column.
- Downloads section (five PDFs + the two drawing images) removed from the TIRI page, with its data (`downloads`) and CSS. The PDFs (`public/assets/tiri-insert/documents/`) are no longer shipped. The two drawing image slots stay in the media registry, unused.
- Nothing published or deployed.

### 16 Nov 2026 (seventh request) — both cards keep MotoSpirit's height; AED adapts
- Albert preferred MotoSpirit's original (shorter) height, so AED Monitoring was adapted to it instead of stretching MotoSpirit: at 1440 px both cards are 330 px (AED was 521). AED's text now runs the full width of its column (`max-width: none` on its lead and contribution) and, on screens 900 px and wider, its picture fills the row height instead of keeping 4:3 (cover crop, `position="50% 30%"` so the "AED" sign stays visible; the caption "AI-generated contextual illustration — not the project prototype." stays under it). Measured natural heights, MotoSpirit / AED: 330 / 328 at 1440, 343 / 341 at 1280, 353 / 351 at 1100, 365 / 363 at 920. Only between about 960 and 1040 px the AED text wraps more and the pair is up to about 25 px taller than MotoSpirit alone.
- Nothing published or deployed.

### 16 Nov 2026 (eighth request) — reader's review of the home page and the TIRI page; TIRI simplified
Albert asked for a read-through as a visitor (home page and TIRI page) with visual guides (everything inside the margins, no big holes) and these changes:
- TIRI video: moved lower first, then (Albert's next message) made the first thing inside "How it works", centred.
- Fig. 2 (exploded view): the burned-in labels and leader lines were removed (Albert: no lines crossing each other) and SIX numbered markers drawn over the picture. Albert supplied a sharper, labelled version of the drawing (2184 × 1680), then asked to go back to the marker version with less text and more visual, and finally (third message) rejected the labelled drawing as the figure: "no cal que fiquis parts in the exploded view, fica la llista 01–06". So the markers 1 – 6 are the same numbers as the list of the six ideas beside the figure (instruments, bridge, push tab, keyed insert, front sweep, moulded shell); the nine-item parts list was removed (`parts` is gone from `tiri-case.ts`). The figure uses the cleaned high-resolution drawing (897 × 1360). Figure numbers are consecutive: hero 1, exploded view 2, details 3 – 8 (the old Fig. 10, the sections image, was dropped).
- "How it works": the 32 s video comes FIRST, centred in the middle of the section (it no longer has a section of its own; the anchor `#video` is kept), then the figure beside the six ideas, which were cut to one short sentence each (no 10 mm / 90° / "hidden keyhole slider" detail). The video caption on the page is shortened to one sentence.
- "How it was made" section removed (nothing about Claude Code or how the project was produced). `madeWith` is gone from `tiri-case.ts`; the team-report source line went with it.
- Limits: the "Nothing was built, handled, cleaned or sterilised" sentence is gone. The block now lists assumptions and open questions only: body sizes, material expansion, spring force and shock levels are assumptions; bridge stiffness not analysed; latch spring not sized; cleanability the largest open question; non-clinical, no regulatory claim. The label "Personal project · Digital demonstrator" and the status badge are unchanged (they remain the honest framing).
- Kept short and free of things that could confuse or contradict (Albert: "a simple personal project"): the revision and decision counts, the mass figure, the 5.9 mm / 25 % / −42 % / 108 g PPSU figures, "All of it is in the decision log" and the page-description sentence "nothing was built or tested" were removed. "Checked on the model" shows only the two headline results (5 of 5 requirements; gap 0.322 – 0.965 mm against the 0.30 – 1.00 mm target) and the label "Model results, not measurements" (shortened on the same day: heading left, the two numbers right, target shown as "target 0.30 – 1.00 mm").
- Layout holes fixed: Handlebar (introduction moved top right beside the CAD model, the FE figure under it, bottoms level); Bar Stool (text on top, sketch and link at the bottom, level with the photograph); TIRI "How it works" (figure beside the six ideas, which share its height; the figure stays sticky between 900 and 1099 px).
- Still open (small): Bar Stool at 900 – 1099 px has a taller text column than its photograph.
- Nothing published or deployed. Checked in the render harness at 1440 / 1000 / 390 px, light and dark.

### 16 Nov 2026 (ninth request) — Bicycle Handlebar moves to "University projects"
- Albert (looking at the home page): the TIRI entry and the Handlebar entry directly after it could not be told apart, so the Bicycle Handlebar leaves section 02 and joins section 04, University projects. Section 02 now holds the Three-Instrument Retention Insert only, and section 03 (Computational Design) follows right after it.
- Handlebar is the last entry of section 04 (after MotoSpirit, AED Monitoring and the Bar Stool). Figure numbers: Handlebar 04.4 (CAD model) and 04.5 (finite element study); the other numbers are unchanged. On screens 900 px and wider it takes the same inner inset as the Bar Stool so both open entries line up with the cards' content; its hairline keeps the container width.
- Section 04 intro: "…a motorcycle, a compact electronic device, a wooden bar stool and a bicycle handlebar. On the first three, my part was mechanical design and CAD — the chassis, the enclosure and the side profile." (No contribution is claimed for the handlebar: none is documented.)
- Nothing published or deployed. Checked in the render harness at 1440 / 1000 / 390 px.
