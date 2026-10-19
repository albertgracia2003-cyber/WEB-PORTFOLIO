import Link from "next/link";
import type { ReactNode } from "react";
import { Breadcrumbs, StatusBadge } from "@/components/ui/primitives";
import { nextCaseStudy } from "@/content/projects";
import type { Project } from "@/types/project";
import { cn, pad, rd } from "@/lib/utils";

/* ---------- Case-study hero --------------------------------------- */

interface CaseHeroProps {
  project: Project;
  trail: readonly { label: string; href?: string }[];
  meta: readonly { term: string; value: ReactNode }[];
  intro: ReactNode;
  /** "flagship" = cinematic title overlapping the media stage. */
  variant?: "flagship" | "standard";
  children?: ReactNode;
}

export function CaseHero({ project, trail, meta, intro, variant = "standard", children }: CaseHeroProps) {
  return (
    <header className={cn("case-hero", `case-hero--${variant}`)}>
      <div className="case-hero__light" aria-hidden="true" />
      <div className="container">
        <div className="case-hero__top">
          <Breadcrumbs trail={trail} />
          <StatusBadge maturity={project.maturity} authorship={project.authorship} />
        </div>
        <h1 className="case-hero__title">{project.title}</h1>
        <div className="case-hero__grid">
          <p className="case-hero__subtitle" data-reveal>
            {project.subtitle}
          </p>
          <div className="case-hero__intro prose" data-reveal style={rd(100)}>
            {intro}
          </div>
        </div>
      </div>
      {children ? <div className="container case-hero__media">{children}</div> : null}
      <div className="container">
        <dl className="spec-strip">
          {meta.map(({ term, value }) => (
            <div key={term} className="spec-strip__cell">
              <dt className="label">{term}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}

/* ---------- Chapter ----------------------------------------------- */

interface ChapterProps {
  id: string;
  n: number;
  title: string;
  lead?: ReactNode;
  children?: ReactNode;
  /** Visual treatment, e.g. "statement", "machine", "pipeline". */
  variant?: string;
  className?: string;
}

export function Chapter({ id, n, title, lead, children, variant, className }: ChapterProps) {
  return (
    <section
      id={id}
      className={cn("chapter", variant && `chapter--${variant}`, className)}
      aria-labelledby={`${id}-title`}
    >
      <header className="chapter__head">
        <p className="chapter__n" data-reveal>
          <span className="chapter__num">{pad(n)}</span>
          <span className="label">Chapter</span>
        </p>
        <h2 id={`${id}-title`} className="h2 chapter__title" data-reveal style={rd(60)}>
          {title}
        </h2>
        {lead ? (
          <div className="chapter__lead" data-reveal style={rd(120)}>
            {lead}
          </div>
        ) : null}
      </header>
      {children ? <div className="chapter__body">{children}</div> : null}
    </section>
  );
}

/* ---------- Two-column text + aside -------------------------------- */

export function Split({ children, aside, reverse }: { children: ReactNode; aside: ReactNode; reverse?: boolean }) {
  return (
    <div className={cn("split", reverse && "split--reverse")}>
      <div className="split__main prose">{children}</div>
      <div className="split__aside">{aside}</div>
    </div>
  );
}

/* ---------- Disclosure (native details) ---------------------------- */

export function Disclosure({ n, title, children, open }: { n?: string; title: string; children: ReactNode; open?: boolean }) {
  return (
    <details className="disclosure" open={open}>
      <summary>
        <span className="mono faint">{n ?? "+"}</span>
        <span>{title}</span>
        <span className="disclosure__icon" aria-hidden="true" />
      </summary>
      <div className="disclosure__body">{children}</div>
    </details>
  );
}

/* ---------- Next project ------------------------------------------- */

export function NextProject({ current }: { current: string }) {
  const next = nextCaseStudy(current);
  return (
    <nav className="next-project surface-deep" aria-label="Next project">
      <div className="next-project__light" aria-hidden="true" />
      <div className="container">
        <Link href={next.href!} className="next-project__link">
          <span className="label">Next project</span>
          <span className="next-project__title">{next.title}</span>
          <span className="next-project__sub">{next.subtitle}</span>
          <span className="next-project__arrow" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </nav>
  );
}
