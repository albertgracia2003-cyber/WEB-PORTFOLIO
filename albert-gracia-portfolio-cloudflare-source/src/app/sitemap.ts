import type { MetadataRoute } from "next";
import { publishedProjects } from "@/content/projects";
import { site } from "@/content/site";

export const dynamic = "force-static";

/** Generated from published content only. Absolute URLs need NEXT_PUBLIC_SITE_URL. */

export default function sitemap(): MetadataRoute.Sitemap {
  // Without NEXT_PUBLIC_SITE_URL there is no valid absolute URL, so no sitemap entries are emitted.
  if (!site.url) return [];
  const base = site.url;
  const staticRoutes = ["/", "/computational-design", "/about", "/contact", "/privacy", "/legal"];
  const projectRoutes = publishedProjects()
    .map((p) => p.href)
    .filter((h): h is string => Boolean(h));
  return [...staticRoutes, ...projectRoutes].map((path) => ({
    url: `${base}${path === "/" ? "" : path}`,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : path.includes("ortesis") ? 0.9 : 0.7,
  }));
}
