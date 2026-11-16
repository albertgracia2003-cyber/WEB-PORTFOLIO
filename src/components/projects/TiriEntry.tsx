import Link from "next/link";
import { MediaFrame } from "@/components/media/MediaFrame";
import { ArrowLink } from "@/components/ui/primitives";
import { getProject } from "@/content/projects";
import { card, label, video } from "@/content/tiri-case";
import { rd } from "@/lib/utils";

/**
 * Three-Instrument Retention Insert: first entry of section 02, rendered by `PhysicalSection`.
 * A personal CAD and product-design project, a digital demonstrator; the card says so in the label. The 32 s simulation sits small under the text and plays on its own while in view (muted loop, small pause button, never for reduced motion; Albert, 15 Nov 2026).
 * Short on purpose: the longer text, the video and the figures are on /work/tiri-insert.
 */
export function TiriEntry() {
  const p = getProject("tiri-insert");
  return (
    <article className="mx mx--tiri" aria-labelledby="tiri-title">
      <Link href={p.href!} className="tiri-card__photo" tabIndex={-1} aria-hidden="true" data-reveal>
        <MediaFrame id={p.cover} fig="02.1" sizes="(min-width: 960px) 54vw, 100vw" reveal={false} />
      </Link>
      <div className="tiri-card__body" data-reveal style={rd(100)}>
        <p className="label">{label}</p>
        <h3 id="tiri-title" className="mx__title tiri-card__title">
          <Link href={p.href!} className="comp-card__link">
            {p.title}
          </Link>
        </h3>
        <p className="tiri-card__text">{p.summary}</p>
        <figure className="tiri-card__video">
          <MediaFrame id="tiri-use-simulation" playback="ambient" sizes="(min-width: 960px) 22rem, 100vw" showCaption={false} reveal={false} />
          <figcaption className="label">
            {video.title} · {video.length}
          </figcaption>
        </figure>
        <ArrowLink href={p.href!}>{card.link}</ArrowLink>
      </div>
    </article>
  );
}
