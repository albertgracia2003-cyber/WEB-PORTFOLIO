# Albert Gracia — Engineering & Computational Design

Personal portfolio. Next.js (App Router) · React 19 · TypeScript strict · CSS design tokens · no CMS, no backend.

## Run locally

```bash
npm install
npm run dev            # http://localhost:3000
```

Before committing or deploying:

```bash
npm run check          # typecheck + lint + production build
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` once the domain is known.

## Working on content

- Facts, links, experience → `src/content/` (see `docs/CONTENT_NOTES.md` for what still needs confirming).
- Images / video / 3D → `docs/ASSET_MANIFEST.md`: drop optimised files in `public/assets/<project>/`, then set `src` in `src/content/media.ts`.
- Dev notes (amber dashed boxes) and asset paths only show in development. `/privacy` and `/legal` end with a dev note listing the facts still to confirm.

## Deploy (when approved)

The site is a **static export** (`output: "export"` in `next.config.ts`). `npm run build` writes the deployable site to `out/`; nothing else is served.

**Cloudflare Pages (Free):** build command `npx next build`, output directory `out`, `NODE_VERSION` from `.node-version`, build variable `NEXT_PUBLIC_SITE_URL` (the final domain). Do not set `NEXT_PUBLIC_SHOW_DEV_NOTES`. With Direct Upload, upload the contents of `out/` only, never the project folder. Response headers are in `public/_headers`. See `docs/PUBLICATION_CHECKLIST.md`.

Nothing has been deployed.

## Docs

- `docs/PROJECT_STRUCTURE.md` — architecture and how to add a project
- `docs/ASSET_MANIFEST.md` — all 40 media slots and export settings
- `docs/CONTENT_NOTES.md` — content rules and open questions
- `docs/SKILLS_SETUP.md` — Claude Code skills to install
- `docs/BUILD_REPORT.md` — what was verified and how
- `docs/PUBLICATION_CHECKLIST.md` — pre-publication status, open facts and Cloudflare checks
