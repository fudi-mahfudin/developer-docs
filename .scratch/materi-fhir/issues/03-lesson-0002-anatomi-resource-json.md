# 03: Lesson 0002: Anatomi resource JSON

**What to build:** `fhir/lessons/0002-anatomi-resource-json.html` + `fhir/assets/questions/0002.js` sesuai spec (`.scratch/materi-fhir/spec.md`). Topik inti: Patient, Encounter, Observation (JSON dibaca), `id` vs Identifier, Reference (relatif, `display`), CodeableConcept vs Coding (system/code/display, beberapa Coding), LOINC/SNOMED CT/ICD-10, `meta` (versionId, lastUpdated, profile), `contained`, `extension`, choice type `value[x]`, cardinality.

**Blocked by:** 01

**Status:** resolved

- [x] Mengikuti `/teach` (baca `~/.claude/skills/teach/SKILL.md`) dan membaca MISSION, NOTES, learning-records, RESOURCES, GLOSSARY di `fhir/` serta `assets/README.md`
- [x] Fakta dari sumber primer, setiap klaim penting dikutip; sumber baru masuk `fhir/RESOURCES.md`
- [x] Satu target pertanyaan interview di `div.win`; contoh JSON/TS pendek, tanpa lab; padanan JavaScript bila membantu
- [x] Bank soal: >= 8 kuis + >= 2 lisan (checklist 6 poin + contoh jawaban), topik berprefiks `res-`, semua berlabel
- [x] `tests/fhir-questions-0002.test.js` memeriksa cakupan topik inti; `node --test` hijau
- [x] Istilah baru di `fhir/GLOSSARY.md` (bagian yang sesuai); satu baris di `fhir/NOTES.md`
- [x] Baris 0002 di `fhir/index.html` menjadi `tersedia`; navigasi ke lesson sebelum/sesudah; membuat `fhir/reference/anatomi-resource.html` dan menautkannya

## Comments

Selesai (agent, 2026-10-26):
- `fhir/lessons/0002-anatomi-resource-json.html`: 8 bagian (kerangka resource + aturan JSON/cardinality, Patient id vs Identifier, Reference lewat Encounter, Observation CodeableConcept vs Coding, LOINC/SNOMED CT/ICD-10/UCUM + binding strength, choice type `value[x]`, `meta`/`contained`/`extension`, baca utuh Observation glukosa), masing-masing diakhiri kuis dari bank; 3 latihan lisan; tanpa lab. JSON diadaptasi dari contoh resmi R4 (patient-example, encounter-example-f001-heart, observation-example, observation-example-f001-glucose, contoh contained Condition di references.html). 20 sumber primer dikutip.
- `fhir/assets/questions/0002.js`: 20 kuis + 3 lisan, 10 topik `res-*` berlabel.
- `fhir/reference/anatomi-resource.html`: cheat sheet cetak, ditautkan dari lesson.
- `tests/fhir-questions-0002.test.js`: cakupan topik inti, kuis per topik di lesson, reference, entri indeks. `node --test` hijau (115/115).
- File bersama: baris 0002 di `fhir/index.html` (tersedia), bagian "Resource dan datatype" di `fhir/GLOSSARY.md`, entri baru di akhir Knowledge `fhir/RESOURCES.md`, satu baris di akhir `fhir/NOTES.md`.
- Belum terverifikasi: loinc.org menolak akses otomatis (403), jadi peran LOINC dikutip dari halaman Observation/LOINC spesifikasi FHIR, bukan dari Regenstrief. Nilai `meta` di contoh bagian 7 adalah ilustrasi (ditandai di lesson). Tautan nav ke `0001-fondasi-fhir.html` dan `0003-fhir-rest-api.html` bergantung pada nama file dari agent lain.
