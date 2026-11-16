import Link from "next/link";
import { MediaFrame } from "@/components/media/MediaFrame";
import { ArrowLink } from "@/components/ui/primitives";
import { getProject } from "@/content/projects";
import { rd } from "@/lib/utils";

/** Bar Stool: third entry of section 04 (University projects), after MotoSpirit and AED Monitoring. Keeps its own open layout, no card. */
export function ChairEntry() {
  const chair = getProject("chair-design");
  return (
    <article id="chair" className="chair-home__grid" aria-labelledby="chair-card-title">
      <Link href={chair.href!} className="chair-home__photo" tabIndex={-1} aria-hidden="true" data-reveal>
        <MediaFrame id="chair-hero" fig="04.3" sizes="(min-width: 960px) 58vw, 100vw" showCaption={false} reveal={false} />
      </Link>
      <div className="chair-home__body" data-reveal style={rd(100)}>
        <div className="chair-home__text">
          <p className="label">University group project</p>
          <h3 id="chair-card-title" className="chair-home__title">
            <Link href={chair.href!} className="comp-card__link">
              {chair.title}
            </Link>
          </h3>
          <p className="lead">{chair.subtitle}</p>
          <p className="prose">
            Built from flat wooden boards. The side profile was developed in CAD and the stool built as a{" "}
            full-scale (1:1) prototype.
          </p>
        </div>
        <div className="chair-home__more">
          <figure className="mchair__sketch">
            <MediaFrame id="chair-cad-sketch" fig="04.3b" sizes="14rem" reveal={false} />
          </figure>
          <ArrowLink href={chair.href!}>View the project</ArrowLink>
        </div>
      </div>
    </article>
  );
}
