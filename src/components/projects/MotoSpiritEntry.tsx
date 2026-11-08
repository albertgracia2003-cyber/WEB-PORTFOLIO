import { rich } from "@/lib/rich";
import { MediaFrame } from "@/components/media/MediaFrame";
import { getProject } from "@/content/projects";

/** Collaborative entry: official team logo, confirmed contribution, and where the team's work begins. */
export function MotoSpiritEntry() {
  const p = getProject("motospirit");
  const collab = p.authorship.kind === "collaborative" ? p.authorship : null;
  const d = p.detail;
  return (
    <article className="mx mx--moto" aria-labelledby="motospirit-title">
      <div className="moto__logo">
        <MediaFrame id={p.cover} fig="02.3" sizes="(min-width: 960px) 28vw, 80vw" reveal={false} showCaption={false} />
      </div>
      <div className="moto__body">
        <p className="label">{collab?.context ?? "University team project"}</p>
        <h3 id="motospirit-title" className="mx__title">
          {p.title}
        </h3>
        <p className="lead">{p.subtitle}</p>
        {d ? <p className="prose">{rich(d.intro)}</p> : null}
        {d ? (
          <p className="mx__note">
            {d.points[2]} {d.teamNote}
          </p>
        ) : null}
      </div>
    </article>
  );
}
