# 02: Lesson 0001–0005: fondasi web, Next.js, Express, SQL, CRUD end-to-end

Status: ready-for-agent
Blocked by: 01

**What to build:** Lesson 0001–0005 sesuai tabel "Urutan lesson" dan "Format lesson" di `../spec.md`, serta reference `fullstack/reference/pertanyaan-sql.html` (±30 pertanyaan dengan jawaban langsung tampil). Tanpa kuis atau `<details>`.
- Satu contoh berjalan: skema inventaris aset (aset, kategori, karyawan, peminjaman). Definisikan skema ini di 0003 dan pakai ulang di 0004, 0005, dan reference SQL.
- 0003/0004: blok "Pertanyaan interview" (pertanyaan + jawaban) + 1–2 contoh "tulis query" beserta query jawaban dan penjelasannya. 0004 memuat kotak "Beda di MySQL".
- 0005: alur `.flow` skema → migrasi → API → UI → test, dengan potongan kode nyata di setiap langkah dan auth/keamanan disisipkan di langkah yang relevan. Ditutup dengan contoh jawaban lisan ±3 menit untuk pertanyaan "jelaskan langkah membuat fitur CRUD".
- Perilaku yang bergantung versi (caching Next.js, async error Express 5, dan sejenisnya) diverifikasi di dokumentasi resmi, bukan dari ingatan.
- Tambahkan bagian 0001–0005 di `tests/fullstack/lessons.test.js`.

- [ ] 0001, 0002, 0003, 0004, 0005
- [ ] `reference/pertanyaan-sql.html`
- [ ] Test hijau
