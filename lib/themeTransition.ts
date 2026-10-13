"use client";

const POINTS = 96; // titik di keliling "lingkaran ombak"; lebih banyak = tepi lebih mulus
const FRAMES = 72; // keyframe yang dihitung; browser menginterpolasi di antaranya
const DURATION = 1200; // ms
const WAVE = 0.06; // tinggi ombak, relatif terhadap sisi layar terpendek (±54 px di layar 900 px)
const COVER_END = 0.88; // pada 88% durasi, lingkaran (tanpa ombak) sudah mencapai sudut layar

/** Pelan → cepat → pelan (kurva sinus). */
const easeInOutSine = (t: number) => (1 - Math.cos(Math.PI * t)) / 2;

/** Berapa bagian layar (0–1) yang tertutup lingkaran berjari-jari r yang berpusat di tengah layar. */
function coveredFraction(r: number, w: number, h: number) {
  const steps = 160;
  const dx = w / steps;
  let area = 0;
  for (let i = 0; i < steps; i++) {
    const x = -w / 2 + (i + 0.5) * dx;
    area += 2 * Math.min(h / 2, Math.sqrt(Math.max(0, r * r - x * x))) * dx;
  }
  return area / (w * h);
}

/** Kebalikan dari coveredFraction: jari-jari yang menutupi `target` bagian layar (dicari dengan bisection). */
function radiusForCoverage(target: number, w: number, h: number) {
  let lo = 0;
  let hi = Math.hypot(w / 2, h / 2);
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (coveredFraction(mid, w, h) < target) lo = mid;
    else hi = mid;
  }
  return hi;
}

/**
 * clip-path polygon berbentuk lingkaran dengan tepi bergelombang, berpusat di (cx, cy).
 * Ukuran dihitung dalam px, tapi ditulis dalam % dari ukuran layar (w × h).
 *
 * Kenapa %? Saat animasi berjalan, Chrome menjalankan animasi clip-path di GPU (compositor),
 * dan di layar Retina (devicePixelRatio 2) nilai `px` di sana ikut terskala → semua koordinat
 * jadi setengahnya: ombak muncul di kiri atas dan tidak pernah sampai kanan bawah.
 * Nilai % selalu relatif terhadap ukuran lapisan itu sendiri, jadi aman di layar apa pun.
 */
function wavePolygon(cx: number, cy: number, radius: number, wave: number, phase: number, w: number, h: number) {
  const pts: string[] = [];
  for (let i = 0; i < POINTS; i++) {
    const a = (i / POINTS) * Math.PI * 2;
    // Dua gelombang dengan frekuensi & arah berbeda supaya tidak terlihat seperti roda gigi.
    const offset = wave * (Math.sin(6 * a + phase) + 0.4 * Math.sin(11 * a - 1.7 * phase));
    const r = Math.max(0, radius + offset);
    const x = ((cx + r * Math.cos(a)) / w) * 100;
    const y = ((cy + r * Math.sin(a)) / h) * 100;
    pts.push(`${x.toFixed(3)}% ${y.toFixed(3)}%`);
  }
  return `polygon(${pts.join(",")})`;
}

/** Warna bergeser pelan, untuk browser yang belum mendukung View Transitions. */
function fadeColors(apply: () => void) {
  const root = document.documentElement;
  root.classList.add("theme-fading");
  apply();
  window.setTimeout(() => root.classList.remove("theme-fading"), 350);
}

/**
 * Menjalankan `apply` (yang mengganti tema) dengan animasi: tema baru menyebar dari TENGAH layar
 * sebagai lingkaran bertepi ombak, sampai seluruh layar tertutup.
 *
 * Caranya: View Transitions API memotret halaman sebelum & sesudah `apply`, lalu potret
 * "sesudah" dibuka sedikit demi sedikit dengan clip-path.
 *
 * Kuncinya: yang dibuat merata terhadap waktu adalah LUAS layar yang tertutup, bukan jari-jarinya.
 * Kalau jari-jari yang dibuat merata, luasnya tumbuh kuadrat — sebagian besar layar tertutup
 * dalam sekejap di akhir dan terasa seperti "langsung ganti tanpa animasi".
 */
export function transitionTheme(apply: () => void) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    apply();
    return;
  }
  if (!("startViewTransition" in document)) {
    fadeColors(apply);
    return;
  }

  const w = window.innerWidth;
  const h = window.innerHeight;
  const cx = w / 2;
  const cy = h / 2;
  const toCorner = Math.hypot(cx, cy);
  const maxWave = Math.min(w, h) * WAVE;

  const keyframes: Keyframe[] = [];
  for (let f = 0; f <= FRAMES; f++) {
    const t = f / FRAMES;

    // Ombak: naik cepat di awal, tetap tinggi selama menyebar, reda di akhir → tepi halus.
    const rise = Math.min(1, t / 0.15);
    const fall = t <= COVER_END ? 1 : 1 - (t - COVER_END) / (1 - COVER_END);
    const amplitude = maxWave * Math.sin((rise * Math.PI) / 2) * fall;

    let radius: number;
    if (t <= COVER_END) {
      // Luas tertutup bertambah hampir merata (60% linear + 40% sinus untuk awal & akhir yang lembut).
      const p = t / COVER_END;
      radius = radiusForCoverage(0.6 * p + 0.4 * easeInOutSine(p), w, h);
    } else {
      // Sudah sampai sudut: dorong sedikit lagi sambil ombak mereda, supaya lekukan ombak
      // pun menutupi sudut sebelum animasi selesai (tidak ada sisa yang "melompat").
      const p = (t - COVER_END) / (1 - COVER_END);
      radius = toCorner + p * (1.5 * maxWave + 4);
    }

    // Saat lingkaran masih kecil, ombak dibatasi supaya bentuknya tidak "pecah".
    const wave = Math.min(amplitude, radius * 0.35);
    const phase = t * Math.PI * 4; // ombak berputar 2x selama transisi
    keyframes.push({ clipPath: wavePolygon(cx, cy, radius, wave, phase, w, h) });
  }

  const transition = document.startViewTransition(apply);
  transition.ready
    .then(() => {
      document.documentElement.animate(keyframes, {
        duration: DURATION,
        easing: "linear", // kecepatan sudah diatur di keyframe
        pseudoElement: "::view-transition-new(root)",
      });
    })
    .catch(() => {
      // Transisi dibatalkan (mis. klik cepat berkali-kali): tema tetap sudah berganti.
    });
}
