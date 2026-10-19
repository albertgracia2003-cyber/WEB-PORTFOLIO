import { SectionHeading } from "@/components/ui/primitives";
import { HandlebarStudy } from "@/components/projects/HandlebarStudy";
import { MotoSpiritEntry } from "@/components/projects/MotoSpiritEntry";
import { AedEntry } from "@/components/projects/AedEntry";

export function PhysicalSection() {
  return (
    <section id="physical" className="section surface-base physical atmos atmos--ember atmos--quiet" aria-labelledby="physical-title">
      <div className="container">
        <SectionHeading
          id="physical-title"
          index="02"
          kicker="Mechanical & Product Design"
          title={
            <>
              Where geometry
              <br />
              <span className="light">becomes tangible.</span>
            </>
          }
        />

        <div className="mx-list">
          <HandlebarStudy />
          <MotoSpiritEntry />

          <AedEntry />
        </div>
      </div>
    </section>
  );
}
