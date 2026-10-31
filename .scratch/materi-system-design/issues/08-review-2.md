# 08: Review 2 (0019)

Status: resolved

**Blocked by:** 04, 06

**What to build:** Lesson review 0019 dengan pool 0008–0011, 0013–0015 (lihat `../spec.md`), memakai `review.js`: `data-mc` = jumlah topik kuis di pool, `data-oral="3"`, aturan main dan instruksi lapor hasil ke agent mengikuti review FHIR (`fhir/lessons/0012-*.html`). Tambahkan kasusnya ke `tests/sysdesign/review.test.js` (buat file ini kalau belum ada).

## Comments

- 2026-10-31: `sysdesign/lessons/0019-review-data-caching.html` dibuat dari review FHIR 0012 (aturan main, lapor hasil ke agent, `Topik lemah System Design 0019`). Pool 0008–0011 + 0013–0015, `data-mc="14"` (data- 8, cache- 6), `data-oral="3"` (7 soal lisan di pool). Entri 0019 diaktifkan di `tests/sysdesign/review.test.js` (prefix `data-`, `cache-`). Index 0019 → `tersedia seam`.
