# 01: Prefactor: kerangka track, index, CSS diagram, aturan test

Status: resolved

**What to build:** Kerangka folder `sysdesign/` sesuai ADR 0001 dan ADR 0003 (`index.html`, `MISSION/ROADMAP/NOTES/RESOURCES/GLOSSARY.md`, `lessons/`, `reference/`, `learning-records/`, `assets/questions/`). MISSION dari `../spec.md`; ROADMAP berisi tabel modul dan lesson; `index.html` mendaftar 36 lesson per modul (review berkelas `seam`, 0036 ditandai opsional ±45 menit). Baris baru di `GLOSSARY-MAP.md`, tautan di root `index.html`, dan penyebutan track `sysdesign/` di bagian Domain docs `CLAUDE.md`. Kelas `.diagram` untuk inline SVG di `assets/style.css` (node, panah, label, warna komponen: client, service, data store, cache, queue), terdokumentasi di `assets/README.md` dengan satu contoh di `assets/examples/`. `tests/sysdesign/track.test.js` sesuai bagian Testing di spec.

- [x] Folder dan dokumen track (MISSION, ROADMAP, NOTES, RESOURCES, GLOSSARY kerangka)
- [x] `sysdesign/index.html`, root `index.html`, `GLOSSARY-MAP.md`, `CLAUDE.md`
- [x] CSS `.diagram` + README + contoh
- [x] `tests/sysdesign/track.test.js` (lulus untuk lesson yang sudah ada; lesson belum ada tidak dicek sampai ditautkan di index)

## Comments

- 2026-10-31: selesai. Contoh diagram `assets/examples/diagram-example.html` (dicek dengan screenshot headless Chrome). Folder kosong diberi `.gitkeep`. `track.test.js` juga memeriksa kicker `Lesson NNNN · System Design · `, 0036 bertanda opsional, dan tidak ada tautan ke `dotnet/`/`fhir/`. Reveal latihan diagram memakai `<details>` biasa (CSS reveal di `style.css`), bukan `.sql-exercise` dari `hands-on.js` yang khusus SQL (spec diperbarui).
