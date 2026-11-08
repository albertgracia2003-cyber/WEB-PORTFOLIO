import { MediaFrame } from "@/components/media/MediaFrame";
import { rich } from "@/lib/rich";
import { MediaZoom } from "@/components/media/MediaZoom";
import { TagList } from "@/components/ui/primitives";
import { DayNight } from "@/components/projects/DayNight";
import { getMedia } from "@/content/media";
import { supplied, type Section } from "@/content/showcase";
import { cn } from "@/lib/utils";

/**
 * Editorial sections for the Computational Design pages: each section pairs one idea (short heading and a
 * paragraph) with the footage that shows it. Pending media is skipped; a section without media is omitted,
 * except text "steps", which explain the system on their own.
 */

export function ShowcaseIntro({ paragraphs, capabilities }: { paragraphs: readonly string[]; capabilities: readonly string[] }) {
  return (
    <div className="showcase-intro">
      <div className="showcase-intro__text prose">
        {paragraphs.map((p) => (
          <p key={p}>{rich(p)}</p>
        ))}
      </div>
      <div className="showcase-intro__aside">
        <p className="label">Capabilities</p>
        <TagList items={capabilities} label="Capabilities" />
      </div>
    </div>
  );
}

function Head({ n, title, body }: { n: number; title: string; body?: string }) {
  return (
    <div className="sc-head">
      <p className="sc-head__n mono">{String(n).padStart(2, "0")}</p>
      <h2 className="sc-head__title">{title}</h2>
      {body ? <p className="sc-head__body">{rich(body)}</p> : null}
    </div>
  );
}

export function ShowcaseSections({ sections }: { sections: readonly Section[] }) {
  let n = 0;
  return (
    <>
      {sections.map((s) => {
        switch (s.kind) {
          case "steps": {
            n += 1;
            return (
              <section key={s.id} id={s.id} className="sc sc--steps" aria-labelledby={`${s.id}-t`}>
                <div className="sc-head">
                  <p className="sc-head__n mono">{String(n).padStart(2, "0")}</p>
                  <h2 id={`${s.id}-t`} className="sc-head__title">
                    {s.title}
                  </h2>
                  {s.intro ? <p className="sc-head__body">{rich(s.intro)}</p> : null}
                </div>
                <ol className={cn("sc-steps", `sc-steps--${s.steps.length}`)}>
                  {s.steps.map((st, i) => (
                    <li key={st.title} className="sc-steps__item">
                      {supplied(st.media) ? <MediaFrame id={st.media} fig={`${n}.${i + 1}`} showCaption={false} sizes="(min-width: 960px) 30vw, 100vw" /> : null}
                      <p className="sc-steps__n mono">{String(i + 1).padStart(2, "0")}</p>
                      <h3 className="sc-steps__title">{st.title}</h3>
                      <p className="sc-steps__body">{rich(st.body)}</p>
                    </li>
                  ))}
                </ol>
              </section>
            );
          }
          case "mosaic": {
            const items = s.items.filter((it) => supplied(it.id));
            if (!items.length) return null;
            n += 1;
            const [lead, ...rest] = items;
            if (s.layout === "sequence") {
              // Whole recording first (full width, native controls), then stills that open at full size.
              return (
                <section key={s.id} id={s.id} className="sc sc--mosaic" aria-label={s.title}>
                  <Head n={n} title={s.title} body={s.body} />
                  <div className="sequence">
                    {items.map((it, i) => {
                      const isImage = getMedia(it.id).kind === "image";
                      const sizes = i === 0 ? "(min-width: 1200px) 90vw, 100vw" : "(min-width: 900px) 46vw, 100vw";
                      return (
                        <div key={it.id} className={cn("sequence__item", i === 0 && "sequence__item--lead")}>
                          {isImage ? (
                            <MediaZoom id={it.id} fig={`${n}.${i + 1}`} sizes={sizes} hint="Enlarge" />
                          ) : (
                            <MediaFrame id={it.id} fig={`${n}.${i + 1}`} sizes={sizes} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            }
            return (
              <section key={s.id} id={s.id} className="sc sc--mosaic" aria-label={s.title}>
                <Head n={n} title={s.title} body={s.body} />
                <div className={cn("mosaic", `mosaic--${items.length}`)}>
                  <figure className="mosaic__lead">
                    <MediaFrame id={lead!.id} fig={`${n}.1`} showCaption={false} sizes="(min-width: 1200px) 60vw, 100vw" />
                    <figcaption className="mosaic__cap">
                      <strong>{lead!.title}</strong>
                    </figcaption>
                  </figure>
                  {rest.map((it, i) => (
                    <figure key={it.id} className="mosaic__item">
                      <MediaFrame id={it.id} fig={`${n}.${i + 2}`} showCaption={false} sizes="(min-width: 1200px) 28vw, 100vw" />
                      <figcaption className="mosaic__cap">
                        <strong>{it.title}</strong>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            );
          }
          case "daynight": {
            const day = supplied(s.day);
            const night = supplied(s.night);
            if (!day && !night) return null;
            n += 1;
            return (
              <section key={s.id} id={s.id} className="sc sc--daynight" aria-label={s.title}>
                <Head n={n} title={s.title} body={s.body} />
                {day && night ? (
                  <DayNight day={s.day} night={s.night} fig={`${n}.1`} />
                ) : (
                  <MediaFrame id={day ? s.day : s.night} fig={`${n}.1`} sizes="(min-width: 1200px) 80vw, 100vw" />
                )}
                <p className="sc-note">{rich(s.note)}</p>
              </section>
            );
          }
          case "behind": {
            const items = s.items.filter(supplied);
            if (!items.length) return null;
            n += 1;
            return (
              <section key={s.id} id={s.id} className="sc sc--behind" aria-label={s.title}>
                <Head n={n} title={s.title} body={s.body} />
                <div className="behind">
                  {items.map((id, i) =>
                    getMedia(id).kind === "image" ? (
                      <MediaZoom key={id} id={id} fig={`${n}.${i + 1}`} sizes="(min-width: 1200px) 50vw, 100vw" hint="Enlarge" />
                    ) : (
                      <MediaFrame key={id} id={id} fig={`${n}.${i + 1}`} sizes="(min-width: 1200px) 50vw, 100vw" />
                    ),
                  )}
                </div>
              </section>
            );
          }
          case "recording": {
            if (!supplied(s.media)) return null;
            n += 1;
            return (
              <section key={s.id} id={s.id} className="sc sc--recording" aria-label={s.title}>
                <Head n={n} title={s.title} body={s.body} />
                <MediaFrame id={s.media} fig={`${n}.1`} showCaption={false} sizes="(min-width: 1200px) 75vw, 100vw" />
              </section>
            );
          }
        }
      })}
    </>
  );
}
