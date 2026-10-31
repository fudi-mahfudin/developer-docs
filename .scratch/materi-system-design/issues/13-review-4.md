# 13: Review 4 (0035)

Status: resolved

**Blocked by:** 05, 08, 10, 12

**What to build:** Lesson review 0035 dengan pool 0027–0034 + topik lemah Review 1–3 lewat `data-topics` (muat semua bank) (lihat `../spec.md`), memakai `review.js`: `data-mc` = jumlah topik kuis di pool, `data-oral="3"`, aturan main dan instruksi lapor hasil ke agent mengikuti review FHIR (`fhir/lessons/0012-*.html`). Durasi ±25 menit. Tambahkan kasusnya ke `tests/sysdesign/review.test.js` (buat file ini kalau belum ada).

## Comments

- 2026-10-31: `sysdesign/lessons/0035-review-studi-kasus.html` dibuat (model FHIR 0027 + sysdesign 0026): pool 0027–0034, `data-mc="16"` (16 topik `kasus-`), `data-oral="3"`, `data-topics=""`, memuat semua bank sysdesign. Link "Kalau ada topik lemah" menunjuk `../reference/{kerangka-5-langkah,trade-off-komponen,angka-dan-estimasi}.html` (dibuat ticket 14). Entri 0035 di `tests/sysdesign/review.test.js` diaktifkan; index 0035 jadi `tersedia seam`. Catatan: setelah `0036.js` (ticket 14) ada, 0035 wajib menambah `<script src="../assets/questions/0036.js">` sebelum `review.js` (tes allBanks).
