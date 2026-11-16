/**
 * THREE-INSTRUMENT RETENTION INSERT — facts used by the homepage card and /work/tiri-insert.
 * Everything here comes from the project material Albert supplied (copy.md, 15 Nov 2026) and the project documents: nothing is added.
 * It is a personal CAD and product-design project, a DIGITAL DEMONSTRATOR (designed and checked on the CAD model). The numbers are model
 * results, never measurements of a real part. No company, job or client is named anywhere in this material.
 * Albert asked for it simple (16 Nov 2026): no process or tooling story, no counts of revisions or decisions, no claims that could contradict each other.
 * Strings use rich() markup where they contain **bold** lead-ins.
 */

/** Mono-caps label above the title (card and page). */
export const label = "Personal project · Digital demonstrator";

/** Homepage card: the three sentences are the project summary in `projects.ts`; the "What I did" line is on the project page only, to keep the home page short. */
export const card = {
  link: "See the project",
} as const;

/* ---------- Project page: opening ---------- */

export const problem =
  "A bench technician moves three blunt mock instruments as one set, keeps their tips clear of the case and of each other, and lifts out any one by its grip once the case is flat. The insert lifts out of the case, can only be seated one way, and the three instruments are held by one bridge and one latch.";

export const whatIDid =
  "I turned five requirements into checks (fit, clearance, capture, access, keyed seating) and modelled the insert parametrically in FreeCAD, re-running the checks after every change.";

/* ---------- The video (first thing under "How it works") ---------- */

export const video = {
  title: "Use, simulated",
  length: "32 s",
  caption: "Press the tab, swing the bridge up, lift one instrument, close. A geometric simulation of the CAD model, not a physical test.",
} as const;

/* ---------- How it works: six short ideas ---------- */

export const works = [
  { title: "Locate by shape", text: "Each instrument lies in two vee saddles and stops on collars." },
  { title: "Restrain with one plane", text: "One flat bridge plane sits 0.53 mm above all six land tops. Nothing is clamped." },
  { title: "One thumb press", text: "A 4 mm press on the push tab frees the latch; a ramp latches it again on closing." },
  { title: "Keyed insert", text: "Turned the wrong way round, it does not sit flat and cannot be screwed down." },
  { title: "Made for the hand", text: "Lift fins, a sweep in the front wall for the finger, three identical lift wells, tactile row numbers." },
  { title: "Made for moulding", text: "A cored shell with 2.5 mm walls, shaped to be injection-moulded." },
] as const;

/* ---------- Checked on the model (model results) ---------- */

export const numbers = [
  { term: "Requirements passing", value: "5\u00a0of\u00a05" },
  { term: "Gap, land to bridge", value: "0.322\u00a0–\u00a00.965\u00a0mm", note: "target 0.30 – 1.00 mm" },
] as const satisfies readonly { term: string; value: string; note?: string }[];

/* ---------- What went wrong · Limits · Next ---------- */

export const wentWrong =
  "The first layout failed the clearance check (up to 1.41 mm). A 115° open stop failed the swing check. As-moulded tolerances do not hold the clearance either: the vee seats, stop pad, latch seat and hinge holes have to be finish-machined after moulding.";

export const limits =
  "Body sizes, material expansion, spring force and shock levels are assumptions. The bridge stiffness is not analysed, the latch spring is not sized, and cleanability is the largest open question. Non-clinical; no regulatory claim is made.";

export const next = "A printed insert and bridge, a mock-up with real hands, a finite-element check of the bridge.";
