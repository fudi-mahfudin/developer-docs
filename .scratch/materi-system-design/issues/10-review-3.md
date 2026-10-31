# 10: Review 3 (0026)

Status: resolved

**Blocked by:** 07, 09

**What to build:** Lesson review 0026 dengan pool 0016–0018, 0020–0025 (lihat `../spec.md`), memakai `review.js`: `data-mc` = jumlah topik kuis di pool, `data-oral="3"`, aturan main dan instruksi lapor hasil ke agent mengikuti review FHIR (`fhir/lessons/0012-*.html`). Tambahkan kasusnya ke `tests/sysdesign/review.test.js` (buat file ini kalau belum ada).

## Comments

- 2026-10-31: `sysdesign/lessons/0026-review-asinkron-reliabilitas.html` dibuat dari review 0019 (aturan main FHIR 0012, lapor hasil ke agent, `Topik lemah System Design 0026`). Pool 0016–0018 + 0020–0025, `data-mc="18"` (async- 6, rel- 12), `data-oral="3"` (9 soal lisan di pool). Entri 0026 diaktifkan di `tests/sysdesign/review.test.js` (prefix `async-`, `rel-`). Index 0026 → `tersedia seam`.
