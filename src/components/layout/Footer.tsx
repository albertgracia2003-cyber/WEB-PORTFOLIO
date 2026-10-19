import Link from "next/link";
import { site } from "@/content/site";
import { primaryNav } from "@/content/navigation";
import { CopyEmail } from "./CopyEmail";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer surface-deep">
      <div className="container site-footer__inner">
        <div className="site-footer__id">
          <p className="site-footer__name">Albert Gracia</p>
          <p className="label">
            {site.role} · {site.location}
          </p>
        </div>
        <div className="site-footer__contact">
          <p className="label">Contact</p>
          {site.email ? (
            <p className="site-footer__email">
              <a id="footer-email" href={`mailto:${site.email}`} className="link-underline">
                {site.email}
              </a>
              <CopyEmail address={site.email} />
            </p>
          ) : null}
          {site.linkedin ? (
            <p>
              <a href={site.linkedin} className="link-underline" target="_blank" rel="noopener noreferrer">
                LinkedIn<span className="visually-hidden"> (opens in a new tab)</span> ↗
              </a>
            </p>
          ) : null}
        </div>
        <nav aria-label="Footer">
          <ul className="site-footer__nav">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="site-footer__base">
          <p className="label">© {year} Albert Gracia</p>
          <p className="site-footer__legal label">
            <Link href="/privacy" className="link-underline">
              Privacy
            </Link>
            <Link href="/legal" className="link-underline">
              Legal &amp; credits
            </Link>
          </p>
          <a href="#main" className="label link-underline">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
