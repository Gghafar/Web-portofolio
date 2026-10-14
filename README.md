# Gandrung Ghafar — Portfolio

[![CI](https://github.com/Gghafar/Web-portofolio/actions/workflows/ci.yml/badge.svg)](https://github.com/Gghafar/Web-portofolio/actions/workflows/ci.yml)
[![Docker](https://github.com/Gghafar/Web-portofolio/actions/workflows/docker.yml/badge.svg)](https://github.com/Gghafar/Web-portofolio/actions/workflows/docker.yml)

Personal portfolio styled as a **macOS desktop**: a menu bar with a live clock, file icons, draggable windows and a
dock. Built with **Next.js (App Router) + TypeScript**, exported as a static site and deployed on **Vercel**.
Animation uses **Motion**; Spotlight, tooltips and toasts use **shadcn/ui** (Radix + Tailwind v4).

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
| `data/profile.ts` | Name, role, email, links, About facts |
| `data/desktop.ts` | Which icons sit where on the desktop, the dock and the menu bar |
| `data/network.ts` | Interactive network: needs, skills, evidence, and the weights between them |
| `data/projects.ts` | Project write-ups and specs (`` `backticks` `` render as code) |
| `data/experience.ts` | Jobs, organizations, and the timeline (gantt) rows |
| `data/skills.ts` | Education, certifications, tool list |

Each window's title, size and content is defined in `lib/desktop/apps.tsx` (built from the data above).
Styling is in `app/globals.css`. Tailwind is loaded without its preflight reset, and the shadcn/ui tokens are mapped
onto the site palette there.

## The desktop

| Feature | Where |
| --- | --- |
| Menu bar: active app name, menus, live clock | `components/desktop/MenuBar.tsx` |
| File icons on the desktop (a grid on phones) | `components/desktop/Desktop.tsx`, `data/desktop.ts`, `glyphs.tsx` |
| Windows: drag by the title bar, click to front, close / minimize to dock / maximize, grow out of the icon | `components/desktop/Window.tsx`, state in `lib/desktop/store.ts` |
| Dock with macOS-style magnification and running-app dots | `components/desktop/Dock.tsx` |
| Spotlight (⌘K / Ctrl+K): search and open any window | `components/CommandMenu.tsx` |
| Apps inside windows: MTLA demo, Pathfinding Arena, Hiring Match (network graph), Timeline | `MtlaDemo.tsx`, `PathfindingArena.tsx`, `NetworkSection.tsx`, `Gantt.tsx` |
| Liquid glass on the dock and action buttons (shared `.lg` system) | `components/ui/liquid-glass-button.tsx`, `.lg` in `app/globals.css` |
| Shareable links: `/#mtla` opens that window; links inside windows are plain `#id` links | `useHashWindows` in `Desktop.tsx` |

`Esc` closes the window in front. All motion respects the visitor's *reduce motion* setting.

## Structure

```
app/                layout (fonts, metadata), page, global CSS, favicon
components/desktop/ the desktop: menu bar, icons, windows, dock, window content views, icon artwork
components/         apps shown in windows (MtlaDemo, PathfindingArena, NetworkSection, Gantt),
                    Spotlight (CommandMenu), CopyButton, SemesterTrack
components/ui/      shadcn/ui primitives (button, command, dialog, tooltip, sonner)
lib/desktop/        window store and the registry of windows (apps.tsx)
data/               content
.github/            CI/CD workflows (CI, Docker, optional Vercel deploy), Dependabot, PR template
Dockerfile, compose.yaml, docker/   container image, dev/prod services, Nginx config
docs/               CI/CD and Docker guides, and HANDOVER.md (Bahasa Indonesia)
```

## Branches, CI and deploy

Work happens on a `feat/*` or `fix/*` branch → PR into `main`. Every PR runs **CI** (lint, typecheck, build) and
**Docker** (lint the Dockerfile, build the image, smoke-test the container). After a merge to `main`, the Docker
workflow pushes the image to GHCR, and Vercel deploys production; Vercel also deploys a preview for each PR.
See [docs/CI-CD.md](docs/CI-CD.md) for the full walkthrough, including the optional deploy-through-Actions workflow.

**Picking this up?** Read [docs/HANDOVER.md](docs/HANDOVER.md) first: architecture, gotchas, open work.
