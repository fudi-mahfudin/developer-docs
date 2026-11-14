# 02: Modul Runtime (0001–0004)

Status: resolved

**Blocked by:** 01

**What to build:** Lesson 0001–0004 sesuai tabel di `../spec.md`:
- HTML di `nodejs/lessons/`
- Bank soal `nodejs/assets/questions/NNNN.js` (≥ 4 mc, ≥ 1 oral; slug topik baru dicatat di `GLOSSARY.md`)
- Test `tests/nodejs/modul-runtime.test.js`

Fakta angka dan perilaku diberi `.cite` ke sumber primer (lihat spec, bagian Keputusan). Perilaku yang bergantung versi diverifikasi di dokumentasi Node v24 atau NestJS terbaru dan diberi label versi. Istilah di luar topik dijelaskan 1–2 kalimat di tempat. Track tidak merujuk ke track lain.

Khusus modul ini: 0003 memuat latihan tebak urutan output memakai `order.js` (baris output disusun ulang), minimal dua potongan kode. Hindari soal yang urutannya tidak deterministik (mis. `setTimeout(0)` vs `setImmediate` di main module), kecuali soal itu memang menguji pemahaman bahwa urutannya tidak deterministik.

- [ ] Lesson HTML ±20 menit, satu `win`, minimal satu diagram atau blok kode
- [ ] Bank soal per lesson + `labelTopics`
- [ ] Istilah baru di `GLOSSARY.md`, sumber di `RESOURCES.md`
- [ ] `tests/nodejs/modul-runtime.test.js`; seluruh `tests/` lulus
