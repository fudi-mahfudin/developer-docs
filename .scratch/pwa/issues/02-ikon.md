# 02: Ikon aplikasi

Status: resolved

**What to build:** Bagian Ikon di `../spec.md`.

- `assets/icon.svg`: monogram putih sederhana di atas latar `#8b1e3f`, dengan safe zone yang cukup untuk varian maskable.
- Script `icons` di `package.json` meng-generate ikon (mis. `@vite-pwa/assets-generator`) ke `assets/icons/`: PNG 192, PNG 512, maskable 512, dan `apple-touch-icon` 180. Hasilnya di-commit, tidak di-generate di CI.
- Pastikan path di `manifest.webmanifest` dan tag `apple-touch-icon` yang disuntik cocok dengan nama file. Aktifkan tes ikon-ada di `tests/shared/build-pwa.test.js`.

Blocked by: 01

- [x] `assets/icon.svg`
- [x] `assets/icons/*.png` di-commit, plus script `icons`
- [x] Tes ikon-ada lulus, dan Lighthouse "installable" di `npm run preview`
