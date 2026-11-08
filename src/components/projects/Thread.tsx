import { cn } from "@/lib/utils";

/**
 * ORTESIS chapters 4–6 show the same workflow three ways. This small strip says which view the reader is in:
 * the recording (how the application is operated), the STL stages (how the geometry progresses) and the
 * photograph (the physical prototype).
 */
const views = [
  { key: "operate", href: "#application", label: "Operate", note: "the application recording" },
  { key: "geometry", href: "#geometry", label: "Geometry", note: "five STL stages" },
  { key: "print", href: "#result", label: "Print", note: "the physical prototype" },
] as const;

export function Thread({ active }: { active: (typeof views)[number]["key"] }) {
  return (
    <nav className="thread" aria-label="One workflow, three views">
      <ol>
        {views.map((v, i) => (
          <li key={v.key} className={cn("thread__item", v.key === active && "is-active")}>
            <a href={v.href} aria-current={v.key === active ? "step" : undefined}>
              <span className="mono">{String(i + 1).padStart(2, "0")}</span>
              <span className="thread__label">{v.label}</span>
              <span className="thread__note">{v.note}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
