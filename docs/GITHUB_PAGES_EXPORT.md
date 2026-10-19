# Static export for GitHub Pages (project site)

The export must be produced by the real Next.js build on your PC. It could not be generated in the Claude sandbox (the npm registry is blocked there), so no `out/` folder exists yet and nothing has been verified against a real build.

## 1. Build (PowerShell, in the project folder)

Replace `REPO-NAME` with the exact repository name (it becomes the URL `https://<user>.github.io/REPO-NAME/`, case as in the URL).

```powershell
node -v                      # 20.9 or newer (22 recommended)
npm install                  # creates package-lock.json; needs internet (also downloads the Geist fonts at build time)
npm run typecheck
npm run lint
$env:NEXT_PUBLIC_BASE_PATH = "/REPO-NAME"
npm run export:pages         # = next build + checks + adds out\.nojekyll
Remove-Item Env:NEXT_PUBLIC_BASE_PATH
```

`export:pages` stops with "EXPORT CHECK FAILED" if a page, asset or the base path is wrong. On success the folder `out\` is the website.

Zip it (index.html must be at the ZIP root):

```powershell
Compress-Archive -Path out\* -DestinationPath site-github-pages.zip -Force
# Compress-Archive skips hidden files in some PowerShell versions; check .nojekyll is in the ZIP, or add it again after unzipping.
```

Optional test before uploading: `npx serve out` is for a root URL only; for the sub-path use a folder named like the repo: copy `out` to `test\REPO-NAME` and run `npx serve test` then open `http://localhost:3000/REPO-NAME/`.

## 2. Upload

- Upload the **contents of `out\`** (not the project source, not `node_modules`, not `out` itself) to the repository branch that Pages serves, so `index.html` is at the branch root (or at `/docs` if you choose that folder). Include `.nojekyll`.
- Pushing the project source alone does not publish the site; Pages serves only the exported files.

## 3. Configure Pages

Repository → Settings → Pages → Build and deployment → Source: **Deploy from a branch** → Branch: the one holding the export, Folder: `/ (root)` (or `/docs`) → Save. Wait for the deployment, then open `https://<user>.github.io/REPO-NAME/` and also open `.../REPO-NAME/privacy/` directly.

## 4. Things that differ from Cloudflare

- GitHub Pages ignores `_headers`: no CSP, X-Frame-Options or Permissions-Policy there. Fine for a test.
- Unknown URLs show `404.html` (served by Pages from the site root only; with a project site it is used for URLs under the repo path).
- For a custom domain or a `<user>.github.io` repository, build without `NEXT_PUBLIC_BASE_PATH`.
- `/privacy` currently says the site "is being prepared for hosting on Cloudflare Pages"; that is accurate only for the Cloudflare deployment. Treat a GitHub Pages test as a test, not the published site.
- Leave `NEXT_PUBLIC_SITE_URL` unset for the test (no canonical URLs, empty sitemap). Set it for the real launch.
