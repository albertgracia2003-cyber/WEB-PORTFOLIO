import Image from "next/image";
import { getMedia } from "@/content/media";

/**
 * Colour portrait used in the About sections (registry slot `profile-portrait`).
 * Square crop, natural colours, no overlay text. Explicit dimensions avoid layout shift.
 */
export function Portrait({ className, priority = false }: { className?: string; priority?: boolean }) {
  const p = getMedia("profile-portrait");
  if (!p.src) return null;
  return (
    <figure className={className}>
      <Image
        src={p.src}
        alt={p.alt}
        width={p.width}
        height={p.height}
        priority={priority}
        sizes="(min-width: 900px) 30vw, (min-width: 600px) 60vw, 92vw"
        className="portrait__img"
      />
    </figure>
  );
}
