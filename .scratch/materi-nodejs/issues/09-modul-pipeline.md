# 09: Modul Pipeline request (0021–0024)

Status: resolved

**Blocked by:** 01

**What to build:** Lesson 0021–0024 sesuai tabel di `../spec.md`:
- HTML di `nodejs/lessons/`
- Bank soal `nodejs/assets/questions/NNNN.js` (≥ 4 mc, ≥ 1 oral; slug topik baru dicatat di `GLOSSARY.md`)
- Test `tests/nodejs/modul-pipeline.test.js`

Fakta angka dan perilaku diberi `.cite` ke sumber primer (lihat spec, bagian Keputusan). Perilaku yang bergantung versi diverifikasi di dokumentasi Node v24 atau NestJS terbaru dan diberi label versi. Istilah di luar topik dijelaskan 1–2 kalimat di tempat. Track tidak merujuk ke track lain.

Khusus modul ini: 0021 memuat latihan susun urutan pipeline dengan `order.js`. Setiap lesson memuat minimal satu `<pre><code>`. Ada soal oral "tulis kode" untuk DTO + validation (0022) dan guard (0023).

- [ ] Lesson HTML ±20 menit, satu `win`, minimal satu diagram atau blok kode
- [ ] Bank soal per lesson + `labelTopics`
- [ ] Istilah baru di `GLOSSARY.md`, sumber di `RESOURCES.md`
- [ ] `tests/nodejs/modul-pipeline.test.js`; seluruh `tests/` lulus
