import Link from "next/link";
import { MediaFrame } from "@/components/media/MediaFrame";
import { ArrowLink } from "@/components/ui/primitives";
import { getProject } from "@/content/projects";
import { rd } from "@/lib/utils";

/** Bar Stool: the closing project of Mechanical & Product Design, placed after Computational Design. */
export function ChairSection() {
  const chair = getProject("chair-design");
  return (
    <section id="chair" className="section surface-base chair-home atmos atmos--ember atmos--quiet" aria-labelledby="chair-card-title">
      <div className="container">
        <p className="label chair-home__kicker" data-reveal>
          <span className="accent">02</span> — Mechanical &amp; Product Design · Closing project
        </p>
        <article className="chair-home__grid">
          <Link href={chair.href!} className="chair-home__photo" tabIndex={-1} aria-hidden="true" data-reveal>
            <MediaFrame id="chair-hero" fig="02.4" sizes="(min-width: 960px) 58vw, 100vw" showCaption={false} reveal={false} />
          </Link>
          <div className="chair-home__body" data-reveal style={rd(100)}>
            <p className="label">University group project</p>
            <h2 id="chair-card-title" className="chair-home__title">
              <Link href={chair.href!} className="comp-card__link">
                {chair.title}
              </Link>
            </h2>
            <p className="lead">{chair.subtitle}</p>
            <p className="prose">
              Built from flat wooden boards. The side profile was developed in CAD and the stool built as a{" "}
              full-scale (1:1) prototype.
            </p>
            <figure className="mchair__sketch">
              <MediaFrame id="chair-cad-sketch" fig="02.4b" sizes="14rem" reveal={false} />
            </figure>
            <ArrowLink href={chair.href!}>View the project</ArrowLink>
          </div>
        </article>
      </div>
    </section>
  );
}
