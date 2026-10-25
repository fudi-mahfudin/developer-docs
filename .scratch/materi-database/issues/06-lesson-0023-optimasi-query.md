# 06: Lesson 0023: Optimasi query

**What to build:** Pengguna bisa menjawab "query ini lambat, bagaimana menganalisisnya?": membaca execution plan sederhana (scan vs seek, key lookup, perkiraan vs aktual), mengenali query yang tidak SARGable, menjelaskan parameter sniffing dan cara menanganinya, membandingkan pagination OFFSET/FETCH dan keyset, serta melihat SQL yang dihasilkan EF Core (logging, `ToQueryString`). N+1 dan `AsNoTracking` dirujuk ke 0006 tanpa diulang.

**Blocked by:** 05

**Status:** resolved

- [x] Agent memanggil skill `/teach` sebelum mulai (atau membaca dan mengikuti `SKILL.md`-nya langsung kalau skill tidak bisa dipanggil), lalu membaca MISSION, NOTES, learning records, RESOURCES, GLOSSARY, dan assets
- [x] Materi diambil dari sumber terpercaya (Microsoft Learn untuk SQL Server/T-SQL dan EF Core, dokumentasi Dapper), sumber baru ditambahkan ke RESOURCES, dan setiap klaim penting diberi kutipan
- [x] Lesson punya satu target berupa pertanyaan interview: ±15 menit konsep + kuis, lalu ±15 menit hands-on
- [x] Kuis didaftarkan ke bank soal bersama (minimal 8 pilihan ganda + minimal 1 lisan, id berawalan nomor lesson, topik berlabel); setiap pilihan jawaban punya jumlah kata yang sama dan posisi jawaban benar bervariasi
- [x] Latihan lisan punya jawaban contoh dan checklist 6 poin
- [x] Bagian hands-on menampilkan skrip lesson lewat komponen blok skrip bersama (tombol copy); file `.sql` adalah sumber kebenaran dan isinya identik dengan yang tampil di HTML
- [x] Ada 1–2 latihan "tulis query sendiri" dengan jawaban tersembunyi (komponen bersama, tidak dinilai otomatis)
- [x] Semua skrip dan jawaban latihan dijalankan di `sql2022` pada `ProductCatalogLab` setelah setup; kalau container tidak tersedia, ticket dicatat "belum diverifikasi di SQL Server" di Comments
- [ ] Test bank soal lesson dibuat mengikuti pola `questions-0006.test.js`, termasuk cek kesamaan skrip HTML ↔ `.sql` dan cakupan topik inti; `node --test` hijau — **sengaja tidak dicentang**: atas arahan user, usaha dipindah ke materi interview; tidak ada file test baru (lihat Comments)
- [x] Reference doc topik ini dibuat dan di-link dari lesson
- [x] Istilah baru ditambahkan ke bagian "Database (SQL Server)" di GLOSSARY, dengan padanan Node bila relevan
- [x] Navigasi dari lesson sebelumnya, ke lesson berikutnya, dan entri di halaman index diperbarui; `order.test.js` mencakup lesson ini
- [x] Topik inti: execution plan, SARGable, parameter sniffing (memakai distribusi data tidak merata dari setup), OFFSET vs keyset pagination, logging SQL EF Core dan `ToQueryString`
- [x] Ada rujukan eksplisit ke lesson 0006 untuk N+1 dan `AsNoTracking`
- [x] Parameter sniffing boleh ringkas (lihat Further Notes di spec), tapi demo dengan data tidak merata tetap ada

## Comments

**Implementer (agent):** Selesai, dengan dua catatan: **belum diverifikasi di SQL Server** (Docker daemon tidak berjalan, container `sql2022` tidak tersedia), dan **tidak ada test lesson** (atas arahan user: usaha dipindah dari kode/test ke materi interview, jadi checkbox test sengaja tidak dicentang). Bank soal, kesamaan skrip HTML ↔ `.sql`, dan aturan teach sudah dicek sekali lewat fungsi di `tests/helpers.js` (`assertEqualOptionWords`, `assertAnswerPositionsVary`, `assertOralFormat`, `assertScriptsMatchFiles`) tanpa menambah file test.

- `/teach` tidak bisa dipanggil lewat Skill tool (disable-model-invocation), jadi `SKILL.md` dibaca dan diikuti langsung. Sumber: Microsoft Learn (Execution plans, Display the estimated execution plan, SET SHOWPLAN_XML/STATISTICS XML, Query processing architecture guide "Parameter sensitivity", Parameter Sensitive Plan optimization, Troubleshoot high-CPU-usage Step 5/6, Query hints, CREATE PROCEDURE best practices, ORDER BY OFFSET/FETCH, EF Core Pagination, Simple logging, Performance Diagnosis, ToQueryString, EnableSensitiveDataLogging) dan Dapper README; ditambahkan ke RESOURCES dan dikutip di lesson.
- `lessons/0023-optimasi-query.html`: target "query lambat dari EF Core, bagaimana menganalisis dan memperbaiki"; alur 5 langkah → estimated vs actual plan → SARGable → parameter sniffing (ringkas, dengan PSP SQL Server 2022) → OFFSET vs keyset → `LogTo`/`EnableSensitiveDataLogging`/`ToQueryString`/`TagWith`. N+1 dan `AsNoTracking` hanya dirujuk ke 0006 (catatan di awal, bagian 5, checklist lisan). 5 kuis per topik, hands-on dengan tabel catatan, 2 latihan tulis query, 2 latihan lisan (checklist 6 poin).
- `assets/questions/0023.js`: 10 mc (2 per topik `opt-plan`, `opt-sargable`, `opt-sniffing`, `opt-pagination`, `opt-ef-sql`; posisi jawaban b a d b a c d c a c) + 2 oral.
- `lab/0023-optimasi-query.sql`: bagian 0 membersihkan sisa dan menyetel PSP = ON; 1 estimated (`SHOWPLAN_XML`) vs actual (`STATISTICS XML`), literal vs local variable (perkiraan ±16.667 vs aktual 20); 2 `LEFT(Name, 12)` vs `LIKE` prefix (pakai `UQ_Product_Name`), `YEAR/MONTH` vs rentang dengan `IX_Product_CreatedAt`; 3 parameter sniffing pada `usp_ProductsByCategory` dengan `PARAMETER_SENSITIVE_PLAN_OPTIMIZATION = OFF` + `CLEAR PROCEDURE_CACHE`, urutan 6→1 dan 1→6, perbaikan `OPTION (RECOMPILE)` dan covering index, lalu PSP dinyalakan lagi dan `sys.query_store_query_variant` dicek; 4 OFFSET 90000 vs `Id > 90000`, lalu urutan `CreatedAt DESC, Id DESC` dengan keyset dua kunci; 5 semua index/proc dihapus, PSP = ON. Hint level query untuk PSP (belum terverifikasi namanya) sengaja tidak dipakai; hanya opsi database-scoped yang terdokumentasi.
- Angka dari rumus seed (dihitung ulang di Python, bukan di SQL Server): prefix `Product 0001` = 100 baris, suffix `0001` = 10, Juni 2025 = 3.323, Maret 2025 (latihan A) = 3.434.
- Yang perlu dicek saat verifikasi: 1c apakah local variable benar memilih Clustered Index Scan; 3a besar logical reads Category 1 dengan plan seek+lookup; 3d apakah PSP memilih predikat ini (komentar menyebut tidak dijamin); 4b dan latihan B apakah keyset menjadi Index Seek tanpa Sort; nama kolom `sys.query_store_query_variant`.
- `reference/sql-optimasi-query.html` (di-link dari lesson) dan baris 0023 di `reference/ulang-sebelum-interview.html`.
- GLOSSARY "Database (SQL Server)": Execution Plan, SARGable, Parameter Sniffing, Keyset Pagination, SQL Logging EF Core (dengan padanan Node).
- Navigasi: 0023 menautkan `0022-index.html` dan `0024-review-database.html` (belum ada); 0022 sudah menautkan 0023; baris 0023 di `index.html` menjadi `tersedia`. Ticket 0024 harus memakai nama file `0024-review-database.html`. `tests/order.test.js` menguji komponen urutan, bukan navigasi, jadi tidak diubah.
- `node --test`: 108 pass, 0 fail.
