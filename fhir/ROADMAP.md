# Roadmap — Interview Fullstack (Node.js + React) di Health-Tech dengan FHIR R4

**Profil:** kuat di TypeScript / Node.js / React, belum pernah memakai FHIR
**Format interview yang diantisipasi:** tanya-jawab konsep FHIR + desain integrasi (lisan)
**Alokasi:** self-paced, tanpa deadline. 29 lesson ±20 menit, **tanpa implementasi**: baca, kuis, latihan menjawab lisan (ADR 0002)
**Istilah:** [GLOSSARY.md](./GLOSSARY.md) · **Indeks lesson:** [index.html](./index.html)

| Modul | Lesson | Fokus |
|---|---|---|
| Fondasi | 0001–0003 | Apa itu FHIR dan Resource, HL7 v2 → FHIR, R4 vs R5, Profile/Extension/IG |
| Resource | 0004–0007 | Patient, Encounter, Observation; Identifier, Reference, CodeableConcept; LOINC/SNOMED CT/ICD-10 |
| REST | 0008–0011 | CRUD, search, Bundle `transaction` vs `batch`, versioning, `OperationOutcome` |
| **Review 1** | 0012 | Fondasi + Resource (tertunda satu modul) |
| Bulk Data | 0013–0016 | Bulk Data `$export`, NDJSON, streaming di Node |
| SMART | 0017–0020 | OAuth2 + PKCE, scopes, launch, backend services, `fhirclient` di React |
| **Review 2** | 0021 | REST + Bulk Data |
| SATUSEHAT | 0022–0023 | SATUSEHAT, validasi, mapping data legacy |
| PDP | 0024–0026 | UU PDP, UU Kesehatan, Permenkes Rekam Medis; field yang di-drop, di-HMAC, atau aman; enam saluran bocor; audit vs log |
| **Review 3** | 0027 | SMART + SATUSEHAT + PDP + topik lemah Review 1–2 |
| Penutup | 0028–0029 | Tanya-jawab interview campuran, STAR health-tech |

Menjelang interview: baca ulang tiga reference di `reference/`, dan ulangi soal lisan topik lemah dari ketiga review.
