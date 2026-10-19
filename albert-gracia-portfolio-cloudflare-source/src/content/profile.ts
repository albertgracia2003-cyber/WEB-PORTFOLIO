/**
 * Profile, experience and education.
 * Dates and job titles are intentionally omitted until Albert confirms them.
 * No confidential employer information belongs in this file.
 */

import type { MediaId } from "@/content/media";

export interface Experience {
  organisation: string;
  location: string;
  /** Confirmed job title. Undefined = not shown. */
  title?: string;
  /** Confirmed period, e.g. "2025 — Present". Undefined = not shown. */
  period?: string;
  focus: string;
  /** One short paragraph: what the work involved. */
  summary: string;
  /** Two or three concrete contribution areas. */
  contributions: readonly { title: string; body: string }[];
  /** Short compatibility list (homepage); the About page uses `summary` and `contributions`. */
  areas: readonly string[];
}

export interface Education {
  institution: string;
  detail: string;
  qualification: string;
  period?: string;
  /** Institution logo slot (shown only once the file is supplied). */
  logo?: MediaId;
  /** Final project of the degree. `subject` is a descriptive subject, not an official thesis title. */
  thesis?: { subject: string; subtitle: string; description: string };
}

export const statement =
  "I am interested not only in designing products, but in ==developing the tools and processes== that make better products possible.";

export const intro = [
  "My background is in **Industrial Design Engineering and Product Development**, with experience in **CAD, mechanical component development and prototyping**. I enjoy designing parts and assemblies, understanding how they work, and ==connecting digital models with physical fabrication==.",
  "**Computational design** is a complementary strength: I often build the tool as well as the object — a machine to capture geometry, a procedural system to generate it, an interface to make it usable. Professionally I have worked in robotics hardware and aerospace-related manufacturing.",
];

export const approach: readonly { title: string; body: string }[] = [
  {
    title: "Physical first",
    body: "**Materials, manufacturing and assembly constraints** shape decisions from the start, not at the end.",
  },
  {
    title: "Rules over repetition",
    body: "When a modelling task keeps coming back, I describe it as **a system of parameters and rules**.",
  },
  {
    title: "Build and test",
    body: "**Prototypes check assumptions.** Printing, assembling and running something tells me more than another iteration on screen.",
  },
  {
    title: "Across disciplines",
    body: "**Mechanics, electronics, software and fabrication** meet in most of my work. I enjoy the interfaces between them.",
  },
];

/**
 * Capabilities are shown through the work: About lists each project's labels
 * (from `projects.ts`) plus this line for professional experience.
 */
export const professionalCapabilities: readonly string[] = ["3D CAD", "Component design", "Manufacturing considerations", "Mechanical integration"];

/** Main CAD / modelling tools. */
export const tools: readonly string[] = ["SolidWorks", "CATIA V5", "Blender"];

export const experience: readonly Experience[] = [
  {
    organisation: "Amazon RIVR",
    location: "Zürich, Switzerland",
    focus: "Robotics hardware and mechanical product development",
    summary:
      "**Mechanical product development** for robotic hardware, with engineering colleagues across disciplines. The work runs from **CAD to physical prototypes**: designing components, testing them, and making them fit the larger assembly.",
    contributions: [
      { title: "Component design in SolidWorks", body: "Parts and the mechanical interfaces that connect them to the rest of the robot." },
      { title: "Fastening and cable integration", body: "How components are joined, and how cables and connectors are routed and secured." },
      { title: "Prototyping and integration", body: "Building and testing prototypes, and integrating parts together with the wider engineering team." },
    ],
    areas: ["Mechanical design and CAD", "Electromechanical integration", "Prototyping"],
  },
  {
    organisation: "GUTMAR",
    location: "Spain",
    focus: "Mechanical design and manufacturing engineering in an aerospace-related industrial environment",
    summary:
      "**Mechanical design and manufacturing engineering** in an aerospace-related industrial environment, progressing from practical experience to a junior engineering role. The work sat between the design office and the workshop: **designing in CATIA V5** and preparing parts for how they would be machined.",
    contributions: [
      { title: "Mechanical design in CATIA V5", body: "Modelling parts and assemblies as part of the engineering team's work." },
      { title: "CAD/CAM and machining", body: "Preparing designs for manufacture and working with machining processes." },
      { title: "Tolerances and technical development", body: "Tolerancing, technical documentation and the development work around it." },
    ],
    areas: ["CATIA V5", "CAD/CAM and machining", "Tolerances"],
  },
];

/** How the professional experience connects to the independent work (About + homepage). */
/** One-paragraph background used on the homepage About section. */
export const backgroundSummary =
  "**Amazon RIVR** (Zürich) — robotics hardware: component design in SolidWorks, prototyping and mechanical integration. Before that, **GUTMAR** (Spain) — mechanical design and manufacturing: CATIA V5, CAD/CAM, machining and tolerances. Degree in **Industrial Design Engineering and Product Development** (UPC, ESEIAAT).";

export const experienceConnection =
  "Both roles keep design close to ==how parts are made and assembled== — interfaces, fastening, wiring, tolerances, machining. I bring that into my independent projects and extend it with **computational design, software and experimental prototyping**.";

export const education: readonly Education[] = [
  {
    institution: "Universitat Politècnica de Catalunya (UPC)",
    detail: "ESEIAAT",
    qualification: "Bachelor's Degree in Industrial Design Engineering and Product Development",
    // UPC logo intentionally not shown (file kept at public/assets/about/upc-logo.webp; re-enable with logo: "upc-logo").
    thesis: {
      subject: "Aerospace Manufacturing & Tooling Development",
      subtitle: "Bachelor’s Thesis · Grade: 10/10",
      description:
        "A project on **precision tooling design** and **manufacturing process planning** for aerospace components, with attention to dimensional accuracy, quality requirements and manufacturability.",
    },
  },
  {
    institution: "University of Twente",
    detail: "Netherlands",
    qualification: "Academic exchange",
  },
];
