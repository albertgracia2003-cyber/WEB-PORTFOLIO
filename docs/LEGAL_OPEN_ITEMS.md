# Legal and privacy — open items (internal, not published)

Status 19 October 2026. The public pages `/privacy` and `/legal` are drafted from what the repository actually does and from Cloudflare's and Google's own published documents (read 19 Oct 2026). They are **not finalised** and are not a legal certification. This file lists what the pages assume and what could not be verified.

## A. Statements on the pages that depend on facts outside the repository

| Page statement | What it depends on | How to verify |
|---|---|---|
| "No analytics, advertising or tracking code" (code) / "I do not use this data" (hosting) | Cloudflare **Web Analytics** stays off for the Pages project (when on, Cloudflare injects a JavaScript beacon at the next deployment) | Pages project → Metrics → Web Analytics shows "Enable", not enabled; page source of the deployed site has no `cloudflareinsights.com` script |
| "Sets no cookies of its own" and the cookies section | No Cloudflare feature that sets cookies is enabled (Bot Fight Mode / Bot Management → `__cf_bm`, challenges → `cf_clearance`, load balancing, rate-limiting rules, Waiting Room …) | After deployment: `curl -sI https://<site>/ \| grep -i set-cookie` and browser DevTools → Application → Cookies must be empty. If a cookie appears, name it on `/privacy` instead of disabling a security feature |
| "Hosted on Cloudflare Pages" | Actual deployment | `site.hostedOn` in `src/content/site.ts` is `null` (page says "being prepared for hosting"). Set it to `"cloudflare-pages"` in the commit that goes live |
| Cloudflare is certified under the Swiss-U.S. DPF; SCCs with Swiss modifications as fallback; DPA incorporated into self-serve terms | Cloudflare's current documents (privacy policy, customer DPA cl. 6.2(c)/6.4, trust-hub page) | Re-read the three linked documents on the day of publication; check Cloudflare's entry at dataprivacyframework.gov. The page attributes these to Cloudflare and states the reading date |
| Cloudflare retention | Cloudflare publishes no single retention period for visitor request data; the page gives its stated criteria only | Nothing to add unless Cloudflare publishes a figure for the services you use. Do not invent one |
| Google/Gmail description (provider, countries, DPF/SCC statement) | Correspondence goes through the personal Gmail account albertgracia2003@gmail.com | Confirm you do not forward the mailbox elsewhere, use other providers, or sync it to third-party tools; if you do, add them |
| Email retention sentence ("as long as necessary to handle the enquiry and relevant follow-up, or to meet applicable legal obligations") | Your real practice | Confirm it matches what you do (e.g. you do not keep all mail indefinitely "just in case") |
| Rights wording | Swiss FADP (Art. 25 access, 30 days, exceptions) | Qualified as requested. No EU/UK-specific rights are described |

## B. Facts that need a decision or an answer

1. **Forearm photo and 3D scans (ORTESIS STUDIO).** Whose arm is shown, and is there consent to publish the photo, the scan stages and the downloadable meshes? (Affects `/work/ortesis-studio` and the homepage stack, not the legal pages.)
2. **Downloadable STL files.** `public/assets/ortesis-studio/models/*.stl` (including `01_escaneo_original.stl`) are only a fallback; the viewers use the lossless `.mesh.bin` files. Decide whether the STLs should stay downloadable.
3. **AED illustration.** Was any reference image (e.g. the earlier stock photo) uploaded when generating it? If so, that licence may still apply.
4. **MotoSpirit logo.** Permission or brand rules from the team.
5. **Identification (Swiss UWG Art. 3(1)(s)).** The site currently shows name, city and email. A postal address is not published. Whether more is required depends on whether the site offers goods, works or services in electronic commerce (it currently says nothing can be ordered or contracted through it, and the contact text only invites conversations). If you ever advertise freelance services or take enquiries as paid work through the site, reassess before publishing.
6. **Visitors outside Switzerland.** The pages are written for the Swiss FADP. If the site is aimed at EU/UK visitors (for example job applications there), check whether further information is needed.
7. **Employer policies** on naming Amazon RIVR and GUTMAR as former/current employers.
8. **Team and supervisor credits** for the Bar Stool, handlebar study, MotoSpirit and AED projects: none are named today (the legal page describes only your contribution).
9. **Domain / `NEXT_PUBLIC_SITE_URL`.** Not decided; without it there is no canonical URL and the sitemap is empty.
10. **Next.js dependency licences.** `public/licenses/THIRD-PARTY-NOTICES.txt` names Next.js, React and React DOM. After the real `npm install`, run `npx license-checker --production --summary` (or similar) and add any other package whose code is bundled into the delivered JavaScript.

## C. Media metadata and personal information found in the scan

- Fixed 19 Oct 2026: `city-aerial-day.webm/.mp4` carried container metadata with the local path `C:\Users\Albert\Documents\PROJECTES\…\more.blend`, a scene name and a timestamp. Metadata stripped losslessly (streams unchanged). Original recordings stay in `media-source/`.
- Still open: Blender's title bar with a local Windows path is visible **inside the picture** in four videos (`city-grid-layout-generation`, `drawer-generator-demo`, `drawer-clip-in-drawer`, `drawer-clip-organiser`) and in the city-grid poster. Fixing it needs the original recordings re-exported or cropped; a decision on cropping whole-frame videos is yours.
- No other personal strings (user name, e-mail, GPS, camera data) were found in the metadata of the 42 images or 20 videos in `public/`.
