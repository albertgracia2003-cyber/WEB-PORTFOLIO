import { Portrait } from "@/components/home/Portrait";
import { ArrowLink } from "@/components/ui/primitives";
import { approach, intro, statement } from "@/content/profile";
import { rich } from "@/lib/rich";
import { pad, rd } from "@/lib/utils";

export function AboutSection() {
  return (
    <section id="about" className="section surface-deep about-home atmos atmos--ember" aria-labelledby="about-title">
      <div className="container">
        <p className="label" data-reveal>
          <span className="accent">04</span> — About · Engineering approach
        </p>
        <div className="about-home__grid">
          <h2 id="about-title" className="about-home__statement" data-reveal style={rd(80)}>
            {rich(statement)}
          </h2>
          <Portrait className="about-home__portrait" />
          <p className="about-home__intro" data-reveal style={rd(120)}>
            {rich(intro[0] ?? "")}
          </p>
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

        <ArrowLink href="/about">More about my experience</ArrowLink>
      </div>
    </section>
  );
}
