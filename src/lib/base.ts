/**
 * Base path for hosting under a sub-path (for example GitHub Pages project sites: "/repo-name").
 * Set NEXT_PUBLIC_BASE_PATH at build time; leave it unset for a root or custom domain.
 * Next.js applies the same value to routes, links and /_next files through `basePath` in next.config.ts;
 * files from /public that the code references by plain string must be prefixed with `withBase()`.
 */
const raw = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").trim();

export const BASE_PATH = raw === "" || raw === "/" ? "" : `/${raw.replace(/^\/+|\/+$/g, "")}`;

export const withBase = (path: string): string => `${BASE_PATH}${path}`;
