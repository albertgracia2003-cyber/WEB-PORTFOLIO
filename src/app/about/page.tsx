import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLink, Breadcrumbs, DevNote, TagList } from "@/components/ui/primitives";
import { rich } from "@/lib/rich";
import { MediaFrame } from "@/components/media/MediaFrame";
import { approach, education, experience, experienceConnection, intro, professionalCapabilities, statement, tools } from "@/content/profile";
import { Portrait } from "@/components/home/Portrait";
import { getProject } from "@/content/projects";
import { isPending } from "@/content/media";
import { supplied } from "@/content/showcase";
import { showDevNotes } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { pad, rd } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Albert Gracia — engineering and product development in Zürich. Background in Industrial Design Engineering and Product Development (UPC), experience in robotics hardware and aerospace-related manufacturing.",
  path: "/about",
});

export default function AboutPage() {
  const showPortrait = !isPending("profile-portrait") || showDevNotes;
  return (
    <div className="about surface-base">
      <header className="about__hero">
        <div className="container">
          <Breadcrumbs trail={[{ label: "Portfolio", href: "/" }, { label: "About" }]} />
          <h1 className="about__title">About</h1>
          <div className="about__intro-grid">
            <p className="about__statement" data-reveal>
              {rich(statement)}
            </p>
            {showPortrait ? <Portrait className="about__portrait" priority /> : null}
            <div className="prose about__intro" data-reveal style={rd(100)}>
              {intro.map((p) => (
                <p key={p.slice(0, 24)}>{rich(p)}</p>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section className="section about__block" aria-labelledby="approach-title">
        <div className="container">
          <div className="about__block-head">
            <p className="label">01</p>
            <h2 id="approach-title" className="h2">
              Engineering <span className="light">approach</span>
            </h2>
          </div>
          <ol className="approach">
            {approach.map((a, i) => (
              <li key={a.title} className="approach__item" data-reveal style={rd(i * 80)}>
                <span className="mono faint">{pad(i + 1)}</span>
                <h3 className="h3">{a.title}</h3>
                <p>{rich(a.body)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section surface-deep about__block" aria-labelledby="exp-title">
        <div className="container">
          <div className="about__block-head">
            <p className="label">02</p>
            <h2 id="exp-title" className="h2">
              Experience
            </h2>
          </div>
          <ol className="exp-list">
            {experience.map((e) => (
              <li key={e.organisation} className="exp-item" data-reveal>
                <div className="exp-item__head">
                  <h3 className="exp-item__org">{e.organisation}</h3>
                  <p className="label">
                    {e.location}
                    {e.period ? ` · ${e.period}` : ""}
                  </p>
                  {e.title ? <p className="exp-item__title">{e.title}</p> : null}
                </div>
                <div className="exp-item__body">
                  <p className="exp-item__summary">{rich(e.summary)}</p>
                  <dl className="exp-item__contrib">
                    {e.contributions.map((c) => (
                      <div key={c.title}>
                        <dt>{c.title}</dt>
                        <dd>{c.body}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </li>
            ))}
          </ol>
          <p className="exp-connection">{rich(experienceConnection)}</p>
          <p className="exp-note">
            Professional work is described at a general level. Employer projects, data and imagery are confidential and
            not shown on this site.
          </p>
          <DevNote title="Experience">
            Role titles and periods are not shown until confirmed — add them as <code>title</code> / <code>period</code> in{" "}
            <code>src/content/profile.ts</code>.
          </DevNote>
        </div>
      </section>

      <section className="section about__block" aria-labelledby="edu-title">
        <div className="container about__two">
          <div>
            <div className="about__block-head">
              <p className="label">03</p>
              <h2 id="edu-title" className="h2">
                Education
              </h2>
            </div>
            <ul className="cv-list">
              {education.map((e) => (
                <li key={e.institution} className="cv-list__row">
                  {supplied(e.logo) ? (
                    <span className="cv-list__logo">
                      <MediaFrame id={e.logo} showCaption={false} reveal={false} sizes="64px" />
                    </span>
                  ) : null}
                  <span className="cv-list__org">{e.institution}</span>
                  <span className="cv-list__what">{e.qualification}</span>
                  <span className="cv-list__where label">{e.detail}</span>
                  {e.thesis ? (
                    <div className="thesis">
                      <p className="label thesis__label">Thesis subject</p>
                      <h3 className="thesis__subject">{e.thesis.subject}</h3>
                      <p className="thesis__sub">{e.thesis.subtitle}</p>
                      <p className="thesis__text">{rich(e.thesis.description)}</p>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
            {education.some((e) => e.logo && !supplied(e.logo)) ? (
              <DevNote title="UPC logo">
                Add the official UPC logo file (slot <code>upc-logo</code> in <code>src/content/media.ts</code>) and it
                appears beside the degree.
              </DevNote>
            ) : null}
          </div>
          <div>
            <div className="about__block-head">
              <p className="label">04</p>
              <h2 className="h2">Independent work</h2>
            </div>
            <p className="prose cap-intro">
              Projects beyond employment: CAD and mechanical design, with computational design, software and experimental
              prototyping alongside. What each one involves:
            </p>
            <ul className="cap-map">
              {(["ortesis-studio", "procedural-city", "parametric-drawer", "chair-design"] as const).map((slug) => {
                const p = getProject(slug);
                return (
                  <li key={slug} className="cap-map__row">
                    <Link href={p.href!} className="cap-map__project">
                      {p.title}
                    </Link>
                    <span className="cap-map__items">{p.disciplines.join(" · ")}</span>
                  </li>
                );
              })}
            </ul>
            <p className="label cap-sub">University projects</p>
            <ul className="cap-map">
              {(["handlebar", "motospirit", "aed-monitoring"] as const).map((slug) => {
                const p = getProject(slug);
                return (
                  <li key={slug} className="cap-map__row">
                    <span className="cap-map__project">{p.title}</span>
                    <span className="cap-map__items">
                      {p.short ?? p.subtitle} {p.authorship.kind === "collaborative" ? `(${p.authorship.context})` : ""}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="label cap-sub">Main tools</p>
            <p className="cap-tools">{tools.join(" · ")} — and, in professional work, {professionalCapabilities.map((c) => (/^[A-Z0-9]{2,}/.test(c) ? c : c.charAt(0).toLowerCase() + c.slice(1))).join(", ")}.</p>
          </div>
        </div>
      </section>

      <section className="section surface-deep about__cta atmos" aria-label="Next">
        <div className="container about__cta-inner">
          <ArrowLink href="/#work" variant="line">
            See the work
          </ArrowLink>
          <ArrowLink href="/contact" variant="solid">
            Get in touch
          </ArrowLink>
        </div>
      </section>
    </div>
  );
}
