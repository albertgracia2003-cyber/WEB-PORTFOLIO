import { MediaFrame } from "@/components/media/MediaFrame";
import { getMedia } from "@/content/media";
import { cn } from "@/lib/utils";

/**
 * Where each numbered marker sits on the exploded view, as % of the image (897 × 1360), in the order of the six ideas
 * (`works` in tiri-case.ts, shown 01 – 06 beside the figure). The labels and leader lines of the original drawing were removed,
 * so no lines cross; the markers only point at the part that illustrates each idea.
 */
const markers: readonly (readonly [number, number])[] = [
  [44.0, 57.5], // 1 Locate by shape — the instruments
  [56.5, 41.7], // 2 Restrain with one plane — the bridge
  [59.6, 72.4], // 3 One thumb press — the latch slider and push tab
  [21.7, 71.7], // 4 Keyed insert — the insert (screws)
  [59.4, 89.2], // 5 Made for the hand — the front sweep
  [81.6, 73.5], // 6 Made for moulding — the insert shell
];

/** Exploded view with six numbered markers; the list 01 – 06 beside it on the page explains them. */
export function ExplodedFigure({ fig, className, sizes }: { fig: string; className?: string; sizes?: string }) {
  const caption = getMedia("tiri-exploded").caption;
  return (
    <figure className={cn("tiri-exploded", className)} data-reveal>
      <div className="tiri-exploded__stage">
        <MediaFrame id="tiri-exploded" showCaption={false} reveal={false} sizes={sizes} />
        <ol className="tiri-exploded__marks" aria-hidden="true">
          {markers.map(([x, y], i) => (
            <li key={i} style={{ left: `${x}%`, top: `${y}%` }}>
              {i + 1}
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="media-frame__caption">
        <span className="label">Fig. {fig}</span>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}
