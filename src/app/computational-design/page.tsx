import type { Metadata } from "next";
import { rich } from "@/lib/rich";
import Link from "next/link";
import { MediaFrame } from "@/components/media/MediaFrame";
import { showcase } from "@/content/showcase";
import { ArrowLink, Breadcrumbs, TagList } from "@/components/ui/primitives";
import { getProject, projectsByCategory } from "@/content/projects";
import { pageMetadata } from "@/lib/seo";
import { cn, pad, rd } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Computational Design",
  description:
    "Procedural modelling and parameter-driven design by Albert Gracia: systems that generate geometry, from urban layouts to drawer dividers.",
  path: "/computational-design",
});

/** Input → output summary per project. Add an entry when a new computational project is published. */
const systemSheet: Record<string, { scale: string; input: string; output: string }> = {
  "procedural-city": {
    scale: "Urban",
    input: "Planar layout and its subdivisions",
    output: "Roads and building blocks",
  },
  "parametric-drawer": {
    scale: "Furniture",
    input: "Length, width, separators, irregularity",
    output: "Independent divider elements",
  },
};

export default function ComputationalDesignPage() {
  const projects = projectsByCategory("computational");
  const ortesis = getProject("ortesis-studio");

  return (
    <div className="surface-base collection">
      <div className="collection__light" aria-hidden="true" />
      <header className="collection__hero">
        <div className="container">
          <Breadcrumbs trail={[{ label: "Portfolio", href: "/" }, { label: "Computational Design" }]} />
          <h1 className="collection__title">
            Computational
            <br />
            Design
          </h1>
          <div className="collection__intro">
            <p className="collection__positioning" data-reveal>
              From individual geometries <span className="faint">to systems that generate them.</span>
            </p>
            <div className="prose" data-reveal style={rd(100)}>
              <p>The design effort goes into {rich("**rules**, so the geometry can be **generated, varied and regenerated**.")}</p>
            </div>
          </div>
          <p className="label collection__count">
            {pad(projects.length)} projects · Blender Geometry Nodes
          </p>
        </div>
      </header>

      <section className="section collection__list" aria-label="Projects">
        <div className="container">
          <ol className="collection-items">
            {projects.map((p, i) => {
              const sheet = systemSheet[p.slug];
              return (
                <li key={p.slug} className={cn("collection-item", i % 2 === 1 && "collection-item--flip")}>
                  <div className="collection-item__media">
                    <MediaFrame
                      id={p.slug in showcase ? showcase[p.slug as keyof typeof showcase].home.main : p.cover}
                      fig={`${i + 1}.0`}
                      showCaption={false}
                      sizes="(min-width: 960px) 58vw, 100vw"
                    />
                  </div>
                  <div className="collection-item__body">
                    <p className="label">
                      <span className="accent">{String.fromCharCode(65 + i)}</span> — {sheet?.scale ?? "Project"} scale
                    </p>
                    <h2 className="h1 collection-item__title">
                      <Link href={p.href!} className="comp-card__link">
                        {p.title}
                      </Link>
                    </h2>
                    <p className="lead">{p.subtitle}</p>
                    {p.slug in showcase ? <p className="prose">{rich(showcase[p.slug as keyof typeof showcase].homeText[0])}</p> : null}
                    {sheet ? (
                      <dl className="io-sheet">
                        <div>
                          <dt className="label">Input</dt>
                          <dd>{sheet.input}</dd>
                        </div>
                        <div className="io-sheet__arrow" aria-hidden="true">
                          →
                        </div>
                        <div>
                          <dt className="label">Output</dt>
                          <dd>{sheet.output}</dd>
                        </div>
                      </dl>
                    ) : null}
                    <TagList items={p.disciplines} label="Capabilities" />
                    <ArrowLink href={p.href!}>See the project</ArrowLink>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="collection__related surface-deep" aria-labelledby="related-title">
        <div className="container collection__related-inner">
          <p className="label">Applied</p>
          <h2 id="related-title" className="h2">
            The same approach, <span className="light">applied to a physical product.</span>
          </h2>
          <p className="prose">
            {rich(
              "ORTESIS STUDIO began as a **Geometry Nodes workflow** and grew into an **application** that generates orthosis geometry from an anatomical scan — one part of a larger engineering system.",
            )}
          </p>
          <ArrowLink href={ortesis.href!} variant="solid">
            ORTESIS STUDIO
          </ArrowLink>
        </div>
      </section>
    </div>
  );
}
