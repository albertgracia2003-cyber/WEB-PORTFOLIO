import type { Metadata } from "next";
import { rich } from "@/lib/rich";
import { Breadcrumbs, DevNote, StatusBadge, TagList } from "@/components/ui/primitives";
import { MediaFrame } from "@/components/media/MediaFrame";
import { MediaZoom } from "@/components/media/MediaZoom";
import { MediaGallery } from "@/components/media/MediaGallery";
import { NextProject } from "@/components/projects/CaseStudy";
import { SupportingProject } from "@/components/projects/SupportingProject";
import { getProject } from "@/content/projects";
import { chairGallery, supplied } from "@/content/showcase";
import { pageMetadata } from "@/lib/seo";

const project = getProject("chair-design");

export const metadata: Metadata = pageMetadata({
  title: "Bar Stool",
  description:
    "A wooden bar stool by Albert Gracia with a flexible backrest and a demountable structure, built as a full-scale prototype.",
  path: "/work/chair-design",
});

export default function ChairPage() {
  const views = chairGallery.filter(supplied);
  return (
    <article className="chair surface-base">
      <header className="chair__hero">
        <div className="container">
          <div className="case-hero__top">
            <Breadcrumbs trail={[{ label: "Portfolio", href: "/" }, { label: "Mechanical & Product Design", href: "/#physical" }, { label: "Bar Stool" }]} />
            <StatusBadge maturity={project.maturity} authorship={project.authorship} />
          </div>
        </div>
        <div className="container chair__stage">
          <MediaFrame id="chair-hero" fig="1.0" priority reveal={false} sizes="(min-width: 960px) 46vw, 100vw" className="chair__photo" />
          <div className="chair__panel">
            <p className="label">Product design · Chair</p>
            <h1 className="chair__title">Bar Stool</h1>
            <p className="chair__subtitle">{project.subtitle}</p>
            <p className="prose">{rich(project.summary)}</p>
            <dl className="chair__facts">
              <div>
                <dt className="label">Prototype</dt>
                <dd>Full scale, 1:1</dd>
              </div>
              <div>
                <dt className="label">Material</dt>
                <dd>Wood</dd>
              </div>
              <div>
                <dt className="label">Structure</dt>
                <dd>Demountable</dd>
              </div>
            </dl>
            <TagList items={project.disciplines} label="Capabilities" />
          </div>
        </div>
      </header>

      <section className="section chair__dev" aria-labelledby="chair-dev-title">
        <div className="container chair__dev-grid">
          <div className="chair__dev-text">
            <p className="label">Design development</p>
            <h2 id="chair-dev-title" className="h2">
              Three boards, set by their angles.
            </h2>
            <p className="prose">The side profile was worked out in CAD before building the prototype.</p>
          </div>
          <MediaZoom id="chair-cad-sketch" fig="2.1" sizes="(min-width: 960px) 30vw, 80vw" className="chair__sketch" />
        </div>
      </section>

      {views.length ? (
        <section className="chair__views" aria-labelledby="chair-views-title">
          <div className="container">
            <h2 id="chair-views-title" className="label chair__views-title">
              Views &amp; details
            </h2>
            <MediaGallery label="Bar stool photographs" figPrefix="3" items={views.map((id) => ({ id }))} />
          </div>
        </section>
      ) : null}
      <div className="container">
        <DevNote title="More photographs">
          Further angles and close-ups go in the slots <code>chair-view-01/02</code> and <code>chair-detail-01/02</code>{" "}
          (see <code>src/content/showcase.ts</code>); the gallery appears once one exists.
        </DevNote>
      </div>

      <section className="section surface-deep chair__more" aria-labelledby="more-title">
        <div className="container">
          <h2 id="more-title" className="label chair__views-title">
            Team projects at university
          </h2>
          <div className="physical__supporting-grid">
            <SupportingProject slug="motospirit" fig="4.1" />
            <SupportingProject slug="aed-monitoring" fig="4.2" />
          </div>
        </div>
      </section>

      <NextProject current="chair-design" />
    </article>
  );
}
