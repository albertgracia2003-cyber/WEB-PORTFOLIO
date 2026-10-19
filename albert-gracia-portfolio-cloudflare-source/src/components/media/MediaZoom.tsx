"use client";

import { useCallback, useEffect, useRef } from "react";
import { getMedia, type MediaId } from "@/content/media";
import { MediaFrame } from "./MediaFrame";
import type { AspectRatio } from "@/types/media";

/**
 * A single image that can be opened at full resolution in a native <dialog>
 * (focus is trapped and restored by the browser; Escape closes). Inside the
 * viewer the image keeps its natural size and the frame scrolls, so wide
 * screenshots such as a node graph stay readable.
 */
export function MediaZoom({
  id,
  fig,
  sizes,
  aspect,
  className,
  hint = "Enlarge",
  showCaption = true,
}: {
  id: MediaId;
  fig?: string;
  sizes?: string;
  aspect?: AspectRatio;
  className?: string;
  hint?: string;
  /** Show the caption under the inline image (the enlarged view always shows it). */
  showCaption?: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const asset = getMedia(id);
  const open = () => dialogRef.current?.showModal();
  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onClose = () => d.querySelector(".zoom__scroll")?.scrollTo(0, 0);
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, []);

  if (!asset.src) return <MediaFrame id={id} fig={fig} sizes={sizes} aspect={aspect} className={className} />;

  return (
    <div className={className}>
      <button type="button" className="zoom__open" onClick={open} aria-haspopup="dialog">
        <MediaFrame id={id} fig={fig} sizes={sizes} aspect={aspect} showCaption={showCaption} />
        <span className="zoom__hint" aria-hidden="true">
          <svg viewBox="0 0 16 16">
            <path d="M9.5 2.5h4v4M13.5 2.5 9 7M6.5 13.5h-4v-4M2.5 13.5 7 9" />
          </svg>
          {hint}
        </span>
        <span className="visually-hidden">Open “{asset.label}” at full size</span>
      </button>

      <dialog
        ref={dialogRef}
        className="lightbox zoom"
        aria-label={`${asset.label} — full size`}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="lightbox__inner">
          <div className="lightbox__bar">
            <p className="label">{asset.label}</p>
            <button type="button" className="lightbox__btn" onClick={close} autoFocus>
              Close <span aria-hidden="true">✕</span>
            </button>
          </div>
          <div className="zoom__scroll" tabIndex={0} aria-label="Scrollable full-size image">
            {/* Natural size on purpose: the viewer exists to show detail that page-width rendering loses. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset.src} alt={asset.alt} width={asset.width} height={asset.height} className="zoom__img" loading="lazy" decoding="async" />
          </div>
          {asset.caption ? <p className="zoom__caption">{asset.caption}</p> : null}
        </div>
      </dialog>
    </div>
  );
}
