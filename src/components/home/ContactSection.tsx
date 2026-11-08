import { ContactLinks } from "@/components/projects/ContactLinks";
import { site } from "@/content/site";

export function ContactSection({ asPage = false }: { asPage?: boolean }) {
  const Heading = asPage ? "h1" : "h2";
  return (
    <section id="contact" className="section surface-base contact atmos" aria-labelledby="contact-title">
      <div className="container">
        <p className="label" data-reveal>
          <span className="accent">05</span> — Contact
        </p>
        <Heading id="contact-title" className="contact__title" data-reveal>
          <span className="light">Let&apos;s build</span>
          <br />
          something <span className="accent-display">meaningful</span>.
        </Heading>
        <div className="contact__grid">
          <p className="lead">
            Open to conversations about mechanical and hardware engineering, robotics, product development and
            computational design.
          </p>
          <div>
            <ContactLinks />
            <p className="contact__location label">{site.location}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
