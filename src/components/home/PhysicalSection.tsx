import Link from "next/link";
import { MediaFrame } from "@/components/media/MediaFrame";
import { ArrowLink, SectionHeading } from "@/components/ui/primitives";
import { HandlebarStudy } from "@/components/projects/HandlebarStudy";
import { MotoSpiritEntry } from "@/components/projects/MotoSpiritEntry";
import { AedEntry } from "@/components/projects/AedEntry";
import { getProject } from "@/content/projects";

export function PhysicalSection() {
  const chair = getProject("chair-design");
  return (
    <section id="physical" className="section surface-base physical atmos atmos--ember atmos--quiet" aria-labelledby="physical-title">
      <div className="container">
        <SectionHeading
          id="physical-title"
          index="02"
          kicker="Mechanical & Product Design"
          title={
            <>
              Where geometry
              <br />
              <span className="light">becomes tangible.</span>
            </>
          }
        />

        <div className="mx-list">
          <HandlebarStudy />
          <MotoSpiritEntry />

          <article className="mx mx--chair" aria-labelledby="chair-card-title">
            <Link href={chair.href!} className="mchair__photo" tabIndex={-1} aria-hidden="true">
              <MediaFrame id="chair-hero" fig="02.4" sizes="(min-width: 960px) 40vw, 100vw" showCaption={false} />
            </Link>
            <div className="mchair__body">
              <p className="label">University group project</p>
              <h3 id="chair-card-title" className="mx__title mx__title--xl">
                <Link href={chair.href!} className="comp-card__link">
                  {chair.title}
                </Link>
              </h3>
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

          <AedEntry />
        </div>
      </div>
    </section>
  );
}
