# 01: Build PWA: package.json, build script, manifest, offline page, tes

Status: resolved

**What to build:** Bagian build dari `../spec.md` (Tooling, Build, `offline.html`, `assets/pwa.js`, Preview lokal, Testing).

- `package.json` di root berisi devDependencies (`workbox-build`, server statis untuk preview) dan script `build`, `preview`, `test` (`node --test`).
- `scripts/build-pwa.js` menjalankan salin ke `_site/` dengan filter, injeksi tag ke `<head>`, lalu pembuatan `sw.js` dengan Workbox. Fungsi murni (filter path, injeksi HTML) di-export. `workbox-build` di-require secara lazy.
- `manifest.webmanifest`, `offline.html`, dan `assets/pwa.js` di root/`assets/`. Path ikon di manifest merujuk ke `assets/icons/` (file-nya dibuat di issue 02). Tes ikon-ada boleh `skip` sampai issue 02 selesai.
- `.gitignore`: tambahkan `_site/` dan `node_modules/`.
- `tests/shared/build-pwa.test.js` sesuai bagian Testing di spec.
- File sumber HTML **tidak** diubah.

- [x] `package.json`, `.gitignore`
- [x] `scripts/build-pwa.js` (salin + injeksi + SW: precache, network-first HTML 3 detik, fallback `offline.html`, skipWaiting/clientsClaim)
- [x] `manifest.webmanifest`, `offline.html`, `assets/pwa.js`
- [x] `tests/shared/build-pwa.test.js` lulus, dan seluruh `node --test` tetap hijau tanpa `npm install`
- [x] `npm run preview`: SW aktif, lesson yang belum dikunjungi bisa dibuka saat offline, `file://` tidak memunculkan error

## Comments

- 2026-11-20: Selesai. SW disusun dari `scripts/sw-src.js` (esbuild + Workbox `injectManifest`), karena `generateSW` tidak bisa network-first untuk HTML dengan fallback ke precache. Tambahan di luar spec: `<link rel="icon">` ikut disuntik (menghilangkan 404 favicon). Tes tautan menemukan `dotnet/index.html -> ../.scratch/urutan-lesson/spec.md`, yang sudah 404 di produksi lama; dicatat sebagai pengecualian yang diketahui, tautannya tidak diubah. Diverifikasi di Chrome headless: 328 file di-precache, lesson/index/`.md`/URL asing terbuka saat offline, manifest tanpa error, `file://` tanpa error.
