# 03: Lesson 0020: Stored Procedure + memanggilnya dari .NET

**What to build:** Pengguna bisa menulis Stored Procedure dengan parameter input, `OUTPUT`, dan `TRY/CATCH`/`THROW` di `ProductCatalogLab`, menjelaskan kapan memakai SP dibanding query dari aplikasi (trade-off performa, keamanan, testability, versioning), membedakan SP dan function (scalar dan table-valued), serta menunjukkan cara memanggil SP dari EF Core (`FromSql`/`ExecuteSql`) dan Dapper tanpa membuka celah SQL injection.

**Blocked by:** 02

**Status:** ready-for-agent

- [ ] Agent memanggil skill `/teach` sebelum mulai (atau membaca dan mengikuti `SKILL.md`-nya langsung kalau skill tidak bisa dipanggil), lalu membaca MISSION, NOTES, learning records, RESOURCES, GLOSSARY, dan assets
- [ ] Materi diambil dari sumber terpercaya (Microsoft Learn untuk SQL Server/T-SQL dan EF Core, dokumentasi Dapper), sumber baru ditambahkan ke RESOURCES, dan setiap klaim penting diberi kutipan
- [ ] Lesson punya satu target berupa pertanyaan interview: ±15 menit konsep + kuis, lalu ±15 menit hands-on
- [ ] Kuis didaftarkan ke bank soal bersama (minimal 8 pilihan ganda + minimal 1 lisan, id berawalan nomor lesson, topik berlabel); setiap pilihan jawaban punya jumlah kata yang sama dan posisi jawaban benar bervariasi
- [ ] Latihan lisan punya jawaban contoh dan checklist 6 poin
- [ ] Bagian hands-on menampilkan skrip lesson lewat komponen blok skrip bersama (tombol copy); file `.sql` adalah sumber kebenaran dan isinya identik dengan yang tampil di HTML
- [ ] Ada 1–2 latihan "tulis query sendiri" dengan jawaban tersembunyi (komponen bersama, tidak dinilai otomatis)
- [ ] Semua skrip dan jawaban latihan dijalankan di `sql2022` pada `ProductCatalogLab` setelah setup; kalau container tidak tersedia, ticket dicatat "belum diverifikasi di SQL Server" di Comments
- [ ] Test bank soal lesson dibuat mengikuti pola `questions-0006.test.js`, termasuk cek kesamaan skrip HTML ↔ `.sql` dan cakupan topik inti; `node --test` hijau
- [ ] Reference doc topik ini dibuat dan di-link dari lesson
- [ ] Istilah baru ditambahkan ke bagian "Database (SQL Server)" di GLOSSARY, dengan padanan Node bila relevan
- [ ] Navigasi dari lesson sebelumnya, ke lesson berikutnya, dan entri di halaman index diperbarui; `order.test.js` mencakup lesson ini
- [ ] Topik inti: parameter dan `OUTPUT`, `TRY/CATCH` + `THROW`, SP vs function, SP vs query dari aplikasi, EF Core `FromSql`/`ExecuteSql`, Dapper dengan `CommandType.StoredProcedure`, dan bahaya string interpolation di `FromSqlRaw`
- [ ] Potongan kode C# hanya ditampilkan di lesson; tidak ada project .NET baru
- [ ] Latihan tulis query mencakup `usp_AdjustStock` yang menolak Stock negatif
