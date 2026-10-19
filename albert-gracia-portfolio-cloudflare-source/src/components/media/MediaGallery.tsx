"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MediaId } from "@/content/media";
import { getMedia } from "@/content/media";
import { MediaFrame } from "./MediaFrame";
import { cn, pad } from "@/lib/utils";

interface GalleryItem {
  id: MediaId;
  /** Grid span hint for the editorial layout. */
  span?: "wide" | "tall" | "regular";
}

/**
 * Editorial grid with a native <dialog> lightbox: focus is trapped and
 * restored by the browser, Escape closes, ← / → navigate.
 */
export function MediaGallery({ items, label, figPrefix }: { items: readonly GalleryItem[]; label: string; figPrefix: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };
  const close = useCallback(() => dialogRef.current?.close(), []);
  const step = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onClose = () => setIndex(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    d.addEventListener("close", onClose);
    d.addEventListener("keydown", onKey);
    return () => {
      d.removeEventListener("close", onClose);
      d.removeEventListener("keydown", onKey);
    };
  }, [step]);

  const current = index === null ? null : items[index];

  return (
    <div className="gallery">
      <ul className="gallery__grid" aria-label={label}>
        {items.map((item, i) => (
          <li key={item.id} className={cn("gallery__item", item.span && `gallery__item--${item.span}`)}>
            <button type="button" className="gallery__open" onClick={() => open(i)}>
              <span className="visually-hidden">Open {getMedia(item.id).label} in viewer</span>
              <MediaFrame id={item.id} fig={`${figPrefix}.${i + 1}`} sizes="(min-width: 960px) 50vw, 100vw" showCaption={false} />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label={`${label} viewer`}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        {current && index !== null ? (
          <div className="lightbox__inner">
            <div className="lightbox__bar">
              <p className="label" aria-live="polite">
                {pad(index + 1)} / {pad(items.length)} — {getMedia(current.id).label}
              </p>
              <button type="button" className="lightbox__btn" onClick={close} autoFocus>
                Close <span aria-hidden="true">✕</span>
              </button>
            </div>
            <div className="lightbox__media">
              <MediaFrame id={current.id} fig={`${figPrefix}.${index + 1}`} reveal={false} sizes="90vw" />
            </div>
            <div className="lightbox__nav">
              <button type="button" className="lightbox__btn" onClick={() => step(-1)}>
                <span aria-hidden="true">←</span> Previous
              </button>
              <button type="button" className="lightbox__btn" onClick={() => step(1)}>
                Next <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
