# Panduan Docker — Web-portofolio

Catatan belajar Docker yang dipakai di project ini, disusun sesuai urutan belajarnya (Step 1–5).

## Kamus mini

| Istilah | Analogi sederhana | Di project ini |
| --- | --- | --- |
| **Image** | Cetakan (resep + bahan yang sudah dibungkus) | `portfolio`, `nginx`, `node:22-alpine` |
| **Container** | Masakan yang sedang disajikan dari cetakan itu | `docker run ... portfolio` |
| **Dockerfile** | Daftar langkah membuat image | [`Dockerfile`](../Dockerfile) |
| **Layer** | Satu lapisan hasil satu langkah di Dockerfile, disimpan sebagai cache | `RUN npm ci` |
| **Tag** | Label versi image | `latest`, `sha-abc1234` |
| **Port** | Pintu: `8080:8080` = pintu laptop ↔ pintu container | |
| **Docker Compose** | Satu file untuk menyalakan container tanpa perintah panjang | [`compose.yaml`](../compose.yaml) |
| **Registry** | "Google Drive"-nya image | Docker Hub, GHCR (`ghcr.io`) |
| **Lint** | Cek otomatis "ada yang aneh nggak di kodenya?" | hadolint untuk Dockerfile |

---

## Step 1 — Perintah dasar

| Perintah | Fungsi |
| --- | --- |
| `docker run hello-world` | Buat & jalankan container (otomatis *pull* image kalau belum ada) |
| `docker run -d --name X -p 8080:80 nginx` | `-d` jalan di belakang layar, `--name` beri nama, `-p` sambungkan pintu |
| `docker ps` / `docker ps -a` | Container yang jalan / semua container |
| `docker images` | Daftar image |
| `docker stop X` / `docker start X` | Matikan / nyalakan lagi |
| `docker rm X` / `docker rm -f X` | Hapus container / matikan + hapus |
| `docker container prune` | Hapus semua container yang sudah berhenti |
| `docker rmi <image>` | Hapus image |
| `docker logs X` | Lihat output/log container |
| `docker exec -it X sh` | Masuk ke dalam container (ketik `exit` untuk keluar) |

**Ingat:** menghapus container tidak menghapus image.

## Step 2 — Dockerfile: "masak lalu sajikan"

```
deps ──┬──► dev    (development, dipakai compose)
       └──► build ──► web   (image production)
```

- **deps / build (masak):** `node:22-alpine` → `npm ci` → `npm run build` → folder `out/`.
- **web (sajikan):** `nginx-unprivileged:alpine` + folder `out/` saja. Node tidak ikut → unduhan ±24 MB.
- **Cache layer:** `package*.json` disalin & di-install *sebelum* kode lain. Selama dependency tidak berubah, `npm ci` tidak diulang.
- **`.dockerignore`:** `node_modules`, `.git`, `.env`, dll. tidak ikut dikirim → build cepat & aman.
- **`docker/nginx.conf`:** gzip, cache 1 tahun untuk `/_next/static/`, halaman 404 Next.js, endpoint `/healthz`.

```bash
docker build -t portfolio .
docker run --rm -p 8080:8080 portfolio      # buka http://localhost:8080, berhenti: Ctrl+C
```

## Step 3 — Docker Compose

| Shortcut | Perintah asli | Hasil |
| --- | --- | --- |
| `npm run docker:dev` | `docker compose watch dev` | Development + hot reload → http://localhost:3000 |
| `npm run docker:prod` | `docker compose up --build web` | Versi production → http://localhost:8080 |
| `npm run docker:down` | `docker compose down` | Matikan & hapus container |

**Compose Watch:** file yang kamu ubah di laptop otomatis disalin ke container (`Syncing service "dev"...`), lalu `next dev` memuat ulang halaman. Kalau `package.json` berubah, image dibuat ulang.

## Step 4 — HEALTHCHECK & CI

- **HEALTHCHECK:** Docker membuka `/healthz` secara berkala. Status terlihat di `docker ps`: `(health: starting)` → `(healthy)`.
  ```bash
  docker run -d --name coba-health -p 8080:8080 portfolio
  docker ps
  docker inspect --format '{{json .State.Health}}' coba-health
  docker rm -f coba-health
  ```
- **Lint Dockerfile:** `docker run --rm -i hadolint/hadolint < Dockerfile` (tanpa output = bersih).
- **Workflow [`docker.yml`](../.github/workflows/docker.yml):** `lint → build → smoke test` (container harus *healthy*, halaman utama berisi "Gandrung Ghafar", halaman ngasal = 404).

## Step 5 — GHCR (registry)

Setelah merge ke `main`, workflow meng-upload image ke **`ghcr.io/gghafar/web-portofolio`**:

- Tag `latest` (versi terbaru) dan `sha-<commit>` (versi tertentu, bisa dipakai untuk kembali ke versi lama).
- Dua chip sekaligus: `linux/amd64` (server/PC) & `linux/arm64` (Mac M-series). Docker otomatis memilih yang cocok.
- Login memakai `GITHUB_TOKEN` otomatis — tidak perlu membuat secret.

```bash
docker run --rm -p 8080:8080 ghcr.io/gghafar/web-portofolio:latest
docker buildx imagetools inspect ghcr.io/gghafar/web-portofolio:latest   # lihat daftar chip
```

**Pertama kali:** package GHCR biasanya dibuat *private*. Buka **GitHub → profil → Packages → web-portofolio → Package settings → Change visibility → Public** supaya bisa di-pull tanpa login.

---

## Masalah umum

| Gejala | Penyebab & solusi |
| --- | --- |
| `docker-credential-desktop: executable file not found` | Ada 2 CLI docker (Homebrew & Docker Desktop). `brew uninstall docker`, lalu buka terminal baru. |
| `port is already allocated` / `address already in use` | Pintu 3000/8080 dipakai program lain. Matikan (`docker ps`, `npm run docker:down`) atau ganti, mis. `-p 9090:8080`. |
| `cannot take exclusive lock for project` | Masih ada `docker compose watch` lain yang jalan. Hentikan dengan Ctrl+C / `npm run docker:down`. |
| Hot reload tidak jalan | Pastikan pakai `npm run docker:dev` (bukan `docker compose up dev`) dan muncul `Watch enabled`. |
| `403 Forbidden` dari ghcr.io | Image belum pernah di-push, atau package masih private. |
| Disk penuh | `docker system df` untuk melihat pemakaian, `docker system prune` untuk membersihkan yang tidak terpakai. |

## Latihan

1. Ubah tagline di `data/profile.ts`, jalankan `docker build -t portfolio .` dua kali — perhatikan langkah mana yang `CACHED`.
2. Masuk ke container yang jalan: `docker exec -it <nama> sh`, lalu `ls /usr/share/nginx/html` — itu isi folder `out/`.
3. Jalankan dua container dari image yang sama di pintu berbeda (`-p 8081:8080` dan `-p 8082:8080`).
4. Sengaja rusak Dockerfile (mis. `CMD npm run dev` tanpa format JSON) → jalankan hadolint → lihat peringatannya.
5. Setelah merge, jalankan website-mu dari GHCR di laptop: `docker run --rm -p 8080:8080 ghcr.io/gghafar/web-portofolio:latest`.
