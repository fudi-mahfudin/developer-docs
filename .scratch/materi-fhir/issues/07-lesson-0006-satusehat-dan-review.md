# 07: Lesson 0006: SATUSEHAT + review campuran (seam) + STAR health-tech

**What to build:** `fhir/lessons/0006-satusehat-dan-review.html` + `fhir/assets/questions/0006.js`. Bagian 1 (±30 menit, materi baru + kuis topik `ss-`): SATUSEHAT Kemenkes (tujuan, auth client credentials, resource inti seperti Patient/Practitioner/Organization/Location/Encounter/Condition/Observation, Identifier NIK/IHS, profil/IG Indonesia bila ada), validasi terhadap profile, mapping data legacy → FHIR (tabel → resource, kode lokal → terminologi standar, ConceptMap secara konsep). Bagian 2: review acak `review.js` dari 0001–0005. Bagian 3: bank tanya-jawab interview (soal lisan). Bagian 4: reframe 4 cerita STAR dari `star/draf-star.md` ke konteks health-tech (file itu tidak diubah).

**Blocked by:** 02, 03, 04, 05, 06

**Status:** resolved

- [x] Mengikuti `/teach` dan membaca workspace `fhir/` + `assets/README.md`
- [x] Fakta SATUSEHAT dari dokumentasi resmi; detail yang tidak bisa diverifikasi ditandai "belum terverifikasi" dengan tanggal akses
- [x] Review: `data-lessons="0001,0002,0003,0004,0005"`, `data-mc` = jumlah topik kuis pool, `data-oral` >= 5; script urut bank.js → soal 0001–0006 → review.js
- [x] Kriteria lulus sama dengan seam root (kuis benar + lisan >= 4/6); halaman menjelaskan cara melapor hasil
- [x] `tests/fhir-review-0006.test.js` (pola `review-0012.test.js`); `node --test` hijau
- [x] GLOSSARY bagian Indonesia; RESOURCES dicek lengkap untuk 0001–0006; baris NOTES dengan langkah pencatatan hasil review
- [x] Baris 0006 di `fhir/index.html` menjadi `tersedia seam`; ← 0005, → indeks

## Comments

Dikerjakan 2026-10-26 di branch `materi-fhir`.

- Lesson `fhir/lessons/0006-satusehat-dan-review.html` (4 bagian berurutan) + bank soal `fhir/assets/questions/0006.js` (topik `ss-platform`, `ss-auth`, `ss-prasyarat`, `ss-identifier`, `ss-validasi`, `ss-terminologi`, `ss-mapping`; 14 kuis + 3 lisan).
- Fakta SATUSEHAT dari satusehat.kemkes.go.id/platform/docs (situs statis, bisa dibaca tanpa login) dan SATUSEHAT FHIR R4 IG di Simplifier; fakta FHIR dari hl7.org/fhir/R4 (validation, profiling, `$validate`, conceptmap, `$translate`, ConceptMapEquivalence). Ditandai "belum terverifikasi (diakses 2026-10-26)": ketersediaan `$validate` untuk partner, pemeriksaan `meta.profile` penuh, Coding tambahan ber-system lokal, tipe Bundle/atomik, pembatasan resource per tipe kode akses API.
- Review: `data-lessons="0001,0002,0003,0004,0005"`, `data-mc="37"` (= jumlah topik kuis pool), `data-oral="6"`; script bank.js → questions 0001–0006 → bank-quiz.js/quiz.js → review.js; timer `../../assets/timer.js` untuk bagian 3–4. Kriteria lulus sama dengan seam root; halaman menjelaskan cara melapor hasil.
- Bank tanya-jawab: 6 soal lisan campuran (`<details>` + checklist 6 poin). STAR: tabel reframe 4 tema `star/draf-star.md` (file tidak diubah; masih template kosong, jadi lesson meminta user mengisi dari pengalamannya sendiri).
- Test baru: `tests/fhir-questions-0006.test.js`, `tests/fhir-review-0006.test.js`. `node --test`: 145 pass, 0 fail.
- `fhir/index.html` baris 0006 → `tersedia seam`; GLOSSARY bagian "Indonesia (SATUSEHAT)"; RESOURCES: sumber 0006 + semua URL eksternal yang dikutip di `fhir/lessons/*.html` dan `fhir/reference/*.html` kini tercatat (10 URL lama 0001–0005 yang belum tercatat ikut ditambahkan), plus bagian Gaps; NOTES: satu entri dengan langkah mencatat hasil review 0006. Tidak ada learning record "sudah dikuasai" yang ditulis.
