# Publication checklist — Cloudflare Pages Free (static export)

Status date: 19 October 2026. Nothing here has been published, pushed or deployed. This is a working checklist, not legal advice or certification.

## A. On your PC (the real build has not been run yet)

From the project folder:

1. `npm install` — creates `package-lock.json` (none exists yet; commit it). Confirm `next` resolves to **16.2.11 or newer** (`npm ls next`).
2. `npm run check` — runs typecheck, lint and the real `next build`. It must finish with no errors.
3. `npm audit --omit=dev` — read the output; do not run `npm audit fix --force`. Then `npx license-checker --production --summary` and add any bundled package beyond Next.js/React to `public/licenses/THIRD-PARTY-NOTICES.txt`.
3b. `npm run check` downloads Geist/Geist Mono from Google Fonts at build time (needs internet); the built site then serves them itself.
4. Inspect `out/`:
   - contains `index.html`, `404.html`, `_headers`, `robots.txt`, `sitemap.xml`, `privacy.html`, `legal.html`, `about.html`, `contact.html`, `work/`, `computational-design/`, `_next/`, `assets/`;
   - does **not** contain `hero-lab`, `media-source`, `_removed-before-publication`, `.env*`, `.git`, `*.blend`, `*.stl` other than the viewer files listed in `docs/ASSET_MANIFEST.md`;
   - `robots.txt` and `sitemap.xml` exist (if `next build` fails on them under `output: "export"`, report the exact message); `licenses/OFL-Geist.txt` and `licenses/THIRD-PARTY-NOTICES.txt` are present; no `*.agm.gz` or `machine/` folder.
   - with `NEXT_PUBLIC_SITE_URL` set: `out/robots.txt` names `<url>/sitemap.xml`, `out/sitemap.xml` lists 10 URLs, each page has a canonical link; without it the sitemap is empty.
   - largest single file < 25 MiB; total file count < 20,000. (`Get-ChildItem out -Recurse -File | Sort Length -Desc | Select -First 5 Name,Length`)
5. Serve `out/` locally (`npx serve out`) and open `/`, `/privacy`, `/legal`, `/about`, a project page and a non-existent URL (should show the 404 page).
6. If you ever set `NEXT_PUBLIC_SITE_URL`, build again — canonical URL, sitemap and robots depend on it at build time.

## B. Cloudflare — manual checks (dashboard wording may change; verify against the live UI)

**Plan / cost**
- Account Home → Billing → Subscriptions: only Free plans listed. No Workers Paid, R2, Stream, Images, Zero Trust paid seats, Argos, Load Balancing, Advanced Certificate Manager, domain add-ons.
- Billing → Payment methods: note whether a card is on file (a card does not by itself incur charges).
- Billing → Billable usage / Notifications: set any budget or usage alert you want. These are alerts; Cloudflare does not document a hard spending cap — do not rely on them as one.
- Workers & Pages: the project list shows only the Pages project (no Workers, no Functions). The repo has no `functions/` directory and no `_worker.js`.

**Project type and deployment controls**
- Pages → project → Settings: note whether it is **Git-connected** or **Direct Upload** (cannot be switched afterwards).
- If Git-connected: Settings → Builds → Branch control. Set the production branch deliberately; turn off automatic production deployments if you want manual control; limit preview builds to chosen branches or disable them. Do not push to the production branch until A is done.
- Preview deployments have public URLs unless you enable access protection; keep the project private-repo-only and do not share preview URLs.
- GitHub: Settings → Applications → Cloudflare Pages → "Only select repositories" containing just this repo.
- Build settings: command `npx next build`, output directory `out`, root `/`. Environment variables (Production and Preview): `NODE_VERSION` = `22.16.0` (or leave to `.node-version`), `NEXT_PUBLIC_SITE_URL` = the final https URL once decided; **`NEXT_PUBLIC_SHOW_DEV_NOTES` must be absent**.

**Privacy-relevant settings (Privacy page assumes these)**
- Web Analytics: off / not enabled for this site (no beacon).
- Bot Fight Mode, Rocket Loader, Email Address Obfuscation, Auto Minify, Cloudflare Zaraz: off unless you consciously accept them and update `/privacy`.
- Custom domain (if any): SSL/TLS mode Full (strict); Always Use HTTPS on; decide on HSTS (do not enable includeSubDomains/preload unless you are sure).
- Note the data-retention/log settings shown for the account; copy exact retention periods into `/privacy` only if you can read them in Cloudflare's own documentation.

**Account security**
- Profile → Authentication: MFA enabled (authenticator app or security key), backup codes stored offline, not SMS-only.
- Profile → API Tokens: no unused tokens; any token has minimum scope (Account → Cloudflare Pages → Edit), an expiry, and is not stored in the repo. Prefer no Global API Key use.
- Account → Members: only you.
- Audit log: skim for unexpected changes.

**On a preview/first deployment, before the real domain**
- `curl -sI https://<preview-or-site>/ | grep -i set-cookie` returns nothing, and DevTools → Application → Cookies is empty. If a cookie appears, identify the Cloudflare feature and describe it on `/privacy` rather than disabling a security feature.
- View source: no `cloudflareinsights.com` script (Web Analytics off).
- `/404` check: open a non-existent URL → the site's own 404 page with HTTP status 404.
- DevTools → Console: no `Content-Security-Policy-Report-Only` violations on `/`, a project page, `/privacy`, `/legal` (open the 3D viewer and the video sections). If clean, rename the header in `public/_headers` to `Content-Security-Policy`, rebuild.
- Network tab: all requests same-origin; no third-party hosts; response headers include `X-Frame-Options: DENY`, `Permissions-Policy`.
- `/robots.txt`, `/sitemap.xml`, `/nonexistent` (404 page) behave as expected.

## C. Final status

**Completed and verified (sandbox harness only — not the real Next.js build)**
- /privacy and /legal pages with footer links; AED image replaced with the AI-generated illustration and required caption; old image removed; unused public assets moved out; static-export config, `_headers`, robots/sitemap code added.
- All 11 routes × desktop/mobile × light/dark render under an enforced CSP with no violations, no third-party requests, no horizontal overflow; storage use limited to the `ag-theme` key after the toggle is pressed.

**Still unresolved**
- Real `npm install`, `npm run check`, `npm audit`, `out/` inspection (section A).
- Cloudflare account state (section B).
- Items listed under "Exact questions" in the final reply and in `docs/CONTENT_NOTES.md`.

**At go-live (same commit as the deployment):** set `hostedOn: "cloudflare-pages"` in `src/content/site.ts` so `/privacy` says "hosted on Cloudflare Pages" instead of "being prepared for hosting"; set `NEXT_PUBLIC_SITE_URL`; re-read the Cloudflare documents linked on `/privacy` and update the date.

**Whether the actual production export has passed:** No. It has not been run. Run section A on your PC.
