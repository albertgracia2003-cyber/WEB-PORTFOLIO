import type { NextConfig } from "next";

/**
 * Static export (`next build` writes plain HTML/CSS/JS to `out/`) for Cloudflare Pages or GitHub Pages.
 * No server, middleware, API routes, rewrites, redirects or `headers()` here; Cloudflare response headers
 * live in `public/_headers` (GitHub Pages ignores that file).
 *
 * NEXT_PUBLIC_BASE_PATH: set to "/<repository-name>" for a GitHub Pages project site
 * (https://<user>.github.io/<repository-name>/); leave unset for a root or custom domain.
 * `trailingSlash` writes every page as <route>/index.html, which static hosts serve from direct URLs.
 */
const rawBase = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").trim().replace(/^\/+|\/+$/g, "");
if (rawBase && !/^[A-Za-z0-9._~-]+(\/[A-Za-z0-9._~-]+)*$/.test(rawBase)) {
  throw new Error(`NEXT_PUBLIC_BASE_PATH "${process.env.NEXT_PUBLIC_BASE_PATH}" is not a valid path segment.`);
}

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  trailingSlash: true,
  ...(rawBase ? { basePath: `/${rawBase}` } : {}),
  images: {
    // The default image optimiser needs a server, which a static export does not have.
    // All images are already optimised WebP files in /public/assets at their display sizes.
    unoptimized: true,
  },
};

export default nextConfig;
