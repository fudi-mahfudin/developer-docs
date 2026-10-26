# 04: Lesson 0003: FHIR REST API

**What to build:** `fhir/lessons/0003-fhir-rest-api.html` + `fhir/assets/questions/0003.js` sesuai spec (`.scratch/materi-fhir/spec.md`). Topik inti: interaksi read/vread/search/create/update/patch/delete/history + status HTTP, search parameter dan tipe (token, reference, date, string), modifier (`:exact`, `:missing`), prefix tanggal (`ge`, `lt`), chaining, `_include`/`_revinclude`, paging (`_count`, link next), Bundle searchset/transaction/batch, conditional create, ETag/`If-Match` (optimistic locking), `OperationOutcome`, CapabilityStatement (`/metadata`).

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] Mengikuti `/teach` (baca `~/.claude/skills/teach/SKILL.md`) dan membaca MISSION, NOTES, learning-records, RESOURCES, GLOSSARY di `fhir/` serta `assets/README.md`
- [ ] Fakta dari sumber primer, setiap klaim penting dikutip; sumber baru masuk `fhir/RESOURCES.md`
- [ ] Satu target pertanyaan interview di `div.win`; contoh JSON/TS pendek, tanpa lab; padanan JavaScript bila membantu
- [ ] Bank soal: >= 8 kuis + >= 2 lisan (checklist 6 poin + contoh jawaban), topik berprefiks `rest-`, semua berlabel
- [ ] `tests/fhir-questions-0003.test.js` memeriksa cakupan topik inti; `node --test` hijau
- [ ] Istilah baru di `fhir/GLOSSARY.md` (bagian yang sesuai); satu baris di `fhir/NOTES.md`
- [ ] Baris 0003 di `fhir/index.html` menjadi `tersedia`; navigasi ke lesson sebelum/sesudah; membuat `fhir/reference/rest-search-bundle.html` dan menautkannya

## Comments
