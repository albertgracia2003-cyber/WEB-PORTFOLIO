import type { Maturity, Project } from "@/types/project";

/**
 * PROJECT INDEX
 * Long-form chapter text lives in each case-study page; this file holds
 * the structured, reusable facts. Never fill unknown fields with guesses —
 * leave optional fields undefined.
 */
const projects: readonly Project[] = [
  {
    slug: "ortesis-studio",
    href: "/work/ortesis-studio",
    title: "ORTESIS STUDIO",
    subtitle: "From anatomical scanning to personalised orthotic geometry.",
    summary:
      "An experimental engineering system combining custom hardware, computational geometry, and digital fabrication.",
    category: "flagship",
    authorship: { kind: "personal", note: "Independently developed" },
    maturity: "functional-prototype",
    disciplines: [
      "Mechanical design",
      "Prototyping",
      "Motion-control integration",
      "Computational geometry",
      "Workflow development",
    ],
    tools: ["Creality 3D scanner", "Arduino", "Blender (Geometry Nodes, Python/BMesh)", "Three.js", "3D printing"],
    cover: "ortesis-hero",
    related: ["procedural-city", "parametric-drawer"],
    publication: "published",
    confidentiality:
      "The production web application is private: never link or expose its URL, credentials or source.",
    order: 1,
  },
  {
    slug: "procedural-city",
    href: "/computational-design/procedural-city",
    title: "Procedural City Generator",
    subtitle: "A planar layout, a set of rules, and the city that follows.",
    summary:
      "Procedural urban geometry built with Blender Geometry Nodes: a predefined plane controls where roads and building blocks are generated.",
    category: "computational",
    authorship: { kind: "personal", note: "Independent project, developed with AI-assisted coding (Claude Code)" },
    maturity: "working-system",
    disciplines: ["Procedural modelling", "Geometry Nodes", "Computational experimentation"],
    tools: ["Blender Geometry Nodes", "Claude Code"],
    cover: "city-hero",
    related: ["parametric-drawer", "ortesis-studio"],
    publication: "published",
    order: 1,
  },
  {
    slug: "parametric-drawer",
    href: "/computational-design/parametric-drawer",
    title: "Parametric Drawer System",
    subtitle: "One problem, many configurations.",
    summary:
      "A parametric system that generates drawer-divider layouts from length, width, number of separators and geometric irregularity.",
    category: "computational",
    authorship: { kind: "personal" },
    maturity: "working-system",
    disciplines: ["Parametric systems", "Geometry Nodes", "Computational experimentation"],
    tools: ["Blender Geometry Nodes"],
    cover: "drawer-hero",
    related: ["procedural-city", "ortesis-studio"],
    publication: "published",
    order: 2,
  },
  {
    slug: "chair-design",
    href: "/work/chair-design",
    title: "Bar Stool",
    subtitle: "Adaptable, with a flexible backrest and a demountable structure.",
    summary:
      "A bar stool from **flat wooden boards**, with a **flexible backrest** and a **demountable structure**. A university group project: the side profile was developed in **CAD** and the stool built as a **full-scale (1:1) prototype**.",
    category: "physical",
    authorship: {
      kind: "collaborative",
      context: "University group project",
      contribution: "Side profile developed in CAD.",
    },
    maturity: "built-object",
    disciplines: ["Product form", "Material exploration", "Physical making", "Design development"],
    tools: [],
    cover: "chair-hero",
    related: ["ortesis-studio"],
    publication: "published",
    order: 1,
  },
  {
    slug: "handlebar",
    title: "Bicycle Handlebar — CAD & Structural Study",
    subtitle: "A university project on handlebar cross-section sizing.",
    summary:
      "A university project exploring handlebar cross-section sizing through **CAD modelling** and **finite element analysis**.",
    category: "physical",
    authorship: {
      kind: "collaborative",
      context: "University project",
      contribution: undefined,
    },
    maturity: "concept",
    disciplines: ["3D CAD", "Mechanical design", "Finite element analysis"],
    tools: ["SolidWorks"],
    cover: "handlebar-fea",
    publication: "published",
    order: 0,
  },
  {
    slug: "motospirit",
    title: "MotoSpirit",
    subtitle: "University motorcycle team — chassis design.",
    summary: "Team project to develop a motorcycle at UPC ESEIAAT.",
    category: "supporting",
    authorship: {
      kind: "collaborative",
      context: "University team project",
      contribution: "Mechanical and structural design, mainly the chassis.",
    },
    maturity: "concept",
    disciplines: ["Mechanical design", "Chassis design", "CAD"],
    tools: [],
    cover: "motospirit-cover",
    detail: {
      intro:
        "MotoSpirit is a motorcycle built by a university student team at UPC ESEIAAT. I was involved in its **mechanical development**, mainly the chassis — the structure the other parts are fitted to — through structural design and CAD modelling.",
      points: [
        "**Mechanical and structural design**, mainly the chassis.",
        "**CAD** modelling for the chassis design work.",
        "One contribution within the team’s effort — the motorcycle as a whole is the team’s work.",
      ],
      teamNote: "Other subsystems, manufacturing, testing and results belong to the wider team and are not described here.",
    },
    publication: "published",
    order: 2,
  },
  {
    slug: "aed-monitoring",
    title: "AED Monitoring",
    subtitle:
      "A collaborative product development project focused on the design and prototyping of a compact electronic device, combining mechanical design, sensor integration and manufacturing considerations.",
    short: "Collaborative product development of a compact electronic device.",
    summary: "Team product-development project at the University of Twente.",
    category: "supporting",
    authorship: {
      kind: "collaborative",
      context: "University Team Project — University of Twente",
      contribution:
        "I contributed to the mechanical design and CAD development of the device, focusing on its enclosure, component integration and assembly. The work involved considering component placement, manufacturability and practical design constraints.",
    },
    maturity: "concept",
    disciplines: ["Product development", "Mechanical design", "CAD"],
    tools: [],
    cover: "aed-cover",
    publication: "published",
    order: 3,
  },
  {
    // Future direction — prepared internally, never rendered while in draft.
    slug: "computational-healthcare",
    title: "Computational Healthcare",
    subtitle: "Parametric assistive-device concepts (working title).",
    summary: "Planned exploration. Not started publicly.",
    category: "computational",
    authorship: { kind: "personal" },
    maturity: "planned",
    disciplines: [],
    tools: [],
    cover: "ortesis-hero",
    publication: "draft",
    order: 99,
  },
];

export const maturityLabel: Record<Maturity, string> = {
  "functional-prototype": "Functional experimental prototype",
  "working-system": "Working procedural system",
  "built-object": "Built physical object",
  concept: "University project",
  planned: "Planned",
};

export function publishedProjects(): Project[] {
  return projects.filter((p) => p.publication === "published");
}

export function projectsByCategory(category: Project["category"]): Project[] {
  return publishedProjects()
    .filter((p) => p.category === category)
    .sort((a, b) => a.order - b.order);
}

export function getProject(slug: string): Project {
  const p = projects.find((x) => x.slug === slug && x.publication === "published");
  if (!p) throw new Error(`Unknown or unpublished project: ${slug}`);
  return p;
}

/** Case-study reading order for "next project": homepage order (01 ORTESIS, 03 Computational, then the Bar Stool that closes the page before About), detail pages only. */
export const caseStudyOrder = ["ortesis-studio", "procedural-city", "parametric-drawer", "chair-design"] as const;

export function nextCaseStudy(slug: string): Project {
  const i = caseStudyOrder.indexOf(slug as (typeof caseStudyOrder)[number]);
  const next = caseStudyOrder[(i + 1) % caseStudyOrder.length] ?? caseStudyOrder[0];
  return getProject(next);
}
