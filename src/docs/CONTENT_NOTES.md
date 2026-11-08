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
