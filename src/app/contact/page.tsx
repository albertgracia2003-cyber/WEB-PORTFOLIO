import type { Metadata } from "next";
import { ContactSection } from "@/components/home/ContactSection";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Get in touch with Albert Gracia — engineering and product development, based in Zürich, Switzerland.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="contact-page">
      <ContactSection asPage />
    </div>
  );
}
