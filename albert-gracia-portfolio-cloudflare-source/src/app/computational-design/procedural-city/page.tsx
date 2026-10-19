import type { Metadata } from "next";
import { rich } from "@/lib/rich";
import { CaseHero, NextProject } from "@/components/projects/CaseStudy";
import { ShowcaseIntro, ShowcaseSections } from "@/components/projects/Showcase";
import { MediaFrame } from "@/components/media/MediaFrame";
import { DevNote } from "@/components/ui/primitives";
import { getProject } from "@/content/projects";
import { showcase } from "@/content/showcase";
import { pageMetadata } from "@/lib/seo";

const project = getProject("procedural-city");
const show = showcase["procedural-city"];

export const metadata: Metadata = pageMetadata({
  title: "Procedural City Generator",
  description:
    "A procedural city generator by Albert Gracia, built with Blender Geometry Nodes: an input plane and its subdivisions define the layout from which roads and buildings are generated.",
  path: "/computational-design/procedural-city",
});

export default function ProceduralCityPage() {
  return (
    <article className="case showcase surface-base">
      <CaseHero
        project={project}
        trail={[
          { label: "Portfolio", href: "/" },
          { label: "Computational Design", href: "/#computational" },
          { label: "Procedural City" },
        ]}
        intro={
          <p>
            An independent procedural modelling experiment in Blender Geometry Nodes: an input plane and its subdivisions
            define the layout, and roads and buildings are generated from it.
          </p>
        }
        meta={[
          { term: "Type", value: "Personal project" },
          { term: "Built with", value: "Blender Geometry Nodes" },
          { term: "Development", value: "AI-assisted coding (Claude Code)" },
        ]}
      >
        <MediaFrame id={show.feature} fig="0.1" priority sizes="(min-width: 1520px) 1520px, 100vw" reveal={false} />
      </CaseHero>

      <div className="container showcase__body">
        <ShowcaseIntro paragraphs={show.intro} capabilities={project.disciplines} />
        <ShowcaseSections sections={show.sections} />
        <p className="showcase__footnote">{rich(show.footnote)}</p>
        <DevNote title="Footage still to come">
          Night aerial render (<code>city-aerial-night</code> — with the daylight one it becomes a Day / Night selector),
          Geometry Nodes recording (<code>city-nodes-recording</code>) or screenshot, and clips of the steps (input plane,
          subdivisions, buildings). Slots are listed in <code>src/content/showcase.ts</code> and appear once the files exist.
        </DevNote>
      </div>

      <NextProject current="procedural-city" />
    </article>
  );
}
