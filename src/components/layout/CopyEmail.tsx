"use client";

import { useRef, useState } from "react";

/** Discreet copy-address control with a polite live-region result (success or failure). */
export function CopyEmail({ address }: { address: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number | undefined>(undefined);

  const done = (s: "copied" | "failed") => {
    setState(s);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2500);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      done("copied");
    } catch {
      // Fallback: select the visible address so Ctrl/Cmd+C works.
      const el = document.getElementById("footer-email");
      if (el) {
        const r = document.createRange();
        r.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(r);
      }
      done("failed");
    }
  };

  return (
    <>
      <button type="button" className="copy-email" onClick={copy} aria-label={`Copy email address ${address}`}>
        Copy
      </button>
      <span className="copy-email__status label" role="status" aria-live="polite">
        {state === "copied" ? "Copied" : state === "failed" ? "Press Ctrl/Cmd+C to copy" : ""}
      </span>
    </>
  );
}
