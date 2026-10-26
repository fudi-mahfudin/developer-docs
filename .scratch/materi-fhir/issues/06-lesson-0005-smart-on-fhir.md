# 06: Lesson 0005: Keamanan, SMART on FHIR, dan frontend React

**What to build:** `fhir/lessons/0005-smart-on-fhir.html` + `fhir/assets/questions/0005.js` sesuai spec (`.scratch/materi-fhir/spec.md`). Topik inti: OAuth2 authorization code + PKCE untuk SPA, discovery `.well-known/smart-configuration`, scopes (`patient/Observation.read` v1 vs `.rs` v2, `launch`, `openid fhirUser`, `offline_access`), EHR launch vs standalone launch, launch context (`patient`), backend services (client credentials + JWT assertion, terkait bulk 0004), `fhirclient` di React (`oauth2.authorize`/`ready`), menampilkan CodeableConcept (text → display Coding), penyimpanan token di browser, data sensitif (PHI) dan audit secara konsep.

**Blocked by:** 01

**Status:** resolved

- [x] Mengikuti `/teach` (baca `~/.claude/skills/teach/SKILL.md`) dan membaca MISSION, NOTES, learning-records, RESOURCES, GLOSSARY di `fhir/` serta `assets/README.md`
- [x] Fakta dari sumber primer, setiap klaim penting dikutip; sumber baru masuk `fhir/RESOURCES.md`
- [x] Satu target pertanyaan interview di `div.win`; contoh JSON/TS pendek, tanpa lab; padanan JavaScript bila membantu
- [x] Bank soal: >= 8 kuis + >= 2 lisan (checklist 6 poin + contoh jawaban), topik berprefiks `smart-`, semua berlabel
- [x] `tests/fhir-questions-0005.test.js` memeriksa cakupan topik inti; `node --test` hijau
- [x] Istilah baru di `fhir/GLOSSARY.md` (bagian yang sesuai); satu baris di `fhir/NOTES.md`
- [x] Baris 0005 di `fhir/index.html` menjadi `tersedia`; navigasi ke lesson sebelum/sesudah

## Comments
