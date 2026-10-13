# Gandrung Ghafar — Portfolio

[![CI](https://github.com/Gghafar/Web-portofolio/actions/workflows/ci.yml/badge.svg)](https://github.com/Gghafar/Web-portofolio/actions/workflows/ci.yml)
[![Docker](https://github.com/Gghafar/Web-portofolio/actions/workflows/docker.yml/badge.svg)](https://github.com/Gghafar/Web-portofolio/actions/workflows/docker.yml)

Personal portfolio built with **Next.js (App Router) + TypeScript**, exported as a static site and deployed on **Vercel**.
UI extras use **Motion** for animation and **shadcn/ui** (Radix + Tailwind v4) for the command menu, tooltips and toasts.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to ./out
npm run check      # lint + typecheck + build — the same checks CI runs
```

## Run with Docker

```bash
npm run docker:dev     # dev server with hot reload in a container → http://localhost:3000
npm run docker:prod    # production image (Nginx serving the static export) → http://localhost:8080
npm run docker:down    # stop and remove the containers

docker run --rm -p 8080:8080 ghcr.io/gghafar/web-portofolio:latest   # prebuilt image from GHCR
```

The multi-stage [`Dockerfile`](Dockerfile) builds the site with Node and serves only `out/` from unprivileged Nginx
(±24 MB download). See [docs/DOCKER.md](docs/DOCKER.md) for a step-by-step guide (Bahasa Indonesia).

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
.github/        CI/CD workflows (CI, Docker, optional Vercel deploy), Dependabot, PR template
Dockerfile, compose.yaml, docker/   container image, dev/prod services, Nginx config
docs/           CI/CD and Docker guides (Bahasa Indonesia)
```

## Branches, CI and deploy

Work happens on a `feat/*` or `fix/*` branch → PR into `main`. Every PR runs **CI** (lint, typecheck, build) and
**Docker** (lint the Dockerfile, build the image, smoke-test the container). After a merge to `main`, the Docker
workflow pushes the image to GHCR, and Vercel deploys production; Vercel also deploys a preview for each PR.
See [docs/CI-CD.md](docs/CI-CD.md) for the full walkthrough, including the optional deploy-through-Actions workflow.
