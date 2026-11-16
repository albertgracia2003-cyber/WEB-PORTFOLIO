import { SectionHeading } from "@/components/ui/primitives";
import { TiriEntry } from "@/components/projects/TiriEntry";

/** 02 Where geometry becomes tangible: the Three-Instrument Retention Insert only (the Bicycle Handlebar moved to section 04 on 16 Nov 2026, Albert). */
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
          <TiriEntry />
        </div>
      </div>
    </section>
  );
}
