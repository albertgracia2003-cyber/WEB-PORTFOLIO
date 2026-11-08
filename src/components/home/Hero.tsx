import { OrthosisViewer } from "@/components/graphics/OrthosisViewer";
import { primaryNav } from "@/content/navigation";
import { site } from "@/content/site";
import { pad } from "@/lib/utils";

export function Hero() {
  return (
    <section className="hero surface-base" aria-labelledby="hero-title">
      <div className="hero__atmos" aria-hidden="true" />
      <div className="hero__model" aria-hidden="true">
        <OrthosisViewer variant="hero" />
      </div>

      <div className="container hero__inner">
        <p className="hero__id">
          <span className="hero__id-name">{site.name}</span>
          <span className="hero__id-role">{site.role}</span>
        </p>

        <h1 id="hero-title" className="hero__title">
          <span className="hero__line hero__line--1">
            <span>Engineering the physical.</span>
          </span>
          <span className="hero__line hero__line--2">
            <span>
              Designing the computational<span className="hero__dot">.</span>
            </span>
          </span>
        </h1>

        <div className="hero__foot">
          <p className="hero__lead">
            Exploring CAD, mechanical design, and physical product development through prototyping and computational tools.
          </p>
          <ol className="hero__index" aria-label="Portfolio sections">
            {primaryNav.slice(0, 4).map((item, i) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="hero__index-link">
                  <span className="hero__index-num">{pad(i + 1)}</span>
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
