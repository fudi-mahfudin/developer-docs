# 12: Modul Testing & produksi (0030–0034)

Status: resolved

**Blocked by:** 01

**What to build:** Lesson 0030–0034 sesuai tabel di `../spec.md`:
- HTML di `nodejs/lessons/`
- Bank soal `nodejs/assets/questions/NNNN.js` (≥ 4 mc, ≥ 1 oral; slug topik baru dicatat di `GLOSSARY.md`)
- Test `tests/nodejs/modul-testing-produksi.test.js`

Fakta angka dan perilaku diberi `.cite` ke sumber primer (lihat spec, bagian Keputusan). Perilaku yang bergantung versi diverifikasi di dokumentasi Node v24 atau NestJS terbaru dan diberi label versi. Istilah di luar topik dijelaskan 1–2 kalimat di tempat. Track tidak merujuk ke track lain.

Khusus modul ini: contoh test memakai Jest (sebut sekali bahwa Vitest juga bisa). Konsep caching, rate limiting, queue, dan idempotency hanya dijelaskan 1–2 kalimat; fokusnya pada API Node/NestJS. Ada soal oral "tulis kode" untuk unit test service dengan `PrismaService` yang di-mock (0030).

- [ ] Lesson HTML ±20 menit, satu `win`, minimal satu diagram atau blok kode
- [ ] Bank soal per lesson + `labelTopics`
- [ ] Istilah baru di `GLOSSARY.md`, sumber di `RESOURCES.md`
- [ ] `tests/nodejs/modul-testing-produksi.test.js`; seluruh `tests/` lulus
