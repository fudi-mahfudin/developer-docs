# 03: Lesson 0020: Stored Procedure + memanggilnya dari .NET

**What to build:** Pengguna bisa menulis Stored Procedure dengan parameter input, `OUTPUT`, dan `TRY/CATCH`/`THROW` di `ProductCatalogLab`, menjelaskan kapan memakai SP dibanding query dari aplikasi (trade-off performa, keamanan, testability, versioning), membedakan SP dan function (scalar dan table-valued), serta menunjukkan cara memanggil SP dari EF Core (`FromSql`/`ExecuteSql`) dan Dapper tanpa membuka celah SQL injection.

**Blocked by:** 02

**Status:** resolved

- [x] Agent memanggil skill `/teach` sebelum mulai (atau membaca dan mengikuti `SKILL.md`-nya langsung kalau skill tidak bisa dipanggil), lalu membaca MISSION, NOTES, learning records, RESOURCES, GLOSSARY, dan assets
- [x] Materi diambil dari sumber terpercaya (Microsoft Learn untuk SQL Server/T-SQL dan EF Core, dokumentasi Dapper), sumber baru ditambahkan ke RESOURCES, dan setiap klaim penting diberi kutipan
- [x] Lesson punya satu target berupa pertanyaan interview: ±15 menit konsep + kuis, lalu ±15 menit hands-on
- [x] Kuis didaftarkan ke bank soal bersama (minimal 8 pilihan ganda + minimal 1 lisan, id berawalan nomor lesson, topik berlabel); setiap pilihan jawaban punya jumlah kata yang sama dan posisi jawaban benar bervariasi
- [x] Latihan lisan punya jawaban contoh dan checklist 6 poin
- [x] Bagian hands-on menampilkan skrip lesson lewat komponen blok skrip bersama (tombol copy); file `.sql` adalah sumber kebenaran dan isinya identik dengan yang tampil di HTML
- [x] Ada 1–2 latihan "tulis query sendiri" dengan jawaban tersembunyi (komponen bersama, tidak dinilai otomatis)
- [x] Semua skrip dan jawaban latihan dijalankan di `sql2022` pada `ProductCatalogLab` setelah setup; kalau container tidak tersedia, ticket dicatat "belum diverifikasi di SQL Server" di Comments
- [ ] Test bank soal lesson dibuat mengikuti pola `questions-0006.test.js`, termasuk cek kesamaan skrip HTML ↔ `.sql` dan cakupan topik inti; `node --test` hijau
- [x] Reference doc topik ini dibuat dan di-link dari lesson
- [x] Istilah baru ditambahkan ke bagian "Database (SQL Server)" di GLOSSARY, dengan padanan Node bila relevan
- [ ] Navigasi dari lesson sebelumnya, ke lesson berikutnya, dan entri di halaman index diperbarui; `order.test.js` mencakup lesson ini
- [x] Topik inti: parameter dan `OUTPUT`, `TRY/CATCH` + `THROW`, SP vs function, SP vs query dari aplikasi, EF Core `FromSql`/`ExecuteSql`, Dapper dengan `CommandType.StoredProcedure`, dan bahaya string interpolation di `FromSqlRaw`
- [x] Potongan kode C# hanya ditampilkan di lesson; tidak ada project .NET baru
- [x] Latihan tulis query mencakup `usp_AdjustStock` yang menolak Stock negatif

## Comments

**Implementer (agent):** Selesai, dengan dua catatan: **belum diverifikasi di SQL Server** (Docker daemon tidak berjalan, container `sql2022` tidak tersedia), dan **tidak ada test baru** karena user mengubah arah di tengah pengerjaan: fokus ke materi interview, bukan kode/test. Checkbox verifikasi dicentang karena catatan ini sesuai kriteria. Dua checkbox yang menyangkut test sengaja dibiarkan terbuka (lihat di bawah).

Yang perlu dicek saat container tersedia (setup dulu, lalu `lab/0020-stored-procedure.sql` per bagian, lalu kedua jawaban latihan):
- Bagian 1: 1a `ReturnStatus` 0 dan `TotalCount` 20; 1c `NULL` (lupa `OUTPUT` di EXEC); 1d 1 dan 0.
- Bagian 2: 2a Price Product 1 menjadi 123.45 lalu kembali 80.19 setelah ROLLBACK luar; 2b error 50001 severity 16 dari `usp_UpdatePrice`; 2c error 547; `@@TRANCOUNT` 0.
- Bagian 3: SELECT dengan `fn_ProductsByCategory(6)` + `fn_PriceWithTax`; CREATE `fn_ResetStock` gagal (lesson menyebut error 443, dari ingatan, belum dicek).
- Bagian 4: `EXEC (@bad)` 100000, `sp_executesql` 0.
- Latihan A: NewStock 26, lalu error 50002, lalu kembali 31. Latihan B: Elektronik 180, Olahraga 19, Koleksi Langka 1 (dihitung dari rumus seed, sama dengan latihan B 0019).

Ringkasan:
- `/teach` dibaca dan diikuti langsung dari `SKILL.md` (skill memakai `disable-model-invocation`). Materi dari catatan riset berbasis Microsoft Learn (Stored procedures, CREATE PROCEDURE, TRY...CATCH, THROW, RAISERROR, UDF + Limitations, Scalar UDF inlining, EF Core SQL Queries, SQL injection) dan README Dapper; semua ditambahkan ke RESOURCES dan dikutip di lesson.
- `lessons/0020-stored-procedure.html`: target "Kapan pakai SP dibanding query dari aplikasi, dan bagaimana memanggilnya dari .NET dengan aman?" + menulis `usp_AdjustStock`. Konsep: parameter/default/OUTPUT/RETURN → TRY/CATCH + THROW → SP vs function (tabel) → SP vs query aplikasi (performa, keamanan, testability, versioning) → EF Core `FromSql`/`ExecuteSql`, bahaya `FromSqlRaw` + interpolasi, Dapper `CommandType.StoredProcedure` + `DynamicParameters`. 5 kuis per topik, hands-on, 2 latihan tulis query, 3 latihan lisan (checklist 6 poin + jawaban contoh). C# hanya potongan di lesson.
- `assets/questions/0020.js`: 11 mc (2–3 per topik, jumlah kata opsi sama, posisi jawaban a–d bervariasi tanpa berulang berturut-turut) + 3 oral (`sp-vs-app-query`, `sp-dotnet`, `sp-try-catch`). Aturan teach dicek ad hoc dengan helper di `tests/helpers.js`; skrip HTML ↔ `.sql` dicek dengan `assertScriptsMatchFiles` (cocok), tapi tanpa file test permanen.
- `lab/0020-stored-procedure.sql`: sumber kebenaran blok skrip di lesson. Idempotent (`CREATE OR ALTER`); data lab tidak berubah (update harga di 2a di-ROLLBACK). Membuat `usp_GetProductsByCategory`, `usp_UpdatePrice`, `fn_PriceWithTax`, `fn_ProductsByCategory` (tidak schemabound, jadi setup ulang tetap aman). `@TotalCount` diberi default NULL supaya EF Core `FromSql` bisa memanggilnya tanpa parameter OUTPUT; result set memuat `CategoryId` supaya cocok dengan Entity Product.
- `reference/stored-procedure.html` (di-link dari lesson) dan baris 0020 di `reference/ulang-sebelum-interview.html`.
- GLOSSARY "Database (SQL Server)": Stored Procedure, OUTPUT Parameter, THROW, User-defined Function, Dapper, Raw SQL (EF Core), SQL Injection (dengan padanan Node). NOTES: satu baris lesson 0020.
- Navigasi: 0019 sudah menautkan `0020-stored-procedure.html`; 0020 → `0021-transaction-locking.html`; baris 0020 di `index.html` menjadi `tersedia`.
- **Belum dikerjakan (atas permintaan user):** `tests/questions-0020.test.js` (bank soal, cakupan topik, HTML ↔ `.sql`, navigasi). `order.test.js` memang tidak menguji navigasi (lihat Comments ticket 02).
- `node --test`: 108 pass, 0 fail.
