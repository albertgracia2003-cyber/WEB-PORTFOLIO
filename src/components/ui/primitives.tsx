import Link from "next/link";
import type { ReactNode } from "react";
import { showDevNotes } from "@/content/site";
import { maturityLabel } from "@/content/projects";
import type { Authorship, Maturity } from "@/types/project";
import { cn, rd } from "@/lib/utils";

/* ---------- Section heading -------------------------------------- */

interface SectionHeadingProps {
  index: string;
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
  id?: string;
  as?: "h1" | "h2";
  size?: "display" | "h1" | "h2";
  className?: string;
}

export function SectionHeading({
  index,
  kicker,
  title,
  intro,
  id,
  as: Tag = "h2",
  size = "h1",
  className,
}: SectionHeadingProps) {
  return (
    <header className={cn("section-heading", className)}>
      <p className="section-heading__kicker label" data-reveal>
        <span className="section-heading__index">{index}</span>
        <span className="section-heading__rule" aria-hidden="true" />
        <span>{kicker}</span>
      </p>
      <Tag id={id} className={cn("section-heading__title", size)} data-reveal style={rd(80)}>
        {title}
      </Tag>
      {intro ? (
        <div className="section-heading__intro lead" data-reveal style={rd(160)}>
          {intro}
        </div>
      ) : null}
    </header>
  );
}

/* ---------- Tags --------------------------------------------------- */

export function TagList({ items, label }: { items: readonly string[]; label?: string }) {
  if (!items.length) return null;
  return (
    <ul className="tag-list" aria-label={label}>
      {items.map((t) => (
        <li key={t} className="tag">
          {t}
        </li>
      ))}
    </ul>
  );
}

/* ---------- Arrow link -------------------------------------------- */

interface ArrowLinkProps {
  href: string;
  children: ReactNode;
  variant?: "solid" | "line";
  external?: boolean;
  download?: boolean;
  className?: string;
}

export function ArrowLink({ href, children, variant = "line", external, download, className }: ArrowLinkProps) {
  const content = (
    <>
      <span className="arrow-link__text">{children}</span>
      <span className="arrow-link__icon" aria-hidden="true">
        {external || download ? "↗" : "→"}
      </span>
    </>
  );
  const cls = cn("arrow-link", `arrow-link--${variant}`, className);
  if (external || download) {
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...(download ? { download: true } : {})}
      >
        {content}
        {external ? <span className="visually-hidden"> (opens in a new tab)</span> : null}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}

/* ---------- Metadata list ----------------------------------------- */

export function MetaList({ items, className }: { items: readonly { term: string; value: ReactNode }[]; className?: string }) {
  return (
    <dl className={cn("meta-list", className)}>
      {items.map(({ term, value }) => (
        <div key={term} className="meta-list__row">
          <dt className="label">{term}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ---------- Status / attribution --------------------------------- */

export function StatusBadge({ maturity, authorship }: { maturity: Maturity; authorship: Authorship }) {
  return (
    <p className="status-badge label">
      <span className="status-badge__dot" aria-hidden="true" />
      <span>{authorship.kind === "personal" ? "Personal project" : (authorship.context ?? "Collaborative project")}</span>
      <span aria-hidden="true">·</span>
      <span>{maturityLabel[maturity]}</span>
    </p>
  );
}

/* ---------- Breadcrumbs ------------------------------------------- */

export function Breadcrumbs({ trail }: { trail: readonly { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        {trail.map((c, i) => (
          <li key={c.label} className="label">
            {c.href ? (
              <Link href={c.href} className="link-underline">
                {c.label}
              </Link>
            ) : (
              <span aria-current={i === trail.length - 1 ? "page" : undefined}>{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ---------- Development note -------------------------------------
   Visible in development only. Marks content Albert still has to supply
   or confirm. Never shipped to production unless explicitly enabled. */

export function DevNote({ children, title = "Pending content" }: { children: ReactNode; title?: string }) {
  if (!showDevNotes) return null;
  return (
    <aside className="dev-note" aria-label="Development note">
      <p className="dev-note__title label">◇ Dev note — {title}</p>
      <div className="dev-note__body">{children}</div>
    </aside>
  );
}
