"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface JumpItem {
  id: string;
  label: string;
}

/**
 * Sticky row of section links for a long case study, so a presenter can jump straight to the mechanism,
 * the build or the result. Marks the section in view; scrolls sideways on narrow screens.
 */
export function JumpBar({ items, label = "Jump to a section", className }: { items: readonly JumpItem[]; label?: string; className?: string }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;
    let raf = 0;
    /* The current section is the last one (in page order) whose top has passed the reading line. Sections may nest. */
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.4;
      let cur: string | null = null;
      for (const el of els) if (el.getBoundingClientRect().top <= line) cur = el.id;
      setActive(cur);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [items]);

  return (
    <nav className={cn("jump", className)} aria-label={label}>
      <div className="container">
        <ul className="jump__list">
          {items.map((i) => (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                className={cn("jump__link", active === i.id && "is-active")}
                aria-current={active === i.id ? "location" : undefined}
              >
                {i.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
