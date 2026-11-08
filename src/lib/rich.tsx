import { Fragment, type ReactNode } from "react";

/**
 * Lightweight inline emphasis for content strings.
 *   **text**  → key contribution / tool / outcome (semibold, full-contrast; <strong class="em">)
 *   ==text==  → one important concept, at most once or twice per section (terracotta + semibold; <strong class="em em--accent">)
 * Everything else stays quiet body text. Output is real HTML, so it works without CSS and with screen readers.
 */
export function rich(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|==[^=]+==)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i} className="em">{part.slice(2, -2)}</strong>;
    if (part.startsWith("==") && part.endsWith("==")) return <strong key={i} className="em em--accent">{part.slice(2, -2)}</strong>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/** Strip the markers (for aria-labels, meta descriptions, plain-text contexts). */
export function plain(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/==([^=]+)==/g, "$1");
}
