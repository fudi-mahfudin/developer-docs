Status: in-progress

# Spec: Progressive Web App untuk docs.mahfudin.com

Hasil grilling 2026-11-20.

## Problem Statement

Situs ini (4 track, 164 halaman HTML statis) hanya bisa dibaca saat online, atau dari `file://` di laptop yang punya salinan repo. Materi ini ingin dibaca di HTTP juga, termasuk tanpa sinyal, dan dibuka seperti aplikasi dari home screen atau dock.

## Solution

Situs dijadikan PWA sebagai **progressive enhancement**. Saat build di GitHub Actions, Workbox membuat service worker yang mem-precache seluruh materi. Tag manifest dan skrip registrasi SW disuntikkan ke setiap HTML di artefak deploy. File sumber tidak berubah, sehingga `file://` berperilaku persis seperti sekarang, dan menambah lesson tidak butuh langkah tambahan apa pun.

## Keputusan

- **Tujuan:** baca offline dan installable. Situs dipakai sendiri, jadi update berjalan senyap. Progres kuis, notifikasi, dan state aplikasi lain **di luar cakupan**.
- **`file://` tetap kontrak utama** (`assets/README.md`, ADR 0003). PWA hanya aktif di `https:` atau `http://localhost`. Skrip registrasi diam-diam tidak melakukan apa-apa di protokol lain atau bila `navigator.serviceWorker` tidak ada.
- **Menambah materi tetap semudah sebelumnya:** tidak ada daftar file yang diedit manual. Tidak ada tag yang perlu ditulis di HTML baru.
- **Satu PWA di root**, scope `/`, untuk semua track.
- **Manifest** (`manifest.webmanifest` di root):
  - `name` "Persiapan Interview", `short_name` "Interview"
  - `start_url` `/`, `display` `standalone`
  - `theme_color` `#8b1e3f` (`--accent`), `background_color` `#fffff8` (`--paper`)
- **Ikon:**
  - Sumbernya satu file `assets/icon.svg` berisi monogram putih di atas `#8b1e3f`.
  - PNG 192 dan 512, varian maskable 512, dan `apple-touch-icon` 180 di-generate **sekali secara lokal** dengan dependency (mis. `@vite-pwa/assets-generator`), lalu di-commit ke `assets/icons/`.
- **Install:** memakai UI bawaan browser saja, tanpa tombol kustom.
- **Tooling di root:**
  - `package.json` berisi devDependencies (`workbox-build`, generator ikon, server statis untuk preview) dan script `build`, `preview`, `test`, `icons`.
  - `scripts/build-pwa.js` berisi logika build.
  - `_site/` dan `node_modules/` ditambahkan ke `.gitignore`.
  - Tes yang sudah ada tetap jalan dengan `node --test` tanpa `npm install`.
- **Build (`npm run build`):**
  1. Salin situs ke `_site/` tanpa `tests/`, `docs/`, `.scratch/`, `scripts/`, `node_modules/`, `.claude/`, `pdf/`, `.github/`, `_site/`, `package*.json`, dan dotfile. `CNAME` ikut disalin. File `*.md` (termasuk `star/`) **ikut** apa adanya karena sekitar 160 tautan di HTML menunjuk ke sana (Q22, lihat Catatan).
  2. Suntik ke `<head>` setiap `_site/**/*.html`: `<link rel="manifest">`, `<meta name="theme-color">`, `<link rel="apple-touch-icon">`, dan `<script src="/assets/pwa.js" defer>`. Path absolut (`/`) aman karena injeksi hanya terjadi di artefak HTTPS. Halaman yang sudah memuat tag tersebut tidak disuntik dua kali (idempoten).
  3. `workbox-build` `generateSW` atau `injectManifest` membuat `_site/sw.js`:
     - **Precache** semua file yang tersalin ke `_site/` (`html`, `js`, `css`, `svg`, `png`, `webmanifest`, `md`, `sql`, `cs`) kecuali `sw.js` dan `CNAME`, dengan hash revisi. Ukurannya sekitar 4–5 MB.
     - **HTML (navigasi):** network-first dengan timeout 3 detik, lalu jatuh ke precache.
     - **Aset (JS/CSS/gambar/lab):** cache-first dari precache.
     - **Fallback navigasi offline** untuk URL di luar precache: `offline.html`.
     - `skipWaiting` + `clientsClaim`, dan cache lama dibersihkan (`cleanupOutdatedCaches`).
     - URL eksternal (tautan sitasi) tidak di-cache.
- **`offline.html`** di root: halaman minimal yang memakai `assets/style.css` dan menautkan kembali ke `/`.
- **`assets/pwa.js`:** hanya meregistrasi `/sw.js` bila protokolnya `https:` atau host-nya `localhost`.
- **Preview lokal (`npm run preview`):** build, lalu sajikan `_site/` di `http://localhost:<port>` untuk mencoba SW, offline, dan install sebelum push.
- **Deploy:**
  - Workflow GitHub Actions `.github/workflows/deploy.yml` berjalan pada push ke `main` (plus `workflow_dispatch`): `npm ci` → `node --test` → `npm run build` → `actions/upload-pages-artifact` (`_site/`) → `actions/deploy-pages`.
  - Deploy tidak terjadi bila ada tes yang merah.
- **Branch produksi:** hanya `main`. Merge `materi-fullstack` **tidak termasuk** pekerjaan ini. Mode Pages langsung diganti ke "GitHub Actions" begitu workflow siap. Konsekuensinya (disetujui): track fullstack tidak tayang sampai pemilik repo sendiri merge `materi-fullstack` ke `main`.
- **HTTPS:** Enforce HTTPS dinyalakan di pengaturan Pages (sertifikat `docs.mahfudin.com` sudah approved).
- **Dokumentasi:**
  - `docs/adr/0004-pwa.md`: PWA sebagai progressive enhancement, `file://` tetap kontrak, Workbox di CI, deploy dari `main`, dan folder `scripts/` serta `package.json` di root sebagai tambahan atas struktur ADR 0001.
  - Update `assets/README.md` (baris `pwa.js`, ikon, dan catatan bahwa tag PWA disuntik saat build sehingga tidak ditulis di HTML).
  - Update `CLAUDE.md` (satu kalimat dan tautan ke ADR 0004).

## Catatan

- **Q22 (2026-11-20):** awalnya `*.md` dan `star/` dikecualikan. Ternyata HTML menautkan `GLOSSARY.md`, `RESOURCES.md`, `ROADMAP.md`, `MISSION.md`, dan `star/draf-star.md`. Produksi lama (Jekyll) menyajikannya sebagai `text/markdown`, jadi file-file itu disalin apa adanya untuk mempertahankan perilaku tersebut. Rendering markdown ke HTML di luar cakupan.

## Testing

- `tests/shared/build-pwa.test.js` (`node --test`, tanpa dependency, menguji fungsi murni yang di-export `scripts/build-pwa.js`):
  - **Injeksi:** tag masuk tepat sebelum `</head>`, idempoten, dan HTML lain tidak berubah.
  - **Filter salin/precache:** `tests/`, `docs/`, `.scratch/`, `scripts/`, dotfile tidak ikut. Lesson, `assets/`, `*/assets/questions/`, `*/lab/`, `*.md` (termasuk `star/`), `CNAME`, `offline.html`, manifest, dan ikon ikut.
  - **Tidak ada tautan relatif di HTML yang menunjuk ke file yang dikecualikan.**
  - **Manifest:** valid JSON, field sesuai keputusan, dan semua ikon yang dirujuk ada di repo.
- `require("../../scripts/build-pwa.js")` tidak boleh memuat `workbox-build` di top-level (pakai lazy require di fungsi build), supaya tes jalan tanpa `npm install`.
- Verifikasi manual lewat `npm run preview`: SW aktif, mode offline di DevTools masih bisa membuka lesson yang belum pernah dikunjungi, Lighthouse menyatakan installable, dan membuka file dari `file://` tidak memunculkan error di console.

## Issues

1. `issues/01-build-pwa.md`: build PWA, manifest, offline page, tes (ready-for-agent)
2. `issues/02-ikon.md`: ikon (ready-for-agent)
3. `issues/03-deploy-dan-dokumentasi.md`: workflow Actions, ADR 0004, README, CLAUDE.md (ready-for-agent)
4. `issues/04-pengaturan-pages.md`: ganti mode Pages dan Enforce HTTPS (ready-for-human)
