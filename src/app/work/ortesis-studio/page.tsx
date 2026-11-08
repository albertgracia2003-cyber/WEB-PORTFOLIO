import type { Metadata } from "next";
import Link from "next/link";
import { rich } from "@/lib/rich";
import { Disclosure, NextProject } from "@/components/projects/CaseStudy";
import { MediaFrame } from "@/components/media/MediaFrame";
import { MediaZoom } from "@/components/media/MediaZoom";
import { AnnotatedFigure, type Pin } from "@/components/media/AnnotatedFigure";
import { OrtesisModelStack } from "@/components/graphics/OrtesisModelStack";
import { OrthosisViewer } from "@/components/graphics/OrthosisViewer";
import { rigCad } from "@/content/ortesis-models";
import { getProject } from "@/content/projects";
import { getMedia, isPending } from "@/content/media";
import {
  app,
  build,
  decisions,
  demonstrated,
  drives,
  hardwareNext,
  intro,
  moves,
  motionTestLabel,
  nextQuestions,
  softwareNext,
  stillOpen,
  type DesignDecision,
  type PartLabel,
} from "@/content/ortesis-case";
import { pageMetadata } from "@/lib/seo";
import { rd } from "@/lib/utils";

const project = getProject("ortesis-studio");

export const metadata: Metadata = pageMetadata({
  title: "ORTESIS STUDIO",
  description:
    "An independent experimental engineering prototype by Albert Gracia: a motorised 3D scanning rig, a Blender-based geometry workflow and a private application that generate personalised forearm orthosis geometry for 3D printing. Not clinically validated.",
  path: "/work/ortesis-studio",
});

const engineSteps = ["Decimate", "Wireframe", "Subdivision Surface", "Smooth by Angle"] as const;
const pipeline = ["Custom interface + Three.js viewer", "Local Python layer", "Headless Blender", "Generated geometry / STL"] as const;

const partPins = (labels: readonly PartLabel[]): Pin[] =>
  labels.map((l) => ({ n: l.text, label: l.text, x: l.x, y: l.y, side: l.side, dot: true }));

/** The decision paragraphs Albert has supplied for a drive; none renders until he does. */
const decisionLines = (d: DesignDecision): [string, string][] => {
  const rows: [string, string | undefined][] = [
    ["Why this solution", d.reason],
    ["What it makes harder", d.tradeoff],
    ["Alternative considered", d.alternative],
  ];
  return rows.flatMap(([k, t]) => (t ? [[k, t] as [string, string]] : []));
};

const animationShown = !isPending("ortesis-rig-animation");
const animationCaption = getMedia("ortesis-rig-animation").caption;
const motionShown = !isPending("ortesis-motion-demo");
const [first] = drives;

/** Albert's own words on a design decision for a drive; nothing renders until he supplies them. */
function DriveWhy({ drive }: { drive: (typeof drives)[number] }) {
  const lines = decisionLines(decisions[drive.key]);
  if (!lines.length) return null;
  return (
    <div className="drive__why">
      {lines.map(([k, t]) => (
        <p key={k}>
          <span className="label">{k}</span> {t}
        </p>
      ))}
    </div>
  );
}

/** A close-up of one drive. `caption` puts the sentence that says what the mechanism does as a whole under the photograph. */
function DriveFigure({ drive, className, priority, caption = true }: { drive: (typeof drives)[number]; className?: string; priority?: boolean; caption?: boolean }) {
  return (
    <figure className={className ? `drive ${className}` : "drive"} data-reveal>
      <MediaFrame id={drive.media} aspect="4 / 3" position={drive.position} priority={priority} sizes="(min-width: 960px) 45vw, 100vw" showCaption={false} reveal={false} />
      {caption ? <figcaption className="drive__cap">{drive.caption}</figcaption> : null}
    </figure>
  );
}

export default function OrtesisStudioPage() {
  return (
    <article className="case case--flagship case--ortesis surface-base">
      {/* ---- What the project is: the project, the machine and the printed part ---- */}
      <header id="glance" className="glance">
        <div className="case-hero__light" aria-hidden="true" />
        <div className="container glance__grid">
          <div className="glance__text">
            <Link href="/#work" className="glance__back link-underline" aria-label="Back to the portfolio">
              <span aria-hidden="true">←</span> Portfolio
            </Link>
            <h1 className="glance__title">{project.title}</h1>
            <p className="glance__lead">{intro.lead}</p>
            <p className="glance__body">{intro.body}</p>
            <p className="glance__role">{intro.role}</p>
          </div>

          <figure className="glance__photo">
            <div className="glance__stage">
              <MediaFrame id="ortesis-hero" priority sizes="(min-width: 1100px) 60vw, 100vw" showCaption={false} reveal={false} />
            </div>
            <figcaption>
              <span>{intro.photoCaption}</span>
            </figcaption>
          </figure>
        </div>
      </header>

      {/* ---- The machine: how it moves, then how it was built ---- */}
      <div className="block block--rig surface-base">
        <div className="container">
          <section id="rig" className="part" aria-labelledby="rig-title">
            <div className="moves">
              <h2 id="rig-title" className="part__title moves__title" data-reveal>
                How it moves
              </h2>
              <DriveFigure drive={first} className="moves__media" priority />
              <div className="moves__text" data-reveal style={rd(120)}>
                <p className="moves__lead">{moves.lead}</p>
                <p className="moves__body">{moves.body}</p>
                <DriveWhy drive={first} />
              </div>
              {animationShown || motionShown ? (
                <div className="moves__clips" style={{ "--n": Number(animationShown) + Number(motionShown) } as React.CSSProperties}>
                  {animationShown ? (
                    <figure className="moves__clip" data-reveal style={rd(180)}>
                      <MediaFrame id="ortesis-rig-animation" sizes="(min-width: 1100px) 38rem, 100vw" showCaption={false} reveal={false} />
                      <figcaption className="moves__clip-cap">{animationCaption}</figcaption>
                    </figure>
                  ) : null}
                  {motionShown ? (
                    <figure className="moves__clip" data-reveal style={rd(240)}>
                      <MediaFrame id="ortesis-motion-demo" sizes="(min-width: 1100px) 38rem, 100vw" showCaption={false} reveal={false} />
                      <figcaption className="moves__clip-cap">{motionTestLabel}</figcaption>
                    </figure>
                  ) : null}
                </div>
              ) : null}
            </div>
          </section>

          <section id="build" className="part part--build" aria-labelledby="build-title">
            <div className="build__side">
              <div className="build__text" data-reveal>
                <h2 id="build-title" className="part__title">
                  How it was built
                </h2>
                <p className="build__lead">{build.lead}</p>
                <p className="build__body">{build.body}</p>
              </div>
              <figure className="build__photo" data-reveal style={rd(120)}>
                <MediaZoom id="ortesis-rig-built" className="build__zoom" showCaption={false} sizes="(min-width: 960px) 12rem, 40vw" hint="Enlarge" />
                <figcaption>{build.photoCaption}</figcaption>
              </figure>
            </div>
            <OrthosisViewer
              variant="inspect"
              className="build__viewer"
              model={rigCad}
              material="satin"
              home={build.views[0]}
              views={build.views}
              subject={build.viewerSubject}
              fallback={build.viewerFallback}
              minimal
              scrollZoom
              crease={22}
            />
          </section>
        </div>
      </div>

      {/* ---- From scan file to printed part ---- */}
      <div className="block block--print surface-deep">
        <div className="container">
          <section id="print" className="part" aria-labelledby="print-title">
            <h2 id="print-title" className="part__title" data-reveal>
              From scan file to printed part
            </h2>

            <div className="app-intro" id="application">
              <div className="app-intro__main" data-reveal>
                <p className="app-intro__lead">{app.lead}</p>
                <p className="app-intro__body">{app.body}</p>
              </div>
              <p className="app-intro__note" data-reveal style={rd(90)}>
                {app.note}
              </p>
            </div>

            <ol className="walk" aria-label="What the application does, in order">
              {app.steps.map((s, i) => (
                <li key={s.n} className="walk__step" data-reveal style={rd((i % 2) * 90)}>
                  <p className="walk__head">
                    <span className="mono accent">{s.n}</span>
                    <span className="walk__title">{s.title}</span>
                  </p>
                  <p className="walk__text">{s.text}</p>
                </li>
              ))}
            </ol>

            <div className="walk__out" data-reveal>
              <div className="walk__out-text">
                <p className="walk__head">
                  <span className="mono accent">05</span>
                  <span className="walk__title">{app.out.title}</span>
                </p>
                <p className="walk__text">{app.out.text}</p>
              </div>
              <figure className="walk__out-photo">
                <MediaZoom id="ortesis-result" aspect="4 / 3" showCaption={false} sizes="(min-width: 960px) 36vw, 100vw" hint="Enlarge" />
                <figcaption className="walk__text">{app.out.caption}</figcaption>
              </figure>
            </div>

            <details id="app-recording" className="rec" data-reveal>
              <summary>
                <span>Watch the application run</span>
                <span className="rec__meta">50 s screen recording · the geometry workflow, not the rig</span>
              </summary>
              <div className="rec__body">
                <MediaFrame id="ortesis-web-interface" sizes="(min-width: 1200px) 70vw, 100vw" />
              </div>
            </details>

            <section id="next" className="sub sub--close" aria-labelledby="close-title">
              <h3 id="close-title" className="sub__title" data-reveal>
                Where it stands
              </h3>
              <div className="close__grid">
                <div className="close__col" data-reveal>
                  <p className="label">Demonstrated</p>
                  <ul>
                    <li><strong className="em">Machine:</strong> {demonstrated.rig}</li>
                    <li><strong className="em">Geometry workflow:</strong> {demonstrated.workflow}</li>
                  </ul>
                </div>
                <div className="close__col" data-reveal style={rd(70)}>
                  <p className="label">Not measured or tested</p>
                  <ul>{stillOpen.map((n) => <li key={n}>{rich(n)}</li>)}</ul>
                </div>
                <div className="close__col close__col--next" data-reveal style={rd(140)}>
                  <p className="label">{hardwareNext.first ? "In a next version" : "Open for a next version"}</p>
                  {hardwareNext.first || hardwareNext.check ? (
                    <dl className="close__plan">
                      {hardwareNext.first ? (
                        <div>
                          <dt className="label">Change first</dt>
                          <dd>{hardwareNext.first}</dd>
                        </div>
                      ) : null}
                      {hardwareNext.check ? (
                        <div>
                          <dt className="label">How it would be checked</dt>
                          <dd>{hardwareNext.check}</dd>
                        </div>
                      ) : null}
                    </dl>
                  ) : (
                    <ol className="close__questions">
                      {nextQuestions.map((q, i) => (
                        <li key={q}>
                          <span className="mono accent">{String(i + 1).padStart(2, "0")}</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </div>
            </section>
          </section>
        </div>
      </div>

      {/* ---- Technical details: kept for questions after the story ---- */}
      <section id="details" className="case-band app surface-base" aria-labelledby="details-title">
        <div className="case-band__light" aria-hidden="true" />
        <div className="container">
          <header className="app__head">
            <p className="chapter__n" data-reveal>
              <span className="label">Reference</span>
            </p>
            <h2 id="details-title" className="app__title" data-reveal style={rd(60)}>
              Technical <span className="light">details</span>
            </h2>
            <p className="lead app__lead" data-reveal style={rd(120)}>
              The names of the rig&apos;s parts, the application&apos;s architecture, the geometry stages and the Blender workflow, for anyone who wants to go deeper.
            </p>
          </header>

          <div id="rig-parts" className="detail-block">
            <h3 className="h3">The rig, part by part</h3>
            <div className="parts">
              {drives.map((d, i) => (
                <figure key={d.key} className="parts__item" data-reveal style={rd(i * 90)}>
                  <AnnotatedFigure id={d.media} aspect="4 / 3" position={d.position} sizes="(min-width: 960px) 45vw, 100vw" pins={partPins(d.labels)} />
                  <figcaption>
                    <strong>{d.detailTitle}.</strong> {d.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div id="architecture" className="detail-block">
            <h3 className="h3">How the application is built</h3>
            <div className="pipeline">
              <p className="label">Under the interface</p>
              <ol className="pipeline__flow" aria-label="Software architecture">
                {pipeline.map((p, i) => (
                  <li key={p}>
                    <span className="mono accent">{String(i + 1).padStart(2, "0")}</span> {p}
                  </li>
                ))}
              </ol>
              <p className="pipeline__text">
                HTML, CSS and JavaScript interface with a Three.js viewer, a local Python layer and headless Blender. It runs locally; the
                application is private. No time savings or usability results have been measured.
              </p>
            </div>
          </div>

          <div id="geometry" className="detail-block">
            <h3 className="h3">How the geometry progresses</h3>
            <p className="lead">Five real files from one run of the workflow, from scan to orthosis.</p>
            <div className="geo-stack" data-reveal>
              <OrtesisModelStack />
            </div>
            <ol className="geo-steps">
              <li><span className="mono accent">01</span> <strong>Original scan</strong>: the imported input, never modified.</li>
              <li><span className="mono accent">02</span> <strong>Anatomical mesh</strong>: reconstructed in Prepare.</li>
              <li><span className="mono accent">03</span> <strong>Trimmed mesh</strong>: the region between the cutting planes.</li>
              <li><span className="mono accent">04</span> <strong>Design preview</strong>: the shape before generation.</li>
              <li><span className="mono accent">05</span> <strong>Final orthosis</strong>: the generated lattice, exported as STL.</li>
            </ol>
          </div>

          <div id="blender" className="detail-block">
            <h3 className="h3">The Blender workflow</h3>
            <div className="engine">
              <div className="engine__col">
                <p className="label"><span className="accent">First</span>: defining the workflow</p>
                <p className="prose">
                  The workflow was first developed in Blender with <strong className="em">Geometry Nodes</strong> and modifiers, testing how a
                  scan could become a lattice orthosis <strong className="em">through rules rather than manual modelling</strong>.
                </p>
                <MediaZoom id="ortesis-nodes" fig="A.2" sizes="(min-width: 1200px) 45vw, 100vw" hint="Enlarge the graph" />
              </div>
              <div className="engine__col">
                <p className="label"><span className="accent">Then</span>: the engine behind the application</p>
                <p className="prose">
                  The application rebuilds that logic with <strong className="em">Python and BMesh</strong> plus real Blender modifiers. Its
                  main lattice pipeline:
                </p>
                <ol className="engine__chain" aria-label="Lattice pipeline">
                  {engineSteps.map((step, i) => (
                    <li key={step}>
                      <span className="mono accent">{String(i + 1).padStart(2, "0")}</span> {step}
                    </li>
                  ))}
                </ol>
                <p className="engine__note">
                  An organic lattice built from mesh operations: not a mathematically exact Voronoi pattern, and not necessarily the
                  Geometry Nodes graph shown here.
                </p>
              </div>
            </div>
          </div>

          <div id="software-next" className="detail-block">
            <h3 className="h3">Software next steps</h3>
            <p className="lead">Planned, not implemented.</p>
            <ol className="geo-steps">
              {softwareNext.map((t, i) => (
                <li key={t}>
                  <span className="mono accent">{String(i + 1).padStart(2, "0")}</span> {t}
                </li>
              ))}
            </ol>
          </div>

          <p className="tools-line" data-reveal>
            <span className="label">Tools</span> {project.tools.join(" · ")}
          </p>
        </div>
      </section>

      <section className="case-band surface-base" aria-labelledby="inspect-title">
        <div className="container inspect">
          <div className="inspect__text">
            <p className="label">Inspect</p>
            <h2 id="inspect-title" className="h2">
              The orthosis <span className="light">in three dimensions.</span>
            </h2>
            <p className="prose">
              The final generated orthosis, from the exported STL, at its original resolution. Turn it to see the lattice from every side,
              and zoom in on the ribs and openings.
            </p>
            <p className="inspect__meta">Original geometry: 19,584 triangles, about 158 × 76 × 101 mm. Nothing has been simplified.</p>
          </div>
          <OrthosisViewer variant="inspect" className="inspect__viewer" />
        </div>
      </section>

      <section className="case-band case-band--tight surface-deep" aria-labelledby="breakdown-title">
        <div className="container breakdown">
          <div className="breakdown__head">
            <p className="label">System breakdown</p>
            <h2 id="breakdown-title" className="h2">
              The system, <span className="light">part by part.</span>
            </h2>
          </div>
          <div className="breakdown__list">
            <Disclosure n="01" title="Mechanical system">
              <p>
                PLA-printed structure with bearings, guides and two transmissions: a pinion on a printed ring gear for rotation around the
                arm, a belt-driven carriage on steel rails for translation along it.
              </p>
            </Disclosure>
            <Disclosure n="02" title="Motion control">
              <p>Arduino-based control of both motorised movements, programmed for the project and tested mechanically.</p>
            </Disclosure>
            <Disclosure n="03" title="Sensor">
              <p>A 3D scanner mounted on the carriage. Integration with its capture software is not yet confirmed.</p>
            </Disclosure>
            <Disclosure n="04" title="Geometry">
              <p>
                Developed first in Blender Geometry Nodes and modifiers. The application runs headless Blender with Python/BMesh and
                modifiers; main lattice pipeline Decimate → Wireframe → Subdivision Surface → Smooth by Angle.
              </p>
            </Disclosure>
            <Disclosure n="05" title="Application">
              <p>
                Private, local application: HTML/CSS/JavaScript interface with a Three.js viewer → local Python layer → headless Blender.
                Workflow Import → Prepare → Design → Export (STL), with explicit generation, project saving and a generation record.
              </p>
            </Disclosure>
            <Disclosure n="06" title="Fabrication">
              <p>The generated geometry is 3D printed in a separate step.</p>
            </Disclosure>
          </div>
        </div>
      </section>

      <NextProject current="ortesis-studio" />
    </article>
  );
}
