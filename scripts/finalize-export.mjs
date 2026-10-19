// Post-build step for the static export in out/.
//   npm run export:pages            -> checks out/, adds .nojekyll
// Reads NEXT_PUBLIC_BASE_PATH (same value used for the build) to verify asset URLs.
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("out");
const fail = (m) => { console.error("\nEXPORT CHECK FAILED: " + m); process.exit(1); };
if (!fs.existsSync(path.join(OUT, "index.html"))) fail("out/index.html not found. Did `next build` finish without errors?");

const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").trim().replace(/^\/+|\/+$/g, "");
const prefix = base ? `/${base}` : "";

// GitHub Pages: don't run Jekyll (it would hide the _next folder). GitHub Pages also ignores _headers.
fs.writeFileSync(path.join(OUT, ".nojekyll"), "");

const required = ["index.html", "404.html", "privacy/index.html", "legal/index.html", "about/index.html", "contact/index.html",
  "work/ortesis-studio/index.html", "work/chair-design/index.html", "computational-design/index.html",
  "computational-design/procedural-city/index.html", "computational-design/parametric-drawer/index.html",
  "licenses/OFL-Geist.txt", "assets/ortesis-studio/models/05_ortesis.mesh.bin"];
const missing = required.filter((f) => !fs.existsSync(path.join(OUT, f)));
if (missing.length) fail("missing: " + missing.join(", "));

const files = [];
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); e.isDirectory() ? walk(p) : files.push(p); } })(OUT);
const total = files.reduce((n, f) => n + fs.statSync(f).size, 0);
const rel = (f) => path.relative(OUT, f).split(path.sep).join("/");

const banned = files.filter((f) => /hero-lab|media-source|_removed-before|\.env|\.blend$|\.map$|node_modules/.test(rel(f)));
if (banned.length) fail("unexpected files in export: " + banned.map(rel).join(", "));

const html = fs.readFileSync(path.join(OUT, "index.html"), "utf8");
const nextRefs = [...html.matchAll(/(?:src|href)="([^"]*_next\/[^"]+)"/g)].map((m) => m[1]);
if (!nextRefs.length) fail("index.html has no /_next/ references.");
const bad = nextRefs.filter((u) => !u.startsWith(prefix + "/_next/"));
if (bad.length) fail(`index.html references ${bad[0]} but the expected prefix is "${prefix || "/"}". Build again with the same NEXT_PUBLIC_BASE_PATH.`);
const rootAbs = [...html.matchAll(/(?:src|href|poster)="(\/(?:assets|licenses)\/[^"]*)"/g)].map((m) => m[1]).filter((u) => !u.startsWith(prefix + "/"));
if (rootAbs.length) fail("asset URL without base path: " + rootAbs[0]);

const big = files.filter((f) => fs.statSync(f).size > 25 * 1024 * 1024);
console.log(`\nExport OK: ${files.length} files, ${(total / 1048576).toFixed(1)} MB, base path "${prefix || "(none)"}".`);
if (big.length) console.log("Note: files over 25 MiB (fine on GitHub Pages, too large for Cloudflare Pages): " + big.map(rel).join(", "));
console.log("Upload the CONTENTS of out/ (index.html must be at the root of what you upload), including the hidden .nojekyll file.");
