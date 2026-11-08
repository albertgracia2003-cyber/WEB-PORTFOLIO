import { rich } from "@/lib/rich";
import { MediaZoom } from "@/components/media/MediaZoom";
import { getProject } from "@/content/projects";

/**
 * Academic CAD / FEA study (section 02). Only what the supplied images establish is stated:
 * a handlebar with stem clamp, a mesh on one end of the bar, and an FEA colour map without a scale.
 * No loads, materials, dimensions, numerical results or individual contribution are claimed.
 * Reading order: introduction → CAD model (primary, left ~62%) → finite element study (supporting, right ~38%). Native aspect ratios, no cropping.
 */
const columns = [
  {
    id: "handlebar-render",
    fig: "02.1",
    title: "CAD model",
    text: "The handlebar and its **stem clamp**, modelled in 3D. The finite element mesh is applied to one end of the bar.",
  },
  {
    id: "handlebar-fea",
    fig: "02.2",
    title: "Finite element study",
    text: "The same geometry analysed with **finite elements**, the result mapped across bar and clamp. No colour scale is included, so no values are quoted.",
  },
] as const;

export function HandlebarStudy() {
  const p = getProject("handlebar");
  const context = p.authorship.kind === "collaborative" ? p.authorship.context : "University project";
  return (
    <article className="mx mx--hb" aria-labelledby="handlebar-title">
      <header className="hb__intro">
        <p className="label">{context}</p>
        <h3 id="handlebar-title" className="hb__title">
          Bicycle Handlebar
          <span className="hb__title-sub">CAD &amp; Structural Study</span>
        </h3>
        <p className="lead">
          A university project asking what cross-section a bicycle handlebar needs,
          explored through CAD modelling and{" "}
          <strong className="em em--accent">finite element analysis</strong>.
        </p>
      </header>

      <div className="hb__cols">
        {columns.map((c) => (
          <figure key={c.id} className="hb__col">
            <MediaZoom id={c.id} fig={c.fig} showCaption={false} sizes={c.id === "handlebar-render" ? "(min-width: 900px) 620px, 100vw" : "(min-width: 900px) 380px, 100vw"} />
            <figcaption className="hb__cap">
              <h4 className="hb__cap-title">{c.title}</h4>
              <p>{rich(c.text)}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="hb__foot">
        <p className="mx__note">Shown at that scale: loads, materials and final dimensions are not described.</p>
      </div>
    </article>
  );
}
