"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn, pad } from "@/lib/utils";

export interface SequenceStep {
  title: string;
  body: ReactNode;
  /** Optional extra content under the text (e.g. an authentic media thumbnail). */
  aside?: ReactNode;
}

interface ScrollSequenceProps {
  label: string;
  steps: readonly SequenceStep[];
  /** One visual per step, shown in the sticky stage (desktop) or inline (mobile). */
  visuals: readonly ReactNode[];
  className?: string;
}

/**
 * Scroll-driven storytelling without scroll hijacking: text scrolls
 * normally, the sticky stage follows the step currently in the middle
 * of the viewport. Works without JS (first visual + all text) and
 * on mobile (each step carries its own visual inline).
 */
export function ScrollSequence({ label, steps, visuals, className }: ScrollSequenceProps) {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const nodes = stepRefs.current.filter((n): n is HTMLElement => Boolean(n));
    if (!nodes.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const i = Number((entry.target as HTMLElement).dataset.step);
            if (!Number.isNaN(i)) setActive(i);
          }
        }
      },
      { rootMargin: "-48% 0px -48% 0px", threshold: 0 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  const goTo = (i: number) => {
    const node = stepRefs.current[i];
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    node.querySelector<HTMLElement>("h3")?.focus({ preventScroll: true });
  };

  return (
    <section className={cn("scroll-seq", className)} aria-label={label}>
      <div className="scroll-seq__stage-wrap">
        <div className="scroll-seq__stage">
          <div className="scroll-seq__visuals">
            {visuals.map((v, i) => (
              <div
                key={i}
                className={cn("scroll-seq__visual", i === active && "is-active")}
                aria-hidden={i === active ? undefined : true}
              >
                {v}
              </div>
            ))}
          </div>
          <ol className="scroll-seq__rail" aria-label={`${label} — steps`}>
            {steps.map((s, i) => (
              <li key={s.title}>
                <button
                  type="button"
                  className={cn("scroll-seq__rail-btn", i === active && "is-active")}
                  aria-current={i === active ? "step" : undefined}
                  onClick={() => goTo(i)}
                >
                  <span className="mono">{pad(i + 1)}</span>
                  <span className="scroll-seq__rail-label">{s.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="scroll-seq__steps">
        {steps.map((s, i) => (
          <article
            key={s.title}
            ref={(el) => {
              stepRefs.current[i] = el;
            }}
            data-step={i}
            className={cn("scroll-seq__step", i === active && "is-active")}
          >
            <div className="scroll-seq__inline">{visuals[i]}</div>
            <p className="label">
              Step {pad(i + 1)} / {pad(steps.length)}
            </p>
            <h3 className="h2 scroll-seq__title" tabIndex={-1}>
              {s.title}
            </h3>
            <div className="prose">{s.body}</div>
            {s.aside ? <div className="scroll-seq__aside">{s.aside}</div> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
