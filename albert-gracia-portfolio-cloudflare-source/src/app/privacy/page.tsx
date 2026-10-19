import type { Metadata } from "next";
import { LegalDoc, type LegalSection } from "@/components/legal/LegalDoc";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description: "How this portfolio website handles visitor data, email correspondence and browser storage.",
  path: "/privacy",
});

const email = site.email ?? "";
const mail = (
  <a href={`mailto:${email}`} className="link-underline">
    {email}
  </a>
);

const ext = (href: string, label: string) => (
  <a href={href} rel="noopener noreferrer" target="_blank">
    {label}
  </a>
);

/** Wording follows the real deployment state: see `site.hostedOn` in src/content/site.ts. */
const live = site.hostedOn === "cloudflare-pages";

const sections: LegalSection[] = [
  {
    id: "responsible",
    title: "Who is responsible",
    body: (
      <p>
        {site.formalName}, {site.location}. Contact: {mail}.
      </p>
    ),
  },
  {
    id: "overview",
    title: "In short",
    body: (
      <ul>
        <li>The site has no contact form, accounts, comments or uploads.</li>
        <li>The site contains no analytics, advertising or tracking code and sets no cookies of its own.</li>
        <li>
          Fonts, images, videos and 3D models are served from the same host as the pages; no third-party content is loaded when you open a
          page.
        </li>
        <li>
          The hosting provider (Cloudflare) processes technical data needed to deliver and protect the site; email you send me is handled
          by my email provider (Google). Both are described below.
        </li>
      </ul>
    ),
  },
  {
    id: "hosting",
    title: "Hosting and technical data",
    body: (
      <>
        <p>
          {live
            ? "This site is hosted on Cloudflare Pages, a service of Cloudflare, Inc. (United States). "
            : "This site is being prepared for hosting on Cloudflare Pages, a service of Cloudflare, Inc. (United States); what follows applies once it is published there. "}
          When you open a page, your browser sends a request to Cloudflare&rsquo;s network. To deliver the page and protect the service from
          abuse, Cloudflare processes technical data such as your IP address, the requested address, the date and time, and browser and
          device information. I do not use this data to identify visitors or to build profiles.
        </p>
        <p>
          <strong>Roles.</strong> In its privacy policy, Cloudflare describes itself as a processor for its customers&rsquo; content and
          customer logs, acting on the customer&rsquo;s instructions, and as a controller for the personal information it collects for
          its own purposes, such as operating and securing its network. For delivering this site it therefore acts as my service provider
          and, for its own network-security purposes, in its own right.
        </p>
        <p>
          <strong>Countries and safeguards.</strong> Cloudflare operates a global network of data centres, so processing can take place in
          various countries, including outside Switzerland and Europe; Cloudflare, Inc. is based in the United States. For transfers to the
          United States, Cloudflare states that it is certified under the Swiss-U.S. Data Privacy Framework and that, if that
          certification lapses or is invalidated, it relies on the European Commission&rsquo;s Standard Contractual Clauses. Its customer
          data processing addendum provides for those clauses with Swiss modifications and, according to Cloudflare, is incorporated into
          its self-serve terms. These are Cloudflare&rsquo;s own statements, read on 19 October 2026; I have not audited them.
        </p>
        <p>
          <strong>Retention.</strong> Cloudflare does not publish one retention period for the request data it processes when delivering
          a website. Its privacy policy says that it keeps personal information only as long as needed for the purposes described, taking
          into account criteria such as the volume, nature and sensitivity of the information, and deletes or destroys it when the
          retention period ends. I do not use this data and have not set a separate retention period for it.
        </p>
        <p>
          Details:{" "}
          {ext("https://www.cloudflare.com/privacypolicy/", "Cloudflare Privacy Policy")},{" "}
          {ext("https://www.cloudflare.com/cloudflare-customer-dpa/", "Customer Data Processing Addendum")} and{" "}
          {ext("https://www.cloudflare.com/trust-hub/gdpr/", "Cloudflare data-transfer information")}.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and similar technologies",
    body: (
      <>
        <p>
          The site does not set cookies of its own and uses no tracking cookies, tracking pixels or fingerprinting. The only item it
          stores in your browser is the theme setting described below.
        </p>
        <p>
          Cloudflare documents a number of cookies that it sets only in connection with specific security or traffic-management features,
          for example bot protection. The site does not depend on any of these features. If I enable one for security reasons, I will
          describe the cookie here. Security processing of this kind is distinct from tracking.
        </p>
      </>
    ),
  },
  {
    id: "email",
    title: "Email correspondence",
    body: (
      <>
        <p>
          If you write to {mail}, I receive your email address, your name if it appears, the content of your message and any attachments. I
          use them to read and answer your message and for any follow-up.
        </p>
        <p>
          <strong>Email provider.</strong> The message is handled by Google LLC (United States) through the Gmail account I use for this
          address, under Google&rsquo;s own terms and privacy policy. Google processes data in data centres in various countries,
          including outside Switzerland; it states that it complies with the Swiss-U.S. Data Privacy Framework and uses Standard
          Contractual Clauses where required ({ext("https://policies.google.com/privacy/frameworks", "Google: legal frameworks for data transfers")}
          ; {ext("https://policies.google.com/privacy", "Google Privacy Policy")}).
        </p>
        <p>
          <strong>Retention.</strong> I retain correspondence for as long as necessary to handle the enquiry and relevant follow-up, or to
          meet applicable legal obligations.
        </p>
        <p>
          Clicking the email link opens your own email program; the site does not see or store what you write. Email is not encrypted
          end to end by default, so please do not send sensitive personal information.
        </p>
      </>
    ),
  },
  {
    id: "browser",
    title: "Your browser: theme setting and Copy button",
    body: (
      <>
        <p>
          The site offers a light and a dark appearance. If you press the theme button, your choice is saved in your browser&rsquo;s local
          storage under the name <code>ag-theme</code> with the value <code>light</code> or <code>dark</code>, so that it is remembered
          on your next visit. On each visit the site reads this entry to apply your choice. Before you press the button nothing is
          written; the site then follows your device&rsquo;s own setting.
        </p>
        <p>
          The entry stays on your device, contains no identifier, has no expiry set by the site and is not sent anywhere by the
          site&rsquo;s code. You can refuse it by not using the button, or remove or block it in your browser&rsquo;s site-data settings;
          the site works either way, and only your choice is not remembered.
        </p>
        <p>
          The &ldquo;Copy&rdquo; button next to the email address writes that address to your clipboard when you press it. The site never
          reads your clipboard.
        </p>
      </>
    ),
  },
  {
    id: "external",
    title: "External links and requests",
    body: (
      <p>
        When you open a page, your browser requests only files from this site&rsquo;s own host. Nothing is embedded from third parties. The
        site links to LinkedIn; only if you click that link does your browser connect to LinkedIn, whose own privacy policy then applies.
      </p>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <>
        <p>
          Under the Swiss Federal Act on Data Protection you can ask me whether I hold personal data about you and request a copy. Requests
          for access are generally answered free of charge within 30 days, subject to the exceptions provided by applicable law. If
          additional time is required, I will inform you. Depending on the circumstances you can also ask me to correct or delete personal
          data or to object to its processing, subject to the limits set by law. Write to {mail}.
        </p>
        <p>
          You can also contact the Swiss Federal Data Protection and Information Commissioner (FDPIC):{" "}
          {ext("https://www.edoeb.admin.ch/en", "edoeb.admin.ch")}.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes",
    body: (
      <p>
        If the site changes in a way that affects this page, for example by adding a service that processes visitor data, I will update it
        here and change the date above.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalDoc
      title="Privacy"
      lead="How this portfolio handles visitor data, email correspondence and one small browser-storage entry."
      updated="19 October 2026"
      sections={sections}
    />
  );
}
