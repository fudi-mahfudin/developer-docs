# 10: Modul Data & auth (0025–0028)

Status: ready-for-agent

**Blocked by:** 01

**What to build:** Lesson 0025–0028 sesuai tabel di `../spec.md`:
- HTML di `nodejs/lessons/`
- Bank soal `nodejs/assets/questions/NNNN.js` (≥ 4 mc, ≥ 1 oral; slug topik baru dicatat di `GLOSSARY.md`)
- Test `tests/nodejs/modul-data-auth.test.js`

Fakta angka dan perilaku diberi `.cite` ke sumber primer (lihat spec, bagian Keputusan). Perilaku yang bergantung versi diverifikasi di dokumentasi Node v24 atau NestJS terbaru dan diberi label versi. Istilah di luar topik dijelaskan 1–2 kalimat di tempat. Track tidak merujuk ke track lain.

Khusus modul ini: semua contoh data memakai Prisma dengan pola `PrismaService`. TypeORM hanya muncul sebagai bagian perbandingan singkat di 0026. Hashing password mengutip OWASP Password Storage Cheat Sheet, JWT mengutip RFC 7519, dan 401 vs 403 mengutip RFC 9110. Ada soal oral "tulis kode" untuk `RolesGuard` + decorator `@Roles` (0028).

- [ ] Lesson HTML ±20 menit, satu `win`, minimal satu diagram atau blok kode
- [ ] Bank soal per lesson + `labelTopics`
- [ ] Istilah baru di `GLOSSARY.md`, sumber di `RESOURCES.md`
- [ ] `tests/nodejs/modul-data-auth.test.js`; seluruh `tests/` lulus
