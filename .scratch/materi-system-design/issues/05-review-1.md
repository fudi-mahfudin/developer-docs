# 05: Review 1 (0012)

Status: resolved

**Blocked by:** 02, 03

**What to build:** Lesson review 0012 dengan pool 0001–0007 (lihat `../spec.md`), memakai `review.js`: `data-mc` = jumlah topik kuis di pool, `data-oral="3"`, aturan main dan instruksi lapor hasil ke agent mengikuti review FHIR (`fhir/lessons/0012-*.html`). Tambahkan kasusnya ke `tests/sysdesign/review.test.js` (buat file ini kalau belum ada).

## Comments

- 2026-10-31: Selesai. `sysdesign/lessons/0012-review-fondasi-skalabilitas.html` (pola FHIR 0012): `data-lessons` 0001–0007, `data-mc="14"` (dasar- 8, skala- 6), `data-oral="3"`, aturan main dan bagian "laporkan hasilnya ke agent" dengan path `sysdesign/learning-records/` dan `sysdesign/NOTES.md`; topik lemah masuk ke `data-topics` 0035. Status tersedia (seam) di indeks. `tests/sysdesign/review.test.js` dibuat (port 1:1 dari `tests/fhir/review.test.js`, ditambah cek kicker dan path sysdesign). Array `REVIEWS` sudah berisi baris 0019/0026/0035 yang dikomentari dan dipisah baris kosong, jadi ticket 08/10/13 cukup menghapus `// ` di baris masing-masing (sesuaikan pool/prefix kalau berubah). Guard bank di `tests/sysdesign/track.test.js` sudah ada, tidak diubah.
