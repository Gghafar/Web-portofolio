# Gandrung Ghafar — Portfolio

Personal portfolio built with **Next.js (App Router) + TypeScript**, exported as a static site and deployed on **Vercel**.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to ./out
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

Styling is in `app/globals.css` (colour tokens at the top, dark mode included).

## Structure

```
app/            layout (fonts, metadata), page, global CSS, favicon
components/     one component per section; interactive ones are client components:
                NetworkSection (SVG forward pass), MtlaDemo, PathfindingArena (canvas),
                Gantt, SemesterTrack, Topbar, CopyButton
data/           content
lib/types.ts    shared types
```

## Deploy

Push to GitHub, then on [vercel.com](https://vercel.com) → **Add New → Project** → import the repo → **Deploy** (the Next.js preset is detected automatically).
Every push to `main` redeploys.
