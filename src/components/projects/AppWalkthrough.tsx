"use client";

import { useRef } from "react";
import { MediaFrame } from "@/components/media/MediaFrame";
import type { MediaId } from "@/content/media";

export interface WalkthroughStep {
  title: string;
  body: string;
  /** Seconds into the recording where the step starts (read from the actual recording). Omit if the step is not shown. */
  at?: number;
  /** Optional further moments inside the step, e.g. the explicit Generate action. */
  marks?: readonly { at: number; label: string }[];
  /** Shown instead of a time when the step is not in the recording. */
  absentNote?: string;
}

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/**
 * A screen recording with chapter buttons that jump the player to each step.
 * The video keeps its native controls; the buttons are a convenience, not a replacement.
 */
export function AppWalkthrough({ id, fig, steps, label }: { id: MediaId; fig: string; steps: readonly WalkthroughStep[]; label: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  const seek = (t: number) => {
    const video = rootRef.current?.querySelector("video");
    if (!video) return;
    const go = () => {
      video.currentTime = t;
      void video.play().catch(() => undefined);
    };
    if (video.readyState >= 1) go();
    else {
      video.addEventListener("loadedmetadata", go, { once: true });
      video.load();
    }
    video.focus({ preventScroll: true });
  };

  return (
    <div className="walkthrough" ref={rootRef}>
      <MediaFrame id={id} fig={fig} sizes="(min-width: 1200px) 75vw, 100vw" />
      <ol className="walkthrough__steps" aria-label={label}>
        {steps.map((s, i) => (
          <li key={s.title} className={s.at === undefined ? "walkthrough__step is-absent" : "walkthrough__step"}>
            {s.at !== undefined ? (
              <button type="button" className="walkthrough__jump" onClick={() => seek(s.at!)} aria-label={`Play from ${clock(s.at)}: ${s.title}`}>
                <span className="walkthrough__time mono">{clock(s.at)}</span>
                <span className="walkthrough__n mono">{String(i + 1).padStart(2, "0")}</span>
                <span className="walkthrough__title">{s.title}</span>
              </button>
            ) : (
              <p className="walkthrough__jump walkthrough__jump--static">
                <span className="walkthrough__time mono">{s.absentNote ?? "—"}</span>
                <span className="walkthrough__n mono">{String(i + 1).padStart(2, "0")}</span>
                <span className="walkthrough__title">{s.title}</span>
              </p>
            )}
            <p className="walkthrough__body">{s.body}</p>
            {s.marks?.map((m) => (
              <button key={m.at} type="button" className="walkthrough__mark" onClick={() => seek(m.at)} aria-label={`Play from ${clock(m.at)}: ${m.label}`}>
                <span className="mono">{clock(m.at)}</span> {m.label}
              </button>
            ))}
          </li>
        ))}
      </ol>
    </div>
  );
}
