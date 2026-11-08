"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

function currentTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function applyTheme(next: Theme, animate: boolean) {
  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (animate && !reduce) {
    root.classList.add("theme-switching");
    window.setTimeout(() => root.classList.remove("theme-switching"), 420);
  }
  root.setAttribute("data-theme", next);
  window.dispatchEvent(new CustomEvent("themechange", { detail: next }));
}

/**
 * Two-state sun/moon switch. Both icons are always rendered and CSS shows
 * the right one from [data-theme], so server and client markup match
 * (no hydration warning) and the icon is correct before React loads.
 */
export function ThemeToggle({ className, withLabel = false }: { className?: string; withLabel?: boolean }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    // Sync React state with the attribute the head script already set.
    const sync = () => setTheme(currentTheme());
    const id = requestAnimationFrame(sync);

    // Follow OS changes only while the visitor has not chosen explicitly.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystem = (e: MediaQueryListEvent) => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(THEME_STORAGE_KEY);
      } catch {
        /* storage unavailable */
      }
      if (stored) return;
      applyTheme(e.matches ? "dark" : "light", true);
      sync();
    };
    window.addEventListener("themechange", sync);
    mq.addEventListener("change", onSystem);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("themechange", sync);
      mq.removeEventListener("change", onSystem);
    };
  }, []);

  const toggle = () => {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    applyTheme(next, true);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* storage unavailable: theme still applies for this page view */
    }
  };

  return (
    <button
      type="button"
      className={cn("theme-toggle", withLabel && "theme-toggle--labelled", className)}
      onClick={toggle}
      aria-label="Dark theme"
      aria-pressed={theme === null ? undefined : theme === "dark"}
    >
      <span className="theme-toggle__track" aria-hidden="true">
        <span className="theme-toggle__thumb">
          <svg className="theme-toggle__sun" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
          </svg>
          <svg className="theme-toggle__moon" viewBox="0 0 24 24">
            <path d="M19.5 14.6A7.8 7.8 0 0 1 9.4 4.5a7.8 7.8 0 1 0 10.1 10.1Z" />
          </svg>
        </span>
      </span>
      {withLabel ? <span className="theme-toggle__label">Dark theme</span> : null}
    </button>
  );
}
