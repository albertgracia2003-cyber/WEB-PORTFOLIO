import { MediaFrame } from "@/components/media/MediaFrame";
import { rich } from "@/lib/rich";
import { DevNote, TagList } from "@/components/ui/primitives";
import { getProject } from "@/content/projects";

/** Compact editorial panel for collaborative projects with explicit attribution. */
export function SupportingProject({ slug, fig }: { slug: string; fig: string }) {
  const p = getProject(slug);
  const collab = p.authorship.kind === "collaborative" ? p.authorship : null;
  return (
    <article className="support" aria-labelledby={`${slug}-title`} data-reveal>
      <div className="support__media">
        <MediaFrame id={p.cover} fig={fig} sizes="(min-width: 960px) 20vw, 50vw" reveal={false} />
      </div>
      <div className="support__body">
        <p className="label">{collab ? collab.context : "Personal project"}</p>
        <h3 id={`${slug}-title`} className="h3">
          {p.title}
        </h3>
        <p className="support__sub">{p.subtitle}</p>
        {p.detail ? (
          <div className="support__detail">
            <p>{rich(p.detail.intro)}</p>
            <p className="label">My part</p>
            <ul>
              {p.detail.points.map((pt) => (
                <li key={pt}>{rich(pt)}</li>
              ))}
            </ul>
            <p className="support__team">{p.detail.teamNote}</p>
          </div>
        ) : null}
        {collab?.contribution && !p.detail ? (
          <p className="support__contrib">
            <span className="label">My contribution</span>
            <span>{collab.contribution}</span>
          </p>
        ) : null}
        <TagList items={p.disciplines} label="Capabilities" />
        {collab && !collab.contribution ? (
          <DevNote title={`${p.title} attribution`}>
            Confirm Albert&apos;s specific contribution before publishing.
          </DevNote>
        ) : null}
      </div>
    </article>
  );
}
