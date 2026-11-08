import type { MediaId } from "@/content/media";

/**
 * ORTESIS STUDIO case study — facts used by /work/ortesis-studio.
 * Only what Albert has confirmed (docs/CONTENT_NOTES.md) or what the photographs and CAD show. Unknown fields stay out
 * and hidden; never fill them with guesses, and never infer a reason, an incident or a trade-off from a photograph.
 */

/* ---------- Opening: what the project is ---------- */

/**
 * The page opens with the project, the machine and the printed part: no kicker, no authorship block, no first person.
 * `role` is the one discreet line that says what Albert contributed; it names no commercial component.
 */
export const intro = {
  lead: "A prototype for capturing forearm geometry and designing a personalised orthosis for 3D printing.",
  body: "The project combines a motorised scanning rig with a separate local tool that turns a scan file into a printable model.",
  role: "Independent project · Mechanical design, fabrication, motion control and geometry software",
  photoCaption: "The scanning rig and printed orthosis prototype",
} as const;

/* ---------- The machine · how it moves ---------- */

/** The sentence that opens the section, then one sentence on the control. Both sit beside the first close-up. */
export const moves = {
  lead: "The forearm stays in place while the scanner moves around it and along its length.",
  body: "Two motorised movements do this: one turns the mechanism around the arm, the other moves the scanner along it. Both run under Arduino-based control, programmed for the project and tested mechanically on the prototype.",
} as const;

/** A label drawn on a detail photograph, at a position in percent of the visible image box. Used under Technical details. */
export interface PartLabel {
  text: string;
  x: number;
  y: number;
  side?: "left" | "right";
}

/**
 * The two drives, one close-up photograph each: the scanner carriage first (it leads the section), then the rotation
 * drive. `caption` says what the mechanism does as a whole (names appear inside the sentence); `labels` name the parts on
 * the photograph and are drawn only under Technical details. `position` is where the 4:3 box crops the photograph (x, y of
 * the labels are percent of that visible box; names taken from what is visible and from the photograph's alt text).
 */
export const drives = [
  {
    key: "translation",
    media: "ortesis-carriage",
    position: "35% 50%",
    caption: "A toothed belt pulls the printed carriage, with the scanner, along two steel guide rails.",
    detailTitle: "Translation drive",
    labels: [
      { text: "Guide rails", x: 9, y: 36, side: "right" },
      { text: "Toothed belt", x: 9, y: 49, side: "right" },
      { text: "Carriage", x: 42, y: 30, side: "right" },
      { text: "Scanner", x: 45, y: 69, side: "left" },
    ],
  },
  {
    key: "rotation",
    media: "ortesis-gear-detail",
    position: "50% 55%",
    caption: "A motor-driven pinion meshes with the large ring gear and rotates the mechanism around the arm.",
    detailTitle: "Rotation drive",
    labels: [
      { text: "Pinion", x: 66, y: 40, side: "right" },
      { text: "Ring gear", x: 52, y: 66, side: "left" },
      { text: "Motor", x: 84, y: 83, side: "left" },
    ],
  },
] as const satisfies readonly {
  key: "rotation" | "translation";
  media: MediaId;
  position: string;
  caption: string;
  detailTitle: string;
  labels: readonly PartLabel[];
}[];

/**
 * A design decision explained by Albert, in his words. Empty on purpose: the reason, what the solution makes harder and the
 * alternative he considered must come from him. Each field that has text appears as one plain paragraph under the
 * matching photograph's caption; nothing renders while all are empty.
 */
export interface DesignDecision {
  reason?: string;
  tradeoff?: string;
  alternative?: string;
}
export const decisions: Record<"rotation" | "translation", DesignDecision> = {
  rotation: {},
  translation: {},
};

/* ---------- The machine · how it was built ---------- */

/**
 * "How it was built": one interactive CAD model of the rig and two plain sentences. The first is Albert's own description
 * of the structure (the system breakdown says the same); the second says what the model shows, from the model itself.
 * There is no photograph of the built rig here on purpose: Albert has no good photograph of the whole rig, and the page
 * never shows a weaker one in its place. If one is supplied later it goes beside the model with the caption "Built prototype".
 */
export const build = {
  lead: "The rig is a PLA-printed structure with bearings, guides and two transmissions.",
  body: "This is its CAD model, simplified for the web: two frames with toothed rings, joined by the rails.",
  viewerSubject: "the scanning-rig CAD model",
  /** Caption of the small photograph of the built rig, beside the model. */
  photoCaption: "Built prototype",
  viewerFallback: "The CAD model could not be shown here. The photograph beside it shows the built rig.",
  views: [
    { label: "Perspective", yaw: -34, pitch: 17 },
    { label: "Front", yaw: 0, pitch: 0 },
    { label: "Side", yaw: 90, pitch: 0 },
    { label: "Top", yaw: 0, pitch: 89 },
  ],
} as const;

/* ---------- From scan file to printed part ---------- */

/**
 * The local application, explained from its screen recording (no frames of it are shown on the page: Albert demonstrates it live; checked frame by frame: the step names, the landmarks, the
 * presets and parameters, Generate / Regenerate, the layers panel). Export is not in the recording, so it is described, not
 * shown. The scan reaches the application as a file transferred by hand; nothing says the scan shown came from the rig.
 */
export const app = {
  lead: "A local web application turns a scan file into printable orthosis geometry.",
  body: "The workflow was first built inside Blender. The application wraps it, so nobody has to open Blender by hand: the interface runs on the same computer and a local Python layer runs Blender in the background as the geometry engine.",
  note: "The scan reaches the application as a file transferred by hand, and printing is a separate step. The application is private; the recording below shows it running.",
  steps: [
    {
      n: "01",
      title: "Import",
      text: "A scan file is loaded. The application reports its format, size, triangle count and dimensions, and never modifies the file.",
    },
    {
      n: "02",
      title: "Prepare",
      text: "The scan is reconstructed into an anatomical mesh, and the original stays available as a layer. Four approximate landmarks tell the application how the arm is oriented; the orientation is confirmed before moving on.",
    },
    {
      n: "03",
      title: "Design",
      text: "The region between the two cutting planes is set, a preset (Light, Standard or Reinforced) is chosen, and parameters shape the part: where it starts and ends, its opening, one piece or two valves, and the lattice (cell size, rib width, minimum thickness, irregularity).",
    },
    {
      n: "04",
      title: "Generate and inspect",
      text: "Generate runs the engine in the background and the result appears in the 3D view next to the anatomy. Layers can be switched on and off to inspect it, and Regenerate runs it again with other parameters.",
    },
  ],
  out: {
    title: "Export and print",
    text: "The result is exported as an STL and 3D printed in a separate step.",
    caption: "The generated geometry, 3D-printed and shown on an arm: an open lattice up to the palm, thumb free.",
  },
} as const satisfies {
  lead: string;
  body: string;
  note: string;
  steps: readonly { n: string; title: string; text: string }[];
  out: { title: string; text: string; caption: string };
};

/** The motion-test video, shown once supplied. The caption must describe what the clip actually shows. */
export const motionTestLabel = "Motion test";

/* ---------- Closing: demonstrated / still open / next version ---------- */

/** Strings use rich() markup. The rig's movement and the geometry workflow are shown separately on purpose. */
export const demonstrated = {
  rig: "Both axes run under Arduino control and were tested mechanically on the prototype.",
  workflow: "The generated geometry was 3D-printed as an orthosis prototype and shown on an arm.",
} as const;

/** Not measured or not tested. Listed so nobody has to guess. */
export const stillOpen = [
  "**Scan accuracy**: not measured.",
  "**Fit, comfort or clinical performance**: not tested.",
  "**Time savings**: not measured.",
] as const;

/** Questions for a next version, as questions (both come from facts Albert confirmed). */
export const nextQuestions = [
  "Can the two movements be coordinated with the scanner's capture software?",
  "Can the scan reach the application directly, instead of as a file transferred by hand?",
] as const;

/**
 * The one change he would make first on the rig, and how he would check it worked. Undefined until Albert confirms his
 * priority; the page then shows "Change first" and "How it would be checked" in the last column.
 */
export const hardwareNext: { first?: string; check?: string } = {};

/** Software next steps (planned, not implemented). Shown under "Technical details". */
export const softwareNext = [
  "Calibrated control of the lattice cell size",
  "Fuller anatomical normalisation from the landmarks (today they set orientation)",
  "Inspection tools for the generated geometry",
  "A packaged installation of the application",
] as const;
