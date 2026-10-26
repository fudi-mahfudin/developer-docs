# 07: Lesson 0006: SATUSEHAT + review campuran (seam) + STAR health-tech

**What to build:** `fhir/lessons/0006-satusehat-dan-review.html` + `fhir/assets/questions/0006.js`. Bagian 1 (±30 menit, materi baru + kuis topik `ss-`): SATUSEHAT Kemenkes (tujuan, auth client credentials, resource inti seperti Patient/Practitioner/Organization/Location/Encounter/Condition/Observation, Identifier NIK/IHS, profil/IG Indonesia bila ada), validasi terhadap profile, mapping data legacy → FHIR (tabel → resource, kode lokal → terminologi standar, ConceptMap secara konsep). Bagian 2: review acak `review.js` dari 0001–0005. Bagian 3: bank tanya-jawab interview (soal lisan). Bagian 4: reframe 4 cerita STAR dari `star/draf-star.md` ke konteks health-tech (file itu tidak diubah).

**Blocked by:** 02, 03, 04, 05, 06

**Status:** ready-for-agent

- [ ] Mengikuti `/teach` dan membaca workspace `fhir/` + `assets/README.md`
- [ ] Fakta SATUSEHAT dari dokumentasi resmi; detail yang tidak bisa diverifikasi ditandai "belum terverifikasi" dengan tanggal akses
- [ ] Review: `data-lessons="0001,0002,0003,0004,0005"`, `data-mc` = jumlah topik kuis pool, `data-oral` >= 5; script urut bank.js → soal 0001–0006 → review.js
- [ ] Kriteria lulus sama dengan seam root (kuis benar + lisan >= 4/6); halaman menjelaskan cara melapor hasil
- [ ] `tests/fhir-review-0006.test.js` (pola `review-0012.test.js`); `node --test` hijau
- [ ] GLOSSARY bagian Indonesia; RESOURCES dicek lengkap untuk 0001–0006; baris NOTES dengan langkah pencatatan hasil review
- [ ] Baris 0006 di `fhir/index.html` menjadi `tersedia seam`; ← 0005, → indeks

## Comments
