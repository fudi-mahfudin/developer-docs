# 03: Workflow deploy dan dokumentasi

Status: resolved

**What to build:** Bagian Deploy dan Dokumentasi di `../spec.md`.

- `.github/workflows/deploy.yml` berjalan pada push ke `main` dan `workflow_dispatch`, dengan urutan `npm ci` → `node --test` → `npm run build` → `actions/upload-pages-artifact` (`_site/`) → `actions/deploy-pages`. Permissions: `pages: write`, `id-token: write`. Concurrency group `pages`.
- `docs/adr/0004-pwa.md` dengan format yang sama seperti ADR 0001–0003.
- Update `assets/README.md`: `pwa.js`, ikon, tag PWA disuntik saat build (jangan ditulis di HTML), dan `npm run preview`.
- Update `CLAUDE.md`: satu kalimat tentang PWA beserta tautan ke ADR 0004.

Blocked by: 01, 02

- [x] `.github/workflows/deploy.yml`
- [x] `docs/adr/0004-pwa.md`
- [x] `assets/README.md`, `CLAUDE.md`
