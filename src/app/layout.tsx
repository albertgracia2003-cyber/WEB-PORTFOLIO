import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteShell } from "@/components/layout/SiteShell";
import { site } from "@/content/site";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: site.url ? new URL(site.url) : undefined,
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  alternates: site.url ? { canonical: "/" } : undefined,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "en_GB",
    images: site.ogImage ? [{ url: site.ogImage, width: 1200, height: 630 }] : undefined,
  },
  twitter: {
    card: site.ogImage ? "summary_large_image" : "summary",
    title: site.title,
    description: site.description,
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F1EB" },
    { media: "(prefers-color-scheme: dark)", color: "#20242B" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Sets data-theme + .js before paint: no theme flash, no hidden content without JS. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
