import { SectionHeading } from "@/components/ui/primitives";
import { MotoSpiritEntry } from "@/components/projects/MotoSpiritEntry";
import { AedEntry } from "@/components/projects/AedEntry";
import { ChairEntry } from "@/components/projects/ChairEntry";
import { HandlebarStudy } from "@/components/projects/HandlebarStudy";

/** 04 University projects (Albert, 15 Nov 2026): MotoSpirit, AED Monitoring, Bar Stool; the Bicycle Handlebar joined them last on 16 Nov 2026 (Albert moved it out of section 02). */
export function UniversitySection() {
  return (
    <section id="university" className="section surface-base university atmos atmos--ember atmos--quiet" aria-labelledby="university-title">
      <div className="container">
        <SectionHeading
          id="university-title"
          index="04"
          kicker="Team & group work"
          intro="Team and group projects from my university studies: a motorcycle, a compact electronic device, a wooden bar stool and a bicycle handlebar. On the first three, my part was mechanical design and CAD — the chassis, the enclosure and the side profile."
          title={
            <>
              University
              <br />
              <span className="light">projects.</span>
            </>
          }
        />

        <div className="mx-list">
          {/* The two cards share one height on wide screens (equal grid rows). */}
          <div className="uni-cards">
            <MotoSpiritEntry />
            <AedEntry />
          </div>
          <ChairEntry />
          <HandlebarStudy />
        </div>
      </div>
    </section>
  );
}
