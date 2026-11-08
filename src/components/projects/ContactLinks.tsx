import { DevNote } from "@/components/ui/primitives";
import { site } from "@/content/site";

/** Renders only links that are actually configured in src/content/site.ts. */
export function ContactLinks() {
  const links: { label: string; value: string; href: string; external?: boolean; download?: boolean }[] = [];
  if (site.email) links.push({ label: "Email", value: site.email, href: `mailto:${site.email}` });
  if (site.linkedin)
    links.push({ label: "LinkedIn", value: site.linkedin.replace(/^https?:\/\/(www\.)?/, ""), href: site.linkedin, external: true });
  if (site.cvUrl) links.push({ label: "CV", value: "Download PDF", href: site.cvUrl, download: true });

  const missing = [!site.email && "email address", !site.linkedin && "LinkedIn URL", !site.cvUrl && "CV file"].filter(Boolean);

  return (
    <>
      {links.length ? (
        <ul className="contact-links">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="contact-links__a"
                {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                {...(l.download ? { download: true } : {})}
              >
                <span className="label">{l.label}</span>
                <span className="contact-links__value">{l.value}</span>
                <span className="contact-links__arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      {missing.length ? (
        <DevNote title="Contact configuration">
          Not yet configured: {missing.join(", ")}. Set them in <code>src/content/site.ts</code>. Unconfigured links are
          never rendered in production.
        </DevNote>
      ) : null}
    </>
  );
}
