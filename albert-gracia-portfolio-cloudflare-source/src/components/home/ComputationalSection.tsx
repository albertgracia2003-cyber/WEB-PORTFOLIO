import Link from "next/link";
import { rich } from "@/lib/rich";
import { MediaFrame } from "@/components/media/MediaFrame";
import { ArrowLink } from "@/components/ui/primitives";
import { getProject } from "@/content/projects";
import { homeComputational, showcase, supplied } from "@/content/showcase";
import { rd } from "@/lib/utils";

const scale: Record<string, string> = { "procedural-city": "Urban scale", "parametric-drawer": "Furniture scale" };

export function ComputationalSection() {
  return (
    <section id="computational" className="section surface-elevated comp atmos atmos--steel" aria-labelledby="comp-title">
      <div className="container">
        <header className="comp__head">
          <p className="label" data-reveal>
            <span className="accent">03</span> — Collection
          </p>
          <h2 id="comp-title" className="comp__title" data-reveal style={rd(60)}>
            Computational
            <br />
            Design
          </h2>
          <div className="comp__claim" data-reveal style={rd(140)}>
            <p>
              Rules in, geometry out — <span className="faint">at the scale of a city and of a drawer.</span>
            </p>
            <p className="comp__claim-body">
              {rich(
                "Two independent projects in **Blender Geometry Nodes**. The design work goes into **a procedural system**, not into modelling every variant by hand.",
              )}
            </p>
          </div>
        </header>

        <div className="comp__reel">
          {homeComputational.map((slug, i) => {
            const p = getProject(slug);
            const s = showcase[slug];
            return (
              <article key={slug} className={`comp-reel comp-reel--${i}`} aria-labelledby={`${slug}-reel-title`} data-reveal style={rd(i * 100)}>
                <MediaFrame id={s.home.main} sizes="(min-width: 1100px) 58vw, 100vw" showCaption={false} reveal={false} className="comp-reel__media" />
                <div className="comp-reel__body">
                  <p className="label">
                    {scale[slug]}
                  </p>
                  <h3 id={`${slug}-reel-title`} className="comp-reel__title">
                    <Link href={p.href!} className="comp-card__link">
                      {p.title}
                    </Link>
                  </h3>
                  {s.homeText.map((t) => (
                    <p key={t} className="comp-reel__text">
                      {rich(t)}
                    </p>
                  ))}
                  {supplied(s.home.support) ? (
                    <figure className="comp-reel__support">
                      <MediaFrame id={s.home.support} sizes="(min-width: 1100px) 24vw, 100vw" showCaption={false} reveal={false} />
                      <figcaption className="label">{s.home.supportLabel}</figcaption>
                    </figure>
                  ) : null}
                  <ArrowLink href={p.href!}>See the project</ArrowLink>
                </div>
              </article>
            );
          })}
        </div>

        <div className="comp__foot">
          <ArrowLink href="/computational-design">Explore the collection</ArrowLink>
        </div>
      </div>
    </section>
  );
}
