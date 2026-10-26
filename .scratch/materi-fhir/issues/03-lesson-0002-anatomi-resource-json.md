# 03: Lesson 0002: Anatomi resource JSON

**What to build:** `fhir/lessons/0002-anatomi-resource-json.html` + `fhir/assets/questions/0002.js` sesuai spec (`.scratch/materi-fhir/spec.md`). Topik inti: Patient, Encounter, Observation (JSON dibaca), `id` vs Identifier, Reference (relatif, `display`), CodeableConcept vs Coding (system/code/display, beberapa Coding), LOINC/SNOMED CT/ICD-10, `meta` (versionId, lastUpdated, profile), `contained`, `extension`, choice type `value[x]`, cardinality.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] Mengikuti `/teach` (baca `~/.claude/skills/teach/SKILL.md`) dan membaca MISSION, NOTES, learning-records, RESOURCES, GLOSSARY di `fhir/` serta `assets/README.md`
- [ ] Fakta dari sumber primer, setiap klaim penting dikutip; sumber baru masuk `fhir/RESOURCES.md`
- [ ] Satu target pertanyaan interview di `div.win`; contoh JSON/TS pendek, tanpa lab; padanan JavaScript bila membantu
- [ ] Bank soal: >= 8 kuis + >= 2 lisan (checklist 6 poin + contoh jawaban), topik berprefiks `res-`, semua berlabel
- [ ] `tests/fhir-questions-0002.test.js` memeriksa cakupan topik inti; `node --test` hijau
- [ ] Istilah baru di `fhir/GLOSSARY.md` (bagian yang sesuai); satu baris di `fhir/NOTES.md`
- [ ] Baris 0002 di `fhir/index.html` menjadi `tersedia`; navigasi ke lesson sebelum/sesudah; membuat `fhir/reference/anatomi-resource.html` dan menautkannya

## Comments
