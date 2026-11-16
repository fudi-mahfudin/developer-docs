# 01: Prefactor: kerangka track, index, dokumen, aturan test

Status: resolved

**What to build:** Kerangka folder `fullstack/` untuk track **baca-saja**: `index.html`, `MISSION.md`, `ROADMAP.md`, `RESOURCES.md`, `GLOSSARY.md`, serta folder `lessons/` dan `reference/`. Tidak ada `NOTES.md`, `learning-records/`, atau `assets/questions/`. Semua perubahan hanya di branch `on-bsm`.
- MISSION diambil dari `../spec.md`, termasuk bagian penyimpangan dari ADR 0003. Verifikasi versi stabil Next.js, Express, Prisma, dan PostgreSQL di dokumentasi resmi, lalu catat di Constraints beserta tanggal verifikasi.
- ROADMAP berisi tabel 10 lesson + 2 reference, dengan durasi masing-masing.
- `index.html` mendaftar 10 lesson dan 2 reference, tanpa elemen interaktif.
- `RESOURCES.md` memuat sumber primer dari spec, plus bacaan lanjutan (LeetCode/NeetCode untuk pola, DP/graph, Docker).
- Tambahkan baris di `GLOSSARY-MAP.md`, tautan di root `index.html`, dan sebutkan `fullstack/` di bagian Domain docs `CLAUDE.md` (`tests/{shared,dotnet,fhir,sysdesign,nodejs,fullstack}/`).
- Buat `tests/fullstack/track.test.js` sesuai bagian Testing di spec, dan pastikan `tests/shared` tidak gagal karena track tanpa bank soal (sesuaikan dengan cara yang paling kecil bila perlu).
- Jangan sentuh `star/`.

- [x] Folder dan dokumen track
- [x] `fullstack/index.html`, root `index.html`, `GLOSSARY-MAP.md`, `CLAUDE.md`
- [x] `tests/fullstack/track.test.js` hijau dan `tests/shared` tetap hijau
