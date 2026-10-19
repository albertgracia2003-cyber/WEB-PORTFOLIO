import type { Metadata } from "next";
import { rich } from "@/lib/rich";
import { CaseHero, Chapter, Disclosure, NextProject } from "@/components/projects/CaseStudy";
import { ChapterNav } from "@/components/projects/ChapterNav";
import { MediaFrame } from "@/components/media/MediaFrame";
import { MediaZoom } from "@/components/media/MediaZoom";
import { OrtesisModelStack } from "@/components/graphics/OrtesisModelStack";
import { OrthosisViewer } from "@/components/graphics/OrthosisViewer";
import { Thread } from "@/components/projects/Thread";
import { ortesisChain } from "@/components/home/FlagshipOrtesis";
import { getProject } from "@/content/projects";
import { pageMetadata } from "@/lib/seo";
import { rd } from "@/lib/utils";

const project = getProject("ortesis-studio");

export const metadata: Metadata = pageMetadata({
  title: "ORTESIS STUDIO",
  description:
    "An independent experimental engineering prototype by Albert Gracia: a motorised 3D scanning machine, a Blender-based geometry workflow and a private application that generate personalised forearm orthosis geometry for 3D printing. Not clinically validated.",
  path: "/work/ortesis-studio",
});

const QUALIFICATION = "Independent experimental engineering prototype. Not clinically validated.";

const chapters = [
  { id: "purpose", title: "Purpose & Contribution" },
  { id: "machine", title: "The Scanning Machine" },
  { id: "motion", title: "Movement & Control" },
  { id: "application", title: "The Application" },
  { id: "geometry", title: "How the Geometry Progresses" },
  { id: "result", title: "The Printed Result" },
  { id: "limitations", title: "Limitations & Next Steps" },
] as const;

const story = [
  {
    label: "Starting point",
    title: "Adapting geometry to each scan.",
    body: "An orthosis follows one person’s anatomy, so its geometry must be ==adapted to each scan==. That adaptation is the problem this project works on.",
    media: "ortesis-app-import",
    note: "A forearm scan loaded into the application.",
  },
  {
    label: "My approach",
    title: "A reusable workflow, built in Blender.",
    body: "I defined the geometry workflow once in Blender — first with **Geometry Nodes** and modifiers — so the same operations apply to different scans, then built **a custom interface** to operate it.",
    media: "ortesis-nodes",
    note: "The Geometry Nodes graph where the workflow was first developed.",
  },
  {
    label: "User control",
    title: "Select a region, adjust, generate, inspect, export.",
    body: "In the application the user chooses the **region of the arm**, adjusts **shape and lattice parameters**, generates the orthosis, inspects it against the arm and exports the result — **without opening Blender**.",
    media: "ortesis-app-design",
    note: "Choosing the region and parameters before generating.",
  },
  {
    label: "Intended benefit",
    title: "Repeated operations, organised.",
    body: "The aim is to **organise the repeated operations** of adapting geometry to each scan and cut the modelling steps repeated for every new case. That is the design intention; **no time savings or other results have been measured**.",
    media: "ortesis-result",
    note: "The generated geometry, 3D-printed and shown on an arm.",
  },
] as const;

const whoIBuilt = [
  "designed, 3D-printed and assembled the **scanning machine**",
  "programmed its **Arduino-based motion control**",
  "developed the orthosis workflow in **Blender**",
  "built the **application** that operates it",
  "3D-printed the generated geometry as **prototypes**",
] as const;

const machineFacts = [
  { n: "A", term: "Structure", value: "PLA-printed components with bearings and guides" },
  { n: "B", term: "Transmission", value: "Gear drive for rotation, belt-driven carriage for translation" },
  { n: "C", term: "Sensor", value: "Creality 3D scanner on the carriage" },
  { n: "D", term: "Control", value: "Arduino-based motion control" },
] as const;

const designDecisions = [
  "**Gear drive for rotation, belt drive for translation**: a pinion on a ring gear turns the assembly; a toothed belt pulls the carriage along steel rails.",
  "**Printed structure with bearings and steel guides**, assembled into the machine.",
] as const;

const engineSteps = ["Decimate", "Wireframe", "Subdivision Surface", "Smooth by Angle"] as const;

const pipeline = ["Custom interface + Three.js viewer", "Local Python layer", "Headless Blender", "Generated geometry / STL"] as const;

const limitations = [
  "The two movements have been **tested mechanically**. Coordinating them with the scanner's own capture software is not part of the confirmed work.",
  "Cell size is limited by the part: the application reports when a requested cell size cannot be achieved and uses the largest workable one instead.",
  "**No clinical testing, fit validation or measured accuracy.** The printed prototype has been shown on an arm, nothing more.",
] as const;

const nextSteps = [
  "Calibrated control of the lattice cell size",
  "Fuller anatomical normalisation from the landmarks (today they set orientation)",
  "Inspection tools for the generated geometry",
  "A packaged installation of the application",
] as const;

export default function OrtesisStudioPage() {
  return (
    <article className="case case--flagship surface-base">
      <CaseHero
        project={project}
        variant="flagship"
        trail={[{ label: "Portfolio", href: "/" }, { label: "ORTESIS STUDIO overview", href: "/#work" }, { label: "Case study" }]}
        intro={
          <p>
            An independently developed engineering project: a motorised 3D scanning machine, a geometry workflow in
            Blender and a private application that together turn a scan of the forearm into a personalised orthosis to
            3D print.
          </p>
        }
        meta={[
          { term: "Type", value: "Independent project" },
          { term: "Role", value: "Sole developer — hardware, software, fabrication" },
          { term: "Capabilities", value: project.disciplines.join(" · ") },
          { term: "Tools", value: project.tools.join(" · ") },
          { term: "Status", value: QUALIFICATION },
        ]}
      />

      {/* ---- System overview: the process as layers ---- */}
      <section className="case-band case-band--overview surface-deep" aria-labelledby="process-title">
        <div className="case-band__light" aria-hidden="true" />
        <div className="container">
          <div className="overview">
            <div className="overview__text">
              <p className="label">System overview</p>
              <h2 id="process-title" className="h1">
                One workflow, <span className="light">machine to print.</span>
              </h2>
              <p className="prose">
                A <strong className="em">machine I built</strong> captures the forearm; a{" "}
                <strong className="em">custom application</strong> turns an anatomical scan into orthosis geometry, with
                Blender as its internal engine; a <strong className="em">3D printer</strong> makes the result physical. Each
                layer is its own engineering problem.
              </p>
              <p className="prose">
                The parts form one workflow, but <strong className="em">not one automated system</strong>: the application
                starts from a scan file, and a direct link between the machine&apos;s capture and the application is not
                part of the confirmed work.
              </p>
              <p className="qualification">{QUALIFICATION}</p>
            </div>
            <div className="overview__stack">
              <MediaFrame id="ortesis-hero" fig="0.1" sizes="(min-width: 960px) 58vw, 100vw" />
              <ol className="overview__chain" aria-label="Workflow stages">
                {ortesisChain.map((c) => (
                  <li key={c.n}>
                    <span className="mono accent">{c.n}</span> {c.title}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <div className="container case-layout">
        <aside className="case-layout__aside">
          <ChapterNav chapters={chapters} />
        </aside>

        <div className="case-layout__content">
          {/* 01 — Purpose & contribution */}
          <Chapter id="purpose" n={1} title="Purpose & Contribution" variant="statement">
            <p className="statement" data-reveal>
              Every arm is different. <span className="statement__muted">The orthosis geometry has to be adapted to each anatomical scan.</span>
            </p>
            <ol className="story">
              {story.map((st, i) => (
                <li key={st.label} className="story__row" data-reveal>
                  <div className="story__text">
                    <p className="story__label label">
                      <span className="mono accent">{String(i + 1).padStart(2, "0")}</span> {st.label}
                    </p>
                    <h3 className="story__title">{st.title}</h3>
                    <p className="story__body">{rich(st.body)}</p>
                  </div>
                  <figure className="story__media">
                    <MediaFrame id={st.media} showCaption={false} sizes="(min-width: 1200px) 44vw, 100vw" reveal={false} />
                    <figcaption className="story__note">{st.note}</figcaption>
                  </figure>
                </li>
              ))}
            </ol>
            <div className="story__who" data-reveal>
              <p className="label">My part — independent project, developed alone</p>
              <p>I worked on every link of the chain:</p>
              <ul className="who-list">
                {whoIBuilt.map((w) => (
                  <li key={w}>{rich(w)}</li>
                ))}
              </ul>
            </div>
          </Chapter>

          {/* 02 — The scanning machine */}
          <Chapter
            id="machine"
            n={2}
            title="The Scanning Machine"
            variant="machine"
            lead={
              <p className="lead">
                A <strong className="em">motorised 3D scanning machine</strong>. The arm rests through two ring frames and
                stays still; <strong className="em">the scanner moves around it and along it</strong>.
              </p>
            }
          >
            <div className="machine">
              <div className="machine__stage">
                <MediaZoom id="ortesis-machine-cad" fig="2.1" sizes="(min-width: 1200px) 50vw, 100vw" />
              </div>
              <ol className="machine__specs">
                {machineFacts.map((s, i) => (
                  <li key={s.n} className="machine__spec" data-reveal style={rd(i * 90)}>
                    <span className="machine__spec-n">{s.n}</span>
                    <span className="label">{s.term}</span>
                    <span className="machine__spec-v">{s.value}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="prose chapter__text">
              <p>
                <strong className="em">Moving the sensor instead of the person</strong> keeps the arm in one relaxed
                position.
              </p>
              <p>
                Two ring frames carry a rotating assembly; steel rails between them guide a carriage that holds the
                scanner. <strong className="em">Rotation and translation are separate motorised movements</strong>, so the
                scanner&apos;s angle around the arm and its position along it are set independently.
              </p>
            </div>
            <div className="prose chapter__text">
              <p className="label">From CAD to physical machine</p>
              <p>
                The machine was <strong className="em">modelled in CAD</strong>, then{" "}
                <strong className="em">printed, assembled and tested</strong> as a physical prototype. The built machine
                differs from the CAD model in some structural details — the photographs show what exists.
              </p>
              <p className="label">Mechanism choices</p>
              <ul className="who-list">
                {designDecisions.map((d) => (
                  <li key={d}>{rich(d)}</li>
                ))}
              </ul>
            </div>
          </Chapter>

          {/* 03 — Movement & control */}
          <Chapter
            id="motion"
            n={3}
            title="Movement & Control"
            lead={<p className="lead">Two motorised movements, one controller.</p>}
          >
            <div className="mech">
              <figure className="mech__item mech__item--wide">
                <MediaZoom id="ortesis-carriage" fig="3.1" showCaption={false} sizes="(min-width: 1200px) 50vw, 100vw" />
              </figure>
              <div className="mech__text" data-reveal>
                <p className="label">
                  <span className="accent">Along the arm</span> — translation
                </p>
                <p>
                  A printed carriage runs on <strong className="em">two steel guide rails</strong>, pulled by a{" "}
                  <strong className="em">toothed belt</strong>. The Creality 3D scanner hangs from the carriage, so the belt
                  sets where along the forearm it points.
                </p>
              </div>
              <div className="mech__text mech__text--second" data-reveal>
                <p className="label">
                  <span className="accent">Around the arm</span> — rotation
                </p>
                <p>
                  A motor-driven <strong className="em">pinion</strong> meshes with a{" "}
                  <strong className="em">large ring gear</strong> printed into the frame; turning it rotates the
                  rail-and-carriage assembly around the arm.
                </p>
                <p className="mech__control">
                  Both movements run on motors under <strong className="em em--accent">Arduino-based control that I
                  programmed</strong>. Each was tested mechanically on the prototype.
                </p>
              </div>
              <figure className="mech__item mech__item--tall">
                <MediaZoom id="ortesis-gear-detail" fig="3.2" showCaption={false} sizes="(min-width: 1200px) 28vw, 100vw" />
              </figure>
            </div>
            <p className="note">
              <span className="label">What is confirmed</span>
              Automated mechanical movement on both axes. Fully synchronised acquisition — the movement coordinated with
              the scanner&apos;s capture software — is not yet confirmed, and no particular scanning path is claimed.
            </p>
          </Chapter>

        </div>
      </div>

      {/* 04 — The application: its own full-width section */}
      <section id="application" className="case-band app surface-deep" aria-labelledby="application-title">
        <div className="case-band__light" aria-hidden="true" />
        <div className="container">
          <header className="app__head">
            <p className="chapter__n" data-reveal>
              <span className="chapter__num">04</span>
              <span className="label">Chapter · The software</span>
            </p>
            <h2 id="application-title" className="app__title" data-reveal style={rd(60)}>
              The <span className="light">Application</span>
            </h2>
            <p className="lead app__lead" data-reveal style={rd(120)}>
              A custom application that runs the scan-to-orthosis workflow without opening Blender.
            </p>
          </header>

          <Thread active="operate" />

          <div className="app__recording">
            <MediaFrame id="ortesis-web-interface" fig="4.1" sizes="(min-width: 1200px) 75vw, 100vw" />
          </div>

          <div className="app__explain">
            <div className="app__col" data-reveal>
              <p className="prose">
                Import a scan, mark landmarks and cutting planes, adjust parameters, then{" "}
                <strong className="em">generate, inspect and export the STL</strong>.{" "}
                <strong className="em">Blender runs in the background</strong> as the geometry engine.
              </p>
            </div>
          </div>

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
              HTML, CSS and JavaScript interface with a Three.js viewer, a local Python layer and headless Blender. It
              runs locally; the application is private. No time savings or usability results have been measured.
            </p>
          </div>
        </div>
      </section>

      <div className="container case-layout">
        <aside className="case-layout__aside">
          <ChapterNav chapters={chapters} />
        </aside>

        <div className="case-layout__content">
          {/* 05 — How the geometry progresses */}
          <Chapter
            id="geometry"
            n={5}
            title="How the Geometry Progresses"
            lead={<p className="lead">Five real files from one run of the workflow, from scan to orthosis.</p>}
          >
            <Thread active="geometry" />
            <div className="geo-stack" data-reveal>
              <OrtesisModelStack />
            </div>
            <ol className="geo-steps">
              <li>
                <span className="mono accent">01</span> <strong>Original scan</strong> — the imported input, never modified.
              </li>
              <li>
                <span className="mono accent">02</span> <strong>Anatomical mesh</strong> — reconstructed in Prepare.
              </li>
              <li>
                <span className="mono accent">03</span> <strong>Trimmed mesh</strong> — the region between the cutting planes.
              </li>
              <li>
                <span className="mono accent">04</span> <strong>Design preview</strong> — the shape before generation.
              </li>
              <li>
                <span className="mono accent">05</span> <strong>Final orthosis</strong> — the generated lattice, exported as STL.
              </li>
            </ol>
            <div className="engine">
              <div className="engine__col">
                <p className="label">
                  <span className="accent">First</span> — defining the workflow
                </p>
                <p className="prose">
                  I first developed the workflow in Blender with <strong className="em">Geometry Nodes</strong> and
                  modifiers — testing how a scan could become a lattice orthosis{" "}
                  <strong className="em">through rules rather than manual modelling</strong>.
                </p>
                <MediaZoom id="ortesis-nodes" fig="5.1" sizes="(min-width: 1200px) 45vw, 100vw" hint="Enlarge the graph" />
              </div>
              <div className="engine__col">
                <p className="label">
                  <span className="accent">Then</span> — the engine behind the application
                </p>
                <p className="prose">
                  The application rebuilds that logic with <strong className="em">Python and BMesh</strong> plus real
                  Blender modifiers. Its main lattice pipeline:
                </p>
                <ol className="engine__chain" aria-label="Lattice pipeline">
                  {engineSteps.map((step, i) => (
                    <li key={step}>
                      <span className="mono accent">{String(i + 1).padStart(2, "0")}</span> {step}
                    </li>
                  ))}
                </ol>
                <p className="engine__note">
                  An organic lattice built from mesh operations — not a mathematically exact Voronoi pattern, and not
                  necessarily the Geometry Nodes graph shown here.
                </p>
              </div>
            </div>
          </Chapter>

          {/* 06 — The printed result */}
          <Chapter
            id="result"
            n={6}
            title="The Printed Result"
            variant="result"
            lead={<p className="lead">The exported geometry leaves the screen as a 3D-printed part.</p>}
          >
            <Thread active="print" />
            <div className="result-stage">
              <MediaZoom id="ortesis-result" fig="6.1" sizes="(min-width: 1200px) 75vw, 100vw" />
              <div className="result-stage__card" data-reveal style={rd(150)}>
                <p className="lead">A printed prototype, shown on an arm.</p>
                <p className="result-stage__text">
                  An open lattice following the forearm from below the elbow to the palm, leaving the thumb free. It shows
                  that the workflow <strong className="em">produces printable, wearable-looking geometry</strong> — not that
                  it has been tested for comfort, fit or therapeutic effect.
                </p>
              </div>
            </div>
          </Chapter>

          {/* 07 — Limitations & next steps */}
          <Chapter id="limitations" n={7} title="Limitations & Next Steps" variant="reflections">
            <div className="status-panel">
              <p className="label">Current status</p>
              <p>{QUALIFICATION}</p>
            </div>
            <div className="limits">
              <div>
                <p className="label">Limitations</p>
                <ul className="limits__list">
                  {limitations.map((l) => (
                    <li key={l}>{rich(l)}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="label">Possible next steps — planned, not implemented</p>
                <ul className="limits__list limits__list--next">
                  {nextSteps.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Chapter>
        </div>
      </div>

      <section className="case-band case-band--tight surface-deep" aria-labelledby="breakdown-title">
        <div className="container breakdown">
          <div className="breakdown__head">
            <p className="label">Technical breakdown</p>
            <h2 id="breakdown-title" className="h2">
              The system, <span className="light">part by part.</span>
            </h2>
          </div>
          <div className="breakdown__list">
            <Disclosure n="01" title="Mechanical system">
              <p>
                PLA-printed structure with bearings, guides and two transmissions: a pinion on a printed ring gear for rotation
                around the arm, a belt-driven carriage on steel rails for translation along it.
              </p>
            </Disclosure>
            <Disclosure n="02" title="Motion control">
              <p>Arduino-based control of both motorised movements, programmed for the project and tested mechanically.</p>
            </Disclosure>
            <Disclosure n="03" title="Sensor">
              <p>A Creality 3D scanner mounted on the carriage. Integration with its capture software is not yet confirmed.</p>
            </Disclosure>
            <Disclosure n="04" title="Geometry">
              <p>
                Developed first in Blender Geometry Nodes and modifiers. The application runs headless Blender with Python/BMesh
                and modifiers; main lattice pipeline Decimate → Wireframe → Subdivision Surface → Smooth by Angle.
              </p>
            </Disclosure>
            <Disclosure n="05" title="Application">
              <p>
                Private, local application: HTML/CSS/JavaScript interface with a Three.js viewer → local Python layer →
                headless Blender. Workflow Import → Prepare → Design → Export (STL), with explicit generation, project saving
                and a generation record.
              </p>
            </Disclosure>
            <Disclosure n="06" title="Fabrication">
              <p>The generated geometry is 3D printed in a separate step.</p>
            </Disclosure>
          </div>
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
              The final generated orthosis, from the exported STL, at its original resolution. Turn it to see the lattice
              from every side, and zoom in on the ribs and openings.
            </p>
            <p className="inspect__meta">
              Original geometry: 19,584 triangles, about 158 × 76 × 101 mm. Nothing has been simplified.
            </p>
          </div>
          <OrthosisViewer variant="inspect" className="inspect__viewer" />
        </div>
      </section>

      <NextProject current="ortesis-studio" />
    </article>
  );
}
