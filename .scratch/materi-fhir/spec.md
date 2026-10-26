Status: ready-for-agent

# Spec: Materi FHIR + JSON massal — persiapan interview fullstack (Node/React) health-tech dalam 1 hari

## Problem Statement

Saya kuat di ekosistem JavaScript (TypeScript, Node.js, React) dan melamar posisi fullstack mid-level di perusahaan health-tech yang memakai HL7 FHIR. Saya belum pernah memakai FHIR. Waktu saya 1 hari. Di interview kemungkinan muncul pertanyaan seperti:

- "Apa itu FHIR, dan apa bedanya dengan HL7 v2?"
- "Jelaskan JSON Observation ini. Apa itu CodeableConcept, dan kenapa ada beberapa Coding?"
- "Bagaimana cara mencari semua Observation milik satu pasien beserta Patient-nya dalam satu request?"
- "Apa beda Bundle `transaction` dan `batch`?"
- "Bagaimana Anda mengekspor jutaan resource dan memprosesnya di Node tanpa kehabisan memori?"
- "Bagaimana React app Anda mendapat akses ke data pasien di EHR? Apa itu SMART on FHIR?"
- "Pernah dengar SATUSEHAT? Bagaimana memetakan data rumah sakit lama ke FHIR?"

Belum ada materi FHIR di repo. Materi yang ada (track .NET + Angular di root) untuk posisi lain.

## Solution

Track baru yang terpisah di folder `fhir/` (workspace `/teach` sendiri: MISSION, ROADMAP, NOTES, RESOURCES, GLOSSARY, learning-records, lessons, reference, `assets/questions`). Komponen bersama (`style.css`, kuis, bank soal, review) dipakai dari `assets/` root. Isinya 6 lesson konsep tanpa implementasi, total 6–8 jam:

| # | Lesson | Isi utama |
|---|---|---|
| 0001 | Fondasi FHIR | HL7 v2 → FHIR, kenapa REST+JSON, Resource, R4 vs R5, maturity, Profile/Extension/IG (konsep) |
| 0002 | Anatomi resource JSON | Patient, Encounter, Observation; Identifier, Reference, CodeableConcept/Coding; LOINC, SNOMED CT, ICD-10; `meta`, `contained`, `extension` |
| 0003 | FHIR REST API | CRUD, search (modifier, chained, `_include`/`_revinclude`), Bundle `searchset`/`transaction`/`batch`, versioning (`vread`, ETag/`If-Match`), `OperationOutcome`, CapabilityStatement |
| 0004 | JSON massal | Bulk Data `$export` (kick-off → 202 → polling → NDJSON), streaming di Node (`readline`, backpressure, `stream-json`), batas memori `JSON.parse`, presisi `decimal` FHIR di JS |
| 0005 | Keamanan, SMART on FHIR & frontend | OAuth2 + PKCE, scopes v1/v2, EHR launch vs standalone, backend services (client credentials + JWT, terkait bulk), `fhirclient` di React, menampilkan CodeableConcept |
| 0006 | SATUSEHAT + review campuran (seam) | SATUSEHAT (auth, resource inti, profil Indonesia), validasi, mapping data legacy → FHIR; review campuran 0001–0005; bank tanya-jawab; reframe 4 cerita STAR ke health-tech |

## User Stories

1. Sebagai kandidat, saya ingin semua contoh kode memakai TypeScript/Node/React, supaya tidak perlu belajar bahasa baru dan bisa fokus ke FHIR.
2. Sebagai kandidat, saya ingin materi tanpa implementasi (tanpa lab/server), supaya muat dalam 1 hari.
3. Sebagai kandidat, saya ingin bisa menjelaskan FHIR dan Resource dalam < 1 menit, termasuk bedanya dengan HL7 v2.
4. Sebagai kandidat, saya ingin tahu kenapa R4 yang dominan di produksi dan apa yang berubah di R5 secara garis besar.
5. Sebagai kandidat, saya ingin memahami Profile, Extension, dan Implementation Guide secara konsep, supaya bisa menjelaskan kenapa FHIR "dasar" perlu disesuaikan per negara/organisasi.
6. Sebagai kandidat, saya ingin bisa membaca JSON Patient, Encounter, dan Observation dan menjelaskan setiap bagian pentingnya.
7. Sebagai kandidat, saya ingin memahami Identifier vs `id`, Reference, CodeableConcept vs Coding, serta peran LOINC, SNOMED CT, dan ICD-10.
8. Sebagai kandidat, saya ingin bisa menjelaskan interaksi REST FHIR (read, vread, search, create, update, patch, delete, history) dan status HTTP-nya.
9. Sebagai kandidat, saya ingin bisa menyusun search FHIR dengan modifier, chaining, `_include`/`_revinclude`, dan paging, supaya bisa menjawab soal query.
10. Sebagai kandidat, saya ingin bisa membedakan Bundle `transaction` dan `batch`, serta menjelaskan optimistic locking dengan ETag/`If-Match`.
11. Sebagai kandidat, saya ingin tahu `OperationOutcome` dan CapabilityStatement, supaya bisa menjelaskan error handling dan discovery.
12. Sebagai kandidat, saya ingin bisa menjelaskan alur Bulk Data `$export` dan format NDJSON.
13. Sebagai kandidat, saya ingin bisa menjelaskan cara memproses file NDJSON besar di Node dengan streaming dan backpressure, dan kenapa `JSON.parse` satu file besar bermasalah.
14. Sebagai kandidat, saya ingin tahu jebakan angka `decimal` FHIR di JavaScript.
15. Sebagai kandidat, saya ingin bisa menjelaskan SMART on FHIR: OAuth2 + PKCE, scopes, EHR launch vs standalone, dan backend services.
16. Sebagai kandidat, saya ingin tahu cara React app memakai `fhirclient` dan menampilkan CodeableConcept dengan benar.
17. Sebagai kandidat, saya ingin bisa menjelaskan SATUSEHAT dan pendekatan memetakan data legacy ke FHIR.
18. Sebagai kandidat, saya ingin review campuran yang mengacak soal 0001–0005, supaya tahu topik mana yang benar-benar menempel.
19. Sebagai kandidat, saya ingin 4 cerita STAR yang ada di-reframe ke konteks health-tech tanpa membuat cerita baru.
20. Sebagai kandidat, saya ingin dua cheat sheet (anatomi resource + datatype, REST/search/Bundle) untuk dibaca ulang sebelum interview.

## Implementation Decisions

- **Workspace terpisah `fhir/`**, satu mission per workspace sesuai `/teach`. Track .NET di root tidak diubah, kecuali satu tautan ke `fhir/index.html` di `index.html` root.
- **Wajib mengikuti skill `/teach`**: baca `~/.claude/skills/teach/SKILL.md` (skill memakai `disable-model-invocation`), lalu baca `fhir/MISSION.md`, `fhir/NOTES.md`, `fhir/learning-records/`, `fhir/RESOURCES.md`, `fhir/GLOSSARY.md`, dan `assets/README.md`.
- **Sumber primer saja**: hl7.org/fhir/R4 (halaman resource, datatypes, http, search, bundle, terminologies), SMART App Launch IG (hl7.org/fhir/smart-app-launch), Bulk Data Access IG (hl7.org/fhir/uv/bulkdata), dokumentasi Node.js (`stream`, `readline`), README `fhirclient`/`stream-json`, serta dokumentasi resmi SATUSEHAT. Setiap klaim penting diberi kutipan `<sup class="cite">`. Detail SATUSEHAT yang tidak bisa diverifikasi publik ditandai jelas "belum terverifikasi". Sumber baru ditambahkan ke `fhir/RESOURCES.md`.
- **Pola lesson** mengikuti lesson root (contoh: `lessons/0022-index.html`), dengan dua perbedaan: tanpa hands-on/lab, dan path komponen bersama `../../assets/…`. Bank soal di `fhir/assets/questions/NNNN.js` dimuat dengan `../assets/questions/NNNN.js`. Struktur: header + `div.win` berisi satu target pertanyaan interview → konsep dengan contoh JSON/TS pendek → kuis per bagian (`data-bank-lesson`) → latihan lisan (`<details>` + checklist 6 poin) → "Bacaan utama" → `p.ask` → sumber → `nav.lesson-nav`.
- **Durasi per lesson** ±60–75 menit (lebih panjang dari track .NET karena satu hari penuh dibagi 6 lesson), tetap dipecah menjadi bagian-bagian kecil, masing-masing diakhiri kuis.
- **Bank soal**: minimal 8 kuis pilihan ganda + minimal 2 soal lisan per lesson 0001–0005, id `NNNN-…`, topik berlabel dengan prefiks per lesson supaya tidak bentrok di review: `dasar-` (0001), `res-` (0002), `rest-` (0003), `bulk-` (0004), `smart-` (0005), `ss-` (0006). Jumlah kata antaropsi sama, posisi jawaban bervariasi.
- **Padanan JavaScript** ditulis bila membantu (mis. `_include` ↔ `include` di Prisma, Bundle `transaction` ↔ `prisma.$transaction`, ETag/`If-Match` ↔ optimistic concurrency, NDJSON ↔ JSON Lines, SMART ↔ OAuth2 PKCE di SPA).
- **Reference**: `fhir/reference/anatomi-resource.html` (dibuat oleh 0002) dan `fhir/reference/rest-search-bundle.html` (dibuat oleh 0003), format mengikuti `reference/*.html` root dengan stylesheet `../../assets/style.css`.
- **GLOSSARY** `fhir/GLOSSARY.md`: setiap lesson menambahkan istilahnya ke bagian yang sesuai (format GLOSSARY-FORMAT `/teach`).
- **Review 0006** memakai `review.js` apa adanya dengan `data-lessons="0001,0002,0003,0004,0005"` dan memuat bank soal 0001–0005 + 0006. Bagian SATUSEHAT/mapping (±30 menit) adalah materi baru dengan kuis sendiri (topik `ss-`), diikuti review acak, bank tanya-jawab interview, lalu bagian reframe STAR yang membaca `star/draf-star.md` (file itu tidak diubah).
- **Navigasi**: 0001 ← indeks; setiap lesson menautkan sebelum/sesudahnya; 0006 → `fhir/index.html`. Saat lesson selesai, baris `<li>`-nya di `fhir/index.html` diganti dari `segera` ke `tersedia` (pertahankan `seam` di 0006).
- **Alur kerja**: branch `materi-fhir`; lesson 0001–0005 boleh dikerjakan paralel (file bersama yang diubah: `fhir/index.html` satu baris, `fhir/GLOSSARY.md` per bagian, `fhir/RESOURCES.md`, `fhir/NOTES.md` satu baris per lesson); 0006 setelah 0001–0005 selesai.

## Testing Decisions

- **Yang diuji adalah kemampuan menjawab pertanyaan interview FHIR tanpa catatan.** Seam penguasaan hanya review 0006; hanya hasilnya yang boleh menghasilkan learning record "sudah dikuasai".
- **Seam otomatis**: `tests/fhir-track.test.js` (sudah ada) memeriksa semua bank soal `fhir/assets/questions/*.js` (aturan teach, id, label, format lisan, dimuat bersama tanpa bentrok nama) dan setiap lesson `tersedia` di indeks (file ada, komponen dari `../../assets/`, bank soal dimuat, navigasi). Setiap lesson menambah `tests/fhir-questions-NNNN.test.js` kecil yang hanya memeriksa **cakupan topik inti** lesson itu (pola: test cakupan di `tests/questions-0019.test.js`, pakai `forTrack("fhir")` dari `tests/helpers.js`). Review 0006 menambah cek `data-lessons`, `data-mc` = jumlah topik kuis pool, dan urutan script (pola `tests/review-0012.test.js`).
- `node --test` dari root harus hijau. Node ada di `~/.nvm/versions/node/v24.21.0/bin` (tidak ada di PATH default).

## Out of Scope

- Implementasi server/klien FHIR, menjalankan HAPI/Medplum, lab apa pun.
- Menulis profile/IG sendiri (FSH/SUSHI), HL7 v2/CDA mendalam, CDS Hooks, FHIR Subscriptions mendalam.
- Mengubah track .NET + Angular di root (selain tautan di `index.html` root dan helper test yang kompatibel).

## Further Notes

- Kalau waktu kurang: chaining terbalik (`_has`), scopes SMART v1 vs v2 secara detail, dan R5 dipangkas paling dulu.
- Fakta SATUSEHAT berubah cepat; utamakan dokumentasi resmi Kemenkes dan tandai tanggal akses.
