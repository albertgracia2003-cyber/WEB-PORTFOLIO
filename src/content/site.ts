/**
 * SITE CONFIGURATION
 * Everything here is either confirmed by Albert or intentionally left
 * undefined. Undefined links are never rendered as working buttons.
 */
export interface SiteConfig {
  name: string;
  /** Full name — used for the responsible person on /privacy and /legal. */
  formalName?: string;
  role: string;
  /** Degree, kept exact. */
  background: string;
  location: string;
  title: string;
  description: string;
  /** Production URL. Read from NEXT_PUBLIC_SITE_URL; undefined until the domain is decided. */
  url?: string;
  /** Public contact email — set once Albert confirms which address to publish. */
  email?: string;
  /** Full LinkedIn profile URL. */
  linkedin?: string;
  /** Public path to the CV, e.g. "/assets/documents/albert-gracia-cv.pdf". */
  cvUrl?: string;
  /** Social preview image (1200×630), public path. */
  ogImage?: string;
  /**
   * Hosting state used by the wording on /privacy. "cloudflare-pages" now that the site is live
   * at web-portfolio-9ar.pages.dev; use `null` only for a copy that is not deployed there.
   */
  hostedOn: "cloudflare-pages" | null;
}

const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const site: SiteConfig = {
  name: "Albert Gracia",
  formalName: "Albert Gracia i Riera", // confirmed 19 Oct 2026 — used on /privacy and /legal
  role: "CAD, Mechanical Design & Product Development",
  background: "Industrial Design Engineering and Product Development",
  location: "Zürich, Switzerland",
  title: "Albert Gracia — CAD, Mechanical Design & Product Development",
  description:
    "Albert Gracia — CAD, mechanical design and physical product development through prototyping and computational tools. Industrial Design Engineering and Product Development (UPC). Based in Zürich.",
  url: envUrl ? envUrl.replace(/\/$/, "") : undefined,
  email: "albertgracia2003@gmail.com",
  linkedin: "https://www.linkedin.com/in/albert-gracia-i-riera-05074b1ab/",
  cvUrl: undefined,
  ogImage: "https://albertgracia-portfolio.com/portfolio-home-hero-dark-2880x1800.png",
  hostedOn: "cloudflare-pages", // live at https://web-portfolio-9ar.pages.dev (confirmed by Albert, 19 Oct 2026)
};

/** Development notes (pending content, missing assets) are visible outside production. */
export const showDevNotes = process.env.NEXT_PUBLIC_SHOW_DEV_NOTES === "true";
