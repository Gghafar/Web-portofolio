# Handover — Web-portofolio (Portfolio Desktop)

Ringkasan kondisi project untuk siapa pun (atau sesi AI berikutnya) yang melanjutkan pekerjaan ini.
Terakhir diperbarui: 15 Oktober 2026 (setelah PR #10 `feat/macos-desktop` di-merge ke `main`).

---

## 1. Gambaran singkat

Website portofolio **Gandrung Ghafar** yang tampil seperti **layar macOS**: menu bar dengan jam, ikon file di
desktop, jendela yang bisa digeser, dock, dan Spotlight (⌘K). Isi CV, proyek, pengalaman, dan demo interaktif
dibuka sebagai jendela/aplikasi.

| | |
| --- | --- |
| Repo | https://github.com/Gghafar/Web-portofolio |
| Produksi | Vercel (Git integration — setiap merge ke `main` otomatis deploy; tiap PR dapat preview URL) |
| Image Docker | `ghcr.io/gghafar/web-portofolio:latest` (dibuat otomatis setelah merge ke `main`) |
| Desain acuan | Artifact "Portfolio Desktop" — https://claude.ai/artifact/3LLfZ4CSZfL8dfyic8gr1y |

## 2. Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript 6**, `output: "export"` → situs statis di `out/`.
- **Tailwind CSS v4** *tanpa preflight* + CSS tulisan tangan di `app/globals.css`.
- **shadcn/ui** (Radix): `command` + `dialog` (Spotlight), `tooltip`, `sonner` (toast), `button`.
- **Motion** (`motion/react`) untuk semua animasi.
- **Liquid glass**: komponen dari 21st.dev yang sudah diadaptasi (`components/ui/liquid-glass-button.tsx`).
- Font: Geist, Geist Mono, Schibsted Grotesk (`next/font`).
- Node **22** (`.nvmrc`). Di laptop pemilik masih Node 20.17 — tetap jalan, tapi sebaiknya disamakan ke 22.

## 3. Menjalankan

```bash
npm install
npm run dev          # http://localhost:3000
npm run check        # lint + typecheck + build (sama dengan CI) — jalankan sebelum commit
npm run docker:dev   # dev di container (hot reload)  → :3000
npm run docker:prod  # image produksi (Nginx)         → :8080
```

Docker Desktop: CLI ada di `~/.docker/bin` (CLI Homebrew sudah di-uninstall karena bentrok credential helper).

## 4. Struktur & cara kerja

```
app/                 layout (font, metadata, filter kaca), page (Desktop + ringkasan sr-only untuk SEO), globals.css
components/desktop/  Desktop (root, hash routing, Esc), MenuBar, Dock, Window, views (isi jendela), glyphs (ikon SVG)
components/          "aplikasi" di jendela: MtlaDemo, PathfindingArena, NetworkSection (Hiring Match), Gantt (Timeline)
                     + CommandMenu (Spotlight), CopyButton, SemesterTrack, motion/CountUp, motion/MotionProvider
components/ui/       shadcn + liquid-glass-button.tsx
lib/desktop/         store.ts (state jendela), apps.tsx (registri semua jendela)
lib/                 types.ts, utils.ts (cn), useNow.ts
data/                SEMUA konten — edit di sini, bukan di komponen
```

### Alur data jendela
- `lib/desktop/store.ts` — store kecil (`useSyncExternalStore`, tanpa library): `open(id, width, fromEl)`,
  `close`, `closeAll`, `focus`, `minimize`, `toggleMaximize`, `move`. Menyimpan posisi, z-order, minimized/maximized,
  dan titik asal animasi (ikon atau dock).
- `lib/desktop/apps.tsx` — registri: id → `name` (menu bar/Spotlight), `file` (title bar), `width`, `group`, `render()`.
  **Menambah jendela baru = tambah satu entri di sini** (+ ikon di `data/desktop.ts` dan artwork di `glyphs.tsx` bila perlu).
- **Hash routing**: `/#mtla` membuka jendela `mtla`. Link di dalam jendela cukup `<a href="#id">` (lihat `OpenLink`
  di `views.tsx`), termasuk link "Open the full entry" di Hiring Match dan batang Timeline (anchor-nya di `data/*.ts`).
- Minimize **tidak meng-unmount** jendela (pakai `inert`), jadi state demo tetap tersimpan.

### Mengubah konten
| File | Isi |
| --- | --- |
| `data/profile.ts` | nama, peran, email, link, fakta About |
| `data/desktop.ts` | posisi ikon (persen), isi dock, menu bar |
| `data/projects.ts` | DFK & Top-Down Shooter (`` `backtick` `` → `<code>`) |
| `data/experience.ts` | pekerjaan, organisasi, baris Timeline |
| `data/skills.ts` | pendidikan, sertifikat, toolkit |
| `data/network.ts` | node & bobot Hiring Match |

### Liquid glass
Satu sistem kaca bersama di `app/globals.css` (kelas `.lg`), dipakai **LiquidButton** dan **dock**:
`.lg-refract` (pembiasan, filter SVG `#liquid-refract`) → `.lg-frost` (blur + saturasi + tint) → `::after` (kilau) +
border/inset shadow (rim). Atur rasa lewat variabel `--lg-tint-top`, `--lg-tint-bottom`, `--lg-blur`, `--lg-border`,
`--lg-shadow`; dock memakai varian paling bening (`.dock.lg`). Filter SVG dipasang **sekali** di `app/layout.tsx`
(`<LiquidGlassFilter />`).

## 5. Jebakan yang sudah pernah kena (baca sebelum mengubah CSS/animasi)

1. **Nama class vs utility Tailwind.** Tailwind membuat utility untuk *setiap* kata di source. `hidden` dan
   `container` dimatikan dengan `@source not inline("container hidden")` — jangan pakai `className="hidden"`
   (pakai `sr-only` / ukuran 0). Bug lama: seluruh layer skill network graph hilang.
2. **`dark:` dimatikan** (`@custom-variant dark (&:where(.dark, .dark *))`) — situs hanya mode terang;
   tanpa ini komponen pihak ketiga ikut gelap kalau OS pengunjung dark mode.
3. **`.lg` tidak boleh mengatur `position`.** Pernah menimpa `position:absolute` dock → dock pindah ke atas.
4. **Backdrop root.** `backdrop-filter` di sebuah elemen membuat anak-anaknya tidak bisa "melihat" latar.
   Karena itu efek kaca ditaruh di *layer anak* (`.lg-refract`, `.lg-frost`), bukan di elemennya.
5. **Animasi `clip-path` di compositor** (pelajaran dari transisi ombak, PR #5): nilai `px` bisa terskala
   devicePixelRatio di layar Retina saat animasi berjalan. Pakai `%`. Selalu cek animasi **saat berjalan**,
   bukan saat dibekukan.
6. **Jangan ganti `textContent` tombol LiquidButton** — itu menghapus layer kaca. Ganti teks di `<span>` label
   (contoh: tombol Play/Pause di `PathfindingArena.tsx`).
7. **Motion menimpa `transform` CSS.** Elemen yang dipusatkan dengan `translate(-50%,-50%)` jangan dianimasikan
   `x/y` langsung — animasikan elemen di dalamnya (contoh: `.ic-slot` di `Desktop.tsx`).
8. **Screenshot alat browser AI tidak menampilkan `backdrop-filter`** dengan benar (dock terlihat putih).
   Efek kaca harus dinilai langsung di Chrome. Refraksi (`backdrop-filter: url()`) hanya jalan di Chromium.
9. **Lint React Hooks ketat** (dipakai CI): tidak boleh baca `ref.current` saat render, tidak boleh `setState`
   langsung di `useEffect` — pakai `useSyncExternalStore`/`useEffectEvent` (lihat `useNow`, jam di `MenuBar`).

## 6. Alur kerja (aturan pemilik repo)

- Setiap fitur/perbaikan di **branch sendiri** (`feat/...`, `fix/...`), **tidak pernah** langsung di `main`.
- **Coba di localhost dulu** (pemilik mengecek sendiri) → baru commit → push → **PR ke `main`**.
- PR **di-merge oleh pemilik**. Commit/PR **tanpa** baris co-author/atribusi AI.
- CI (`ci.yml`: lint, typecheck, build) dan Docker (`docker.yml`: hadolint, build, smoke test, push GHCR setelah merge)
  harus hijau. Panduan: `docs/CI-CD.md`, `docs/DOCKER.md`.
- `deploy.yml` adalah CD versi GitHub Actions — **OFF secara default** (butuh secret Vercel + variabel
  `DEPLOY_WITH_ACTIONS`). Produksi tetap lewat Vercel Git integration; lihat "Mode B" di `docs/CI-CD.md`.
- Branch yang sudah di-merge (mis. `feat/macos-desktop`) jangan dipakai lagi — mulai pekerjaan baru dari `main`
  terbaru.

## 7. Riwayat singkat

| PR | Isi |
| --- | --- |
| #1 | Motion + shadcn/ui, ESLint, CI/CD, bersih-bersih repo (node_modules dulu ter-commit) |
| #2 | `feature` → `main` (branch `feature` lalu dihapus) |
| #3 | Fix layer skill network graph hilang (`hidden`/`container` vs Tailwind) |
| #4 | Docker: Dockerfile multi-stage + Nginx, compose, workflow Docker + GHCR |
| #5 | Transisi tema "ombak", smooth scroll (Lenis), fix topbar — **sudah dihapus lagi** di PR desktop |
| #10 | Tampilan macOS desktop + liquid glass, menggantikan halaman scroll lama |

## 8. Pekerjaan terbuka

- **PR Dependabot yang terbuka — jangan merge sembarangan:**
  - `typescript 6 → 7` (#7): **akan merusak lint** — typescript-eslint belum mendukung TS 7. Tutup/abaikan dulu.
  - `eslint 9 → 10` (#8): cek dulu apakah `eslint-config-next` sudah mendukung; jalankan `npm run check` di branch PR.
  - `node 22-alpine → 26-alpine` (#9): ubah juga `.nvmrc` kalau diterima; biarkan CI Docker membuktikan.
  - `@types/node` patch (#6): aman bila CI hijau.
- **Konten yang belum ada** (tinggal diisi di `data/` / `apps.tsx`):
  - username **Instagram** (ikon dock disembunyikan sampai ada),
  - **foto** untuk latar (sekarang ilustrasi potret dari desain, di `Desktop.tsx` → `Wallpaper`),
  - file **CV PDF** (jendela CV sekarang ringkasan + tombol LinkedIn),
  - paragraf "About" versi pemilik sendiri (sekarang memakai `profile.lede`).
- Opsional: `next-env.d.ts` dibuat ulang otomatis oleh Next dan selalu tampil "modified" — bisa dimasukkan ke
  `.gitignore` dan dikeluarkan dari git.
- Opsional: trigger `pull_request` di `deploy.yml` masih menyebut branch `feature` yang sudah dihapus — bisa
  dibuang dari daftar `branches`.
