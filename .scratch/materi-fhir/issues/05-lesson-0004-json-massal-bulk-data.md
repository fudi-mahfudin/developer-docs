# 05: Lesson 0004: JSON massal: Bulk Data dan streaming di Node

**What to build:** `fhir/lessons/0004-json-massal-bulk-data.html` + `fhir/assets/questions/0004.js` sesuai spec (`.scratch/materi-fhir/spec.md`). Topik inti: Bulk Data Access IG: level system/group/patient `$export`, kick-off dengan `Prefer: respond-async`, 202 + `Content-Location`, polling (`Retry-After`, 429), manifest, NDJSON, `_type`/`_since`, auth lewat SMART backend services (detail di 0005); di Node: kenapa `JSON.parse` satu file besar bermasalah (memori, blocking event loop), streaming baris per baris dengan `readline`/`stream`, backpressure, `pipeline`, `stream-json` untuk JSON besar non-NDJSON, batching ke database; presisi `decimal` FHIR di JS.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] Mengikuti `/teach` (baca `~/.claude/skills/teach/SKILL.md`) dan membaca MISSION, NOTES, learning-records, RESOURCES, GLOSSARY di `fhir/` serta `assets/README.md`
- [ ] Fakta dari sumber primer, setiap klaim penting dikutip; sumber baru masuk `fhir/RESOURCES.md`
- [ ] Satu target pertanyaan interview di `div.win`; contoh JSON/TS pendek, tanpa lab; padanan JavaScript bila membantu
- [ ] Bank soal: >= 8 kuis + >= 2 lisan (checklist 6 poin + contoh jawaban), topik berprefiks `bulk-`, semua berlabel
- [ ] `tests/fhir-questions-0004.test.js` memeriksa cakupan topik inti; `node --test` hijau
- [ ] Istilah baru di `fhir/GLOSSARY.md` (bagian yang sesuai); satu baris di `fhir/NOTES.md`
- [ ] Baris 0004 di `fhir/index.html` menjadi `tersedia`; navigasi ke lesson sebelum/sesudah

## Comments
