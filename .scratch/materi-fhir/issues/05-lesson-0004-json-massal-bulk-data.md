# 05: Lesson 0004: JSON massal: Bulk Data dan streaming di Node

**What to build:** `fhir/lessons/0004-json-massal-bulk-data.html` + `fhir/assets/questions/0004.js` sesuai spec (`.scratch/materi-fhir/spec.md`). Topik inti: Bulk Data Access IG: level system/group/patient `$export`, kick-off dengan `Prefer: respond-async`, 202 + `Content-Location`, polling (`Retry-After`, 429), manifest, NDJSON, `_type`/`_since`, auth lewat SMART backend services (detail di 0005); di Node: kenapa `JSON.parse` satu file besar bermasalah (memori, blocking event loop), streaming baris per baris dengan `readline`/`stream`, backpressure, `pipeline`, `stream-json` untuk JSON besar non-NDJSON, batching ke database; presisi `decimal` FHIR di JS.

**Blocked by:** 01

**Status:** resolved

- [x] Mengikuti `/teach` (baca `~/.claude/skills/teach/SKILL.md`) dan membaca MISSION, NOTES, learning-records, RESOURCES, GLOSSARY di `fhir/` serta `assets/README.md`
- [x] Fakta dari sumber primer, setiap klaim penting dikutip; sumber baru masuk `fhir/RESOURCES.md`
- [x] Satu target pertanyaan interview di `div.win`; contoh JSON/TS pendek, tanpa lab; padanan JavaScript bila membantu
- [x] Bank soal: >= 8 kuis + >= 2 lisan (checklist 6 poin + contoh jawaban), topik berprefiks `bulk-`, semua berlabel
- [x] `tests/fhir-questions-0004.test.js` memeriksa cakupan topik inti; `node --test` hijau
- [x] Istilah baru di `fhir/GLOSSARY.md` (bagian yang sesuai); satu baris di `fhir/NOTES.md`
- [x] Baris 0004 di `fhir/index.html` menjadi `tersedia`; navigasi ke lesson sebelum/sesudah

## Comments

**Selesai.** File baru: `fhir/lessons/0004-json-massal-bulk-data.html`, `fhir/assets/questions/0004.js`, `tests/fhir-questions-0004.test.js`. File bersama: baris 0004 di `fhir/index.html`, bagian "Bulk Data dan JSON skala besar" di `fhir/GLOSSARY.md` (12 istilah), 7 entri di akhir Knowledge `fhir/RESOURCES.md`, satu baris di `fhir/NOTES.md`.

- Lesson 7 bagian (level `$export`; alur kick-off → 202 → polling → manifest + latihan urutan `order.js`; manifest/NDJSON/`_type`/`_since`; batas `JSON.parse`; `readline` + batching + `stream-json`; backpressure + `pipeline`; presisi `decimal`), masing-masing diakhiri kuis, lalu 2 latihan lisan. Tanpa lab.
- Bank soal: 16 kuis (7 topik `bulk-`, masing-masing >= 2) + 2 lisan (`bulk-polling`, `bulk-backpressure`).
- Sumber: Bulk Data Access IG **v2.0.0 (STU 2)** `https://hl7.org/fhir/uv/bulkdata/STU2/export.html` (halaman mencatat 3.0.0 sudah menggantikannya), FHIR R4 nd-json/json/datatypes/vital signs, Node.js API stream/readline/buffer, Node Learn (backpressure, JSON DOS), README stream-json 3.x, MDN JSON.parse.
- Dicek langsung di Node 24.21.0: `MAX_STRING_LENGTH` = 536.870.888, `JSON.parse` 2.00 → 2, reviver `context.source` → `"2.00"`, dan snippet `pipeline` + async generator + `Readable.fromWeb` berjalan.
- Belum terverifikasi: perilaku backpressure async iterator `readline` (dokumentasi tidak menjanjikannya; lesson menyarankan `pipeline` untuk produksi). Contoh `stream-json` disalin dari README, tidak dijalankan.
- `node --test`: 115 pass, 0 fail.

Status: resolved
