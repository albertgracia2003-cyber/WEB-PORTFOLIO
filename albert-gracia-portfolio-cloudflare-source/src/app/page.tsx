import { Hero } from "@/components/home/Hero";
import { FlagshipOrtesis } from "@/components/home/FlagshipOrtesis";
import { ComputationalSection } from "@/components/home/ComputationalSection";
import { PhysicalSection } from "@/components/home/PhysicalSection";
import { AboutSection } from "@/components/home/AboutSection";
import { ContactSection } from "@/components/home/ContactSection";
import { site } from "@/content/site";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    address: { "@type": "PostalAddress", addressLocality: "Zürich", addressCountry: "CH" },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Universitat Politècnica de Catalunya" },
    ],
    ...(site.url ? { url: site.url } : {}),
    ...(site.linkedin ? { sameAs: [site.linkedin] } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <FlagshipOrtesis />
      <PhysicalSection />
      <ComputationalSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}
