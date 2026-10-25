Status: ready-for-agent

# Spec: Materi database — SQL Server, Stored Procedure, dan optimasi untuk interview .NET mid-level

## Problem Statement

Saya (developer TypeScript/Node.js/React) sedang bersiap untuk interview Fullstack Developer .NET 8 + Angular 16 level mid. Ke-18 lesson yang ada sudah mencakup C#, ASP.NET Core, EF Core, testing, dan Angular. Namun database hanya tersentuh lewat EF Core di lesson 0006. Di interview .NET mid-level hampir pasti muncul pertanyaan seperti:

- "Apa beda clustered dan non-clustered index?"
- "Kapan pakai Stored Procedure dibanding query dari aplikasi?"
- "Query ini lambat, bagaimana cara menganalisisnya?"
- "Apa itu deadlock dan bagaimana mencegahnya?"
- "Tulis query untuk 3 Product termahal per Category."

Saya belum punya materi, latihan, maupun titik pengecekan untuk topik-topik ini. Saya juga belum pernah melihat sendiri efek index atau execution plan di SQL Server, sehingga jawaban saya masih hafalan, belum berdasarkan pengalaman.

## Solution

Enam lesson baru disambung setelah 0018, mengikuti pola lesson yang sudah ada, dengan alokasi setengah hari tambahan ("Hari 4"):

| # | Lesson | Jenis |
|---|---|---|
| 0019 | SQL dasar untuk interview: JOIN, GROUP BY/HAVING, subquery vs CTE, `ROW_NUMBER`, plus selipan normalisasi, constraint, dan view | baru |
| 0020 | Stored Procedure: parameter, `OUTPUT`, `TRY/CATCH`, SP vs function vs query dari aplikasi, memanggil SP dari EF Core (`FromSql`/`ExecuteSql`) dan Dapper | baru |
| 0021 | Transaction, isolation level, locking, deadlock | baru |
| 0022 | Index: clustered vs non-clustered, composite index dan urutan kolom, covering index (`INCLUDE`), kapan index merugikan | baru |
| 0023 | Optimasi query: membaca execution plan, SARGable, parameter sniffing, pagination (OFFSET vs keyset), melihat SQL yang dihasilkan EF Core | baru |
| 0024 | Review campuran database | seam |

Setiap lesson berisi ±15 menit konsep + kuis, lalu ±15 menit hands-on: menjalankan skrip T-SQL di container `sql2022` pada database lab terpisah, `ProductCatalogLab`, yang berisi ±100k Product. Dengan data sebanyak itu, efek index dan execution plan benar-benar terlihat. Setiap lesson juga punya 1–2 soal "tulis query sendiri" dengan jawaban tersembunyi, sebagai latihan live coding SQL.

## User Stories

1. Sebagai kandidat, saya ingin materi database tetap terikat pada misi interview .NET mid-level, supaya waktu saya tidak terpakai untuk teori database yang jarang ditanyakan.
2. Sebagai kandidat, saya ingin semua materi memakai SQL Server/T-SQL, supaya sesuai dengan stack di ROADMAP dan dengan perusahaan yang saya lamar.
3. Sebagai kandidat, saya ingin lesson database dinomori lanjut dari 0019, supaya urutan dan test 18 lesson yang ada tidak terganggu.
4. Sebagai kandidat, saya ingin bisa menjelaskan INNER, LEFT, dan RIGHT JOIN dengan contoh Product dan Category, supaya bisa menjawab pertanyaan JOIN klasik dengan yakin.
5. Sebagai kandidat, saya ingin memahami beda WHERE dan HAVING, supaya tidak salah saat memfilter hasil agregasi.
6. Sebagai kandidat, saya ingin bisa membandingkan subquery dan CTE, supaya bisa memilih bentuk query yang paling mudah dibaca.
7. Sebagai kandidat, saya ingin bisa menulis `ROW_NUMBER() OVER (PARTITION BY ...)`, supaya bisa menyelesaikan soal "top N per grup" yang sering muncul di live coding.
8. Sebagai kandidat, saya ingin memahami normalisasi, constraint (PK, FK, UNIQUE, CHECK), dan view secara singkat, supaya bisa menjelaskan kenapa aturan Product (nama unik, Price > 0, Stock ≥ 0) juga dijaga di database.
9. Sebagai kandidat, saya ingin bisa menulis Stored Procedure dengan parameter input dan `OUTPUT`, supaya bisa menjawab dan mendemokan pertanyaan dasar SP.
10. Sebagai kandidat, saya ingin memahami `TRY/CATCH` dan `THROW` di T-SQL, supaya SP saya menangani error dengan benar.
11. Sebagai kandidat, saya ingin bisa menjelaskan kapan memakai SP dibanding query dari aplikasi lewat EF Core, termasuk trade-off-nya (performa, keamanan, testability, versioning), supaya jawaban saya seimbang dan tidak dogmatis.
12. Sebagai kandidat, saya ingin tahu beda Stored Procedure dan function (scalar dan table-valued), supaya bisa menjawab pertanyaan perbandingan yang sering muncul.
13. Sebagai kandidat, saya ingin tahu cara memanggil SP dari EF Core (`FromSql`/`ExecuteSql`) dan dari Dapper, supaya bisa menghubungkan pengetahuan SQL dengan kode .NET.
14. Sebagai kandidat, saya ingin tahu kenapa query dengan parameter mencegah SQL injection, dan kenapa string interpolation di `FromSqlRaw` berbahaya, supaya tidak terjebak pertanyaan keamanan.
15. Sebagai kandidat, saya ingin memahami ACID dan cara memakai transaction di T-SQL maupun di EF Core, supaya bisa menjelaskan cara menjaga konsistensi data.
16. Sebagai kandidat, saya ingin bisa membedakan isolation level (Read Uncommitted, Read Committed, Repeatable Read, Serializable, Snapshot) beserta anomali yang dicegah masing-masing, supaya bisa menjawab pertanyaan isolation level.
17. Sebagai kandidat, saya ingin memahami locking dan blocking, serta penyebab dan cara mencegah deadlock, supaya bisa menjawab pertanyaan concurrency.
18. Sebagai kandidat, saya ingin melihat sendiri blocking terjadi antara dua sesi di lab, supaya pemahaman saya tentang locking tidak sekadar hafalan.
19. Sebagai kandidat, saya ingin bisa menjelaskan clustered vs non-clustered index dengan analogi yang jelas, supaya bisa menjawab pertanyaan index yang paling sering muncul.
20. Sebagai kandidat, saya ingin memahami composite index dan kenapa urutan kolom penting, supaya bisa merancang index untuk query nyata.
21. Sebagai kandidat, saya ingin memahami covering index dan `INCLUDE`, supaya bisa menjelaskan cara menghindari key lookup.
22. Sebagai kandidat, saya ingin tahu kapan index justru merugikan (biaya tulis, terlalu banyak index, kolom dengan selektivitas rendah), supaya jawaban saya tidak berhenti di "tambahkan index saja".
23. Sebagai kandidat, saya ingin melihat sendiri perbedaan execution plan dan logical reads sebelum dan sesudah index dibuat pada 100k baris, supaya punya pengalaman nyata untuk diceritakan.
24. Sebagai kandidat, saya ingin bisa membaca execution plan sederhana (scan vs seek, key lookup, perkiraan vs aktual), supaya bisa menjawab "bagaimana menganalisis query lambat".
25. Sebagai kandidat, saya ingin memahami SARGable query, misalnya kenapa fungsi pada kolom di WHERE membuat index tidak terpakai, supaya bisa mengenali query yang tidak bisa memakai index.
26. Sebagai kandidat, saya ingin memahami parameter sniffing dan cara menanganinya, supaya bisa menjawab pertanyaan optimasi level mid ke atas.
27. Sebagai kandidat, saya ingin bisa membandingkan pagination OFFSET/FETCH dan keyset pagination, supaya bisa menjelaskan kenapa halaman yang jauh menjadi lambat.
28. Sebagai kandidat, saya ingin tahu cara melihat SQL yang dihasilkan EF Core (logging, `ToQueryString`), supaya bisa menghubungkan optimasi SQL dengan kode aplikasi.
29. Sebagai kandidat, saya ingin lesson optimasi merujuk N+1 dan `AsNoTracking` dari 0006 tanpa mengulangnya, supaya waktu tidak terbuang.
30. Sebagai kandidat, saya ingin database lab `ProductCatalogLab` terpisah dari `ProductCatalog`, supaya eksperimen index dan SP tidak bentrok dengan migration mini project.
31. Sebagai kandidat, saya ingin skrip setup lab aman dijalankan ulang (idempotent), supaya saya bisa me-reset lab kapan saja tanpa error.
32. Sebagai kandidat, saya ingin seed ±100k Product dibuat dengan T-SQL murni, supaya tidak perlu tool tambahan selain container `sql2022`.
33. Sebagai kandidat, saya ingin tabel lab mengikuti Entity Product dan Category yang ada (nama unik, Price > 0, Stock ≥ 0, satu Product satu Category), supaya istilah dan aturannya sama dengan mini project.
34. Sebagai kandidat, saya ingin skrip setiap lesson tersedia sebagai file `.sql` yang bisa dijalankan dengan `sqlcmd`, Azure Data Studio, atau VS Code mssql, supaya bisa dijalankan apa adanya.
35. Sebagai kandidat, saya ingin skrip yang sama ditampilkan di lesson dengan tombol copy, supaya tidak perlu bolak-balik antara file dan halaman.
36. Sebagai kandidat, saya ingin setiap lesson punya 1–2 soal "tulis query sendiri" dengan jawaban yang bisa dibuka, supaya bisa melatih live coding SQL.
37. Sebagai kandidat, saya ingin kuis pilihan ganda dan latihan lisan setiap lesson memakai bank soal yang sama dengan lesson lain, supaya soalnya bisa diacak di review 0024.
38. Sebagai kandidat, saya ingin review 0024 mengacak soal dari 0019–0023 ditambah soal EF Core terkait performa dari 0006, supaya tahu topik database mana yang benar-benar menempel.
39. Sebagai kandidat, saya ingin hanya hasil review 0024 yang menghasilkan learning record "sudah dikuasai" untuk topik database, supaya status penguasaan konsisten dengan seam yang lain.
40. Sebagai kandidat, saya ingin istilah database baru masuk GLOSSARY lengkap dengan padanan Node bila relevan, supaya bisa menjembatani pengalaman Node saya.
41. Sebagai kandidat, saya ingin satu reference doc per topik database, supaya punya bahan ulang cepat sebelum interview.
42. Sebagai kandidat, saya ingin MISSION punya kriteria sukses untuk database dan ROADMAP punya blok "Hari 4", supaya rencana belajar saya tetap tercatat utuh.
43. Sebagai kandidat, saya ingin lesson 0018 dan halaman index menautkan lesson 0019, supaya navigasi berlanjut tanpa putus.

## Implementation Decisions

- **Wajib memakai skill `/teach`**, sama seperti spec urutan-lesson. Agent yang mengerjakan spec ini harus memanggil `/teach` sebelum membuat lesson, lalu mengikuti aturannya: membaca MISSION, NOTES, learning records, RESOURCES, GLOSSARY, dan assets dulu; mengambil materi dari sumber terpercaya (Microsoft Learn untuk SQL Server/T-SQL dan EF Core, dokumentasi Dapper), bukan dari ingatan model; serta memperbarui reference doc dan learning record sesuai aturan skill tersebut.
- **Unit kerja** adalah lesson HTML mandiri bernomor 0019–0024 dengan pola yang sama seperti lesson yang ada: satu target pertanyaan interview, stylesheet dan komponen kuis bersama, kuis pilihan ganda + latihan lisan dengan checklist 6 poin di bank soal, sumber dari RESOURCES, istilah dari GLOSSARY, dan navigasi ke lesson sebelum dan sesudahnya.
- **Struktur setiap lesson konten (0019–0023):** konsep (±15 menit) → kuis → bagian **hands-on** (±15 menit) yang menampilkan skrip lesson dengan tombol copy dan langkah menjalankannya → 1–2 **latihan tulis query** dengan jawaban tersembunyi yang tidak dinilai otomatis → latihan lisan.
- **Database lab:** `ProductCatalogLab` di container `sql2022` (connection info sama dengan ROADMAP Hari 0). Database ini sepenuhnya terpisah dari `ProductCatalog` milik EF Core dan tidak bergantung pada mini project yang sudah jadi.
- **Skrip setup lab** dijalankan sekali sebelum 0019 dan bisa dijalankan ulang untuk reset. Isinya: membuat database jika belum ada, membuat ulang tabel Category dan Product dengan constraint sesuai Entity (PK, FK Product→Category, UNIQUE nama Product, CHECK Price > 0, CHECK Stock ≥ 0), lalu seed beberapa Category dan ±100k Product secara set-based dengan T-SQL murni, tanpa loop baris per baris. Distribusi data dibuat tidak merata (misalnya satu Category jauh lebih besar) supaya parameter sniffing di 0023 bisa didemokan.
- **Index awal:** setup hanya membuat clustered index dari primary key. Non-clustered index sengaja tidak dibuat supaya 0022 bisa memperlihatkan kondisi sebelum dan sesudah index ditambahkan.
- **Skrip per lesson** adalah file `.sql` mandiri, satu atau lebih per lesson, yang diasumsikan berjalan setelah setup. Setiap skrip memakai `SET STATISTICS IO, TIME ON` bila relevan supaya logical reads bisa dibandingkan. Skrip 0021 (locking/deadlock) dibagi menjadi bagian "Sesi A" dan "Sesi B" yang dijalankan di dua jendela query.
- **File `.sql` adalah sumber kebenaran.** Lesson menampilkan isi file yang sama persis. Kalau salah satunya diubah, yang lain harus ikut diubah.
- **Integrasi .NET di 0020 dan 0023** hanya berupa potongan kode C# di lesson (EF Core `FromSql`/`ExecuteSql`/`ToQueryString`, Dapper `Query`/`Execute` dengan `CommandType.StoredProcedure`). Tidak ada project .NET baru yang dibuat.
- **Review 0024** memakai komponen review bersama yang sama dengan 0007/0012. Sumber soalnya lesson 0019–0023, ditambah topik performa EF Core dari 0006 (N+1, `AsNoTracking`) lewat atribut topik. Isinya hanya retrieval practice yang diacak, tanpa materi baru.
- **GLOSSARY** mendapat bagian baru "Database (SQL Server)" dengan istilah seperti Stored Procedure, Transaction, Isolation Level, Deadlock, Clustered Index, Non-clustered Index, Covering Index, Execution Plan, SARGable, Parameter Sniffing, dan Keyset Pagination. Padanan Node ditulis bila relevan (misalnya `FromSql` ↔ Prisma `$queryRaw`, Dapper ↔ `pg`/knex).
- **Reference doc:** satu halaman baru per topik lesson konten 0019–0023, mengikuti format reference yang ada. Halaman ulang-sebelum-interview diperbarui dengan ringkasan database.
- **MISSION** mendapat kriteria sukses database: menjelaskan clustered vs non-clustered index, membaca execution plan sederhana, menulis SP dengan `TRY/CATCH` + transaction, menjelaskan isolation level dan deadlock, serta menulis query top-N-per-grup. Batasan 3 hari diperluas dengan setengah hari tambahan.
- **ROADMAP** mendapat blok "Hari 4 (setengah hari): Database" yang memuat langkah menjalankan setup lab dan urutan lesson 0019–0024.
- **Navigasi:** lesson 0018 menautkan 0019, halaman index mencantumkan 0019–0024, dan RESOURCES mendapat sumber resmi SQL Server/T-SQL, EF Core raw SQL, dan Dapper.
- **Alur kerja:** setiap lesson dikerjakan sebagai satu ticket di folder ini, di branch `materi-database`, lalu di-merge ke `main` setelah user review.

## Testing Decisions

- **Yang diuji adalah perilaku yang terlihat, yaitu kemampuan menjawab pertanyaan database di interview tanpa melihat catatan**, sama seperti spec urutan-lesson. Skor kuis tepat setelah membaca bukan bukti penguasaan.
- **Seam penguasaan:** hanya review 0024. Hanya hasil dari 0024 yang boleh menghasilkan learning record "sudah dikuasai" untuk topik database. Kriteria lulusnya sama dengan seam yang ada: soal acak dijawab benar, dan jawaban lisan memenuhi minimal 4 dari 6 poin checklist.
- **Seam otomatis:** suite `node --test` yang sudah ada, tanpa jenis test baru.
  - Setiap lesson konten 0019–0023 mendapat test bank soal dengan pola `questions-0006.test.js`: minimal 8 soal pilihan ganda dan minimal 1 soal lisan, id berawalan nomor lesson, setiap topik punya label, jumlah kata antaropsi sama, posisi jawaban bervariasi, format lisan 6 poin + contoh jawaban, dan topik inti lesson tercakup.
  - Test yang sama juga memeriksa bahwa skrip yang ditampilkan di lesson HTML identik dengan file `.sql`-nya, supaya keduanya tidak menyimpang.
  - Review 0024 mendapat test dengan pola `review-0012.test.js`: sumber lesson 0019–0023, topik 0006 yang disertakan, urutan pemuatan script, dan file soal yang bisa dimuat bersama sebagai browser script tanpa bentrok nama.
  - `order.test.js` (urutan/navigasi lesson) diperluas untuk 0019–0024.
- **Skrip SQL tidak diuji otomatis**, karena suite Node tidak menjalankan SQL Server. Verifikasinya manual: agent menjalankan setup dua kali berturut-turut di `sql2022` (memastikan idempotent, jumlah baris ±100k, constraint aktif), lalu menjalankan setiap skrip lesson dan latihan tulis query, jika container tersedia. Kalau container tidak tersedia, ticket dicatat "belum diverifikasi di SQL Server", bukan dianggap lulus.
- **Contoh yang sudah ada:** `tests/questions-0006.test.js` dan `tests/review-0012.test.js` beserta helper bersama di `tests/helpers.js`.

## Out of Scope

- Engine selain SQL Server (PostgreSQL, MySQL, NoSQL), termasuk catatan perbandingan antarengine.
- Trigger dan cursor secara mendalam. Cukup disebut "kenapa sebaiknya dihindari".
- Administrasi database: backup/restore, replication, high availability, security/role, maintenance index (rebuild/reorganize), dan partitioning.
- Membuat project .NET baru atau mengubah mini project Product Catalog.
- Mengubah urutan atau nomor lesson 0001–0018 dan seam yang sudah ada.
- System design data skala besar (sharding, CQRS, read replica).

## Further Notes

- Total 5 lesson × ±30 menit + review ≈ 3 jam, masih di dalam anggaran 4–6 jam untuk Hari 4. Sisa waktunya untuk mengulang latihan tulis query.
- Kalau waktunya kurang, bagian Snapshot isolation di 0021 dan parameter sniffing di 0023 bisa diringkas paling dulu. Untuk level mid, keduanya jarang ditanyakan mendalam.
- Seed data tidak merata adalah prasyarat untuk demo parameter sniffing di 0023. Jangan diubah menjadi data merata.
- Container `sql2022` berjalan dengan emulasi amd64 di Apple Silicon. Seed 100k baris harus set-based supaya selesai dalam hitungan detik.
