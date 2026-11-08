import type { ReactNode } from "react";
import { MediaFrame } from "./MediaFrame";
import type { MediaId } from "@/content/media";
import type { AspectRatio } from "@/types/media";

export interface Pin {
  /** Label shown in the pin (number or letter). */
  n: string | number;
  /** Position as a percentage of the image box. */
  x: number;
  y: number;
  /** Short text shown beside the pin, drawn on the photograph itself. */
  label?: string;
  /** Which side of the pin the label sits on (default right). */
  side?: "left" | "right";
  /** A small dot instead of a lettered disc: for part names drawn on a photograph. */
  dot?: boolean;
}

/**
 * A real photograph or render with numbered pins (and optional vector arrows) laid over it.
 * The pins annotate the project's own media; they never stand in for it.
 */
export function AnnotatedFigure({
  id,
  pins,
  aspect,
  position,
  sizes,
  priority,
  overlay,
  viewBox,
}: {
  id: MediaId;
  pins: readonly Pin[];
  aspect?: AspectRatio;
  /** Crop position when `aspect` differs from the image (pins are in percent of the visible box). */
  position?: string;
  sizes?: string;
  priority?: boolean;
  /** Optional SVG children (arrows) drawn in `viewBox` coordinates over the image. */
  overlay?: ReactNode;
  viewBox?: string;
}) {
  return (
    <div className="annot">
      <MediaFrame id={id} aspect={aspect} position={position} sizes={sizes} priority={priority} showCaption={false} reveal={false} />
      {overlay && viewBox ? (
        <svg className="annot__svg" viewBox={viewBox} preserveAspectRatio="none" aria-hidden="true" focusable="false">
          {overlay}
        </svg>
      ) : null}
      <ol className="annot__pins">
        {pins.map((p) => (
          <li
            key={`${p.n}-${p.label ?? ""}`}
            className={p.dot ? "annot__pin annot__pin--dot" : "annot__pin"}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            data-label={p.label}
            data-side={p.side}
          >
            <span aria-hidden="true">{p.dot ? "" : p.n}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
