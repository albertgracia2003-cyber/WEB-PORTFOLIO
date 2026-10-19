import { MediaFrame } from "@/components/media/MediaFrame";
import { DevNote } from "@/components/ui/primitives";
import { getProject } from "@/content/projects";

/** Compact collaborative product-development entry. */
export function AedEntry() {
  const p = getProject("aed-monitoring");
  const collab = p.authorship.kind === "collaborative" ? p.authorship : null;
  return (
    <article className="mx mx--aed" aria-labelledby="aed-title">
      <div className="aed__media">
        <MediaFrame id={p.cover} fig="02.5" sizes="(min-width: 960px) 28vw, 100vw" reveal={false} />
      </div>
      <div className="aed__body">
        <p className="label">{collab?.context ?? "University team project"}</p>
        <h3 id="aed-title" className="mx__title mx__title--sm">
          {p.title}
        </h3>
        <p className="lead">{p.subtitle}</p>
        {collab?.contribution ? (
          <p className="prose">
            <strong className="em">My contribution:</strong> {collab.contribution}
          </p>
        ) : null}
        {collab && !collab.contribution ? (
          <DevNote title={`${p.title} attribution`}>Confirm Albert&apos;s specific contribution before publishing.</DevNote>
        ) : null}
      </div>
    </article>
  );
}
