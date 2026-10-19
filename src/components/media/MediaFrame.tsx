import Image from "next/image";
import { getMedia, type MediaId } from "@/content/media";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { showDevNotes } from "@/content/site";
import { VideoMedia } from "./VideoMedia";
import { cn } from "@/lib/utils";
import type { AspectRatio } from "@/types/media";

interface MediaFrameProps {
  id: MediaId;
  /** Figure number shown on placeholders and captions, e.g. "03.2". */
  fig?: string;
  /** Load eagerly (above-the-fold hero media). */
  priority?: boolean;
  /** Responsive sizes hint for next/image. */
  sizes?: string;
  /** Show the asset caption below the frame. */
  showCaption?: boolean;
  /** Override the aspect ratio defined in the registry. */
  aspect?: AspectRatio;
  /** Clip-path reveal on scroll. */
  reveal?: boolean;
  className?: string;
}

/**
 * The only component that renders project media. Reads the central
 * registry, so swapping a placeholder for a real file is a data change.
 */
export function MediaFrame({
  id,
  fig,
  priority,
  sizes = "100vw",
  showCaption = true,
  aspect,
  reveal = true,
  className,
}: MediaFrameProps) {
  const asset = getMedia(id);
  const ratio = aspect ?? asset.aspect;
  const pending = !asset.src;
  // Media that has not been supplied is simply left out for visitors (dev notes can still show placeholders).
  if (pending && !showDevNotes) return null;

  let body: React.ReactNode;
  if (pending) {
    body = <MediaPlaceholder asset={aspect ? { ...asset, aspect } : asset} fig={fig} />;
  } else if (asset.kind === "image") {
    body = (
      <Image
        src={asset.src!}
        alt={asset.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("media-frame__img", asset.fit === "contain" && "media-frame__img--contain")}
      />
    );
  } else {
    body = <VideoMedia asset={asset} />;
  }

  return (
    <figure className={cn("media-frame", pending && "is-pending", className)}>
      <div className="media-frame__box" style={{ aspectRatio: ratio }} data-reveal={reveal ? "media" : undefined}>
        {body}
      </div>
      {showCaption && asset.caption && !pending ? (
        <figcaption className="media-frame__caption">
          {fig ? <span className="label">Fig. {fig}</span> : null}
          <span>{asset.caption}</span>
        </figcaption>
      ) : null}
    </figure>
  );
}
