"use client";

import { useId, useState, type ReactNode } from "react";

interface ComparisonSliderProps {
  before: ReactNode;
  after: ReactNode;
  beforeLabel: string;
  afterLabel: string;
  /** CSS aspect-ratio for the frame. */
  aspect?: string;
}

/**
 * Draggable before/after comparison. The control is a native range input
 * laid over the frame: pointer, touch and keyboard (arrows, Home/End) all
 * work without custom event handling.
 */
export function ComparisonSlider({ before, after, beforeLabel, afterLabel, aspect = "4 / 3" }: ComparisonSliderProps) {
  const [pos, setPos] = useState(50);
  const id = useId();

  return (
    <div className="compare" style={{ "--pos": `${pos}%`, aspectRatio: aspect } as React.CSSProperties}>
      <div className="compare__layer compare__layer--before">{before}</div>
      <div className="compare__layer compare__layer--after">{after}</div>
      <div className="compare__handle" aria-hidden="true">
        <span className="compare__knob">⟷</span>
      </div>
      <span className="compare__tag compare__tag--before label" aria-hidden="true">
        {beforeLabel}
      </span>
      <span className="compare__tag compare__tag--after label" aria-hidden="true">
        {afterLabel}
      </span>
      <label htmlFor={id} className="visually-hidden">
        Comparison divider: {beforeLabel} on the left, {afterLabel} on the right
      </label>
      <input
        id={id}
        className="compare__input"
        type="range"
        min={0}
        max={100}
        step={1}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-valuetext={`${pos}% ${beforeLabel}, ${100 - pos}% ${afterLabel}`}
      />
    </div>
  );
}
