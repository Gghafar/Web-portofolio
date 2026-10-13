# syntax=docker/dockerfile:1
#
# Dockerfile = daftar langkah untuk membuat image website ini.
# Intinya 2 tahap ("multi-stage"): MASAK pakai Node, lalu SAJIKAN pakai Nginx.
# Hanya tahap terakhir yang jadi image akhir, jadi Node & node_modules tidak ikut terbawa.
#
#   deps ──┬──► dev    (untuk development, dipakai compose.yaml)
#          └──► build ──► web   (image production, tahap default)
#
# Build : docker build -t portfolio .
# Jalan : docker run --rm -p 8080:8080 portfolio   → buka http://localhost:8080
# Panduan lengkap: docs/DOCKER.md


# ───────────── Tahap deps: install dependency ─────────────
# Mulai dari image Node 22 versi "alpine" (Linux mini, ukurannya kecil).
# --platform=$BUILDPLATFORM: tahap Node selalu jalan di chip mesin yang sedang build.
# Hasil build (HTML/JS/CSS) sama untuk semua chip, jadi saat membuat image untuk
# amd64 + arm64 sekaligus (Step 5), hanya tahap Nginx yang dibuat per chip → cepat.
FROM --platform=$BUILDPLATFORM node:22-alpine AS deps

# Semua perintah berikutnya dijalankan di folder /app di dalam container.
WORKDIR /app

# Salin daftar dependency DULU, baru install.
# Docker menyimpan hasil tiap langkah sebagai "layer" (cache). Selama package*.json
# tidak berubah, langkah `npm ci` yang lama tidak diulang → build berikutnya jauh lebih cepat.
COPY package.json package-lock.json ./
RUN npm ci

ENV NEXT_TELEMETRY_DISABLED=1


# ───────────── Tahap dev: server development (hot reload) ─────────────
# Dipakai oleh `docker compose watch dev`. Compose menyalin perubahan kode ke sini,
# dan `next dev` otomatis memuat ulang halaman.
FROM deps AS dev
COPY . .
EXPOSE 3000
# --hostname 0.0.0.0 → dengarkan di semua alamat, supaya bisa dibuka dari laptop (bukan cuma dari dalam container).
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]


# ───────────── Tahap build: MASAK (build website) ─────────────
FROM deps AS build
# Salin seluruh kode (file di .dockerignore tidak ikut), lalu build.
COPY . .
RUN npm run build
# Hasilnya: website statis di /app/out


# ───────────── Tahap web: SAJIKAN (image production) ─────────────
# Nginx versi "unprivileged": berjalan sebagai user biasa (bukan root) → lebih aman.
# Karena bukan root, ia mendengarkan di port 8080 (bukan 80).
FROM nginxinc/nginx-unprivileged:1.29-alpine AS web

# Ganti pengaturan bawaan Nginx dengan milik kita.
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Ambil HANYA folder hasil build dari tahap build.
COPY --from=build /app/out /usr/share/nginx/html

# Catatan bahwa container ini melayani di port 8080 (dibuka ke laptop lewat `-p`).
EXPOSE 8080

# Docker mengecek sendiri apakah container sehat dengan membuka /healthz secara berkala.
# Status terlihat di `docker ps` (healthy / unhealthy) dan dipakai tes di GitHub Actions.
# --start-interval: saat baru menyala, cek tiap 1 detik supaya cepat dinyatakan sehat.
# Format JSON ["...", "..."] dijalankan langsung tanpa shell (saran hadolint DL3025).
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --start-interval=1s --retries=3 \
  CMD ["wget", "-q", "-O", "/dev/null", "http://127.0.0.1:8080/healthz"]
