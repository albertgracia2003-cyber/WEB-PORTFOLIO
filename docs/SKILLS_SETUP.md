# Skills & Tooling Setup

**Status (15 Oct 2026, re-checked): not installed.** This cloud workspace still cannot reach npm or GitHub, so no installer can run here and the official READMEs could not be re-read. Nothing below has been executed or verified. Run the commands **in the `albert-gracia-portfolio` folder on your machine** (terminal or Claude Code). Restart Claude Code afterwards.

Requirements: Node.js ≥ 20.9, npm, Claude Code (latest).

## What you already have

`PORTFOLI WEB/Skills/` contains:
- `SKILL (1).md` — **frontend-design** (complete single-file skill). The file bridge can't write into `.claude/`, so copy it yourself or install A1:
  ```powershell
  mkdir .claude\skills\frontend-design
  copy "..\Skills\SKILL (1).md" .claude\skills\frontend-design\SKILL.md
  ```
- `SKILL (2).md` — Impeccable 4.5.2, but without its scripts → use the installer (A2).
- `SKILL (3).md` — **Vercel React *Native* skills. Do not use**; this portfolio is a React web / Next.js project. Install A4 instead.

## Priority A — essential

```bash
# A1 · Anthropic frontend-design (inside Claude Code)
/plugin marketplace add anthropics/skills
/plugin install example-skills@anthropic-agent-skills

# A2 · Impeccable (project-local) — review any hooks it proposes before accepting
npx impeccable install --providers=claude --scope=project

# A3 · Emil Kowalski — choose "Claude Code"; select apple-design, animate, review-animations, animation-performance
npx skills@latest add emilkowalski/skills

# A4 + A5 · Vercel — when the picker opens, select the React/Next.js WEB best-practices skill
#            (name contains "react-best-practices", NOT "react-native") and "web-design-guidelines"
npx skills@latest add vercel-labs/agent-skills
```

## Priority B

```bash
# B6 · UI UX Pro Max (exploration only — the master brief wins on conflicts)
npx ui-ux-pro-max-cli init --ai claude

# B7 · Chrome DevTools MCP (inside Claude Code)
/plugin marketplace add ChromeDevTools/chrome-devtools-mcp
/plugin install chrome-devtools-mcp@chrome-devtools-plugins
#   or: claude mcp add chrome-devtools --scope project -- npx chrome-devtools-mcp@latest
```

## Priority C — only when needed

- **React Three Fiber skill** (`cesartevisual/threejs-skills`) + `three @react-three/fiber @react-three/drei` — when the orthosis GLB exists (see `src/components/three/ModelViewer.tsx`). The hero artwork does not need it.
- **Playwright** — `npm i -D @playwright/test`. The harness tests in this report can be ported to it.

## Verify

```bash
ls .claude/skills     # project-local skills present
claude                # then /plugin (installed) and /mcp (chrome-devtools listed)
```

## Then: run the design review loop with the real tools
1. `npm run dev`, open http://localhost:3000 in both themes.
2. Ask Claude Code to run Impeccable's critique and the Vercel web-design-guidelines review on `/` and `/work/ortesis-studio`.
3. Use Chrome DevTools MCP for a performance trace (LCP, CLS) on mobile emulation.

## Security
Project scope only; no `sudo`; don't pipe remote scripts into a shell; read every hook in `.claude/settings.json` before enabling it.
