import type { Metadata } from "next";
import { rich } from "@/lib/rich";
import { CaseHero, NextProject } from "@/components/projects/CaseStudy";
import { ShowcaseIntro, ShowcaseSections } from "@/components/projects/Showcase";
import { MediaFrame } from "@/components/media/MediaFrame";
import { DevNote } from "@/components/ui/primitives";
import { getProject } from "@/content/projects";
import { showcase } from "@/content/showcase";
import { pageMetadata } from "@/lib/seo";

const project = getProject("parametric-drawer");
const show = showcase["parametric-drawer"];

export const metadata: Metadata = pageMetadata({
  title: "Parametric Drawer System",
  description:
    "A parametric system by Albert Gracia that generates drawer-divider layouts from drawer length, width, number of separators and geometric irregularity.",
  path: "/computational-design/parametric-drawer",
});

export default function ParametricDrawerPage() {
  return (
    <article className="case showcase surface-base">
      <CaseHero
        project={project}
        trail={[
          { label: "Portfolio", href: "/" },
          { label: "Computational Design", href: "/#computational" },
          { label: "Parametric Drawer" },
        ]}
        intro={
          <p>
            Four inputs — <strong>length</strong>, <strong>width</strong>, <strong>number of separators</strong> and{" "}
            <strong>irregularity</strong> — and the system generates the dividers as independent elements.
          </p>
        }
        meta={[
          { term: "Type", value: "Personal project" },
          { term: "Built with", value: "Blender Geometry Nodes" },
          { term: "Output", value: "Independent divider elements" },
        ]}
      >
        <MediaFrame id={show.feature} fig="0.1" priority sizes="(min-width: 1520px) 1520px, 100vw" reveal={false} />
      </CaseHero>

      <div className="container showcase__body">
        <ShowcaseIntro paragraphs={show.intro} capabilities={project.disciplines} />
        <ShowcaseSections sections={show.sections} />
        <p className="showcase__footnote">{rich(show.footnote)}</p>
        <DevNote title="Footage still to come">
          A Geometry Nodes recording (<code>drawer-nodes-recording</code>) or screenshot (<code>drawer-nodes</code>) for
          “Behind the system”, and any further clips — add them in <code>src/content/showcase.ts</code>.
        </DevNote>
      </div>

      <NextProject current="parametric-drawer" />
    </article>
  );
}
