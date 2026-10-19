"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { primaryNav, isActive } from "@/content/navigation";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Site header and primary navigation.
 *
 * One <nav> serves every width: a row of links on wide screens, a vertical list in a dropdown panel under
 * the header on narrow ones (toggled by the Menu button). Scrolling is left to the browser:
 * - on the homepage, destinations are plain `#section` anchors (native scroll, native back/forward,
 *   `scroll-padding-top` in base.css keeps the heading below the header);
 * - from any other page they are `/#section` links handled by the router, which scrolls to the hash.
 * There is no scroll lock, no focus trap and no custom history handling.
 */
export function Header() {
  const pathname = usePathname() ?? "/";
  const onHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // Homepage section currently under the header (null in the hero and on other pages).
  const [current, setCurrent] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close the menu whenever the route changes (state adjusted during render, not in an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  // One passive scroll listener: frosted header after scrolling, and the section in view on the homepage.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
      if (!onHome) {
        setCurrent(null);
        return;
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let active: string | null = null;
      for (const item of primaryNav) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= 140) active = item.id;
      }
      if (atBottom) active = primaryNav[primaryNav.length - 1]?.id ?? active;
      setCurrent(active);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [onHome, pathname]);

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // While the menu is open: Escape closes it, a press outside the header closes it, and so does
  // tabbing away from it or widening the window until the full bar is shown.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    const onPointer = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) close(false);
    };
    const onFocusIn = (e: FocusEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) close(false);
    };
    const mq = window.matchMedia("(min-width: 1100px)");
    const onWide = () => mq.matches && close(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("focusin", onFocusIn);
    mq.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("focusin", onFocusIn);
      mq.removeEventListener("change", onWide);
    };
  }, [open, close]);

  return (
    <header ref={headerRef} className={cn("site-header", scrolled && "is-scrolled", open && "is-open")}>
      <div className="site-header__inner container">
        <Link href="/" className="site-header__brand" aria-label={`${site.name} — home`}>
          <span className="site-header__mark" aria-hidden="true" />
          <span className="site-header__name">ALBERT GRACIA</span>
        </Link>

        <div className="site-header__right">
          {/* DOM order: Menu button, then the links, so Tab moves from the button into the open list. */}
          <button
            ref={toggleRef}
            type="button"
            className="site-header__toggle"
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="site-header__toggle-label">{open ? "Close" : "Menu"}</span>
            <span className="site-header__toggle-icon" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
          <nav id="site-nav" className="site-nav" aria-label="Primary">
            <ul className="site-nav__list">
              {primaryNav.map((item) => {
                const onPage = isActive(item, pathname);
                const inView = onHome && current === item.id;
                const href = onHome ? `#${item.id}` : item.href;
                const className = cn("site-nav__link", (onPage || inView) && "is-active");
                const current_ = onPage ? "page" : inView ? "location" : undefined;
                return (
                  <li key={item.id}>
                    {onHome ? (
                      <a href={href} className={className} aria-current={current_} onClick={() => setOpen(false)}>
                        {item.label}
                      </a>
                    ) : (
                      <Link href={href} className={className} aria-current={current_} onClick={() => setOpen(false)}>
                        {item.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
            {/* Very narrow screens: the theme switch lives at the end of the menu instead of the header bar. */}
            <div className="site-nav__theme">
              <ThemeToggle withLabel />
            </div>
          </nav>

          <ThemeToggle className="site-header__theme" />

        </div>
      </div>
    </header>
  );
}
