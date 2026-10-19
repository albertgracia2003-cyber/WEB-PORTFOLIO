/**
 * Media model. Every visual on the site is a "slot" registered in
 * `src/content/media.ts`. A slot without `src` renders a labelled
 * development placeholder; adding `src` (and dimensions) swaps in the
 * real asset everywhere the slot is used — no component changes needed.
 */

export type MediaKind = "image" | "video";

/** CSS aspect-ratio string "W / H". Videos and images use their exact source ratio (e.g. "1918 / 1024"). */
export type AspectRatio = `${number} / ${number}`;

export interface MediaAsset {
  kind: MediaKind;
  /** Short human label shown on the placeholder and in the asset manifest. */
  label: string;
  /** Recommended file name for the real asset (relative to /public/assets/<project>/). */
  expected: string;
  aspect: AspectRatio;
  /** Accessible description. Required once `src` is set; leave "" for purely decorative media. */
  alt: string;
  /** Public path, e.g. "/assets/ortesis-studio/ortesis-machine-overview.webp". Undefined = pending. */
  src?: string;
  /** Intrinsic pixel size of the real asset (required for images to avoid layout shift). */
  width?: number;
  height?: number;
  /** Optional WebM (VP9) version of a video, offered before the MP4 `src`. */
  srcWebm?: string;
  /** Poster frame for videos (public path). */
  poster?: string;
  /** Visible caption under the media. */
  caption?: string;
  /** Videos: "ambient" = short muted loop (default); "controls" = recording with native player controls. */
  playback?: "ambient" | "controls";
  /** Captions/subtitles file for videos with meaningful speech. */
  captionsTrack?: string;
  /** Images: "contain" shows the whole asset inside the frame (logos, cut-outs) instead of cropping to fill it. */
  fit?: "cover" | "contain";
  /** Placeholder tone so it sits naturally in its section. */
  tone?: "dark" | "light" | "warm";
}
