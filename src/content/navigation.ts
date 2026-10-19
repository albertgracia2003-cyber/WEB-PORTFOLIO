export interface NavItem {
  label: string;
  /** Homepage section destination — the same on every page, in desktop, mobile and footer navigation. */
  href: string;
  /** Section id on the homepage (for current-section highlighting while scrolling). */
  id: string;
  /** Path prefixes that mark this item as current when the visitor is on a detail page. */
  match: readonly string[];
  /** Further homepage sections that belong to this item (highlighted with it while scrolling). */
  alsoIds?: readonly string[];
}

/** One list, used by the header, mobile menu, footer and hero index. The homepage is the project overview. */
export const primaryNav: readonly NavItem[] = [
  { label: "ORTESIS STUDIO", href: "/#work", id: "work", match: ["/work/ortesis-studio"] },
  { label: "Mechanical & Product Design", href: "/#physical", id: "physical", match: ["/work/chair-design"], alsoIds: ["chair"] },
  { label: "Computational Design", href: "/#computational", id: "computational", match: ["/computational-design"] },
  { label: "About", href: "/#about", id: "about", match: ["/about"] },
  { label: "Contact", href: "/#contact", id: "contact", match: ["/contact"] },
];

export function isActive(item: NavItem, pathname: string): boolean {
  return item.match.some((m) => pathname === m || pathname.startsWith(`${m}/`));
}

/** Split an "/#id" destination; returns the id when the link points at the current page's section. */
export function sameDocumentHash(href: string, pathname: string): string | null {
  const i = href.indexOf("#");
  if (i < 0) return null;
  const path = href.slice(0, i) || "/";
  return path === pathname || path === pathname.replace(/\/$/, "") ? href.slice(i + 1) : null;
}
