import { media, type MediaId } from "@/content/media";

/**
 * MEDIA-LED PROJECT PAGES — Computational Design and the Bar Stool
 * ----------------------------------------------------------------
 * Each computational project is a sequence of sections: the result, how it
 * works, variations, special views, behind the system, the full recording.
 *
 * To add footage: register the file in `media.ts`, then reference its id here.
 * Media without a `src` is skipped; a section with no available media is not
 * rendered (except text-only "steps", which explain the system on their own).
 */

export interface Step {
  title: string;
  body: string;
  /** Optional clip/still for this step — rendered only once supplied. */
  media?: MediaId;
}

export type Section =
  | { kind: "steps"; id: string; title: string; intro?: string; steps: readonly Step[] }
  | { kind: "mosaic"; id: string; title: string; body: string; items: readonly { id: MediaId; title: string }[]; layout?: "sequence" }
  | { kind: "daynight"; id: string; title: string; body: string; day: MediaId; night: MediaId; note: string }
  | { kind: "behind"; id: string; title: string; body: string; items: readonly MediaId[] }
  | { kind: "recording"; id: string; title: string; body: string; media: MediaId };

export interface ProjectShowcase {
  /** Curated homepage pair: main clip + an optional smaller supporting clip. */
  home: { main: MediaId; support?: MediaId; supportLabel?: string };
  /** Two short paragraphs for the homepage: what it does / what I developed. */
  homeText: readonly [string, string];
  /** Large result video at the top of the project page. */
  feature: MediaId;
  /** Opening paragraphs on the project page. */
  intro: readonly string[];
  sections: readonly Section[];
  /** Closing note: scope and limits. */
  footnote: string;
}

export const showcase = {
  "procedural-city": {
    home: { main: "city-clip-layouts", support: "city-aerial-day", supportLabel: "From above, in daylight" },
    homeText: [
      "An independent procedural modelling experiment in **Blender Geometry Nodes**. A flat input plane sets the layout: roads run through the centres of its subdivisions and buildings fill the blocks that remain.",
      "I conceived the system and developed it with **AI-assisted coding (Claude Code)**, directing the logic and testing it. Every clip is recorded or rendered from Blender.",
    ],
    feature: "city-clip-layouts",
    intro: [
      "Instead of modelling streets and buildings one by one, the design work goes into ==a set of rules== in Blender Geometry Nodes and a simple input that drives them.",
      "The opening clip shows city layouts of different sizes from the same system. I **conceived the project** and developed it with **AI-assisted coding (Claude Code)**: defining the logic, directing the implementation and testing the output.",
    ],
    sections: [
      {
        kind: "steps",
        id: "how",
        title: "How the layout is generated",
        intro: "Three ideas carry the system. The input is simple; everything else is derived from it.",
        steps: [
          { title: "The input plane", body: "A predefined plane sets the city's **extent and organisation**.", media: "city-input-plane" },
          { title: "Subdivisions become roads", body: "**Subdividing the plane** is the main control. Roads are generated through the centres of the subdivisions.", media: "city-subdivision" },
          { title: "Buildings follow", body: "**Building blocks** are generated automatically in the areas the roads leave.", media: "city-blocks" },
        ],
      },
      {
        kind: "mosaic",
        id: "inside",
        title: "Inside the result",
        layout: "sequence",
        body: "What the system produces, from the whole layout down to street level: first the recording of the layout changing in Blender, then two renders of the result.",
        items: [
          { id: "city-grid-recording", title: "Layout generation" },
          { id: "city-render-elevated", title: "Elevated view" },
          { id: "city-render-street", title: "Street level" },
        ],
      },
      {
        kind: "daynight",
        id: "above",
        title: "From above",
        body: "A top-down view shows the organisation: the road grid, the blocks between roads and the buildings that fill them.",
        day: "city-aerial-day",
        night: "city-aerial-night",
        note: "Day and night are separate renders of the scene — not a lighting control or a simulated day–night cycle.",
      },
      {
        kind: "behind",
        id: "behind",
        title: "Behind the system",
        body: "The generator is a **Geometry Nodes** setup. Its node graph turns the input plane into roads and buildings.",
        items: ["city-nodes-recording", "city-nodes"],
      },
      {
        kind: "recording",
        id: "recording",
        title: "Full recording",
        body: "The complete screen recording from Blender (43 s, no audio): generated layouts, then a walk-through with the generator's settings in the side panel.",
        media: "city-demo",
      },
    ],
    footnote:
      "**Limits:** the system can generate fairly large layouts, but complexity and scalability are currently limited. It is a study in procedural geometry, not an urban-planning tool, and it runs in Blender — there is no browser version.",
  },
  "parametric-drawer": {
    home: { main: "drawer-clip-in-drawer", support: "drawer-clip-organiser", supportLabel: "The organiser on its own" },
    homeText: [
      "A configurable drawer organiser. Four parameters — length, width, number of separators and irregularity — drive a **Geometry Nodes** system that generates the dividers as independent elements.",
      "I **developed the procedural system** in Blender. The footage shows the layout regenerating as parameters change, in a drawer and as a standalone organiser.",
    ],
    feature: "drawer-clip-in-drawer",
    intro: [
      "Every drawer has its own size and everyone organises it differently. Modelling new dividers each time repeats the same work, so this project makes it ==a parametric system==: describe the drawer and the layout, and the dividers are generated.",
      "I **developed the procedural system** in **Blender Geometry Nodes**. The opening clip shows it in use: parameters change in the side panel and the compartments regenerate inside the drawer.",
    ],
    sections: [
      {
        kind: "steps",
        id: "parameters",
        title: "Four parameters",
        intro: "The inputs the system exposes. Each one visibly changes the arrangement.",
        steps: [
          { title: "Length", body: "The drawer's **inner length** — the layout always fills it." },
          { title: "Width", body: "The **second dimension**. With length, it sets the proportions every compartment works within." },
          { title: "Separators", body: "**How many dividers** are generated: more separators, smaller compartments." },
          { title: "Irregularity", body: "**How far the layout departs from an even grid**, from regular rows to mixed rectangular compartments." },
        ],
      },
      {
        kind: "mosaic",
        id: "arrangements",
        title: "Different arrangements",
        body: "Same system, different settings: a few large compartments, a denser grid, and the organiser on its own with irregular divisions.",
        items: [
          { id: "drawer-clip-organiser", title: "The organiser on its own" },
          { id: "drawer-variation-01", title: "Few, large compartments" },
          { id: "drawer-variation-02", title: "A denser layout" },
          { id: "drawer-variation-03", title: "Standalone, many compartments" },
        ],
      },
      {
        kind: "behind",
        id: "behind",
        title: "Behind the system",
        body: "The **Geometry Nodes** setup that places the separators and splits the drawer into compartments.",
        items: ["drawer-nodes-recording", "drawer-nodes"],
      },
      {
        kind: "recording",
        id: "recording",
        title: "Full recording",
        body: "The complete screen recording (37 s, no audio), with the parameters visible in Blender's side panel.",
        media: "drawer-demo",
      },
    ],
    footnote:
      "**Scope:** layout generation. Fabrication, joints and materials are not part of this project, and the system runs in Blender — there is no browser version.",
  },
} satisfies Record<string, ProjectShowcase>;

/** Homepage order of the Computational Design section. */
export const homeComputational = ["procedural-city", "parametric-drawer"] as const;

/** Bar stool page: further views as they arrive (pending ones are skipped). */
export const chairGallery: readonly MediaId[] = ["chair-view-01", "chair-view-02", "chair-detail-01", "chair-detail-02"];

export const supplied = (id: MediaId | undefined): id is MediaId => Boolean(id && (media[id] as { src?: string }).src);
