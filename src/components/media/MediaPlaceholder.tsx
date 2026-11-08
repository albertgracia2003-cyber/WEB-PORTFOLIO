import type { MediaAsset } from "@/types/media";
import { showDevNotes } from "@/content/site";
import { cn } from "@/lib/utils";

const kindLabel: Record<MediaAsset["kind"], string> = {
  image: "Photograph",
  video: "Video",
};

/** Stable small hash so each stage gets its own lighting without randomness. */
function variantOf(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % 4;
}

function isCad(asset: MediaAsset) {
  return /cad|nodes|interface|screenshot|recording/i.test(asset.label);
}

/** Abstract glyph per media type — deliberately generic, never a depiction of the project. */
function Glyph({ asset }: { asset: MediaAsset }) {
  if (asset.kind === "video") {
    return (
      <svg className="stage-glyph stage-glyph--video" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="44" fill="var(--color-pearl-blue)" />
        <circle cx="54" cy="54" r="36" fill="var(--color-surface-elevated)" opacity="0.7" />
        <circle cx="60" cy="60" r="44" fill="none" stroke="var(--stage-line)" />
        <path d="M52 44 L78 60 L52 76 Z" fill="var(--color-accent)" />
      </svg>
    );
  }
  if (isCad(asset)) {
    return (
      <svg className="stage-glyph stage-glyph--panel" viewBox="0 0 140 100" aria-hidden="true">
        <rect x="8" y="10" width="124" height="80" rx="7" fill="var(--color-surface-elevated)" />
        <rect x="8" y="10" width="124" height="80" rx="7" fill="none" stroke="var(--stage-line)" />
        <path d="M8 24 H132" stroke="var(--stage-line)" />
        <circle cx="18" cy="17" r="2.2" fill="var(--color-accent)" />
        <circle cx="26" cy="17" r="2.2" fill="var(--color-metallic-blue)" />
        <path d="M30 70 C 52 36, 76 74, 108 40" fill="none" stroke="var(--color-steel-blue)" strokeWidth="2" />
        <circle cx="30" cy="70" r="3" fill="var(--color-steel-blue)" />
        <circle cx="108" cy="40" r="3" fill="var(--color-accent)" />
      </svg>
    );
  }
  return (
    <svg className="stage-glyph stage-glyph--image" viewBox="0 0 140 110" aria-hidden="true">
      <g transform="rotate(-7 70 55)">
        <rect x="26" y="18" width="88" height="66" rx="5" fill="var(--color-pearl-blue)" opacity="0.7" />
      </g>
      <rect x="22" y="24" width="96" height="70" rx="5" fill="var(--color-surface-elevated)" />
      <rect x="22" y="24" width="96" height="70" rx="5" fill="none" stroke="var(--stage-line)" />
      <path d="M30 84 L56 58 L72 72 L84 62 L110 84 Z" fill="var(--color-metallic-blue)" opacity="0.55" />
      <circle cx="96" cy="42" r="6" fill="var(--color-accent)" />
    </svg>
  );
}

/**
 * Designed media stage used until the original asset exists: gradient
 * studio backdrop, soft floor, an abstract media glyph and a caption chip.
 * Clearly a placeholder — never mistaken for project documentation.
 */
export function MediaPlaceholder({ asset, fig, className }: { asset: MediaAsset; fig?: string; className?: string }) {
  const v = variantOf(asset.label);
  return (
    <div
      className={cn("stage", `stage--v${v}`, className)}
      role="img"
      aria-label={`Placeholder for ${asset.label}. Original ${kindLabel[asset.kind].toLowerCase()} in preparation.`}
    >
      <span className="stage__floor" aria-hidden="true" />
      <span className="stage__glow" aria-hidden="true" />
      <div className="stage__object" aria-hidden="true">
        <Glyph asset={asset} />
        <span className="stage__shadow" />
      </div>
      <div className="stage__head" aria-hidden="true">
        <span>{fig ? `Fig. ${fig}` : "Fig."}</span>
        <span className="stage__ratio">{asset.aspect.replace(/ /g, "")}</span>
      </div>
      <div className="stage__chip" aria-hidden="true">
        <span className="stage__dot" />
        <span className="stage__chip-text">
          <span className="stage__title">{asset.label}</span>
          <span className="stage__status">
            {showDevNotes ? `${kindLabel[asset.kind]} pending → ${asset.expected}` : `${kindLabel[asset.kind]} in preparation`}
          </span>
        </span>
      </div>
    </div>
  );
}
