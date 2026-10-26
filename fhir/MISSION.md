# Mission: Lolos interview Fullstack Developer (Node/React) di perusahaan health-tech yang memakai FHIR

## Why
Melamar posisi fullstack mid-level (backend Node.js + frontend React) yang bekerja dengan data kesehatan berbasis HL7 FHIR. Dalam 1 hari harus bisa menjawab pertanyaan konsep FHIR dan pengolahan JSON skala besar dengan yakin, memakai bahasa dan contoh dari ekosistem JavaScript/TypeScript.

## Success looks like
- Bisa menjelaskan apa itu FHIR, Resource, dan kenapa FHIR R4 dipakai (dibanding HL7 v2) dalam < 1 menit
- Bisa membaca JSON Patient, Encounter, dan Observation lalu menjelaskan Identifier, Reference, dan CodeableConcept/Coding beserta terminologinya (LOINC, SNOMED CT, ICD-10)
- Bisa menjelaskan interaksi REST FHIR: CRUD, search (modifier, chaining, `_include`), Bundle `transaction` vs `batch`, versioning dengan ETag/`If-Match`, dan `OperationOutcome`
- Bisa menjelaskan alur Bulk Data `$export` (kick-off → 202 → polling → NDJSON) dan cara memproses NDJSON besar di Node dengan streaming tanpa kehabisan memori
- Bisa menjelaskan SMART on FHIR: OAuth2 + PKCE, scopes, EHR launch vs standalone launch, backend services, dan cara React app memakai `fhirclient`
- Bisa menjelaskan posisi SATUSEHAT (Kemenkes) dan cara memetakan data legacy ke FHIR
- Punya 4 cerita STAR yang sudah di-reframe ke konteks health-tech

## Constraints
- 1 hari (6–8 jam), fokus **konsep untuk interview**, tanpa implementasi: tidak ada lab, tidak ada server FHIR yang dijalankan
- Contoh kode hanya TypeScript/Node/React pendek untuk dibaca
- Bahasa Indonesia, istilah teknis tetap bahasa Inggris
- Versi: FHIR R4 (4.0.1); R5 hanya disebut sekilas

## Out of scope
- Implementasi server/klien FHIR, setup HAPI/Medplum, menulis profile/IG sendiri (FHIR Shorthand, SUSHI)
- HL7 v2/CDA secara mendalam (cukup sebagai latar belakang)
- Track .NET + Angular di root repo (workspace terpisah)
