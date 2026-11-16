import type { Metadata } from "next";
import { Breadcrumbs, StatusBadge, TagList } from "@/components/ui/primitives";
import { MediaFrame } from "@/components/media/MediaFrame";
import { MediaZoom } from "@/components/media/MediaZoom";
import { NextProject } from "@/components/projects/CaseStudy";
import { ExplodedFigure } from "@/components/projects/ExplodedFigure";
import { getProject } from "@/content/projects";
import { limits, next, numbers, problem, video, wentWrong, whatIDid, works } from "@/content/tiri-case";
import { pageMetadata } from "@/lib/seo";
import { rd } from "@/lib/utils";

const project = getProject("tiri-insert");

export const metadata: Metadata = pageMetadata({
  title: "Three-Instrument Retention Insert",
  description:
    "A personal CAD and product-design project by Albert Gracia: a keyed, lift-out insert that holds three instruments under one latched bridge. A digital demonstrator, designed and checked on the CAD model.",
  path: "/work/tiri-insert",
});

/**
 * Figures of the "Details" grid, in reading order (Fig. 3 – 8). Albert asked for a hierarchy (15 Nov 2026): the two images ranked
 * priority A in his ASSETS.md (the push tab, the moulded insert) are shown large; the four priority B images keep their size.
 * `pos` names the place in the grid (tiri.css).
 */
const details = [
  { id: "tiri-push-tab", fig: "3", size: "lg", pos: "tab" },
  { id: "tiri-lift-fin", fig: "4", size: "sm", pos: "fin" },
  { id: "tiri-tool-lift", fig: "5", size: "sm", pos: "lift" },
  { id: "tiri-tilted", fig: "6", size: "sm", pos: "tilt" },
  { id: "tiri-moulded-shell", fig: "7", size: "lg", pos: "shell" },
  { id: "tiri-finger-room", fig: "8", size: "sm", pos: "room" },
] as const;

export default function TiriInsertPage() {
  return (
    <article className="tiri surface-base">
      {/* ---- Opening: the closed assembly, the name, one line on what it is and is not ---- */}
      <header className="tiri-hero">
        <div className="container">
          <div className="case-hero__top">
            <Breadcrumbs
              trail={[
                { label: "Portfolio", href: "/" },
                { label: "Mechanical & Product Design", href: "/#physical" },
                { label: "Three-Instrument Retention Insert" },
              ]}
            />
            <StatusBadge maturity={project.maturity} authorship={project.authorship} />
          </div>
        </div>
        <div className="container tiri-hero__stage">
          <MediaFrame id="tiri-hero" fig="1" priority reveal={false} sizes="(min-width: 960px) 58vw, 100vw" className="tiri-hero__photo" />
          <div className="tiri-hero__panel">
            <p className="label">CAD · Product design</p>
            <h1 className="tiri-hero__title">{project.title}</h1>
            <p className="tiri-hero__subtitle">{project.subtitle}</p>
            <TagList items={project.disciplines} label="Capabilities" />
          </div>
        </div>
      </header>

      {/* ---- The problem, and what Albert did ---- */}
      <section id="brief" className="tiri-sec tiri-brief" aria-labelledby="brief-title">
        <div className="container tiri-brief__grid">
          <div className="tiri-brief__problem" data-reveal>
            <p className="label">Brief</p>
            <h2 id="brief-title" className="tiri-h2">
              The problem
            </h2>
            <p className="prose">{problem}</p>
          </div>
          <aside className="tiri-did" data-reveal style={rd(100)} aria-label="What I did">
            <p className="label">What I did</p>
            <p>{whatIDid}</p>
          </aside>
        </div>
      </section>

      {/* ---- How it works: the video first, centred; then the numbered exploded view beside the six ideas ---- */}
      <section id="works" className="tiri-sec tiri-works" aria-labelledby="works-title">
        <div className="container">
          <header className="tiri-sec__head" data-reveal>
            <p className="label">The design</p>
            <h2 id="works-title" className="tiri-h2">
              How it works
            </h2>
          </header>

          <figure id="video" className="tiri-works__video" data-reveal>
            <MediaFrame id="tiri-use-simulation" sizes="(min-width: 1100px) 56rem, 100vw" showCaption={false} reveal={false} />
            <figcaption>
              <span className="label">
                {video.title} · {video.length}
              </span>
              <span>{video.caption}</span>
            </figcaption>
          </figure>

          <div className="tiri-works__grid">
            <ExplodedFigure fig="2" sizes="(min-width: 1100px) 40vw, 100vw" className="tiri-works__fig" />
            <ol className="tiri-works__list">
              {works.map((w, i) => (
                <li key={w.title} className="tiri-works__item" data-reveal style={rd(i * 60)}>
                  <span className="tiri-works__n" aria-hidden="true">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="tiri-works__title">{w.title}</h3>
                    <p>{w.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---- Details: the latch, the hand, the moulding ---- */}
      <section id="details" className="tiri-sec tiri-details" aria-labelledby="details-title">
        <div className="container">
          <header className="tiri-sec__head" data-reveal>
            <p className="label">Views from the model</p>
            <h2 id="details-title" className="tiri-h2">
              Latch, hand and moulding
            </h2>
          </header>
          <div className="tiri-grid">
            {details.map((d) => (
              <MediaZoom
                key={d.id}
                id={d.id}
                fig={d.fig}
                sizes={d.size === "lg" ? "(min-width: 900px) 64vw, 100vw" : "(min-width: 900px) 32vw, (min-width: 560px) 46vw, 100vw"}
                className={`tiri-grid__item tiri-grid__item--${d.size} tiri-grid__item--${d.pos}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ---- Checked on the model ---- */}
      <section id="checks" className="tiri-sec tiri-checks" aria-labelledby="checks-title">
        <div className="container tiri-checks__grid">
          <header className="tiri-checks__head" data-reveal>
            <p className="label">Model results, not measurements</p>
            <h2 id="checks-title" className="tiri-h2">
              Checked on the model
            </h2>
          </header>
          <dl className="tiri-numbers" data-reveal style={rd(60)}>
            {numbers.map((n) => (
              <div key={n.term} className="tiri-numbers__cell">
                <dt className="label">{n.term}</dt>
                <dd>
                  <span className="tiri-numbers__value">{n.value}</span>
                  {"note" in n ? <span className="tiri-numbers__note">{n.note}</span> : null}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---- What went wrong · limits · next ---- */}
      <section id="limits" className="tiri-sec tiri-limits surface-deep" aria-labelledby="limits-title">
        <div className="container">
          <h2 id="limits-title" className="visually-hidden">
            What went wrong, the limits and what comes next
          </h2>
          <div className="tiri-limits__grid">
            <div data-reveal>
              <p className="label">What went wrong on the way</p>
              <p>{wentWrong}</p>
            </div>
            <div data-reveal style={rd(80)}>
              <p className="label">Limits</p>
              <p>{limits}</p>
            </div>
            <div data-reveal style={rd(160)}>
              <p className="label">Next</p>
              <p>{next}</p>
            </div>
          </div>
        </div>
      </section>

      <NextProject current="tiri-insert" />
    </article>
  );
}
