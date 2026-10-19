"use client";

import { useState } from "react";
import { MediaFrame } from "@/components/media/MediaFrame";
import type { MediaId } from "@/content/media";

/**
 * Two separate recordings of the same view (day and night). A simple selector swaps which recording is shown;
 * it does not change any lighting — each option is its own rendered clip.
 */
export function DayNight({ day, night, fig }: { day: MediaId; night: MediaId; fig: string }) {
  const [which, setWhich] = useState<"day" | "night">("day");
  return (
    <div className="daynight">
      <div className="daynight__tabs" role="group" aria-label="Choose the recording">
        {(["day", "night"] as const).map((k) => (
          <button key={k} type="button" className="daynight__tab" aria-pressed={which === k} onClick={() => setWhich(k)}>
            {k === "day" ? "Day" : "Night"}
          </button>
        ))}
      </div>
      <MediaFrame key={which} id={which === "day" ? day : night} fig={fig} sizes="(min-width: 1200px) 80vw, 100vw" reveal={false} />
    </div>
  );
}
