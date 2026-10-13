# syntax=docker/dockerfile:1
#
# Dockerfile = daftar langkah untuk membuat image website ini.
# Ada 2 tahap ("multi-stage"): MASAK pakai Node, lalu SAJIKAN pakai Nginx.
# Hanya tahap terakhir yang jadi image akhir, jadi Node & node_modules tidak ikut terbawa.
#
# Build : docker build -t portfolio .
# Jalan : docker run --rm -p 8080:8080 portfolio   → buka http://localhost:8080
# Panduan lengkap: docs/DOCKER.md


# ───────────── Tahap 1: MASAK (build website) ─────────────
# Mulai dari image Node 22 versi "alpine" (Linux mini, ukurannya kecil).
FROM node:22-alpine AS build

# Semua perintah berikutnya dijalankan di folder /app di dalam container.
WORKDIR /app

# Salin daftar dependency DULU, baru install.
# Docker menyimpan hasil tiap langkah sebagai "layer" (cache). Selama package*.json
# tidak berubah, langkah `npm ci` yang lama tidak diulang → build berikutnya jauh lebih cepat.
COPY package.json package-lock.json ./
RUN npm ci

# Baru salin seluruh kode (file di .dockerignore tidak ikut), lalu build.
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build
# Hasilnya: website statis di /app/out


# ───────────── Tahap 2: SAJIKAN (web server) ─────────────
# Nginx versi "unprivileged": berjalan sebagai user biasa (bukan root) → lebih aman.
# Karena bukan root, ia mendengarkan di port 8080 (bukan 80).
FROM nginxinc/nginx-unprivileged:1.29-alpine

# Ganti pengaturan bawaan Nginx dengan milik kita.
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Ambil HANYA folder hasil build dari tahap 1.
COPY --from=build /app/out /usr/share/nginx/html

# Catatan bahwa container ini melayani di port 8080 (dibuka ke laptop lewat `-p`).
EXPOSE 8080
