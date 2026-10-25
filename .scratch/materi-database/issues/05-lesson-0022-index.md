# 05: Lesson 0022: Index

**What to build:** Pengguna bisa menjelaskan clustered vs non-clustered index dengan analogi yang jelas, merancang composite index dengan urutan kolom yang benar, menjelaskan covering index (`INCLUDE`) untuk menghindari key lookup, serta menyebut kapan index justru merugikan. Pengguna sudah melihat sendiri perbedaan logical reads dan execution plan sebelum dan sesudah index dibuat pada ±100k Product.

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
- [x] Navigasi dari lesson sebelumnya, ke lesson berikutnya, dan entri di halaman index diperbarui; `order.test.js` mencakup lesson ini
- [x] Topik inti: clustered vs non-clustered, composite index dan urutan kolom, covering index dengan `INCLUDE`, key lookup, kapan index merugikan (biaya tulis, terlalu banyak index, selektivitas rendah)
- [x] Skrip hands-on memakai `SET STATISTICS IO, TIME ON` dan membandingkan query yang sama sebelum dan sesudah index dibuat, lalu menghapus index buatannya di akhir supaya lab kembali ke kondisi setup

## Comments

**Implementer (agent):** Selesai, dengan dua catatan: **belum diverifikasi di SQL Server** (Docker daemon tidak berjalan, container `sql2022` tidak tersedia), dan **tidak ada test lesson** (atas arahan user di tengah pengerjaan: usaha dipindah dari kode/test ke materi interview, jadi checkbox test sengaja tidak dicentang). Bank soal, kesamaan skrip HTML ↔ `.sql`, dan aturan teach sudah dicek sekali lewat fungsi di `tests/helpers.js` (`assertEqualOptionWords`, `assertAnswerPositionsVary`, `assertOralFormat`, `assertScriptsMatchFiles`) tanpa menambah file test.

- `/teach` dibaca dan diikuti langsung dari `SKILL.md`. Sumber: Microsoft Learn (Index architecture and design guide, Clustered and nonclustered indexes described, CREATE INDEX, Showplan operators, SET STATISTICS IO/TIME, Pages and extents), ditambahkan ke RESOURCES dan dikutip di lesson.
- `lessons/0022-index.html`: target "clustered vs non-clustered + index untuk query Product per Category yang lambat + kapan index merugikan"; konsep clustered/non-clustered (analogi buku) → key lookup + tipping point → covering `INCLUDE` → composite + leftmost prefix → biaya index; 5 kuis per topik, hands-on dengan tabel catatan logical reads, 2 latihan tulis query, 2 latihan lisan (checklist 6 poin).
- `assets/questions/0022.js`: 10 mc (2 per topik `idx-clustered`, `idx-key-lookup`, `idx-covering`, `idx-composite`, `idx-cost`; posisi jawaban a–d bervariasi, tidak berulang berturut-turut) + 2 oral.
- `lab/0022-index.sql`: `SET STATISTICS IO, TIME ON`; Category 6 (20 baris) dan Category 2 (±2.500) sebelum index → `IX_Product_CategoryId` (seek + key lookup untuk 6, kemungkinan tetap scan untuk 2) → `IX_Product_CategoryId_Covering` (seek tanpa lookup) → `IX_Product_CategoryId_Price (CategoryId, Price DESC) INCLUDE (Name)` (TOP 10 tanpa Sort; `WHERE Price >= 4900` saja tidak bisa seek) → storage, biaya tulis (UPDATE di-ROLLBACK), usage stats → semua index di-DROP, lab kembali ke PK_Product + UQ_Product_Name.
- Yang perlu dicek saat verifikasi: bagian 2, apakah Category 2 benar tetap Clustered Index Scan (komentar menulis "kemungkinan besar"); latihan A harus 19 baris (rumus seed: Stock = 0 hanya untuk n kelipatan 500, semuanya jatuh di Category 5); bagian 4, query TOP 10 tanpa operator Sort.
- `reference/sql-index.html` (di-link dari lesson) dan baris 0022 di `reference/ulang-sebelum-interview.html`.
- GLOSSARY "Database (SQL Server)": Clustered Index, Non-clustered Index, Composite Index, Covering Index, Key Lookup, Selektivitas, Logical Reads (dengan padanan Node).
- Navigasi: 0022 menautkan `0021-transaction-locking.html` dan `0023-optimasi-query.html` (keduanya belum ada); baris 0022 di `index.html` menjadi `tersedia`. Ticket 0021 harus menautkan `0022-index.html`. `tests/order.test.js` menguji komponen urutan, bukan navigasi (lihat Comments ticket 02), jadi tidak diubah.
- `node --test`: 108 pass, 0 fail.
