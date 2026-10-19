"use client";

import { useEffect, useRef, useState } from "react";
import type { MediaAsset } from "@/types/media";

/**
 * Project video.
 * - "ambient" (default): short, muted, looping clip that plays only while
 *   visible, never autoplays for reduced-motion users, and always offers a
 *   pause / play control (WCAG 2.2.2).
 * - "controls": explanatory recording with native controls; never autoplays
 *   or loops.
 * Both: the file is only attached when the frame comes near the viewport
 * (poster until then). One video plays at a time: starting any video pauses
 * the others, and among the visible ambient loops only the most visible one
 * autoplays (the rest keep their poster and play button). Nothing autoplays
 * while a recording with controls is playing.
 */

const registry = new Set<HTMLVideoElement>();
/** Ambient loops eligible for autoplay, with their current visible fraction. */
const ambientRatios = new Map<HTMLVideoElement, number>();
const recordingPlaying = () => [...registry].some((v) => v.controls && !v.paused);
let arbitrateQueued = false;
function arbitrate() {
  if (arbitrateQueued) return;
  arbitrateQueued = true;
  requestAnimationFrame(() => {
    arbitrateQueued = false;
    let best: HTMLVideoElement | null = null;
    let bestRatio = 0.3; // needs to be reasonably in view
    ambientRatios.forEach((r, v) => {
      if (r > bestRatio && v.dataset.userPaused !== "true") {
        best = v;
        bestRatio = r;
      }
    });
    ambientRatios.forEach((_, v) => {
      if (v !== best && !v.paused && v.dataset.userStarted !== "true") v.pause();
    });
    const chosen = best as HTMLVideoElement | null;
    const userPlaying = [...registry].some((v) => !v.paused && v.dataset.userStarted === "true");
    if (chosen && chosen.paused && !recordingPlaying() && !userPlaying) void chosen.play().catch(() => undefined);
  });
}

export function VideoMedia({ asset }: { asset: MediaAsset }) {
  const ref = useRef<HTMLVideoElement>(null);
  const ambient = asset.playback !== "controls";
  const [near, setNear] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  // Attach the source only when the frame approaches the viewport.
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  // <source> children added after mount need an explicit load().
  useEffect(() => {
    if (near) ref.current?.load();
  }, [near]);

  // One video at a time; keep the play/pause state in sync.
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    registry.add(video);
    const onPlay = () => {
      registry.forEach((v) => {
        if (v !== video && !v.paused) {
          v.dataset.userStarted = "false";
          v.pause();
        }
      });
      setPlaying(true);
    };
    const onPause = () => setPlaying(false);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    return () => {
      registry.delete(video);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  // Ambient clips: report how visible they are; the page-wide arbiter picks the one to autoplay.
  // Recordings with controls: pause when scrolled away.
  useEffect(() => {
    const video = ref.current;
    if (!video || !near) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (!entry.isIntersecting && !video.paused) {
          video.dataset.userStarted = "false";
          video.pause();
        }
        if (ambient && !reduce) {
          ambientRatios.set(video, entry.isIntersecting ? entry.intersectionRatio : 0);
          arbitrate();
        }
      },
      { threshold: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1] },
    );
    io.observe(video);
    return () => {
      io.disconnect();
      ambientRatios.delete(video);
    };
  }, [near, ambient]);

  useEffect(() => {
    const video = ref.current;
    if (video) video.dataset.userPaused = userPaused ? "true" : "false";
  }, [userPaused]);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      setUserPaused(false);
      video.dataset.userStarted = "true"; // a manual play isn't overridden by the autoplay arbiter
      if (!near) setNear(true);
      void video.play().catch(() => undefined);
    } else {
      setUserPaused(true);
      video.dataset.userStarted = "false";
      video.pause();
    }
  };

  return (
    <div className={ambient ? "video-media" : "video-media video-media--controls"}>
      <video
        ref={ref}
        className="media-frame__img"
        poster={asset.poster}
        muted={ambient}
        loop={ambient}
        controls={!ambient}
        playsInline
        preload={near ? "metadata" : "none"}
        aria-label={asset.alt || undefined}
      >
        {near && asset.srcWebm ? <source src={asset.srcWebm} type="video/webm" /> : null}
        {near ? <source src={asset.src} type="video/mp4" /> : null}
        {asset.captionsTrack ? <track kind="captions" src={asset.captionsTrack} srcLang="en" default /> : null}
      </video>
      {ambient ? (
        <button type="button" className="video-media__toggle" onClick={toggle} aria-pressed={!playing}>
          <span aria-hidden="true">{playing ? "❚❚" : "▶"}</span>
          <span className="visually-hidden">{playing ? "Pause video" : "Play video"}</span>
        </button>
      ) : null}
    </div>
  );
}
