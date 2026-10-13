# Gandrung Ghafar — Portfolio

[![CI](https://github.com/Gghafar/Web-portofolio/actions/workflows/ci.yml/badge.svg)](https://github.com/Gghafar/Web-portofolio/actions/workflows/ci.yml)

Personal portfolio built with **Next.js (App Router) + TypeScript**, exported as a static site and deployed on **Vercel**.
UI extras use **Motion** for animation and **shadcn/ui** (Radix + Tailwind v4) for the command menu, tooltips and toasts.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to ./out
npm run check      # lint + typecheck + build — the same checks CI runs
```

## Updating content

All CV content lives in `data/` — edit these, not the components:

| File | What it holds |
| --- | --- |
| `data/profile.ts` | Name, email, links, hero facts, nav |
| `data/network.ts` | Interactive network: needs, skills, evidence, and the weights between them |
| `data/projects.ts` | Project write-ups and specs (`` `backticks` `` render as code) |
| `data/experience.ts` | Jobs, organizations, and the timeline (gantt) rows |
| `data/skills.ts` | Education, certifications, tool list |

Styling is in `app/globals.css` (colour tokens at the top, dark mode included). Tailwind is loaded
without its preflight reset, and the shadcn/ui tokens are mapped onto the site palette there.

## Interactive extras

| Feature | Where |
| --- | --- |
| ⌘K / Ctrl+K command menu (jump to any section, copy email, toggle theme) | `components/CommandMenu.tsx` (shadcn `command` + `dialog`) |
| Light / dark toggle, remembered across visits | `lib/theme.ts`, `components/Topbar.tsx` |
| Hero letter reveal, breathing node dot, magnetic buttons | `components/motion/TextReveal.tsx`, `NodeDot.tsx`, `Magnetic.tsx` |
| Scroll-reveal for sections and cards | `components/motion/Reveal.tsx` |
| Cursor spotlight on cards (`data-spotlight`) | `components/motion/Spotlight.tsx` + CSS |
| GPA count-up, spring scroll progress, sliding nav underline | `CountUp.tsx`, `Topbar.tsx` |
| Toast on copy, back-to-top button | shadcn `sonner`, `components/BackToTop.tsx` |

All motion respects the visitor's *reduce motion* setting.

## Structure

```
app/            layout (fonts, metadata), page, global CSS, favicon
components/     one component per section; interactive ones are client components:
                NetworkSection (SVG forward pass), MtlaDemo, PathfindingArena (canvas),
                Gantt, SemesterTrack, Topbar, CopyButton
data/           content
components/ui/  shadcn/ui primitives (button, command, dialog, tooltip, sonner)
components/motion/  small Motion building blocks
lib/            types, theme store, cn() helper
.github/        CI/CD workflows, Dependabot, PR template
docs/CI-CD.md   CI/CD guide (Bahasa Indonesia)
```

## Branches, CI and deploy

`feat/*` branch → PR into `feature` → PR into `main`. Every PR runs **CI** (GitHub Actions: lint, typecheck, build).
Vercel deploys a preview for each PR and production on every push to `main`.
See [docs/CI-CD.md](docs/CI-CD.md) for the full walkthrough, including the optional deploy-through-Actions workflow.
