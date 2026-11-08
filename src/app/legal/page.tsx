import Link from "next/link";
import type { Metadata } from "next";
import { LegalDoc, type LegalSection } from "@/components/legal/LegalDoc";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { withBase } from "@/lib/base";

export const metadata: Metadata = pageMetadata({
  title: "Legal & Credits",
  description: "Site owner, project attributions, institutional references and third-party credits for this portfolio.",
  path: "/legal",
});

const email = site.email ?? "";
const mail = (
  <a href={`mailto:${email}`} className="link-underline">
    {email}
  </a>
);

const sections: LegalSection[] = [
  {
    id: "owner",
    title: "Site owner",
    body: (
      <>
        <p>
          {site.formalName}, {site.location}. Contact: {mail}.
        </p>
        <p>
          This is a personal professional portfolio; nothing can be ordered or contracted through it. How visitor data is handled is
          described on the{" "}
          <Link href="/privacy" className="link-underline">
            Privacy
          </Link>{" "}
          page.
        </p>
      </>
    ),
  },
  {
    id: "content",
    title: "Content and rights",
    body: (
      <>
        <p>
          This portfolio includes my original work, collaborative projects and credited third-party or AI-generated material. Please
          contact me before reusing project materials: {mail}.
        </p>
        <p>
          Collaborative projects are presented with a description of my contribution. Rights in third-party contributions and materials
          remain with their respective rights holders.
        </p>
        <p>No confidential material from any employer is published here.</p>
      </>
    ),
  },
  {
    id: "projects",
    title: "Project status and attribution",
    body: (
      <ul>
        <li>
          <strong>ORTESIS STUDIO</strong>: independent experimental engineering prototype developed for learning and applied research. Not
          clinically validated or offered for clinical use. Nothing on this site constitutes medical advice. The application shown is
          private and not publicly available.
        </li>
        <li>
          <strong>Procedural City Generator</strong> and <strong>Parametric Drawer System</strong>: independent computational design
          projects built in Blender. The city generator was developed with AI-assisted coding (Claude Code).
        </li>
        <li>
          <strong>Bar Stool</strong>: university group project. My part was developing the side profile in CAD.
        </li>
        <li>
          <strong>MotoSpirit</strong>: motorcycle project of a student team at UPC ESEIAAT. My part was mechanical and structural design,
          mainly the chassis; other parts of the project were contributed by the wider team. The team logo is shown only to identify the
          project.
        </li>
        <li>
          <strong>Bicycle handlebar study</strong>: university project on handlebar cross-section sizing with CAD and finite element
          analysis.
        </li>
        <li>
          <strong>AED Monitoring</strong>: team product-development project at the University of Twente. I contributed to the mechanical
          design and CAD development of the device (enclosure, component integration and assembly). The image shown with it is
          AI-generated contextual imagery; it is not the project prototype, a tested device or evidence of implementation.
        </li>
      </ul>
    ),
  },
  {
    id: "institutions",
    title: "Institutions and employers",
    body: (
      <p>
        Universitat Politècnica de Catalunya (UPC, ESEIAAT), the University of Twente, Amazon RIVR and GUTMAR are named to describe my
        education and professional experience. Their names and logos belong to them. Naming them does not mean that they sponsor,
        endorse or are affiliated with this site or with my independent projects.
      </p>
    ),
  },
  {
    id: "third-party",
    title: "Third-party materials and licences",
    body: (
      <>
        <ul>
          <li>
            <strong>Geist</strong> and <strong>Geist Mono</strong> typefaces. Copyright 2024 The Geist Project Authors
            (github.com/vercel/geist-font). Licensed under the SIL Open Font License, Version 1.1; no Reserved Font Name is declared. The
            fonts are served from this site as WOFF2 files. Full licence text:{" "}
            <a href={withBase("/licenses/OFL-Geist.txt")} className="link-underline">
              OFL-Geist.txt
            </a>
            .
          </li>
          <li>
            <strong>Next.js</strong> (Copyright &copy; 2025 Vercel, Inc.) and <strong>React</strong> (Copyright &copy; Meta Platforms, Inc.
            and affiliates), used under the MIT licence. Licence text and notices:{" "}
            <a href={withBase("/licenses/THIRD-PARTY-NOTICES.txt")} className="link-underline">
              THIRD-PARTY-NOTICES.txt
            </a>
            .
          </li>
          <li>
            Product and software names (for example SolidWorks, CATIA, Blender, Creality, Arduino) are trademarks of their respective
            owners and are used only to say what I worked with.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "links",
    title: "Links and accuracy",
    body: (
      <>
        <p>
          The site links to external websites such as LinkedIn. I have no influence on their content or practices. I check links when I add
          or revise them; if you notice a link that is broken, inaccurate or unlawful, please tell me and I will review it.
        </p>
        <p>
          Content reflects my knowledge when it was written and may become outdated. If you spot an error or want something corrected or
          credited differently, write to {mail}.
        </p>
      </>
    ),
  },
];

export default function LegalPage() {
  return (
    <LegalDoc
      title="Legal & Credits"
      lead="Who runs this site, how the projects are attributed, and what belongs to others."
      updated="19 October 2026"
      sections={sections}
    />
  );
}
