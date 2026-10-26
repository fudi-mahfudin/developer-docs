# 04: Lesson 0003: FHIR REST API

**What to build:** `fhir/lessons/0003-fhir-rest-api.html` + `fhir/assets/questions/0003.js` sesuai spec (`.scratch/materi-fhir/spec.md`). Topik inti: interaksi read/vread/search/create/update/patch/delete/history + status HTTP, search parameter dan tipe (token, reference, date, string), modifier (`:exact`, `:missing`), prefix tanggal (`ge`, `lt`), chaining, `_include`/`_revinclude`, paging (`_count`, link next), Bundle searchset/transaction/batch, conditional create, ETag/`If-Match` (optimistic locking), `OperationOutcome`, CapabilityStatement (`/metadata`).

**Blocked by:** 01

**Status:** resolved

- [x] Mengikuti `/teach` (baca `~/.claude/skills/teach/SKILL.md`) dan membaca MISSION, NOTES, learning-records, RESOURCES, GLOSSARY di `fhir/` serta `assets/README.md`
- [x] Fakta dari sumber primer, setiap klaim penting dikutip; sumber baru masuk `fhir/RESOURCES.md`
- [x] Satu target pertanyaan interview di `div.win`; contoh JSON/TS pendek, tanpa lab; padanan JavaScript bila membantu
- [x] Bank soal: >= 8 kuis + >= 2 lisan (checklist 6 poin + contoh jawaban), topik berprefiks `rest-`, semua berlabel
- [x] `tests/fhir-questions-0003.test.js` memeriksa cakupan topik inti; `node --test` hijau
- [x] Istilah baru di `fhir/GLOSSARY.md` (bagian yang sesuai); satu baris di `fhir/NOTES.md`
- [x] Baris 0003 di `fhir/index.html` menjadi `tersedia`; navigasi ke lesson sebelum/sesudah; membuat `fhir/reference/rest-search-bundle.html` dan menautkannya

## Comments

Dikerjakan 2026-10-26.

- `fhir/lessons/0003-fhir-rest-api.html` (±75 menit, 7 bagian konsep + kuis, 3 latihan lisan, tanpa lab): interaksi + status (404/410, 201 + Location, 200/201, 200/204), search (tipe string/token/reference/date, `:exact`/`:contains`/`:missing`/`:not`, prefix, AND/OR, `handling=strict`), chaining vs `_include`/`_revinclude`, paging (`_count`, link `next` opaque, `total`, `entry.search.mode`) + generator `fetch` TS, transaction vs batch (`urn:uuid`, urutan proses, latihan `order.js`), conditional create/update, ETag/`If-Match` → 412 + vread/history, `OperationOutcome` (400 vs 422) dan CapabilityStatement (`/metadata`). Kutipan ke 11 halaman hl7.org/fhir/R4.
- `fhir/assets/questions/0003.js`: 16 kuis + 3 lisan, 7 topik `rest-*` berlabel.
- `fhir/reference/rest-search-bundle.html`: cheat sheet cetak, ditautkan dari lesson.
- `tests/fhir-questions-0003.test.js`: cakupan 7 topik (>= 2 kuis per topik), kata kunci inti, lisan untuk include/bundle/versioning, render kuis per topik, reference, nav 0002 → 0003 → 0004, entri indeks. `node --test`: 115/115 hijau.
- File bersama: baris 0003 di `fhir/index.html` (tersedia), bagian "REST API" di `fhir/GLOSSARY.md`, 5 entri baru di akhir Knowledge `fhir/RESOURCES.md`, satu baris di `fhir/NOTES.md`.
- Belum terverifikasi dari sumber primer: padanan JS (Prisma `include`/`$transaction`, `Promise.allSettled`, OpenAPI) ditulis sebagai analogi saja; format URL `next` dan teks `diagnostics` di contoh JSON ditandai ilustrasi. Link ke 0002/0004 bergantung pada nama file yang dibuat agent lain (`0002-anatomi-resource-json.html`, `0004-json-massal-bulk-data.html`).
