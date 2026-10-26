# Roadmap 1 Hari — Interview Fullstack (Node.js + React) di Health-Tech dengan FHIR R4

**Profil:** kuat di TypeScript / Node.js / React, belum pernah memakai FHIR
**Format interview yang diantisipasi:** tanya-jawab konsep FHIR + desain integrasi (lisan)
**Alokasi:** 6–8 jam dalam 1 hari, **tanpa implementasi**: baca, kuis, latihan menjawab lisan
**Istilah:** [GLOSSARY.md](./GLOSSARY.md) · **Indeks lesson:** [index.html](./index.html)

| Waktu | Lesson | Fokus |
|---|---|---|
| 08.00–09.00 | 0001 Fondasi FHIR | Apa itu FHIR dan Resource, HL7 v2 → FHIR, R4 vs R5, Profile/Extension/IG |
| 09.00–10.15 | 0002 Anatomi resource JSON | Patient, Encounter, Observation; Identifier, Reference, CodeableConcept; LOINC/SNOMED CT/ICD-10 |
| 10.30–12.00 | 0003 FHIR REST API | CRUD, search, Bundle `transaction` vs `batch`, versioning, `OperationOutcome` |
| 13.00–14.15 | 0004 JSON massal | Bulk Data `$export`, NDJSON, streaming di Node |
| 14.30–15.45 | 0005 SMART on FHIR & frontend | OAuth2 + PKCE, scopes, launch, backend services, `fhirclient` di React |
| 16.00–17.30 | 0006 SATUSEHAT + review | SATUSEHAT, mapping data legacy, review campuran (seam), STAR health-tech |

Malam sebelum interview: baca ulang dua reference di `reference/` dan ulangi soal lisan yang lemah dari review 0006.
