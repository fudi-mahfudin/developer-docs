# 01: Prefactor: kerangka track, index, dokumen, aturan test

Status: resolved

**What to build:** Kerangka folder `nodejs/` sesuai ADR 0001 dan ADR 0003: `index.html`, `MISSION.md`, `ROADMAP.md`, `NOTES.md`, `RESOURCES.md`, `GLOSSARY.md`, serta folder `lessons/`, `reference/`, `learning-records/`, dan `assets/questions/`.
- MISSION diambil dari `../spec.md`. Verifikasi versi major NestJS terbaru di docs.nestjs.com dan catat di Constraints.
- ROADMAP berisi tabel modul dan lesson.
- `index.html` mendaftar 36 lesson per modul. Review memakai kelas `seam`. 0036 ditandai opsional ±45 menit.
- `RESOURCES.md` memuat sumber primer dari spec, plus bagian "Bacaan lanjutan (di luar cakupan)" untuk GraphQL, microservices, WebSocket, dan CQRS.
- Tambahkan baris baru di `GLOSSARY-MAP.md`, tautan di root `index.html`, dan sebutkan track `nodejs/` di bagian Domain docs `CLAUDE.md` (`tests/{shared,dotnet,fhir,sysdesign,nodejs}/`).
- Buat `tests/nodejs/track.test.js` sesuai bagian Testing di spec.

Catatan: root `index.html` punya perubahan yang belum di-commit (tautan draf STAR dihapus). Pertahankan perubahan itu dan jangan dikembalikan.

- [x] Folder dan dokumen track (MISSION, ROADMAP, NOTES, RESOURCES, kerangka GLOSSARY)
- [x] `nodejs/index.html`, root `index.html`, `GLOSSARY-MAP.md`, `CLAUDE.md`
- [x] `tests/nodejs/track.test.js` (lulus untuk lesson yang sudah ada; lesson yang belum ada tidak dicek sampai ditautkan di index)
