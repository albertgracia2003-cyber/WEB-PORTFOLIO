import type { Metadata } from "next";
import { site } from "@/content/site";

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
}

/** Consistent per-page metadata. Canonical URLs are only emitted once the domain is configured. */
export function pageMetadata({ title, description, path }: PageMetaInput): Metadata {
  const canonical = site.url ? `${site.url}${path}` : undefined;
  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      siteName: site.name,
      locale: "en_GB",
      images: site.ogImage ? [{ url: site.ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: site.ogImage ? "summary_large_image" : "summary",
      title,
      description,
    },
  };
}
