"use client";

import { useEffect, useState } from "react";
import { cn, pad } from "@/lib/utils";

export interface Chapter {
  id: string;
  title: string;
}

/** Sticky chapter index for long case studies. Highlights the chapter in view. */
export function ChapterNav({ chapters, label = "Chapters" }: { chapters: readonly Chapter[]; label?: string }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [chapters]);

  return (
    <nav className="chapter-nav" aria-label={label}>
      <p className="label chapter-nav__title">{label}</p>
      <ol>
        {chapters.map((c, i) => (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              className={cn("chapter-nav__link", active === c.id && "is-active")}
              aria-current={active === c.id ? "location" : undefined}
            >
              <span className="mono">{pad(i + 1)}</span>
              <span>{c.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
