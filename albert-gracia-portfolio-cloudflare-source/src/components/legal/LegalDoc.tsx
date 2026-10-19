import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/primitives";

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

/** Plain, readable document layout shared by /privacy and /legal. Internal open questions live in docs/LEGAL_OPEN_ITEMS.md, never on these pages. */
export function LegalDoc({
  title,
  lead,
  updated,
  sections,
}: {
  title: string;
  lead: ReactNode;
  updated: string;
  sections: readonly LegalSection[];
}) {
  return (
    <div className="legal surface-base">
      <header className="legal__hero">
        <div className="container legal__wrap">
          <Breadcrumbs trail={[{ label: "Portfolio", href: "/" }, { label: title }]} />
          <h1 className="legal__title">{title}</h1>
          <p className="legal__lead">{lead}</p>
          <p className="label legal__updated">Last updated {updated}</p>
        </div>
      </header>
      <div className="container legal__wrap legal__body">
        <nav aria-label="On this page" className="legal__toc">
          <ol>
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="link-underline">
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        {sections.map((s) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="legal__section">
            <h2 id={`${s.id}-h`} className="legal__h2">
              {s.title}
            </h2>
            <div className="prose legal__prose">{s.body}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
