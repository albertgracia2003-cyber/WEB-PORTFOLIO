import { OrtesisModelStack } from "@/components/graphics/OrtesisModelStack";
import { rich } from "@/lib/rich";
import { ArrowLink, StatusBadge } from "@/components/ui/primitives";
import { getProject } from "@/content/projects";
import { rd } from "@/lib/utils";

/** Workflow stages — used by the process diagram on the case-study page. */
export const ortesisChain = [
  { n: "01", title: "Scan", body: "Motorised 3D scanning machine" },
  { n: "02", title: "Data", body: "Anatomical scan as design input" },
  { n: "03", title: "Geometry", body: "Blender — Geometry Nodes, then Python" },
  { n: "04", title: "Interface", body: "Private app — no manual Blender" },
  { n: "05", title: "Print", body: "3D-printed orthosis" },
] as const;

export function FlagshipOrtesis() {
  const p = getProject("ortesis-studio");
  return (
    <section id="work" className="flagship surface-deep" aria-labelledby="flagship-title">
      <div className="flagship__light" aria-hidden="true" />
      <div className="container">
        <div className="flagship__kicker">
          <p className="label" data-reveal>
            <span className="accent">01</span> — Flagship project
          </p>
          <StatusBadge maturity={p.maturity} authorship={p.authorship} />
        </div>

        <div className="flagship__stage">
          <h2 id="flagship-title" className="flagship__title" data-reveal style={rd(60)}>
            <span className="flagship__title-a">ORTESIS</span>
            <span className="flagship__title-b">STUDIO</span>
          </h2>
          <div className="flagship__brief" data-reveal style={rd(120)}>
            <p className="flagship__brief-head">From anatomical scan to personalised orthosis.</p>
            <div className="flagship__brief-body">
              <p>
                ORTESIS STUDIO explores how <strong className="em">personalised forearm orthosis</strong> design can connect{" "}
                physical engineering with <strong className="em em--accent">computational geometry</strong>.
              </p>
            </div>
            <ArrowLink href={p.href!} variant="solid">
              Explore the case study
            </ArrowLink>
          </div>
          <div className="flagship__object" data-reveal style={rd(160)}>
            <OrtesisModelStack />
          </div>
        </div>
      </div>

    </section>
  );
}
